# Contributing to launch-kit

Thanks for helping. Small fixes (a typo, a broken link, an outdated platform limit) can go straight to a pull request. For anything bigger, open an issue first so we can agree on the approach.

## Setup

You need Node.js 18 or newer. There are no dependencies to install.

```bash
git clone https://github.com/miraya-dev/launch-kit
cd launch-kit
npm test                     # runs node --test
claude --plugin-dir .        # try the skill in Claude Code without installing it
claude plugin validate .     # check the plugin and marketplace files
```

## Where things live

- `skills/launch-kit/SKILL.md`: the workflow. Keep it lean; details belong in `references/`.
- `skills/launch-kit/references/`: one file per channel with its rules and best practices.
- `skills/launch-kit/templates/`: the files of the launch pack.
- `skills/launch-kit/scripts/`: zero-dependency Node scripts, tested in `tests/`.
- `examples/`: real packs produced by the skill.

## Rules for changes

- **Platform rules and limits need a source.** When you change a rule or a number (a character limit, an image size), link the official page in the pull request. Paraphrase; don't copy long passages.
- **The ethics rules in `SKILL.md` are not up for debate.** Pull requests that add vote exchanges, fake engagement, astroturfing or ways around a community's rules will be closed.
- **Scripts stay zero-dependency and deterministic**, and every behavior change comes with a test.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example `fix(reddit): update the r/webdev showcase rule`.

Issues and pull requests are welcome in English, Arabic or French. By contributing you agree that your work is released under the [MIT License](LICENSE). Please follow the [Miraya code of conduct](https://github.com/miraya-dev/.github/blob/main/CODE_OF_CONDUCT.md), and report security problems privately as described in [SECURITY](https://github.com/miraya-dev/.github/blob/main/SECURITY.md).
