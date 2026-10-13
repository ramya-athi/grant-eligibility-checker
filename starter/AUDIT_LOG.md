# Audit log: Green Home Grant eligibility checker

| Check                                   | Before                                   | After                  |
| --------------------------------------- | ---------------------------------------- | ---------------------- |
| Tests (`npm test`)                      | 4 tests failed                           | All tests pass ✓ (8/8) |
| Lighthouse: performance / accessibility | 78 / 85                                  | 100 / 100 ✓            |
| Keyboard only                           | Failed                                   | Passed ✓               |
| 375px wide (mobile)                     | Passed                                   | Passed ✓               |
| Automated accessibility scan (`npm run a11y`, axe, WCAG 2.2 AA) | Not run | 0 violations in 26 scans ✓ (22 pages and states at 1000px, 4 at 320px) |
