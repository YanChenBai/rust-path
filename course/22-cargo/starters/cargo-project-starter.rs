mod config {
    #[derive(Debug, PartialEq)]
    pub struct BuildPlan {
        pub mode: &'static str,
        pub release: bool,
        pub locked: bool,
    }
    pub fn plan(args: &[&str]) -> Result<BuildPlan, String> {
        todo!()
    }
}
use config::plan;

fn main() {
    println!("{:?}", plan(&["build", "--locked"]));
}
