import QuestionPage from '../components/QuestionPage';

function PropertyTypePage({ answers, setAnswers }) {
  return <QuestionPage questionId="propertyType" answers={answers} setAnswers={setAnswers} />;
}

export default PropertyTypePage;
