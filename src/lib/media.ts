import fs from 'node:fs';
import path from 'node:path';

/** First path (under /public) that exists on disk, so owner photos replace stand-ins automatically. */
export function firstExisting(...srcs: string[]): string | undefined {
  return srcs.find((s) => fs.existsSync(path.join(process.cwd(), 'public', s)));
}
