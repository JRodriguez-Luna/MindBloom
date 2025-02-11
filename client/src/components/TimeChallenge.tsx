import { useNavigate } from 'react-router-dom';
import { TiChevronLeft } from 'react-icons/ti';

export function TimeChallenge() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate('/challenges')}>
        <TiChevronLeft />
      </button>
      <div>Time Challenge</div>
    </>
  );
}
