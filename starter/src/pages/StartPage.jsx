import { Link, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';

function StartPage() {
  const navigate = useNavigate();
  usePageTitle('Check if you can get a Green Home Grant');

  return (
    <>
      <h1 className="govuk-heading-xl">Check if you can get a Green Home Grant</h1>
      <p className="govuk-body-l">
        Find out if you may be able to get money towards home insulation or a heat pump. You get an answer straight away, so there is no need to phone and wait.
      </p>

      <p className="govuk-body">Use this service to find out:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>if you are eligible, partially eligible or not eligible for the grant</li>
        <li>why you got that result</li>
        <li>the most you may be able to get</li>
        <li>what you can do next</li>
      </ul>

      <h2 className="govuk-heading-m">What the grant is for</h2>
      <p className="govuk-body">
        The Green Home Grant helps homeowners make their homes warmer and cheaper to heat. It can contribute to the cost of insulating your home or installing a heat pump.
      </p>

      <h2 className="govuk-heading-m">Who can get the grant</h2>
      <p className="govuk-body">
        You must own your home, on your own or with someone else. If you rent your home or live in social housing, you cannot get the grant. Your household income and the type of home you live in also affect what you can get.
      </p>

      <h2 className="govuk-heading-m">Before you start</h2>
      <p className="govuk-body">It takes less than 2 minutes. You will be asked 5 questions about:</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>your housing situation</li>
        <li>your annual household income, before tax, for everyone who lives in your home</li>
        <li>the type of property you live in</li>
        <li>whether your home has insulation, for example in the loft or walls</li>
        <li>how your home is mainly heated</li>
      </ul>
      <p className="govuk-body">
        You can go back and change an answer at any time before you see your result. Your answers are kept only while this browser tab is open, and they are not sent anywhere.
      </p>

      <div className="govuk-inset-text">
        <p className="govuk-body">
          The Green Home Grant is a fictional scheme and this service is a prototype. Results are an indication only. They are not real grant decisions, and you cannot make a real application.
        </p>
      </div>

      <GovukButton variant="start" onClick={() => navigate('/ownership')}>
        Start now
      </GovukButton>

      <h2 className="govuk-heading-m">If you need help</h2>
      <p className="govuk-body">
        Read our{' '}
        <Link className="govuk-link" to="/help">
          help page
        </Link>{' '}
        or{' '}
        <Link className="govuk-link" to="/contact">
          contact us
        </Link>
        . You can also read the{' '}
        <Link className="govuk-link" to="/accessibility-statement">
          accessibility statement
        </Link>
        .
      </p>
    </>
  );
}

export default StartPage;
