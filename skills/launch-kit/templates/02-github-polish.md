# GitHub polish: {{owner/repo}}

## Repository description

```text limit=350
{{description}}
```

<!-- Front-load the meaning: only the first ~100 characters show in search results and link cards. -->

```bash
gh repo edit {{owner/repo}} --description "{{description}}" --homepage "{{website or remove this flag}}"
```

## Topics

```text topics
{{topic-1}}
{{topic-2}}
{{topic-3}}
{{topic-4}}
{{topic-5}}
```

```bash
gh repo edit {{owner/repo}} --add-topic {{topic-1}},{{topic-2}},{{topic-3}},{{topic-4}},{{topic-5}}
```

## Social preview image brief

- **Size:** 1280 × 640 px, PNG or JPG, under 1 MB. Keep everything important at least 80 px from the edges.
- **Text:** {{project name}} and "{{one-liner, or a shorter version}}"
- **Visual:** {{what to show: a screenshot, terminal output, a diagram or the logo}}
- **Colors and type:** {{background, accent, font style}}; high contrast, readable as a small thumbnail.
- **Upload:** Settings → General → Social preview (no API; upload by hand).

## README checklist

| Item | Status | Concrete edit |
| --- | --- | --- |
| Hero line (what it is, for whom) | {{done / partial / missing}} | {{exact text}} |
| Badges (3 to 5, meaningful) | | |
| Demo GIF or screenshot in the first screen | | |
| 30-second quick start (install, run, expected output) | | |
| Why (the problem) | | |
| What (features as outcomes) | | |
| How (how it works) | | |
| Comparison or FAQ | | |
| Contributing and license sections | | |

### Ready-to-paste edits

<!-- Give the exact markdown for the most important edits: the new top of the README (hero line, badges, demo placeholder, quick start). Only commands that exist in the repo. -->

```markdown
{{new README top}}
```

## Community files

| File | Status | Action |
| --- | --- | --- |
| LICENSE | {{found: SPDX / missing}} | |
| CONTRIBUTING | | |
| CODE_OF_CONDUCT | | |
| SECURITY | | |
| Issue templates | | |
| Pull request template | | |

<!-- Mention that some files can come from the owner's .github repository: check Insights → Community standards. -->

## Good first issues

<!-- 3 to 5 real tasks found in the code (TODOs, missing tests, docs gaps). Each with context, files, done-when, how to test. -->

### 1. {{title}}

{{body: context, files to touch, done when, how to test}}

```bash
gh issue create --repo {{owner/repo}} --title "{{title}}" --label "good first issue" --body "{{short body}}"
```

## Release

{{Current tags from 00-facts.md, and the release to cut before launch, e.g. `gh release create v0.1.0 --generate-notes`.}}
