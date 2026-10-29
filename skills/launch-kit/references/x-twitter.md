# X (Twitter), plus Bluesky and Mastodon

## Limits

- A standard X post holds **280 characters**, counted with weights: every link counts as 23 characters, and emoji and many non-Latin characters (CJK, for example) count as 2. Premium accounts can post longer, but a thread of short posts reads better and works for everyone.
- `check-limits.mjs` counts X posts this way when the block is marked `limit=280 x`.
- If the maker also uses **Bluesky** (300 characters per post) or **Mastodon** (500 characters by default on most servers), the same thread usually fits with small edits.

## Thread shape (5 to 8 posts)

1. **Hook:** what it is and who it is for, plus the demo GIF or video. This post must make sense alone; most people never open the thread.
2. **The problem**, in the maker's words.
3. **How it works** or a short demo walkthrough.
4. to 5. **Key benefits**, one per post, each with a screenshot if possible.
6. **Honesty:** what it does not do yet, what is next.
7. **Link and call to action:** try it, feedback welcome, issues open. A soft "if it's useful, a star helps others find it" is fine here, on the maker's own account.

## Practical notes

- Put media in the first post. Some makers put the link in the second post or a reply because posts with external links may get less reach; X has not confirmed this, so either is fine.
- Use 0 to 2 hashtags, only ones people follow.
- Tag people or projects only when they are genuinely involved (a library it builds on, a collaborator). Never mass-tag accounts for attention.
- Pin the thread to the profile for launch week, and reply to replies.
- No engagement bait ("RT if you agree", "like for part 2"), no giveaways for follows or stars, no buying reach from engagement groups.

## In the pack

Each post in its own `limit=280 x` block, numbered, with a note on which image or GIF goes with it. Then 2 or 3 single-post variants for later in the week (a tip, a screenshot, a question).
