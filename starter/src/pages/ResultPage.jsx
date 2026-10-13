import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { checkEligibility } from '../eligibility';
import { firstMissingPath } from '../questions';

const HEADINGS = {
  eligible: 'Eligible',
  partial: 'Partially Eligible',
  'not-eligible': 'Not Eligible',
};

const PANEL_CLASS = {
  eligible: '',
  partial: 'govuk-panel--partial',
  'not-eligible': 'govuk-panel--not-eligible',
};

function ResultPage({ answers, resetAnswers }) {
  const navigate = useNavigate();
  const missing = firstMissingPath(answers);
  const result = missing ? null : checkEligibility(answers);
  usePageTitle(result ? HEADINGS[result.outcome] : 'Result');

  if (missing) return <Navigate to="/ownership" replace />;

  const amount = `£${result.amount.toLocaleString('en-GB')}`;
  const canApply = result.outcome !== 'not-eligible';

  function startAgain() {
    resetAnswers();
    navigate('/');
  }

  return (
    <>
      <div className={`govuk-panel ${PANEL_CLASS[result.outcome]}`}>
        <h1 className="govuk-panel__title">{HEADINGS[result.outcome]}</h1>
        <div className="govuk-panel__body">{result.support}</div>
      </div>

      <h2 className="govuk-heading-m">Why you got this result</h2>
      <ul className="govuk-list govuk-list--bullet">
        {result.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <h2 className="govuk-heading-m">Maximum grant you may get</h2>
      <p className="govuk-body">
        <strong>{amount}</strong> (indicative). This is a placeholder figure. The real amount will depend on the scheme rules.
      </p>

      <h2 className="govuk-heading-m">What you can do next</h2>
      {canApply ? (
        <p className="govuk-body">
          <Link className="govuk-link" to="/apply">
            Go to the Green Home Grant application service
          </Link>{' '}
          (a fictional service for this prototype).
        </p>
      ) : (
        <>
          <p className="govuk-body">You cannot get a Green Home Grant based on your answers. You can:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>
              read our{' '}
              <Link className="govuk-link" to="/help">
                help page
              </Link>
            </li>
            <li>
              <Link className="govuk-link" to="/contact">
                contact us
              </Link>{' '}
              if you think your answers were wrong or your situation changes
            </li>
          </ul>
        </>
      )}

      <p className="govuk-body">
        <Link className="govuk-link" to="/check-answers">
          Change your answers
        </Link>
      </p>
      <GovukButton onClick={startAgain}>Start again</GovukButton>
    </>
  );
}

export default ResultPage;
