mod lsp;
mod process;
mod project;

use anyhow::{Context, Result, anyhow, bail};
use axum::{
    Json, Router,
    body::{Body, Bytes},
    extract::{DefaultBodyLimit, Path, Request, State},
    http::{HeaderValue, Method, StatusCode, header},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use clap::Parser;
use serde::Deserialize;
use serde_json::{Value, json};
use std::{
    collections::HashMap,
    net::{Ipv4Addr, SocketAddr},
    sync::{Arc, Mutex, atomic::Ordering},
    time::Duration,
};
use tokio::sync::{Mutex as AsyncMutex, Semaphore, mpsc};
use tokio_stream::{StreamExt, wrappers::ReceiverStream};
use tokio_util::sync::CancellationToken;
use url::Url;

#[derive(Parser)]
#[command(version, about = "Rust Path 本机增强服务")]
struct Options {
    #[arg(long, env = "PORT", default_value_t = 3000)]
    port: u16,
    #[arg(long = "origin", env = "ALLOWED_ORIGINS", value_delimiter = ',')]
    origins: Vec<String>,
    #[arg(long)]
    check: bool,
}

struct App {
    capabilities: Value,
    origins: Vec<HeaderValue>,
    shutdown: CancellationToken,
    runs: Mutex<HashMap<String, Arc<RunControl>>>,
    slots: Arc<Semaphore>,
    sessions: AsyncMutex<HashMap<String, Arc<lsp::Session>>>,
}

struct RunControl {
    cancel: CancellationToken,
    done: CancellationToken,
}

struct RunGuard {
    app: Arc<App>,
    id: String,
    control: Arc<RunControl>,
}

impl Drop for RunGuard {
    fn drop(&mut self) {
        self.control.cancel.cancel();
        self.app
            .runs
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .remove(&self.id);
        self.control.done.cancel();
    }
}

struct ApiError(anyhow::Error);

impl From<anyhow::Error> for ApiError {
    fn from(error: anyhow::Error) -> Self {
        Self(error)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":format!("{:#}", self.0)})),
        )
            .into_response()
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RunBody {
    code: String,
    #[serde(default = "default_mode")]
    mode: String,
    #[serde(default)]
    dependencies: Vec<String>,
    request_id: Option<String>,
    #[serde(default)]
    stream: bool,
}

fn default_mode() -> String {
    "run".into()
}

async fn tool_version(tool: &str) -> Result<String> {
    let output = tokio::time::timeout(
        Duration::from_secs(15),
        process::command(tool).arg("--version").output(),
    )
    .await??;
    if !output.status.success() {
        bail!("{tool} 不可用：{}", String::from_utf8_lossy(&output.stderr));
    }
    Ok(String::from_utf8_lossy(&output.stdout).trim().to_owned())
}

async fn check_tools() -> Result<Value> {
    let mut versions = HashMap::new();
    let mut missing = Vec::new();
    for tool in ["rustc", "cargo", "rust-analyzer"] {
        match tool_version(tool).await {
            Ok(version) => {
                println!("  ✓ {version}");
                versions.insert(tool, version);
            }
            Err(error) => missing.push(format!("{tool}: {error}")),
        }
    }
    if !missing.is_empty() {
        bail!(
            "Rust 工具链检查失败：\n{}\n通过 https://rustup.rs/ 安装 Rust\n安装语言服务与标准库源码：rustup component add rust-analyzer rust-src",
            missing.join("\n")
        );
    }
    let sysroot = process::command("rustc")
        .args(["--print", "sysroot"])
        .output()
        .await?;
    let source = std::path::PathBuf::from(String::from_utf8_lossy(&sysroot.stdout).trim())
        .join("lib/rustlib/src/rust/library/Cargo.toml");
    if !sysroot.status.success() || !source.is_file() {
        bail!("缺少当前 Rust 工具链的标准库源码，请执行：rustup component add rust-src");
    }
    Ok(
        json!({"native":true,"rustc":versions.get("rustc"),"cargo":versions.get("cargo"),"analyzer":versions.get("rust-analyzer"),"dependencies":project::DEPENDENCIES.iter().map(|(name,_)| *name).collect::<Vec<_>>()}),
    )
}

fn router(app: Arc<App>) -> Router {
    Router::new()
        .route("/", get(|| async { Json(json!({"service":"Rust Path", "status":"ready", "capabilities":"/api/capabilities"})) }))
        .route("/api/capabilities", get(capabilities).post(capabilities))
        .route("/api/run", post(run))
        .route("/api/stop", post(stop))
        .route("/api/lsp/{method}", post(language))
        .layer(DefaultBodyLimit::max(150_000))
        .layer(middleware::from_fn_with_state(app.clone(), access))
        .with_state(app)
}

async fn access(State(app): State<Arc<App>>, request: Request, next: Next) -> Response {
    let host = request
        .headers()
        .get(header::HOST)
        .and_then(|value| value.to_str().ok())
        .unwrap_or_default();
    let Ok(host_url) = Url::parse(&format!("http://{host}")) else {
        return StatusCode::FORBIDDEN.into_response();
    };
    if !matches!(
        host_url.host_str(),
        Some("localhost" | "127.0.0.1" | "[::1]")
    ) {
        return (StatusCode::FORBIDDEN, "仅支持本机学习使用").into_response();
    }
    let origin = request.headers().get(header::ORIGIN).cloned();
    let cross_origin = origin.as_ref().is_some_and(|origin| {
        let Ok(value) = origin.to_str() else {
            return true;
        };
        let Ok(url) = Url::parse(value) else {
            return true;
        };
        !matches!(url.scheme(), "http" | "https")
            || url.host_str() != host_url.host_str()
            || url.port_or_known_default() != host_url.port_or_known_default()
    });
    if cross_origin
        && !origin
            .as_ref()
            .is_some_and(|value| app.origins.contains(value))
    {
        return (StatusCode::FORBIDDEN, "Origin rejected").into_response();
    }
    let preflight = request.method() == Method::OPTIONS;
    let private_network = request
        .headers()
        .get("access-control-request-private-network")
        .is_some_and(|value| value == "true");
    let mut response = if preflight && cross_origin {
        StatusCode::NO_CONTENT.into_response()
    } else {
        next.run(request).await
    };
    if cross_origin {
        if let Some(origin) = origin {
            response
                .headers_mut()
                .insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, origin);
        }
        response
            .headers_mut()
            .insert(header::VARY, HeaderValue::from_static("Origin"));
        if preflight {
            response.headers_mut().insert(
                header::ACCESS_CONTROL_ALLOW_METHODS,
                HeaderValue::from_static("GET, POST"),
            );
            response.headers_mut().insert(
                header::ACCESS_CONTROL_ALLOW_HEADERS,
                HeaderValue::from_static("Content-Type"),
            );
            if private_network {
                response.headers_mut().insert(
                    "access-control-allow-private-network",
                    HeaderValue::from_static("true"),
                );
            }
        }
    }
    response
}

async fn capabilities(State(app): State<Arc<App>>) -> Json<Value> {
    Json(app.capabilities.clone())
}

async fn run(State(app): State<Arc<App>>, Json(body): Json<RunBody>) -> Result<Response, ApiError> {
    if app.shutdown.is_cancelled() {
        return Err(anyhow!("服务正在关闭").into());
    }
    project::validate_code(&body.code)?;
    project::manifest(&body.dependencies)?;
    if !["run", "check", "build", "test"].contains(&body.mode.as_str()) {
        return Err(anyhow!("不支持的 Cargo 命令").into());
    }
    let permit = app
        .slots
        .clone()
        .try_acquire_owned()
        .map_err(|_| anyhow!("已有两个 Cargo 任务运行，请稍后重试"))?;
    let id = body
        .request_id
        .clone()
        .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let control = Arc::new(RunControl {
        cancel: app.shutdown.child_token(),
        done: CancellationToken::new(),
    });
    {
        let mut runs = app.runs.lock().unwrap_or_else(|error| error.into_inner());
        if runs.contains_key(&id) {
            return Err(anyhow!("requestId 已被使用").into());
        }
        runs.insert(id.clone(), control.clone());
    }
    let guard = RunGuard { app, id, control };
    let stream = body.stream;
    if stream {
        let (tx, rx) = mpsc::channel(64);
        tokio::spawn(async move {
            let _permit = permit;
            let result = run_body(body, &guard.control.cancel, Some(tx.clone())).await;
            let message = match result {
                Ok(result) => {
                    let mut value = serde_json::to_value(result).unwrap_or_default();
                    value["type"] = json!("result");
                    value
                }
                Err(error) => json!({"type":"error","message":format!("{error:#}")}),
            };
            let _ = tokio::time::timeout(
                Duration::from_secs(5),
                tx.send(Bytes::from(format!("{message}\n"))),
            )
            .await;
            drop(guard);
        });
        let body =
            Body::from_stream(ReceiverStream::new(rx).map(Ok::<_, std::convert::Infallible>));
        return Ok((
            [
                (header::CONTENT_TYPE, "application/x-ndjson; charset=utf-8"),
                (header::CACHE_CONTROL, "no-store"),
                (
                    axum::http::HeaderName::from_static("x-accel-buffering"),
                    "no",
                ),
            ],
            body,
        )
            .into_response());
    }
    let result = run_body(body, &guard.control.cancel, None).await?;
    drop(permit);
    drop(guard);
    Ok(Json(result).into_response())
}

async fn run_body(
    body: RunBody,
    cancel: &CancellationToken,
    events: Option<process::Events>,
) -> Result<process::RunResult> {
    let project = project::Project::create(&body.code, &body.dependencies).await?;
    if cancel.is_cancelled() {
        bail!("执行已停止");
    }
    let args = if body.stream {
        vec![body.mode.as_str(), "--color=always"]
    } else {
        vec![body.mode.as_str(), "--quiet", "--color=never"]
    };
    process::execute(project.path(), &args, cancel.clone(), events, 64_000).await
}

async fn stop(State(app): State<Arc<App>>, Json(body): Json<Value>) -> Json<Value> {
    let control = body["requestId"].as_str().and_then(|id| {
        app.runs
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .get(id)
            .cloned()
    });
    if let Some(control) = control {
        control.cancel.cancel();
        let _ = tokio::time::timeout(Duration::from_secs(10), control.done.cancelled()).await;
    }
    Json(json!({}))
}

async fn language(
    State(app): State<Arc<App>>,
    Path(method): Path<String>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, ApiError> {
    if app.shutdown.is_cancelled() {
        return Err(anyhow!("服务正在关闭").into());
    }
    if method == "open" {
        let code = body["code"]
            .as_str()
            .context("代码必须为字符串")?
            .to_owned();
        let dependencies: Vec<String> = serde_json::from_value(
            body.get("dependencies")
                .cloned()
                .unwrap_or_else(|| json!([])),
        )
        .map_err(anyhow::Error::from)?;
        // 锁住建会话阶段，保证并行打开也不会突破上限。
        let mut sessions = app.sessions.lock().await;
        if sessions.len() >= 6 {
            return Err(anyhow!("语言服务会话过多，请稍后重试").into());
        }
        let session = lsp::Session::open(code, &dependencies, &app.shutdown).await?;
        let id = uuid::Uuid::new_v4().to_string();
        sessions.insert(id.clone(), session);
        return Ok(Json(json!({"id":id})));
    }
    let id = body["id"].as_str().context("缺少会话 id")?;
    let session = {
        let mut sessions = app.sessions.lock().await;
        if method == "close" {
            sessions.remove(id)
        } else {
            sessions.get(id).cloned()
        }
    };
    if method == "close" {
        if let Some(session) = session {
            session.close().await;
        }
        return Ok(Json(json!({})));
    }
    let session = session.context("语言服务会话已过期，请重新打开编辑器")?;
    session.touched.store(lsp::now(), Ordering::Relaxed);
    let result = match method.as_str() {
        "status" => session.status().await,
        "change" => {
            session
                .change(
                    body["code"]
                        .as_str()
                        .context("代码必须为字符串")?
                        .to_owned(),
                )
                .await?;
            json!({})
        }
        "diagnostics" => session.diagnostics().await,
        "hover" | "completion" => {
            let position = &body["position"];
            if position["line"].as_u64().is_none() || position["character"].as_u64().is_none() {
                return Err(anyhow!("无效的光标位置").into());
            }
            json!({"result":session.language_request(&format!("textDocument/{method}"), position.clone()).await?})
        }
        _ => return Err(anyhow!("未知接口").into()),
    };
    Ok(Json(result))
}

async fn cleanup(app: &App) {
    app.shutdown.cancel();
    let sessions: Vec<_> = app
        .sessions
        .lock()
        .await
        .drain()
        .map(|(_, value)| value)
        .collect();
    for session in sessions {
        session.close().await;
    }
    let runs: Vec<_> = app
        .runs
        .lock()
        .unwrap_or_else(|error| error.into_inner())
        .values()
        .cloned()
        .collect();
    for run in runs {
        let _ = tokio::time::timeout(Duration::from_secs(10), run.done.cancelled()).await;
    }
}

async fn sweep(app: Arc<App>) {
    let mut interval = tokio::time::interval(Duration::from_secs(30));
    loop {
        tokio::select! { _ = interval.tick() => {}, _ = app.shutdown.cancelled() => break }
        let expired = {
            let mut sessions = app.sessions.lock().await;
            let ids: Vec<_> = sessions
                .iter()
                .filter(|(_, session)| {
                    lsp::now().saturating_sub(session.touched.load(Ordering::Relaxed)) > 180
                })
                .map(|(id, _)| id.clone())
                .collect();
            ids.iter()
                .filter_map(|id| sessions.remove(id))
                .collect::<Vec<_>>()
        };
        for session in expired {
            session.close().await;
        }
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    let options = Options::parse();
    let mut origins = Vec::new();
    for origin in options.origins {
        let parsed = Url::parse(&origin)?;
        if !matches!(parsed.scheme(), "http" | "https")
            || parsed.origin().ascii_serialization() != origin
        {
            bail!("--origin 必须是完整网页来源，不包含路径，例如 http://localhost:5173");
        }
        origins.push(origin.parse()?);
    }
    println!("Rust Path · 检查本机 Rust 工具链…");
    let capabilities = check_tools().await?;
    if options.check {
        return Ok(());
    }
    let app = Arc::new(App {
        capabilities,
        origins,
        shutdown: CancellationToken::new(),
        runs: Mutex::new(HashMap::new()),
        slots: Arc::new(Semaphore::new(2)),
        sessions: AsyncMutex::new(HashMap::new()),
    });
    let address = SocketAddr::from((Ipv4Addr::LOCALHOST, options.port));
    let listener = tokio::net::TcpListener::bind(address)
        .await
        .with_context(|| format!("无法监听 {address}；请检查端口是否已占用"))?;
    println!("➜ Listening on: http://{}/", listener.local_addr()?);
    println!(
        "➜ Capabilities: http://{}/api/capabilities",
        listener.local_addr()?
    );
    if app.origins.is_empty() {
        println!("网页跨域连接请指定 --origin，例如 --origin http://localhost:5173");
    }
    let sweeper = tokio::spawn(sweep(app.clone()));
    let signal_app = app.clone();
    let result = axum::serve(listener, router(app.clone()))
        .with_graceful_shutdown(async move {
            #[cfg(unix)]
            {
                if let Ok(mut term) =
                    tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
                {
                    tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = term.recv() => {} }
                } else {
                    let _ = tokio::signal::ctrl_c().await;
                }
            }
            #[cfg(not(unix))]
            let _ = tokio::signal::ctrl_c().await;
            cleanup(&signal_app).await;
        })
        .await;
    cleanup(&app).await;
    let _ = sweeper.await;
    result?;
    Ok(())
}
