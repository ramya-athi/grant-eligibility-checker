import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_NAME } from '../data/questions';

// GOV.UK Frontend 6 cookie banner (LAY-06, spec.md §10.1).
// The choice is held in App state for this session only. No cookies are set.
export default function CookieBanner({ choice, onChoose, onHide }) {
  const confirmationRef = useRef(null);
  const confirmed = choice === 'accepted' || choice === 'rejected';

  useEffect(() => {
    if (confirmed) confirmationRef.current?.focus();
  }, [confirmed]);

  return (
    <div className="govuk-cookie-banner" data-nosnippet role="region" aria-label={`Cookies on ${SERVICE_NAME}`}>
      {confirmed ? (
        <div className="govuk-cookie-banner__message govuk-width-container" role="alert" tabIndex={-1} ref={confirmationRef}>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">
                  You’ve {choice} analytics cookies. You can <Link to="/cookies" className="govuk-link">change your cookie settings</Link> at any time.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" onClick={onHide}>
              Hide cookie message
            </button>
          </div>
        </div>
      ) : (
        <div className="govuk-cookie-banner__message govuk-width-container">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h2 className="govuk-cookie-banner__heading govuk-heading-m">Cookies on {SERVICE_NAME}</h2>
              <div className="govuk-cookie-banner__content">
                <p className="govuk-body">We use some essential cookies to make this service work.</p>
                <p className="govuk-body">
                  We’d also like to use analytics cookies so we can understand how you use the service and make
                  improvements.
                </p>
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button type="button" className="govuk-button" onClick={() => onChoose('accepted')}>
              Accept analytics cookies
            </button>
            <button type="button" className="govuk-button" onClick={() => onChoose('rejected')}>
              Reject analytics cookies
            </button>
            <Link to="/cookies" className="govuk-link">
              View cookies
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
