import RadioQuestion from '../components/RadioQuestion';

export default function InsulationPage({ answers, setAnswer }) {
  return <RadioQuestion index={3} answers={answers} setAnswer={setAnswer} />;
}
