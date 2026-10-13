# Spec: Check if you can get a Green Home Grant

| | |
|---|---|
| **Status** | Draft for build, 2026-10-12 |
| **Team** | Ramya, Nithin |
| **Sources** | `intent.md`, `starter/Eligibility-checker-brief.md`, W3 Hackathon 1 Pack, M1 W3 Learner Handbook |
| **Stack** | React 18, React Router 6, Vite 5, **GOV.UK Frontend 6.5.1** (`govuk-frontend`: official CSS and component markup, with behaviour in React), Vitest 1 |

`intent.md` says **why** we are building this and **what** is in scope. This spec says **exactly what to build**, so each requirement can be planned, built and checked on its own.

**Priority key**

- **MUST**: part of the Minimum Viable Submission (MVS) or the "Before you finish" checklist. Ship these first.
- **SHOULD**: assessed by the rubric. Build these after the MUSTs.
- **COULD**: stretch goals, only if everything else is done.

---

## 1. User journey and routes

```
/  →  /property-type  →  /ownership  →  /income  →  /insulation  →  /heating  →  /check-answers  →  /result
Start   Q1                 Q2              Q3           Q4               Q5            Check answers     Result
```

| Route | Page component | Back link goes to | Continue / button goes to |
|---|---|---|---|
| `/` | `StartPage` | (none) | `/property-type` ("Start now") |
| `/property-type` | `PropertyTypePage` | `/` | `/ownership` |
| `/ownership` | `OwnershipPage` | `/property-type` | `/income` |
| `/income` | `IncomePage` | `/ownership` | `/insulation` |
| `/insulation` | `InsulationPage` | `/income` | `/heating` |
| `/heating` | `HeatingPage` | `/insulation` | `/check-answers` |
| `/check-answers` | `CheckAnswersPage` | `/heating` | `/result` ("Submit") |
| `/result` | `ResultPage` | (none) | (none) |
| `/accessibility-statement` | `AccessibilityStatementPage` | (none) | (none) |
| `/cookies`, `/privacy`, `/terms-and-conditions`, `/help`, `/contact`, `/feedback` | `ContentPage` (or one component per page) | (none) | (none) |
| `*` | `NotFoundPage` | (none) | (none) |

**Change mode:** a Change link on Check your answers opens a question with `?change=true`. In change mode:

- the Back link goes to `/check-answers`
- Continue saves the answer and goes to `/check-answers`, not the next question

| ID | Requirement | Priority |
|---|---|---|
| NAV-01 | Routes and page order are exactly as in the table above. | MUST |
| NAV-02 | All in-app links (Back, Change, footer, header, Start again) use React Router `<Link>` or `navigate()`, **not** `<a href>`. A plain `href` reloads the page and wipes the answers. *(The starter's Back links and footer use `href` and must be fixed.)* | MUST |
| NAV-03 | Back links point to the **explicit** previous route in the table, not `navigate(-1)`, so they also work for users who land on a page directly. | MUST |
| NAV-04 | Change mode works as described above for all 5 questions. | SHOULD |
| NAV-05 | **Guard:** if any of the 5 answers is missing when `/check-answers` or `/result` loads (for example after a refresh, a bookmark or a typed URL), redirect to `/` with `<Navigate to="/" replace />`. | MUST |
| NAV-06 | On every route change, the window scrolls to the top. | SHOULD |
| NAV-07 | Any unknown URL shows a "Page not found" page with a link to the start page. | COULD |

---

## 2. State

All answers live in **one state object in `App`**. Each page receives the value and a setter through props. Pages must not keep their own copy of the answer between visits.

```js
const initialAnswers = {
  propertyType: '',   // Q1
  ownership: '',      // Q2
  incomeBand: '',     // Q3
  insulation: '',     // Q4
  heating: '',        // Q5
  heatingOther: '',   // Q5 free text, only used when heating === 'other'
};
```

| ID | Requirement | Priority |
|---|---|---|
| ST-01 | `App` holds `answers` and `setAnswers` with `useState(initialAnswers)`. | MUST |
| ST-02 | A page's selection is held locally only until Continue. On Continue (and only if it passes validation), the page writes the answer to `App` state. When a page opens, its radios are pre-selected from `App` state. | MUST |
| ST-03 | Going Back, Continue or Change never loses an answer. | MUST |
| ST-04 | If `heating` changes from `other` to anything else, `heatingOther` is reset to `''`. | MUST |
| ST-05 | "Start again" resets `answers` to `initialAnswers`. | MUST |
| ST-06 | Answers are **not** stored in `localStorage`, `sessionStorage`, cookies or on a server. A refresh loses them, and that is accepted (see NAV-05). | MUST |

---

## 3. Question pages (shared requirements)

Every question page uses the same GOV.UK question-page pattern.

```
[Back]

<form novalidate>
  [Error summary, if errors]
  <fieldset aria-describedby="{id}-hint [{id}-error]">
    <legend class="govuk-fieldset__legend--l"><h1 class="govuk-fieldset__heading">Question</h1></legend>
    <div id="{id}-hint" class="govuk-hint">Help text</div>
    [<p id="{id}-error" class="govuk-error-message"><span class="govuk-visually-hidden">Error:</span> Message</p>]
    <div class="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="{id}" name="{id}" type="radio" value="...">
        <label class="govuk-label govuk-radios__label" for="{id}">Option</label>
      </div>
      ...
    </div>
  </fieldset>
  <button type="submit" class="govuk-button">Continue</button>
</form>
```

| ID | Requirement | Priority |
|---|---|---|
| QP-01 | One question per page. | MUST |
| QP-02 | The question is the page's only `<h1>` and sits inside the `<legend>` of a `<fieldset>`, so screen readers announce it once, as the group label. | MUST |
| QP-03 | Every radio has a unique `id` and a `<label for>`. Clicking the label selects the radio. All radios in a group share one `name`. | MUST |
| QP-04 | Help text sits under the question in a `govuk-hint` element and is linked to the fieldset with `aria-describedby`. | MUST |
| QP-05 | The button is a `type="submit"` button with the text **Continue**, inside a `<form>` with `noValidate`, so pressing Enter submits the form. | MUST |
| QP-06 | A Back link (`govuk-back-link`) sits above the form (see NAV-01 and NAV-03). | MUST |
| QP-07 | The first radio has `id` equal to the field id (for example `propertyType`), so error summary links (`#propertyType`) move focus to it. Other radios use `propertyType-2`, `propertyType-3` and so on. | MUST |
| QP-08 | Required fields are not marked with asterisks. | MUST |

---

## 4. The five questions

The **values** are the strings stored in state and passed to the eligibility function. The **labels** are what users see.

### Q1: Property type (`/property-type`)

- **Heading:** What type of property do you live in?
- **Help text:** Choose the option that best describes the building you live in.
- **Field id / state key:** `propertyType`

| Label | Value |
|---|---|
| Detached house | `detached` |
| Semi-detached house | `semi-detached` |
| Terraced house (including mid-terraced) | `terraced` |
| Bungalow | `bungalow` |
| Flat or apartment | `flat` |
| Studio flat | `studio` |

- **Error if nothing is selected:** Select the type of property you live in

### Q2: Housing situation (`/ownership`)

- **Heading:** What best describes your housing situation?
- **Help text:** This helps us check whether you can make changes to your home. "Social housing" means you rent from a council or housing association.
- **Field id / state key:** `ownership`

| Label | Value |
|---|---|
| I own my home | `own` |
| I own my home with someone else | `own-jointly` |
| I rent my home | `rent` |
| I live in social housing | `social-housing` |

- **Error if nothing is selected:** Select what best describes your housing situation

### Q3: Household income (`/income`)

- **Heading:** What is your annual household income?
- **Help text:** This is the total yearly income of everyone who lives in your home, before tax. Include wages, benefits and pensions.
- **Field id / state key:** `incomeBand`

| Label | Value |
|---|---|
| Less than £20,000 | `under-20k` |
| £20,000 to £39,999 | `20k-to-39k` |
| £40,000 to £59,999 | `40k-to-59k` |
| £60,000 or more | `60k-or-more` |

- **Error if nothing is selected:** Select your annual household income

### Q4: Insulation (`/insulation`)

- **Heading:** Does your home currently have insulation?
- **Help text:** This includes loft, wall or floor insulation. If you are not sure, choose No.
- **Field id / state key:** `insulation`
- **Layout:** inline radios are allowed for Yes/No.

| Label | Value |
|---|---|
| Yes | `yes` |
| No | `no` |

- **Error if nothing is selected:** Select yes if your home currently has insulation

### Q5: Heating (`/heating`)

- **Heading:** What is the main way your home is heated?
- **Help text:** Choose the system that heats most of your home.
- **Field id / state key:** `heating`, plus `heatingOther`

| Label | Value |
|---|---|
| Gas boiler | `gas` |
| Electric heating | `electric` |
| Oil heating | `oil` |
| Biofuel | `biofuel` |
| Heat pump | `heat-pump` |
| Solar energy | `solar` |
| Other | `other` |

**Conditional reveal (choosing Other):**

- A text input with id `heatingOther` and the label "Tell us how your home is heated" appears directly under the Other radio, in a `govuk-radios__conditional` container.
- The Other radio has `aria-controls="conditional-heatingOther"` and `aria-expanded` set to `true` or `false`.
- The input is hidden, not just visually hidden, when Other is not selected.
- The input allows up to 100 characters.

**Errors:**

| When | Message | Linked to |
|---|---|---|
| Nothing selected | Select the main way your home is heated | `#heating` |
| Other selected, text empty or only spaces | Enter how your home is heated | `#heatingOther` |
| Other text is longer than 100 characters | How your home is heated must be 100 characters or less | `#heatingOther` |

| ID | Requirement | Priority |
|---|---|---|
| Q-01 | Questions, help text, options, values and error messages are exactly as written in this section. | MUST |
| Q-02 | The conditional reveal on Q5 works with mouse and keyboard, and is announced to screen readers through `aria-expanded`. | MUST |
| Q-03 | `heatingOther` is trimmed before it is saved. | SHOULD |

---

## 5. Validation and errors (GOV.UK error pattern)

| ID | Requirement | Priority |
|---|---|---|
| VAL-01 | Every question is required. Validation runs when Continue is pressed, not while the user is choosing. | MUST |
| VAL-02 | **Error summary** at the top of `<main>`, above the form. Use GOV.UK Frontend 6 markup: `<div class="govuk-error-summary" tabindex="-1"><div role="alert"><h2 class="govuk-error-summary__title">There is a problem</h2><div class="govuk-error-summary__body"><ul class="govuk-list govuk-error-summary__list">…`. Each link's `href` is `#{fieldId}` and its text is the error message. | MUST |
| VAL-03 | When errors appear, keyboard focus moves to the error summary. | MUST |
| VAL-04 | Clicking an error summary link moves focus to the field in error (the first radio, or the `heatingOther` input). | MUST |
| VAL-05 | **Inline error:** the form group gets `govuk-form-group--error`. A `govuk-error-message` shows the **same wording** as the summary, starting with a visually hidden "Error:". Its id is added to the fieldset's `aria-describedby`. The text input gets `govuk-input--error`. | MUST |
| VAL-06 | When there is an error, the page title starts with `Error: ` (see A11Y-08). | MUST |
| VAL-07 | Errors are shown in text, not just colour. The red border is extra, never the only signal. | MUST |
| VAL-08 | Validation logic is a small pure function per page or one shared helper, for example `validate(fieldId, answers) → errors[]`, so it can be unit tested. | COULD |
| VAL-09 | Never use `role="alertdialog"`, generic messages like "This field is required", or browser-native `required` popups. | MUST |

---

## 6. Check your answers (`/check-answers`)

- **Heading (h1):** Check your answers
- **Intro text:** Check your answers before you submit them. You can change any answer.
- **Rows, in journey order**, as a GOV.UK summary list:

| Key (`<dt>`) | Value (`<dd>`) | Change link text (visible + visually hidden) |
|---|---|---|
| Property type | the label of the chosen option | Change `<span class="govuk-visually-hidden">property type</span>` |
| Housing situation | the label | Change `<span class="govuk-visually-hidden">housing situation</span>` |
| Annual household income | the label | Change `<span class="govuk-visually-hidden">annual household income</span>` |
| Insulation | Yes / No | Change `<span class="govuk-visually-hidden">insulation</span>` |
| Main heating | the label, or `Other: {heatingOther}` | Change `<span class="govuk-visually-hidden">main heating</span>` |

| ID | Requirement | Priority |
|---|---|---|
| CYA-01 | The summary is a `<dl class="govuk-summary-list">`, with each row a `govuk-summary-list__row` containing `<dt>` key, `<dd>` value and `<dd>` actions. **Not** a `<table>`. | MUST |
| CYA-02 | Values show the user-facing **labels**, never the stored values (show "Semi-detached house", not `semi-detached`). Keep one shared label lookup, for example `src/data/questions.js`. | MUST |
| CYA-03 | Each Change link goes to its question with `?change=true` (see NAV-04). The current answer is pre-selected. | MUST |
| CYA-04 | Change links include visually hidden text, so screen readers hear "Change property type" and not five identical "Change" links. | MUST |
| CYA-05 | A **Submit** button (`govuk-button`) goes to `/result`. | MUST |
| CYA-06 | Back link goes to `/heating`. | MUST |
| CYA-07 | Guarded by NAV-05. | MUST |

---

## 7. Eligibility rules (`src/utils/eligibility.js`)

### 7.1 Function contract

```js
/**
 * @param {typeof initialAnswers} answers
 * @returns {{ status: 'eligible' | 'partial' | 'not-eligible',
 *             reasons: { code: string, message: string }[] }}
 */
export function checkEligibility(answers) { ... }
```

| ID | Requirement | Priority |
|---|---|---|
| EL-01 | `checkEligibility` is a **pure function**: it uses only its argument, does not read or change React state, the DOM or storage, and gives the same output for the same input. | MUST |
| EL-02 | All eligibility logic lives in this file. Pages must not contain any rules. | MUST |
| EL-03 | Rules are checked in the order below: **not eligible → partial → eligible**. | MUST |
| EL-04 | If any not-eligible rule matches, `status` is `'not-eligible'` and `reasons` lists **every** not-eligible rule that matched. Partial reasons are not included. | MUST |
| EL-05 | Otherwise, if any partial rule matches, `status` is `'partial'` and `reasons` lists **every** partial rule that matched, in table order. | MUST |
| EL-06 | Otherwise `status` is `'eligible'`, and `reasons` has one entry: `ELIGIBLE`. | MUST |
| EL-07 | If any of the five answers is missing or not a known value, `checkEligibility` throws an error instead of returning a result. This stops a blank answer from falling through to "eligible". (Added during the build.) | MUST |

**Helper groups**

- `OWNER` = `own`, `own-jointly`
- `ELIGIBLE_PROPERTY` = `detached`, `semi-detached`, `terraced`, `bungalow`
- `GAS_OR_ELECTRIC` = `gas`, `electric`. **Everything else counts as not gas or electric, including `other`.** The `heatingOther` text never affects the outcome.

### 7.2 Not eligible rules

| Code | Condition | Message |
|---|---|---|
| `INCOME_TOO_HIGH` | `incomeBand === '60k-or-more'` | Your household income is £60,000 or more, which is above the limit for this grant. |
| `PROPERTY_NOT_ELIGIBLE` | `propertyType` is `flat` or `studio` | The grant is only available for houses and bungalows, not flats or studio flats. |
| `NOTHING_TO_FUND` | `insulation === 'yes'` **and** heating is not gas or electric | Your home already has insulation and is not heated by gas or electricity, so there is nothing the grant can pay for. |

### 7.3 Partial rules

| Code | Condition | Message |
|---|---|---|
| `NEEDS_LANDLORD_PERMISSION` | `ownership` is `rent` or `social-housing` | You can apply only with written permission from your landlord or housing association. |
| `REDUCED_GRANT_INCOME` | `incomeBand === '40k-to-59k'` | Because your household income is between £40,000 and £59,999, you can apply for a reduced grant. |
| `HEAT_PUMP_ONLY` | `insulation === 'yes'` **and** heating is gas or electric | Your home is already insulated, so you can apply for a heat pump only. |
| `INSULATION_ONLY` | `insulation === 'no'` **and** heating is not gas or electric | Your home is not heated by gas or electricity, so you can apply for insulation only. |

### 7.4 Eligible

All of these are true: the user is an owner (`OWNER`), `incomeBand` is `under-20k` or `20k-to-39k`, the property is in `ELIGIBLE_PROPERTY`, `insulation === 'no'`, and heating is gas or electric.

| Code | Message |
|---|---|
| `ELIGIBLE` | You can apply for help with the cost of both insulation and a heat pump. |

---

## 8. Result page (`/result`)

| Status | Panel | Panel title (h1) | Panel body |
|---|---|---|---|
| `eligible` | green `govuk-panel govuk-panel--confirmation` | You can apply for a Green Home Grant | Insulation and heat pump |
| `partial` | green `govuk-panel govuk-panel--confirmation` (same as eligible) | You can apply for part of the Green Home Grant | Check the conditions below |
| `not-eligible` | grey `govuk-panel app-panel--not-eligible` (white text on `--govuk-secondary-text-colour`) | You cannot apply for a Green Home Grant | Based on your answers |

Under the panel:

1. **`<h2>` Why you got this result** followed by a `govuk-list govuk-list--bullet` of every `reasons[].message`.
2. **`<h2>` What happens next**, with content that depends on the status:
   - **Eligible:** Apply for the Green Home Grant (applications are not part of this service). You will need proof that you own your home and proof of your household income.
   - **Partial:** Read the conditions above before you apply. If you rent, speak to your landlord or housing association first. You will need proof of your household income.
   - **Not eligible:** You may be able to get other help to make your home more energy efficient. Contact your local council or visit the Help page.
3. A **Start again** link that clears all answers (ST-05) and goes to `/`.
4. A **feedback** line: `<h2 class="govuk-heading-m">Help us improve this service</h2>` followed by a link, "What did you think of this service?", to `/feedback`.

| ID | Requirement | Priority |
|---|---|---|
| RES-01 | `ResultPage` calls `checkEligibility(answers)` and renders the status, panel and reasons above. It contains no rules of its own. | MUST |
| RES-02 | The panel title is the page's only `<h1>`. | MUST |
| RES-03 | The outcome is clear from the **heading text alone**, not just the panel colour. | MUST |
| RES-04 | The grey panel's text contrast is checked at 4.5:1 or above (white on `--govuk-secondary-text-colour` `#484949` is about 9:1). | MUST |
| RES-05 | No Back link on the result page. | SHOULD |
| RES-06 | Start again and feedback links work (see 8.3 and 8.4). | SHOULD |
| RES-07 | Guarded by NAV-05. | MUST |

---

## 9. Start page (`/`)

- **h1:** Check if you can get a Green Home Grant
- **Lead paragraph** (`govuk-body-l`): Use this service to check if you can apply for a Green Home Grant to help pay for home insulation or a heat pump.
- **h2 "Who can use this service"** (`govuk-heading-m`), followed by a bullet list:
  - people who live in the UK
  - homeowners, joint owners, private renters and social housing tenants
- **h2 "Before you start"**, followed by: You will be asked 5 questions about your home and your household income. It takes about 5 minutes. We do not store your answers.
- **Start now** button: `GovukButton variant="start"`, which navigates to `/property-type`.

| ID | Requirement | Priority |
|---|---|---|
| SP-01 | The content is as written above, with a green "Start now" start button. | MUST |
| SP-02 | Start now works with Enter and Space. | MUST |

---

## 10. Layout and Service Standard signals

Order on every page, from top to bottom:

```
Cookie banner (until dismissed) → Skip link → Header → Phase banner → <main id="main-content"> → Footer
```

| ID | Requirement | Priority |
|---|---|---|
| LAY-01 | **Header** (`GovukHeader`): the GOV.UK Frontend 6 header (GOV.UK logotype) followed by **service navigation** showing the service name "Check if you can get a Green Home Grant", which links to `/` with `<Link>`. Both sit inside `<header class="govuk-template__header">`. | MUST |
| LAY-02 | **Skip link** "Skip to main content" (`govuk-skip-link`) is the first focusable element and targets `#main-content`. It is visible when focused. | MUST |
| LAY-03 | **Phase banner** (`PhaseBanner`) under the header, with the tag "Alpha" and the text "This is a new service – your feedback will help us improve it." The feedback link goes to `/feedback`. | MUST |
| LAY-04 | **Single `<main>`:** `App` renders one `<main className="govuk-main-wrapper" id="main-content">`. Pages must not render their own `<main>`. *(The starter's `AccessibilityStatementPage` has a nested `<main>` and must be fixed.)* | MUST |
| LAY-05 | **Footer** (`GovukFooter`, GOV.UK Frontend 6 markup with crown, Open Government Licence and © Crown copyright) with meta links, in this order: Accessibility statement, Cookies, Privacy, Terms and conditions, Help, Contact. All in-app links use `<Link>`. | MUST |
| LAY-06 | **Cookie banner** (`CookieBanner`), above the skip link (see 10.1). | MUST |
| LAY-07 | **Accessibility statement** is fully written (see 10.2). | MUST |
| LAY-08 | **Placeholder pages** for Cookies, Privacy, Terms and conditions, Help, Contact and Feedback. Each has an h1, 1–3 short paragraphs of honest placeholder content (for example "This is a prototype. No personal data is collected."), and is reachable by keyboard. | SHOULD |

### 10.1 Cookie banner

- **Region:** `<div class="govuk-cookie-banner" role="region" aria-label="Cookies on Check if you can get a Green Home Grant">`
- **Heading (h2):** Cookies on Check if you can get a Green Home Grant
- **Text:** We use some essential cookies to make this service work. We'd also like to use analytics cookies so we can understand how you use the service and make improvements.
- **Buttons:** "Accept analytics cookies" and "Reject analytics cookies". **Link:** "View cookies", which goes to `/cookies`.
- **After a choice:** the banner text is replaced with "You've accepted analytics cookies." or "You've rejected analytics cookies.", followed by "You can change your cookie settings at any time." and a **Hide cookie message** button. Focus moves to the confirmation message.
- **After hiding:** the banner is removed for the rest of the session. The choice is held in React state only. **No real cookies are set** and no analytics run. The banner shows again after a refresh, which is accepted.

### 10.2 Accessibility statement content

Fill in the starter's sections:

- **Scope:** the service name, and that it is a prototype.
- **How accessible this service is:** the result of our own testing.
- **Known issues:** anything still failing at submission time.
- **Feedback and contact information:** a placeholder email address.
- **Enforcement procedure:** the EHRC and the Equality Advisory and Support Service.
- **Technical information:** compliance status against WCAG 2.2 AA.
- **How we tested:** the manual walkthrough in Section 12.2, pa11y, the browsers used and the date.
- **What we are doing to improve.**

Base the content on GOV.UK's sample accessibility statement.

---

## 11. Accessibility and design (WCAG 2.2 AA)

| ID | Requirement | WCAG | Priority |
|---|---|---|---|
| A11Y-01 | Every input has a `<label>`, and radio groups use `<fieldset>` and `<legend>`. | 1.3.1, 3.3.2 | MUST |
| A11Y-02 | The whole journey, including the cookie banner, conditional reveal, error links and Change links, can be completed with the keyboard alone (Tab, Shift+Tab, Space, Enter, arrow keys inside radio groups). Focus never gets stuck. | 2.1.1 | MUST |
| A11Y-03 | Focus is always visible, using the GOV.UK yellow focus style (`--govuk-focus-colour`) on links, buttons, radios and inputs. | 2.4.7 | MUST |
| A11Y-04 | The focused element is never hidden behind other content, such as the cookie banner. | 2.4.11 | MUST |
| A11Y-05 | All text has at least 4.5:1 contrast. Use only GOV.UK Frontend's colour custom properties (for example `--govuk-secondary-text-colour`), and don't add new hex colours. | 1.4.3 | MUST |
| A11Y-06 | Pages reflow at 320 CSS px wide and at 400% zoom with no horizontal scrolling, overlap or cut-off text. | 1.4.10 | MUST |
| A11Y-07 | Clickable targets are at least 24×24 CSS px. | 2.5.8 | MUST |
| A11Y-08 | Each page sets a unique `document.title` in the format `{Page h1} – Check if you can get a Green Home Grant – GOV.UK`. On error, it is prefixed with `Error: `. | 2.4.2 | MUST |
| A11Y-09 | The heading order makes sense: one h1 per page, and no skipped levels. | 1.3.1 | MUST |
| A11Y-10 | `<html lang="en">` is set in `index.html`. | 3.1.1 | MUST |
| A11Y-11 | Users are never asked for the same information twice. | 3.3.7 | MUST |
| A11Y-12 | `npx pa11y https://<hostname>:5002/<route> --standard WCAG2AA` reports no errors on each route. | n/a | SHOULD |
| DS-01 | Install `govuk-frontend@6.5.1`. Import `govuk-frontend/dist/govuk/govuk-frontend.min.css` once, in `main.jsx`. Copy its `assets/` (fonts and images) to `public/assets` with `npm run copy-assets`, which runs automatically before `dev` and `build`. The page template classes are `govuk-template` on `<html>` and `govuk-template__body` on `<body>`. | n/a | MUST |
| DS-02 | Each GOV.UK component is a React component whose markup matches the **official GOV.UK Frontend 6.5.1 HTML** (the package's `components/*/fixtures.json`): header, service navigation, skip link, phase banner, cookie banner, back link, button, radios (including conditional reveal), input, error summary, error message, hint, fieldset, summary list, panel, tag and footer. | n/a | MUST |
| DS-03 | Do **not** call GOV.UK Frontend's JavaScript (`initAll`) or use `govuk-react`. React handles behaviour that the JS would normally add: conditional reveal, error summary focus, skip link focus and the cookie banner. `initAll` would change DOM that React controls. | n/a | MUST |
| DS-04 | Remove the starter's teaching CSS from `App.css`. It conflicts with GOV.UK Frontend. `App.css` holds only `app-*` classes for things GOV.UK Frontend doesn't provide (for example `app-panel--not-eligible`), built from GOV.UK custom properties. | n/a | MUST |

---

## 12. Testing

### 12.1 Unit tests (`src/utils/eligibility.test.js`, Vitest 1)

Setup: run `npm install -D vitest@1` and add `"test": "vitest run"` to `package.json`.

The **expected results below were decided by the team**. Claude can write the test code, but must not change what counts as correct.

| # | Case | Answers (property / ownership / income / insulation / heating) | Expected status | Expected codes |
|---|---|---|---|---|
| T1 | Fully eligible | detached / own / under-20k / no / gas | `eligible` | `ELIGIBLE` |
| T2 | Joint owner, top of the eligible income band | bungalow / own-jointly / 20k-to-39k / no / electric | `eligible` | `ELIGIBLE` |
| T3 | Income boundary, £40k | terraced / own / 40k-to-59k / no / gas | `partial` | `REDUCED_GRANT_INCOME` |
| T4 | Income boundary, £60k | detached / own / 60k-or-more / no / gas | `not-eligible` | `INCOME_TOO_HIGH` |
| T5 | Renter | semi-detached / rent / under-20k / no / gas | `partial` | `NEEDS_LANDLORD_PERMISSION` |
| T6 | Social housing tenant | terraced / social-housing / 20k-to-39k / no / electric | `partial` | `NEEDS_LANDLORD_PERMISSION` |
| T7 | Flat | flat / own / under-20k / no / gas | `not-eligible` | `PROPERTY_NOT_ELIGIBLE` |
| T8 | Studio flat | studio / own / under-20k / no / gas | `not-eligible` | `PROPERTY_NOT_ELIGIBLE` |
| T9 | Heat pump only | detached / own / under-20k / **yes** / gas | `partial` | `HEAT_PUMP_ONLY` |
| T10 | Insulation only, "Other" heating | detached / own / under-20k / no / other (text: "wood stove") | `partial` | `INSULATION_ONLY` |
| T11 | Nothing to fund *(trickiest rule)* | detached / own / under-20k / yes / heat-pump | `not-eligible` | `NOTHING_TO_FUND` |
| T12 | Several partial reasons | terraced / rent / 40k-to-59k / yes / electric | `partial` | `NEEDS_LANDLORD_PERMISSION`, `REDUCED_GRANT_INCOME`, `HEAT_PUMP_ONLY` (in this order) |
| T13 | Not eligible beats partial | flat / rent / 60k-or-more / no / oil | `not-eligible` | `INCOME_TOO_HIGH`, `PROPERTY_NOT_ELIGIBLE` only, with no partial codes |
| T14 | Pure function | the same answers twice | identical results | n/a |

| ID | Requirement | Priority |
|---|---|---|
| TST-01 | `npm test` runs and **at least 5** tests pass, covering eligible, partial, not eligible, a boundary and the trickiest rule (T1, T3, T4, T5, T11 at minimum). | MUST |
| TST-02 | All of T1–T14 pass. | SHOULD |
| TST-03 | Playwright end-to-end tests for the keyboard journey and 320px reflow. | COULD |
| TST-04 | Journey tests (`src/App.test.jsx`, jsdom + Testing Library + axe-core) cover every outcome, validation, Back, Change, the guard and the layout, and run with `npm test`. | SHOULD |

### 12.2 Manual accessibility walkthrough (before the presentation)

Check each step on **every** page, and record the results in the accessibility statement:

1. **Keyboard only:** complete an eligible journey, a not-eligible journey, one validation error and one Change, using only the keyboard.
2. **Labels:** clicking every label selects its radio.
3. **Contrast:** check body text, hint text, the grey panel and links in DevTools. Each must be at least 4.5:1.
4. **320px:** use the device toolbar at 320px width, and also zoom to 400%.
5. **Screen reader spot check:** use Orca, NVDA or VoiceOver, or the DevTools Accessibility pane. Confirm a field's label and its error are announced.

---

## 13. Out of scope

These are carried over from `intent.md` and are **not** to be built:

- Applying for the grant
- Any backend or storage of answers
- Grant amounts
- Postcode, address or EPC lookups
- Uploading evidence
- Welsh language
- Real analytics or cookies
- Save and return
- `govuk-react`, or GOV.UK Frontend's JavaScript (see DS-03)

If Claude suggests any of these, decline and log it.

---

## 14. Build plan

**Ownership:**

- **Ramya** (branch `ra/…`): state in `App`, routing fixes, Start page, Q1–Q3, Check your answers.
- **Nithin** (branch `ns/…`): Q4–Q5, `eligibility.js` and its tests, Result page, layout (header, skip link, phase banner, footer, cookie banner, accessibility statement, placeholder pages).
- **Shared:** `CLAUDE.md`, `AI_LOG.md`, the accessibility walkthrough and the demo.
- **Review rule:** every change is reviewed by the other person before merging to `main`.

| Step | When (pack checkpoint) | Owner | Work | Requirement IDs | Done when |
|---|---|---|---|---|---|
| 0 | Day 1, start | Both | Add `.gitignore` (`node_modules/`, `dist/`) and remove `node_modules` from git. Add `CLAUDE.md` (Learner Handbook ch. 2). Add `src/data/questions.js` (labels and values), reviewed together because both of you depend on it. Write AI_LOG entry 1 (planning: intent and spec). See `plan.md` for task-level detail. | n/a | App runs at `https://<hostname>:5002` |
| 1 | Day 1, 12:30 (first green path) | Ramya | `answers` state in `App`. Start page. Q1–Q3 with Continue and Back. Fix `href` → `<Link>`. | ST-01–03, NAV-01–03, SP-01, QP-01–06 | Start → Q1 → Q2 → Q3 works, and answers survive Back |
| 1 | Day 1, 12:30 | Nithin | Write `eligibility.js` per Section 7 (test first). Placeholder Result page that calls it. | EL-01–06, RES-01 | One path reaches a real result |
| 2 | Day 1, 14:30 (Day 1 checkpoint) | Nithin | Q4, then Q5 with the "Other" reveal. Result page panels and reasons. | Q-01–02, RES-01–04 | All 5 questions → result works with saved answers |
| 2 | Day 1, 14:30 | Ramya | Check your answers summary list with Change links and the Submit button. | CYA-01–06 | Every answer shows, Submit → result |
| 3 | Day 1, end | Both | Fix the checkpoint feedback. Commit. AI_LOG entry 2. Write Day 2 priorities. | n/a | Working state on `main` |
| 4 | Day 2, 10:50 (mid-morning check) | Ramya | Validation on Q1–Q3 and Change mode. NAV-05 guard. | VAL-01–07, NAV-04–05 | One error shows both the summary and the inline error |
| 4 | Day 2, 10:50 | Nithin | Validation on Q4–Q5, including the "Other" text. Vitest set up with T1–T14. | VAL-01–07, TST-01–02 | `npm test` passes |
| 5 | Day 2, late morning | Nithin | Skip link, phase banner, footer, cookie banner, placeholder pages, accessibility statement. | LAY-01–08, DS-02 | All are reachable by keyboard |
| 5 | Day 2, late morning | Ramya | Page titles, scroll on navigate, `lang`, Start again. | A11Y-08–10, NAV-06, ST-05 | n/a |
| 6 | Day 2, before 13:30 | Both | Manual walkthrough (12.2) and pa11y. Fix what fails. AI_LOG entry 3 or more. Rehearse the demo. | A11Y-01–12 | "Before you finish" checklist all ticked |
| 7 | Day 2, 13:30 | Both | 5-minute demo: eligible path → not-eligible path → a validation error → an AI_LOG entry → `npm test`. | n/a | n/a |
| 8 | Day 2, 16:00 | Both | Final commits, retro, submit the repo link. | n/a | Submitted |

---

## 15. Definition of done

These come from the "Before you finish" checklist in the Hackathon Pack.

- [ ] GOV.UK start page with a title, description and "Start now" button
- [ ] 5 question pages, one question per page
- [ ] Continue and Back on every question page
- [ ] Check your answers page with a Change link for every answer
- [ ] Result page showing eligible, partially eligible or not eligible
- [ ] Every form input has a `<label>`
- [ ] Keyboard navigation works, with visible focus
- [ ] All text has at least 4.5:1 contrast
- [ ] Reflows at 320px with no sideways scrolling
- [ ] GOV.UK error pattern: error summary plus inline error
- [ ] 5 or more unit tests pass
- [ ] `AI_LOG.md` has 3 or more entries, each with 4 fields
- [ ] Phase banner, footer, accessibility statement and cookie banner are present and keyboard reachable
- [ ] 5-minute presentation given
- [ ] Repository link submitted

---

## 16. Decisions log (spec)

| Date | Question | Decision |
|---|---|---|
| 2026-10-12 | Question order | Keep the starter's route order: Property type → Housing situation → Income → Insulation → Heating. |
| 2026-10-12 | How to show the partial outcome | Reuse the green panel. The heading and reasons show the difference. |
| 2026-10-12 | "I do not know" for insulation? | No. Yes/No only, with hint text "If you are not sure, choose No". |
| 2026-10-12 | Cookie banner | Accept/Reject buttons, a confirmation message and a Hide button. Held in session state only, with no real cookies. |
| 2026-10-12 | Check your answers button text | "Submit" |
| 2026-10-12 | Direct visit to `/check-answers` or `/result` with answers missing | Redirect to `/`. |
| 2026-10-12 | Links on the result page | "Start again" (clears answers) and a feedback link. |
| 2026-10-12 | Team split | By page: see Section 14. |
| 2026-10-12 | Feedback link destination | A placeholder `/feedback` page. |
| 2026-10-12 | Answers lost on refresh | Accepted. No browser storage. |
| 2026-10-12 | Design system | Use GOV.UK Frontend 6.5.1 (official CSS and component markup) instead of the starter's teaching CSS. Behaviour is written in React, and GOV.UK Frontend JS is not used (DS-01 to DS-04). |
