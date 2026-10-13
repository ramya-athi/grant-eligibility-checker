import { useEffect, useRef } from 'react';

// GOV.UK Frontend 6 error summary (VAL-02 to VAL-04).
// Receives focus when errors appear; each link moves focus to its field.
export default function ErrorSummary({ errors }) {
  const summaryRef = useRef(null);

  useEffect(() => {
    if (errors.length > 0) summaryRef.current?.focus();
  }, [errors]);

  if (errors.length === 0) return null;

  function focusField(event, fieldId) {
    event.preventDefault();
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.focus({ preventScroll: true });
    // Scroll the question (legend) into view so the user sees what the field is for
    const legend = field.closest('fieldset')?.querySelector('legend');
    (legend ?? field).scrollIntoView();
  }

  return (
    <div className="govuk-error-summary" tabIndex={-1} ref={summaryRef}>
      <div role="alert">
        <h2 className="govuk-error-summary__title">There is a problem</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {errors.map((error) => (
              <li key={error.fieldId}>
                <a href={`#${error.fieldId}`} onClick={(event) => focusField(event, error.fieldId)}>
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
