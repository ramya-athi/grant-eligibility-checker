// Eligibility rules for the Green Home Grant (spec.md §7).
// Pure function: uses only its argument and returns a result. No React, DOM or storage.

const OWNER = ['own', 'own-jointly'];
const ELIGIBLE_PROPERTY = ['detached', 'semi-detached', 'terraced', 'bungalow'];
const INELIGIBLE_PROPERTY = ['flat', 'studio'];
const GAS_OR_ELECTRIC = ['gas', 'electric'];

const VALID_VALUES = {
  propertyType: [...ELIGIBLE_PROPERTY, ...INELIGIBLE_PROPERTY],
  ownership: [...OWNER, 'rent', 'social-housing'],
  incomeBand: ['under-20k', '20k-to-39k', '40k-to-59k', '60k-or-more'],
  insulation: ['yes', 'no'],
  heating: [...GAS_OR_ELECTRIC, 'oil', 'biofuel', 'heat-pump', 'solar', 'other'],
};

export const REASONS = {
  // Not eligible
  INCOME_TOO_HIGH:
    'Your household income is £60,000 or more, which is above the limit for this grant.',
  PROPERTY_NOT_ELIGIBLE:
    'The grant is only available for houses and bungalows, not flats or studio flats.',
  NOTHING_TO_FUND:
    'Your home already has insulation and is not heated by gas or electricity, so there is nothing the grant can pay for.',
  // Partially eligible
  NEEDS_LANDLORD_PERMISSION:
    'You can apply only with written permission from your landlord or housing association.',
  REDUCED_GRANT_INCOME:
    'Because your household income is between £40,000 and £59,999, you can apply for a reduced grant.',
  HEAT_PUMP_ONLY: 'Your home is already insulated, so you can apply for a heat pump only.',
  INSULATION_ONLY:
    'Your home is not heated by gas or electricity, so you can apply for insulation only.',
  // Eligible
  ELIGIBLE: 'You can apply for help with the cost of both insulation and a heat pump.',
};

const reason = (code) => ({ code, message: REASONS[code] });

/**
 * @param {{ propertyType: string, ownership: string, incomeBand: string,
 *           insulation: string, heating: string, heatingOther?: string }} answers
 * @returns {{ status: 'eligible' | 'partial' | 'not-eligible',
 *             reasons: { code: string, message: string }[] }}
 * @throws {Error} if any answer is missing or not a known value
 */
export function checkEligibility(answers) {
  for (const [field, allowed] of Object.entries(VALID_VALUES)) {
    if (!allowed.includes(answers?.[field])) {
      throw new Error(`checkEligibility: missing or unknown answer for "${field}"`);
    }
  }

  const { propertyType, ownership, incomeBand, insulation, heating } = answers;
  const gasOrElectric = GAS_OR_ELECTRIC.includes(heating);

  // Step 1: not eligible (list every rule that matches)
  const notEligible = [];
  if (incomeBand === '60k-or-more') notEligible.push(reason('INCOME_TOO_HIGH'));
  if (INELIGIBLE_PROPERTY.includes(propertyType)) notEligible.push(reason('PROPERTY_NOT_ELIGIBLE'));
  if (insulation === 'yes' && !gasOrElectric) notEligible.push(reason('NOTHING_TO_FUND'));
  if (notEligible.length > 0) return { status: 'not-eligible', reasons: notEligible };

  // Step 2: partially eligible (list every rule that matches, in table order)
  const partial = [];
  if (!OWNER.includes(ownership)) partial.push(reason('NEEDS_LANDLORD_PERMISSION'));
  if (incomeBand === '40k-to-59k') partial.push(reason('REDUCED_GRANT_INCOME'));
  if (insulation === 'yes' && gasOrElectric) partial.push(reason('HEAT_PUMP_ONLY'));
  if (insulation === 'no' && !gasOrElectric) partial.push(reason('INSULATION_ONLY'));
  if (partial.length > 0) return { status: 'partial', reasons: partial };

  // Step 3: eligible (owner, under £40k, house or bungalow, no insulation, gas or electric)
  return { status: 'eligible', reasons: [reason('ELIGIBLE')] };
}
