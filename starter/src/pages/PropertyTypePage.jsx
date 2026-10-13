import RadioQuestion from '../components/RadioQuestion';

export default function PropertyTypePage({ answers, setAnswer }) {
  return <RadioQuestion index={2} answers={answers} setAnswer={setAnswer} />;
}
