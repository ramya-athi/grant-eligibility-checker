import { Fragment } from 'react';
import ErrorMessage from './ErrorMessage';

// GOV.UK Frontend 6 radios with the legend as the page heading (QP-02 to QP-04, QP-07).
// `conditional` = { value, content } reveals content under that option when it is selected (Q-02).
export default function RadioQuestion({ question, value, onChange, error, conditional }) {
  const { id, heading, hint, options, inline } = question;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
      <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
          <h1 className="govuk-fieldset__heading">{heading}</h1>
        </legend>
        <div id={hintId} className="govuk-hint">
          {hint}
        </div>
        {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
        <div className={`govuk-radios${inline ? ' govuk-radios--inline' : ''}`}>
          {options.map((option, index) => {
            const inputId = index === 0 ? id : `${id}-${index + 1}`;
            const checked = value === option.value;
            const hasConditional = conditional?.value === option.value;
            const conditionalId = `conditional-${inputId}`;

            return (
              <Fragment key={option.value}>
                <div className="govuk-radios__item">
                  <input
                    className="govuk-radios__input"
                    id={inputId}
                    name={id}
                    type="radio"
                    value={option.value}
                    checked={checked}
                    onChange={() => onChange(option.value)}
                    aria-controls={hasConditional ? conditionalId : undefined}
                    aria-expanded={hasConditional ? checked : undefined}
                  />
                  <label className="govuk-label govuk-radios__label" htmlFor={inputId}>
                    {option.label}
                  </label>
                </div>
                {hasConditional && (
                  <div className="govuk-radios__conditional" id={conditionalId} hidden={!checked}>
                    {conditional.content}
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
