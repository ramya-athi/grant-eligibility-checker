import QuestionPage from '../components/QuestionPage';

function IncomePage({ answers, setAnswers }) {
  return <QuestionPage questionId="incomeBand" answers={answers} setAnswers={setAnswers} />;
}

export default IncomePage;
