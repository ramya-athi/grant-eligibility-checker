import { Link } from 'react-router-dom';
import { GovukFooterCrown, GovukLicenceLogo } from './GovukLogos';

const FOOTER_LINKS = [
  { to: '/accessibility-statement', text: 'Accessibility statement' },
  { to: '/cookies', text: 'Cookies' },
  { to: '/privacy', text: 'Privacy' },
  { to: '/terms-and-conditions', text: 'Terms and conditions' },
  { to: '/help', text: 'Help' },
  { to: '/contact', text: 'Contact' },
];

// GOV.UK Frontend 6 footer with meta links (LAY-05)
export default function GovukFooter() {
  return (
    <footer className="govuk-template__footer">
      <div className="govuk-footer">
        <div className="govuk-width-container">
          <GovukFooterCrown />
          <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <h2 className="govuk-visually-hidden">Support links</h2>
              <ul className="govuk-footer__inline-list">
                {FOOTER_LINKS.map((link) => (
                  <li className="govuk-footer__inline-list-item" key={link.to}>
                    <Link className="govuk-footer__link" to={link.to}>
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
              <GovukLicenceLogo />
              <span className="govuk-footer__licence-description">
                All content is available under the{' '}
                <a
                  className="govuk-footer__link"
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  rel="license"
                >
                  Open Government Licence v3.0
                </a>
                , except where otherwise stated
              </span>
            </div>
            <div className="govuk-footer__meta-item">
              <a
                className="govuk-footer__link govuk-footer__copyright-logo"
                href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
              >
                © Crown copyright
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
