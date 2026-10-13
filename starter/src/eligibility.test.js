import test from 'node:test';
import assert from 'node:assert/strict';
import { checkEligibility } from './eligibility.js';
import { QUESTIONS } from './questions.js';

const base = {
  ownership: 'own',
  income: 'under-20k',
  propertyType: 'detached',
  insulation: 'no',
  heating: 'gas',
};
const check = (changes) => checkEligibility({ ...base, ...changes });

test('renters and social housing tenants are never eligible', () => {
  for (const ownership of ['rent', 'social']) {
    assert.equal(check({ ownership }).outcome, 'not-eligible');
    assert.equal(check({ ownership, propertyType: 'flat', income: '20k-40k' }).outcome, 'not-eligible');
  }
});

test('income of £60,000 or more is never eligible', () => {
  assert.equal(check({ income: '60k-plus' }).outcome, 'not-eligible');
  assert.equal(check({ income: '60k-plus', propertyType: 'studio' }).outcome, 'not-eligible');
});

test('full eligibility: owner, income under £40,000, house, no insulation, gas or electric', () => {
  for (const ownership of ['own', 'own-joint'])
    for (const income of ['under-20k', '20k-40k'])
      for (const propertyType of ['detached', 'semi-detached', 'terraced', 'mid-terraced', 'bungalow'])
        for (const heating of ['gas', 'electric']) {
          const r = check({ ownership, income, propertyType, heating });
          assert.equal(r.outcome, 'eligible');
        }
});

test('income £40,000 to £59,999 with no insulation and gas or electric is a reduced grant', () => {
  const r = check({ income: '40k-60k' });
  assert.equal(r.outcome, 'partial');
  assert.match(r.reasons.join(' '), /reduced/);
});

test('insulation plus gas or electric is Heat Pump Support Only', () => {
  const r = check({ insulation: 'yes', heating: 'electric' });
  assert.equal(r.outcome, 'partial');
  assert.equal(r.support, 'Heat Pump Support Only');
});

test('no insulation plus other heating is Insulation Support Only', () => {
  for (const heating of ['oil', 'biofuel', 'heat-pump', 'solar', 'other']) {
    const r = check({ insulation: 'no', heating });
    assert.equal(r.outcome, 'partial');
    assert.equal(r.support, 'Insulation Support Only');
  }
});

test('flats and studios are always at least partially eligible for homeowners under £60,000', () => {
  for (const propertyType of ['flat', 'studio'])
    for (const income of ['under-20k', '20k-40k', '40k-60k'])
      for (const insulation of ['yes', 'no'])
        for (const heating of ['gas', 'oil', 'other']) {
          assert.equal(check({ propertyType, income, insulation, heating }).outcome, 'partial');
        }
});

test('every answer combination gives exactly one valid outcome', () => {
  const [housing, income, property, insulation, heating] = QUESTIONS.map((q) => q.options.map((o) => o.value));
  let count = 0;
  for (const ownership of housing)
    for (const inc of income)
      for (const propertyType of property)
        for (const ins of insulation)
          for (const heat of heating) {
            const r = checkEligibility({ ownership, income: inc, propertyType, insulation: ins, heating: heat });
            assert.ok(['eligible', 'partial', 'not-eligible'].includes(r.outcome));
            assert.ok(r.reasons.length > 0);
            assert.ok(typeof r.summary === 'string' && r.summary.length > 0);
            assert.equal(typeof r.amount, 'number');
            const isOwner = ownership === 'own' || ownership === 'own-joint';
            if (!isOwner || inc === '60k-plus') assert.equal(r.outcome, 'not-eligible');
            else assert.notEqual(r.outcome, 'not-eligible');
            count += 1;
          }
  assert.equal(count, 1568);
});
