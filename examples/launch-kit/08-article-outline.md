# Article outline: launch-kit

> **Before publishing:** write the article yourself from this outline. DEV's [guidelines for AI-assisted articles](https://dev.to/guidelines-for-ai-assisted-articles-on-dev) require accuracy and disclosure, and do not allow AI-generated articles that promote the author's own project. Teach something; the project is the example.

If AI helps with more than this outline (editing, code explanations), use DEV's AI disclosure option when you publish.

## Angle

**How I built it:** two small problems that turned out harder than they look (reading a repo's git facts without running git, and counting characters the way X does), plus one design idea: templates that double as a contract for a checker. launch-kit is the worked example; readers leave with techniques they can reuse in any Node tool.

## Title options

1. Counting characters like X does, and other things I learned building a launch tool
2. Reading a Git repo without running git: notes from building launch-kit
3. How I built launch-kit, a Claude Code skill that prepares an open-source launch

Option 1 leads with something any developer can learn from; option 3 is the plainest if you want the name in the title.

## dev.to front matter

```yaml
---
title: Counting characters like X does, and other things I learned building a launch tool
published: false
description: How launch-kit reads a repo without running git, counts X posts the way X does, and checks every draft against its limits.
tags: showdev, opensource, javascript, node
cover_image: {{URL of the 1000 × 420 cover, after you upload it}}
---
```

No `canonical_url`: dev.to is the first place it appears (see Cross-posting).

Hashnode: up to 5 tags: open-source, javascript, nodejs, developer-tools, claude (check that each exists in Hashnode's tag list).

## Outline

### 1. Hook

Three numbers for one short post. Take `Ship it 🚀 https://github.com/miraya-dev/launch-kit`: JavaScript's `.length` says 51, counting code points gives 50, and X counts it as 34, because every link is 23 and an emoji is 2. (These are real outputs of `plainLength` and `xLength` from `check-limits.mjs`.) A launch post that "fits" in your editor can still fail, or a link can cost more than you think. Then one line on what launch-kit is.

### 2. Context

What exists: each platform's rules pages, GitHub's Open Source Guide on [finding users](https://opensource.guide/finding-users/), asking a chat assistant for a post, and README generators like [readme-ai](https://github.com/eli64s/readme-ai). All useful; none of them read your repo, check lengths and carry each channel's rules together. Keep it short and fair.

### 3. Reading git facts without running git

Why: the facts must be the same on every machine, with no git binary and no network. What to explain: the branch from `.git/HEAD`; remotes from `.git/config`; tags from `refs/tags/` plus `packed-refs`; worktrees and submodules, where `.git` is a file pointing at the real git dir (plus `commondir`); stripping `user:token@` from remote URLs before printing. · show: `readGit` and `redactUrl` in `skills/launch-kit/scripts/repo-facts.mjs`, and the test "never prints credentials stored in a git remote URL" in `tests/repo-facts.test.mjs`.

### 4. Counting characters like X

What to explain: replace URLs first (each = 23); split the rest into graphemes with `Intl.Segmenter`, so a joined emoji like 👩‍💻 counts once; an `Extended_Pictographic` grapheme counts 2; code points in the light ranges (U+0000 to U+10FF and a few punctuation blocks) count 1, everything else 2, following twitter-text v3. · show: `xLength` and the `X_LIGHT` table in `skills/launch-kit/scripts/check-limits.mjs`, and the test "xLength weighs links, emoji and wide characters like X does".

### 5. Templates as a contract

What to explain: every length-limited field lives in a fenced block whose info string carries the limit (`text limit=60`, `text limit=280 x`, `text topics`). The checker reads only those blocks, labels each with the nearest heading and exits 1 if anything is over, so the same check works locally and in CI. · show: `checkMarkdown` in `check-limits.mjs`, one block from `templates/05-product-hunt.md`, and the CI step in `.github/workflows/test.yml`.

### 6. Result

What the user gets: a `launch/` folder with 11 files, and a checker that reports "0 over the limit". Mention the ethics rules in one paragraph: it never posts, every draft says you're the maker, Hacker News gets notes only. · visual: the `launch/` file tree and the `check-limits.mjs` output (or `docs/demo.gif`).

### 7. Limits and what's next

From README "Limitations": no stars or traffic data, rules change (verify each community), image briefs not images, English by default. From the code: `.gitignore` negations aren't supported yet; manifests are read only in the folder you point it at. What's next: {{your plans after launch week}}.

### 8. Try it

`/plugin marketplace add miraya-dev/launch-kit`, then `/plugin install launch-kit@launch-kit` · https://github.com/miraya-dev/launch-kit · the feedback you want: rules for communities the references don't cover yet, and any post where the X count was wrong.

## Cover image brief

1000 × 420 px: the hook as an image. One line of monospace text, `Ship it 🚀 <link>`, and under it three labeled numbers: `.length 51 · code points 50 · X 34`, with the X number in the amber accent. Use the dark navy background from `docs/social-preview.png`, with the small "launch-kit" wordmark bottom right. Keep everything well inside the edges: dev.to crops covers in some views.

## Cross-posting

Publish on dev.to first on Thursday 19 November (D+2), without `canonical_url`. Post a copy on Hashnode a week later (around Thursday 26 November) with the original URL set to the dev.to post in the article settings. If you'd rather keep the original on your own site, publish there first ({{your blog or the Miraya site, if it has one}}) and set `canonical_url` on both copies.
