# Green Home Grant eligibility checker

A GOV.UK-style service that tells a citizen whether they may be eligible for the Green Home Grant, a fictional scheme that funds home insulation and heat pumps. It replaces a phone call to the contact centre, which currently takes around 35 minutes, with an answer in under 2 minutes.

This is a prototype. The scheme is fictional, results are not real grant decisions, and grant amounts are placeholders.

## What it does

1. The user reads the start page and selects **Start now**.
2. They answer five questions, one per page: housing situation, household income, property type, insulation, and main heating source.
3. They check their answers, and can change any of them.
4. They see a result with the reasons, an indicative maximum grant amount and next steps.

### Outcomes

| Outcome | When |
|---------|------|
| Not Eligible | The user rents or lives in social housing, or household income is £60,000 or more |
| Eligible | A homeowner with income under £40,000, in a house or bungalow, with no insulation and gas or electric heating |
| Partially Eligible | Any other homeowner with income under £60,000, for example a flat or studio, heat pump support only, insulation support only, or a reduced grant because of income |

The rules are in `starter/src/eligibility.js`. The full list is in [`intent.md`](intent.md) and [`spec.md`](spec.md).

## Requirements

- Node.js 20.19 or later (or 22.12 or later) and npm
- Python 3.10 or later

## Run it

All commands are run from the `starter` folder.

```
cd starter
npm install
pip install -r requirements.txt
npm run build
python3 server.py
```

The app is then at `http://localhost:5002`. The server listens on `0.0.0.0` so other machines can reach it.

Run `npm run build` again after any change to the front end.

### Choosing a port

The default port is 5002. Set `PORT` to use another one:

```
PORT=5000 python3 server.py
```

If you see "Address already in use", an earlier copy is still running. Stop it with `pkill -f "python3 server.py"`.

### On the lab VM

The lab proxy maps `appN-<lab>` addresses to port `500N`, so for lab 11133:

| Port | Address |
|------|---------|
| 5002 | https://app2-lab11133.labs.decoded.com/ |
| 5000 | https://app-lab11133.labs.decoded.com/ |

## Test it

```
cd starter
npm test
```

This runs the eligibility rules against named cases and all 1,568 possible combinations of answers.

### Accessibility scan

An automated scan checks every page and state against WCAG 2.0 to 2.2 levels A and AA, using [axe-core](https://github.com/dequelabs/axe-core) in a headless browser. It covers all five questions, the error states, the "Other" heating option, check your answers, all three results, the footer pages and the not found page, and repeats four pages at 320px wide.

```
cd starter
npx playwright install chromium    # first time only
python3 server.py                  # in another terminal, with the app built
npm run a11y
```

It prints each page with its violations and exits with an error if any are found. Set `BASE_URL` to scan another address.

## How this meets the rubric

The hackathon rubric has six rows. This is where to find the evidence for each.

| Rubric row | Where to look |
|------------|---------------|
| Functionality | The journey from start page, through five questions, to check your answers and the result. Rules in `starter/src/eligibility.js`. `npm test` runs 8 tests, including every one of the 1,568 answer combinations. The `check-eligibility` skill runs 26 named scenarios. |
| Code quality | One source for the questions (`questions.js`), pure and tested rules, small components, decisions written down in [`spec.md`](spec.md), and [`CLAUDE.md`](CLAUDE.md) describing how it fits together. |
| AI effectiveness | [`starter/AI_LOG.md`](starter/AI_LOG.md) records each use of AI with what was generated and what was changed and why. [`intent.md`](intent.md), [`spec.md`](spec.md) and [`plan.md`](plan.md) show the planning, and two Claude Code skills in `.claude/skills/` explain and check the rules. |
| Accessibility | Skip link, visible focus, labelled inputs, GOV.UK error summary, keyboard focus reset on each page, and an accessibility statement. `npm run a11y` runs axe on 26 scans. [`starter/AUDIT_LOG.md`](starter/AUDIT_LOG.md) records the before and after of the tests, Lighthouse, keyboard and 375px checks. |
| GOV.UK visual compliance | The official `govuk-frontend` package (Arial instead of GDS Transport): header, service name, phase banner, radios, error summary, summary list, confirmation panel, warning text, button and footer. The result page has a print link. |
| Service Standard conformance | A phase banner with a feedback link, a footer with a link to the accessibility statement, an accessibility statement page, and a cookie banner. |

The Lighthouse, keyboard and 375px results in `AUDIT_LOG.md` were measured by hand. The accessibility scan and the tests can be rerun with the commands above.

## Project layout

```
intent.md             What the service is for, who uses it, success, and what is out of scope
spec.md               Requirements, decisions and open questions
plan.md               The build plan
starter/
  server.py           Python (Flask) server for the built app
  src/
    eligibility.js    The eligibility rules and placeholder grant amounts
    questions.js      Question wording and answer options
    pages/            One component per page
    components/       Shared components (header, footer, cookie banner, radio question)
    hooks/            Answer storage and page titles
    app.scss          GOV.UK Frontend import (Arial font), the only stylesheet and no custom CSS
  scripts/            Accessibility scan (axe) that checks every page
  AI_LOG.md           Record of where AI was used and what was changed
  AUDIT_LOG.md        Before and after checks: tests, Lighthouse, keyboard, 375px, accessibility scan
.claude/skills/       Claude Code skill that explains and checks the eligibility rules
```

## Built with

- React and Vite for the pages
- [GOV.UK Frontend](https://frontend.design-system.service.gov.uk/) for the look and components, using Arial instead of GDS Transport
- Python and Flask to serve the built app

## Out of scope

Real applications, accounts and sign in, saving progress between visits, uploading evidence, staff tools, payments, integration with government systems, and notifications. See [`intent.md`](intent.md) for the full list.
