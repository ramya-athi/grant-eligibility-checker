# Audit log: Green Home Grant eligibility checker

| Check                                   | Before                                   | After                  |
| --------------------------------------- | ---------------------------------------- | ---------------------- |
| Tests (`npm test`)                      | 4 tests failed                           | All tests pass ✓ (14/14) |
| Lighthouse: performance / accessibility | 78 / 85                                  | 100 / 100 ✓            |
| Keyboard only                           | Failed                                   | Passed ✓               |
| 375px wide (mobile)                     | Passed                                   | Passed ✓               |


| Cookie behaviour (`npm run cookies`) | Not checked | 34 of 34 checks pass ✓ (choice kept for 1 year and expires, 0 real cookies, 0 outside requests, storage listed on the Cookies page) |

## Accessibility scan results

Run on 2026-10-13 with `npm run a11y` (axe-core through Playwright, WCAG 2.0 to 2.2 levels A and AA) against the built app on `http://localhost:5002`, run on lab machine lab11133.

| Summary | Result |
| ------- | ------ |
| Scans run | 26 (22 pages and states at 1000px wide, 4 at 320px wide) |
| Scans with violations | 0 |
| Violations in total | 0 |
| Items flagged "to review" | 0 |
| Overall | PASS: 26 of 26 scans clean ✓ |

```
Axe scan of http://localhost:5002 (WCAG 2.0 to 2.2, levels A and AA)

PASS  Start page, cookie banner showing at 1000px: 0 violations, 0 to review, 24 rules passed
PASS  Start page at 1000px: 0 violations, 0 to review, 24 rules passed
PASS  Question 1: housing situation at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 2: household income at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 3: property type at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 4: insulation at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 5: heating at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 5: heating, "Other" revealed at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 1 with error summary at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Question 5 "Other" with empty text box error at 1000px: 0 violations, 0 to review, 26 rules passed
PASS  Check your answers at 1000px: 0 violations, 0 to review, 25 rules passed
PASS  Result: eligible at 1000px: 0 violations, 0 to review, 24 rules passed
PASS  Result: partially eligible at 1000px: 0 violations, 0 to review, 24 rules passed
PASS  Result: not eligible at 1000px: 0 violations, 0 to review, 24 rules passed
PASS  Application service placeholder at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Accessibility statement at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Privacy at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Cookies at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Terms and conditions at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Help at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Contact at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Page not found at 1000px: 0 violations, 0 to review, 22 rules passed
PASS  Start page at 320px: 0 violations, 0 to review, 24 rules passed
PASS  Question 1 with error summary at 320px: 0 violations, 0 to review, 26 rules passed
PASS  Check your answers at 320px: 0 violations, 0 to review, 25 rules passed
PASS  Result: eligible at 320px: 0 violations, 0 to review, 24 rules passed

PASS: 26 of 26 scans clean, 0 violations in total.
```

