import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sourceRepo =
  process.env.MINIMAX_H3_SOURCE_REPO ??
  '/Users/kkkk/Desktop/awesome-ai prompts';
const sourceFile = path.join(
  sourceRepo,
  'prompts/minimax-h3-prompts.json'
);
const expansionEditorialFile = path.join(
  sourceRepo,
  'data/minimax-h3/editorial-expansion.json'
);
const catalogFile = new URL('../prompts/catalog.json', import.meta.url);
const promptsDir = new URL('../prompts/', import.meta.url);

const editorial = {
  'radio-operator-evacuation-bridge': {
    zhTitle: '无线电员守住撤离桥',
    enDescription:
      'A nonlinear war-thriller sequence with locked character, environment, continuity, and sound.',
    zhDescription:
      '用锁定角色、环境、连续性与声音的方式，完成非线性战争惊悚片段。',
    mode: 'reference-to-video',
    ingredients: ['Character reference', 'Environment reference'],
  },
  'giant-koi-park-incident': {
    zhTitle: '公园巨型锦鲤意外',
    enDescription:
      'A smartphone-style viral short built around believable weight, traction, and water physics.',
    zhDescription:
      '围绕重量、摩擦与水体物理效果完成的手机实拍风病毒短片。',
    mode: 'text-to-video',
    ingredients: ['Text prompt'],
  },
  'modern-warfare-fps-gameplay': {
    zhTitle: '现代战争 FPS 实机画面',
    enDescription:
      'A first-person military gameplay simulation with player movement, weapon handling, environment, and HUD.',
    zhDescription:
      '同时定义玩家运动、武器操作、战场环境与 HUD 的第一人称军事游戏画面。',
    mode: 'text-to-video',
    ingredients: ['Text prompt'],
  },
  '1980s-open-source-family-comedy': {
    zhTitle: '1980 年代开源家庭喜剧',
    enDescription:
      'An image-led ensemble comedy with practical robots, synchronized reactions, dialogue, and strict continuity.',
    zhDescription:
      '用参考图控制人物与构图，加入实体机器人、群体反应、对白和严格连续性。',
    mode: 'image-to-video',
    ingredients: ['Opening-frame reference'],
  },
  'radiantglo-skincare-commercial': {
    zhTitle: 'RadiantGlo 护肤广告',
    enDescription:
      'A quiet-luxury skincare campaign moving from cool night ritual to warm morning product payoff.',
    zhDescription:
      '从冷色夜间护肤仪式过渡到暖色晨间产品定帧的静奢广告。',
    mode: 'multimodal',
    ingredients: ['Creative brief'],
  },
  'luxury-perfume-commercial': {
    zhTitle: '奢华香水商业片',
    enDescription:
      'A five-scene fragrance commercial covering reveal, macro detail, transformation, transition, and hero shot.',
    zhDescription:
      '由揭晓、微距、变形、环境转场和最终英雄镜头组成的五场香水广告。',
    mode: 'text-to-video',
    ingredients: ['Text prompt'],
  },
  'sagrada-familia-fpv-flight': {
    zhTitle: '圣家堂 FPV 穿越',
    enDescription:
      'A reference-guided Barcelona drone route with an orbit, skyline reveal, and cinematic score.',
    zhDescription:
      '依据参考路径完成巴塞罗那高速航拍、环绕圣家堂、城市揭晓与电影配乐。',
    mode: 'image-to-video',
    ingredients: ['Flight-path image reference'],
  },
  'nova-x-smartphone-tvc': {
    zhTitle: 'NOVA X 手机 TVC',
    enDescription:
      'A three-act smartphone commercial moving from macro hardware detail to interface use and final packshot.',
    zhDescription:
      '从硬件微距、界面交互到最终产品定帧的三幕手机广告。',
    mode: 'text-to-video',
    ingredients: ['Text prompt'],
  },
  'post-workout-gym-vlog': {
    zhTitle: '训练后健身房 Vlog',
    enDescription:
      'A six-cut camcorder vlog specifying handheld flaws, dialogue, character continuity, and ambient sound.',
    zhDescription:
      '明确手持瑕疵、对白、角色连续性和环境声的六镜头录像机 Vlog。',
    mode: 'text-to-video',
    ingredients: ['Text prompt'],
  },
  'greenhouse-tea-isekai-anime': {
    zhTitle: '温室红茶异世界动画',
    enDescription:
      'A detailed Japanese anime sequence with locked character design, precise transformations, typography, and sound.',
    zhDescription:
      '锁定角色设计、精确变形、文字和声音的日语高细节动画片段。',
    mode: 'reference-to-video',
    ingredients: ['Character reference', 'Japanese prompt'],
  },
  'lilia-astra-title-sequence': {
    zhTitle: 'Lilia Astra 预告片头',
    enDescription:
      'A graphic anime trailer with exact title typography, hard cuts, magical props, and timed audio.',
    zhDescription:
      '包含准确标题文字、硬切、魔法道具和定时音效的动画预告片头。',
    mode: 'reference-to-video',
    ingredients: ['Character reference', 'Title copy', 'Japanese prompt'],
  },
};

const sourceRecords = JSON.parse(await readFile(sourceFile, 'utf8'));
const expansionEditorial = JSON.parse(
  await readFile(expansionEditorialFile, 'utf8')
);
const catalog = JSON.parse(await readFile(catalogFile, 'utf8'));
const templates = catalog.prompts.filter(
  (entry) => entry.source?.kind === 'beatapi-original'
);

const sourceEntries = sourceRecords.map((record) => {
  const expansionMetadata = expansionEditorial[record.slug];
  const metadata =
    editorial[record.slug] ??
    (expansionMetadata
      ? {
          zhTitle: expansionMetadata.zh_title,
          enDescription: expansionMetadata.en_description,
          zhDescription: expansionMetadata.zh_description,
          mode: expansionMetadata.mode,
          ingredients: expansionMetadata.ingredients,
        }
      : null);
  if (!metadata) {
    throw new Error(`Missing editorial metadata for ${record.slug}`);
  }
  return {
    slug: record.slug,
    title: {
      en: record.title,
      zh: metadata.zhTitle,
    },
    description: {
      en: metadata.enDescription,
      zh: metadata.zhDescription,
    },
    category: record.category,
    mode: metadata.mode,
    duration: `${Math.round(record.duration_seconds)}s`,
    aspectRatio: record.aspect_ratio,
    ingredients: metadata.ingredients,
    source: {
      kind: 'x',
      name: `@${record.author_handle}`,
      url: record.source_url,
    },
    outputStatus: 'source-verified',
    promptVisibility: record.prompt_visibility,
    promptSourceUrls: record.prompt_source_urls,
    video: record.video_public_url,
    thumbnail: record.thumbnail_public_url,
    prompt: record.prompt,
  };
});

const nextCatalog = {
  ...catalog,
  updatedAt: new Date().toISOString().slice(0, 10),
  prompts: [...sourceEntries, ...templates],
};

for (const entry of sourceEntries) {
  await writeFile(
    new URL(`${entry.slug}.json`, promptsDir),
    `${JSON.stringify(entry, null, 2)}\n`
  );
}
await writeFile(catalogFile, `${JSON.stringify(nextCatalog, null, 2)}\n`);

console.log(
  `Imported ${sourceEntries.length} source-verified prompts; catalog now has ${nextCatalog.prompts.length} entries.`
);
