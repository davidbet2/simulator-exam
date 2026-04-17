import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../core/firebase/firebase';
import { useAuthStore } from '../../core/store/useAuthStore';
import { Trans, useLingui, Plural } from '@lingui/react/macro';
import { SEOHead } from '../../components/SEOHead';
import { ShareButton } from '../../components/ui/ShareButton';
import { AdBanner } from '../ads/components/AdBanner';

/** Modal that shows every question the user got wrong or skipped */
function WrongAnswersModal({ wrongItems, onClose }) {
  const { t } = useLingui();
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="glass-bright rounded-2xl shadow-card w-full max-w-2xl border border-surface-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border sticky top-0 bg-surface-soft/90 backdrop-blur-md rounded-t-2xl z-10">
          <h2 className="font-display font-bold text-ink text-base">
            <Trans>Respuestas incorrectas / sin responder ({wrongItems.length})</Trans>
          </h2>
          <button onClick={onClose} className="text-ink-soft hover:text-ink text-lg leading-none font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-muted transition-colors">
            ✕
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-surface-border">
          {wrongItems.map(({ idx, question, selected }) => {
            const unanswered = selected.length === 0;
            return (
              <div key={idx} className="px-6 py-5">
                <div className="flex items-start gap-2 mb-3">
                  <span className="shrink-0 text-xs font-bold bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full mt-0.5">#{idx + 1}</span>
                  {unanswered && (
                    <span className="shrink-0 text-xs font-bold bg-surface-muted text-ink-soft px-2 py-0.5 rounded-full mt-0.5"><Trans>Sin responder</Trans></span>
                  )}
                  <p className="text-sm font-semibold text-ink leading-relaxed">{question.question}</p>
                </div>

                {/* Options — multiple choice */}
                {(!question.type || question.type === 'multiple') ? (() => {
                  const correctSet = new Set(question.answer);
                  const selectedSet = new Set(selected);
                  const sortedEntries = Object.keys(question.options).sort().map((k) => [k, question.options[k]]);
                  return (
                    <div className="flex flex-col gap-2 ml-4">
                      {sortedEntries.map(([key, value]) => {
                        const isCorrect = correctSet.has(key);
                        const wasSelected = selectedSet.has(key);
                        let cls = 'flex items-baseline gap-2 px-3 py-2 rounded-lg border text-sm ';
                        if (isCorrect) cls += 'bg-success-500/15 border-success-500/50 text-success-300';
                        else if (wasSelected) cls += 'bg-danger-500/15 border-danger-500/50 text-danger-300';
                        else cls += 'bg-surface-card border-surface-border text-ink-soft';
                        return (
                          <div key={key} className={cls}>
                            <span className="font-bold shrink-0">{key}.</span>
                            <span>{value}</span>
                            {isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-success-400"><Trans>✓ Correcta</Trans></span>}
                            {wasSelected && !isCorrect && <span className="ml-auto shrink-0 text-xs font-bold text-danger-400"><Trans>✗ Tu respuesta</Trans></span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })() : null}

                {/* Options — matching */}
                {question.type === 'matching' && (
                  <div className="flex flex-col gap-2 ml-4">
                    {question.pairs.map((pair, i) => {
                      const chosen = selected[i] ?? '';
                      const isCorrect = chosen === pair.correctMatch;
                      return (
                        <div key={pair.term} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm ${isCorrect ? 'bg-success-500/15 border-success-500/50' : 'bg-danger-500/15 border-danger-500/50'}`}>
                          <span className="font-medium text-ink shrink-0">{pair.term}</span>
                          <span className="text-slate-600">→</span>
                          <span className={isCorrect ? 'text-success-300' : 'text-danger-300 line-through'}>
                            {chosen ? question.matches[chosen] : t`— sin responder —`}
                          </span>
                          {!isCorrect && (
                            <span className="ml-auto shrink-0 text-xs text-success-400 font-semibold">✓ {question.matches[pair.correctMatch]}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Options — ordering */}
                {question.type === 'ordering' && (
                  <div className="flex flex-col gap-2 ml-4">
                    <p className="text-xs text-ink-soft mb-1"><Trans>Orden correcto:</Trans></p>
                    {question.correctOrder.map((item, i) => (
                      <div key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg border text-sm bg-success-500/10 border-success-500/40 text-success-300">
                        <span className="font-bold shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-surface-border flex justify-end">
          <button onClick={onClose} className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2 rounded-xl transition-colors text-sm">
            <Trans>Cerrar</Trans>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuthStore();
  const { t } = useLingui();
  const [showWrong, setShowWrong] = useState(false);
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
    }).catch(() => {});
  }, [state, user]);

  if (!state) return null;

  const { score, total, isTimeOut, certLabel, passPercent, displayQuestions, answers, mode, confidence } = state;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const passed = percentage >= passPercent;
  const isWager = mode === 'wager';

  // ── Wager mode calibration ────────────────────────────────────────────────
  // For each confidence level (1/2/3), compute correct vs total and signed points.
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

  // Compute wrong/unanswered items
  const wrongItems = (displayQuestions ?? []).map((dq, idx) => {
    const sel = answers?.[idx] ?? [];
    let isCorrect = false;
    if (dq.type === 'matching') {
      isCorrect = sel.length > 0 && dq.pairs.every((p, i) => sel[i] === p.correctMatch);
    } else if (dq.type === 'ordering') {
      isCorrect = sel.length > 0 && sel.length === dq.correctOrder?.length && sel.every((v, i) => v === dq.correctOrder[i]);
    } else {
      if (sel.length > 0) {
        const correct = [...dq.answer].sort();
        const sortedSel = [...sel].sort();
        isCorrect = sortedSel.length === correct.length && sortedSel.every((v, i) => v === correct[i]);
      }
    }
    return isCorrect ? null : { idx, question: dq, selected: sel };
  }).filter(Boolean);

  const ringColor = passed ? '#22c55e' : '#f43f5e';
  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS;
  const ringOffset = CIRC * (1 - percentage / 100);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <SEOHead title={t`Resultados`} description={t`Resultados de tu examen de práctica.`} path="/results" noindex />
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0">
        <div className={`absolute inset-0 opacity-10 ${passed ? 'bg-success-500' : 'bg-danger-500'} blur-3xl scale-150`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-bright rounded-2xl shadow-card w-full max-w-md px-8 py-10 text-center border border-surface-border relative"
      >
        {/* Circular score ring */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
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
            <span className={`text-3xl font-display font-bold tabular-nums ${
              passed ? 'text-success-400' : 'text-danger-400'
            }`}>{displayScore}%</span>
            <span className="text-xs text-ink-soft mt-0.5">{isTimeOut ? '⏱️' : passed ? '🎉' : '📚'}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-xl font-display font-bold mb-1 ${
          isTimeOut ? 'text-warning-400' : passed ? 'text-success-400' : 'text-danger-400'
        }`}>
          {isTimeOut ? <Trans>¡Tiempo Agotado!</Trans> : passed ? <Trans>¡Felicitaciones! Aprobaste</Trans> : <Trans>No aprobaste esta vez</Trans>}
        </h1>
        <p className="text-ink-soft text-sm mb-6">{certLabel}</p>

        {/* Stats */}
        <div className="bg-surface-card rounded-xl p-4 mb-6 space-y-3 text-left border border-surface-border">
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft"><Trans>Respuestas correctas</Trans></span>
            <span className="font-bold text-ink">{score} / {total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft"><Trans>Porcentaje obtenido</Trans></span>
            <span className={`font-bold text-lg ${passed ? 'text-success-400' : 'text-danger-400'}`}>{percentage}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft"><Trans>Umbral de aprobación</Trans></span>
            <span className="font-semibold text-ink-soft">{passPercent}%</span>
          </div>
        </div>

        {/* Wager calibration panel */}
        {isWager && wagerStats && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-ink text-sm flex items-center gap-1.5">
                <span>🎲</span><Trans>Apuesta · Calibración</Trans>
              </h3>
              <span className={`text-lg font-bold tabular-nums ${
                wagerStats.points >= 0 ? 'text-success-500' : 'text-danger-500'
              }`}>
                {wagerStats.points >= 0 ? '+' : ''}{wagerStats.points}
              </span>
            </div>
            <p className="text-xs text-ink-soft mb-3">
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
                { level: 1, label: t`🤔 Dudo · ×1`,  color: 'bg-brand-500' },
              ].map(({ level, label, color }) => {
                const b = wagerStats.buckets[level];
                const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
                return (
                  <div key={level} className="flex items-center gap-2 text-xs">
                    <span className="text-ink-soft w-24 shrink-0">{label}</span>
                    <div className="flex-1 h-2 bg-surface-muted rounded-full overflow-hidden">
                      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-semibold text-ink tabular-nums w-16 text-right shrink-0">
                      {b.correct}/{b.total} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-2 bg-surface-muted rounded-full mb-8 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              passed ? 'bg-gradient-to-r from-success-500 to-success-400' : 'bg-gradient-to-r from-danger-600 to-danger-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <AdBanner
          keywords="certification|developer|appian"
          placementId="results-bottom"
          className="mt-2"
        />

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <ShareButton
            url={state.certId && state.certId !== 'demo' ? `https://certzen.app/exam-sets/${state.certId}` : 'https://certzen.app'}
            title={certLabel}
            text={passed
              ? `¡Saqué ${percentage}% en ${certLabel}! 🎯 Practica gratis en CertZen`
              : `Obtuve ${percentage}% en ${certLabel}. ¡Lo intentaré de nuevo! 💪 Practica en CertZen`
            }
            variant="button"
          />
          <button
            onClick={() => navigate('/')}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95 w-full"
          >
            <Trans>Volver al inicio</Trans>
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border border-brand-500/50 text-brand-400 hover:bg-brand-500/15 font-semibold py-3 px-6 rounded-xl transition-all w-full"
          >
            <Trans>Reintentar mismo examen</Trans>
          </button>
          {wrongItems.length > 0 && (
            <button
              onClick={() => setShowWrong(true)}
              className="border border-danger-500/40 text-danger-400 hover:bg-danger-500/10 font-semibold py-3 px-6 rounded-xl transition-all w-full"
            >
              📖 <Plural value={wrongItems.length} one="Ver # respuesta incorrecta" other="Ver # respuestas incorrectas" />
            </button>
          )}
        </div>
      </motion.div>

      {showWrong && (
        <WrongAnswersModal wrongItems={wrongItems} onClose={() => setShowWrong(false)} />
      )}
    </div>
  );
}



