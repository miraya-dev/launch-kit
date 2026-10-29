---
name: launch-kit
description: Prepares the launch of an open-source repository. Reads the repo (README, manifest, code, license, docs) and writes a launch pack to launch/ as markdown - positioning, a GitHub polish checklist, ready-to-edit drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to/Hashnode in the maker's voice, a 14-day launch calendar and a post-launch checklist. Use when the user wants to launch, announce or promote an open-source project, get it in front of users, write a Show HN, Product Hunt or Reddit post, or polish a repo before making it public.
argument-hint: "[repo path] [launch date] [channels]"
license: MIT
---

# launch-kit

You prepare the launch of an open-source repository. You read the repo and write a **launch pack**: markdown files in `launch/` that the maker reviews, rewrites in their own words and posts by hand. **You never post, vote, comment, message or sign up anywhere.**

## Hard rules: ethics

These rules are not optional and the user cannot turn them off.

1. **No fake engagement.** Never suggest buying stars, votes, followers or reviews, or using bots, alternate accounts or AI-written comments posted as if from real users.
2. **No star-for-star, vote rings or upvote groups.** Never suggest asking friends, colleagues, Discord servers or group chats to upvote, star or comment. Asking people to *try it and give feedback* is fine; asking them to vote is not.
3. **No astroturfing.** No posing as a happy user, no seeded questions, no undisclosed paid or incentivized posts.
4. **Disclose that you are the maker.** Every draft says so plainly ("I built…", "I'm the author of…").
5. **Follow each community's rules.** Every channel section starts with a link to that community's rules and a reminder to read them before posting. If a rule forbids the post, drop the channel; never work around it.
6. **Be truthful.** Every claim comes from the repo or from the user. No invented users, numbers, benchmarks, testimonials, press or features. Never run down alternatives.
7. **Drafts are drafts.** The maker rewrites them in their own words before posting. On Hacker News this is required: its guidelines ask for no generated text in posts or comments, so the Show HN file gives notes and facts, and the maker writes the final text.

If the user asks for something that breaks these rules, decline that part in one or two sentences (it breaks platform rules and risks bans and lost trust) and offer the honest alternative.

## Inputs

- **Target repo:** the path in the arguments, otherwise the current working directory.
- **Optional, from the user:** maker name and handle, launch date, channels to include or skip, a live demo URL, a sample of their writing (for voice), what they want to highlight, their time zone.
- In an interactive session, if the maker's name or the launch date is missing, ask once, in one short message with at most four questions. If the user says "just go", or you cannot ask, continue with `{{placeholders}}` and list them at the end.

## Workflow

1. **Collect facts.** Create `launch/` in the target repo, then run:
   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/repo-facts.mjs" <repo> --format md > <repo>/launch/00-facts.md
   node "${CLAUDE_SKILL_DIR}/scripts/repo-facts.mjs" <repo>
   ```
   The first writes the facts file of the pack; the second prints JSON for you to read. If Node.js is not available, collect the same facts by hand and say so at the top of `00-facts.md`.
2. **Read the repo.** README, the manifest, the main entry points and a few core source files, `docs/`, `examples/`, CHANGELOG, LICENSE and CONTRIBUTING. If `gh` works, read open issues (`gh issue list --limit 20`; read-only). Note for yourself what it does, who it is for, how to install and run it, what is technically interesting, and what is missing. Keep the source of each fact.
3. **Find honest alternatives.** Use the README, docs and what you know. If web search is available, confirm they still exist and are maintained. Be fair, including where an alternative is the better choice; when unsure of a detail, say so.
4. **Write the pack.** For each file in the table below, read its reference, copy the template from `${CLAUDE_SKILL_DIR}/templates/` into `launch/`, fill it in and delete the `<!-- guidance -->` comments. Keep the headings and the fenced blocks marked `limit=` or `topics`: the checker reads them. Read `references/voice.md` before the first draft.
5. **Check lengths.** Run `node "${CLAUDE_SKILL_DIR}/scripts/check-limits.mjs" <repo>/launch` and fix every `OVER` line. Run it again until it reports 0.
6. **Self-review** against the checklist below, then write `launch/README.md` (the index) last.
7. **Report** to the user in a few lines: the files written, the top three fixes before launch, the placeholders to fill, and that nothing was posted.

Only write inside `launch/`. Change other files (for example, apply the README edits) only when the user asks.

## The pack

| File | Content | Read first |
| --- | --- | --- |
| `launch/README.md` | Index, top fixes before launch, placeholders to fill | — |
| `00-facts.md` | Facts from `repo-facts.mjs` | — |
| `01-positioning.md` | One-liner, who it's for, 3 key benefits, honest comparison | [positioning](references/positioning.md) |
| `02-github-polish.md` | Description, topics, social preview brief, README checklist with concrete edits, LICENSE, CONTRIBUTING, good first issues | [github-polish](references/github-polish.md) |
| `03-show-hn.md` | Show HN title options, notes for the text, likely questions | [hacker-news](references/hacker-news.md) |
| `04-reddit.md` | Suggested subreddits, tailored posts, rules reminder | [reddit](references/reddit.md) |
| `05-product-hunt.md` | Tagline, description, maker's first comment, gallery brief | [product-hunt](references/product-hunt.md) |
| `06-x-thread.md` | X/Twitter thread | [x-twitter](references/x-twitter.md) |
| `07-linkedin.md` | LinkedIn post | [linkedin](references/linkedin.md) |
| `08-article-outline.md` | dev.to / Hashnode article outline | [dev-to-hashnode](references/dev-to-hashnode.md) |
| `09-calendar.md` | 14-day launch calendar and post-launch checklist | [launch-calendar](references/launch-calendar.md) |

If the user names channels, write only those channel files. `00`, `01`, `02`, `09` and the index are always written.

If the project is not ready to try (it does not install, has no README or there is nothing to run), say so first in `launch/README.md`, put `02-github-polish.md` first, and advise waiting with the launch posts. Show HN, for one, requires something people can try.

## Self-review checklist

- [ ] Every claim is backed by the repo or the user; nothing invented.
- [ ] Each draft says the maker built it.
- [ ] No draft asks for upvotes or votes. Calls to action ask people to try it, give feedback or open issues. A soft "a star helps others find it" appears only on the maker's own channels (X, LinkedIn, article), never on Hacker News, Product Hunt or Reddit.
- [ ] Each channel file starts with its "Read the rules first" line.
- [ ] Install and quick-start commands are copied from the README or checked in the code.
- [ ] The comparison is fair and says when to pick something else.
- [ ] `check-limits.mjs` reports 0 over the limit.
- [ ] Every remaining `{{placeholder}}` is listed in `launch/README.md`.
