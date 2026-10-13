import QuestionPage from '../components/QuestionPage';

function HeatingPage({ answers, setAnswers }) {
  return <QuestionPage questionId="heating" answers={answers} setAnswers={setAnswers} />;
}

export default HeatingPage;
