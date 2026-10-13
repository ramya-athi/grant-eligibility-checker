import { useState } from 'react';
import { Link } from 'react-router-dom';
import { readChoice, saveChoice } from '../cookieChoice';

// The service sets no cookies and has no analytics. The choice only hides this message, and is kept
// in the browser's storage for a year (see cookieChoice.js).
export default function CookieBanner() {
  const [chosen, setChosen] = useState(() => readChoice() !== null);

  if (chosen) return null;

  function choose(value) {
    saveChoice(value);
    setChosen(true);
  }

  return (
    <div className="govuk-cookie-banner govuk-!-display-none-print" data-nosnippet role="region" aria-label="Cookies on Green Home Grant">
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">Cookies on Green Home Grant</h2>
            <div className="govuk-cookie-banner__content">
              <p className="govuk-body">
                We do not set any cookies and we do not use analytics. We use your browser's storage to remember your
                answers while this tab is open, and to remember this choice for 1 year.
              </p>
              <p className="govuk-body">
                Choosing either button hides this message. It does not change how the service works.
              </p>
            </div>
          </div>
        </div>
        <div className="govuk-button-group">
          <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => choose('accepted')}>
            Accept cookies
          </button>
          <button type="button" className="govuk-button" data-module="govuk-button" onClick={() => choose('rejected')}>
            Reject cookies
          </button>
          <Link className="govuk-link" to="/cookies">
            View cookies and storage
          </Link>
        </div>
      </div>
    </div>
  );
}
