# <Team name>: Green Home Grant
App:  https://app2-lab11133.labs.decoded.com/   (the server runs on port 5002; the `app2-` address reaches it)
Code: https://github.com/ramya-athi/grant-eligibility-checker (branch `main`)

## What's in our submission
- src/pages/                  start page, 5 questions, check answers, result, footer pages
- src/eligibility.js          our eligibility rules (pure function, placeholder amounts)
- src/eligibility.test.js     unit tests: run `npm test` (19 tests, including all 1,568 answer combinations)
- src/questions.js            the 5 questions as data: wording, options, errors
- src/reference.js            reference number generator, with tests
- src/cookieChoice.js         cookie banner choice and 1-year expiry, with tests
- scripts/                    axe accessibility scan (`npm run a11y`) and cookie check (`npm run cookies`)
- ../intent.md, ../spec.md, ../plan.md   what we set out to build, 61 requirements, build plan
- AI_LOG.md                   our AI log (31 instances)
- AUDIT_LOG.md                before and after checks: tests, Lighthouse, keyboard, 375px, axe scan
- ../.claude/skills/          two Claude Code skills that explain and check the rules

## Please look at (beyond the MVS)
- Rules are separate from the pages: `src/eligibility.js` has no React in it, and the tests cover every one of the 1,568 answer combinations
- The questions are defined once in `src/questions.js` and used by the pages, the summary and the skills
- Print: the result page has a "Print this page" link (GOV.UK style) so users can keep a record of their result and reasons
- Reference number: each result shows a reference (`ELG-ddmmyy-XXXXXX`, in `src/reference.js`, with tests) that the user can quote later. It is made in the browser only and nothing is stored on a server yet, so it is not yet looked up anywhere
- No custom CSS: only the official `govuk-frontend` through `src/app.scss`
- Accessibility: skip link, error summary that takes focus, 26 axe scans with 0 violations (`AUDIT_LOG.md`)
- Cookie banner that is honest about what is stored (no real cookies), with the choice kept for 1 year

## Run it
```
cd starter
npm install
npm run build
python3 server.py
```
Full details are in the repository README.
