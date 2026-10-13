// Runs every named eligibility scenario through the app's real rules and prints a results table.
// Usage: node .claude/skills/check-eligibility/run.mjs
// Expected outcomes below come from intent.md, not from the code, so a wrong rule shows up as a FAIL.
import { checkEligibility } from '../../../starter/src/eligibility.js';

const own = { ownership: 'own', income: 'under-20k', propertyType: 'detached', insulation: 'no', heating: 'gas' };
const s = (group, name, changes, outcome, support) => ({ group, name, answers: { ...own, ...changes }, outcome, support });

const SCENARIOS = [
  // Not Eligible
  s('Not Eligible', 'Renter', { ownership: 'rent' }, 'not-eligible'),
  s('Not Eligible', 'Social housing tenant', { ownership: 'social' }, 'not-eligible'),
  s('Not Eligible', 'Renter in a flat', { ownership: 'rent', propertyType: 'flat' }, 'not-eligible'),
  s('Not Eligible', 'Owner earning £60,000 or more', { income: '60k-plus' }, 'not-eligible'),
  s('Not Eligible', 'Joint owner earning £60,000 or more in a studio', { ownership: 'own-joint', income: '60k-plus', propertyType: 'studio' }, 'not-eligible'),
  s('Not Eligible', 'Renter earning £60,000 or more', { ownership: 'rent', income: '60k-plus' }, 'not-eligible'),

  // Eligible (full)
  s('Eligible', 'Owner, under £20,000, detached, gas', {}, 'eligible', 'Full grant'),
  s('Eligible', 'Joint owner, £20,000 to £39,999, semi-detached, electric', { ownership: 'own-joint', income: '20k-40k', propertyType: 'semi-detached', heating: 'electric' }, 'eligible', 'Full grant'),
  s('Eligible', 'Owner, terraced house', { propertyType: 'terraced' }, 'eligible', 'Full grant'),
  s('Eligible', 'Owner, mid-terraced house', { propertyType: 'mid-terraced' }, 'eligible', 'Full grant'),
  s('Eligible', 'Owner, bungalow', { propertyType: 'bungalow' }, 'eligible', 'Full grant'),

  // Partially Eligible: income
  s('Partially Eligible', 'Income £40,000 to £59,999, no insulation, gas', { income: '40k-60k' }, 'partial', 'Reduced grant (income)'),
  s('Partially Eligible', 'Income £40,000 to £59,999, no insulation, electric, bungalow', { income: '40k-60k', heating: 'electric', propertyType: 'bungalow' }, 'partial', 'Reduced grant (income)'),
  // Partially Eligible: heat pump only
  s('Partially Eligible', 'Has insulation, gas boiler', { insulation: 'yes' }, 'partial', 'Heat Pump Support Only'),
  s('Partially Eligible', 'Has insulation, electric heating', { insulation: 'yes', heating: 'electric' }, 'partial', 'Heat Pump Support Only'),
  s('Partially Eligible', 'Has insulation, gas, income £40,000 to £59,999', { insulation: 'yes', income: '40k-60k' }, 'partial', 'Heat Pump Support Only'),
  // Partially Eligible: insulation only
  s('Partially Eligible', 'No insulation, oil heating', { heating: 'oil' }, 'partial', 'Insulation Support Only'),
  s('Partially Eligible', 'No insulation, biofuel', { heating: 'biofuel' }, 'partial', 'Insulation Support Only'),
  s('Partially Eligible', 'No insulation, heat pump', { heating: 'heat-pump' }, 'partial', 'Insulation Support Only'),
  s('Partially Eligible', 'No insulation, solar', { heating: 'solar' }, 'partial', 'Insulation Support Only'),
  s('Partially Eligible', 'No insulation, other heating', { heating: 'other' }, 'partial', 'Insulation Support Only'),
  // Partially Eligible: flat or studio
  s('Partially Eligible', 'Flat, otherwise a full match', { propertyType: 'flat' }, 'partial'),
  s('Partially Eligible', 'Studio, otherwise a full match', { propertyType: 'studio' }, 'partial'),
  s('Partially Eligible', 'Flat, income £40,000 to £59,999, insulated, solar', { propertyType: 'flat', income: '40k-60k', insulation: 'yes', heating: 'solar' }, 'partial'),
  // Partially Eligible: catch-all (homeowner under £60,000 is at least partial)
  s('Partially Eligible', 'Insulated, oil heating (no named scenario)', { insulation: 'yes', heating: 'oil' }, 'partial'),
  s('Partially Eligible', 'Insulated, solar, income £40,000 to £59,999', { insulation: 'yes', heating: 'solar', income: '40k-60k' }, 'partial'),
];

const LABEL = { eligible: 'Eligible', partial: 'Partially Eligible', 'not-eligible': 'Not Eligible' };
const GROUPS = ['Not Eligible', 'Eligible', 'Partially Eligible'];
const results = SCENARIOS.map((sc) => {
  let actual;
  let error = null;
  try {
    actual = checkEligibility(sc.answers);
  } catch (e) {
    error = e.message;
  }
  const outcomeOk = actual && actual.outcome === sc.outcome;
  const supportOk = !sc.support || (actual && actual.support === sc.support);
  return { ...sc, actual, error, pass: Boolean(outcomeOk && supportOk) };
});

const cell = (text) => String(text).replace(/\|/g, '/');
console.log('# Eligibility check results\n');
for (const group of GROUPS) {
  const rows = results.filter((r) => r.group === group);
  console.log(`## ${group} scenarios (${rows.filter((r) => r.pass).length}/${rows.length} passed)\n`);
  console.log('| # | Scenario | Answers | Expected | Actual | Result |');
  console.log('|---|----------|---------|----------|--------|--------|');
  rows.forEach((r, i) => {
    const a = r.answers;
    const answers = `${a.ownership}, ${a.income}, ${a.propertyType}, insulation ${a.insulation}, ${a.heating}`;
    const expected = LABEL[r.outcome] + (r.support ? `: ${r.support}` : '');
    const actual = r.error ? `ERROR ${r.error}` : `${LABEL[r.actual.outcome]}: ${r.actual.support} (£${r.actual.amount.toLocaleString('en-GB')})`;
    console.log(`| ${i + 1} | ${cell(r.name)} | ${cell(answers)} | ${cell(expected)} | ${cell(actual)} | ${r.pass ? 'PASS' : 'FAIL'} |`);
  });
  console.log();
}

const passed = results.filter((r) => r.pass).length;
console.log('## Overall result\n');
for (const group of GROUPS) {
  const rows = results.filter((r) => r.group === group);
  console.log(`- ${group}: ${rows.filter((r) => r.pass).length} of ${rows.length} passed`);
}
console.log(`\n**${passed === results.length ? 'PASS' : 'FAIL'}: ${passed} of ${results.length} scenarios passed.**`);
process.exit(passed === results.length ? 0 : 1);
