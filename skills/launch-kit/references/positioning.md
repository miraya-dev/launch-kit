# Positioning

Positioning answers four questions before any post is written: what it is, who it is for, why they should care, and how it compares with what they use today. Every channel draft reuses these answers.

## One-liner

One sentence a stranger can repeat after reading it once. Aim for 120 characters or fewer.

Useful shapes (pick the one that is true and clear):

- `<Name> is a <category> that <does X> for <audience>.`
- `<Verb> <object> <qualifier>.` For example: "Turn any Postgres table into a REST API with one command."
- `Like <well-known thing>, but <real difference>.` Only when the comparison is accurate and the reader knows the reference.

Test it: does it say what the thing **is** and what it **does**? Would the target user use these words? Remove every adjective that is not a fact. Write two or three options and say why the chosen one wins.

## Who it is for

Describe people by situation, not demographics: "a solo maintainer about to make a repo public", not "developers aged 25 to 40".

- **Primary:** the person who gets the most out of it today.
- **Also useful for:** one or two secondary groups.
- **Not for:** be honest. Saying who should not use it builds trust and saves everyone time.

## Three key benefits

A benefit is an outcome for the user; a feature is how the project delivers it. Write the benefit and point to the proof in the repo (a file, a function, a README section). If you cannot point to proof, it is not a benefit yet.

| Feature (in the repo) | Benefit (for the user) |
| --- | --- |
| "Zero dependencies" | "Runs anywhere Node runs; nothing to audit or update." |
| "Reads the README and manifests" | "No setup: point it at a repo and go." |

## Honest comparison

1. **List 2 to 4 real alternatives**, always including the default the user has today: doing it by hand, a script, or nothing at all.
2. **Where to find them:** the README's "similar projects" or "alternatives" section, awesome-lists for the ecosystem, the package registry, your own knowledge. If web search is available, confirm each one still exists and is maintained.
3. **Compare on verifiable things:** approach, scope, setup effort, license and cost, platform, maturity. Never invent metrics or benchmark results.
4. **Say when to pick something else.** Every honest comparison has at least one row where an alternative wins.
5. **No put-downs.** Describe alternatives the way their maintainers would accept. If you are unsure about a detail (pricing, current features), write "check current docs" instead of guessing.

## Words to use and avoid

End the positioning file with a short list: words the target user actually uses (from issues, docs, the ecosystem) and words to avoid (jargon, hype, terms that mean something else in this community). Every draft follows this list.
