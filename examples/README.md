# Examples

Real launch packs written by launch-kit, unedited.

## launch-kit: its own launch

[`launch-kit/`](launch-kit/) is the pack launch-kit wrote for its own launch, on 29 October 2026. Start with its [README](launch-kit/README.md), then [`02-github-polish.md`](launch-kit/02-github-polish.md) and [`03-show-hn.md`](launch-kit/03-show-hn.md).

**How it was made.** A fresh, headless Claude Code session (`claude -p`) ran on a clean clone of commit `ac1c433`, with this plugin loaded from the clone (`--plugin-dir .`) and this one prompt:

> /launch-kit:launch-kit . About me: I'm Moncef El hirech (GitHub: EL-MO-DEV). I run Miraya, a small software studio, and launch-kit is my project. Launch day: Tuesday 17 November 2026; I'm in Morocco (UTC+1). Include all channels. Don't ask me questions; use placeholders for anything you don't know.

**Edits:** none. The files are exactly as the skill wrote them, and the `{{placeholders}}` are left for the maker to fill.

**Checks:** 11 files and 26 length-limited fields, 0 over the limit. CI runs `check-limits.mjs` on this folder on every push.

**What it found, and what happened next.** Some of its findings were fixed before this repository went public:

- the missing `examples/` folder (this one);
- links in CONTRIBUTING to organization files that don't exist yet;
- the social preview footer sitting inside the 80 px margin that some platforms crop.

Shortly after, the v0.1.0 release, a CHANGELOG, a FAQ, a code of conduct, a security policy and issue and pull request templates were added. The demo GIF and the good first issues are left for launch week, as its calendar plans. The session ran without GitHub access (no `gh`), which is why the pack says it couldn't check the live repository settings.

Run it on your own repo: see [Quick start](../README.md#quick-start).
