// region:answer
mod config {
    #[derive(Debug, PartialEq)]
    pub struct BuildPlan { pub mode: &'static str, pub release: bool, pub locked: bool }
    pub fn plan(args: &[&str]) -> Result<BuildPlan, String> {
        let Some(&mode) = args.first() else { return Err("缺少命令".into()); };
        if !["check", "build", "test"].contains(&mode) { return Err("未知命令".into()); }
        let mut result = BuildPlan { mode: match mode { "check" => "check", "build" => "build", _ => "test" }, release: false, locked: false };
        for flag in &args[1..] {
            match *flag { "--release" => result.release = true, "--locked" => result.locked = true, _ => return Err("未知参数".into()) }
        }
        Ok(result)
    }
}
use config::plan;
// endregion:answer

fn main() {
// region:tests
assert!(plan(&[]).is_err()); assert!(plan(&["run"]).is_err());
let p = plan(&["build", "--release", "--locked"]).unwrap();
assert_eq!(p.mode, "build"); assert!(p.release && p.locked);
let p = plan(&["check"]).unwrap(); assert!(!p.release && !p.locked);
assert_eq!(plan(&["test", "--locked", "--locked"]).unwrap().mode, "test");
assert!(plan(&["test", "--workspace"]).is_err());
// endregion:tests
    println!("__PASS__");
}
