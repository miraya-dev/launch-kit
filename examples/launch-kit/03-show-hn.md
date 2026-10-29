# Show HN: launch-kit

> **Read the rules first:** [Show HN](https://news.ycombinator.com/showhn.html) · [Guidelines](https://news.ycombinator.com/newsguidelines.html)
>
> HN asks for no generated text in posts or comments. This file gives you notes and facts: **write the title, the text and every reply yourself.**

## Ready check

- [ ] People can try it in minutes without signing up: **only partly.** Running the skill needs Claude Code, which needs a Claude account. Without one, people can read `examples/launch-kit/` (once you add it) and run `node skills/launch-kit/scripts/repo-facts.mjs <any-repo> --format md` after `git clone`, with no account. Say this plainly in your text so nobody feels misled.
- [ ] The README quick start works on a clean machine: install from the marketplace in a fresh Claude Code setup (you're on Windows; also try {{macOS or Linux}}).
- [ ] The repo is public, `examples/launch-kit/` exists and CI is green (it fails until `examples/launch-kit/` exists).
- [ ] You can stay 3 to 4 hours after posting to answer comments
- [ ] Nobody has been asked to upvote or comment

## Title notes

```text limit=80
Show HN: launch-kit – Claude Code skill that turns a repo into launch drafts
```

```text limit=80
Show HN: launch-kit – Reads your repo, writes a launch pack you post yourself
```

```text limit=80
Show HN: launch-kit – Prepare an open-source launch from what's in your repo
```

The first is the most concrete. The second puts the "you post it yourself" part in the title, which answers the first worry HN readers will have.

## URL to submit

https://github.com/miraya-dev/launch-kit

**Timing:** Tuesday 17 November 2026. In November, US Eastern is UTC−5 (US daylight time ends 1 November), so Morocco is 6 hours ahead. A weekday US morning, 08:00 to 10:00 ET, is 14:00 to 16:00 your time. Posting around 14:00 to 15:00 lets you answer until about 18:00 or 19:00. There's no magic hour; pick the time you can stay.

## Notes for your text

- **Who you are:** Moncef El hirech (EL-MO-DEV on GitHub). You run Miraya, a small software studio, and the repo lives under the studio's org, `miraya-dev`. Say it's yours so the org name doesn't hide that.
- **What it is:** a Claude Code skill, shipped as a plugin with its own marketplace file, that reads a repo and writes markdown files to `launch/`: positioning, a GitHub polish checklist, drafts per channel and a 14-day calendar. It never posts.
- **Why you built it:** {{the moment you decided to build it, in your words}}. Facts you can lean on: the README's "Why" (building and launching are two jobs; one post pasted everywhere gets removed).
- **How it works:**
  - `repo-facts.mjs` is zero-dependency Node and reads files only. It never runs git: it reads `.git/HEAD`, `.git/config`, `refs/tags` and `packed-refs` directly, follows the `.git` file of worktrees, and strips credentials from remote URLs. The same repo always gives the same output (there's a test for it).
  - `check-limits.mjs` reads fenced blocks whose info string says `limit=N`, `limit=N x` or `topics`, so the templates are also the contract for the checker. In X mode a URL counts as 23, and `Intl.Segmenter` makes a joined emoji like 👩‍💻 count once, as 2.
  - The skill uses progressive disclosure: a short `SKILL.md`, and one reference per channel, read only when that file of the pack is written.
  - 22 tests (`node --test`), CI on Node 20, 22 and 24.
- **What's different:** compared with asking a chat assistant for a post, it reads the actual repo, checks every length, carries each channel's rules, and treats "no vote rings, no fake accounts, say you're the maker" as rules the user can't turn off. Compared with readme-ai, which generates a README from scratch, launch-kit reviews the README you have and covers the launch around it.
- **The meta point (say it before someone asks):** for HN, launch-kit only gives notes, because of the no-generated-text guideline, and you wrote this post from them. The notes are public in `examples/launch-kit/03-show-hn.md`, so anyone can compare.
- **What's missing:** it doesn't know stars, traffic or GitHub releases (only local tags); it can't see current subreddit sidebars, so rules must be verified; it writes image briefs, not images; English by default; `.gitignore` negations aren't supported; it reads the manifests in the folder you point it at, not packages inside a monorepo.
- **Question for HN:** feedback on the channel rules in `skills/launch-kit/references/`: what's missing or wrong for communities you know?

Formatting: HN shows plain text. Separate paragraphs with blank lines, indent the two install commands by two spaces so they show as code, and paste the URL bare. No headings, bullets or markdown links.

## Likely questions, with facts for your answers

| Question | Facts from the repo |
| --- | --- |
| Did an AI write this post? | The HN file in the pack has notes only, because HN asks for no generated text; you wrote the post (make sure that's true). The notes are in `examples/launch-kit/03-show-hn.md`. |
| Isn't this a tool for spamming communities? | `SKILL.md` has hard rules the user can't turn off: no fake engagement, no vote rings or upvote groups, no astroturfing, disclose you're the maker, follow each community's rules (drop the channel if they say no), true claims only. It never posts. `CONTRIBUTING.md`: pull requests that add vote exchanges, fake engagement or ways around a community's rules will be closed. |
| Why not just ask ChatGPT or Claude for a launch post? | You can, and for one post it's faster. launch-kit adds the repo scan (`repo-facts.mjs`), one reference per channel with links to its rules, the length checker with X weighting, and GitHub polish with concrete README edits. |
| Does it work with Cursor, Codex or other agents? | Built and tested for Claude Code (`.claude-plugin/plugin.json` and `marketplace.json`). The two scripts are plain Node and run anywhere. {{Have you tried SKILL.md in another agent that supports skills? If not, say "not tested".}} |
| Does it send my code anywhere? | The scripts don't: no network, local files only. Claude reads your files as in any Claude Code session, under your own Claude Code settings. |
| What does it cost? | MIT and free. It runs in your Claude Code session, so it uses your Claude plan or API usage. {{Usage of one run on a typical repo, if you measured it; otherwise don't give a number.}} |
| What license is it? | MIT, © 2026 Moncef El hirech (Miraya). |
| How exact is the X count? | Links = 23; an emoji grapheme = 2; code points from U+0000 to U+10FF and a few punctuation ranges = 1; everything else = 2, following twitter-text v3 weighting (`check-limits.mjs`). Covered by `tests/check-limits.test.mjs`. Edge cases can differ from X's composer, so check there too. |
| Does it handle Python, Rust, Go…? | Claude reads any language. `repo-facts.mjs` reads the manifests of 13 ecosystems (npm, PyPI, crates.io, Go modules, Packagist, pub.dev, JSR, RubyGems, Maven, Gradle, NuGet, Swift Package Manager, Hex) and detects 10 CI providers. Facts come from the folder you point it at. |
| How current are the platform rules? | The references were checked in October 2026 (README "Limitations"). Each channel file links the official rules, and CONTRIBUTING asks for a source link on every rule or limit change. |
| What's next? | {{your plans}}. Open items in the repo: `.gitignore` negations, issue templates, a clearer error for a missing folder (see the good first issues in `02-github-polish.md`). |

## Don'ts

- Don't ask anyone to upvote or comment, and don't post the link in group chats asking for support. Don't link the HN thread from X or LinkedIn asking for support either; link the repo.
- Don't reply from another account or paste generated replies.
- Don't delete and resubmit if it gets no traction.
