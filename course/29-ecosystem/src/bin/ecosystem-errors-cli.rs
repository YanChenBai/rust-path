use clap::Parser;

#[derive(Parser)]

struct Args {
    #[arg(long)]
    minutes: u32,
}

#[derive(Debug, thiserror::Error)]

enum InputError {
    #[error("分钟必须为 1..=180")]
    Range,
}

fn validate(minutes: u32) -> Result<u32, InputError> {
    if !(1..=180).contains(&minutes) {
        return Err(InputError::Range);
    }
    Ok(minutes)
}

fn main() -> anyhow::Result<()> {
    use anyhow::Context;

    // 取得命令行参数的结构化结果，再应用业务校验。
    let args =
        Args::try_parse_from(["study", "--minutes", "25"]).context("参数解析失败")?;

    // 保存学习时长或时长序列，后续按分钟规则处理。
    let minutes = validate(args.minutes).context("学习记录无效")?;

    // 为一次操作建立日志上下文，后续事件可以关联到这个操作。
    let span = tracing::info_span!("validate", minutes);

    // 保持日志上下文的进入状态，离开作用域时自动退出。
    let _guard = span.enter();
    tracing::info!("校验成功");

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(minutes, 25);
    assert!(matches!(validate(0), Err(InputError::Range)));
    Ok(())
}
