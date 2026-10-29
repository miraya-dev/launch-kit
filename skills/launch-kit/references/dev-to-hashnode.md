# dev.to and Hashnode articles

An article lasts longer than a post: it is found by search for months. It works when it **teaches something**, with the project as the worked example. A pure announcement gets little attention.

## Angles that work

- "How I built <name>": the interesting technical decisions, with code.
- "Why <problem> is harder than it looks, and how I solved it."
- "What I learned building <name>": honest lessons, including mistakes.
- A tutorial that solves a real task with the project, start to finish.

Pick one angle and give 3 title options.

## dev.to (DEV Community)

- Front matter at the top of the markdown:
  ```yaml
  ---
  title: ...
  published: false
  description: ...
  tags: one, two, three, four
  canonical_url: https://... (only if first published elsewhere)
  cover_image: https://...
  ---
  ```
- Up to 4 tags, lowercase, no spaces.
- Cover image ratio 1000 × 420 (it is cropped to this shape).
- Set `canonical_url` when the article first appeared on the maker's own blog, so search engines credit the original.
- DEV's guidelines on AI-assisted articles: they must be checked for accuracy, AI use should be disclosed with DEV's disclosure options, and AI-generated articles may not promote the author's own business, program or course. **The maker writes the article from this outline in their own words.** See [the guidelines](https://dev.to/guidelines-for-ai-assisted-articles-on-dev).

## Hashnode

- Up to 5 tags.
- Republishing an article from elsewhere: set the original URL as canonical in the article settings.
- Hashnode blogs can live on the maker's own domain, which keeps the audience theirs.

## Outline shape

1. Hook: the problem in one short story or example.
2. Context: what existing tools do and where they stop (fair, short).
3. The core: how it works, two or three technical sections with real code from the repo.
4. Results or a demo: what the user gets, with a screenshot or GIF.
5. Limits and what's next.
6. Try it: install command, repo link, feedback request.

## In the pack

Title options, the chosen angle, the front matter, the outline with notes per section (which file or snippet from the repo to show), a cover image brief, and cross-posting notes (canonical URL, which platform first).
