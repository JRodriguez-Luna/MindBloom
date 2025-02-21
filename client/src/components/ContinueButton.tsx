import './ContinueButton.css';

type ContinueProps = {
  active: boolean;
  onClick?: () => void;
};

export function ContinueButton({ active, onClick }: ContinueProps) {
  return (
    <div className="continue-container">
      <button
        onClick={onClick}
        className={`continue-button ${active ? '' : 'hidden'}`}>
        Continue
      </button>
    </div>
  );
}
