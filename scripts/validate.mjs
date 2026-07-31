import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const file = new URL('../prompts/catalog.json', import.meta.url);
const catalog = JSON.parse(await readFile(file, 'utf8'));

assert.equal(catalog.version, 1, 'catalog version must be 1');
assert.equal(catalog.model, 'MiniMax-H3', 'catalog model must be MiniMax-H3');
assert.ok(Array.isArray(catalog.prompts), 'prompts must be an array');
assert.equal(catalog.prompts.length, 56, 'catalog should contain 50 sourced prompts and 6 templates');

const allowedCategories = new Set([
  'music-video',
  'motion-graphics',
  'brand-film',
  'product-demo',
  'vlog',
  'title-sequence',
  'cinematic-story',
  'viral-short',
  'gameplay',
  'comedy',
  'product-commercial',
  'cinematic-travel',
  'anime',
]);
const allowedModes = new Set([
  'text-to-video',
  'image-to-video',
  'reference-to-video',
  'multimodal',
]);
const allowedStatuses = new Set([
  'template-unverified',
  'source-verified',
  'output-verified',
]);
const slugs = new Set();

for (const entry of catalog.prompts) {
  assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.equal(slugs.has(entry.slug), false, `duplicate slug: ${entry.slug}`);
  slugs.add(entry.slug);
  assert.ok(entry.title?.en && entry.title?.zh, `${entry.slug}: missing title`);
  assert.ok(
    entry.description?.en && entry.description?.zh,
    `${entry.slug}: missing description`
  );
  assert.ok(allowedCategories.has(entry.category), `${entry.slug}: bad category`);
  assert.ok(allowedModes.has(entry.mode), `${entry.slug}: bad mode`);
  assert.match(entry.duration, /^\d+s$/);
  assert.match(entry.aspectRatio, /^\d+:\d+$/);
  assert.ok(
    entry.prompt.length >= (entry.outputStatus === 'source-verified' ? 20 : 240),
    `${entry.slug}: prompt is too thin`
  );
  assert.ok(
    Array.isArray(entry.ingredients) && entry.ingredients.length > 0,
    `${entry.slug}: ingredients are required`
  );
  assert.match(entry.source?.url ?? '', /^https:\/\//);
  assert.ok(allowedStatuses.has(entry.outputStatus), `${entry.slug}: bad status`);
  if (entry.outputStatus === 'source-verified') {
    assert.ok(
      entry.promptVisibility === 'same-post' ||
        entry.promptVisibility === 'same-author-thread',
      `${entry.slug}: prompt location is required`
    );
    assert.ok(
      Array.isArray(entry.promptSourceUrls) &&
        entry.promptSourceUrls.length > 0,
      `${entry.slug}: prompt source URL is required`
    );
  }
  if (entry.outputStatus === 'output-verified') {
    assert.match(entry.outputUrl ?? '', /^https:\/\//);
  }

  const entryFile = new URL(`../prompts/${entry.slug}.json`, import.meta.url);
  const standalone = JSON.parse(await readFile(entryFile, 'utf8'));
  assert.deepEqual(
    standalone,
    entry,
    `${entry.slug}: standalone file differs from catalog`
  );
}

console.log(`Validated ${catalog.prompts.length} MiniMax H3 prompts.`);
