import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { checkEligibility } from '../utils/eligibility';
import { initialAnswers } from '../data/questions';

const OUTCOMES = {
  eligible: {
    panelClass: 'govuk-panel--confirmation',
    title: 'You can apply for a Green Home Grant',
    body: 'Insulation and heat pump',
  },
  partial: {
    panelClass: 'govuk-panel--confirmation',
    title: 'You can apply for part of the Green Home Grant',
    body: 'Check the conditions below',
  },
  'not-eligible': {
    panelClass: 'app-panel--not-eligible',
    title: 'You cannot apply for a Green Home Grant',
    body: 'Based on your answers',
  },
};

function NextSteps({ status }) {
  if (status === 'eligible') {
    return (
      <>
        <p className="govuk-body">You can now apply for the Green Home Grant. Applications are not part of this service.</p>
        <p className="govuk-body">When you apply, you will need:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>proof that you own your home</li>
          <li>proof of your household income</li>
        </ul>
      </>
    );
  }
  if (status === 'partial') {
    return (
      <>
        <p className="govuk-body">Read the conditions above before you apply.</p>
        <p className="govuk-body">
          If you rent your home, speak to your landlord or housing association before you apply.
        </p>
        <p className="govuk-body">When you apply, you will need proof of your household income.</p>
      </>
    );
  }
  return (
    <p className="govuk-body">
      You may be able to get other help to make your home more energy efficient. Contact your local council or{' '}
      <Link to="/help" className="govuk-link">
        visit the help page
      </Link>
      .
    </p>
  );
}

// Result – outcome worked out by checkEligibility(), no rules in this page (RES-01)
function ResultPage({ answers, setAnswers }) {
  const { status, reasons } = checkEligibility(answers);
  const outcome = OUTCOMES[status];
  usePageTitle(outcome.title);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <div className={`govuk-panel ${outcome.panelClass}`}>
          <h1 className="govuk-panel__title">{outcome.title}</h1>
          <div className="govuk-panel__body">{outcome.body}</div>
        </div>

        <h2 className="govuk-heading-m">Why you got this result</h2>
        <ul className="govuk-list govuk-list--bullet">
          {reasons.map((reason) => (
            <li key={reason.code}>{reason.message}</li>
          ))}
        </ul>

        <h2 className="govuk-heading-m">What happens next</h2>
        <NextSteps status={status} />

        <p className="govuk-body">
          <Link to="/" className="govuk-link" onClick={() => setAnswers(initialAnswers)}>
            Start again
          </Link>
        </p>

        <h2 className="govuk-heading-m">Help us improve this service</h2>
        <p className="govuk-body">
          <Link to="/feedback" className="govuk-link">
            What did you think of this service?
          </Link>{' '}
          (takes 30 seconds)
        </p>
      </div>
    </div>
  );
}

export default ResultPage;
