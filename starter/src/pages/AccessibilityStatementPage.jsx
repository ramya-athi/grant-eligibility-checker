import usePageTitle from '../hooks/usePageTitle';
import { SERVICE_NAME } from '../data/questions';

const CONTACT_EMAIL = 'greenhomegrant@example.gov.uk';

// Based on GOV.UK's sample accessibility statement (LAY-07).
// No <main> here – App renders the only <main> (LAY-04).
// Update "Known issues" and "How we tested" after each manual accessibility walkthrough.
export default function AccessibilityStatementPage() {
  usePageTitle('Accessibility statement');

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-two-thirds">
        <h1 className="govuk-heading-l">Accessibility statement for {SERVICE_NAME}</h1>
        <p className="govuk-body">
          This accessibility statement applies to the {SERVICE_NAME} service. This is a prototype of a fictional
          government scheme.
        </p>
        <p className="govuk-body">
          We want as many people as possible to be able to use this service. For example, that means you should be
          able to:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>change colours, contrast levels and fonts using browser or device settings</li>
          <li>zoom in up to 400% without the text spilling off the screen</li>
          <li>navigate the whole service using just a keyboard</li>
          <li>navigate the whole service using speech recognition software</li>
          <li>listen to the whole service using a screen reader</li>
        </ul>

        <h2 className="govuk-heading-m">How accessible this service is</h2>
        <p className="govuk-body">
          We built this service with GOV.UK Frontend components and checked it against the Web Content Accessibility
          Guidelines (WCAG) version 2.2 AA standard. We know some parts may not be fully accessible:
        </p>
        <ul className="govuk-list govuk-list--bullet">
          <li>we have not yet tested the service with a screen reader or with disabled users</li>
          <li>
            when the cookie banner is showing, it comes before the ‘Skip to main content’ link, so keyboard users
            tab through the banner first (this follows GOV.UK cookie banner guidance)
          </li>
        </ul>

        <h2 className="govuk-heading-m">Feedback and contact information</h2>
        <p className="govuk-body">
          If you need information in a different format, like accessible PDF, large print, easy read, audio recording
          or braille, email {CONTACT_EMAIL}. We’ll consider your request and get back to you in 5 working days.
        </p>

        <h2 className="govuk-heading-m">Reporting accessibility problems with this service</h2>
        <p className="govuk-body">
          We’re always looking to improve the accessibility of this service. If you find any problems not listed on
          this page or think we’re not meeting accessibility requirements, email {CONTACT_EMAIL}.
        </p>

        <h2 className="govuk-heading-m">Enforcement procedure</h2>
        <p className="govuk-body">
          The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies
          (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the ‘accessibility regulations’).
          If you’re not happy with how we respond to your complaint,{' '}
          <a href="https://www.equalityadvisoryservice.com/" className="govuk-link">
            contact the Equality Advisory and Support Service (EASS)
          </a>
          .
        </p>

        <h2 className="govuk-heading-m">Technical information about this service’s accessibility</h2>
        <p className="govuk-body">
          We are committed to making this service accessible, in accordance with the Public Sector Bodies (Websites and
          Mobile Applications) (No. 2) Accessibility Regulations 2018.
        </p>

        <h3 className="govuk-heading-s">Compliance status</h3>
        <p className="govuk-body">
          This service is partially compliant with the{' '}
          <a href="https://www.w3.org/TR/WCAG22/" className="govuk-link">
            Web Content Accessibility Guidelines version 2.2
          </a>{' '}
          AA standard, because testing is not yet complete. See ‘How we tested this service’.
        </p>

        <h3 className="govuk-heading-s">Non-accessible content</h3>
        <p className="govuk-body">
          On the heating question, the ‘Other’ option uses the <code>aria-expanded</code> attribute to tell screen
          readers that it shows a text box. This is how GOV.UK Frontend builds this component, but automated checkers
          report that radio buttons should not use this attribute (WCAG 4.1.2 Name, Role, Value). We will check how
          screen readers announce it.
        </p>

        <h2 className="govuk-heading-m">How we tested this service</h2>
        <p className="govuk-body">This service was last tested on 12 October 2026. We:</p>
        <ul className="govuk-list govuk-list--bullet">
          <li>ran automated checks (axe-core, including colour contrast) on every page in Chromium</li>
          <li>completed eligible, partially eligible and not eligible journeys using only the keyboard</li>
          <li>checked that every page reflows at 320 pixels wide without scrolling sideways</li>
          <li>checked that error messages move focus and link to the right question</li>
        </ul>
        <p className="govuk-body">We have not yet tested with a screen reader or with users with access needs.</p>

        <h2 className="govuk-heading-m">What we’re doing to improve accessibility</h2>
        <p className="govuk-body">
          We will test the service with a screen reader (NVDA, VoiceOver or Orca), and with disabled users before it
          moves from alpha to beta, and fix any issues we find.
        </p>

        <p className="govuk-body">
          This statement was prepared on 12 October 2026. It was last reviewed on 12 October 2026.
        </p>
      </div>
    </div>
  );
}
