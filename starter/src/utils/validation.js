// Validation for a single question page (spec.md §5).
// Pure function: returns a list of { fieldId, message } – empty when the answer is valid.
import { QUESTIONS } from '../data/questions';

export function validateQuestion(questionId, selected, otherText = '') {
  const question = QUESTIONS[questionId];
  const isKnownOption = question.options.some((option) => option.value === selected);

  if (!isKnownOption) {
    return [{ fieldId: question.id, message: question.errorRequired }];
  }

  const { other } = question;
  if (other && selected === other.value) {
    const text = otherText.trim();
    if (text === '') return [{ fieldId: other.id, message: other.errorRequired }];
    if (text.length > other.maxLength) return [{ fieldId: other.id, message: other.errorTooLong }];
  }

  return [];
}
