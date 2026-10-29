# Product Hunt: launch-kit

> **Read the rules first:** [Launch guide](https://www.producthunt.com/launch) · [Sharing your launch](https://www.producthunt.com/launch/sharing-your-launch). Ask for support and feedback, never for upvotes. Check the live submission form: limits change.

## Fit check

**Go, with one condition:** Product Hunt's audience includes many makers getting ready to launch, which is exactly who launch-kit is for, and the pack itself is a visible result. But it's a terminal tool with markdown output that needs Claude Code, so the value isn't visible without a demo. Launch on Friday 20 November only if the demo video or GIF and at least three gallery images are ready by Monday 16 November. Otherwise skip Product Hunt this week and launch there later with the demo. Say in the first comment that it needs Claude Code.

## Name

launch-kit

## Tagline

```text limit=60
Turn your repo into a launch pack you post yourself
```

Alternatives:

```text limit=60
A Claude Code skill that prepares your open-source launch
```

```text limit=60
Launch drafts from your repo, within each site's rules
```

## Description

```text limit=260
launch-kit is a free, open-source Claude Code skill. It reads your repository and writes a launch pack: positioning, README fixes, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day plan. You edit and post everything yourself.
```

## Launch tags (up to 3)

Developer Tools, Open Source, Marketing

Check that these appear in the form's tag list; "Artificial Intelligence" or "GitHub" are alternatives. Links: the repo (https://github.com/miraya-dev/launch-kit), marked free and open source. Makers: your own account; no separate hunter needed.

## Maker's first comment

```text
Hi Product Hunt, I'm Moncef. I run Miraya, a small software studio, and I built launch-kit.

Building a project is one job and launching it is another. Every community has its own rules: Hacker News asks for no generated text, many subreddits limit self-promotion, and pasting the same post everywhere often gets it removed.

launch-kit is a free, MIT-licensed Claude Code skill. You point it at your repo and it writes a launch pack as markdown files: positioning, a GitHub checklist with concrete README edits, drafts for Show HN, Reddit, Product Hunt, X, LinkedIn and dev.to, and a 14-day calendar. A small script checks every length limit, so nothing gets cut off when you paste.

It never posts, votes or comments for you. Every draft says you're the maker, and it won't suggest vote exchanges or fake accounts. You rewrite the drafts in your own words and post them yourself. This comment started as one of those drafts.

You need Claude Code to run it. If you just want to see the output, the pack it wrote for this launch is in the repo under examples/launch-kit.

Next: {{what's next, e.g. the fixes from launch-week feedback}}.

I'd love to know: which channel's draft would you trust least without rewriting it, and why?
```

## Thumbnail and gallery brief

- **Thumbnail (240 × 240):** the "launch-kit" wordmark with the amber hyphen on the dark navy background of `docs/social-preview.png`, cropped square. If the full word is too small at 240 px, use "lk" with the amber hyphen above it.
- **Gallery 1 (1270 × 760, also the social preview):** `docs/social-preview.png` re-laid out at 1270 × 760: wordmark, the one-liner and the `launch/` file tree: "Prepare an honest launch for any open-source repo."
- **Gallery 2:** Claude Code with the prompt "Prepare a launch pack for this repo." and the files appearing in `launch/`: "Point it at your repo. The pack appears in launch/."
- **Gallery 3:** the "Launch readiness" checklist from `00-facts.md` next to the README checklist from `02-github-polish.md`: "Find the gaps visitors notice first."
- **Gallery 4:** `check-limits.mjs` output ending in "0 over the limit", next to one X post block: "Every length checked: PH 60, HN 80, X 280 the way X counts."
- **Gallery 5:** the ethics list from the README: "Say you're the maker. No vote rings. You post it yourself."
- **Video (optional, 30 to 90 s):** one full run on a small repo, from the prompt to `check-limits.mjs` reporting 0 over the limit, then scrolling through two drafts. {{YouTube link, if you make it}}

## Launch day

- [ ] Scheduled for Friday 20 November 2026. The day starts at 12:01 a.m. Pacific Time, which is **09:01 in Morocco** (Pacific is UTC−8 in November), and runs until 09:01 on Saturday 21 November.
- [ ] First comment posted right after going live
- [ ] Answer every comment through the day
- [ ] Share "we're live, feedback welcome" on your own channels; never "please upvote", and don't DM the link to people one by one
