import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const file = new URL('../prompts/catalog.json', import.meta.url);
const catalog = JSON.parse(await readFile(file, 'utf8'));

assert.equal(catalog.version, 1, 'catalog version must be 1');
assert.equal(catalog.model, 'MiniMax-H3', 'catalog model must be MiniMax-H3');
assert.ok(Array.isArray(catalog.prompts), 'prompts must be an array');
assert.ok(catalog.prompts.length >= 100, 'catalog should contain at least 100 sourced prompts');

const allowedCategories = new Set([
  'action',
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
  'animation',
  'fashion',
  'horror',
]);
const allowedModes = new Set([
  'text-to-video',
  'image-to-video',
  'reference-to-video',
  'multimodal',
]);
const allowedStatuses = new Set([
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
  assert.match(
    entry.video ?? '',
    /^https:\/\/media\.beatapi\.io\/prompt-gallery\/minimax-h3\/.+\.webm$/
  );
  assert.match(
    entry.thumbnail ?? '',
    /^https:\/\/media\.beatapi\.io\/prompt-gallery\/minimax-h3\/.+\.jpg$/
  );
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

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const featuredCount = 30;
assert.equal(
  (readme.match(/^### \d+\./gm) ?? []).length,
  Math.min(featuredCount, catalog.prompts.length),
  'README should display a bounded featured gallery'
);
assert.ok(
  readme.includes(`Browse all ${catalog.prompts.length} prompts`),
  'README should link to the full generated catalog'
);
const useCaseSlugs = [
  'stories-films',
  'action-fantasy',
  'ads-products',
  'music-performance',
  'vlog-social',
];
assert.deepEqual(
  (await readdir(new URL('../prompts/use-cases/', import.meta.url)))
    .filter((file) => file.endsWith('.md'))
    .sort(),
  useCaseSlugs.map((slug) => `${slug}.md`).sort(),
  'README should expose exactly five use-case shortcuts'
);
for (const useCase of useCaseSlugs) {
  assert.ok(
    readme.includes(`](./prompts/use-cases/${useCase}.md)`),
    `README should link to the ${useCase} use case`
  );
  const useCaseSource = await readFile(
    new URL(`../prompts/use-cases/${useCase}.md`, import.meta.url),
    'utf8'
  );
  assert.match(useCaseSource, /^# MiniMax H3 .+ prompts/m);
  assert.ok(
    (useCaseSource.match(/^## \d+\./gm) ?? []).length > 0,
    `${useCase} use case should contain prompts`
  );
}
const pageSize = 25;
const pageCount = Math.ceil(catalog.prompts.length / pageSize);
for (let page = 1; page <= pageCount; page += 1) {
  const pageSource = await readFile(
    new URL(`../prompts/pages/${page}.md`, import.meta.url),
    'utf8'
  );
  assert.equal(
    (pageSource.match(/^## \d+\./gm) ?? []).length,
    Math.min(pageSize, catalog.prompts.length - (page - 1) * pageSize),
    `page ${page} should contain the expected prompt slice`
  );
}
for (const category of allowedCategories) {
  const categorySource = await readFile(
    new URL(`../prompts/categories/${category}.md`, import.meta.url),
    'utf8'
  );
  assert.match(categorySource, /^# MiniMax H3 .+ prompts/m);
}

console.log(`Validated ${catalog.prompts.length} MiniMax H3 prompts.`);
