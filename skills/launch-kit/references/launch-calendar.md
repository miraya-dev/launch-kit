# Launch calendar and follow-up

## Principles

- **Polish first, post second.** The week before launch is for the repo, not for posting.
- **One big channel per day.** Every channel needs the maker present to answer for hours; spreading them out keeps answers good and gives later posts something new to say ("fixed in v0.1.1 thanks to feedback on HN").
- **Launch on a day the maker is free.** Answering in the first hours matters more than the exact hour.
- **No magic day.** Tuesday to Thursday usually bring more readers and more competition; weekends are quieter. Some subreddits only allow project posts on specific days.
- **Product Hunt** days start at 12:01 a.m. Pacific Time; give it its own day.

## Default 14 days (D-7 to D+6)

Adjust to the channels the user chose. If the user gave a launch date, write real dates and weekdays; otherwise use D-7 … D+6.

| Day | Focus |
| --- | --- |
| D-7 | README: hero line, quick start, why/what/how. Record the demo GIF. |
| D-6 | Community files, issue templates, 3 to 5 good first issues. |
| D-5 | Description, topics, social preview image. Cut the release. |
| D-4 | Test the quick start on a clean machine or container. Fix what breaks. |
| D-3 | Write the article from the outline. Prepare Product Hunt images. |
| D-2 | Ask 2 or 3 people to try it and give honest feedback (not votes). Apply fixes. |
| D-1 | Final review of every draft in your own words. Schedule Product Hunt if it is on the plan. Clear your calendar for D0. |
| D0 | Show HN. Stay 3 to 4 hours to answer. Later: the X thread. |
| D+1 | Reddit: one or two subreddits whose rules allow it. Answer issues from D0. |
| D+2 | Publish the article on dev.to or Hashnode. |
| D+3 | Product Hunt (if it fits). Answer comments all day. |
| D+4 | LinkedIn post: the story and what you learned so far. |
| D+5 | Patch release with fixes from feedback; thank reporters in the notes. |
| D+6 | Retrospective: what worked, metrics, next steps. Thank-you post on your own channels. |

## Post-launch checklist

- [ ] Answer every new issue, pull request and question within 24 hours, even if only "thanks, looking at it".
- [ ] Label and triage: `bug`, `enhancement`, `good first issue`, `question`.
- [ ] Thank contributors by name in the release notes and the README.
- [ ] Cut a release with the fixes from launch week (`gh release create vX.Y.Z --generate-notes`).
- [ ] Add the most-asked questions to a README FAQ.
- [ ] Close the loop: reply in the original threads when something people asked for ships.
- [ ] Record metrics now: GitHub's traffic data (Insights → Traffic) keeps only the last 14 days. Note stars, forks, clones, unique visitors and top referrers.
- [ ] Write down what you learned; it is the next article.
- [ ] Keep going: a regular release and changelog give people a reason to come back, and you something real to share.
