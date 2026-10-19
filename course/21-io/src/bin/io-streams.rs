use std::io::{self, BufRead, Cursor, Write};

// 逐行读取并累计，遇到读取或解析错误时通过 Result 返回原因。
fn sum<R: BufRead>(reader: R) -> io::Result<i64> {
    // 累计本次处理结果，后续断言会检查最终数值。
    let mut total = 0i64;
    for line in reader.lines() {
        // 读取当前一行，再分别处理读取失败、空白与解析失败。
        let line = line?;
        if line.trim().is_empty() {
            continue;
        }

        // 保存当前解析或运算得到的数值，后续继续执行业务规则。
        let n = line
            .trim()
            .parse::<i64>()
            .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;
        total = total
            .checked_add(n)
            .ok_or_else(|| io::Error::other("总和溢出"))?;
    }
    Ok(total)
}

fn main() -> io::Result<()> {
    // 累计本次处理结果，后续断言会检查最终数值。
    let total = sum(Cursor::new("12\n\n-2\n"))?;

    // 保存处理生成的输出，避免把中间结果与最终展示混在一起。
    let mut output = io::BufWriter::new(Vec::new());
    writeln!(output, "sum={total}")?;

    // 把缓冲数据明确写到底层，再继续读取或返回成功。
    output.flush()?;

    // 检查具体结果是否符合前面的规则；修改输入后也要同步预测这些断言。
    assert_eq!(output.get_ref(), b"sum=10\n");
    Ok(())
}
