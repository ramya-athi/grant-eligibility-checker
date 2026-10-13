import { Link, useLocation, useNavigate } from 'react-router-dom';

// Back link for pages people reach from anywhere (footer pages, application placeholder).
// It goes to the page the user came from, as the GOV.UK Back link pattern says.
// If the page was opened directly, there is nothing to go back to, so it goes to the start page.
export default function PageBackLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromThisService = location.key !== 'default';

  function goBack(event) {
    if (cameFromThisService) {
      event.preventDefault();
      navigate(-1);
    }
  }

  return (
    <Link to="/" className="govuk-back-link govuk-!-display-none-print" onClick={goBack}>
      Back
    </Link>
  );
}
