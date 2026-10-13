import RadioQuestion from '../components/RadioQuestion';

export default function HeatingPage({ answers, setAnswer }) {
  return <RadioQuestion index={4} answers={answers} setAnswer={setAnswer} />;
}
