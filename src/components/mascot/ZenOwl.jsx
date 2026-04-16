import { motion } from 'framer-motion';

/**
 * ZenOwl — CertZen mascot.
 * A friendly owl SVG character built with Duolingo-inspired rounded shapes.
 * Props:
 *   size   — number, pixel size (default 200)
 *   mood   — 'default' | 'happy' | 'thinking' (default 'default')
 *   bob    — boolean, whether to add bobbing animation (default true)
 */
export function ZenOwl({ size = 200, mood = 'default', bob = true }) {
  const eyeVariants = {
    default: { scaleY: 1 },
    happy:   { scaleY: 0.45 },
    thinking: { scaleY: 0.85 },
  };

  const _wingVariants = {
    default:  { rotate: 0 },
    happy:    { rotate: [-5, 5, -5, 5, 0] },
    thinking: { rotate: 0 },
  };

  const s = size;

  return (
    <motion.div
      style={{ width: s, height: s, display: 'inline-block' }}
      animate={bob ? { y: [0, -10, 0] } : {}}
      transition={bob ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={s}
        height={s * 1.1}
        aria-hidden="true"
      >
        {/* ── Shadow ── */}
        <ellipse cx="100" cy="212" rx="42" ry="8" fill="rgba(0,0,0,0.08)" />

        {/* ── Body ── */}
        <rect x="42" y="90" width="116" height="108" rx="50" fill="#4ade80" />

        {/* ── Belly ── */}
        <ellipse cx="100" cy="150" rx="38" ry="42" fill="#bbf7d0" />

        {/* ── Wings ── */}
        {/* Left wing */}
        <motion.g
          style={{ originX: '58px', originY: '148px' }}
          animate={mood === 'happy' ? { rotate: [0, -12, 0, -8, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: mood === 'happy' ? 2 : 0 }}
        >
          <rect x="18" y="118" width="42" height="60" rx="20" fill="#22c55e" />
        </motion.g>

        {/* Right wing */}
        <motion.g
          style={{ originX: '140px', originY: '148px' }}
          animate={mood === 'happy' ? { rotate: [0, 12, 0, 8, 0] } : { rotate: 0 }}
          transition={{ duration: 0.8, repeat: mood === 'happy' ? 2 : 0 }}
        >
          <rect x="140" y="118" width="42" height="60" rx="20" fill="#22c55e" />
        </motion.g>

        {/* ── Head ── */}
        <ellipse cx="100" cy="76" rx="52" ry="54" fill="#4ade80" />

        {/* ── Ear tufts ── */}
        <rect x="54" y="20" width="22" height="30" rx="11" fill="#16a34a" transform="rotate(-18 54 20)" />
        <rect x="122" y="20" width="22" height="30" rx="11" fill="#16a34a" transform="rotate(18 122 20)" />

        {/* ── Eye whites ── */}
        <ellipse cx="80" cy="78" rx="20" ry="20" fill="white" />
        <ellipse cx="120" cy="78" rx="20" ry="20" fill="white" />

        {/* ── Pupils (animated per mood) ── */}
        <motion.ellipse
          cx="80" cy="80"
          rx="11" ry="11"
          fill="#1a1a1a"
          animate={eyeVariants[mood] ?? eyeVariants.default}
          transition={{ duration: 0.3 }}
          style={{ originX: '80px', originY: '80px' }}
        />
        <motion.ellipse
          cx="120" cy="80"
          rx="11" ry="11"
          fill="#1a1a1a"
          animate={eyeVariants[mood] ?? eyeVariants.default}
          transition={{ duration: 0.3 }}
          style={{ originX: '120px', originY: '80px' }}
        />

        {/* ── Eye shine ── */}
        <circle cx="85" cy="74" r="4" fill="white" opacity="0.85" />
        <circle cx="125" cy="74" r="4" fill="white" opacity="0.85" />

        {/* ── Beak ── */}
        <polygon points="100,90 90,106 110,106" fill="#fbbf24" />

        {/* ── Feet ── */}
        <rect x="76" y="192" width="20" height="12" rx="6" fill="#86efac" />
        <rect x="104" y="192" width="20" height="12" rx="6" fill="#86efac" />

        {/* ── Certificate badge on belly ── */}
        <rect x="86" y="152" width="28" height="20" rx="6" fill="#16a34a" />
        <text x="100" y="166" textAnchor="middle" fontSize="9" fontWeight="800" fill="white" fontFamily="Nunito, sans-serif">PRO</text>

        {/* ── Thinking bubble (only in thinking mood) ── */}
        {mood === 'thinking' && (
          <g>
            <circle cx="155" cy="44" r="12" fill="white" stroke="#e8e6e1" strokeWidth="1.5" />
            <text x="155" y="49" textAnchor="middle" fontSize="11">💡</text>
            <circle cx="145" cy="60" r="5" fill="white" stroke="#e8e6e1" strokeWidth="1.5" />
            <circle cx="140" cy="70" r="3" fill="white" stroke="#e8e6e1" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
