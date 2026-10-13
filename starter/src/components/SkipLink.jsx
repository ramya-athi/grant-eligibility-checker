// GOV.UK skip link (LAY-02). Moves focus to <main> without changing the URL,
// which is what GOV.UK Frontend's JavaScript would otherwise do.
export default function SkipLink({ targetId = 'main-content' }) {
  function handleClick(event) {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    target.focus();
    target.scrollIntoView();
  }

  return (
    <a href={`#${targetId}`} className="govuk-skip-link" onClick={handleClick}>
      Skip to main content
    </a>
  );
}
