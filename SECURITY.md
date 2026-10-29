# Security policy

launch-kit is a set of markdown instructions and two Node.js scripts. The scripts read local files only: they never use the network, never run git or other programs, and write nothing except the file you pass to `--out`.

## Supported versions

Only the latest release gets fixes.

## Reporting a problem

Please don't post details of a security problem in a public issue. Open an issue that only asks for a private channel, and the maintainer will reply there. Include the version, what you found and how to reproduce it once the private channel is set up.

Examples of what counts: a script that reads or prints files outside the folder it was pointed at, leaks credentials (for example from a git remote URL), or writes outside the `--out` path; or instructions in `SKILL.md` that could make Claude act outside the `launch/` folder without being asked.
