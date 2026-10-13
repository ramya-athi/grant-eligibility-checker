import RadioQuestion from '../components/RadioQuestion';

export default function OwnershipPage({ answers, setAnswer }) {
  return <RadioQuestion index={0} answers={answers} setAnswer={setAnswer} />;
}
