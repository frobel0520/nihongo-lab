import path from 'node:path';

/** Resolve only a relative asset path beneath root, on POSIX or Windows. */
export function staticFile(root, asset, paths = path) {
  if (
    asset.includes('\0') ||
    paths.isAbsolute(asset) ||
    /(^|[\\/])\.\.([\\/]|$)/.test(asset)
  )
    throw new Error('Asset path outside root');
  const file = paths.resolve(root, asset || 'index.html');
  const relative = paths.relative(root, file);
  if (
    !relative ||
    relative === '..' ||
    relative.startsWith('..' + paths.sep) ||
    paths.isAbsolute(relative)
  )
    throw new Error('Asset path outside root');
  return file;
}

/** Decode before checking: URL() alone normalizes traversal before it can be rejected. */
export function assetPath(requestUrl, base = '/nihongo-lab/') {
  const pathname = decodeURIComponent(requestUrl.split('?')[0]);
  if (!pathname.startsWith(base)) throw new Error('Outside base path');
  return pathname.slice(base.length);
}
