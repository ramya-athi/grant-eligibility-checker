# Spec: Green Home Grant eligibility checker

The starting point is the `starter/` folder: a React and Vite scaffold with routes, GOV.UK-style CSS, a few shared components and TODO comments. Where the starter's question wording or options differ from `intent.md`, `intent.md` wins.

## 1. Requirements

Each requirement can be checked by using the running app in a browser.

### Layout and shared pages

1. Every page shows a GOV.UK-style header, a phase banner showing "alpha", and a footer.
2. The footer has links to Accessibility statement, Privacy, Cookies, Terms and conditions, Help and Contact. Each link opens a page, even if it holds placeholder text.
3. A cookie banner appears on first visit. After the user accepts or rejects cookies, it no longer appears on later pages or after a reload.
4. Every page has one main heading, and the browser tab title matches that heading.
5. The Accessibility statement page has all its headings filled with real sentences, with no empty sections or "TODO" text.
6. A web address that does not exist shows a "Page not found" page with a link back to the start, not a blank page.

### Start page

7. Opening `/` shows a start page that explains what the service is for, what the grant pays for, who can get it, what the user needs to know before starting (the five topics), how long it takes, and a notice that the scheme is fictional.
8. The start page has a green "Start now" button that takes the user to question 1.

### Questions

9. Each of the five questions is on its own page, shown in this order: housing situation, household income, property type, insulation, main heating source.
10. Every question page has help text under the question.
11. Question 1 (housing situation) is a radio list with these options: I own my home, I own my home with someone else, I rent my home, I live in social housing.
12. Question 2 (household income) is a radio list with these options: Less than £20,000, £20,000 to £39,999, £40,000 to £59,999, £60,000 or more.
13. Question 3 (property type) is a radio list with these options: Detached house, Semi-detached house, Terraced house, Mid-terraced house, Bungalow, Flat or apartment, Studio flat.
14. Question 4 (insulation) is a radio list with two options: Yes, No.
15. Question 5 (main heating source) is a radio list with these options: Gas boiler, Electric heating, Oil heating, Biofuel, Heat pump, Solar energy, Other.
16. On question 5, choosing "Other" reveals a free-text box on the same page. Choosing any other option hides the box.
17. Each question page has a Continue button. Continue takes the user to the next question, or from question 5 to the Check your answers page.

### Navigation and state

18. Every page after the start page has a Back link. It returns the user to the previous page with the earlier answer still selected, and the browser does not do a full page reload.
19. If the user moves back and forward through the journey, every answer already given is still selected.
20. If the user reloads the browser part-way through the journey, their answers are still there.
21. On the Check your answers page, the user sees all five questions with their answers in a summary list, and each row has a Change link.
22. When the user clicks Change, the matching question opens with the current answer selected. After Continue, the user returns directly to the Check your answers page, not to the next question.
23. The Check your answers page has a Submit button, which takes the user to the result page.
24. A user who opens a later page (for example the Check your answers page or the result page) before answering the questions is sent back to the first question, and no error page is shown.
25. Opening any journey page directly by typing its address, or reloading it, shows that page and not a server error.

### Validation

26. If the user clicks Continue on a question page without choosing an answer, the same page is shown again with an error summary at the top headed "There is a problem", a matching red message next to the question, and a red bar beside the question. The page title starts with "Error:". Clicking the link in the summary moves focus to the first option. The user cannot move on.
27. If the user chooses "Other" for heating and leaves the free-text box empty, the same error summary and an inline message appear, and the summary link moves focus to the text box.

### Eligibility outcomes

28. A user who rents their home or lives in social housing sees the Not Eligible result, whatever their other answers.
29. A user with a household income of £60,000 or more sees the Not Eligible result, whatever their other answers.
30. A homeowner (single or joint) with income under £40,000, in a detached, semi-detached, terraced, mid-terraced house or bungalow, with no insulation and gas boiler or electric heating, sees the Eligible (full) result.
31. A homeowner in a house or bungalow with income of £40,000 to £59,999, no insulation and gas boiler or electric heating, sees the Partially Eligible result. The result says it is a reduced grant because of income.
32. A homeowner in a house or bungalow with income under £60,000, with insulation and gas boiler or electric heating, sees the Partially Eligible result for Heat Pump Support Only.
33. A homeowner in a house or bungalow with income under £60,000, without insulation and with oil, biofuel, heat pump, solar or other heating, sees the Partially Eligible result for Insulation Support Only.
34. A homeowner with income under £60,000 who lives in a flat or apartment or a studio flat always sees the Partially Eligible result, whatever their insulation and heating answers.
35. Any other homeowner with income under £60,000 sees at least the Partially Eligible result, never Not Eligible.
36. Every one of the 4 housing × 4 income × 7 property × 2 insulation × 7 heating answer combinations (1,568 in all) produces exactly one result, and none produces an error page.

### Result page

37. The result page shows the outcome (Eligible, Partially Eligible, or Not Eligible) in a prominent panel. The panel is green for Eligible, a different colour for Partially Eligible, and grey for Not Eligible, and the outcome is also stated in words, never by colour alone.
38. The result page explains in plain language why the user got this result, naming the answers that led to it.
39. The result page shows an indicative maximum grant amount. This is a placeholder figure and is labelled as indicative.
40. The result page gives next steps. Eligible and Partially Eligible users see a link to a fictional application service, and Not Eligible users see suggestions for further support.
41. The result page has a way to start again. Starting again clears all previous answers, including after a reload.

### Accessibility, quality and running

42. Every question can be answered using only the keyboard, and the focused element always has a visible focus indicator.
43. Every radio button and text box has a label that is announced by a screen reader.
44. Each page has exactly one main content area, with no nested ones.
45. Pages are usable at 320px width without horizontal scrolling, and on desktop, tablet and mobile sizes.
46. Text and controls meet WCAG 2.2 AA colour contrast.
47. The app works in current Chrome, Edge, Firefox and Safari.
48. Pages load quickly, and a user can get from the start page to a result in under 2 minutes.
49. After the front end is built, a single Python command starts the app, and it is reachable on port 5002 from another machine on the network, not only from localhost.
50. The first press of Tab on any page focuses a "Skip to main content" link, which appears at the top of the page. Pressing Enter on it moves focus to the main content.
51. After moving to a new page with Continue, Back or a link, keyboard focus is back at the top of the page, so the next Tab press reaches the skip link again.

## 2. Decisions

1. **Keep the starter's React and Vite front end as the app:** it already has the routes, GOV.UK-style CSS and components, and rebuilding it in another stack would throw that work away.
2. **A small Python (Flask) server serves the built front end on 0.0.0.0 port 5002:** this meets the "runs with Python on port 5002" requirement, which Vite's own development server does not, as it is not Python.
3. **The Python server sends every non-file address to the front end's `index.html`:** this lets reloads and typed addresses on routes such as `/income` work, as requirements 20 and 25 need.
4. **Eligibility rules live in one plain JavaScript module that takes the five answers and returns an outcome:** the starter's result page already expects an eligibility function to import, and it keeps the rules testable on their own.
5. **Rules are checked in a fixed order: not eligible, then flat or studio, then full, then partial:** this makes each answer combination produce exactly one outcome.
6. **Answers are held in state at the top of the app and copied to the browser's session storage:** the starter's TODOs ask for top-level state, but its Back links are plain `<a href>` links that reload the page and would wipe it.
7. **Back links use the router's links instead of plain anchors:** this stops full page reloads, as the intent asks for "no unnecessary page reloads".
8. **Question order follows the intent (housing, income, property type, insulation, heating):** the starter's routes run property type first, so the Back and Continue targets on every page change.
9. **Question wording and options are replaced with those in the intent:** the starter's income bands (31,000 and 50,000), five insulation choices (including "I do not know"), and heating and housing options do not match the grant rules.
10. **Remove the extra `<main>` elements inside the starter's pages, keeping the one in `App.jsx`:** nested main landmarks harm screen reader users, and the Accessibility statement page has one too.
11. **Mount the phase banner and footer as the starter's TODOs say, rebuild them and the header with GOV.UK Frontend's markup, and add a cookie banner component:** the starter had no cookie banner and only one footer link.
12. **Use the official `govuk-frontend` package, compiled with Sass in `src/app.scss`, with Arial instead of GDS Transport, plus a small `src/custom.css`:** this gives genuine GOV.UK components instead of hand-written look-alike CSS, and GDS Transport may only be used on service.gov.uk.
13. **One placeholder grant amount per outcome, held in one module:** the intent says amounts are placeholders, so they are easy to replace later.
14. **The "Other" heating text box appears and disappears in the front end only:** the app needs scripts to run at all, so a no-script fallback adds nothing.
15. **Required-field validation only, shown as a GOV.UK error summary plus an inline message:** the user asked for errors that look like the GOV.UK Design System; advanced validation stays in Phase 2.
16. **Cookie banner choice stored in the browser, with no analytics:** this keeps the banner behaviour real without tracking anyone.
17. **Footer pages hold short placeholder text:** the intent asks for the links, not final legal content.
18. **Automated tests for the eligibility rules, run with Node's built-in test runner, covering every answer combination:** the rules are the part most likely to be wrong, and no new test library is needed.
19. **Python dependencies listed in a `requirements.txt`, with `npm run build` run first:** Flask 3.1 is already installed here, and a fresh machine needs to know what to install.
20. **Record AI use in `starter/AI_LOG.md`, replacing its married couple's allowance sample entry:** the starter asks for three or more entries, and the sample is about a different scheme.
21. **Skip link plus a focus reset on every page change:** a single-page app does not reset keyboard focus like a full page load, so keyboard users would otherwise start from wherever the removed button was.
22. **Tell the CSS minifier to recover from errors (`css.lightningcss.errorRecovery` in `vite.config.js`):** the installed Vite 8 rejects an old Internet Explorer rule inside govuk-frontend and the build failed without it.

## 3. Open questions

1. **Grant amounts:** what indicative figures should Full, Income partial, Heat Pump only, Insulation only and Flat/studio results show? Until told otherwise I will use obvious placeholder figures.
2. **Flat or studio and income:** should a flat or studio owner with income of £40,000 to £59,999 get the same reduced result as one with income under £40,000, or a lower amount?
3. **Overlapping partial cases:** if someone has both an income-band reason and a heat pump or insulation reason, should the result show both reasons, and which grant amount applies?
4. **Insulation with a heat pump, solar or other heating:** a homeowner in a house with insulation and non-gas, non-electric heating matches none of the named partial scenarios. They are Partially Eligible under the "at least partial" rule, but what support are they eligible for and what is the amount?
5. **Not Eligible next steps:** where should someone who is Not Eligible be sent for further support? The intent says "seek further support" but names nowhere.
6. **Fictional application service:** what is the link target? I will use a placeholder page unless you give a URL.
7. **Starter options versus intent:** I have assumed the intent replaces the starter's income bands, five-way insulation question ("I do not know" is dropped) and heating list. Is that right, and what should happen for someone who does not know whether they have insulation?
8. **Submit button wording:** the starter says "Accept and continue" on Check your answers, but the intent says Submit. I have followed the intent.
9. **Starter's route order and names:** I will reorder the routes to match the intent. Do you want to keep the starter's address names (`/ownership`, `/property-type` and so on)?
10. **Mid-terraced versus terraced:** the brief lists both. Are they distinct options, and should they be treated the same in the rules? I have assumed yes.
11. **Free text for "Other" heating:** is the text only recorded and shown on the summary, or does it affect the result? I have assumed it does not affect the result.
12. **Result page after Submit:** should Back from the result page return to Check your answers, and should the user be able to resubmit? The brief leaves the final page blank.
13. **Cookie banner:** should Accept and Reject do anything beyond hiding the banner, given there is no analytics?
14. **Footer, help and accessibility content:** do you want real wording for Accessibility, Privacy, Terms, Help and Contact, or are placeholders enough? Where should the phase banner's feedback link go, since the starter uses `#`?
15. **"Under 2 minutes":** is this a target to be measured, for example in user testing, or only a design aim for a short journey?
16. **Session lifetime:** answers are kept only until the browser tab is closed. Is that acceptable, given the intent says nothing is saved between visits?
17. **Success measures:** completion rate, abandonment, satisfaction and call reduction cannot be checked in a prototype with no analytics. Should any measurement be built, or is this left for after the prototype?
18. **Intent edit:** "Users understand why they received their result" was removed from the success list but remains under item 12 of In scope. I have kept it as a requirement (38). Is that right?
19. **Git housekeeping:** `starter/node_modules` is committed to git and there is no `.gitignore`. Should I add a `.gitignore` for `node_modules` and the build folder, and remove `node_modules` from git?
20. **Where the app lives:** should the app stay in `starter/`, or move to the repository root, with the Python server beside it?
