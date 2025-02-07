import './ContinueButton.css';

type ContinueProps = {
  active: boolean;
};

export function ContinueButton({ active }: ContinueProps) {
  console.log('active', active);

  return (
    <div className="continue-container">
      <button className={`continue-button ${active ? '' : 'hidden'}`}>
        Continue
      </button>
    </div>
  );
}
