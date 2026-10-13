import { useEffect, useRef } from 'react';

// GOV.UK error summary: shown at the top of the page, takes focus when it appears,
// and each link moves focus to the field with the problem.
export default function ErrorSummary({ errors }) {
  const ref = useRef(null);

  // Only move focus when the set of messages changes, not on every keystroke elsewhere on the page.
  const messages = errors.map((error) => error.text).join('|');
  useEffect(() => {
    if (ref.current) ref.current.focus();
  }, [messages]);

  function goTo(event, target) {
    event.preventDefault();
    const field = document.getElementById(target);
    if (field) field.focus();
  }

  return (
    <div className="govuk-error-summary" ref={ref} tabIndex={-1}>
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map((error) => (
              <li key={error.target}>
                <a href={`#${error.target}`} onClick={(event) => goTo(event, error.target)}>
                  {error.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
