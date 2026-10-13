import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { QUESTIONS } from '../data/questions';
import { validateQuestion } from '../utils/validation';
import usePageTitle from './usePageTitle';

// Shared behaviour for every question page: local selection until Continue,
// validation, saving to App state and moving on (ST-02, VAL-01, NAV-04).
export default function useQuestionForm(questionId, answers, setAnswers) {
  const question = QUESTIONS[questionId];
  const { other } = question;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const changeMode = searchParams.get('change') === 'true';

  const [selected, setSelected] = useState(answers[questionId]);
  const [otherText, setOtherText] = useState(other ? answers[other.id] : '');
  const [errors, setErrors] = useState([]);

  usePageTitle(question.heading, errors.length > 0);

  function handleSubmit(event) {
    event.preventDefault();
    const found = validateQuestion(questionId, selected, otherText);
    setErrors(found);
    if (found.length > 0) return;

    setAnswers((previous) => {
      const next = { ...previous, [questionId]: selected };
      // Keep the "Other" text only while "Other" is the answer (ST-04, Q-03)
      if (other) next[other.id] = selected === other.value ? otherText.trim() : '';
      return next;
    });
    navigate(changeMode ? '/check-answers' : question.next);
  }

  const errorFor = (fieldId) => errors.find((error) => error.fieldId === fieldId)?.message;

  return { question, selected, setSelected, otherText, setOtherText, errors, errorFor, handleSubmit };
}
