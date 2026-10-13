import { useState } from 'react';
import { Link } from 'react-router-dom';

const COOKIE_KEY = 'green-home-grant-cookie-choice';

function hasChosen() {
  try {
    return Boolean(localStorage.getItem(COOKIE_KEY));
  } catch {
    return false;
  }
}

// No analytics are used, so the choice only hides the banner and is remembered in the browser.
export default function CookieBanner() {
  const [chosen, setChosen] = useState(hasChosen);

  if (chosen) return null;

  function choose(value) {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      // Remembering the choice is optional.
    }
    setChosen(true);
  }

  return (
    <div className="govuk-cookie-banner" data-nosnippet role="region" aria-label="Cookies on Green Home Grant">
      <div className="govuk-cookie-banner__message govuk-width-container">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h2 className="govuk-cookie-banner__heading govuk-heading-m">Cookies on Green Home Grant</h2>
            <div className="govuk-cookie-banner__content">
              <p className="govuk-body">
                We use a small number of essential cookies to make this service work. We do not use analytics cookies.
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
            View cookies
          </Link>
        </div>
      </div>
    </div>
  );
}
