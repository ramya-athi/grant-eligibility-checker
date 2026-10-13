import { Link, useNavigate } from 'react-router-dom';
import BackLink from '../components/BackLink';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { QUESTIONS, QUESTION_ORDER, labelFor } from '../data/questions';

function displayValue(id, answers) {
  if (id === 'heating' && answers.heating === QUESTIONS.heating.other.value) {
    return `Other: ${answers.heatingOther}`;
  }
  return labelFor(id, answers[id]);
}

// Check your answers – GOV.UK summary list with a Change link per answer (CYA-01 to CYA-06)
function CheckAnswersPage({ answers }) {
  const navigate = useNavigate();
  usePageTitle('Check your answers');

  return (
    <>
      <BackLink to={QUESTIONS.heating.route} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Check your answers</h1>
          <p className="govuk-body">Check your answers before you submit them. You can change any answer.</p>

          <dl className="govuk-summary-list govuk-!-margin-bottom-9">
            {QUESTION_ORDER.map((id) => {
              const question = QUESTIONS[id];
              return (
                <div className="govuk-summary-list__row" key={id}>
                  <dt className="govuk-summary-list__key">{question.summaryKey}</dt>
                  <dd className="govuk-summary-list__value">{displayValue(id, answers)}</dd>
                  <dd className="govuk-summary-list__actions">
                    <Link className="govuk-link" to={`${question.route}?change=true`}>
                      Change<span className="govuk-visually-hidden"> {question.summaryKey.toLowerCase()}</span>
                    </Link>
                  </dd>
                </div>
              );
            })}
          </dl>

          <GovukButton onClick={() => navigate('/result')}>Submit</GovukButton>
        </div>
      </div>
    </>
  );
}

export default CheckAnswersPage;
