import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

export async function readPathsAsText(paths) {
  const files = await Promise.all(
    paths.map(async p => ({ name: p, text: await fs.readFile(resolve(p), 'utf8') }))
  );
  return files;
}
