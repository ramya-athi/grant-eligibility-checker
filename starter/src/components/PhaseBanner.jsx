import { Link } from 'react-router-dom';

// GOV.UK Frontend 6 phase banner (LAY-03)
export default function PhaseBanner({ phase = 'Alpha', feedbackTo = '/feedback' }) {
  return (
    <div className="govuk-phase-banner govuk-width-container">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          This is a new service – your{' '}
          <Link to={feedbackTo} className="govuk-link">
            feedback
          </Link>{' '}
          will help us to improve it.
        </span>
      </p>
    </div>
  );
}
