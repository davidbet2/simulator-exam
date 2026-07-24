import { motion } from 'framer-motion';
import { BookOpen, Target, Zap, Shield, Users, Award, ChevronRight } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';
import { GlassBadge } from '../../../components/glass/GlassBadge';
import { GlassButton } from '../../../components/glass/GlassButton';
import { Trans, useLingui } from '@lingui/react/macro';

const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CertZen',
  applicationCategory: 'EducationApplication',
  description: 'Simulador inteligente de exámenes de certificación profesional. Practica, aprende y aprueba con confianza.',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Plan gratuito disponible. Plan Pro desde $9.99/mes.',
  },
  url: 'https://certzen.app',
};

function fade(i) {
  return { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } };
}

export function AboutPage() {
  const { t } = useLingui();

  const FEATURES = [
    {
      icon: BookOpen,
      title: t`Banco de preguntas`,
      body: t`Preguntas similares a los exámenes oficiales de certificación, organizadas por dominio y nivel de dificultad. Actualizadas constantemente.`,
    },
    {
      icon: Target,
      title: t`Modo Examen & Modo Estudio`,
      body: t`En modo examen replicas las condiciones reales (cronómetro, preguntas aleatorias). En modo estudio confirmas cada respuesta y ves la explicación al instante.`,
    },
    {
      icon: Zap,
      title: t`Progreso en tiempo real`,
      body: t`Dashboard con historial de intentos, puntuación promedio, tasa de aprobación y logros desbloqueables. Sabe exactamente dónde mejorar.`,
    },
    {
      icon: Shield,
      title: t`Privacidad primero`,
      body: t`Sin publicidad con el plan pro. Tu historial de práctica es tuyo.`,
    },
    {
      icon: Users,
      title: t`Comunidad y UGC`,
      body: t`Explora sets de preguntas creados por la comunidad. Comparte tus propios simulacros con otros profesionales.`,
    },
    {
      icon: Award,
      title: t`Freemium sin trampa`,
      body: t`3 exámenes gratis al mes para siempre. El plan gratuito incluye acceso completo al simulador. Pro desbloquea exámenes ilimitados e historial completo.`,
    },
  ];

  const STEPS = [
    { num: '01', title: t`Crea tu cuenta gratis`,   body: t`Regístrate en 30 segundos con email. Plan freemium disponible.` },
    { num: '02', title: t`Elige tu certificación`,  body: t`Selecciona el examen de certificación que quieres practicar.` },
    { num: '03', title: t`Practica con propósito`,  body: t`Modo examen para simular el día real. Modo estudio para aprender de cada error.` },
    { num: '04', title: t`Aprueba con confianza`,   body: t`Revisa tu historial, identifica debilidades y presenta el examen oficial listo.` },
  ];
  return (
    <PublicLayout>
      <SEOHead
        title={t`Sobre la plataforma`}
        description={t`CertZen es un simulador inteligente de certificaciones profesionales. Aprende cómo funciona, qué certificaciones cubre y por qué miles de profesionales confían en nosotros.`}
        path="/about"
        jsonLd={SITE_JSON_LD}
      />

      {/* Skip-target */}
      <div id="main-content" />

      <main id="about-content" tabIndex={-1}>
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden px-4 py-20">
          <div className="relative mx-auto max-w-3xl text-center">
            <motion.p {...fade(0)} className="mb-6">
              <GlassBadge tone="brand" className="border border-zen/20 bg-glass-light-2 px-4 py-1.5 dark:bg-glass-dark-2">
                <Zap size={11} /> <Trans>Plataforma de certificación profesional</Trans>
              </GlassBadge>
            </motion.p>
            <motion.h1
              {...fade(1)}
              id="hero-heading"
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
            >
              <Trans>Practica como si fuera</Trans>{' '}
              <span className="text-gradient-zen"><Trans>el día real</Trans></span>
            </motion.h1>
            <motion.p
              {...fade(2)}
              className="mb-8 text-lg leading-relaxed text-zen-ink/70 dark:text-white/70"
            >
              <Trans>CertZen replica las condiciones exactas del examen: preguntas aleatorias, cronómetro real y feedback inmediato. Más del 85% de los usuarios que practican 5+ exámenes aprueban en su primer intento.</Trans>
            </motion.p>
            <motion.div {...fade(3)} className="flex flex-wrap items-center justify-center gap-3">
              <GlassButton to="/register" className="px-6 text-base">
                <Zap size={16} />
                <Trans>Empezar gratis</Trans>
              </GlassButton>
              <GlassButton to="/" variant="secondary" className="px-6 text-base">
                <Trans>Ver simuladores</Trans> <ChevronRight size={15} />
              </GlassButton>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              {...fade(0)}
              id="how-heading"
              className="mb-12 text-center text-2xl font-extrabold tracking-tight sm:text-3xl"
            >
              <Trans>Cómo funciona</Trans>
            </motion.h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
              {STEPS.map((step, i) => (
                <motion.li key={step.num} {...fade(i)}>
                  <GlassCard className="h-full p-5">
                    <span className="mb-2 block text-3xl font-extrabold text-zen/50 dark:text-indigo-300/50" aria-hidden="true">
                      {step.num}
                    </span>
                    <h3 className="mb-1 text-sm font-semibold">{step.title}</h3>
                    <p className="text-xs leading-relaxed text-zen-ink/70 dark:text-white/60">{step.body}</p>
                  </GlassCard>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="features-heading" className="px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              {...fade(0)}
              id="features-heading"
              className="mb-2 text-center text-2xl font-extrabold tracking-tight sm:text-3xl"
            >
              <Trans>Todo lo que necesitas para aprobar</Trans>
            </motion.h2>
            <motion.p {...fade(1)} className="mb-10 text-center text-sm text-zen-ink/70 dark:text-white/60">
              <Trans>Diseñado por profesionales certificados, para profesionales que quieren serlo.</Trans>
            </motion.p>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {FEATURES.map((f, i) => (
                <motion.li key={f.title} {...fade(i)}>
                  <GlassCard className="h-full p-5">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-zen/30 bg-zen/15 text-zen dark:bg-zen/25 dark:text-indigo-300" aria-hidden="true">
                      <f.icon size={18} />
                    </div>
                    <h3 className="mb-1 text-sm font-semibold">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-zen-ink/70 dark:text-white/60">{f.body}</p>
                  </GlassCard>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="px-4 py-20">
          <motion.div {...fade(0)} className="mx-auto max-w-2xl">
            <GlassCard className="p-10 text-center">
              <h2 id="cta-heading" className="mb-3 text-2xl font-extrabold tracking-tight">
                <Trans>¿Listo para aprobar tu certificación?</Trans>
              </h2>
              <p className="mb-6 text-sm text-zen-ink/70 dark:text-white/60">
                <Trans>Únete de forma gratuita. Sin tarjeta de crédito requerida.</Trans>
              </p>
              <GlassButton to="/register" className="mx-auto w-fit px-6 text-base">
                <Zap size={16} />
                <Trans>Crear cuenta gratis</Trans>
              </GlassButton>
            </GlassCard>
          </motion.div>
        </section>
      </main>
    </PublicLayout>
  );
}
