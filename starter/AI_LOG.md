# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

## Instance 1: Planning: spec and build plan from the intent and the starter

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Planning: spec and build plan from the intent and the starter |
| **What AI Generated** | Read intent.md and the starter folder, wrote spec.md (49 requirements, 20 decisions, 20 open questions), then wrote plan.md (5 steps, each with files, actions and a check). Decided to keep the React/Vite starter and serve the build from Flask. |
| **What You Changed + Why** | Changed the port from 5000 to 5002 in spec.md and plan.md when told to. Reworded spec decision 2 so it no longer said Vite uses 5002. The user's own answers during the interview (flats are Partially Eligible, any homeowner under £60,000 is at least Partially Eligible) replaced my first guesses. Why: the port and the rules are the user's decisions, and the AI had left the heat pump/insulation gaps as open questions. |

## Instance 2: Test generation: eligibility rules and tests (plan step 1)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Test generation: eligibility rules and tests (plan step 1) |
| **What AI Generated** | starter/src/eligibility.js (rules in a fixed order, placeholder amounts in one object), starter/src/questions.js (question wording and options from intent.md) and starter/src/eligibility.test.js (named rule cases plus a loop over all 1,568 answer combinations). |
| **What You Changed + Why** | Changed the npm test script from `node --test src/` to `node --test src/*.test.js` because Node tried to run the directory as a file and failed. Why: the first run failed with MODULE_NOT_FOUND; after the fix 8 tests pass. The rule for a homeowner with insulation and non-gas, non-electric heating (spec open question 4) is a guess, so it is returned as 'Reduced support' and flagged in the code. |

## Instance 3: Plan-mode scaffolding and refactor: replace the starter pages (plan steps 2-4)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Plan-mode scaffolding and refactor: replace the starter pages (plan steps 2-4) |
| **What AI Generated** | Replaced the five starter question pages with thin wrappers around one RadioQuestion component; filled in the start, check answers and result pages; added the cookie banner, footer links, static pages, 404 page, answers hook (state plus session storage) and the missing CSS. |
| **What You Changed + Why** | Removed the nested <main> from the starter's accessibility page, swapped the starter's plain <a href> Back links for router links (the plain ones reload the page and would lose state), reordered the routes to follow intent.md, and dropped the starter's insulation option 'I do not know'. Why: accessibility (one main landmark), keeping answers through the journey, and the intent being the source of truth over the starter's wording. |

## Instance 4: Debugging: broken node_modules and browser checks (plan steps 3-5)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Debugging: broken node_modules and browser checks (plan steps 3-5) |
| **What AI Generated** | Ran npm run build, which failed with `vite: not found`. npm install then failed with EACCES on esbuild. Wrote a Python Flask server (starter/server.py) and a Playwright script (kept outside the repo, in the scratchpad) that clicks through the app on port 5002. |
| **What You Changed + Why** | Gave the committed node_modules binaries (esbuild, vite) their execute permission, then ran npm install, which created the missing .bin folder. Changed server.py so a missing file under /assets/ returns 404 instead of the HTML page. Fixed my own test script twice: the link name 'Back' also matched 'feedback', and the redirect checks ran before the page had redirected. Why: the fixes were test or environment problems, not app bugs; the final run passed all checks, including no horizontal scroll at 320px. |

## Instance 5: Debugging: lab proxy expects port 5000

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Debugging: the lab "app" address showed "No app is answering on port 5000" |
| **What AI Generated** | A change to starter/server.py so the port comes from an optional PORT environment variable, still defaulting to 5002. |
| **What You Changed + Why** | Nothing else changed. The default stays at 5002 as the spec says, and `PORT=5000 python3 server.py` serves the app where the lab proxy looks. Why: the user switched the spec from 5000 to 5002, but the "app" proxy prefix is mapped to 5000, so one of the two must be chosen on purpose. |

## Instance 6: Refactor: GOV.UK error summary, font fixes and a fuller start page

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Refactor after review: fix font and heading mismatches, show GOV.UK-style errors when nothing is selected, add more useful start page content |
| **What AI Generated** | A new ErrorSummary component ("There is a problem" with links that focus the field), per-question error messages in questions.js, GOV.UK-style radio buttons (ring and dot), `font-family: inherit` for buttons and inputs, tighter spacing under the question heading, space under buttons, and a start page with sections for what the grant is for, who can get it, what you need before you start, and an inset notice. |
| **What You Changed + Why** | Updated spec.md requirements 5, 7, 26 and 27 and decision 15, and removed "error summaries" from the out-of-scope line in intent.md, because the user now wants them. Changed the accessibility statement so it no longer says an error summary is missing. Why: the first version only had an inline message, buttons used a different font from the page text, and the start page was thin. Checked with screenshots and a browser run: the summary takes focus, its link focuses the first radio, and the page title starts with "Error:". |

## Instance 7: Refactor: replace hand-written CSS with GOV.UK Frontend

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Refactor: use the official govuk-frontend package (Sass, Arial font) instead of the starter's hand-written App.css |
| **What AI Generated** | `src/app.scss` (the user's snippet), `src/custom.css` (panel colours for Partially and Not Eligible), and GOV.UK Frontend markup for the header, service name, phase banner, cookie banner, footer, error summary, radios, fieldset heading and the Start now arrow button. Installed `govuk-frontend` 6.5.1 and `sass`. Deleted `src/App.css`. |
| **What You Changed + Why** | Removed the wrapper div around each radio (GOV.UK spacing relies on the radio items being siblings), left out the library's own scripts because React handles show and hide, and kept `/assets/` as the asset path from the snippet. Updated spec decisions 11 and 12 and plan.md. Why: the user wants real components rather than look-alike CSS. Checked with the full browser run (all checks pass) and screenshots. Known leftover: the build warns that `/assets/images/govuk-crest.svg` is not found, because the library's images are not copied into the build. |


## Instance 8: Skill: eligibility rules for Claude Code

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Create a skill that tells Claude all the eligibility rules and checks a set of answers |
| **What AI Generated** | `.claude/skills/green-home-grant-eligibility/SKILL.md` (answer values, the eight outcome rules in order, placeholder amounts, how to answer) and `check.mjs`, a script that runs the app's real `checkEligibility` for answers given as JSON. |
| **What You Changed + Why** | Made the script import the app's own rules instead of copying them, so the skill cannot drift from the code, and made the SKILL.md say the code wins if they disagree. Checked by running the script with a valid set of answers (flat, £40,000 to £59,999, gives Partially Eligible, £3,000 placeholder) and an invalid one (clear error, exit code 1). |

## Instance 9: Debugging: keyboard navigation and a broken build

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Task** | Debugging: keyboard navigation from the top of the page did not work well, and the app would not load |
| **What AI Generated** | A SkipLink component ("Skip to main content") as the first tab stop, a focus reset to the top of the page on every route change in App.jsx, `tabIndex={-1}` on the main area, and `css.lightningcss.errorRecovery: true` in vite.config.js. |
| **What You Changed + Why** | Found by tabbing through the page in a headless browser that there was no skip link and that focus stayed on a removed button after a page change. Also found that the installed Vite was now version 8 and React Router version 7 (package.json had been changed by an audit fix), so `npm run build` failed on an Internet Explorer media query in govuk-frontend, which left `dist/` empty and the server returning "Not Found". Fixed the build with the config option, rebuilt, and made my browser test wait for page changes because React Router 7 updates the page slightly later. After that all browser checks and the 8 rule tests pass. |

## Instance 10: Documentation: replace the README

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Replace the old README with a clean one for this project |
| **What AI Generated** | A new `README.md` with an overview, the outcomes table, requirements, run and test commands, port and lab addresses, project layout, and what is out of scope. |
| **What You Changed + Why** | The user said the README was in the starter folder, but the only README in the project is the one in the repository root, so I replaced that one. It used to hold collaborator names and GitHub SSH setup notes, which the user asked to remove (they are still in git history). Checked the commands and addresses against what was run earlier in the session, and set the Node version to the one Vite 8 needs. |

## Instance 11: Skill and test generation: check-eligibility scenarios

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Create a skill named check-eligibility that runs the Not Eligible, Eligible and Partially Eligible scenarios and reports each result and an overall result |
| **What AI Generated** | `.claude/skills/check-eligibility/SKILL.md` and `run.mjs`, which runs 26 named scenarios (6 Not Eligible, 5 Eligible, 15 Partially Eligible) through the app's real rules and prints a table per group and an overall PASS or FAIL. |
| **What You Changed + Why** | Wrote the expected outcome for each scenario from intent.md, not from the code, so a wrong rule would fail. Proved that by changing one expected value in a temporary copy: the run printed FAIL, a non-zero exit code and a failed total, and I deleted the copy. The real run passes 26 of 26. Caveat: the 'Reduced support' cases (flat, and insulated with non-gas heating) only check the outcome, because the intent does not say what the support should be called. |

## Instance 12: Documentation: CLAUDE.md for future sessions

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Create a CLAUDE.md that tells future Claude Code sessions how to work in this repository |
| **What AI Generated** | `CLAUDE.md` with the build, run and test commands (including a single-test command), the architecture that spans several files (Flask serving the Vite build, `questions.js` as the single source for the questions, pure eligibility rules, answer state in session storage, the Change flow, focus and error handling, styling), and the gotchas found during the build. |
| **What You Changed + Why** | Ran the single-test command to prove it works. Left out file listings and generic advice so the file only holds what is hard to work out from one file. Included the tracked `node_modules` and `npm audit fix --force` warnings because both caused real problems in this project. |

## Instance 13: Documentation: audit log

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Create an audit log for this project in the same table format as the booking project's audit log |
| **What AI Generated** | `starter/AUDIT_LOG.md`, a before and after table with four rows: tests, Lighthouse performance and accessibility, keyboard only, and 375px wide. |
| **What You Changed + Why** | The before and Lighthouse figures (4 tests failed, 78 and 85 before, 100 and 100 after, keyboard failed then passed) are the user's own and were not re-measured by the AI. The only figure the AI checked was 8 of 8 tests passing, from a run of `npm test` today. Kept to the four rows the user asked for and left out the JavaScript size row, because no size was given. Read "37px" as 375px. |

## Instance 14: Debugging and feature: white result panel and a print link

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Fix the result page showing a white background, and add a print link like the GOV.UK Design System |
| **What AI Generated** | A fix in `ResultPage.jsx` so the panel always carries the library's `govuk-panel--confirmation` class, plus extra bottom spacing. A "Print this page" link that calls `window.print()`. Print styles in `custom.css` that give the panel a black border with dark text, and hide the cookie banner, phase banner, service name bar, back link, footer, skip link, buttons and the print link. |
| **What You Changed + Why** | Found the cause by reading the computed colours in a headless browser: the Eligible panel had a transparent background, because only the Partially Eligible and Not Eligible panels had the colour classes I had written. Eligible is now green (rgb 15, 122, 82), Partially Eligible blue and Not Eligible grey, all with white text. Without the print rules the white text would print invisibly, so the panel is bordered in print. Hid the print link, Change link and Start again button when printing. Tested by pressing the link with `window.print` replaced by a counter (it was called once, and the page stayed on /result), by taking a print-media screenshot, by rerunning every browser check (all pass), and `npm test` (8 of 8). Updated spec.md requirements 37 and 52 and decision 23. Not tested: an actual printer or Save as PDF, and Safari. |

## Instance 15: Content: plainer result wording and clearer next steps

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Improve the result page wording and next steps (improvement 11 from the list of ways to stand out) |
| **What AI Generated** | A `summary` sentence for every outcome in `eligibility.js`, a result panel that says "You may be eligible", "You may be partially eligible" or "You are not eligible", a GOV.UK warning notice ("an indication only, not a decision"), "The most you may get" with the amount shown large and the prototype note as hint text, and numbered next steps that differ for people who can and cannot apply. |
| **What You Changed + Why** | Kept the summary text inside the rules file so the wording cannot drift from the rule that produces it, and extended the all-combinations test to check every result has one. Removed a doubled "Green Home Grant" from the page title that showed up in the browser tab. Updated my own browser test, which still looked for the old headings, and updated spec.md requirements 33 and 40 and decision 24. Avoided inventing real application requirements (such as which documents to bring), because the scheme is fictional and the intent says next steps are placeholders. The heat pump and insulation summaries say that is "the only support you can get", which follows from the rules but is my wording, so check it suits you. All browser checks, the 8 unit tests and the 26 scenarios pass. |

## Instance 16: Debugging: npm install fails with ERESOLVE on a fresh machine

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Explain and fix `npm install` failing on another lab machine with a peer dependency conflict between vite and @vitejs/plugin-react |
| **What AI Generated** | A one-line change in `starter/package.json` raising `@vitejs/plugin-react` from `^4.2.0` to `^5.2.0`, and the matching update of `package-lock.json`. Added a note to CLAUDE.md. |
| **What You Changed + Why** | Read the error: `package.json` asks for vite 8, but plugin-react 4.7 only accepts vite up to 7, so npm refuses to install. It had worked here only because `node_modules` was already present. Checked on the npm registry that plugin-react 5.2.0 is the first version that accepts vite 8 and chose it over 6.x because it changes the least. Proved the fix by copying the project without `node_modules` into a clean folder: `npm install` finished with 0 vulnerabilities, `npm run build` worked and `npm test` passed 8 of 8. Did not use `--force` or `--legacy-peer-deps`, because they hide the conflict instead of fixing it. |

## Instance 17: Refactor: result panel markup copied from the GOV.UK Design System

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Make the result panel use the GOV.UK confirmation panel markup, and explain the lightningcss build error |
| **What AI Generated** | The panel in `ResultPage.jsx` now follows the Design System example exactly: a `govuk-panel` with the title in `govuk-panel__title` and a `govuk-panel__body` of "Your support", a line break, then the support name in `<strong>`. Removed the extra margin utility class I had added. |
| **What You Changed + Why** | Kept the two outcome colour classes (`govuk-panel--partial` and `govuk-panel--not-eligible`) on top of `govuk-panel--confirmation`. Without them Not Eligible and Partially Eligible would show a green success panel, which is misleading, and the colour is also in the starter's own TODO for this page. I read the instruction to remove classes as the extra ones only, so check that is what was meant. Updated my browser test to read the bold support text, and updated spec.md requirement 33. All browser checks pass. On the build error: it comes from an Internet Explorer media query (`min-width: 0\0`) inside govuk-frontend, which Vite 8's CSS minifier (lightningcss) rejects. `css.lightningcss.errorRecovery: true` in vite.config.js tells it to skip that rule, and that setting is already on origin/main. |

## Instance 18: Test generation: automated accessibility scan with axe

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Add an automated accessibility scan (Pa11y or axe) that covers every page, and record the result |
| **What AI Generated** | `starter/scripts/a11y-scan.mjs`, run with `npm run a11y`. It uses axe-core through Playwright with the WCAG 2.0 to 2.2 A and AA rules, and scans 22 pages and states at 1000px (start with and without the cookie banner, all five questions, both error states, the "Other" heating reveal, check your answers, three results, the footer pages and the not found page) plus 4 pages at 320px. Added `playwright` and `@axe-core/playwright` as dev dependencies. |
| **What You Changed + Why** | Chose axe over Pa11y because it was quicker to run with the Playwright browser already in use and reports the failing elements. Result: 0 violations in all 26 scans. A clean result proves nothing if the scanner is blind, so I checked it: on the privacy page I injected an image with no alt text, an unlabelled input and faint grey text, and axe reported image-alt, label and color-contrast. That test file was deleted. Also checked that the "Other" text box was really visible when its state was scanned. Limits: axe finds roughly a third of accessibility problems, so it does not replace keyboard and screen reader testing, and it cannot judge things like whether the wording makes sense. Added the result to AUDIT_LOG.md, a decision 25 to spec.md, and the command to CLAUDE.md and the README. |

## Instance 19: Documentation: rubric map in the README

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Add the rubric rows to the README, showing where the evidence for each is |
| **What AI Generated** | A "How this meets the rubric" table in `README.md` with the six rows named in the handbook (functionality, code quality, AI effectiveness, accessibility, GOV.UK visual compliance, Service Standard conformance), each pointing to files and commands. Also added the accessibility scan to the README and the project layout. |
| **What You Changed + Why** | The brief with the rubric's full wording is not in this repository, so the table uses only the six row names from the handbook and does not claim to quote the "Excellent" column. Kept every claim to something that exists and can be checked (test counts, scan counts, file names), and said in the README that the Lighthouse, keyboard and 375px figures were measured by hand and are not rerunnable. You should compare the table with the real rubric wording before you submit. |

## Instance 20: Feature: Back link on the footer pages

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Users could not get back from the accessibility statement, help and other footer pages. Add a home link or Back link in the GOV.UK style |
| **What AI Generated** | A `PageBackLink` component using the GOV.UK Back link pattern, added to the five footer pages, the accessibility statement and the application placeholder page. |
| **What You Changed + Why** | Chose a Back link over a Home link because GOV.UK guidance returns users to the page they came from, so someone who opens Help from question 2 lands back on question 2 with their answer kept. A page opened directly (nothing to go back to) sends the user to the start page instead of doing nothing; the code tells the two cases apart with the router's `location.key`. Tested every footer page from the start page, from the middle of the journey, opened directly, and with the keyboard (Enter), and all passed. Reran the earlier browser checks, the 26 accessibility scans (0 violations) and the 8 unit tests. Updated spec.md requirement 53 and decision 26. Not tested: a screen reader. |

## Instance 21: Refactor: remove custom.css and use only GOV.UK Frontend

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Remove `custom.css` and use only the classes in `govuk-frontend` |
| **What AI Generated** | Deleted `src/custom.css` and its import. It had held four things: blue and grey colours for the result panel, a focus-ring rule for elements that code focuses, print rules, and a margin for the footer note. Replaced them with the library's own classes: `govuk-skip-link-focused-element` for the focus ring, `govuk-!-display-none-print` on the skip link, cookie banner, phase banner, service name bar, Back links and footer for printing, and `govuk-!-margin-top-4` on the footer note. |
| **What You Changed + Why** | The one thing the library cannot do is colour the panel: it is always green, so a Not Eligible result in a green success panel would mislead. Changed the design instead of adding CSS: Eligible keeps the green confirmation panel, and Partially Eligible and Not Eligible show a heading followed by the library's blue notification banner headed "Your support". The print view needed no custom rules, because the library's own print styles draw the panel with a black border. Tested by rerunning the browser checks (all pass), keyboard focus order (skip link is still the first Tab stop and focus resets after each page change), the Back link tests, the 26 accessibility scans (0 violations), the 8 unit tests, and a print-media screenshot. Updated spec.md requirement 37, decisions 12 and 23, plan.md, README and CLAUDE.md. Not tested: a real printer, and the notification banner with a screen reader. |

## Instance 22: Design: coloured result panels and what the user is eligible for

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Result page: green panel for Eligible, blue for Partially Eligible, grey for Not Eligible, and show in the panel what a partially eligible user is eligible for |
| **What AI Generated** | All three outcomes now use the GOV.UK confirmation panel again (replacing the notification banner from instance 21). The panel body reads "You may be eligible for" and then the support in bold, for example "Heat Pump Support Only" or "Insulation Support Only", and "Your support" with "No grant" for Not Eligible. Two lines at the end of `app.scss` recolour the panel. |
| **What You Changed + Why** | This partly reverses the instruction to use no custom CSS, because the library has no blue or grey panel. I kept it as small as possible: the panel's background is `var(--govuk-success-colour)`, so the two rules only point that variable at the library's own `--govuk-brand-colour` (blue, rgb 29, 112, 184) and `--govuk-secondary-text-colour` (grey, rgb 72, 73, 73), with no colour values of my own. Checked the colours in the browser, and that white text on both passes the accessibility scan (26 scans, 0 violations). Reran the browser checks, Back link tests and 8 unit tests, and all pass. For flats and for insulated homes with other heating, the intent does not say what the support covers, so the panel just says "Reduced support" and I did not invent more. Updated spec.md requirement 37 and decisions 12 and 23, plus plan.md, README and CLAUDE.md. |

## Instance 23: Refactor: remove the last custom CSS, green panel for every outcome

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Remove the two panel colour rules and make the result panel green |
| **What AI Generated** | Deleted the two rules at the end of `app.scss`, so it now holds only the `govuk-frontend` import and its two settings. Removed the blue and grey panel classes from `ResultPage.jsx`, so every outcome uses `govuk-panel govuk-panel--confirmation`. |
| **What You Changed + Why** | The user chose no custom CSS over colour-coded panels. The cost is that a Not Eligible result now appears in a green success panel, which could be read as good news at a glance. To reduce that risk without CSS, the wording does the work: the heading says "You are not eligible", and the line in the panel says "Your support" and "No grant" instead of "You may be eligible for". Checked in the browser that all three panels are green (rgb 15, 122, 82) with white text. Reran the browser checks, Back link tests, 26 accessibility scans (0 violations) and 8 unit tests, and all pass. Updated spec.md requirement 37 and decisions 12 and 23, plus plan.md, README and CLAUDE.md. If a reviewer raises the green Not Eligible panel, this log entry explains the choice. |
