# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A GOV.UK-style eligibility checker for the fictional Green Home Grant. The app lives in `starter/`; everything below is run from there unless stated. `intent.md` (what and why), `spec.md` (requirements, decisions, open questions) and `plan.md` (build steps) are the source of truth. Where they disagree with the starter's original wording, `intent.md` wins.

## Commands

```
cd starter
npm install
npm run build                  # must run before the server; also after any front-end change
python3 server.py              # serves dist/ on 0.0.0.0:5002; PORT=5000 python3 server.py for another port
npm test                       # node --test src/*.test.js (no lint or type-check is configured)
node --test --test-name-pattern="flats" src/eligibility.test.js   # one test
```

From the repository root, `node .claude/skills/check-eligibility/run.mjs` runs 26 named scenarios against the real rules, and `node .claude/skills/green-home-grant-eligibility/check.mjs '<answers json>'` checks one set of answers.

`server.py` reads `dist/` from disk on every request, so rebuilding is enough; restart is not needed. `npm run dev` (Vite) also binds port 5002 with `strictPort`, so it cannot run alongside `server.py` on the default port.

On the lab VM the proxy maps `app<N>-lab11133.labs.decoded.com` to port `500<N>` (`app2-…` is 5002, plain `app-…` is 5000). `localhost` and `https://<host>:5002` do not work for browsers outside the VM.

## Architecture

- **Serving:** Flask (`server.py`) serves the Vite build. Any path that is not a file returns `index.html` so React Router routes survive reloads. Missing `/assets/` files return 404.
- **One source for the questions:** `src/questions.js` defines the five questions (wording, hint, options, error message, path). The question pages, the Check your answers summary, `firstMissingPath()` (the guard used by the summary and result pages) and the skill scripts all read it. Adding or changing an option means editing it there and in `src/eligibility.js`.
- **Rules are pure:** `src/eligibility.js` `checkEligibility(answers)` returns `{ outcome, support, reasons, amount }`. Rules are checked in a fixed order (not eligible, flat or studio, full, heat pump only, insulation only, income band, catch-all) so every combination gives exactly one outcome. Grant amounts are placeholders in `PLACEHOLDER_AMOUNTS`. The `check-eligibility` and `green-home-grant-eligibility` skills import this file directly.
- **State:** `useAnswers` (in `App.jsx`) holds answers in React state and mirrors them to `sessionStorage`, so Back links, reloads and the Change flow keep them. The five question pages are thin wrappers around `components/RadioQuestion.jsx`.
- **Change flow:** Change links go to `<question path>?change=1`; `RadioQuestion` then returns to `/check-answers` instead of the next question.
- **Focus and errors:** `App.jsx` resets keyboard focus to a top element on every route change so the skip link is the first Tab stop. Validation shows a GOV.UK error summary (`ErrorSummary.jsx`) plus an inline message; the heating "Other" option needs its free-text box filled.
- **Styling:** `src/app.scss` pulls in the official `govuk-frontend` with Arial instead of GDS Transport; `src/custom.css` holds only the Partially Eligible and Not Eligible panel colours. Components use GOV.UK markup classes directly.

## Gotchas

- `starter/node_modules` is tracked in git (and `.gitignore` does not change that), and `npm install` leaves hundreds of modified files in it. Stage with `git add -A -- . ':!starter/node_modules'` and do not commit those changes.
- `package.json` is on Vite 8, `@vitejs/plugin-react` 5.2 (4.x only supports Vite up to 7, so a fresh `npm install` fails with ERESOLVE on it) and React Router 7. Do not run `npm audit fix --force`. `vite.config.js` sets `css.lightningcss.errorRecovery: true` because govuk-frontend contains an Internet Explorer media query the minifier rejects; the build fails without it. The `server` block there is the course's lab setup, so leave it alone.
- Browser checks that click through the app must wait for client-side navigation (React Router 7 updates slightly after a click).
- Record every AI-assisted change in `starter/AI_LOG.md` using its existing four-field table (Date, Task, What AI Generated, What You Changed + Why). It currently has instances 1 to 11.
- Keep `spec.md` and `intent.md` in step with behaviour changes, and describe the grant amounts as placeholders wherever they are shown.
