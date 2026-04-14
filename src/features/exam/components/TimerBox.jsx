/**
 * Displays countdown timer — turns red when under 5 minutes.
 */
export function TimerBox({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const isUrgent = timeLeft < 300;

  return (
    <span
      className={`font-mono text-lg font-bold px-3 py-1 rounded ${
        isUrgent
          ? 'bg-appian-error-light text-appian-error'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {minutes}:{seconds}
    </span>
  );
}
