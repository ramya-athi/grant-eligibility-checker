// Test cases T1–T14 from spec.md §12.1. The expected results were decided by
// the team – do not change them to make a failing test pass; fix the code.
import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';

const answers = (propertyType, ownership, incomeBand, insulation, heating, heatingOther = '') => ({
  propertyType,
  ownership,
  incomeBand,
  insulation,
  heating,
  heatingOther,
});

const codes = (result) => result.reasons.map((r) => r.code);

describe('checkEligibility', () => {
  it('T1: fully eligible – owner, under £20k, detached, no insulation, gas', () => {
    const result = checkEligibility(answers('detached', 'own', 'under-20k', 'no', 'gas'));
    expect(result.status).toBe('eligible');
    expect(codes(result)).toEqual(['ELIGIBLE']);
  });

  it('T2: joint owner at the top of the eligible income band is eligible', () => {
    const result = checkEligibility(answers('bungalow', 'own-jointly', '20k-to-39k', 'no', 'electric'));
    expect(result.status).toBe('eligible');
    expect(codes(result)).toEqual(['ELIGIBLE']);
  });

  it('T3: income boundary – £40,000 to £59,999 is partially eligible (reduced grant)', () => {
    const result = checkEligibility(answers('terraced', 'own', '40k-to-59k', 'no', 'gas'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['REDUCED_GRANT_INCOME']);
  });

  it('T4: income boundary – £60,000 or more is not eligible', () => {
    const result = checkEligibility(answers('detached', 'own', '60k-or-more', 'no', 'gas'));
    expect(result.status).toBe('not-eligible');
    expect(codes(result)).toEqual(['INCOME_TOO_HIGH']);
  });

  it('T5: renter is partially eligible with landlord permission', () => {
    const result = checkEligibility(answers('semi-detached', 'rent', 'under-20k', 'no', 'gas'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['NEEDS_LANDLORD_PERMISSION']);
  });

  it('T6: social housing tenant is partially eligible with permission', () => {
    const result = checkEligibility(answers('terraced', 'social-housing', '20k-to-39k', 'no', 'electric'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['NEEDS_LANDLORD_PERMISSION']);
  });

  it('T7: flat is not eligible', () => {
    const result = checkEligibility(answers('flat', 'own', 'under-20k', 'no', 'gas'));
    expect(result.status).toBe('not-eligible');
    expect(codes(result)).toEqual(['PROPERTY_NOT_ELIGIBLE']);
  });

  it('T8: studio flat is not eligible', () => {
    const result = checkEligibility(answers('studio', 'own', 'under-20k', 'no', 'gas'));
    expect(result.status).toBe('not-eligible');
    expect(codes(result)).toEqual(['PROPERTY_NOT_ELIGIBLE']);
  });

  it('T9: insulated home with gas heating can get a heat pump only', () => {
    const result = checkEligibility(answers('detached', 'own', 'under-20k', 'yes', 'gas'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['HEAT_PUMP_ONLY']);
  });

  it('T10: uninsulated home with "Other" heating can get insulation only', () => {
    const result = checkEligibility(answers('detached', 'own', 'under-20k', 'no', 'other', 'wood stove'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['INSULATION_ONLY']);
  });

  it('T11 (trickiest rule): insulated home with a heat pump has nothing to fund', () => {
    const result = checkEligibility(answers('detached', 'own', 'under-20k', 'yes', 'heat-pump'));
    expect(result.status).toBe('not-eligible');
    expect(codes(result)).toEqual(['NOTHING_TO_FUND']);
  });

  it('T12: lists every partial reason, in rule order', () => {
    const result = checkEligibility(answers('terraced', 'rent', '40k-to-59k', 'yes', 'electric'));
    expect(result.status).toBe('partial');
    expect(codes(result)).toEqual(['NEEDS_LANDLORD_PERMISSION', 'REDUCED_GRANT_INCOME', 'HEAT_PUMP_ONLY']);
  });

  it('T13: not-eligible reasons win and partial reasons are not included', () => {
    const result = checkEligibility(answers('flat', 'rent', '60k-or-more', 'no', 'oil'));
    expect(result.status).toBe('not-eligible');
    expect(codes(result)).toEqual(['INCOME_TOO_HIGH', 'PROPERTY_NOT_ELIGIBLE']);
  });

  it('T14: is pure – the same answers always give the same result', () => {
    const input = answers('terraced', 'rent', '40k-to-59k', 'yes', 'electric');
    const snapshot = { ...input };
    expect(checkEligibility(input)).toEqual(checkEligibility(input));
    expect(input).toEqual(snapshot);
  });

  it('every reason has a user-facing message', () => {
    const result = checkEligibility(answers('flat', 'rent', '60k-or-more', 'yes', 'oil'));
    result.reasons.forEach((r) => expect(r.message).toMatch(/\w+/));
  });

  it('throws if an answer is missing, so a blank journey never gets a result', () => {
    expect(() => checkEligibility(answers('detached', 'own', 'under-20k', '', 'gas'))).toThrow(/insulation/);
  });
});
