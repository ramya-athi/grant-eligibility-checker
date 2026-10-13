import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { checkEligibility } from '../eligibility';
import { firstMissingPath } from '../questions';

const HEADINGS = {
  eligible: 'You may be eligible',
  partial: 'You may be partially eligible',
  'not-eligible': 'You are not eligible',
};

// The line above the support name in the panel: what the user may be eligible for.
const PANEL_LABEL = {
  eligible: 'You may be eligible for',
  partial: 'You may be eligible for',
  'not-eligible': 'Your support',
};

function ResultPage({ answers, resetAnswers }) {
  const navigate = useNavigate();
  const missing = firstMissingPath(answers);
  const result = missing ? null : checkEligibility(answers);
  usePageTitle(result ? HEADINGS[result.outcome] : 'Result');

  if (missing) return <Navigate to="/ownership" replace />;

  const amount = `£${result.amount.toLocaleString('en-GB')}`;
  const canApply = result.outcome !== 'not-eligible';

  function printPage(event) {
    event.preventDefault();
    window.print();
  }

  function startAgain() {
    resetAnswers();
    navigate('/');
  }

  return (
    <>
      <div className="govuk-panel govuk-panel--confirmation">
        <h1 className="govuk-panel__title">{HEADINGS[result.outcome]}</h1>
        <div className="govuk-panel__body">
          {PANEL_LABEL[result.outcome]}
          <br />
          <strong>{result.support}</strong>
        </div>
      </div>

      <p className="govuk-body-l">{result.summary}</p>

      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">
          !
        </span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          This is an indication only, not a decision. Any application would be checked.
        </strong>
      </div>

      <h2 className="govuk-heading-m">Why you got this result</h2>
      <ul className="govuk-list govuk-list--bullet">
        {result.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <h2 className="govuk-heading-m">The most you may get</h2>
      <p className="govuk-body-l govuk-!-margin-bottom-2">
        <strong>{amount}</strong>
      </p>
      <p className="govuk-hint">
        This is an indicative figure for this prototype. The real amount will depend on the scheme rules.
      </p>

      <h2 className="govuk-heading-m">What you can do next</h2>
      {canApply ? (
        <ol className="govuk-list govuk-list--number">
          <li>
            <Link className="govuk-link" to="/apply">
              Go to the Green Home Grant application service
            </Link>{' '}
            to start an application. This is a fictional service for the prototype.
          </li>
          <li>
            Print this page, using the link below, to keep a record of your result and the reasons for it.
          </li>
          <li>
            If any answer is wrong,{' '}
            <Link className="govuk-link" to="/check-answers">
              change your answers
            </Link>{' '}
            and check again. Your result may change.
          </li>
        </ol>
      ) : (
        <ol className="govuk-list govuk-list--number">
          <li>
            If any answer is wrong,{' '}
            <Link className="govuk-link" to="/check-answers">
              change your answers
            </Link>{' '}
            and check again. Your result may change.
          </li>
          <li>
            Read the{' '}
            <Link className="govuk-link" to="/help">
              help page
            </Link>{' '}
            to find out how the checker works.
          </li>
          <li>
            <Link className="govuk-link" to="/contact">
              Contact us
            </Link>{' '}
            if your situation changes or you need support.
          </li>
        </ol>
      )}

      <p className="govuk-body govuk-!-display-none-print">
        <a className="govuk-link" href="#print" onClick={printPage}>
          Print this page
        </a>
      </p>
      <div className="govuk-!-display-none-print">
        <GovukButton onClick={startAgain}>Start again</GovukButton>
      </div>
    </>
  );
}

export default ResultPage;
