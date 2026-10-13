import { useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { SERVICE_NAME, QUESTIONS } from '../data/questions';

function StartPage() {
  const navigate = useNavigate();
  usePageTitle(SERVICE_NAME);

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-xl">{SERVICE_NAME}</h1>
        <p className="govuk-body-l">
          Use this service to check if you can apply for a Green Home Grant to help pay for home insulation or a heat
          pump.
        </p>

        <h2 className="govuk-heading-m">Who can use this service</h2>
        <p className="govuk-body">You can use this service if you:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>live in the UK</li>
          <li>own your home, own it jointly, rent it privately or live in social housing</li>
        </ul>

        <h2 className="govuk-heading-m">Before you start</h2>
        <p className="govuk-body">
          You will be asked 5 questions about your home and your household income. It takes about 5 minutes.
        </p>
        <p className="govuk-body">We do not store your answers.</p>

        <GovukButton variant="start" onClick={() => navigate(QUESTIONS.propertyType.route)}>
          Start now
        </GovukButton>
      </div>
    </div>
  );
}

export default StartPage;
