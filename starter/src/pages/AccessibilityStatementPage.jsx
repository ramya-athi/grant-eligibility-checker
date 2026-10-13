import usePageTitle from '../hooks/usePageTitle';

export default function AccessibilityStatementPage() {
  usePageTitle('Accessibility statement');

  return (
    <>
      <h1 className="govuk-heading-l">Accessibility statement</h1>
      <p className="govuk-body">
        This statement applies to the Green Home Grant eligibility checker, a prototype for a fictional scheme. We want as many people as possible to be able to use it.
      </p>
      <h2 className="govuk-heading-m">How accessible this service is</h2>
      <p className="govuk-body">
        You can use your keyboard to answer every question, zoom in up to 400% without losing content, and use the service on a phone, tablet or computer. Each form field has a label and help text for screen reader users.
      </p>
      <h2 className="govuk-heading-m">Feedback and contact information</h2>
      <p className="govuk-body">
        If you need information in a different format, or you find a problem that is not listed here, use the contact page and tell us what adjustment you need.
      </p>
      <h2 className="govuk-heading-m">Technical information</h2>
      <p className="govuk-body">This service is partially compliant with WCAG 2.2 AA.</p>
      <p className="govuk-body">
        Known issues: we have not yet tested the service with a range of assistive technologies, so some problems may not have been found.
      </p>
      <h2 className="govuk-heading-m">How we tested this service</h2>
      <p className="govuk-body">
        We tested the service with a keyboard, at a width of 320 pixels, and checked the colours for contrast. We have not yet tested with a range of assistive technologies.
      </p>
      <h2 className="govuk-heading-m">What we are doing to improve</h2>
      <p className="govuk-body">
        We will test with assistive technology users and update this statement after each round of testing.
      </p>
    </>
  );
}
