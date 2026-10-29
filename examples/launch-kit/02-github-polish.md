# GitHub polish: miraya-dev/launch-kit

I couldn't read the live GitHub settings (description, topics, social preview, open issues) from this session: `gh` needed an approval I couldn't get, and the GitHub connector didn't connect. Everything below comes from the files on disk. Compare with what's live before running the commands.

## Repository description

```text limit=350
A Claude Code skill that reads your repo and writes an honest launch pack: positioning, README fixes, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day plan.
```

```bash
gh repo edit miraya-dev/launch-kit --description "A Claude Code skill that reads your repo and writes an honest launch pack: positioning, README fixes, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day plan."
```

Website field: there is no docs site, and `plugin.json` uses the repo itself as the homepage. If you add a launch-kit page to the Miraya site, set it with `--homepage "{{launch-kit page on the Miraya site}}"`; otherwise leave it empty.

## Topics

```text topics
claude-code
claude-code-plugin
claude-skills
agent-skills
open-source
developer-tools
product-launch
marketing
readme
```

```bash
gh repo edit miraya-dev/launch-kit --add-topic claude-code,claude-code-plugin,claude-skills,agent-skills,open-source,developer-tools,product-launch,marketing,readme
```

Open `https://github.com/topics/<topic>` for each one and drop any that have very few repositories; I couldn't check the counts. `package.json` has no `keywords` (that's why `00-facts.md` shows none); `.claude-plugin/plugin.json` lists `launch, open-source, marketing, show-hn, product-hunt, reddit, github, readme`. Consider copying the final topics into `package.json` too.

## Social preview image brief

**Status: done in the repo.** `docs/social-preview.png` is 1280 × 640 px and 204 KB, and it already fits this brief. Upload it if it isn't set yet.

- **Size:** 1280 × 640 px, PNG, 204 KB (fits the under-1 MB rule).
- **Text:** "launch-kit" and "Prepare an honest launch for any open-source repo.", with the kicker "Claude Code skill · open source".
- **Visual:** a terminal window listing the `launch/` files and "✓ 0 over the limit", plus chips for each part of the pack.
- **Colors and type:** dark navy background, amber hyphen accent, green kicker, monospace wordmark. High contrast, readable as a thumbnail.
- **One fix to consider:** the footer line ("No fake engagement · Say you're the maker · Follow each community's rules" and "Built by Miraya") sits about 40 px from the bottom edge, inside the 80 px margin some platforms crop. Move it up about 40 px, or accept that some cards may cut it.
- **Upload:** Settings → General → Social preview (no API; upload by hand).

## README checklist

| Item | Status | Concrete edit |
| --- | --- | --- |
| Hero line (what it is, for whom) | done | "**Prepare an honest launch for any open-source repo.**" plus a paragraph naming the category (Claude Code skill) and the output. Keep it. |
| Badges (3 to 5, meaningful) | done | Three: test, license, Claude Code plugin. After cutting v0.1.0, add a release badge (below). |
| Demo GIF or screenshot in the first screen | partial | Line 11 shows `docs/social-preview.png`, a static card. Nothing shows the skill running. Record a 15 to 20 s GIF (type the prompt, files appear in `launch/`, `check-limits.mjs` prints "0 over the limit"), save it as `docs/demo.gif` and put it right under the badges. |
| 30-second quick start (install, run, expected output) | done | Two `/plugin` commands, one prompt, "The pack appears in `launch/`." Move the requirements (Claude Code; Node.js 18+ for the scripts) up to the quick start: today they only appear under Install. |
| Why (the problem) | done | `## Why` |
| What (features as outcomes) | done | `## What you get`, a table of all 11 files. |
| How (how it works) | done | `## How it works`, four steps. |
| Comparison or FAQ | missing | Add the FAQ below. |
| Contributing and license sections | done | Both present and linked. |
| Links work | **broken** | Line 46 links to [`examples/launch-kit/`](examples/launch-kit/), which isn't in the repo (`git ls-files` has no `examples/`). CI's last step runs `check-limits.mjs examples/launch-kit` (`.github/workflows/test.yml`, line 26); I ran it locally and it exits 1 with `ENOENT`. Fix: after reviewing this pack, copy it to `examples/launch-kit/` and commit. |

### Ready-to-paste edits

**1. New README top:** the demo GIF under the badges, a release badge, and the requirements moved into the quick start. The first two paragraphs stay as they are.

```markdown
# launch-kit

**Prepare an honest launch for any open-source repo.**

launch-kit is a [Claude Code](https://code.claude.com) skill that reads your repository and writes a launch pack to `launch/`: positioning, GitHub polish with concrete README edits, ready-to-edit drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day launch calendar. Everything stays on your machine as markdown. You review it, rewrite it in your own words and post it yourself.

[![test](https://github.com/miraya-dev/launch-kit/actions/workflows/test.yml/badge.svg)](https://github.com/miraya-dev/launch-kit/actions/workflows/test.yml)
[![release](https://img.shields.io/github/v/release/miraya-dev/launch-kit)](https://github.com/miraya-dev/launch-kit/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-d97757)](#install)

![launch-kit running in Claude Code: the pack appears in launch/ and check-limits reports 0 over the limit](docs/demo.gif)

## Quick start

You need [Claude Code](https://code.claude.com). Node.js 18 or newer runs the two helper scripts; without Node, Claude collects the facts by hand.

In Claude Code:
```

(The quick start continues unchanged from the `/plugin marketplace add` block.)

**2. FAQ section.** Insert it before `## Limitations`.

```markdown
## FAQ

**Does it post anything for me?**
No. It writes markdown files in `launch/` and never posts, votes, comments or signs up anywhere. You rewrite the drafts and post them yourself.

**Can I see what it does without Claude Code?**
Yes. [`examples/launch-kit/`](examples/launch-kit/) is the pack it wrote for its own launch. The two scripts also run on their own with Node.js 18+: `node skills/launch-kit/scripts/repo-facts.mjs path/to/repo --format md` prints a launch-readiness checklist for any repo. The drafts themselves need Claude Code.

**Do the scripts send my code anywhere?**
No. `repo-facts.mjs` and `check-limits.mjs` only read local files: no network, no dependencies, and `repo-facts.mjs` never runs git. Claude reads your files the way it does in any Claude Code session.

**Which languages and ecosystems does it understand?**
Claude reads code in any language. `repo-facts.mjs` also reads the manifests of 13 ecosystems (npm, PyPI, crates.io, Go modules, Packagist, pub.dev, JSR, RubyGems, Maven, Gradle, NuGet, Swift Package Manager, Hex) and detects 10 CI providers.

**Why does the Hacker News file have notes instead of a post?**
Hacker News asks for no generated text in posts or comments, so the pack gives you facts and likely questions, and you write the words.
```

## Community files

| File | Status | Action |
| --- | --- | --- |
| LICENSE | found: MIT (`LICENSE`, © 2026 Moncef El hirech (Miraya); matches `package.json` and `plugin.json`) | None. |
| CONTRIBUTING | found: `CONTRIBUTING.md` | Good: setup, layout, rules for changes. It also describes `examples/` as "real packs produced by the skill", another reason to add it. |
| CODE_OF_CONDUCT | not in the repo; `CONTRIBUTING.md` links to `miraya-dev/.github/blob/main/CODE_OF_CONDUCT.md` | Check that the file exists (I couldn't). If it does, GitHub uses it for every repo in the org. If not, add the Contributor Covenant there. |
| SECURITY | not in the repo; linked to `miraya-dev/.github/blob/main/SECURITY.md` | Same check. Also turn on private vulnerability reporting in the repo settings (Security section). |
| Issue templates | none | Add two (good first issue 3 below), unless `miraya-dev/.github` already provides org-wide ones. |
| Pull request template | none | Optional: a three-line checklist that mirrors CONTRIBUTING: tests added and `npm test` passes, a source link for any rule or limit change, a Conventional Commit title. |
| CHANGELOG | none | Add `CHANGELOG.md` with a 0.1.0 entry before cutting the release. |

GitHub can use community files from the org's `.github` repository. Check **Insights → Community standards** on the repo before adding duplicates.

## Good first issues

Four real, small tasks from the code. I couldn't read the open issues, so check none of these already exist.

### 1. check-limits: clear message when the folder doesn't exist

**Context:** when the target is missing, `check-limits.mjs` prints Node's raw error, e.g. `check-limits: ENOENT: no such file or directory, stat 'C:\…\examples\launch-kit'`. This is exactly what a first-time user (or a CI log) sees. A line like `check-limits: no such file or folder: examples/launch-kit` is clearer.
**Files:** `skills/launch-kit/scripts/check-limits.mjs` (`markdownFiles`, `main`), `tests/check-limits.test.mjs`.
**Done when:** a missing path prints one line naming the path as the user typed it, the exit code stays 1, and a test covers it.
**How to test:** `npm test`, then `node skills/launch-kit/scripts/check-limits.mjs does-not-exist`.

```bash
gh issue create --repo miraya-dev/launch-kit --title "check-limits: clear message when the folder doesn't exist" --label "good first issue" --body "check-limits.mjs prints Node's raw ENOENT error for a missing path. Print one line naming the path as typed (e.g. 'no such file or folder: examples/launch-kit'), keep exit code 1, add a test in tests/check-limits.test.mjs. Files: skills/launch-kit/scripts/check-limits.mjs (markdownFiles, main)."
```

### 2. Tests for `--help` on both scripts

**Context:** both scripts handle `--help` and `-h` (in each `main`), but no test checks it.
**Files:** `tests/repo-facts.test.mjs`, `tests/check-limits.test.mjs`.
**Done when:** each test file runs its script with `--help` and expects exit code 0 and a `Usage:` line.
**How to test:** `npm test`.

```bash
gh issue create --repo miraya-dev/launch-kit --title "Add tests for --help on both scripts" --label "good first issue" --body "repo-facts.mjs and check-limits.mjs both handle --help/-h but no test covers it. Spawn each script with --help and assert exit code 0 and a 'Usage:' line. Files: tests/repo-facts.test.mjs, tests/check-limits.test.mjs."
```

### 3. Issue templates: bug report and "outdated platform rule"

**Context:** there's no `.github/ISSUE_TEMPLATE/`. `CONTRIBUTING.md` says rule and limit changes need a link to the official page; a template makes that the default.
**Files:** `.github/ISSUE_TEMPLATE/bug.yml` (Node.js version, OS, Claude Code version, steps, and the `repo-facts.mjs` output if relevant) and `.github/ISSUE_TEMPLATE/platform-rule.yml` (channel, what changed, link to the official source, date checked).
**Done when:** both show up under "New issue" on GitHub. First check whether `miraya-dev/.github` already has org-wide templates.
**How to test:** push to a branch and open the "New issue" page.

```bash
gh issue create --repo miraya-dev/launch-kit --title "Add issue templates: bug report and outdated platform rule" --label "good first issue" --body "Add .github/ISSUE_TEMPLATE/bug.yml (Node version, OS, Claude Code version, steps, repo-facts output) and platform-rule.yml (channel, what changed, link to the official source, date checked), matching the rules in CONTRIBUTING.md."
```

### 4. repo-facts: support `.gitignore` negations

**Context:** `gitignoreMatcher` skips lines that start with `!` (see the comment above it and README "Limitations"). A repo that ignores `docs/*` but keeps `!docs/demo.gif` loses that GIF from `repo_media_files`.
**Files:** `skills/launch-kit/scripts/repo-facts.mjs` (`gitignoreMatcher`), `tests/repo-facts.test.mjs` (the test "skips files the root .gitignore excludes" already has a `!keep.log` line).
**Done when:** the last matching rule wins, as in git, so `!pattern` re-includes a file; a test covers it; the README "Limitations" line is updated. Like git, it doesn't need to re-include a file whose parent folder is excluded, but say so in the comment.
**How to test:** `npm test`.

```bash
gh issue create --repo miraya-dev/launch-kit --title "repo-facts: support .gitignore negations (!pattern)" --label "good first issue" --body "gitignoreMatcher in skills/launch-kit/scripts/repo-facts.mjs skips '!' lines. Make the last matching rule win, as git does, so '!pattern' re-includes a file. Add a test in tests/repo-facts.test.mjs and update the README Limitations line."
```

Add the `help wanted` label as well if you want them listed at `https://github.com/miraya-dev/launch-kit/contribute`.

## Release

`00-facts.md` shows **0 release tags**, while `package.json` and `.claude-plugin/plugin.json` both say `0.1.0`. Before launch, add `CHANGELOG.md`, then:

```bash
gh release create v0.1.0 --title "v0.1.0" --generate-notes
```

For the launch-week patch (D+5 in `09-calendar.md`), bump `version` in **both** `package.json` and `.claude-plugin/plugin.json` to `0.1.1`, then `gh release create v0.1.1 --generate-notes`.

Extras: pin the repo on the `miraya-dev` org profile and your own `EL-MO-DEV` profile, and consider turning on Discussions so questions don't fill the issue tracker.
