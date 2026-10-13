import { Fragment, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import GovukButton from './GovukButton';
import ErrorSummary from './ErrorSummary';
import usePageTitle from '../hooks/usePageTitle';
import { QUESTIONS } from '../questions';

// One question per page: back link, help text, radios, an inline required message, and Continue.
// When the page is opened from a Change link on the summary (?change=1), Continue returns to the summary.
export default function RadioQuestion({ index, answers, setAnswer }) {
  const question = QUESTIONS[index];
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const changing = params.get('change') === '1';

  const [selected, setSelected] = useState(answers[question.field] || '');
  const [otherText, setOtherText] = useState(answers.heatingOther || '');
  const [error, setError] = useState('');
  const [otherError, setOtherError] = useState('');

  usePageTitle(error || otherError ? `Error: ${question.heading}` : question.heading);

  const backTo = changing ? '/check-answers' : index === 0 ? '/' : QUESTIONS[index - 1].path;
  const nextTo = changing ? '/check-answers' : index === QUESTIONS.length - 1 ? '/check-answers' : QUESTIONS[index + 1].path;
  const hasOther = question.field === 'heating';
  const showOther = hasOther && selected === 'other';

  const hintId = `${question.field}-hint`;
  const errorId = `${question.field}-error`;
  const otherErrorId = `${question.field}-other-error`;

  function handleSubmit(event) {
    event.preventDefault();
    if (!selected) {
      setError(question.errorMessage);
      return;
    }
    if (showOther && !otherText.trim()) {
      setError('');
      setOtherError('Enter your main heating source');
      return;
    }
    const changes = { [question.field]: selected };
    if (hasOther) changes.heatingOther = selected === 'other' ? otherText.trim() : '';
    setAnswer(changes);
    navigate(nextTo);
  }

  const summaryErrors = [];
  if (error) summaryErrors.push({ target: `${question.field}-${question.options[0].value}`, text: error });
  if (otherError) summaryErrors.push({ target: 'heating-other-text', text: otherError });

  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <>
      <Link to={backTo} className="govuk-back-link">
        Back
      </Link>
      {summaryErrors.length > 0 && <ErrorSummary errors={summaryErrors} />}
      <form onSubmit={handleSubmit} noValidate>
        <div className={`govuk-form-group ${error ? 'govuk-form-group--error' : ''}`}>
          <fieldset className="govuk-fieldset" aria-describedby={describedBy}>
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
              <h1 className="govuk-fieldset__heading">{question.heading}</h1>
            </legend>
            <div id={hintId} className="govuk-hint">
              {question.hint}
            </div>
            {error && (
              <p id={errorId} className="govuk-error-message">
                <span className="govuk-visually-hidden">Error: </span>
                {error}
              </p>
            )}
            <div className="govuk-radios">
              {question.options.map((option) => {
                const inputId = `${question.field}-${option.value}`;
                return (
                  <Fragment key={option.value}>
                    <div className="govuk-radios__item">
                      <input
                        className="govuk-radios__input"
                        id={inputId}
                        name={question.field}
                        type="radio"
                        value={option.value}
                        checked={selected === option.value}
                        onChange={() => {
                          setSelected(option.value);
                          setError('');
                          setOtherError('');
                        }}
                      />
                      <label className="govuk-label govuk-radios__label" htmlFor={inputId}>
                        {option.label}
                      </label>
                    </div>
                    {hasOther && option.value === 'other' && showOther && (
                      <div className="govuk-radios__conditional">
                        <div className={`govuk-form-group ${otherError ? 'govuk-form-group--error' : ''}`}>
                          <label className="govuk-label" htmlFor="heating-other-text">
                            Tell us your main heating source
                          </label>
                          {otherError && (
                            <p id={otherErrorId} className="govuk-error-message">
                              <span className="govuk-visually-hidden">Error: </span>
                              {otherError}
                            </p>
                          )}
                          <input
                            className={`govuk-input govuk-!-width-two-thirds ${otherError ? 'govuk-input--error' : ''}`}
                            id="heating-other-text"
                            name="heatingOther"
                            type="text"
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            aria-describedby={otherError ? otherErrorId : undefined}
                          />
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </fieldset>
        </div>
        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}
