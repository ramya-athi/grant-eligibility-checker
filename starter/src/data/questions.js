// Single source of truth for the five questions (spec.md §4).
// Pages, Check your answers, validation and the result page all read from here.

export const SERVICE_NAME = 'Check if you can get a Green Home Grant';

export const QUESTIONS = {
  propertyType: {
    id: 'propertyType',
    route: '/property-type',
    prev: '/',
    next: '/ownership',
    heading: 'What type of property do you live in?',
    hint: 'Choose the option that best describes the building you live in.',
    summaryKey: 'Property type',
    errorRequired: 'Select the type of property you live in',
    options: [
      { value: 'detached', label: 'Detached house' },
      { value: 'semi-detached', label: 'Semi-detached house' },
      { value: 'terraced', label: 'Terraced house (including mid-terraced)' },
      { value: 'bungalow', label: 'Bungalow' },
      { value: 'flat', label: 'Flat or apartment' },
      { value: 'studio', label: 'Studio flat' },
    ],
  },
  ownership: {
    id: 'ownership',
    route: '/ownership',
    prev: '/property-type',
    next: '/income',
    heading: 'What best describes your housing situation?',
    hint: 'This helps us check whether you can make changes to your home. Social housing means you rent from a council or housing association.',
    summaryKey: 'Housing situation',
    errorRequired: 'Select what best describes your housing situation',
    options: [
      { value: 'own', label: 'I own my home' },
      { value: 'own-jointly', label: 'I own my home with someone else' },
      { value: 'rent', label: 'I rent my home' },
      { value: 'social-housing', label: 'I live in social housing' },
    ],
  },
  incomeBand: {
    id: 'incomeBand',
    route: '/income',
    prev: '/ownership',
    next: '/insulation',
    heading: 'What is your annual household income?',
    hint: 'This is the total yearly income of everyone who lives in your home, before tax. Include wages, benefits and pensions.',
    summaryKey: 'Annual household income',
    errorRequired: 'Select your annual household income',
    options: [
      { value: 'under-20k', label: 'Less than £20,000' },
      { value: '20k-to-39k', label: '£20,000 to £39,999' },
      { value: '40k-to-59k', label: '£40,000 to £59,999' },
      { value: '60k-or-more', label: '£60,000 or more' },
    ],
  },
  insulation: {
    id: 'insulation',
    route: '/insulation',
    prev: '/income',
    next: '/heating',
    heading: 'Does your home currently have insulation?',
    hint: 'This includes loft, wall or floor insulation. If you are not sure, choose No.',
    summaryKey: 'Insulation',
    errorRequired: 'Select yes if your home currently has insulation',
    inline: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  heating: {
    id: 'heating',
    route: '/heating',
    prev: '/insulation',
    next: '/check-answers',
    heading: 'What is the main way your home is heated?',
    hint: 'Choose the system that heats most of your home.',
    summaryKey: 'Main heating',
    errorRequired: 'Select the main way your home is heated',
    options: [
      { value: 'gas', label: 'Gas boiler' },
      { value: 'electric', label: 'Electric heating' },
      { value: 'oil', label: 'Oil heating' },
      { value: 'biofuel', label: 'Biofuel' },
      { value: 'heat-pump', label: 'Heat pump' },
      { value: 'solar', label: 'Solar energy' },
      { value: 'other', label: 'Other' },
    ],
    // Conditional text box revealed when "Other" is chosen
    other: {
      id: 'heatingOther',
      value: 'other',
      label: 'Tell us how your home is heated',
      maxLength: 100,
      errorRequired: 'Enter how your home is heated',
      errorTooLong: 'How your home is heated must be 100 characters or less',
    },
  },
};

export const QUESTION_ORDER = ['propertyType', 'ownership', 'incomeBand', 'insulation', 'heating'];

export const initialAnswers = {
  propertyType: '',
  ownership: '',
  incomeBand: '',
  insulation: '',
  heating: '',
  heatingOther: '',
};

export function labelFor(questionId, value) {
  return QUESTIONS[questionId].options.find((option) => option.value === value)?.label ?? '';
}

// True when every question has a valid answer (used by the route guard, NAV-05)
export function isComplete(answers) {
  const allAnswered = QUESTION_ORDER.every((id) => labelFor(id, answers[id]) !== '');
  const otherAnswered = answers.heating !== 'other' || answers.heatingOther.trim() !== '';
  return allAnswered && otherAnswered;
}
