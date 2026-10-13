import { Link, useSearchParams } from 'react-router-dom';

// Back link to an explicit route (NAV-03). In change mode it returns to Check your answers (NAV-04).
export default function BackLink({ to }) {
  const [searchParams] = useSearchParams();
  const target = searchParams.get('change') === 'true' ? '/check-answers' : to;

  return (
    <Link to={target} className="govuk-back-link">
      Back
    </Link>
  );
}
