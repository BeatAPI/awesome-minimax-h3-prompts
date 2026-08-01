import { mkdir, readFile, writeFile } from 'node:fs/promises';

const readmeFile = new URL('../README.md', import.meta.url);
const catalogFile = new URL('../prompts/catalog.json', import.meta.url);

const startMarker = '<!-- GENERATED_VIDEO_GALLERY_START -->';
const endMarker = '<!-- GENERATED_VIDEO_GALLERY_END -->';
const featuredCount = 30;
const pageSize = 25;
const pagesDir = new URL('../prompts/pages/', import.meta.url);
const categoriesDir = new URL('../prompts/categories/', import.meta.url);
const catalogIndexFile = new URL('../prompts/README.md', import.meta.url);
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
  if (!/^https:\/\/media\.beatapi\.io\/prompt-gallery\/minimax-h3\/.+\.webm$/.test(entry.video)) {
    throw new Error(`${entry.slug}: exact public WebM URL is required`);
  }
  if (!/^https:\/\/media\.beatapi\.io\/prompt-gallery\/minimax-h3\/.+\.jpg$/.test(entry.thumbnail)) {
    throw new Error(`${entry.slug}: exact public poster URL is required`);
  }
  return {
    video: entry.video,
    thumbnail: entry.thumbnail,
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

function renderEntry(entry, index, heading = '###') {
  const title = titleFor(entry);
  const media = mediaFor(entry);
  const isAnimated = animatedPreviewSlugs.has(entry.slug);
  const preview = isAnimated
    ? `./assets/readme-previews/${entry.slug}.webp`
    : media.thumbnail;
  const category = entry.category.replaceAll('-', ' ');
  const sourceName = sourceHandleFor(entry);

  return `${heading} ${index + 1}. ${title}

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
const featuredEntries = entries.slice(0, featuredCount);
const categoryNames = [...new Set(entries.map((entry) => entry.category))].sort();

function pageDocument(pageEntries, pageIndex) {
  const start = pageIndex * pageSize;
  return `# MiniMax H3 prompts — page ${pageIndex + 1}

[Back to the featured gallery](../../README.md) · [Catalog index](../README.md)

${pageEntries.map((entry, index) => renderEntry(entry, start + index, '##')).join('\n\n')}
`;
}

function categoryDocument(category) {
  const categoryEntries = entries.filter((entry) => entry.category === category);
  return `# MiniMax H3 ${category.replaceAll('-', ' ')} prompts

[Back to the featured gallery](../../README.md) · [Catalog index](../README.md)

${categoryEntries.map((entry, index) => renderEntry(entry, index, '##')).join('\n\n')}
`;
}

const catalogIndex = `# Browse all 100 MiniMax H3 prompts

[Back to the featured gallery](../README.md)

## Pages

${Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) =>
  `- [Page ${index + 1}](./pages/${index + 1}.md) — prompts ${index * pageSize + 1}–${Math.min((index + 1) * pageSize, entries.length)}`
).join('\n')}

## Categories

${categoryNames.map((category) => `- [${category.replaceAll('-', ' ')}](./categories/${category}.md)`).join('\n')}
`;

const gallery = `${startMarker}

${featuredEntries.map((entry, index) => renderEntry(entry, index)).join('\n\n')}

## Browse all 100 prompts

The README features 30 examples for fast loading. Browse the complete source-verified collection through the [four paged galleries](./prompts/README.md) or [machine-readable catalog](./prompts/catalog.json).

${endMarker}

## Contributing

Use the [prompt submission form](https://github.com/BeatAPI/awesome-minimax-h3-prompts/issues/new?template=prompt.yml)
or read [CONTRIBUTING.md](./CONTRIBUTING.md) for source, rights, and acceptance
requirements.

## License

BeatAPI-authored documentation is licensed under [CC BY 4.0](./LICENSE.md), and
validation code is licensed under the MIT terms in the same file. Third-party
prompts, media, names, and source posts retain their original rights.`;

const markerPattern = new RegExp(
  `${startMarker}[\\s\\S]*$`,
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
  const generatedFiles = [
    [catalogIndexFile, catalogIndex],
    ...Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) => [
      new URL(`${index + 1}.md`, pagesDir),
      pageDocument(entries.slice(index * pageSize, (index + 1) * pageSize), index),
    ]),
    ...categoryNames.map((category) => [
      new URL(`${category}.md`, categoriesDir),
      categoryDocument(category),
    ]),
  ];
  for (const [file, expected] of generatedFiles) {
    const actual = await readFile(file, 'utf8');
    if (actual !== expected) {
      throw new Error(`${file.pathname} is out of date; run npm run readme:build`);
    }
  }
  console.log(`README gallery is current (${featuredEntries.length} featured, ${entries.length} total).`);
} else {
  await Promise.all([
    mkdir(pagesDir, { recursive: true }),
    mkdir(categoriesDir, { recursive: true }),
  ]);
  await writeFile(readmeFile, nextReadme);
  await writeFile(catalogIndexFile, catalogIndex);
  await Promise.all([
    ...Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) =>
      writeFile(
        new URL(`${index + 1}.md`, pagesDir),
        pageDocument(entries.slice(index * pageSize, (index + 1) * pageSize), index)
      )
    ),
    ...categoryNames.map((category) =>
      writeFile(new URL(`${category}.md`, categoriesDir), categoryDocument(category))
    ),
  ]);
  console.log(`Updated README with ${featuredEntries.length} featured prompts and generated ${entries.length} total prompt views.`);
}
