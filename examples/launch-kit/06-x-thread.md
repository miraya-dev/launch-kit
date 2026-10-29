# X thread: launch-kit

> **Before posting:** follow [X's rules](https://help.x.com/en/rules-and-policies/x-rules) on spam and platform manipulation: no engagement bait, no mass-tagging, no bought reach. Counts below use X's weighting (a link = 23, emoji = 2).

Post it on launch day (Tuesday 17 November) after your Show HN answers calm down, around 19:00 in Morocco (13:00 ET). Link the repo, not the HN thread.

## Thread

**1/ Hook** (attach: `docs/demo.gif`, the 15 to 20 s run from `02-github-polish.md`)

```text limit=280 x
I built launch-kit, an open-source Claude Code skill that reads your repo and writes a launch pack: positioning, README fixes, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day plan.

You edit the drafts and post them yourself.
```

**2/ The problem**

```text limit=280 x
Building a project is one job. Launching it is another.

Every community has its own rules. Show HN wants something people can try and no generated text. Many subreddits limit self-promotion. Paste the same post everywhere and some of it gets removed.
```

**3/ How it works** (attach: screenshot of `00-facts.md`, the "Launch readiness" list)

```text limit=280 x
How it works:

1. A zero-dependency Node script collects facts from your files: license, languages, tests, CI, demo media, community files.
2. Claude reads the README and the code.
3. It fills one template per channel, using that channel's rules.
```

**4/ Every length checked** (attach: `check-limits.mjs` output)

```text limit=280 x
Every length-limited field gets checked before you paste: Product Hunt tagline (60), HN titles (80), X posts (280, links count as 23, emoji as 2), the LinkedIn opening, GitHub topics.

Every post in this thread went through that check.
```

**5/ It doesn't post for you**

```text limit=280 x
It never posts, votes or comments. Every draft says you're the maker. It won't suggest vote rings, bought stars or second accounts.

For Hacker News it only gives notes: HN asks for no generated text, so you write the words.
```

**6/ What's not done yet**

```text limit=280 x
What it doesn't do yet: it can't see your stars or traffic, it can't see current subreddit rules (verify them yourself), it writes image briefs but not images, and it's English by default.
```

**7/ Try it**

```text limit=280 x
Try it in Claude Code:

/plugin marketplace add miraya-dev/launch-kit
/plugin install launch-kit@launch-kit

https://github.com/miraya-dev/launch-kit

Feedback and issues welcome. If it's useful, a star helps others find it.
```

## Single posts for later in the week

A tip (Thursday or Friday):

```text limit=280 x
Tip: launch-kit's facts script works without Claude. After cloning it:

node skills/launch-kit/scripts/repo-facts.mjs ../your-repo --format md

You get a launch-readiness checklist: LICENSE, tests, CI, demo media, CODE_OF_CONDUCT, SECURITY, issue templates, release tags.
```

A screenshot of `00-facts.md` before the fixes (post only after the fixes are really done):

```text limit=280 x
Before launching, I ran launch-kit on its own repo. It found no release tag, no CHANGELOG, and a README link to an examples folder that didn't exist yet.

All three fixed before launch day.
```

A question (weekend):

```text limit=280 x
Makers who've launched an open-source project: which community's rules surprised you the most?
```

## Notes

- Pin the thread for launch week; reply to replies.
- 0 to 2 hashtags; tag people only if they're involved.
- Bluesky (300 characters) and Mastodon (500) take the same thread with small edits.
