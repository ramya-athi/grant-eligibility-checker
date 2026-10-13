import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/accessibility-statement', label: 'Accessibility statement' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/cookies', label: 'Cookies' },
  { to: '/terms', label: 'Terms and conditions' },
  { to: '/help', label: 'Help' },
  { to: '/contact', label: 'Contact' },
];

export default function GovukFooter() {
  return (
    <footer className="govuk-footer govuk-!-display-none-print" role="contentinfo">
      <div className="govuk-width-container">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              {LINKS.map((link) => (
                <li className="govuk-footer__inline-list-item" key={link.to}>
                  <Link className="govuk-footer__link" to={link.to}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="govuk-body-s govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              This is a prototype for a fictional scheme. It does not make real grant decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
