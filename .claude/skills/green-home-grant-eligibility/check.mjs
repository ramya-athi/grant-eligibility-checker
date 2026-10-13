// Prints the eligibility result for answers given as a JSON string.
// Usage: node check.mjs '{"ownership":"own","income":"20k-40k","propertyType":"detached","insulation":"no","heating":"gas"}'
import { checkEligibility } from '../../../starter/src/eligibility.js';
import { QUESTIONS, firstMissingPath } from '../../../starter/src/questions.js';

let answers;
try {
  answers = JSON.parse(process.argv[2] || '');
} catch {
  console.error('Pass the answers as a JSON string.');
  process.exit(1);
}

for (const question of QUESTIONS) {
  const allowed = question.options.map((o) => o.value);
  if (!allowed.includes(answers[question.field])) {
    console.error(`"${question.field}" must be one of: ${allowed.join(', ')}`);
    process.exit(1);
  }
}
if (answers.heating === 'other' && !answers.heatingOther) answers.heatingOther = 'not given';
if (firstMissingPath(answers)) {
  console.error('Some answers are missing.');
  process.exit(1);
}

const result = checkEligibility(answers);
console.log(`Outcome: ${result.outcome}`);
console.log(`Support: ${result.support}`);
console.log(`Indicative amount (placeholder): £${result.amount.toLocaleString('en-GB')}`);
console.log('Reasons:');
for (const reason of result.reasons) console.log(`- ${reason}`);
