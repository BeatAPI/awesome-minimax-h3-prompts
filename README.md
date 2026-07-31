<p align="center">
  <img src="./assets/readme-hero.webp" alt="MiniMax H3 Prompt Gallery by BeatAPI" width="100%" />
</p>

# Awesome MiniMax H3 Prompts

An open, source-transparent collection of production prompt templates for
MiniMax H3—curated by [BeatAPI](https://beatapi.io).

**[Browse the visual gallery](https://beatapi.io/prompts/minimax-h3)** ·
**[中文说明](./README.zh-CN.md)** ·
**[Submit a prompt](https://github.com/BeatAPI/awesome-minimax-h3-prompts/issues/new?template=prompt.yml)**

## Why this repository exists

MiniMax H3 accepts text, images, video, and audio in one generation workflow.
That makes prompt quality depend on more than prose. A useful entry should
explain:

1. what every reference controls;
2. what must remain unchanged;
3. what happens at each point in the timeline;
4. how the camera and transitions behave;
5. what common failure modes to avoid.

This repository keeps authorship and verification explicit. A copy-ready
template is not presented as a tested showcase unless the relevant inputs and
output evidence can be published.

## Source-verified showcases

The collection contains 50 entries checked against their original X posts.
Each source post names MiniMax H3 and contains the output video. The complete
prompt is visible either in that post (34 entries) or in a reply from the same
author (16 entries). The table below highlights the first 11; the full set is
available in [`prompts/catalog.json`](./prompts/catalog.json) and the visual
gallery.

| Prompt | Creator | Category | Evidence |
| --- | --- | --- | --- |
| [Radio operator evacuation bridge](https://beatapi.io/prompts/minimax-h3/radio-operator-evacuation-bridge) | [@Diplomeme](https://x.com/Diplomeme/status/2082770042630943156) | Cinematic story | Prompt + video |
| [Giant koi park incident](https://beatapi.io/prompts/minimax-h3/giant-koi-park-incident) | [@underwoodxie96](https://x.com/underwoodxie96/status/2082747838782386563) | Viral short | Prompt + video |
| [Modern warfare FPS gameplay](https://beatapi.io/prompts/minimax-h3/modern-warfare-fps-gameplay) | [@Just_sharon7](https://x.com/Just_sharon7/status/2083064417798025721) | Gameplay | Prompt + video |
| [1980s open-source family comedy](https://beatapi.io/prompts/minimax-h3/1980s-open-source-family-comedy) | [@BrentLynch](https://x.com/BrentLynch/status/2083020024340693185) | Comedy | Prompt + video |
| [RadiantGlo skincare commercial](https://beatapi.io/prompts/minimax-h3/radiantglo-skincare-commercial) | [@AIwithJessica](https://x.com/AIwithJessica/status/2083013658230317082) | Brand film | Prompt + video |
| [Luxury perfume commercial](https://beatapi.io/prompts/minimax-h3/luxury-perfume-commercial) | [@CaliraVal](https://x.com/CaliraVal/status/2083059583308751079) | Product commercial | Prompt + video |
| [Sagrada Família FPV flight](https://beatapi.io/prompts/minimax-h3/sagrada-familia-fpv-flight) | [@Diplomeme](https://x.com/Diplomeme/status/2083056488122380671) | Cinematic travel | Prompt + video |
| [NOVA X smartphone TVC](https://beatapi.io/prompts/minimax-h3/nova-x-smartphone-tvc) | [@UrMeer289](https://x.com/UrMeer289/status/2083048872566575568) | Product commercial | Prompt + video |
| [Post-workout gym vlog](https://beatapi.io/prompts/minimax-h3/post-workout-gym-vlog) | [@doctorwasif](https://x.com/doctorwasif/status/2083048782581858681) | Vlog | Prompt + video |
| [Greenhouse tea isekai anime](https://beatapi.io/prompts/minimax-h3/greenhouse-tea-isekai-anime) | [@haruuraeadss](https://x.com/haruuraeadss/status/2082798959014064531) | Anime | Prompt + video |
| [Lilia Astra title sequence](https://beatapi.io/prompts/minimax-h3/lilia-astra-title-sequence) | [@haruuraeadss](https://x.com/haruuraeadss/status/2082945363431080299) | Title sequence | Prompt + video |

Third-party source videos are linked and credited rather than redistributed in
this public repository. Their rights remain with the original creators.

## BeatAPI template collection

| Prompt | Category | Mode | Duration | Status |
| --- | --- | --- | --- | --- |
| [Kinetic lyric stage](https://beatapi.io/prompts/minimax-h3/kinetic-lyric-stage) | Music video | Reference-to-video | 15s | Template / unverified |
| [Living editorial poster](https://beatapi.io/prompts/minimax-h3/living-editorial-poster) | Motion graphics | Image-to-video | 10s | Template / unverified |
| [Luxury fragrance launch](https://beatapi.io/prompts/minimax-h3/luxury-fragrance-launch) | Brand film | Reference-to-video | 15s | Template / unverified |
| [Interface launch film](https://beatapi.io/prompts/minimax-h3/interface-launch-film) | Product demo | Reference-to-video | 15s | Template / unverified |
| [Rhythmic photo diary](https://beatapi.io/prompts/minimax-h3/rhythmic-photo-diary) | Vlog | Reference-to-video | 15s | Template / unverified |
| [Architectural title sequence](https://beatapi.io/prompts/minimax-h3/architectural-title-sequence) | Title sequence | Text-to-video | 15s | Template / unverified |

The full prompt text and metadata live in
[`prompts/catalog.json`](./prompts/catalog.json).

## Verification states

- `template-unverified` — a prompt template without a published, owned output.
- `source-verified` — the original public post and author were checked.
- `output-verified` — the entry includes publishable inputs, settings, and
  output evidence.

These states describe evidence, not aesthetic quality.

## Submit a prompt

Open the
[prompt submission form](https://github.com/BeatAPI/awesome-minimax-h3-prompts/issues/new?template=prompt.yml).
Please include the complete prompt, source URL, author, reference roles, and
honest verification status. Do not upload media you do not own or have
permission to publish.

The curation path is:

```text
GitHub Issue → source and rights review → catalog validation → website gallery
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for acceptance criteria and the
takedown process.

## Model facts and editorial boundaries

The current
[MiniMax video-generation documentation](https://platform.minimax.io/docs/guides/video-generation)
lists H3 with text/image/video/audio input, up to 2K output, 5–15 second
duration, and up to 12 reference files. Check the live official documentation
before building production controls because limits can change.

This is an independent BeatAPI curation project. It does not claim that
MiniMax H3 is available through the BeatAPI workflow API.

## Validate locally

```bash
npm test
```

The validator checks schema shape, unique slugs, HTTPS sources, prompt depth,
and explicit evidence status without external dependencies.

## License

Original prompt text and documentation are licensed under
[CC BY 4.0](./LICENSE.md). Validation code is licensed under the MIT terms in
the same file. Third-party linked media and sources retain their original
rights.
