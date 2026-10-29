# GitHub polish

Every channel sends people to the repository. Visitors decide in seconds whether to try it, so polish the repo before posting anywhere.

## Repository description

- One plain sentence: what it is and what it does. GitHub allows up to 350 characters, but search results and link cards show far less: front-load the meaning in the first 100 or so.
- Same wording family as the one-liner. No emoji wall, no hype.
- Also set the **website** field if there is a docs site or demo.
- Command: `gh repo edit OWNER/REPO --description "..." --homepage "https://..."`

## Topics

- Up to 20 topics. Each is lowercase letters, numbers and hyphens, 50 characters at most.
- Choose 5 to 10 that people actually browse: language (`python`), ecosystem or framework (`react`, `claude-code`), category (`cli`, `static-site-generator`), problem (`accessibility`, `i18n`), audience (`developer-tools`).
- Prefer topics that already exist with many repositories (check `https://github.com/topics/<topic>`) over invented ones.
- Command: `gh repo edit OWNER/REPO --add-topic one,two,three`

## Social preview image

The image shown when the repo link is shared on X, LinkedIn, Slack, Discord and others. Without one, GitHub generates a plain card.

- 1280 × 640 px recommended (at least 640 × 320), PNG, JPG or GIF, under 1 MB.
- Keep text and the key visual inside a central safe area with about 80 px margin; some platforms crop the edges.
- Content: project name, the one-liner, one visual (a screenshot, terminal output, a diagram or the logo). High contrast, large type, readable as a small thumbnail.
- Upload by hand: repository **Settings → General → Social preview**. There is no API for it.

The brief in the pack describes layout, text, visual and colors precisely enough to hand to a designer or build as an HTML page and screenshot.

## README checklist

The order matters: most visitors never scroll past the first screen.

1. **Name and hero line.** What it is and who it is for, in one sentence (the one-liner).
2. **Badges.** Three to five that carry information: CI status, latest version, license, downloads. Not a wall.
3. **Demo.** A GIF, short video or screenshot in the first screen, showing the moment the user gets value. GIFs: 10 to 20 seconds, under about 10 MB. For terminal tools, record with a tool such as [VHS](https://github.com/charmbracelet/vhs) or asciinema. Add alt text.
4. **Quick start in 30 seconds.** One install command, one run command and what you should see. Every command copy-pasteable and tested on a clean machine.
5. **Why.** The problem, in two or three sentences.
6. **What.** Features written as outcomes, five to seven bullets.
7. **How.** How it works, briefly; link deeper docs.
8. **Usage and configuration.** Or a link to full docs.
9. **Comparison or FAQ.** Honest, short.
10. **Contributing, license, credits.**

For each item the pack gives a status (done, partial, missing) and a concrete edit: the exact text or command to add, ready to paste.

## Community files

| File | Why it matters |
| --- | --- |
| `LICENSE` | Without a license, nobody can legally use, copy or change the code. Use an OSI-approved license. |
| `CONTRIBUTING.md` | How to set up, test and send a pull request. Lowers the bar for first contributions. |
| `CODE_OF_CONDUCT.md` | Sets expectations; the Contributor Covenant is the common choice. |
| `SECURITY.md` | How to report vulnerabilities privately. Also enable private vulnerability reporting in Settings. |
| Issue and PR templates | Better bug reports, fewer back-and-forth questions. |

GitHub can take some of these from the owner's `.github` repository (for example CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue templates). Check **Insights → Community standards** before adding duplicates.

## Good first issues

- Draft 3 to 5 real, small, well-scoped tasks found in the code: TODO comments, missing tests, docs gaps, small features from the roadmap. Never invent busywork.
- Each one has context, the files to touch, what "done" looks like and how to test it.
- Labels `good first issue` and `help wanted`. GitHub lists them at `https://github.com/OWNER/REPO/contribute`.
- Command: `gh issue create --title "..." --body-file issue.md --label "good first issue"`
- Reply quickly to first-time contributors; it is the cheapest way to keep them.

## Release

- Cut a release before launch (`v0.1.0` or `v1.0.0`) so people can pin a version and follow updates: `gh release create v0.1.0 --generate-notes`.
- Watchers can subscribe to releases only; a release is also a reason to post again later.

## Extras

Enable Discussions for questions; pin the repo on the profile or organization; add `CITATION.cff` for research software; add `FUNDING.yml` if the maker accepts sponsorship.
