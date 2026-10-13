import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'green-home-grant-answers';

function load() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// Holds the user's answers in state and mirrors them to session storage,
// so they survive Back links, reloads and moving around the journey.
export default function useAnswers() {
  const [answers, setAnswers] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Storage can be unavailable (for example in private browsing); the app still works in memory.
    }
  }, [answers]);

  const setAnswer = useCallback((changes) => {
    setAnswers((current) => ({ ...current, ...changes }));
  }, []);

  const resetAnswers = useCallback(() => setAnswers({}), []);

  return { answers, setAnswer, resetAnswers };
}
