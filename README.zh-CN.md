# Awesome MiniMax H3 Prompts

这是由 [BeatAPI](https://beatapi.io) 维护的 MiniMax H3 制作级提示词开源仓库。

**[打开可视化 Gallery](https://beatapi.io/zh/prompts/minimax-h3)** ·
**[提交 Prompt](https://github.com/BeatAPI/awesome-minimax-h3-prompts/issues/new?template=prompt.yml)**

## 为什么做这个仓库

MiniMax H3 可以同时理解文本、图片、视频和音频，因此高质量 Prompt
不只是写一段画面描述。每条可复用内容都应该说明：

1. 每个参考素材负责什么；
2. 哪些身份、产品、文字或版式不能改变；
3. 每个时间节点发生什么；
4. 镜头与转场如何运动；
5. 需要预防哪些具体失败。

仓库会把作者与验证状态写清楚。没有可公开的输入和输出证据时，
可复制模板不会被包装成“已实测案例”。

## 已核验真实案例

现有 50 个案例都已回查 X：原帖明确提到 MiniMax H3 并附带生成视频；
完整 Prompt 位于同帖（34 条）或同一作者的回复（16 条）。下面列出首批
11 条代表案例，完整清单见 [`prompts/catalog.json`](./prompts/catalog.json)
和网站 Gallery：

- [无线电员守住撤离桥](https://x.com/Diplomeme/status/2082770042630943156)
- [公园巨型锦鲤意外](https://x.com/underwoodxie96/status/2082747838782386563)
- [现代战争 FPS 实机画面](https://x.com/Just_sharon7/status/2083064417798025721)
- [1980 年代开源家庭喜剧](https://x.com/BrentLynch/status/2083020024340693185)
- [RadiantGlo 护肤广告](https://x.com/AIwithJessica/status/2083013658230317082)
- [奢华香水商业片](https://x.com/CaliraVal/status/2083059583308751079)
- [圣家堂 FPV 穿越](https://x.com/Diplomeme/status/2083056488122380671)
- [NOVA X 手机 TVC](https://x.com/UrMeer289/status/2083048872566575568)
- [训练后健身房 Vlog](https://x.com/doctorwasif/status/2083048782581858681)
- [温室红茶异世界动画](https://x.com/haruuraeadss/status/2082798959014064531)
- [Lilia Astra 预告片头](https://x.com/haruuraeadss/status/2082945363431080299)

公共仓库只保留来源链接与署名，不直接再分发第三方视频；媒体版权仍归原作者。

## BeatAPI 原创模板

另保留 6 个尚待自有实测的 BeatAPI 原创模板：

- 动态歌词舞台
- 会呼吸的编辑海报
- 奢华香氛发布片
- 产品界面发布片
- 节奏照片日记
- 建筑感片头序列

完整 Prompt 与字段见
[`prompts/catalog.json`](./prompts/catalog.json)，网站详情页见
[MiniMax H3 Prompt Gallery](https://beatapi.io/zh/prompts/minimax-h3)。

## 验证状态

- `template-unverified`：没有发布自有输出的提示词模板。
- `source-verified`：已经核验原始公开来源和作者。
- `output-verified`：可以公开输入、设置和输出证据。

这些状态描述的是证据，不是审美评分。

## 如何投稿

使用 [GitHub 投稿表单](https://github.com/BeatAPI/awesome-minimax-h3-prompts/issues/new?template=prompt.yml)，
提供完整 Prompt、来源、作者、参考素材职责和真实验证状态。不要上传没有权利公开的媒体。

审核路径：

```text
GitHub Issue → 来源与权利审核 → 数据验证 → 网站 Gallery
```

具体规则与下架流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 边界

[MiniMax 官方视频生成文档](https://platform.minimax.io/docs/guides/video-generation)
是模型能力与限制的事实来源。正式制作上传器前请重新核对实时文档。

这是 BeatAPI 的独立内容项目，不表示 BeatAPI workflow API 已经开放
MiniMax H3 供应商路由。

## 本地验证

```bash
npm test
```

## 许可

原创 Prompt 与文档使用 [CC BY 4.0](./LICENSE.md)，验证代码使用同文件中的
MIT 条款。第三方来源与媒体仍归原权利人所有。
