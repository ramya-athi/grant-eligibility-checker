import { Link } from 'react-router-dom';
import { GovukLogotype } from './GovukLogos';
import { SERVICE_NAME } from '../data/questions';

// GOV.UK Frontend 6 header + service navigation (LAY-01).
// Rendered inside <header className="govuk-template__header"> in App.
function GovukHeader() {
  return (
    <>
      <div className="govuk-header">
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <a href="https://www.gov.uk" className="govuk-header__homepage-link">
              <GovukLogotype />
            </a>
          </div>
        </div>
      </div>
      <section aria-label="Service information" className="govuk-service-navigation">
        <div className="govuk-width-container">
          <div className="govuk-service-navigation__container">
            <span className="govuk-service-navigation__service-name">
              <Link to="/" className="govuk-service-navigation__link">
                {SERVICE_NAME}
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

export default GovukHeader;
