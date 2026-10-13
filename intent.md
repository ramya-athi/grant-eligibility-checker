# Intent: Check if you can apply for a Green Home Grant

## The problem

The Green Home Grant is a (fictional) UK government scheme that funds **home insulation** and **heat pumps**.

At the moment, citizens phone a call centre to find out whether they qualify. They wait **35 minutes on average** before they get an answer. Most callers only need to answer a handful of simple questions, so the call centre's time goes on work a self-service tool could do.

We are building a GOV.UK-style online service that replaces that call. A citizen answers 5 short questions and gets an immediate, clear answer on whether they can apply.

## Who will use it

**Primary users:** people living in the UK who want to make their home warmer or cheaper to heat, and who want to know whether they can get help paying for it.

What we assume about them:

- They may have little confidence with forms or with government language.
- They may use a screen reader, a keyboard only, magnification, or a small phone screen (320px wide).
- They may not know technical terms like "cavity wall" or "air source heat pump". Every question has help text in plain English.
- They may live in any kind of home and any housing situation: owners, joint owners, private renters and social housing tenants.

**Secondary users:** call centre staff, who can point callers to the service instead of handling the call.

## The outcome

**For the citizen:** in under 5 minutes, without phoning anyone, they know one of three things:

| Outcome | What the user sees |
|---|---|
| **Eligible** | You can apply for the Green Home Grant, with next steps. |
| **Partially eligible** | You can apply for part of the grant or under conditions, with the reason(s) and next steps. |
| **Not eligible** | You cannot apply, with the reason and where else to get help. |

**For the government:** fewer calls to the call centre, and a service that meets the GOV.UK Service Standard and WCAG 2.2 AA.

**For the hackathon:** a working prototype that meets all six Minimum Viable Submission (MVS) items and the "Before you finish" checklist in the Hackathon Pack.

## The user journey

```
Start page → Q1 Property type → Q2 Housing situation → Q3 Household income
→ Q4 Insulation → Q5 Heating → Check your answers → Result
```

| # | Question (page heading) | Answers offered |
|---|---|---|
| 1 | What type of property do you live in? | Detached house · Semi-detached house · Terraced house (including mid-terraced) · Bungalow · Flat or apartment · Studio flat |
| 2 | What best describes your housing situation? | I own my home · I own my home with someone else · I rent my home · I live in social housing |
| 3 | What is your annual household income? | Less than £20,000 · £20,000 to £39,999 · £40,000 to £59,999 · £60,000 or more |
| 4 | Does your home currently have insulation? | Yes · No |
| 5 | What is the main way your home is heated? | Gas boiler · Electric heating · Oil heating · Biofuel · Heat pump · Solar energy · Other (reveals a text box: "Tell us how your home is heated") |

All questions use radio buttons, one question per page, with help text under the heading.

## Eligibility rules

The rules belong to the team, not the brief. They live in one pure function (for example `src/utils/eligibility.js`) that takes the answers and returns an outcome and the reasons. Pages collect answers; the function decides.

### Step 1: Not eligible (checked first; any one of these is enough)

| Rule | Reason shown to the user |
|---|---|
| Household income is £60,000 or more | Your household income is above the limit for this grant. |
| Property is a flat/apartment or studio flat | The grant is only available for houses and bungalows. |
| Home already has insulation **and** heating is not gas or electric | Your home is already insulated and does not use gas or electric heating, so there is nothing the grant can fund. |

### Step 2: Partially eligible (all that apply are listed)

| Rule | Reason shown to the user |
|---|---|
| Renter or social housing tenant | You can apply only with your landlord's or housing association's permission. |
| Income £40,000 to £59,999 | You can apply for a reduced grant based on your household income. |
| Has insulation **and** heating is gas or electric | You can apply for a heat pump only. |
| No insulation **and** heating is not gas or electric | You can apply for insulation only. |

If more than one partial rule applies, the result page lists every reason.

### Step 3: Eligible

All of these are true:

1. Owns the home, alone or jointly.
2. Household income is under £40,000.
3. Property is a detached, semi-detached or terraced (including mid-terraced) house, or a bungalow.
4. Home has no insulation.
5. Main heating is a gas boiler or electric heating.

### How we interpreted the brief

- **"Other" heating:** any free-text answer counts as "not gas or electric". The text is shown on Check your answers but does not change the outcome.
- **Heat pump, solar, oil, biofuel:** these count as "not gas or electric".
- **Income boundaries:** £39,999 is eligible; £40,000 is partial; £59,999 is partial; £60,000 is not eligible. These boundaries must be unit tested.

## In scope

**Service pages**

- Start page: what the service is, who can use it, what you need, and a green "Start now" button.
- Five question pages, one question per page, each with help text, a **Back** link and a **Continue** button.
- Answers kept in one state object in `App`, so they survive Back, Continue and Change.
- Check your answers page: a GOV.UK summary list (`<dl>`), with a **Change** link for every answer. Each link has visually hidden text, for example "Change housing situation".
- After a Change, Continue returns the user to Check your answers, not the next question.
- A **Submit** button on Check your answers that goes to the result page.
- Result page: a GOV.UK panel showing the outcome, the reason(s), and plain-English next steps.

**Validation (Day 2)**

- Every question is required. If nothing is chosen, show the GOV.UK error pattern:
  - an error summary at the top with `role="alert"`, the heading "There is a problem", and a link to the field
  - an inline error message on the question, with the same wording
  - the page title starts with "Error: "
- Specific messages, for example "Select how your home is heated", not "This field is required".
- If "Other" heating is chosen, the text box is required: "Enter how your home is heated".

**Layout and Service Standard signals**

- GOV.UK header, a phase banner ("Alpha" plus a feedback link) and a cookie banner.
- Footer links: Accessibility statement, Privacy, Cookies, Terms and conditions, Help, Contact.
- A fully written accessibility statement. The other footer pages are short placeholder content pages.

**Accessibility (WCAG 2.2 AA)**

- Every radio group is a `<fieldset>` with the question as its `<legend>` (or page heading). Every input has a `<label>`.
- The whole journey can be completed by keyboard alone, with visible focus that is never hidden.
- Text contrast is at least 4.5:1, and controls are at least 24×24 CSS pixels.
- Pages reflow at 320px with no sideways scrolling.
- Errors are described in text, not just shown in colour.

**Quality and evidence**

- GOV.UK typography, spacing and headings from the CSS variables provided in `App.css`.
- At least 5 Vitest unit tests for the eligibility function, covering eligible, partially eligible, not eligible, an income boundary, and the trickiest rule (insulation × heating).
- `AI_LOG.md` with at least 3 entries, each with the four fields: Date, Task, What AI Generated, What You Changed + Why.

## Out of scope

- Applying for the grant. This service only checks eligibility; the result page says what to do next.
- Storing, sending or saving personal data. Answers are held only in the browser while the page is open, with no backend, database, accounts or login.
- Grant amounts or cost calculations. A "reduced grant" is described, not calculated.
- Postcode, address, EPC or council tax lookups, and any checks against real records.
- Checking documents or evidence, such as proof of income or ownership.
- Welsh-language version.
- Save and return (`localStorage`) and Playwright end-to-end tests. These are stretch goals only, if the MVS is complete.
- Real analytics or cookie tracking. The cookie banner is a notice only.
- Using `govuk-react` or `govuk-frontend`'s JavaScript. We use **GOV.UK Frontend's official CSS and component markup** (`govuk-frontend` package) inside our own React components, and React handles the behaviour. This replaces the starter's teaching CSS.

## Success measures

- A citizen can go from Start to a result using only the keyboard, in under 5 minutes.
- Every item on the Hackathon Pack's "Before you finish" checklist is ticked.
- `npm test` shows 5 or more passing tests.
- The 5-minute demo shows an eligible journey, a not-eligible journey, a validation error, one AI log entry and the tests passing.

## Decisions log

| Date | Question | Decision |
|---|---|---|
| 2026-10-12 | What do renters and social housing tenants get? | Partially eligible: they need their landlord's or housing association's permission. |
| 2026-10-12 | What happens at £60,000 or more? | Not eligible. |
| 2026-10-12 | What about flats, studios and mid-terraced homes? | Flats and studios are not eligible. Mid-terraced is covered by "Terraced house". |
| 2026-10-12 | What about an insulated home with non-gas/electric heating? | Not eligible: there is nothing for the grant to fund. |
| 2026-10-12 | Is validation in scope? | Yes, built on Day 2 after the happy path works. |
| 2026-10-12 | Question order | Changed to follow the starter's routes (property type first). See `spec.md`. |
| 2026-10-12 | Design system | Use GOV.UK Frontend (official `govuk-frontend` package, v6.5.1) components instead of the starter's teaching CSS. |
