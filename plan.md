# Plan: building the Green Home Grant checker from the starter

| | |
|---|---|
| **Inputs** | `intent.md` (why and scope), `spec.md` (requirements and IDs) |
| **Starting point** | `starter/`: Vite + React 18 + React Router 6, plus GOV.UK CSS in `src/App.css` |
| **Team** | Ramya (`ra/*` branches), Nithin (`ns/*` branches) |
| **Status** | **Built on 2026-10-12** (Phases 0–5, by Claude Code on `ra/eligibility-checker`). Waiting for team review, a manual screen reader check and the Phase 6 demo. See Section 10 for what was built. |

This plan says **how** and **in what order** to build what `spec.md` describes. Requirement IDs in brackets (for example `[NAV-02]`) point back to the spec. If the plan and the spec disagree, the **spec wins**: fix the plan.

---

## 1. Where the starter is today

| File | What's there now | What we need to do |
|---|---|---|
| `index.html` | `lang="en"`, title, viewport | Keep it. A11Y-10 is already met. |
| `src/main.jsx` | `BrowserRouter` wrapping `App` and the CSS import | Keep it as it is. |
| `src/App.jsx` | Routes in starter order. TODOs for state, phase banner and footer. `<main role="main">` | Add state, guards, layout, extra routes, and `id="main-content"` on `<main>`. |
| `src/App.css` | 366 lines of teaching CSS that copies GOV.UK styles | **Replace with GOV.UK Frontend 6.5.1** (spec DS-01 to DS-04). Import `govuk-frontend.min.css` in `main.jsx`. `App.css` keeps only `app-*` classes. |
| `components/GovukHeader.jsx` | "GOV.UK" text using `<a href="/">` | Add the service name. Switch to `<Link>`. |
| `components/PhaseBanner.jsx` | Done, but uses `<a href>` for feedback | Switch to `<Link to="/feedback">`. Mount it in `App`. |
| `components/GovukFooter.jsx` | One link, using `<a href>` | Add 6 links using `<Link>`. Mount it in `App`. Add CSS. |
| `components/GovukButton.jsx` | `<button>` with an optional start variant | Keep it. Use it for Start now, Continue and Submit. |
| `pages/*Page.jsx` (8) | Headings and TODOs only. Back links use `<a href>`. Headings and options are not the ones in the spec. | Rebuild each page to the spec. |
| `pages/AccessibilityStatementPage.jsx` | Section headings. It has a **nested `<main>`**. | Remove the `<main>`. Write the content. |
| `AI_LOG.md` | 2 planning entries | Add an entry in each phase (see Section 7). |
| `package.json` | No test runner | Add `vitest@1` and a `test` script. |
| repo | **`node_modules` is committed (2,286 files)**. No `.gitignore`. | Fix this in Phase 0. |

---

## 2. Target file structure

```
starter/
├── CLAUDE.md                         NEW   project rules for Claude (both)
├── AI_LOG.md                         EDIT
├── package.json                      EDIT  + govuk-frontend@6.5.1, vitest@1, "test" + "copy-assets" scripts
├── scripts/copy-govuk-assets.mjs     NEW   copies govuk-frontend fonts/images → public/assets (runs before dev/build)
├── public/assets/                    GENERATED (git-ignored)
└── src/
    ├── main.jsx                      EDIT  import govuk-frontend.min.css
    ├── App.jsx                       EDIT  state, routes, guards, layout     (Ramya owns)
    ├── App.css                       EDIT  teaching CSS removed; app-* classes only
    ├── data/
    │   └── questions.js              NEW   question config: labels, values, hints, errors, routes
    ├── utils/
    │   ├── eligibility.js            NEW   checkEligibility() – pure        (Nithin)
    │   ├── eligibility.test.js       NEW   T1–T14                           (Nithin)
    │   └── validation.js             NEW   validateQuestion() – pure        (Ramya)
    ├── hooks/
    │   └── usePageTitle.js           NEW   sets document.title, "Error: " prefix (Ramya)
    ├── components/
    │   ├── GovukHeader.jsx           EDIT                                    (Nithin)
    │   ├── PhaseBanner.jsx           EDIT                                    (Nithin)
    │   ├── GovukFooter.jsx           EDIT                                    (Nithin)
    │   ├── GovukButton.jsx           keep
    │   ├── SkipLink.jsx              NEW                                     (Nithin)
    │   ├── CookieBanner.jsx          NEW                                     (Nithin)
    │   ├── BackLink.jsx              NEW   <Link> + change-mode aware       (Ramya)
    │   ├── ErrorSummary.jsx          NEW   role="alert", focus on show      (Ramya)
    │   ├── RadioQuestion.jsx         NEW   fieldset/legend/hint/error/radios + conditional slot (Ramya)
    │   └── ScrollToTop.jsx           NEW                                     (Ramya)
    └── pages/
        ├── StartPage.jsx             EDIT                                    (Ramya)
        ├── PropertyTypePage.jsx      EDIT  Q1                                (Ramya)
        ├── OwnershipPage.jsx         EDIT  Q2                                (Ramya)
        ├── IncomePage.jsx            EDIT  Q3                                (Ramya)
        ├── InsulationPage.jsx        EDIT  Q4                                (Nithin)
        ├── HeatingPage.jsx           EDIT  Q5 + "Other" reveal               (Nithin)
        ├── CheckAnswersPage.jsx      EDIT                                    (Ramya)
        ├── ResultPage.jsx            EDIT                                    (Nithin)
        ├── AccessibilityStatementPage.jsx EDIT                               (Nithin)
        ├── ContentPage.jsx           NEW   cookies/privacy/terms/help/contact/feedback (Nithin)
        └── NotFoundPage.jsx          NEW   COULD                             (Nithin)
```

**Why `RadioQuestion` and `questions.js`?** All five questions share the same markup, validation and error pattern [QP-01 to QP-08, VAL-01 to VAL-07]. If we write it once and drive it from data:

- the 5 pages stay small, and look the same as each other
- accessibility fixes are made in one place
- Check your answers and the result page use the same labels [CYA-02]

We still keep the starter's **separate page files**, so ownership stays clear and the routes in `App.jsx` don't change.

---

## 3. Architecture

### 3.1 Component tree

```
App  (answers state, cookie state)
├── CookieBanner          until dismissed
├── SkipLink              → #main-content
├── GovukHeader
├── PhaseBanner           → /feedback
├── ScrollToTop           (no UI)
├── <main id="main-content">
│   └── Routes
│       ├── /                     StartPage
│       ├── /property-type        PropertyTypePage ─┐
│       ├── /ownership            OwnershipPage     │ each renders:
│       ├── /income               IncomePage        │ BackLink, ErrorSummary, RadioQuestion, GovukButton
│       ├── /insulation           InsulationPage    │
│       ├── /heating              HeatingPage ──────┘ (+ heatingOther input in conditional slot)
│       ├── /check-answers        RequireAnswers → CheckAnswersPage
│       ├── /result               RequireAnswers → ResultPage → checkEligibility()
│       ├── /accessibility-statement
│       ├── /cookies /privacy /terms-and-conditions /help /contact /feedback   ContentPage
│       └── *                     NotFoundPage
└── GovukFooter
```

`RequireAnswers` is a tiny wrapper defined in `App.jsx`. If any answer is missing, it renders `<Navigate to="/" replace />` [NAV-05].

### 3.2 Data flow

```
questions.js ──labels/values/errors──► RadioQuestion, CheckAnswersPage, validation.js
                                                     │
User picks radio → local `selected` in page → Continue → validateQuestion()
        │ errors? → show ErrorSummary + inline error, focus summary, title "Error: …"
        │ ok      → setAnswers(prev => ({ ...prev, [id]: selected }))
        │           → navigate(changeMode ? '/check-answers' : next)
        ▼
App.answers ──► CheckAnswersPage (labels) ──Submit──► ResultPage ──► checkEligibility(answers)
                                                                     → { status, reasons[] }
```

**Prop contract for every question page:** `({ answers, setAnswers })`.

**Change mode:** read it with `useSearchParams()`: `const changeMode = searchParams.get('change') === 'true'`.

### 3.3 `questions.js` shape (agree this in Phase 0; both sides depend on it)

```js
export const QUESTIONS = {
  propertyType: {
    id: 'propertyType',
    route: '/property-type',
    prev: '/', next: '/ownership',
    heading: 'What type of property do you live in?',
    hint: 'Choose the option that best describes the building you live in.',
    summaryKey: 'Property type',
    errorRequired: 'Select the type of property you live in',
    options: [
      { value: 'detached', label: 'Detached house' },
      // ... exactly as spec §4
    ],
  },
  // ownership, incomeBand, insulation, heating (with errorOtherRequired, errorOtherTooLong)
};
export const QUESTION_ORDER = ['propertyType', 'ownership', 'incomeBand', 'insulation', 'heating'];
export const initialAnswers = { propertyType: '', ownership: '', incomeBand: '', insulation: '', heating: '', heatingOther: '' };
export const labelFor = (id, value) => QUESTIONS[id].options.find(o => o.value === value)?.label ?? '';
```

### 3.4 Key implementation decisions

| Decision | Choice | Reason |
|---|---|---|
| Where a selection lives before Continue | Local `useState` in the page, initialised from `answers[id]` | Validation runs on Continue [VAL-01]. Answers in `App` change only once they are valid. |
| Back link | `BackLink` component: `<Link to={changeMode ? '/check-answers' : prev}>` | Uses explicit routes, which work on deep links [NAV-03]. |
| Error focus | `ErrorSummary` uses `useRef` and `useEffect` to call `.focus()` when the errors change and are not empty | [VAL-03] |
| Error-link focus | The `onClick` handler calls `preventDefault`, then `document.getElementById(id).focus()` | A plain `#hash` link can clash with the router. This keeps focus reliable [VAL-04]. |
| Conditional reveal | `RadioQuestion` takes a `conditional={{ value: 'other', content: <input…/> }}` prop. It renders the content under that radio only when it is selected, with `aria-controls` and `aria-expanded`. | [Q-02], and keeps Q5 inside the shared component. |
| Page title | `usePageTitle(h1, hasError)` | One hook for every page [A11Y-08]. |
| Cookie state | `useState` in `App`: `'unset' \| 'accepted' \| 'rejected' \| 'hidden'` | Session only, with no real cookies [spec §10.1]. |
| Design system | GOV.UK Frontend 6.5.1 CSS. Each component's markup is copied from the package's `fixtures.json`. Behaviour is in React, and `initAll()` is not used. | It's the official, tested styling. Running GOV.UK Frontend JS on React-managed DOM causes conflicts [DS-01 to DS-04]. |

---

## 4. Ways of working

- **Branches:** one per task, for example `ra/q1-q3-pages` or `ns/eligibility`. Open a PR to `main`. **The other person reviews every PR before it is merged.**
- **Conflict hotspots:**
  - `App.jsx` is owned by **Ramya**. Nithin sends small, separate PRs for layout mounting (Phase 3).
  - `App.css` is split into **commented sections per owner** (`/* === Layout (Nithin) === */`, `/* === Forms (Ramya) === */`). Only append to your own section.
  - `questions.js` is frozen after Phase 0. Any change after that needs both of you to agree.
- **Claude rules:** `CLAUDE.md` comes first. Use plan mode (Shift+Tab) before each multi-file task. Read every diff before committing. Never let Claude change the expected values in `eligibility.test.js`.
- **Commit rhythm:** commit at every "done when" below. Write commit messages that say what changed for the user.
- **Run the app:** `cd starter && npm run dev`, then open `https://<hostname>:5002`. Don't let Claude edit `vite.config.js`.

---

## 5. Phases and tasks

Every task lists its owner, files, spec IDs, steps and a **Done when** check.

### Phase 0: Set up (Day 1, first 45 minutes, both of you together)

| # | Task | Owner | Files |
|---|---|---|---|
| 0.1 | Add a `.gitignore` (`node_modules/`, `dist/`, `.vite/`) and untrack the dependencies: `git rm -r --cached starter/node_modules`. Commit. | Ramya | `.gitignore` |
| 0.2 | Write `CLAUDE.md`: stack, "GOV.UK service; use govuk-* classes in App.css; no new colours; no govuk-frontend", "one question per page; fieldset/legend; every input labelled", "summary list is `<dl>`", "error summary role=alert + 'There is a problem' + links", "use `<Link>`, never `<a href>` for in-app routes", "eligibility rules only in utils/eligibility.js", "log every AI-assisted task in AI_LOG.md", "do not add features not in spec.md". | Both | `starter/CLAUDE.md` |
| 0.3 | Create `src/data/questions.js` exactly as in spec §4 and §3.3 above. **Both review this line by line against the spec.** | Ramya drives, Nithin reviews | `src/data/questions.js` |
| 0.4 | Check the app runs at `https://<hostname>:5002`. | Both | n/a |

**Done when:** the app runs, `git status` doesn't list `node_modules`, and `CLAUDE.md` and `questions.js` are merged to `main`.

---

### Phase 1: First green path (target **Day 1, 12:30**)

**Ramya: state, shared form components, Start page, Q1–Q3**

| # | Task | Spec IDs | Files |
|---|---|---|---|
| 1.1 | Add `const [answers, setAnswers] = useState(initialAnswers)` to `App`. Pass `answers` and `setAnswers` to each question page, Check your answers and the result page. Add `id="main-content"` to `<main>`. | ST-01, LAY-04 | `App.jsx` |
| 1.2 | `BackLink.jsx`: a `<Link className="govuk-back-link">` that sends you to `/check-answers` in change mode. | NAV-02, NAV-03 | `components/BackLink.jsx` |
| 1.3 | `RadioQuestion.jsx`: takes `question` (from `questions.js`), `value`, `onChange`, `error` and an optional `conditional`. It renders the full spec §3 markup: fieldset, legend with h1, hint, error message, radios with ids (`id`, `id-2`…) and `aria-describedby`. It has **no navigation or state** of its own. | QP-01–04, QP-07–08, VAL-05 | `components/RadioQuestion.jsx` |
| 1.4 | StartPage: content from spec §9, plus a `GovukButton variant="start"` that calls `navigate('/property-type')`. | SP-01–02 | `pages/StartPage.jsx` |
| 1.5 | Q1, Q2 and Q3 pages. Each one has local `selected` (initialised from `answers`), a `<form noValidate onSubmit>`, then `setAnswers` and navigate. **Validation comes later.** For now, Continue is allowed with no selection. | QP-05–06, ST-02–03 | `pages/PropertyTypePage.jsx`, `OwnershipPage.jsx`, `IncomePage.jsx` |

**Nithin: eligibility logic and result**

| # | Task | Spec IDs | Files |
|---|---|---|---|
| 1.6 | Install Vitest: `npm install -D vitest@1`, then add `"test": "vitest run"`. | TST-01 | `package.json` |
| 1.7 | **Test first.** Write T1, T3, T4, T5 and T11 from spec §12.1 in `eligibility.test.js`, using the expected results from the spec. Run them and confirm they fail. | TST-01 | `utils/eligibility.test.js` |
| 1.8 | Write `checkEligibility(answers)` to spec §7: helper groups, not-eligible → partial → eligible, and every matching reason with its code and message. Get the tests passing. | EL-01–06 | `utils/eligibility.js` |
| 1.9 | Temporary `ResultPage`: call `checkEligibility(answers)` and show `status` plus the reason messages as plain text. | RES-01 | `pages/ResultPage.jsx` |
| 1.10 | Temporary Q4 and Q5 pages that use `RadioQuestion` once Ramya's PR is merged. Until then, use hard-coded radios so the path goes all the way through. | QP-01 | `InsulationPage.jsx`, `HeatingPage.jsx` |

**Done when:** you can click Start → Q1 → … → Q5 → result, see a real outcome from `checkEligibility`, and still see your answers when you go Back. `npm test` passes 5 tests.

---

### Phase 2: Day 1 checkpoint (target **Day 1, 14:30**)

| # | Task | Owner | Spec IDs | Files |
|---|---|---|---|---|
| 2.1 | Q4 built on `RadioQuestion`, with inline Yes/No radios. | Nithin | Q-01 | `InsulationPage.jsx`, CSS `govuk-radios--inline` |
| 2.2 | Q5 built on `RadioQuestion`, with the "Other" conditional text input (`heatingOther`, maxlength enforced by validation, not the `maxlength` attribute). If the user switches away from Other, clear `heatingOther`. Trim the text before saving. | Nithin | Q-01–03, ST-04 | `HeatingPage.jsx`, CSS `govuk-radios__conditional` |
| 2.3 | Result page to spec §8: panel (green for eligible and partial, grey for not eligible), the panel title as the h1, "Why you got this result" bullets, "What happens next" per status, and the feedback section. Start again comes in Phase 4. | Nithin | RES-01–05 | `ResultPage.jsx`, CSS `govuk-list--bullet` |
| 2.4 | Check your answers: a `<dl class="govuk-summary-list">` with 5 rows using `labelFor()`. The heating row shows `Other: {heatingOther}`. Change links are `<Link to={route + '?change=true'}>` with visually hidden text. Submit goes to `/result`. Back goes to `/heating`. | Ramya | CYA-01–06 | `CheckAnswersPage.jsx` |
| 2.5 | Change mode in Q1–Q3: Continue goes to `/check-answers` when `?change=true`. | Ramya | NAV-04 | Q1–Q3 pages |

**Done when:** in the demo, Start now → 5 questions → Check your answers → Submit → result works, and Back and Change keep your answers.

**Then (Day 1, end), both of you:**

- Fix the checkpoint feedback.
- Merge to `main` and tag the commit `day1`.
- Add AI_LOG entry 3.
- Write your Day 2 priorities at the bottom of this file.

---

### Phase 3: Validation, guards and layout (target **Day 2, 10:50** mid-morning check)

| # | Task | Owner | Spec IDs | Files |
|---|---|---|---|---|
| 3.1 | `validation.js`: `validateQuestion(id, selected, otherText)` returns `[{ fieldId, message }]`. It uses the messages in `questions.js`, including the two Other rules for heating. It is pure. | Ramya | VAL-01, VAL-08 | `utils/validation.js` |
| 3.2 | `ErrorSummary.jsx`: `role="alert"`, `tabIndex={-1}`, focuses itself when it appears, "There is a problem", a link for each error that focuses its field. | Ramya | VAL-02–04, VAL-09 | `components/ErrorSummary.jsx` |
| 3.3 | `usePageTitle.js`, used on every page, with the `Error: ` prefix. | Ramya | A11Y-08, VAL-06 | `hooks/usePageTitle.js` |
| 3.4 | Connect validation, the summary, the inline error and the title to Q1–Q3. | Ramya | VAL-01–07 | Q1–Q3 pages |
| 3.5 | Connect the same to Q4–Q5, including the `heatingOther` errors and `govuk-input--error`. | Nithin | VAL-01–07 | Q4–Q5 pages |
| 3.6 | `RequireAnswers` guard around `/check-answers` and `/result`. | Ramya | NAV-05, CYA-07, RES-07 | `App.jsx` |
| 3.7 | Add tests T2, T6–T10 and T12–T14. Run them all. | Nithin | TST-02 | `eligibility.test.js` |

**Done when:**

- Submitting an empty page shows the error summary (with focus on it) **and** the inline error.
- The page title starts with "Error:".
- Clicking an error link focuses the field.
- Opening `/result` directly in a fresh tab redirects to `/`.
- `npm test` shows 14 tests passing.

---

### Phase 4: Service Standard signals and polish (Day 2, late morning)

| # | Task | Owner | Spec IDs | Files |
|---|---|---|---|---|
| 4.1 | `SkipLink`, then update `GovukHeader` (add the service name and use `<Link>`). | Nithin | LAY-01–02 | components, CSS `govuk-skip-link` |
| 4.2 | Mount `PhaseBanner` (with a Link to `/feedback`) and `GovukFooter` (6 links). **Send a small PR touching `App.jsx`** and ask Ramya to review it. | Nithin | LAY-03, LAY-05 | components, `App.jsx`, CSS phase banner, footer, `govuk-tag` |
| 4.3 | `CookieBanner`: Accept/Reject, then a confirmation message (with focus moved to it), then Hide. The state lives in `App`. Make sure the banner **doesn't cover focused elements**. | Nithin | LAY-06, A11Y-04 | `components/CookieBanner.jsx`, CSS `govuk-cookie-banner*`, `govuk-button--secondary` |
| 4.4 | `ContentPage` for Cookies, Privacy, Terms, Help, Contact and Feedback, plus routes. | Nithin | LAY-08 | `pages/ContentPage.jsx`, `App.jsx` |
| 4.5 | Accessibility statement: remove the nested `<main>` and fill in the sections. Finish the content after Phase 5 testing. | Nithin | LAY-04, LAY-07 | `AccessibilityStatementPage.jsx` |
| 4.6 | `ScrollToTop` on route change. | Ramya | NAV-06 | `components/ScrollToTop.jsx`, `App.jsx` |
| 4.7 | "Start again" on the result page: `setAnswers(initialAnswers)`, then navigate to `/`. | Ramya | ST-05, RES-06 | `ResultPage.jsx` (agree this with Nithin) |
| 4.8 | Check GOV.UK Frontend's focus styles, then add only the `app-*` CSS we need (the not-eligible panel). Confirm the radios are at least 24px [A11Y-07]. GOV.UK radios are 40px. | Ramya | A11Y-03, DS-04 | `App.css` |
| 4.9 | `NotFoundPage` and the `*` route. | Nithin | NAV-07 (COULD) | `pages/NotFoundPage.jsx` |

**Done when:** the cookie banner, skip link, header, phase banner and footer appear on every page, and every footer link opens its page using the keyboard alone.

---

### Phase 5: Accessibility check and fixes (Day 2, before lunch)

Do this together. One person uses the keyboard; the other records results.

1. **Keyboard only:** complete an eligible journey, a not-eligible journey, an error, a Change, and the cookie banner [A11Y-02, A11Y-03].
2. **Labels:** click every label [A11Y-01].
3. **Contrast:** in DevTools, check body text, hint text, back link, the grey panel and the error red [A11Y-05].
4. **320px and 400% zoom:** go through every page [A11Y-06]. Watch out for the summary list (the 640px breakpoint already stacks it), the panel's 32px title, and the long income labels.
5. **Screen reader:** with Orca or the DevTools Accessibility pane, check the fieldset legend, the hint and the error are announced. Also check the Change links read "Change property type" and similar.
6. **pa11y** on each route, from the lab terminal: `npx pa11y http://localhost:5002/<route> --standard WCAG2AA` [A11Y-12].
7. Fix what fails, then write the results into the accessibility statement [LAY-07].

**Done when:** every accessibility item in the spec §15 checklist is ticked.

---

### Phase 6: Present and submit (Day 2, 13:30 and 16:00)

| Time | Task | Owner |
|---|---|---|
| Before 13:30 | Rehearse the 5-minute demo: (1) eligible journey T1, (2) not eligible T7 (flat), (3) empty Q3 → error summary + inline error, (4) one AI_LOG entry, (5) `npm test`. Decide who drives and who talks. | Both |
| After the demo | Peer feedback on two other teams. | Both |
| By 16:00 | Final AI_LOG entry, retro takeaways, `npm run build` to make sure the build works, merge everything to `main`, submit the repo link. | Both |

---

## 6. Testing summary

| Level | What | How | When |
|---|---|---|---|
| Unit | `checkEligibility`: T1–T14 | `npm test` (Vitest 1) | Phases 1 and 3, then on every PR |
| Unit (COULD) | `validateQuestion`: empty, Other empty, Other over 100 characters, valid | `npm test` | Phase 3 |
| Manual journey | Start → result with Back, Change, refresh guard | Browser | End of each phase |
| Accessibility | Keyboard, labels, contrast, 320px, screen reader, pa11y | Phase 5 checklist | Phase 5, and spot checks per PR |
| Build | `npm run build` succeeds | Terminal | Before submitting |
| E2E (COULD) | Playwright keyboard journey + 320px | `npx playwright test` | Only if everything else is done |

---

## 7. AI_LOG plan (target: 6 or more entries, 5 different patterns)

| Phase | Planned entry | Pattern |
|---|---|---|
| Done | 1. `intent.md`, 2. `spec.md` | Planning |
| 0–1 | `plan.md`, and Claude's plan-mode proposal for `RadioQuestion` and the `questions.js` shape | Plan-mode scaffolding |
| 1 | Test-first eligibility: we wrote the expected results, Claude wrote the code | Test generation |
| 3 | `ErrorSummary` and validation. Record what Claude got wrong (for example `alertdialog`, generic messages, missing focus). | Refactor or scaffolding |
| 5 | Ask a second Claude session to review a page against WCAG 2.2 AA and the spec, then record what we accepted or rejected | Multi-agent critique |

---

## 8. Risks

| Risk | Likelihood | What we'll do |
|---|---|---|
| Answers lost because of `<a href>` or page-level state | High (the starter has it) | Use `<Link>` everywhere. The state is only in `App`. Check with Back after every page. |
| Merge conflicts in `App.jsx` and `App.css` | Medium | `App.jsx` has one owner. `App.css` is split into sections. PRs stay small. |
| Claude builds the summary as a `<table>`, makes the error box just a styled div, or leaves out ARIA | High | `CLAUDE.md` rules, PR review against spec IDs, and the Phase 5 checks. |
| Claude "fixes" tests by changing the expected values | Medium | The rule is in `CLAUDE.md`, and the reviewer checks the `eligibility.test.js` diff. |
| Cookie banner or focus styles fail contrast or hide focus | Medium | Use only colour variables. Do the keyboard pass in Phase 5. |
| Running out of time on Day 2 | Medium | MUSTs first. Phase 4.9, NAV-07, VAL-08 and Playwright are the first things to drop. |
| `node_modules` makes PRs and merges huge | Certain until fixed | Phase 0.1 fixes it before any other commit. The committed copy also lost its executable permissions, which broke `npm install`. Fix it with `rm -rf node_modules && npm ci`. |
| GOV.UK Frontend CSS clashes with the starter CSS (Learner Handbook ch. 3) | High if both are loaded | Remove the teaching CSS entirely. `App.css` holds only `app-*` classes. |
| GDS Transport font is licensed only for services on gov.uk domains | n/a (prototype) | Acceptable for a hackathon prototype. Note it in the README. A real service outside gov.uk would switch to the fallback font stack. |

---

## 9. Day 2 priorities

*(Fill this in at the end of Day 1.)*

-

---

## 10. Build record (2026-10-12)

At your request, Claude Code built both people's parts end to end, on one branch (`ra/eligibility-checker`). These are the differences from the plan above.

**Files as built (beyond Section 2)**

| File | Why |
|---|---|
| `components/QuestionPage.jsx` and `hooks/useQuestionForm.js` | The five question pages are each one line that renders `QuestionPage` with their question id. All validation, saving and navigation lives in one hook. |
| `components/ErrorMessage.jsx` | Shared inline error markup, used by the radios and the "Other" text box. |
| `components/GovukLogos.jsx` | GOV.UK logotype, crown and OGL SVGs, generated from the GOV.UK Frontend fixtures (not copied by hand). |
| `src/App.test.jsx` | Journey tests in jsdom with Testing Library and axe-core: eligible, partial and not-eligible journeys, validation, Back, Change, the "Other" text, the guard, Start again, the cookie banner, and every content page. |
| `src/utils/validation.test.js` | Unit tests for `validateQuestion` (VAL-08). |

**Checks run**

- `npm test`: **42 tests pass**. That's 16 eligibility tests (T1–T14, a messages check and a missing-answer check), 6 validation tests and 20 journey and axe tests.
- `npm run build` succeeds.
- **Real-browser check** (Chromium via Playwright, run from the scratchpad and not added to the project):
  - keyboard-only journeys at 1280px and 320px, for eligible, partial and not-eligible outcomes
  - axe including colour contrast
  - no horizontal scroll at 320px
  - visible focus on Start now, every radio group and the error summary
  - error summary focus and error-link focus
- **Not yet done (team):** screen reader spot check (spec §12.2 step 5), and your own keyboard walkthrough for the demo.

**Known, accepted axe findings** (recorded in the accessibility statement)

1. `aria-allowed-attr` on the heating "Other" radio. GOV.UK Frontend's own radios script adds `aria-expanded` to conditional radios, and we follow GOV.UK [Q-02].
2. `region` on the skip link. GOV.UK cookie banner guidance places the banner before the skip link.

**Set-up fixes made in Phase 0**

- `.gitignore` added.
- `node_modules` untracked with `git rm --cached`.
- The committed `node_modules` had lost its executable permissions, so it was reinstalled with `npm ci`.
