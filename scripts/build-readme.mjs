import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';

const readmeFile = new URL('../README.md', import.meta.url);
const catalogFile = new URL('../prompts/catalog.json', import.meta.url);

const startMarker = '<!-- GENERATED_VIDEO_GALLERY_START -->';
const endMarker = '<!-- GENERATED_VIDEO_GALLERY_END -->';
const pageSize = 25;
const pagesDir = new URL('../prompts/pages/', import.meta.url);
const categoriesDir = new URL('../prompts/categories/', import.meta.url);
const useCasesDir = new URL('../prompts/use-cases/', import.meta.url);
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
const useCases = [
  {
    slug: 'stories-films',
    label: 'Stories & Films',
    categories: [
      'cinematic-story',
      'cinematic-travel',
      'title-sequence',
      'horror',
      'anime',
    ],
  },
  {
    slug: 'action-fantasy',
    label: 'Action & Fantasy',
    categories: ['action', 'gameplay', 'motion-graphics'],
  },
  {
    slug: 'ads-products',
    label: 'Ads & Products',
    categories: ['product-commercial', 'product-demo', 'brand-film', 'fashion'],
  },
  {
    slug: 'music-performance',
    label: 'Music & Performance',
    categories: ['music-video'],
  },
  {
    slug: 'vlog-social',
    label: 'Vlog & Social',
    categories: ['vlog', 'comedy', 'viral-short'],
  },
];

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

function renderEntry(entry, index, heading = '###', assetPrefix = '.') {
  const title = titleFor(entry);
  const media = mediaFor(entry);
  const isAnimated = animatedPreviewSlugs.has(entry.slug);
  const preview = isAnimated
    ? `${assetPrefix}/assets/readme-previews/${entry.slug}.webp`
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
for (const entry of entries) {
  const matchingUseCases = useCases.filter((useCase) =>
    useCase.categories.includes(entry.category)
  );
  if (matchingUseCases.length !== 1) {
    throw new Error(
      `${entry.slug}: category ${entry.category} must map to exactly one use case`
    );
  }
}
const categoryNames = [...new Set(entries.map((entry) => entry.category))].sort();

function pageDocument(pageEntries, pageIndex) {
  const start = pageIndex * pageSize;
  return `# MiniMax H3 prompts — page ${pageIndex + 1}

[Back to the full gallery](../../README.md) · [Catalog index](../README.md)

${pageEntries.map((entry, index) => renderEntry(entry, start + index, '##', '../..')).join('\n\n')}
`;
}

function categoryDocument(category) {
  const categoryEntries = entries.filter((entry) => entry.category === category);
  return `# MiniMax H3 ${category.replaceAll('-', ' ')} prompts

[Back to the full gallery](../../README.md) · [Catalog index](../README.md)

${categoryEntries.map((entry, index) => renderEntry(entry, index, '##', '../..')).join('\n\n')}
`;
}

function useCaseDocument(useCase) {
  const categorySet = new Set(useCase.categories);
  const useCaseEntries = entries.filter((entry) => categorySet.has(entry.category));
  return `# MiniMax H3 ${useCase.label} prompts

[Back to all ${entries.length} prompts](../../README.md)

${useCaseEntries.map((entry, index) => renderEntry(entry, index, '##', '../..')).join('\n\n')}
`;
}

const useCaseLinks = useCases
  .map((useCase) => `[${useCase.label}](./prompts/use-cases/${useCase.slug}.md)`)
  .join(' · ');

const catalogIndex = `# Browse all ${entries.length} MiniMax H3 prompts

[Back to the full gallery](../README.md)

## Use cases

${useCases.map((useCase) => `- [${useCase.label}](./use-cases/${useCase.slug}.md)`).join('\n')}

## Pages

${Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) =>
  `- [Page ${index + 1}](./pages/${index + 1}.md) — prompts ${index * pageSize + 1}–${Math.min((index + 1) * pageSize, entries.length)}`
).join('\n')}

## Categories

${categoryNames.map((category) => `- [${category.replaceAll('-', ' ')}](./categories/${category}.md)`).join('\n')}
`;

const gallery = `${startMarker}

**Browse by use case:** ${useCaseLinks}

${entries.map((entry, index) => renderEntry(entry, index)).join('\n\n')}

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
    ...useCases.map((useCase) => [
      new URL(`${useCase.slug}.md`, useCasesDir),
      useCaseDocument(useCase),
    ]),
  ];
  for (const [file, expected] of generatedFiles) {
    const actual = await readFile(file, 'utf8');
    if (actual !== expected) {
      throw new Error(`${file.pathname} is out of date; run npm run readme:build`);
    }
  }
  console.log(`README gallery is current (${entries.length} prompts).`);
} else {
  await Promise.all([
    mkdir(pagesDir, { recursive: true }),
    mkdir(categoriesDir, { recursive: true }),
    mkdir(useCasesDir, { recursive: true }),
  ]);
  const expectedUseCaseFiles = new Set(
    useCases.map((useCase) => `${useCase.slug}.md`)
  );
  const staleUseCaseFiles = (await readdir(useCasesDir)).filter(
    (file) => file.endsWith('.md') && !expectedUseCaseFiles.has(file)
  );
  await Promise.all(
    staleUseCaseFiles.map((file) => unlink(new URL(file, useCasesDir)))
  );
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
    ...useCases.map((useCase) =>
      writeFile(new URL(`${useCase.slug}.md`, useCasesDir), useCaseDocument(useCase))
    ),
  ]);
  console.log(`Updated README with all ${entries.length} prompts and generated supporting prompt views.`);
}
