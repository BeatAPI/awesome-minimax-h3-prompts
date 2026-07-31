import { readFile, writeFile } from 'node:fs/promises';

const readmeFile = new URL('../README.md', import.meta.url);
const catalogFile = new URL('../prompts/catalog.json', import.meta.url);

const startMarker = '<!-- GENERATED_VIDEO_GALLERY_START -->';
const endMarker = '<!-- GENERATED_VIDEO_GALLERY_END -->';
const mediaBase =
  'https://media.beatapi.io/prompt-gallery/minimax-h3';
const playButton =
  'https://img.shields.io/badge/PLAY_VIDEO-3158E8?style=for-the-badge';

const animatedPreviewOrder = [
  'modern-warfare-fps-gameplay',
  'luxury-perfume-commercial',
  '1980s-open-source-family-comedy',
  'radio-operator-evacuation-bridge',
  'giant-koi-park-incident',
  'greenhouse-tea-isekai-anime',
];
const animatedPreviewSlugs = new Set(animatedPreviewOrder);

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function titleFor(entry) {
  return typeof entry.title === 'string' ? entry.title : entry.title.en;
}

function mediaFor(entry) {
  return {
    video: `${mediaBase}/${entry.slug}.webm`,
    thumbnail: `${mediaBase}/${entry.slug}.jpg`,
  };
}

function promptPreview(prompt, limit = 180) {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  if (compact.length <= limit) return escapeHtml(compact);

  const clipped = compact.slice(0, limit).replace(/\s+\S*$/, '').trimEnd();
  return `${escapeHtml(clipped)}...`;
}

function sourceHandleFor(entry) {
  if (!/^@[A-Za-z0-9_]{1,15}$/.test(entry.source.name)) {
    throw new Error(`${entry.slug}: source name must be an X @handle`);
  }
  return entry.source.name;
}

function renderEntry(entry, index) {
  const title = titleFor(entry);
  const media = mediaFor(entry);
  const isAnimated = animatedPreviewSlugs.has(entry.slug);
  const preview = isAnimated
    ? `./assets/readme-previews/${entry.slug}.webp`
    : media.thumbnail;
  const category = entry.category.replaceAll('-', ' ');
  const sourceName = sourceHandleFor(entry);

  return `### ${index + 1}. ${title}

<a href="${media.video}">
  <img src="${preview}" alt="${escapeHtml(title)} video preview" width="700" />
</a>

<details>
<summary><strong>Prompt</strong> — ${promptPreview(entry.prompt)}</summary>

~~~~text
${entry.prompt.trim()}
~~~~

</details>

[![Play video](${playButton})](${media.video})

**Source:** [${sourceName}](${entry.source.url}) · ${entry.duration} · ${entry.aspectRatio} · ${category}

---`;
}

const [readme, catalogSource] = await Promise.all([
  readFile(readmeFile, 'utf8'),
  readFile(catalogFile, 'utf8'),
]);
const catalog = JSON.parse(catalogSource);
const catalogEntries = catalog.prompts.filter(
  (entry) => entry.outputStatus === 'source-verified'
);
const featuredOrder = new Map(
  animatedPreviewOrder.map((slug, index) => [slug, index])
);
const entries = catalogEntries
  .map((entry, index) => ({ entry, index }))
  .sort((a, b) => {
    const aFeatured = featuredOrder.get(a.entry.slug);
    const bFeatured = featuredOrder.get(b.entry.slug);
    if (aFeatured !== undefined || bFeatured !== undefined) {
      return (
        (aFeatured ?? Number.POSITIVE_INFINITY) -
        (bFeatured ?? Number.POSITIVE_INFINITY)
      );
    }
    return a.index - b.index;
  })
  .map(({ entry }) => entry);

const gallery = `${startMarker}

${entries.map(renderEntry).join('\n\n')}

${endMarker}`;

const markerPattern = new RegExp(
  `${startMarker}[\\s\\S]*?${endMarker}`,
  'm'
);
if (!markerPattern.test(readme)) {
  throw new Error('README gallery markers are missing');
}

const nextReadme = readme.replace(markerPattern, gallery);
if (process.argv.includes('--check')) {
  if (nextReadme !== readme) {
    throw new Error('README gallery is out of date; run npm run readme:build');
  }
  console.log(`README gallery is current (${entries.length} videos).`);
} else {
  await writeFile(readmeFile, nextReadme);
  console.log(`Updated README with ${entries.length} video prompts.`);
}
