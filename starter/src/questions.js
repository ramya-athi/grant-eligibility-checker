// The five questions, in journey order. Wording and options come from intent.md.
// `field` is the key used for the answer; `path` is the page address.
export const QUESTIONS = [
  {
    field: 'ownership',
    errorMessage: 'Select what best describes your housing situation',
    path: '/ownership',
    summaryKey: 'Housing situation',
    heading: 'What best describes your housing situation?',
    hint: 'Choose the option that matches how you live in your home today. Only homeowners can get the grant.',
    options: [
      { value: 'own', label: 'I own my home' },
      { value: 'own-joint', label: 'I own my home with someone else' },
      { value: 'rent', label: 'I rent my home' },
      { value: 'social', label: 'I live in social housing' },
    ],
  },
  {
    field: 'income',
    errorMessage: 'Select your annual household income',
    path: '/income',
    summaryKey: 'Household income',
    heading: 'What is your annual household income?',
    hint: 'Add up the yearly income, before tax, of everyone who lives in your home.',
    options: [
      { value: 'under-20k', label: 'Less than £20,000' },
      { value: '20k-40k', label: '£20,000 to £39,999' },
      { value: '40k-60k', label: '£40,000 to £59,999' },
      { value: '60k-plus', label: '£60,000 or more' },
    ],
  },
  {
    field: 'propertyType',
    errorMessage: 'Select the type of property you live in',
    path: '/property-type',
    summaryKey: 'Property type',
    heading: 'What type of property do you live in?',
    hint: 'Choose the one that is closest to your home.',
    options: [
      { value: 'detached', label: 'Detached house' },
      { value: 'semi-detached', label: 'Semi-detached house' },
      { value: 'terraced', label: 'Terraced house' },
      { value: 'mid-terraced', label: 'Mid-terraced house' },
      { value: 'bungalow', label: 'Bungalow' },
      { value: 'flat', label: 'Flat or apartment' },
      { value: 'studio', label: 'Studio flat' },
    ],
  },
  {
    field: 'insulation',
    errorMessage: 'Select yes if your home currently has insulation',
    path: '/insulation',
    summaryKey: 'Insulation',
    heading: 'Does your home currently have insulation?',
    hint: 'For example, insulation in your loft or in your walls.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    field: 'heating',
    errorMessage: 'Select your main heating source',
    path: '/heating',
    summaryKey: 'Main heating source',
    heading: 'What is the main way your home is heated?',
    hint: 'Choose the one you use most. If yours is not listed, choose Other and tell us what it is.',
    options: [
      { value: 'gas', label: 'Gas boiler' },
      { value: 'electric', label: 'Electric heating' },
      { value: 'oil', label: 'Oil heating' },
      { value: 'biofuel', label: 'Biofuel' },
      { value: 'heat-pump', label: 'Heat pump' },
      { value: 'solar', label: 'Solar energy' },
      { value: 'other', label: 'Other' },
    ],
  },
];

export function optionLabel(field, value) {
  const question = QUESTIONS.find((q) => q.field === field);
  const option = question && question.options.find((o) => o.value === value);
  return option ? option.label : '';
}

// Returns the address of the first question with no usable answer, or null when every answer is present.
export function firstMissingPath(answers) {
  for (const question of QUESTIONS) {
    const value = answers[question.field];
    const valid = question.options.some((o) => o.value === value);
    if (!valid) return question.path;
  }
  if (answers.heating === 'other' && !(answers.heatingOther || '').trim()) return '/heating';
  return null;
}

// What to show on the summary page for a question's answer.
export function displayAnswer(question, answers) {
  const label = optionLabel(question.field, answers[question.field]);
  if (question.field === 'heating' && answers.heating === 'other') {
    return `Other: ${answers.heatingOther}`;
  }
  return label;
}
