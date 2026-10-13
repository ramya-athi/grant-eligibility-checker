import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { QUESTIONS, displayAnswer, firstMissingPath } from '../questions';

function CheckAnswersPage({ answers }) {
  const navigate = useNavigate();
  usePageTitle('Check your answers');

  const missing = firstMissingPath(answers);
  if (missing) return <Navigate to="/ownership" replace />;

  return (
    <>
      <Link to="/heating" className="govuk-back-link">
        Back
      </Link>
      <h1 className="govuk-heading-l">Check your answers</h1>
      <dl className="govuk-summary-list">
        {QUESTIONS.map((question) => (
          <div className="govuk-summary-list__row" key={question.field}>
            <dt className="govuk-summary-list__key">{question.summaryKey}</dt>
            <dd className="govuk-summary-list__value">{displayAnswer(question, answers)}</dd>
            <dd className="govuk-summary-list__actions">
              <Link className="govuk-link" to={`${question.path}?change=1`}>
                Change<span className="govuk-visually-hidden"> {question.summaryKey.toLowerCase()}</span>
              </Link>
            </dd>
          </div>
        ))}
      </dl>
      <GovukButton onClick={() => navigate('/result')}>Submit</GovukButton>
    </>
  );
}

export default CheckAnswersPage;
