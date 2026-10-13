// First tab stop on every page. Moves keyboard focus straight to the main content.
export default function SkipLink() {
  function skip(event) {
    event.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  }

  return (
    <a href="#main-content" className="govuk-skip-link govuk-!-display-none-print" data-module="govuk-skip-link" onClick={skip}>
      Skip to main content
    </a>
  );
}
