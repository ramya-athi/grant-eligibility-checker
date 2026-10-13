import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'green-home-grant-answers';
const REFERENCE_KEY = 'green-home-grant-reference';

function load(key, fallback) {
  try {
    return JSON.parse(sessionStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (for example in private browsing); the app still works in memory.
  }
}

// Holds the user's answers and the reference number of their submitted check in state, and mirrors
// both to session storage, so they survive Back links, reloads and moving around the journey.
export default function useAnswers() {
  const [answers, setAnswers] = useState(() => load(STORAGE_KEY, {}));
  const [reference, setReference] = useState(() => load(REFERENCE_KEY, ''));

  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => store(STORAGE_KEY, answers), [answers]);
  useEffect(() => store(REFERENCE_KEY, reference), [reference]);

  // Changing any answer means the submitted check no longer matches, so its reference is cleared
  // and the user must submit again to get a new one (spec.md requirements 56 and 57).
  // Continuing through a Change link without changing anything keeps the reference.
  const setAnswer = useCallback((changes) => {
    const changed = Object.entries(changes).some(([field, value]) => answersRef.current[field] !== value);
    if (!changed) return;
    setAnswers((current) => ({ ...current, ...changes }));
    setReference('');
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers({});
    setReference('');
  }, []);

  return { answers, setAnswer, resetAnswers, reference, setReference };
}
