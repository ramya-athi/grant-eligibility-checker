import RadioQuestion from '../components/RadioQuestion';

export default function IncomePage({ answers, setAnswer }) {
  return <RadioQuestion index={1} answers={answers} setAnswer={setAnswer} />;
}
