---
name: green-home-grant-eligibility
description: Explains all the Green Home Grant eligibility rules and works out the outcome (Eligible, Partially Eligible, Not Eligible) for a given set of answers. Use when asked who qualifies, why someone got a result, what the outcomes are, or to check a combination of answers.
---

# Green Home Grant eligibility

The Green Home Grant is a fictional scheme that funds insulation and heat pumps. The rules live in `starter/src/eligibility.js` and the question options in `starter/src/questions.js`. If this file and the code disagree, the code is right, so tell the user and fix this file.

## The five answers

| Question | Answer values |
|----------|---------------|
| `ownership` (housing situation) | `own`, `own-joint`, `rent`, `social` |
| `income` (annual household income) | `under-20k`, `20k-40k`, `40k-60k`, `60k-plus` |
| `propertyType` | `detached`, `semi-detached`, `terraced`, `mid-terraced`, `bungalow`, `flat`, `studio` |
| `insulation` | `yes`, `no` |
| `heating` (main heating source) | `gas`, `electric`, `oil`, `biofuel`, `heat-pump`, `solar`, `other` |

## Outcomes, checked in this order

The first rule that matches decides the outcome.

1. **Not Eligible**: the user rents (`rent`) or lives in social housing (`social`). Only homeowners can qualify.
2. **Not Eligible**: household income is £60,000 or more (`60k-plus`).
3. **Partially Eligible (reduced support)**: homeowner under £60,000 in a flat or studio, whatever the insulation and heating.
4. **Eligible (full grant)**: homeowner, income under £40,000, house or bungalow, no insulation, and gas or electric heating.
5. **Partially Eligible, Heat Pump Support Only**: homeowner under £60,000, house or bungalow, has insulation, and gas or electric heating.
6. **Partially Eligible, Insulation Support Only**: homeowner under £60,000, house or bungalow, no insulation, and heating that is not gas or electric (oil, biofuel, heat pump, solar, other).
7. **Partially Eligible (reduced grant, income)**: homeowner, income £40,000 to £59,999, house or bungalow, no insulation, gas or electric heating.
8. **Partially Eligible (reduced support)**: any other homeowner under £60,000. This is a house or bungalow with insulation and heating that is not gas or electric. The scheme has not said what support this is, so it is a guess (spec open question 4).

In short: any homeowner earning under £60,000 is at least Partially Eligible.

## Grant amounts

Amounts are placeholders only, held in `PLACEHOLDER_AMOUNTS` in `eligibility.js`. Say so whenever you quote one.

## Checking a set of answers

Run the real rules rather than working it out by hand. From the repository root:

```
node .claude/skills/green-home-grant-eligibility/check.mjs '{"ownership":"own","income":"20k-40k","propertyType":"detached","insulation":"no","heating":"gas"}'
```

It prints the outcome, the support label, the placeholder amount and the reasons. It exits with an error for an unknown answer value.

## How to answer

- Give the outcome first, then the reasons in plain language.
- If the user describes their situation in words, map it to the values above, and say which you assumed.
- If a needed answer is missing, ask for it instead of guessing.
- Never present a result as a real grant decision.
