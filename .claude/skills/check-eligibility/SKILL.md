---
name: check-eligibility
description: Runs every Green Home Grant eligibility scenario (Not Eligible, Eligible, and each Partially Eligible case) through the app's real rules and reports the result of each check plus an overall pass or fail. Use when asked to check, verify or test the eligibility rules, or after changing eligibility.js or questions.js.
---

# Check eligibility

Runs a fixed set of named scenarios against `starter/src/eligibility.js` and compares each result with the outcome that `intent.md` says it should have. The expected outcomes are written in the script, not taken from the code, so a wrong rule shows up as a FAIL.

## Steps

1. From the repository root, run:

   ```
   node .claude/skills/check-eligibility/run.mjs
   ```

2. Show the user the results. For each group (Not Eligible, Eligible, Partially Eligible) give the table the script printed: scenario, answers, expected result, actual result, PASS or FAIL.

3. Finish with the overall result: how many scenarios passed in each group and in total, and the final PASS or FAIL line.

4. If any scenario fails, name it, say what was expected and what the app returned, and point to the rule in `starter/src/eligibility.js` that is likely responsible. Do not call the run a pass.

5. Optionally run `cd starter && npm test` as well, which checks all 1,568 answer combinations, and report that count too.

## Notes

- Grant amounts in the table are placeholders from `PLACEHOLDER_AMOUNTS` and are not real figures.
- The script exits with a non-zero code when any scenario fails.
- To add a scenario, add a line to the `SCENARIOS` list in `run.mjs` using the same `s(group, name, changes, outcome, support)` form. Change only the answers that differ from the default owner.
- To see the rules or check one set of answers, use the `green-home-grant-eligibility` skill instead.
