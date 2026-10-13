import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <>
      <h1 className="govuk-heading-l">Page not found</h1>
      <p className="govuk-body">If you typed the web address, check it is correct.</p>
      <p className="govuk-body">
        <Link className="govuk-link" to="/">
          Go to the start of the Green Home Grant checker
        </Link>
      </p>
    </>
  );
}
