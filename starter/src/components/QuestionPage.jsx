import BackLink from './BackLink';
import ErrorSummary from './ErrorSummary';
import ErrorMessage from './ErrorMessage';
import GovukButton from './GovukButton';
import RadioQuestion from './RadioQuestion';
import useQuestionForm from '../hooks/useQuestionForm';

// One question per page using the GOV.UK question page pattern (spec.md §3).
// Each page file (PropertyTypePage etc.) renders this with its question id.
export default function QuestionPage({ questionId, answers, setAnswers }) {
  const form = useQuestionForm(questionId, answers, setAnswers);
  const { question, selected, setSelected, otherText, setOtherText, errors, errorFor, handleSubmit } = form;
  const { other } = question;

  let conditional;
  if (other) {
    const otherError = errorFor(other.id);
    const otherErrorId = `${other.id}-error`;
    conditional = {
      value: other.value,
      content: (
        <div className={`govuk-form-group${otherError ? ' govuk-form-group--error' : ''}`}>
          <label className="govuk-label" htmlFor={other.id}>
            {other.label}
          </label>
          {otherError && <ErrorMessage id={otherErrorId}>{otherError}</ErrorMessage>}
          <input
            className={`govuk-input govuk-!-width-two-thirds${otherError ? ' govuk-input--error' : ''}`}
            id={other.id}
            name={other.id}
            type="text"
            spellCheck="true"
            value={otherText}
            onChange={(event) => setOtherText(event.target.value)}
            aria-describedby={otherError ? otherErrorId : undefined}
          />
        </div>
      ),
    };
  }

  return (
    <>
      <BackLink to={question.prev} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ErrorSummary errors={errors} />
          <form noValidate onSubmit={handleSubmit}>
            <RadioQuestion
              question={question}
              value={selected}
              onChange={setSelected}
              error={errorFor(question.id)}
              conditional={conditional}
            />
            <GovukButton type="submit">Continue</GovukButton>
          </form>
        </div>
      </div>
    </>
  );
}
