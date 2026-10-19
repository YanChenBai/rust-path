export function sourceReference(info: string) {
  return /(?:^|\s)source=([^\s]+)/.exec(info)?.[1];
}

export function courseSource(sources: Record<string, string>, reference: string) {
  const source = sources[reference];

  if (source === undefined) {
    throw new Error(`课程 Rust 源码不存在：${reference}`);
  }

  return source;
}

export function sourceRegions(source: string) {
  const regions: Record<string, string> = {};

  for (const match of source.matchAll(
    /^\s*\/\/ region:(\w+)\r?\n([\s\S]*?)^\s*\/\/ endregion:\1\s*$/gm,
  )) {
    regions[match[1]!] = match[2]!.replace(/\r\n?/g, '\n').replace(/\n$/, '');
  }

  return regions;
}
