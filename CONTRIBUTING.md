# Contributing

Thank you for helping build a prompt library that preserves evidence as well as
ideas.

## Acceptance criteria

A submission should include:

- a complete, reusable prompt;
- a clear category, mode, duration, and aspect ratio;
- the role of every reference asset;
- the original public source and author, or an explicit original-author claim;
- an honest verification status;
- permission to publish any attached input or output media.

We prefer prompts that teach a repeatable production pattern. A prompt that
only says “cinematic, detailed, viral” will not be accepted.

## Rights and attribution

Do not copy a third-party prompt or media without permission. You may submit a
source link for editorial review, but a public link does not transfer
copyright. When adapting an idea, write an original prompt and cite the source
that informed it.

Do not submit private persons, celebrity likenesses, trademarked characters,
unlicensed music, personal data, or deceptive media without the necessary
rights and context.

## Review flow

1. Open the prompt issue form.
2. A maintainer checks source, rights, completeness, and evidence status.
3. Accepted content is normalized into `prompts/catalog.json`.
4. `npm test` must pass.
5. The website gallery is updated in a separate reviewed change.

Approval is editorial, not automatic. Maintainers may edit formatting while
preserving meaning and attribution.

The English README is generated from `<!-- GENERATED_VIDEO_GALLERY_START -->`
through the end of the file. Do not edit that generated section directly;
update `prompts/catalog.json` or `scripts/build-readme.mjs`, then run
`npm run readme:build`.

## Takedown and corrections

Open an issue titled `Takedown: <entry slug>` or email `support@beatapi.io`.
Include the entry URL, your relationship to the work, and the requested
correction or removal. Maintainers will hide disputed media while reviewing a
credible rights claim.
