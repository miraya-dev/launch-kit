# Changelog

All notable changes to launch-kit are listed here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-10-30

First public release.

### Added

- The `launch-kit` skill: reads a repository and writes a launch pack to `launch/` (positioning, GitHub polish, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to/Hashnode, a 14-day calendar and a post-launch checklist).
- Hard ethics rules in `SKILL.md`: no fake engagement, no vote rings, no astroturfing, follow each community's rules, say you're the maker. Hacker News gets notes only, never generated text.
- One reference per channel with its rules and best practices, and one template per file of the pack.
- `repo-facts.mjs`: deterministic, zero-dependency facts about a repository (languages, license, tests, CI, demo media, community files, release tags), as JSON or markdown, with `--out` for UTF-8 files.
- `check-limits.mjs`: checks every length-limited field of the pack, including X's weighted count and GitHub topic rules.
- Claude Code plugin and marketplace files: `/plugin marketplace add miraya-dev/launch-kit`.
- `examples/launch-kit/`: the pack launch-kit wrote for its own launch, unedited.

[0.1.0]: https://github.com/miraya-dev/launch-kit/releases/tag/v0.1.0
