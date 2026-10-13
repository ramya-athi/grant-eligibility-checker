# Presentation guide: Green Home Grant eligibility checker

A run sheet for a 10 to 12 minute demo. Each section says **what to say**, **what to show**, and **where to show it** (the screen, page or file). Grant amounts are placeholders, so say so once at the start.

## Before you start (5 minutes)

- [ ] `cd starter && npm run build && python3 server.py`
- [ ] Open the app in a browser: `https://app2-lab11133.labs.decoded.com/` (port 5002)
- [ ] Open a second tab on the same address, ready for the keyboard demo
- [ ] Open these in your editor, in tabs: `intent.md`, `spec.md`, `plan.md`, `starter/AI_LOG.md`, `starter/AUDIT_LOG.md`, `starter/src/eligibility.js`
- [ ] A terminal in `starter/`, with the font large
- [ ] Clear the browser's storage so the cookie banner shows on the first visit
- [ ] Know your three answer sets (see section 4)

## 1. The problem (1 minute)

**Say:** Citizens phone a call centre and wait about 35 minutes to find out if they qualify for the Green Home Grant. This service replaces that call with an answer in under 2 minutes.

**Show:** `intent.md`, the **Problem** and **What success looks like** headings.

**Point out:** The three outcomes (Eligible, Partially Eligible, Not Eligible), the reasons, a placeholder amount and next steps.

## 2. How we planned it (1 minute)

**Say:** We wrote down what we wanted before any code, then planned, then built.

**Show, in order:**

| File | What to point at |
|------|------------------|
| `intent.md` | Written from the interview, in my own words |
| `spec.md` | Numbered requirements you can check in the running app, decisions with one-line reasons, open questions |
| `plan.md` | Five steps, each with a check |

## 3. The journey (1 minute)

**Say:** One question per page, five questions, then a summary, then the result.

**Show in the app, in order:**

1. **Start page** (`/`): phase banner (alpha), cookie banner, Start now
2. Click **Start now**, then go through the five questions: housing, income, property type, insulation, heating

## 4. Live demo: the three outcomes (3 minutes)

Run these in the app. Each ends on the **Result page**.

| Order | Answers | Expected result |
|-------|---------|-----------------|
| 1 | Rent, any other answers | **Not Eligible**: only homeowners can get the grant |
| 2 | Own, under £40,000, semi-detached, no insulation, gas | **Eligible**: full grant |
| 3 | Own, £40,000 to £59,999, studio flat, any other answers | **Partially Eligible**: reduced support |

**For each result, show:** the green panel and the outcome in words, the reasons, the placeholder amount, the next steps, and the reference number (`ELG-ddmmyy-XXXXXX`).

**Show once:** the **Print this page** link (hide the print dialog afterwards).

**Say:** The panel is green for every outcome because we use only the GOV.UK library, with no custom CSS. The wording carries the meaning, not the colour.

## 5. Errors and changing answers (1 minute)

**Show in the app:**

1. On any question, select **Continue** without choosing: the error summary appears at the top and takes focus, with an inline message by the radios
2. On heating, choose **Other** and leave the text box empty: it blocks Continue
3. On **Check your answers** (`/check-answers`), select **Change**: it returns straight to the summary after you continue

## 6. Accessibility (2 minutes)

**Say:** Accessibility is checked by hand and by machine.

**Show:**

1. **Keyboard** (second tab): press Tab once, the **Skip to main content** link appears; tab through a question, focus is always visible; the whole journey works without a mouse
2. **Terminal:** `npm run a11y`. It scans every page and state with axe and should finish with **0 violations**
3. **Page:** `/accessibility-statement` (footer link)
4. **File:** `starter/AUDIT_LOG.md`: the before and after table (tests, Lighthouse 78 and 85 to 100 and 100, keyboard, 375px)

## 7. Rules and tests (1 minute)

**Show:**

1. **File:** `starter/src/eligibility.js`: pure rules, checked in a fixed order, placeholder amounts in one object at the top
2. **Terminal:** `npm test`. 19 tests pass, including every one of the 1,568 answer combinations
3. **Terminal (from the repo root):** `node .claude/skills/check-eligibility/run.mjs`. 26 named scenarios, each PASS or FAIL, grouped by outcome

## 8. Cookies and privacy (1 minute)

**Say:** The service sets no real cookies. It keeps answers in session storage, the reference number in session storage, and the banner choice in local storage for one year.

**Show:**

1. **Page:** `/cookies`: the table of the three storage items
2. **Terminal:** `npm run cookies`. Banner behaviour, one-year expiry, no `Set-Cookie` header, no requests to other sites

## 9. Working with AI (1 minute)

**Say:** Every AI-assisted change is logged. Where AI got something wrong, we recorded what we changed and why.

**Show:** `starter/AI_LOG.md`: scroll to a few entries, for example instance 30 (merging a colleague's reference number work without losing either person's changes). Also point at the two skills in `.claude/skills/`.

## 10. Rubric map (30 seconds)

**Show:** `README.md`, the **How this meets the rubric** table. Walk the six rows and say where the evidence is.

## 11. Close

**Say:** It is a prototype with a fictional scheme and placeholder amounts. Out of scope: real applications, sign in, saved progress, evidence upload and staff tools. Next steps would be real amounts and next-step links, a service-wide CI run of the tests and scan, and user research with real citizens.

## If something goes wrong

| Problem | Fix |
|---------|-----|
| "No app on this port" | Wrong address: use `app2-lab11133...` for port 5002 |
| "Address already in use" | `pkill -f "python3 server.py"` in its own command, then start the server again |
| Blank page after a code change | `npm run build` again (no server restart needed) |
| Cookie banner not showing | Clear local storage for the site |
| `npm run a11y` connection refused | The server is not running: start it first |

## Timing

| Section | Minutes |
|---------|---------|
| 1 Problem | 1 |
| 2 Planning | 1 |
| 3 Journey | 1 |
| 4 Live demo | 3 |
| 5 Errors and change | 1 |
| 6 Accessibility | 2 |
| 7 Rules and tests | 1 |
| 8 Cookies | 1 |
| 9 AI log | 1 |
| 10 to 11 Rubric and close | 1 |
| **Total** | **13** |

To shorten to 10 minutes, drop sections 5 and 8 and mention them in the rubric table instead.
