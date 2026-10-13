# Plan: build the Green Home Grant eligibility checker

## Context

Citizens currently phone a call centre and wait about 35 minutes to learn whether they qualify for the fictional Green Home Grant. `intent.md` and `spec.md` define a replacement: a short GOV.UK-style checker that returns Eligible, Partially Eligible or Not Eligible in under 2 minutes. The `starter/` folder is a React + Vite scaffold with TODOs. The spec decides to keep it, replace its wording with the intent's, and serve the built app from a small Python (Flask) server on 0.0.0.0:5002.

All work is in `starter/` unless stated (spec open question 20 is assumed: the app stays there). Open questions 1-6 are handled with the placeholder defaults the spec states.

Build in the order below. Each step ends with something you can check before the next starts.

## Step 1: Eligibility rules and their tests (spec 28-36, decisions 4, 5, 13, 18)

Files:
- new `src/eligibility.js`: one function taking the five answers, returning an outcome (`eligible`, `partial`, `not-eligible`), a list of reasons, a support label, and a placeholder amount. Placeholder amounts live in one object at the top of the file. Rule order: renter or social housing, then £60,000 or more, then flat or studio (partial), then full, then heat pump only, insulation only, income band, then any other homeowner under £60,000 (partial).
- new `src/eligibility.test.js`: uses Node's built-in test runner. Named cases for each rule in the spec, plus a loop over all 1,568 combinations checking every one returns exactly one valid outcome and never throws.
- `package.json`: add a `"test": "node --test"` script (no new dependencies).

Check: in `starter/`, run `npm test`. All tests pass, and the combination test reports 1,568 cases.

## Step 2: App shell, state and shared pages (spec 1-6, 18-20, 24-25, 44; decisions 6, 7, 10, 11, 12, 16, 17)

Files:
- `src/App.jsx`: mount `PhaseBanner` ("alpha") and `GovukFooter` as the TODOs say; add `CookieBanner`; hold answers in state and copy them to `sessionStorage`; add routes for Privacy, Cookies, Terms, Help, Contact, and a catch-all "Page not found". Keep the single `<main>` here.
- new `src/components/CookieBanner.jsx`: Accept and Reject hide the banner, choice remembered in the browser.
- `src/components/GovukFooter.jsx`: add the six links from spec 2.
- `src/components/GovukHeader.jsx`: use a router link so the header link doesn't reload.
- new `src/pages/StaticPage.jsx` (one reusable page for Privacy, Cookies, Terms, Help, Contact with short placeholder text) and new `src/pages/NotFoundPage.jsx`.
- `src/pages/AccessibilityStatementPage.jsx`: remove its nested `<main>` and fill every TODO heading with real sentences.
- `src/app.scss` (GOV.UK Frontend via Sass, Arial font, no custom CSS) replaces the starter's `src/App.css`; `package.json` gains `govuk-frontend` and `sass`.

Check: `npm run dev`, open the app. Header, "alpha" banner, cookie banner and footer show on every page. Each footer link opens a page, a made-up address shows "Page not found", and the cookie banner stays hidden after Accept and a reload. Inspecting any page shows one `<main>`.

## Step 3: Start page, five questions, validation and Check your answers (spec 7-27; decisions 8, 9, 14, 15)

Files:
- new `src/components/RadioQuestion.jsx`: shared radio page with Back link (router link), heading, hint text, radios, inline required-field message and Continue button, and an optional "Other" text box. Reuses `GovukButton`.
- `src/pages/StartPage.jsx`: fill in the service description, who can use it, and the Start now button (the TODOs).
- `src/pages/OwnershipPage.jsx`, `IncomePage.jsx`, `PropertyTypePage.jsx`, `InsulationPage.jsx`, `HeatingPage.jsx`: reduce each to the question text, hint and options from the intent, rendered through `RadioQuestion`. The Back and Continue targets follow the new order (ownership, income, property type, insulation, heating). If the user came from Change, Continue goes back to `/check-answers`.
- `src/pages/CheckAnswersPage.jsx`: GOV.UK summary list with five rows, Change links and a Submit button to `/result`. Redirect to the first question if any answer is missing.
- `src/App.jsx`: update the route order.

Check: in the running app, click through all five questions. Continue without choosing shows the required message. Choosing "Other" for heating shows the text box, and leaving it empty blocks Continue. Back keeps earlier answers selected, as does a browser reload. Change on the summary returns straight to the summary after Continue. Typing `/check-answers` in a fresh tab sends you to question 1.

## Step 4: Result page (spec 28-41; decision 13)

Files:
- `src/pages/ResultPage.jsx`: call `eligibility.js` with the stored answers, show a panel (green, partial, or grey) with the outcome in words, the reasons, the placeholder indicative amount, next steps (a placeholder link for eligible and partial users, further-support suggestions for Not Eligible), and a "Start again" link that clears answers and session storage. Redirect to the first question if answers are missing.

Check: run these journeys in the app and confirm each outcome:
- renter: Not Eligible
- £60,000 or more: Not Eligible
- owner, income under £40,000, semi-detached, no insulation, gas: Eligible
- owner, £40,000 to £59,999, semi-detached, no insulation, gas: Partial (income)
- owner, detached, insulation yes, electric: Partial (heat pump only)
- owner, detached, no insulation, oil: Partial (insulation only)
- owner, studio flat, anything: Partial

"Start again" empties every question.

## Step 5: Python server, build and housekeeping (spec 25, 49; decisions 2, 3, 19, 20)

Files:
- new `starter/server.py`: Flask app serving files from `dist/` and returning `index.html` for any other address; runs on host `0.0.0.0`, port 5002.
- new `starter/requirements.txt`: `flask`.
- `starter/AI_LOG.md`: replace the sample entry with real entries from this build.
- `.gitignore` at the repository root for `node_modules` and `dist` (the git removal of the already-committed `node_modules` waits on your answer to open question 19).

Check: in `starter/`, run `npm run build` and `python3 server.py`. Open `http://localhost:5002`, and from another machine `http://<this-machine>:5002`. Typing `/income` directly and reloading `/result` both work. Then run `npm test` once more and repeat the Step 4 journeys on port 5002 as the final check.
