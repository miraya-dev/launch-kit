# Launch pack: launch-kit

launch-kit is a Claude Code skill that reads your repo and writes a launch pack you edit and post yourself.

> **Drafts, not posts.** Nothing in this folder has been posted anywhere. Read each file, rewrite it in your own words, read each community's rules, then post by hand. Hacker News asks for no generated text, so write that post yourself from the notes in `03-show-hn.md`.

The project is ready to try: the README has an install path, a quick start and usage examples, the plugin and marketplace files are in place, and all 22 tests pass (`node --test`). The fixes below are about what visitors see first, not about whether it works.

Launch day is **Tuesday 17 November 2026**; times in `09-calendar.md` are Morocco time (UTC+1).

## Before you launch: top 3 fixes

1. **Add `examples/launch-kit/`.** README line 46 links to it, `.gitignore` and `CONTRIBUTING.md` describe it, and CI's last step runs `check-limits.mjs examples/launch-kit` (`.github/workflows/test.yml`, line 26). The folder isn't in the repo, so that step exits 1 (I ran it: `ENOENT`) and the test badge goes red once CI runs on `main`. Copy this pack there after you've reviewed it and filled the placeholders. It's also the only way people without Claude Code can see what launch-kit does, which matters for Show HN.
2. **Record a demo GIF and put it under the badges.** The README shows only the static social preview card (`has_gif: false` in `00-facts.md`). A 15 to 20 second run (prompt → files appear in `launch/` → "0 over the limit") is needed for Show HN, Product Hunt and the first post of the X thread. The ready-to-paste README top is in `02-github-polish.md`.
3. **Cut v0.1.0 and set the description and topics.** `00-facts.md` shows 0 release tags while both manifests say 0.1.0, there's no CHANGELOG, and `package.json` has no keywords. Commands are in `02-github-polish.md`. While you're there, check that `miraya-dev/.github` really has the CODE_OF_CONDUCT and SECURITY files that `CONTRIBUTING.md` links to.

Not verified from this session: the live GitHub description, topics, social preview setting, repo visibility and open issues (`gh` needed approval and the GitHub connector didn't connect). Check them before D-5.

## Files

| File | What's inside |
| --- | --- |
| [00-facts.md](00-facts.md) | Facts collected from the repository |
| [01-positioning.md](01-positioning.md) | One-liner, who it's for, 3 key benefits, honest comparison |
| [02-github-polish.md](02-github-polish.md) | Description, topics, social preview brief, README edits, community files, good first issues |
| [03-show-hn.md](03-show-hn.md) | Show HN title options, notes for your text, likely questions |
| [04-reddit.md](04-reddit.md) | Suggested subreddits and tailored posts |
| [05-product-hunt.md](05-product-hunt.md) | Tagline, description, maker's first comment, gallery brief |
| [06-x-thread.md](06-x-thread.md) | X/Twitter thread |
| [07-linkedin.md](07-linkedin.md) | LinkedIn post |
| [08-article-outline.md](08-article-outline.md) | dev.to / Hashnode article outline |
| [09-calendar.md](09-calendar.md) | 14-day launch calendar and post-launch checklist |

## Fill these in

- `02-github-polish.md`: `{{launch-kit page on the Miraya site}}` (optional; remove the `--homepage` note if there's no page)
- `03-show-hn.md`: `{{macOS or Linux}}` (second test platform), `{{the moment you decided to build it, in your words}}`, the answer on other agents ("not tested" if you haven't tried), the usage of one run (or drop it), `{{your plans}}`
- `04-reddit.md`: `{{what changed in v0.1.1, from launch-week feedback}}` (r/ClaudeCode post, D+5)
- `05-product-hunt.md`: `{{what's next, …}}` in the first comment, `{{YouTube link, if you make it}}`
- `07-linkedin.md`: `{{one honest lesson from building it or from launch week, in your words}}`
- `08-article-outline.md`: `{{URL of the 1000 × 420 cover, after you upload it}}`, `{{your plans after launch week}}`, `{{your blog or the Miraya site, if it has one}}`
- `09-calendar.md`: `{{macOS or Linux}}`

Also check before posting: the drafts that mention the README fixes (`06-x-thread.md` single post 2, `07-linkedin.md`, the r/SideProject post) and the ones that point to `examples/launch-kit/` are only true once those fixes are done.

## Ground rules

- Say you are the maker in every post.
- Ask people to try it and give feedback. Never ask for upvotes, and never trade stars or votes.
- No second accounts, no paid or automated engagement.
- Read and follow each community's rules; skip a channel if its rules say no.

_Prepared with [launch-kit](https://github.com/miraya-dev/launch-kit) on 29 October 2026. Lengths checked with `check-limits.mjs`._
