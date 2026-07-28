import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, BarChart2, ArrowRight,
  Zap, Sparkles, CheckCircle2,
  Shield, Target,
} from 'lucide-react';
import { Trans, useLingui } from '@lingui/react/macro';
import { msg } from '@lingui/core/macro';
import { useAuthStore } from '../../core/store/useAuthStore';
import { useUserPlan } from '../plans/hooks/useUserPlan';
import { SEOHead } from '../../components/SEOHead';
import { PublicLayout } from '../../components/layout/PublicLayout';
import robotHeroDark from '../../assets/mascot/robot-hero-dark.webp';
import robotHeroLight from '../../assets/mascot/robot-hero-light.webp';
import robotCtaDark from '../../assets/mascot/robot-cta-dark.webp';
import robotCtaLight from '../../assets/mascot/robot-cta-light.webp';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';

// ─── Features list ───────────────────────────────────────────────────────────
// Strings are defined with the `msg` macro so the extractor picks them up;
// they're resolved to the active locale at render time via t(descriptor).
const FEATURES = [
  {
    icon: Target,
    title: msg`Simulación Real`,
    description: msg`Formato similar al examen oficial: cronómetro, navegación libre y revisión de errores al finalizar.`,
  },
  {
    icon: BookOpen,
    title: msg`Banco Oficial`,
    description: msg`Preguntas basadas en el contenido real, organizadas por dominio y nivel de dificultad.`,
  },
  {
    icon: BarChart2,
    title: msg`Progreso Inteligente`,
    description: msg`Registra cada intento, identifica tus debilidades y construye confianza antes del día del examen.`,
  },
];

// ─── Social proof numbers ────────────────────────────────────────────────────
const STATS = [
  { value: '3',     label: msg`Modos de práctica` },
  { value: 'Multi', label: msg`Certificaciones` },
  { value: 'Pro',   label: msg`Sin límites` },
];

// ─── Trust items ─────────────────────────────────────────────────────────────
const TRUST = [
  msg`Acceso inmediato`,
  msg`Progreso guardado`,
  msg`Plan gratuito disponible`,
];

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

// ─── Practice modes ──────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'exam',
    emoji: '🎯',
    title: msg`Modo Examen`,
    description: msg`Cronómetro real, navegación libre entre preguntas y revisión completa de errores al finalizar. El formato exacto del día del examen.`,
    tag: msg`Más usado`,
    tagTone: 'brand',
    available: true,
  },
  {
    id: 'study',
    emoji: '📖',
    title: msg`Modo Estudio`,
    description: msg`Sin cronómetro. Confirma cada respuesta y ve al instante si acertaste. Explicación incluida para cada pregunta.`,
    tag: msg`Para aprender`,
    tagTone: 'brand',
    available: true,
  },
  {
    id: 'flashcards',
    emoji: '🃏',
    title: msg`Flashcards`,
    description: msg`Repasa concepto a concepto con tarjetas interactivas de término-definición. Voltea para ver la respuesta.`,
    tag: msg`Nuevo`,
    tagTone: 'brand',
    available: true,
  },
  {
    id: 'quick',
    emoji: '⚡',
    title: msg`Repaso Rápido`,
    description: msg`10 preguntas aleatorias con retroalimentación inmediata. Ideal para repasar en menos de 5 minutos.`,
    tag: msg`Para aprender`,
    tagTone: 'brand',
    available: true,
  },
];

// ─── Mode card ────────────────────────────────────────────────────────────────
function ModeCard({ mode, onLaunch }) {
  const { t } = useLingui();
  return (
    <motion.div
      variants={fadeUp}
      whileHover={mode.available ? { y: -6, scale: 1.01 } : {}}
      whileTap={mode.available ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      className={mode.available ? 'cursor-pointer' : 'cursor-default'}
      onClick={() => mode.available && onLaunch(mode.id)}
    >
      <GlassCard
        variant={mode.available ? 'default' : 'subtle'}
        className={`flex h-full flex-col p-6 transition-all duration-300 ${mode.available ? 'hover:border-zen/40' : 'opacity-70'}`}
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zen/15 text-xl dark:bg-zen/25">
            {mode.emoji}
          </div>
          <GlassBadge tone={mode.tagTone}>{t(mode.tag)}</GlassBadge>
        </div>
        <h3 className="mb-2 text-lg font-bold leading-snug">
          {t(mode.title)}
        </h3>
        <p className="mb-5 flex-1 text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">
          {t(mode.description)}
        </p>
        {mode.available ? (
          <div className="flex min-h-11 items-center justify-center gap-2 rounded-zen bg-zen/10 px-4 text-sm font-semibold text-zen transition-colors duration-200 hover:bg-zen/20 dark:bg-zen/20 dark:text-indigo-300 dark:hover:bg-zen/30">
            <Trans>Probar demo</Trans> <ArrowRight size={13} />
          </div>
        ) : (
          <div className="flex min-h-11 items-center justify-center rounded-zen border border-glass-light-border bg-glass-light-1 px-4 text-sm font-semibold text-zen-ink/40 dark:border-glass-dark-border dark:bg-glass-dark-1 dark:text-white/35">
            <Trans>Próximamente</Trans>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

export function WelcomePage() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { remaining, isPro, isLoading: planLoading } = useUserPlan();
  const [_showGate, _setShowGate]   = useState(false);

  function launchMode(modeId) {
    if (modeId === 'flashcards') { navigate('/flashcards/demo'); return; }
    if (modeId === 'quick') { navigate('/exam?cert=demo&mode=study&count=10'); return; }
    navigate(`/exam?cert=demo&mode=${modeId}`);
  }

  return (
    <>
      <SEOHead
        title={t`Simuladores de Certificación Profesional`}
        description={t`Prepárate para tus certificaciones con simuladores reales, banco de preguntas oficial y seguimiento de progreso. Gratis para empezar.`}
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': 'https://certzen.app/#organization',
              name: 'CertZen',
              url: 'https://certzen.app',
              logo: 'https://certzen.app/favicon.svg',
              description: 'Simulador de exámenes de certificación profesional. Appian, AWS, Azure y más.',
              sameAs: [],
            },
            {
              '@type': 'WebSite',
              '@id': 'https://certzen.app/#website',
              url: 'https://certzen.app',
              name: 'CertZen',
              description: 'Simulador inteligente de exámenes de certificación profesional.',
              publisher: { '@id': 'https://certzen.app/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://certzen.app/explore?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@type': 'SoftwareApplication',
              name: 'CertZen',
              applicationCategory: 'EducationApplication',
              operatingSystem: 'Web',
              url: 'https://certzen.app',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Plan gratuito. Plan Pro disponible.',
              },
            },
          ],
        }}
      />

      <PublicLayout>

        <main id="main-content" tabIndex={-1} className="outline-none">

          {/* ══════════════════════ HERO ══════════════════════ */}
          <section className="relative flex min-h-[90vh] items-center overflow-hidden py-20 sm:py-28">
            {/* Hero content */}
            <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

                {/* Left — text */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6 flex items-center gap-2"
                  >
                    <GlassBadge tone="brand" className="border border-zen/20 bg-glass-light-2 dark:bg-glass-dark-2">
                      <Sparkles size={10} />
                      <Trans>Simulador de Certificaciones</Trans>
                    </GlassBadge>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
                  >
                    Aprueba con{' '}
                    <span className="text-gradient-zen"><Trans>confianza</Trans></span>.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="mb-8 max-w-md text-base leading-relaxed text-zen-ink/70 dark:text-white/70 sm:text-lg"
                  >
                    <Trans>Simuladores con el formato similar del examen, banco de preguntas y seguimiento de progreso. Gratis para empezar hoy.</Trans>
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.24 }}
                    className="mb-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start"
                  >
                    {!user && (
                      <GlassButton to="/register" className="w-full px-8 text-base sm:w-auto">
                        <Trans>Empezar gratis</Trans>
                        <ArrowRight size={16} />
                      </GlassButton>
                    )}
                    <GlassButton variant="secondary" href="#simuladores" className="w-full px-7 text-base sm:w-auto">
                      <Trans>Ver simuladores</Trans>
                    </GlassButton>
                    {user && !isPro && !planLoading && remaining <= 1 && (
                      <GlassButton to="/pricing" variant="secondary" className="w-full px-7 text-base !text-zen-warning sm:w-auto">
                        <Zap size={14} /> <Trans>Actualizar a Pro</Trans>
                      </GlassButton>
                    )}
                  </motion.div>

                  <motion.ul
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="flex flex-col gap-y-2 sm:flex-row sm:flex-wrap sm:gap-x-5"
                  >
                    {TRUST.map((item) => {
                      const label = t(item);
                      return (
                        <li key={label} className="flex items-center gap-1.5 text-xs font-semibold text-zen-ink/70 dark:text-white/70">
                          <CheckCircle2 size={13} className="shrink-0 text-zen dark:text-indigo-300" />
                          {label}
                        </li>
                      );
                    })}
                  </motion.ul>
                </div>

                {/* Right — mascot + stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.18 }}
                  className="flex flex-col items-center gap-6"
                >
                  {/* Mascota robot del diseño — variantes light/dark (mismo asset que certzen.html) */}
                  <div
                    className="relative h-56 w-56 select-none overflow-hidden rounded-full border border-glass-light-border shadow-zen-glass dark:border-glass-dark-border dark:shadow-zen sm:h-80 sm:w-80"
                    aria-hidden="true"
                  >
                    <div className="absolute -inset-6 -z-[1] rounded-full bg-zen-violet/40 blur-3xl" />
                    <img src={robotHeroLight} alt="" className="h-full w-full object-cover dark:hidden" width="720" height="720" />
                    <img src={robotHeroDark} alt="" className="hidden h-full w-full object-cover dark:block" width="720" height="720" loading="lazy" />
                  </div>

                  <GlassCard className="grid w-full max-w-sm grid-cols-3 gap-0 overflow-hidden p-0">
                    {STATS.map(({ value, label }, i) => {
                      const labelText = t(label);
                      return (
                        <div
                          key={labelText}
                          className={`p-5 text-center ${i < STATS.length - 1 ? 'border-r border-glass-light-border dark:border-glass-dark-border' : ''}`}
                        >
                          <div className="text-xl font-extrabold leading-none">{value}</div>
                          <div className="mt-1 text-xs font-medium leading-tight text-zen-ink/60 dark:text-white/50">{labelText}</div>
                        </div>
                      );
                    })}
                  </GlassCard>
                </motion.div>

              </div>
            </div>
          </section>

          {/* ══════════════════════ FEATURES ══════════════════════ */}
          <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mb-14 text-center"
            >
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                <Trans>Todo lo que necesitas</Trans>{' '}
                <span className="text-gradient-zen"><Trans>para aprobar</Trans></span>
              </h2>
              <p className="mx-auto max-w-lg text-sm text-zen-ink/70 dark:text-white/60 sm:text-base">
                <Trans>Sin distracciones. Solo las herramientas que te acercan a tu certificación.</Trans>
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {FEATURES.map(({ icon: Icon, title, description }) => {
                const titleText = t(title);
                const descriptionText = t(description);
                return (
                <motion.div
                  key={titleText}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                >
                  <GlassCard className="h-full p-8 transition-all duration-300 hover:border-zen/40">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zen/30 bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-snug">{titleText}</h3>
                    <p className="text-sm leading-relaxed text-zen-ink/70 dark:text-white/60">{descriptionText}</p>
                  </GlassCard>
                </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* ══════════════════════ SIMULATORS ══════════════════════ */}
          <section
            id="simuladores"
            className="scroll-mt-20 px-4 py-20 sm:px-6"
          >
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  <Trans>Elige tu</Trans>{' '}
                  <span className="text-gradient-zen"><Trans>modo de práctica</Trans></span>
                </h2>
                <p className="text-sm text-zen-ink/70 dark:text-white/60 sm:text-base">
                  <Trans>Prueba cada modo con preguntas de ejemplo. Regístrate para acceder a exámenes completos.</Trans>
                </p>
              </motion.div>

              {/* Mode cards grid */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {MODES.map((mode) => (
                  <ModeCard key={mode.id} mode={mode} onLaunch={launchMode} />
                ))}
              </motion.div>

              <div className="mt-10 flex items-center justify-between border-t border-glass-light-border pt-8 text-xs text-zen-ink/70 dark:border-glass-dark-border dark:text-white/60">
                <Link to="/explore" className="flex items-center gap-1.5 font-semibold transition-colors hover:text-zen-ink dark:hover:text-white">
                  <BookOpen size={12} /> <Trans>Explorar sets de la comunidad</Trans>
                </Link>
              </div>
            </div>
          </section>

          {/* ══════════════════════ CTA (non-logged) ══════════════════════ */}
          {!user && (
            <section className="px-4 py-20 sm:px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-2xl text-center"
              >
                <GlassCard className="relative overflow-hidden px-8 py-12">
                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center">
                      <div className="h-24 w-24 select-none overflow-hidden rounded-full border border-glass-light-border dark:border-glass-dark-border" aria-hidden="true">
                        <img src={robotCtaLight} alt="" className="h-full w-full object-cover dark:hidden" width="320" height="320" loading="lazy" />
                        <img src={robotCtaDark} alt="" className="hidden h-full w-full object-cover dark:block" width="320" height="320" loading="lazy" />
                      </div>
                    </div>
                    <GlassBadge tone="brand" className="mb-4">
                      <Shield size={11} /> <Trans>Freemium · Plan gratuito disponible</Trans>
                    </GlassBadge>
                    <h2 className="mb-3 text-3xl font-extrabold sm:text-4xl">
                      <Trans>Empieza gratis hoy</Trans>
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-zen-ink/70 dark:text-white/60 sm:text-base">
                      <Trans>Crea tu cuenta en segundos y practica con simuladores reales. Plan gratuito para siempre. Actualiza cuando lo necesites.</Trans>
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                      <GlassButton to="/register" className="w-full px-8 text-base sm:w-auto">
                        <Trans>Crear cuenta gratis</Trans>
                        <ArrowRight size={16} />
                      </GlassButton>
                      <GlassButton to="/login" variant="secondary" className="w-full px-7 text-base sm:w-auto">
                        <Trans>Ya tengo cuenta</Trans>
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </section>
          )}

        </main>

      </PublicLayout>
    </>
  );
}
