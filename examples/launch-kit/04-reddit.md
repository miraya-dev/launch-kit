# Reddit: launch-kit

> **Read the rules first.** Every subreddit sets its own rules on self-promotion. Before each post, read that subreddit's rules (sidebar or About tab), wiki and pinned posts. Some allow project posts only on certain days or in a weekly thread; some not at all. If a rule says no, skip that subreddit. The notes below are a starting point: **verify each one**, because rules change.

## Suggested subreddits

| Subreddit | Why it fits | Rule to check (verify) | Post type | Day |
| --- | --- | --- | --- | --- |
| r/ClaudeAI | People who use Claude and Claude Code; a plugin they can install right away | Whether project posts need a specific flair, a format or a megathread; any self-promotion limits | text | D+1, Wed 18 Nov |
| r/opensource | Open-source maintainers; the pack is about launching open source | Whether project announcements are allowed, and whether they must be text posts that explain the project | text | D+1, Wed 18 Nov |
| r/SideProject | Makers sharing what they built, many about to launch | Required title format or flair; any rule against tools aimed at the sub's own members | text | D+4, Sat 21 Nov |
| r/ClaudeCode | Claude Code users and skill authors (an unofficial community) | I couldn't find its rules from here: read the sidebar and pinned posts. It shares many members with r/ClaudeAI, so post only if its rules allow it, days later and with a different angle | text | D+5, Sun 22 Nov, with v0.1.1 |

Times: US morning, 08:00 to 10:00 ET, is 14:00 to 16:00 in Morocco. Post when you can stay for a few hours.

## Post for r/ClaudeAI

**Title**

```text limit=300
I made launch-kit, an open-source Claude Code skill that reads your repo and writes launch drafts you post yourself
```

**Body**

```markdown
I'm the maker. I built launch-kit at Miraya, my small software studio, and it's MIT-licensed.

Point it at a repo and it writes a launch pack to `launch/`: positioning, a GitHub checklist with concrete README edits, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day calendar. It never posts anything; you rewrite the drafts and post them yourself.

A few things about how it's built:

- Two zero-dependency Node scripts do the deterministic parts. One collects facts from the repo's files (license, languages, tests, CI, demo media, community files). The other checks every length limit, counting X posts the way X does (links as 23, emoji as 2).
- The SKILL.md is short. Each channel has its own reference file, read only when that part of the pack is written.
- The ethics are hard rules in SKILL.md: no vote rings, no fake accounts, every draft says you're the maker. For Hacker News it only gives notes, because HN asks for no generated text.

Install in Claude Code:

    /plugin marketplace add miraya-dev/launch-kit
    /plugin install launch-kit@launch-kit

What it doesn't do: it can't see your stars or traffic, it can't see current subreddit rules (you verify them), and it writes image briefs, not images.

https://github.com/miraya-dev/launch-kit

A question for people here: does "notes only" for Hacker News make sense to you, or should a tool like this skip HN entirely?
```

## Post for r/opensource

**Title**

```text limit=300
I built launch-kit, an MIT-licensed tool that prepares an open-source launch from what's actually in your repo
```

**Body**

```markdown
I'm the author of launch-kit. It started from a simple observation: building an open-source project is one job and launching it is another, and every community has its own rules about self-promotion.

launch-kit is a Claude Code skill. It reads your repository and writes a launch pack as markdown: a GitHub polish checklist (description, topics, social preview, README edits, LICENSE / CONTRIBUTING / CODE_OF_CONDUCT / SECURITY, good first issues, a first release), positioning with a fair comparison to alternatives, drafts for each channel, and a 14-day calendar. It never posts for you.

The part that may be useful even if you don't use Claude: the facts script runs on its own with Node 18+ and no dependencies. After cloning the repo:

    node skills/launch-kit/scripts/repo-facts.mjs path/to/your-repo --format md

It prints a launch-readiness checklist from your files: license, tests, CI, demo media in the README, community files, issue templates, release tags. It reads files only; it never runs git and never touches the network.

Limits: it can't see stars, traffic or GitHub releases (only local tags), and `.gitignore` negations aren't supported yet.

https://github.com/miraya-dev/launch-kit

I'd like to hear from maintainers: what do you check in a repo before you'd try a project you found in a launch post?
```

## Post for r/SideProject

**Title**

```text limit=300
I made a Claude Code skill that prepares the launch of a side project, then leaves the posting to you
```

**Body**

```markdown
I'm the maker of launch-kit. I run a small software studio, Miraya, and I'm launching launch-kit with the pack it wrote for its own launch.

You point it at your repo and it writes a `launch/` folder: one-liner and positioning, a README and GitHub checklist, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day calendar with one big channel per day, so you can stay and answer comments instead of posting everywhere at once.

When I ran it on its own repo, it flagged three things still missing: no release tag, no CHANGELOG, and a README link to an examples folder that didn't exist yet.

It never posts, votes or comments for you, and every draft says you're the maker. You rewrite them in your own words.

It's free and MIT-licensed. You need Claude Code to run it; the pack it wrote for this launch is in the repo under `examples/launch-kit/` if you just want to see the output.

https://github.com/miraya-dev/launch-kit

For those who've launched before: which day of your launch week mattered most, and why?
```

## Post for r/ClaudeCode

**Title**

```text limit=300
I'm the author of launch-kit, a Claude Code skill with one reference file per channel. Here's how it's structured, plus what changed after launch week (v0.1.1)
```

**Body**

```markdown
I built launch-kit, a Claude Code plugin that reads a repo and writes a launch pack (positioning, GitHub polish, channel drafts, a 14-day calendar). It never posts. This post is about how the skill is put together, for people who write skills.

- **Progressive disclosure.** SKILL.md holds the workflow and the hard rules. Each channel has its own file in `references/`, read only when that part of the pack is written, plus a template per output file in `templates/`.
- **Templates as a contract.** Length-limited fields sit in fenced blocks like `text limit=60` or `text limit=280 x`. A small script (`check-limits.mjs`) reads those blocks and reports every field over its limit, so the model has something deterministic to check against.
- **Deterministic facts first.** `repo-facts.mjs` collects facts from the files before Claude reads anything (no network, no git binary, the same output for the same repo), so the drafts start from facts, not guesses.
- **Rules the user can't turn off.** No vote rings, no fake accounts, say you're the maker, follow each community's rules.
- **Plugin and marketplace in one repo**, scripts tested with `node --test` on Node 20, 22 and 24.

What changed in v0.1.1 after launch week: {{what changed in v0.1.1, from launch-week feedback}}.

    /plugin marketplace add miraya-dev/launch-kit
    /plugin install launch-kit@launch-kit

https://github.com/miraya-dev/launch-kit

Question for skill authors: how do you test a skill's behavior beyond its scripts?
```

## Etiquette

- Say you're the maker in the first line.
- One or two subreddits a day; never the same text everywhere.
- Stay for the first hours and answer comments.
- Never ask for upvotes; no second accounts; no friends asked to comment.
- If a post is removed, accept it. Ask the moderators politely only if you believe it followed the rules.
