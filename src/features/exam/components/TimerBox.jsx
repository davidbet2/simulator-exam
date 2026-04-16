/**
 * Circular SVG ring countdown timer.
 * Turns danger-red and pulses when under 5 minutes.
 */
const TOTAL_SECONDS = 90 * 60; // default 90 min exam
const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerBox({ timeLeft, totalSeconds = TOTAL_SECONDS }) {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const isUrgent = timeLeft < 300;
  const isCritical = timeLeft < 60;

  const progress = Math.max(0, timeLeft / totalSeconds);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const ringColor = isCritical ? '#f43f5e' : isUrgent ? '#f97316' : '#6366f1';

  return (
    <div className={`relative flex items-center justify-center w-12 h-12 ${isUrgent ? 'animate-pulse-glow' : ''}`}>
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
        {/* Track */}
        <circle
          cx="22" cy="22" r={RADIUS}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="3"
        />
        {/* Progress ring */}
        <circle
          cx="22" cy="22" r={RADIUS}
          fill="none"
          stroke={ringColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <span
        className={`relative font-mono text-[10px] font-bold tabular-nums ${
          isCritical ? 'text-danger-500' : isUrgent ? 'text-warning-600' : 'text-ink-soft'
        }`}
      >
        {minutes}:{seconds}
      </span>
    </div>
  );
}
