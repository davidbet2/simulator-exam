import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Check, XCircle, Clock, ClipboardList } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../core/firebase/firebase';
import { useAuthStore } from '../../core/store/useAuthStore';
import { Trans, useLingui } from '@lingui/react/macro';
import { SEOHead } from '../../components/SEOHead';
import { ShareButton } from '../../components/ui/ShareButton';
import { PageBackground } from '../../components/glass/PageBackground';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { analytics } from '../../core/analytics/events';

function StatPill({ icon: Icon, label, value, tone }) {
  const TONES = {
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
    danger:  'bg-rose-500/15 text-rose-600 dark:text-rose-300',
    neutral: 'bg-zen/15 text-zen dark:text-indigo-300',
  };
  return (
    <GlassCard className="flex flex-col items-center gap-1.5 p-4">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone] ?? TONES.neutral}`}>
        <Icon size={16} />
      </span>
      <span className="text-lg font-bold text-zen-ink dark:text-white tabular-nums">{value}</span>
      <span className="text-[11px] text-zen-ink/50 dark:text-white/50">{label}</span>
    </GlassCard>
  );
}

function formatDuration(totalSeconds) {
  if (totalSeconds == null) return '—';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuthStore();
  const { t } = useLingui();
  const [displayScore, setDisplayScore] = useState(0);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  // Persist attempt to Firestore (once, only in exam mode, only if logged in, skip demo)
  useEffect(() => {
    if (!state || !user || savedRef.current) return;
    if (state.mode === 'study' || state.mode === 'weak' || state.mode === 'srs' || state.mode === 'wager') return;
    if (state.certId === 'demo') return;
    savedRef.current = true;
    addDoc(collection(db, 'attempts'), {
      uid:         user.uid,
      certId:      state.certId ?? null,
      certTitle:   state.certLabel ?? state.certId ?? null,
      score:       state.score,
      total:       state.total,
      passPercent: state.passPercent,
      mode:        state.mode ?? 'exam',
      createdAt:   serverTimestamp(),
    }).catch((err) => { console.error('[Results] attempt save failed:', err); });
    const pct = state.total > 0 ? Math.round((state.score / state.total) * 100) : 0;
    analytics.examComplete({
      certId: state.certId ?? 'unknown',
      mode:   state.mode   ?? 'exam',
      score:  state.score,
      total:  state.total,
      passed: pct >= (state.passPercent ?? 72),
    });
  }, [state, user]);

  if (!state) return null;

  const { score, total, isTimeOut, certLabel, passPercent, displayQuestions, answers, mode, confidence, timeSpentSeconds } = state;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= passPercent;
  const isWager = mode === 'wager';

  // ── Wager mode calibration ────────────────────────────────────────────────
  const wagerStats = isWager ? (() => {
    const buckets = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } };
    let points = 0;
    let totalBet = 0;
    (displayQuestions ?? []).forEach((dq, idx) => {
      const sel = answers?.[idx] ?? [];
      const lvl = confidence?.[idx];
      if (!lvl) return;
      let correct = false;
      if (dq.type === 'matching') {
        correct = sel.length > 0 && dq.pairs.every((p, i) => sel[i] === p.correctMatch);
      } else if (dq.type === 'ordering') {
        correct = sel.length > 0 && sel.length === dq.correctOrder?.length && sel.every((v, i) => v === dq.correctOrder[i]);
      } else {
        const c = [...dq.answer].sort();
        const s = [...sel].sort();
        correct = s.length === c.length && s.every((v, i) => v === c[i]);
      }
      buckets[lvl].total += 1;
      if (correct) buckets[lvl].correct += 1;
      points += correct ? lvl : -lvl;
      totalBet += lvl;
    });
    return { buckets, points, totalBet };
  })() : null;

  // Animate score counter + confetti on mount
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (passed && !isTimeOut) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#6366f1','#22c55e','#f59e0b','#ec4899'] });
    }
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = percentage / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= percentage) { setDisplayScore(percentage); clearInterval(timer); }
      else setDisplayScore(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute per-question correctness (reused for wrong list + topic breakdown)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const graded = useMemo(() => (displayQuestions ?? []).map((dq, idx) => {
    const sel = answers?.[idx] ?? [];
    let isCorrect = false;
    if (dq.type === 'matching') {
      isCorrect = sel.length > 0 && dq.pairs.every((p, i) => sel[i] === p.correctMatch);
    } else if (dq.type === 'ordering') {
      isCorrect = sel.length > 0 && sel.length === dq.correctOrder?.length && sel.every((v, i) => v === dq.correctOrder[i]);
    } else if (sel.length > 0) {
      const correct = [...dq.answer].sort();
      const sortedSel = [...sel].sort();
      isCorrect = sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
    }
    return { idx, question: dq, selected: sel, isCorrect };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  // "Rendimiento por tema" — solo si las preguntas traen domain/category (no todos los sets lo tienen)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const topicBreakdown = useMemo(() => {
    const byTopic = new Map();
    for (const g of graded) {
      const topic = g.question.domain || g.question.category;
      if (!topic) continue;
      if (!byTopic.has(topic)) byTopic.set(topic, { correct: 0, total: 0 });
      const bucket = byTopic.get(topic);
      bucket.total += 1;
      if (g.isCorrect) bucket.correct += 1;
    }
    return [...byTopic.entries()]
      .map(([topic, { correct, total: t2 }]) => ({ topic, pct: Math.round((correct / t2) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ringColor = passed ? '#34D399' : '#F87171';
  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS;
  const ringOffset = CIRC * (1 - percentage / 100);

  return (
    <PageBackground>
    {/* data-clarity-mask hides question/answer/score text from Clarity session
        recordings while still tracking clicks/scroll for the heatmap — see spec 13. */}
    <div data-clarity-mask="true">
      <SEOHead title={t`Resultados`} description={t`Resultados de tu examen de práctica.`} path="/results" noindex />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zen-ink/40 dark:text-white/40"><Trans>Resultados</Trans></p>
          <p className="font-bold text-zen-ink dark:text-white text-sm truncate">{certLabel}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ShareButton
            url={state.certId && state.certId !== 'demo' ? `https://certzen.app/exam-sets/${state.certId}` : 'https://certzen.app'}
            title={certLabel}
            text={passed
              ? `¡Saqué ${percentage}% en ${certLabel}! 🎯 Practica gratis en CertZen`
              : `Obtuve ${percentage}% en ${certLabel}. ¡Lo intentaré de nuevo! 💪 Practica en CertZen`
            }
            variant="icon"
          />
          <button
            onClick={() => navigate('/home')}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-zen-ink/70 dark:text-white/70 bg-glass-light-2 dark:bg-glass-dark-2 border border-glass-light-border dark:border-glass-dark-border hover:text-zen-ink dark:hover:text-white transition-colors"
          >
            <X size={14} /> <Trans>Cerrar</Trans>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <GlassCard className="px-6 sm:px-8 py-10 text-center">
            {/* Circular score ring */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="currentColor" className="text-glass-light-border dark:text-glass-dark-border" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r={RADIUS}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.3s' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tabular-nums text-zen-ink dark:text-white">{displayScore}%</span>
                <span className="text-xs text-zen-ink/50 dark:text-white/50 mt-0.5">{isTimeOut ? '⏱️' : passed ? '🎉' : '📚'}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold mb-1 text-zen-ink dark:text-white">
              {isTimeOut ? <Trans>¡Tiempo Agotado!</Trans> : passed ? <Trans>¡Aprobado!</Trans> : <Trans>No aprobaste esta vez</Trans>}
            </h1>
            <p className="text-zen-ink/60 dark:text-white/60 text-sm mb-6">
              {passed
                ? <Trans>Superaste el {passPercent}% necesario para aprobar este simulacro.</Trans>
                : <Trans>Necesitas {passPercent}% para aprobar — sigue practicando.</Trans>
              }
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <StatPill icon={Check} tone="success" value={score} label={t`Correctas`} />
              <StatPill icon={XCircle} tone="danger" value={total - score} label={t`Incorrectas`} />
              <StatPill icon={Clock} tone="neutral" value={formatDuration(timeSpentSeconds)} label={t`Tiempo total`} />
            </div>

            {/* Rendimiento por tema — solo si las preguntas traen dominio/categoría */}
            {topicBreakdown.length > 0 && (
              <div className="mb-6 text-left">
                <h2 className="text-sm font-semibold text-zen-ink dark:text-white mb-3 flex items-center gap-1.5">
                  <ClipboardList size={14} className="text-zen dark:text-indigo-300" />
                  <Trans>Rendimiento por tema</Trans>
                </h2>
                <div className="space-y-2.5">
                  {topicBreakdown.map(({ topic, pct }) => (
                    <div key={topic} className="flex items-center gap-3 text-xs">
                      <span className="w-28 shrink-0 truncate text-zen-ink/70 dark:text-white/60">{topic}</span>
                      <div className="flex-1 h-2 rounded-full bg-glass-light-2 dark:bg-glass-dark-2 overflow-hidden">
                        <div className="h-full rounded-full bg-zen-brand transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-9 shrink-0 text-right font-semibold text-zen-ink dark:text-white tabular-nums">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wager calibration panel */}
            {isWager && wagerStats && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-left">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-zen-ink dark:text-white text-sm flex items-center gap-1.5">
                    <span>🎲</span><Trans>Apuesta · Calibración</Trans>
                  </h3>
                  <span className={`text-lg font-bold tabular-nums ${
                    wagerStats.points >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {wagerStats.points >= 0 ? '+' : ''}{wagerStats.points}
                  </span>
                </div>
                <p className="text-xs text-zen-ink/60 dark:text-white/60 mb-3">
                  Puntos netos: <span className="font-semibold">{wagerStats.points}</span> de{' '}
                  <span className="font-semibold">{wagerStats.totalBet}</span> apostados.
                  {(() => {
                    const badBet = wagerStats.buckets[3].total > 0 && (wagerStats.buckets[3].correct / wagerStats.buckets[3].total) < 0.7;
                    if (badBet) return ' ⚠️ Tu seguridad (×3) no se corresponde con tu precisión — revisa esas preguntas.';
                    if (wagerStats.points > wagerStats.totalBet * 0.5) return ' 🎯 Buena calibración: sabes cuándo sabes.';
                    return '';
                  })()}
                </p>
                <div className="space-y-1.5">
                  {[
                    { level: 3, label: t`⚡ Seguro · ×3`, color: 'bg-rose-500' },
                    { level: 2, label: t`✓ Creo · ×2`,   color: 'bg-amber-500' },
                    { level: 1, label: t`🤔 Dudo · ×1`,  color: 'bg-zen' },
                  ].map(({ level, label, color }) => {
                    const b = wagerStats.buckets[level];
                    const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
                    return (
                      <div key={level} className="flex items-center gap-2 text-xs">
                        <span className="text-zen-ink/60 dark:text-white/60 w-24 shrink-0">{label}</span>
                        <div className="flex-1 h-2 bg-glass-light-2 dark:bg-glass-dark-2 rounded-full overflow-hidden">
                          <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-semibold text-zen-ink dark:text-white tabular-nums w-16 text-right shrink-0">
                          {b.correct}/{b.total} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {graded.length > 0 && (
                <GlassButton
                  variant="secondary"
                  onClick={() => navigate('/results/review', { state: { graded, certLabel, percentage, passed, passPercent } })}
                  className="flex-1"
                >
                  <Trans>Revisar respuestas</Trans>
                </GlassButton>
              )}
              <GlassButton onClick={() => navigate(-1)} className="flex-1">
                <Trans>Repetir simulacro</Trans>
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
    </PageBackground>
  );
}
