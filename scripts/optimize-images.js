#!/usr/bin/env node
// scripts/optimize-images.js - Resize and palette-quantise the PNG assets
//
// The source artwork is 1024x1024 uncompressed PNG (~1.5 MB each, ~40 MB in
// total) while the UI renders planets at 120px and icons at 48px. This script
// rewrites every PNG under public/images in place at a sensible maximum size
// with palette quantisation. It is idempotent: running it twice is a no-op.
//
// Usage: node scripts/optimize-images.js [--dry-run] [--max=512]

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', 'public', 'images');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const maxArg = args.find(a => a.startsWith('--max='));
const MAX_SIZE = maxArg ? Number(maxArg.split('=')[1]) : 512;

// Per-folder overrides: backgrounds keep more resolution.
const MAX_BY_FOLDER = { ui: 512, planets: 512, icons: 256, easter_egg: 512, leaderboard: 256, milestone: 256 };

function walk(dir, out = []) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.png$/i.test(entry.name)) out.push(full);
  });
  return out;
}

async function optimise(file) {
  const before = fs.statSync(file).size;
  const folder = path.basename(path.dirname(file));
  const max = MAX_BY_FOLDER[folder] ?? MAX_SIZE;
  const image = sharp(file);
  const meta = await image.metadata();
  const needsResize = (meta.width ?? 0) > max || (meta.height ?? 0) > max;

  const buffer = await image
    .resize(needsResize ? { width: max, height: max, fit: 'inside', withoutEnlargement: true } : undefined)
    .png({ palette: true, quality: 85, compressionLevel: 9, effort: 10 })
    .toBuffer();

  const after = buffer.length;
  const saved = before - after;
  if (saved <= 0) return { file, before, after, skipped: true };
  if (!dryRun) fs.writeFileSync(file, buffer);
  return { file, before, after, resized: needsResize, max };
}

(async () => {
  const files = walk(ROOT);
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const r = await optimise(file);
    totalBefore += r.before;
    totalAfter += r.after;
    const rel = path.relative(ROOT, r.file);
    const kb = n => `${(n / 1024).toFixed(0)} KB`;
    console.log(
      `${r.skipped ? 'skip ' : 'write'} ${rel.padEnd(36)} ${kb(r.before).padStart(9)} -> ${kb(r.after).padStart(8)}${
        r.resized ? ` (resized to <=${r.max}px)` : ''
      }`
    );
  }
  console.log(
    `\n${files.length} files: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB${
      dryRun ? ' (dry run)' : ''
    }`
  );
})().catch(err => {
  console.error(err);
  process.exit(1);
});
