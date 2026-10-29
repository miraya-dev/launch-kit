# Positioning: launch-kit

## One-liner

```text limit=120
launch-kit is a Claude Code skill that reads your repo and writes a launch pack you edit and post yourself.
```

Other options considered:

- "Prepare an honest launch for any open-source repo." (the README hero line): short and good as a tagline, but it doesn't say what launch-kit *is* (a Claude Code skill) or what you get. Keep it as the bold line in the README, not as the one-liner.
- "Turn your repo into drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to.": concrete, but it leaves out positioning, GitHub polish and the calendar, and a list of six platforms reads like a growth tool. That's the wrong first impression for a tool that never posts.

The chosen line wins because it names the category (Claude Code skill), the input (your repo), the output (a launch pack) and the most important difference (you edit and post it yourself), with no adjectives.

## Who it's for

- **Primary:** a solo maintainer or small team who already uses Claude Code and is about to make an open-source repo public, or who shipped one nobody has found yet, and doesn't know each community's rules on self-promotion.
- **Also useful for:** a maintainer who wants a pre-release review of their README and community files without launching anywhere (`02-github-polish.md` alone), and a small studio launching several projects that wants the same process every time.
- **Not for:** people who want posting, scheduling or growth automation (launch-kit never posts, votes or comments); people who don't use Claude Code (the two scripts run on their own with Node, but the drafts need Claude); closed-source or paid SaaS launches (the GitHub polish and the Show HN notes assume an open-source repo).

## The problem

Building the project is one job; launching it is another. Every community has its own rules: Show HN wants something people can try and no generated text, many subreddits limit self-promotion or only allow it on certain days, and an X post counts every link as 23 characters. Most makers either skip the launch or paste the same post everywhere, and some communities remove it.

## 3 key benefits

| Benefit (for the user) | How it delivers it | Proof in the repo |
| --- | --- | --- |
| Start from what's actually in your repo, and see the gaps visitors notice first | A zero-dependency script collects facts from the files (license, languages, tests, CI, demo media, community files, release tags); Claude reads the README and code, then writes a README checklist with paste-ready edits | `skills/launch-kit/scripts/repo-facts.mjs`, README "How it works", `templates/02-github-polish.md` |
| Stay within each community's rules | One reference per channel with links to its official rules; every channel file opens with a "read the rules first" line; for Hacker News the pack gives notes, not text; hard ethics rules the user can't turn off | `skills/launch-kit/references/`, `SKILL.md` "Hard rules: ethics" |
| Nothing gets cut off when you paste it | A checker counts every length-limited field: Product Hunt tagline (60), HN titles (80), X posts (280, links as 23, emoji as 2), the LinkedIn opening, GitHub topics | `skills/launch-kit/scripts/check-limits.mjs`, `tests/check-limits.test.mjs` |

## How it compares

| | launch-kit | Asking a chat assistant directly | [Open Source Guides: Finding Users](https://opensource.guide/finding-users/) | [readme-ai](https://github.com/eli64s/readme-ai) | By hand |
| --- | --- | --- | --- | --- | --- |
| Approach | Claude Code skill: reads the repo, fills one template per channel from that channel's rules, checks lengths | You paste context and ask for a post | A written guide from GitHub and contributors on getting the word out | Python CLI that generates a README from your codebase with an LLM (OpenAI, Anthropic, Gemini or local models through Ollama) | You read each platform's rules and write each post |
| Setup | Two `/plugin` commands in Claude Code | None if you already have an account | None: read it | `pip` / Docker install, plus an LLM provider key or a local model | None |
| Scope | Positioning, GitHub polish, six channels, a 14-day calendar | Whatever you ask for; sees only what you paste; no length or rules check | Strategy and advice; no drafts | The README only | Anything you want |
| License / cost | MIT; needs Claude Code and your Claude plan or API usage | Depends on the service (check current pricing) | Free to read | MIT; LLM API usage unless you run a local model (check current docs) | Free; costs hours |
| Best when | You use Claude Code and want a rules-aware pack built from your repo | You need one quick post and will check the rules yourself | You want to understand launch strategy and write it all yourself | You need a README written from scratch | You know the communities and enjoy writing every post |

**When to pick something else:** If you don't use Claude Code, start with the Open Source Guide and write by hand. If your repo has no README yet, generate or write one first (readme-ai is built for that; launch-kit reviews and edits an existing README rather than writing one from zero). If you need a single post for one channel, a direct prompt is faster. If you want posts scheduled or published for you, launch-kit won't do it: it only writes drafts.

**Sources:** [opensource.guide/finding-users](https://opensource.guide/finding-users/) · [github.com/eli64s/readme-ai](https://github.com/eli64s/readme-ai) · [pypi.org/project/readmeai](https://pypi.org/project/readmeai). Checked 29 October 2026; recheck before posting.

## Words to use and avoid

- **Use:** launch pack, drafts, maker, open source, repo, README, Show HN, Claude Code skill / plugin, "you post it yourself", "read the rules first", "say you're the maker", "try it and give feedback".
- **Avoid:** "AI marketing", "growth hack", "go viral", "automate your launch", "rank #1", "guaranteed", "AI-written posts", "spam-free" (it reads as a jab at other tools), and every word on the hype list in `references/voice.md` (revolutionary, seamless, supercharge, unlock…). Don't use "honest" in every sentence: once per post is enough.
