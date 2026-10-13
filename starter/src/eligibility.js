// Eligibility rules for the (fictional) Green Home Grant. See intent.md.
// Grant amounts are placeholders and are kept together here so they are easy to replace.
export const PLACEHOLDER_AMOUNTS = {
  eligible: 10000,
  'partial-income': 5000,
  'partial-heat-pump': 6000,
  'partial-insulation': 4000,
  'partial-flat': 3000,
  'partial-other': 2000,
  'not-eligible': 0,
};

const HOUSES = ['detached', 'semi-detached', 'terraced', 'mid-terraced', 'bungalow'];
const GAS_OR_ELECTRIC = ['gas', 'electric'];

function result(outcome, key, support, reasons) {
  return { outcome, support, reasons, amount: PLACEHOLDER_AMOUNTS[key] };
}

// answers: { ownership, income, propertyType, insulation, heating }
// Returns: { outcome: 'eligible' | 'partial' | 'not-eligible', support, reasons, amount }
export function checkEligibility(answers) {
  const { ownership, income, propertyType, insulation, heating } = answers;
  const isOwner = ownership === 'own' || ownership === 'own-joint';
  const gasOrElectric = GAS_OR_ELECTRIC.includes(heating);
  const reasons = [];

  if (!isOwner) {
    return result('not-eligible', 'not-eligible', 'No grant', [
      'You said you rent your home or live in social housing. Only homeowners can get the grant.',
    ]);
  }
  if (income === '60k-plus') {
    return result('not-eligible', 'not-eligible', 'No grant', [
      'Your household income is £60,000 or more, which is above the limit for the grant.',
    ]);
  }

  reasons.push('You own your home.');
  const incomeBand40to60 = income === '40k-60k';
  const incomeReason = incomeBand40to60
    ? 'Your household income is £40,000 to £59,999, so the grant is reduced.'
    : 'Your household income is under £40,000.';

  if (propertyType === 'flat' || propertyType === 'studio') {
    reasons.push(incomeReason);
    reasons.push(
      'You live in a flat or studio flat. These often have fewer improvement options than houses, so you can get reduced support.'
    );
    return result('partial', 'partial-flat', 'Reduced support', reasons);
  }

  if (!HOUSES.includes(propertyType)) {
    throw new Error(`Unknown property type: ${propertyType}`);
  }

  reasons.push(incomeReason);
  reasons.push('You live in a house or bungalow.');

  if (insulation === 'no' && gasOrElectric && !incomeBand40to60) {
    reasons.push('Your home has no insulation.');
    reasons.push('Your main heating is gas or electric.');
    return result('eligible', 'eligible', 'Full grant', reasons);
  }

  if (insulation === 'yes' && gasOrElectric) {
    reasons.push('Your home already has insulation.');
    reasons.push('Your main heating is gas or electric, so you can get help to fit a heat pump.');
    return result('partial', 'partial-heat-pump', 'Heat Pump Support Only', reasons);
  }

  if (insulation === 'no' && !gasOrElectric) {
    reasons.push('Your home has no insulation.');
    reasons.push('Your main heating is not gas or electric, so you can get help with insulation only.');
    return result('partial', 'partial-insulation', 'Insulation Support Only', reasons);
  }

  if (insulation === 'no' && gasOrElectric && incomeBand40to60) {
    reasons.push('Your home has no insulation.');
    reasons.push('Your main heating is gas or electric.');
    return result('partial', 'partial-income', 'Reduced grant (income)', reasons);
  }

  // Homeowner under £60,000 with insulation and heating that is not gas or electric:
  // not covered by a named scenario, so they still get reduced support.
  reasons.push('Your home already has insulation.');
  reasons.push('Your main heating is not gas or electric.');
  return result('partial', 'partial-other', 'Reduced support', reasons);
}
