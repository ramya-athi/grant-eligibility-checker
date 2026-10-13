# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

**Patterns covered so far:** planning (1, 2, 3), scaffolding (4), test generation (5)

## Instance 1: Planning — service intent (`intent.md`)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Pattern** | Planning |
| **Task** | Asked Claude Code to write `intent.md` (problem, users, outcome, in/out of scope) from the Hackathon Pack, Learner Handbook and our high-level brief (`Eligibility-checker-brief.md`), asking us up to 5 clarifying questions. |
| **What AI Generated** | `intent.md` with problem statement (35-min call-centre wait), users, three outcomes, the 5-question journey, a 3-step rule order (not eligible → partial → eligible), in/out of scope and success measures. It found 5 gaps in our brief and asked about them: renters' outcome, £60k+ income, flats/studios and "mid-terraced", insulated home with non-gas/electric heating, and validation (our brief said "phase 2"). It also assumed, without asking, that "Other" heating counts as not gas/electric and that all partial reasons are listed together. Before writing anything, it first tried to read the whole starter codebase. |
| **What You Changed + Why** | Stopped Claude reading the starter code before the intent was agreed. Intent is about the problem, not the code, and we wanted the scope decided first. **Overrode its recommendation on renters:** Claude suggested "not eligible", but we chose **partially eligible (with landlord/housing association permission)**, because renters are a large group the scheme should reach. Accepted: £60k+ not eligible, flats/studios not eligible, insulated + non-gas/electric heating not eligible. Brought **validation into scope for Day 2** (our brief said phase 2) because the pack's checklist assesses the GOV.UK error pattern. Reviewed the unasked assumptions ("Other" = not gas/electric, list all partial reasons) and kept them. |

## Instance 2: Planning — build spec (`spec.md`)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Pattern** | Planning |
| **Task** | Asked Claude Code to write `spec.md` with clear, buildable requirements from the pack, handbook, brief and `intent.md`, asking us up to 10 clarifying questions. |
| **What AI Generated** | Read the starter code this time and compared it with our brief. It found: question order differs (starter asks property type first), Back links and footer use `<a href>` (full reload wipes answers), a nested `<main>` in `AccessibilityStatementPage`, the starter's TODO options don't match our brief, and `App.css` is missing hint, phase banner, footer, cookie and conditional-reveal styles. It asked 10 questions and then wrote `spec.md`: requirement IDs with MUST/SHOULD/COULD priorities, exact question text, values and error messages, a pure `checkEligibility()` contract with reason codes, result page content, WCAG 2.2 AA requirements, 14 unit test cases, a build plan by checkpoint and owner, and the definition of done. |
| **What You Changed + Why** | **Overrode 2 of Claude's recommendations:** (1) kept the **starter's question order** instead of our brief's, so we don't have to rewire routes under time pressure, and updated `intent.md` to match; (2) **reused the green panel for partial outcomes** instead of adding a new panel style, which means less custom CSS and fewer contrast risks. Chose a simpler **redirect to the start page** (not the first unanswered question) for direct visits to `/check-answers` and `/result`. Chose only **Start again + feedback** links on the result page (dropped "Change answers"). Kept Yes/No only for insulation (no "I do not know") to match the brief. Agreed the team split: Ramya does state, Q1–Q3 and Check your answers; Nithin does Q4–Q5, eligibility, tests, Result and layout. **To check during the build:** the expected results in the spec's test table are ours. Claude must not change them to make tests pass. |

## Instance 3: Planning — implementation plan (`plan.md`)

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Pattern** | Planning |
| **Task** | Asked Claude Code to write `plan.md`, a build plan from `intent.md` and `spec.md` using `starter/` as the starting point, without building anything. |
| **What AI Generated** | Listed what each starter file has today and what it needs. Confirmed `index.html` already has `lang="en"`. Found that `App.css` has no focus style for radios or the error summary, and that `node_modules` is committed (2,286 files). Proposed a target file tree and an architecture: shared `RadioQuestion`, `ErrorSummary` and `BackLink` components, a `questions.js` data file, a pure `validation.js`, a `usePageTitle` hook and a `RequireAnswers` route guard. Wrote 6 phases mapped to the pack's checkpoints, with owner, files, spec IDs and a "done when" check for each task. Also covered ways of working for avoiding conflicts in `App.jsx` and `App.css`, an AI_LOG plan aiming for 5 patterns, and a risk table. It noticed the spec had `questions.js` in Nithin's step 1 although Ramya also needs it then, so it moved it to a shared Phase 0 and updated the spec. |
| **What You Changed + Why** | *Pending team review.* Check before building: (1) whether we want shared components (`RadioQuestion`) or five self-contained pages (more code, but simpler to split); (2) whether one owner for `App.jsx` works in practice; (3) whether the Phase 1 timings are realistic. Record what we change here. |

## Instance 4: Scaffolding — build the whole service with GOV.UK Frontend

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Pattern** | Plan-driven scaffolding |
| **Task** | Asked Claude Code to build the whole app end to end (both Ramya's and Nithin's parts) from `spec.md`/`plan.md`, starting from `starter/`, **using GOV.UK Frontend components**, and to update the intent, spec and plan where they didn't cover that. |
| **What AI Generated** | Updated `intent.md`, `spec.md` (DS-01 to DS-04, VAL-02, LAY-01, LAY-05, RES panel classes, the new EL-07) and `plan.md`, because the spec had said *not* to use `govuk-frontend`. Installed `govuk-frontend@6.5.1` and replaced the starter's teaching CSS with it. Built React components whose markup is copied from the GOV.UK Frontend fixtures (header with service navigation, phase banner, skip link, cookie banner, radios with conditional reveal, error summary, summary list, panel, footer), using React for behaviour instead of GOV.UK's JS. Also built `questions.js`, a shared `QuestionPage` and `useQuestionForm`, `checkEligibility()`, `validateQuestion()`, the route guard, change mode, Start again, the content pages and the accessibility statement. Fixed the set-up: added `.gitignore` and untracked `node_modules`. The committed copy had lost its executable permissions, which broke `npm install`. |
| **What You Changed + Why** | **You chose GOV.UK Frontend over the starter's teaching CSS.** The official components are tested with real users and handle accessibility and responsive behaviour, which is closer to a real service. **Corrections made during the build:** (1) the first accessibility statement claimed screen reader testing that hadn't been done. It was rewritten to list only the checks actually run, and the status was changed to "partially compliant". (2) The phase banner was moved inside the `<header>` landmark after axe reported it was outside any landmark. (3) The eligibility function originally fell through to "eligible" if an answer was blank, so EL-07 was added to make it throw instead. *Pending team review:* read the diff per page before merging, especially the content wording and `CLAUDE.md`. |

## Instance 5: Test generation — unit, journey and accessibility tests

| Field | Detail |
|-------|--------|
| **Date** | 2026-10-12 |
| **Pattern** | Test generation |
| **Task** | Write tests for the rules (our T1–T14 expected results from `spec.md` §12.1), validation and full user journeys, and check accessibility automatically. |
| **What AI Generated** | `eligibility.test.js` (T1–T14, plus a reasons-have-messages check and a missing-answer check), `validation.test.js` (6 tests) and `App.test.jsx` (20 jsdom journey tests with axe-core). In total, `npm test` shows 42 passing tests. It also ran a one-off Playwright/Chromium check (not added to the repo): keyboard-only journeys at 1280px and 320px, axe with colour contrast, sideways-scroll and focus-visibility checks. After switching on React Router's v7 flags, 2 journey tests failed because navigation became asynchronous, so the tests were changed to wait (`findBy…`). The app code wasn't changed. |
| **What You Changed + Why** | Expected results were **taken from our spec, not invented by the AI**, so the tests check our rules rather than Claude's understanding of them. **Two axe findings were not "fixed" by hiding them:** `aria-allowed-attr` on the "Other" radio (GOV.UK Frontend adds `aria-expanded` itself) and `region` on the skip link (GOV.UK puts the cookie banner first). Both are excluded narrowly, with a comment in the test, and listed in the accessibility statement. *Pending team action:* screen reader spot check (spec §12.2 step 5), since jsdom and axe can't replace it. |

<!--
TEMPLATE for new entries — copy below this line. Keep entries in date order.
Try to cover new patterns: plan-mode scaffolding, multi-agent critique, refactor, test generation.
"What You Changed + Why" is what assessors read most: say what was wrong or missing in the AI output and why your change is better.

## Instance N: <Pattern> — <short task name>

| Field | Detail |
|-------|--------|
| **Date** | YYYY-MM-DD |
| **Pattern** | Planning / Plan-mode scaffolding / Multi-agent critique / Refactor / Test generation |
| **Task** | |
| **What AI Generated** | |
| **What You Changed + Why** | |
-->
