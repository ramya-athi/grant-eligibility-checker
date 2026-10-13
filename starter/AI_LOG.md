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

## Instance 13: Planning: reference number and saved record

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Update intent.md, spec.md and plan.md for a new feature: a reference number (`ELG-ddmmyy-` plus 6 random characters) shown on the result page after the outcome and before the details, and each check saved as a record in a JSON file (no database), keyed by the reference |
| **What AI Generated** | Intent: new in-scope item 13, a success point, and out-of-scope items. Spec: requirements 23, 37 and 41 changed, new requirements 52-63, decisions 23-35 and open questions 21-26. Plan: Step 6 with files, tests and browser checks. It found that the Privacy page promises answers are never stored on a server, and that `npm run dev` has no API. It first proposed server-side validation of the answers (an allowed-values list in `server.py` and a test to keep it matching `questions.js`), then asked about it in more detail (field-level errors, "Other" text rules, request checks). |
| **What You Changed + Why** | Answered open questions 21-24: records hold the answers, the outcome (worked out on the server by running the real `eligibility.js`, so the rules are not copied) and `savedAt`; the reference leaves out look-alike characters (0, O, 1, I, L); records are kept until deleted by hand, and the Privacy page says so; every submission is a separate check, and updating one is out of scope. **Removed server-side validation**: it is out of scope for this phase and will come later, so it is now an out-of-scope item and decision 35, which records the risk (a request sent outside the app could save answers that aren't valid options). Questions 25 (Vite `/api` proxy for `npm run dev`) and 26 (a "keep a note of your reference" line) are still open. Not built yet. |

## Instance 14: Build: reference number and saved record

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | Build plan.md Step 6: the `ELG-ddmmyy-XXXXXX` reference number on the result page and each check saved to a JSON file, with no server-side validation |
| **What AI Generated** | `server.py`: `POST /api/checks`, a UK-date reference using `secrets` without 0, O, 1, I or L, the outcome worked out by running `eligibility.js` with Node, and a locked, atomic write of `{ answers, outcome, savedAt }` to `data/eligibility-checks.json`. `test_server.py` (9 `unittest` tests: format, look-alike characters, a British Summer Time midnight date, the record shape, the outcome from the real rules, earlier records kept, reference clash, a failure saving nothing, 8 simultaneous submissions). `src/api.js`, the reference in `useAnswers`, Submit with a double-click guard and a GOV.UK error summary on failure, the reference inside the result panel with the support label moved below it, new Privacy text, `.gitignore` for `starter/data/`, and `CLAUDE.md` updates. It ran 29 browser checks in Chromium against the built app. |
| **What You Changed + Why** | Corrections made during the build: (1) a Change followed by Continue with no actual change was clearing the reference, which goes against spec 59, so `setAnswer` now clears it only when a value differs; (2) the first Privacy text said records let "a check be found again from its reference number", which implies a lookup feature that is out of scope, so it was reworded; (3) the browser check reported a wrong outcome because it read the heading before React Router 7 had re-rendered, so the script was changed to wait (the code was right). Found but not fixed: axe `region` on `.govuk-phase-banner` on every page, which is already on `main`. **Mistake:** a test POST sent to the team's running server on port 5002 saved a blank record to the real records file. It was the only record, and the file and folder were deleted to restore the earlier state. This shows the decision 35 risk in practice, and `CLAUDE.md` now says to test with `CHECKS_FILE`. Q25 (Vite proxy) and Q26 (a "keep a note" line) are still open; the defaults used were no proxy and no extra line. *Pending team review.* |

## Instance 15: Refactor: reference number made in the browser, nothing stored

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-13 |
| **Task** | The platform can't support saving checks on the server, so: make the reference in the browser and only show it, store nothing, update intent, spec and plan, and clean up what was built for saving |
| **What AI Generated** | Removed the server-side work from Instances 13 and 14: `server.py`, `.gitignore`, `GovukButton.jsx`, the Privacy text and `CLAUDE.md` were restored to `main`, and `test_server.py`, `src/api.js`, `starter/public/` (old GOV.UK asset copy), `__pycache__/` and the old `dist/` build were deleted. Added `src/reference.js` (`ELG-ddmmyy-XXXXXX`, Europe/London date, `crypto.getRandomValues` without 0, O, 1, I or L, throwing away values that would bias the result) and `src/reference.test.js` (5 tests, run by `npm test`). Kept the result-panel layout and the reference handling in `useAnswers` from Instance 14; Submit now just generates the reference. Rewrote the docs from `main`: intent item 13 and out-of-scope items, spec requirements 23, 37, 41 and 52-58, decisions 23-29, open questions 21-22, plan Step 6. |
| **What You Changed + Why** | Decided to drop server storage because of a platform limitation. The JSON records file, the server endpoint and server-side validation are gone, and spec open question 22 records what a later phase would need to store checks. Accepted that references can't be guaranteed unique without storage (spec 58: about 887 million per day). *Pending team review.* |
