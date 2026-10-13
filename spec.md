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
23. The Check your answers page has a Submit button. Submit gives the check a reference number (requirements 54 to 60), then takes the user to the result page.
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
33. The result page shows the outcome in a prominent panel, in plain words: "You may be eligible", "You may be partially eligible" or "You are not eligible". The panel body, laid out as in the GOV.UK confirmation panel, reads "Your support" with the support name in bold under it (for example "Full grant" or "Heat Pump Support Only"), and a sentence below the panel says in plain English what the user may get. A warning notice says the result is an indication only, not a decision.
34. A homeowner with income under £60,000 who lives in a flat or apartment or a studio flat always sees the Partially Eligible result, whatever their insulation and heating answers.
35. Any other homeowner with income under £60,000 sees at least the Partially Eligible result, never Not Eligible.
36. Every one of the 4 housing × 4 income × 7 property × 2 insulation × 7 heating answer combinations (1,568 in all) produces exactly one result, and none produces an error page.

### Result page

37. The result page shows the outcome in plain words as the main heading, inside the standard green GOV.UK confirmation panel, for every outcome. Under the heading the panel says what the user may be eligible for (for example "You may be eligible for" and then "Heat Pump Support Only"), or "Your support" and "No grant" for Not Eligible. The outcome is stated in words, never by colour alone, so a green panel on a Not Eligible result is not the only signal. The page content appears in this order: the outcome, then the reference number (requirement 55), then the details of the decision (requirements 38 to 40).
38. The result page explains in plain language why the user got this result, naming the answers that led to it.
39. The result page shows an indicative maximum grant amount. This is a placeholder figure and is labelled as indicative.
40. The result page lists numbered next steps. Eligible and Partially Eligible users are told to go to the fictional application service (a link), to print the page to keep a record, and to change their answers if any is wrong. Not Eligible users are told to change their answers if any is wrong, read the help page, and contact the service if their situation changes.
41. The result page has a way to start again. Starting again clears all previous answers and the reference number, including after a reload.
52. The result page has a "Print this page" link. Selecting it opens the browser's print dialog. The printed page shows the outcome, the reasons, the amount and next steps, and leaves out the header bar, banners, back link, footer, buttons and the print link itself.
53. The Accessibility statement, Privacy, Cookies, Terms and conditions, Help, Contact and application placeholder pages each have a Back link at the top. It returns to the page the user came from (for example the question they were on, with their answers kept). If the page was opened directly, it goes to the start page. It works with the keyboard.

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

### Reference number

54. When the user presses Submit on the Check your answers page, the service creates a reference number in the format `ELG-ddmmyy-XXXXXX`:
    - `ELG`, then a hyphen
    - the date of the check in UK time (Europe/London), as a two-digit day, month and year (`ddmmyy`), then a hyphen
    - 6 random characters, each an upper-case letter or a number, leaving out the look-alike characters 0, O, 1, I and L. That leaves the letters A to Z except I, L and O, and the numbers 2 to 9: 31 possible characters.

    For example, a check made on 13 October 2026 could get `ELG-131026-7KQ2ZD`.
55. The result page shows the reference number inside the outcome panel, after the outcome heading and the support line (for example "You may be eligible for Heat Pump Support Only"), as "Your reference number - " followed by the reference in bold. The details of the decision follow below the panel.
56. The reference number is made in the user's browser and is only shown on the result page. It is not sent to the server, and neither the reference nor the answers are stored on a server, in a file or in a database. It cannot be looked up later.
57. Reloading the result page shows the same reference number. Like the answers (decision 6), it is kept in the browser's session storage until the tab is closed or the user starts again.
58. If the user changes any answer after submitting (for example with "Change your answers" on the result page), the reference number is cleared, and submitting again gives a new one. Going through a Change link and pressing Continue without changing anything keeps the reference number.
59. Opening the result page with every question answered but no reference number (for example by typing `/result`, or after changing an answer) sends the user to the Check your answers page, so they must press Submit to get a result.
60. Every check gets its own random reference number. Because nothing is stored, the service cannot check that a reference has never been used before. With 31⁶ (about 887 million) possible references per day, two checks getting the same one is very unlikely.

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
12. **Use the official `govuk-frontend` package, compiled with Sass in `src/app.scss`, with Arial instead of GDS Transport, and no custom CSS:** this gives genuine GOV.UK components instead of hand-written look-alike CSS, and GDS Transport may only be used on service.gov.uk. `app.scss` contains only the library import and its two settings.
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
23. **Every outcome uses the library's confirmation panel as it is, and the print link calls `window.print()`:** the user asked for no custom CSS, and the library's panel is green only. The heading and the "You may be eligible for" or "Your support" line carry the meaning in words. Print layout comes from the library's own print styles plus its `govuk-!-display-none-print` class.
24. **Each outcome carries its own plain-English summary sentence, written in `eligibility.js` next to the rules:** the wording stays with the rule that produces it, so the two cannot drift apart, and tests check every combination has one.
25. **An automated accessibility scan (`npm run a11y`) uses axe-core through Playwright and covers every page and state at two widths:** it gives repeatable evidence for the WCAG 2.2 AA requirement, and it exits with an error on any violation so it can run in CI.
26. **A Back link on the footer pages that uses the browser history, falling back to the start page:** the GOV.UK Back link pattern returns users to the page they came from, which fits pages reachable from anywhere, and a plain "Home" link would drop the user's place in the journey. The service name in the header already links to the start page.
27. **Make the reference number in the browser and store nothing (`src/reference.js`):** the platform the service runs on can't support saving checks on the server, so the reference is only shown to the user. The Flask server stays as it was: it only serves the built front end.
28. **Use the browser's `crypto.getRandomValues` for the random part:** it gives unpredictable values, unlike `Math.random`. Values that would make some characters more likely than others are thrown away.
29. **Work out the date with `Intl.DateTimeFormat` in the Europe/London time zone:** a user's device might be set to another time zone, and UTC would give the wrong date between midnight and 1am during British Summer Time.
30. **Leave out 0, O, 1, I and L:** these are easy to confuse when a reference is read out or typed, as GOV.UK guidance on reference numbers points out.
31. **Keep the reference number in session storage next to the answers (`useAnswers`):** reloading the result page then shows the same reference (requirement 57), in the same way decision 6 keeps the answers. It is cleared only when an answer actually changes, or the user starts again.
32. **Show the reference inside the outcome panel, after the support line, as "Your reference number - " followed by the reference in bold:** this keeps the reference with the outcome, as asked, inside the GOV.UK confirmation panel.
33. **Test the generator with Node's built-in test runner (`src/reference.test.js`), like the eligibility rules:** the date and random source can be passed in, so the tests can fix them, and no new test library is needed.

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
21. **What the reference is for:** since nothing is stored, the reference can't be looked up or checked by anyone else. Should the result page say so, or suggest the user keeps a note of it (for example with their answers)? I have added no extra text.
22. **Storing checks later:** if a later phase needs checks to be saved (for example in a file or a database), it will need a server that can write data, and server-side validation of the answers. That was planned and then removed on 13 October 2026, because the platform can't support it.
