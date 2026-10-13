import { Link } from 'react-router-dom';

export default function PhaseBanner({ phase = 'alpha', feedbackTo = '/contact' }) {
  return (
    <div className="govuk-phase-banner govuk-width-container govuk-!-display-none-print">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          This is a new service – your{' '}
          <Link className="govuk-link" to={feedbackTo}>
            feedback
          </Link>{' '}
          will help us improve it.
        </span>
      </p>
    </div>
  );
}
