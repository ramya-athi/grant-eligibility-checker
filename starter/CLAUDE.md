# Project context

GOV.UK citizen service: "Check if you can get a Green Home Grant" (fictional scheme, hackathon prototype).
Requirements live in `../spec.md` (IDs like NAV-02, VAL-03), scope in `../intent.md`, build order in `../plan.md`.
If code and spec disagree, the spec wins – or update the spec with the team first.

## Stack
- React 18, React Router 6 (`BrowserRouter`), Vite 5, Vitest 1 (`npm test`), jsdom + Testing Library + axe-core for journey tests.
- GOV.UK Frontend 6.5.1: CSS only, imported in `src/main.jsx`. Fonts/images are copied to `public/assets` by `npm run copy-assets` (runs before dev/build).
- Do not edit `vite.config.js` (lab proxy setup). App runs at `https://<hostname>:5002`.

## Rules
- All UI follows the GOV.UK Design System. Copy component markup from GOV.UK Frontend 6.5.1
  (`node_modules/govuk-frontend/dist/govuk/components/*/fixtures.json`). Use `govuk-*` classes.
- Do NOT call GOV.UK Frontend JavaScript (`initAll`) or add `govuk-react`. Behaviour is written in React.
- `src/App.css` holds only `app-*` classes built from GOV.UK custom properties. No new hex colours.
- One question per page: `QuestionPage` + `RadioQuestion`, driven by `src/data/questions.js`. Fieldset with the
  question as the `<h1>` inside the `<legend>`, a hint, every input has a `<label>`. Button text is "Continue".
- Use `<Link>` / `navigate()` for in-app links – never `<a href>` (a reload wipes the answers).
- All answers live in one `answers` state object in `App`. Pages never keep their own copy between visits.
- Summary list is a `<dl class="govuk-summary-list">`, never a `<table>`. Change links have visually hidden text.
- Error summary: `govuk-error-summary` with an inner `role="alert"` (not `alertdialog`), heading "There is a problem",
  links to each field, focus moves to it. Inline error has the same wording. Title starts with "Error: ".
  Messages say what to do ("Select the type of property you live in"), never "This field is required".
- Eligibility rules live only in `src/utils/eligibility.js` (pure function). Pages contain no rules.
- The expected results in `src/utils/eligibility.test.js` were decided by the team. Never change them to make a
  test pass – fix the code, or ask.
- Do not add features that are not in `spec.md`.
- After any AI-assisted task, add an entry to `AI_LOG.md` (Date, Pattern, Task, What AI Generated,
  What You Changed + Why) using the template at the bottom of that file.
