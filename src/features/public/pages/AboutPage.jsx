import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Target, Zap, Shield, Users, Award, ChevronRight } from 'lucide-react';
import { PageSEO } from '../../../components/seo/PageSEO';
import { Footer } from '../../../components/layout/Footer';
import Button from '../../../components/ui/Button';
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

const buildFeatures = (t) => [
  {
    icon: BookOpen,
    title: t`Banco de preguntas`,
    body: t`Preguntas similares a los exámenes oficiales de certificación, organizadas por dominio y nivel de dificultad. Actualizadas constantemente.`,
    color: 'bg-brand-500/20 text-brand-600',
  },
  {
    icon: Target,
    title: t`Modo Examen & Modo Estudio`,
    body: t`En modo examen replicas las condiciones reales (cronómetro, preguntas aleatorias). En modo estudio confirmas cada respuesta y ves la explicación al instante.`,
    color: 'bg-success-500/20 text-success-400',
  },
  {
    icon: Zap,
    title: t`Progreso en tiempo real`,
    body: t`Dashboard con historial de intentos, puntuación promedio, tasa de aprobación y logros desbloqueables. Sabe exactamente dónde mejorar.`,
    color: 'bg-amber-500/20 text-amber-400',
  },
  {
    icon: Shield,
    title: t`Privacidad primero`,
    body: t`Sin publicidad con el plan pro. Tu historial de práctica es tuyo.`,
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    icon: Users,
    title: t`Comunidad y UGC`,
    body: t`Explora sets de preguntas creados por la comunidad. Comparte tus propios simulacros con otros profesionales.`,
    color: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    icon: Award,
    title: t`Freemium sin trampa`,
    body: t`3 exámenes gratis al mes para siempre. El plan gratuito incluye acceso completo al simulador. Pro desbloquea exámenes ilimitados e historial completo.`,
    color: 'bg-pink-500/20 text-pink-400',
  },
];

const buildSteps = (t) => [
  { num: '01', title: t`Crea tu cuenta gratis`,    body: t`Regístrate en 30 segundos con email. Plan freemium disponible.` },
  { num: '02', title: t`Elige tu certificación`,   body: t`Selecciona el examen de certificación que quieres practicar.` },
  { num: '03', title: t`Practica con propósito`,   body: t`Modo examen para simular el día real. Modo estudio para aprender de cada error.` },
  { num: '04', title: t`Aprueba con confianza`,    body: t`Revisa tu historial, identifica debilidades y presenta el examen oficial listo.` },
];

function fade(i) {
  return { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: i * 0.08, duration: 0.45 } };
}

export function AboutPage() {
  const { t } = useLingui();
  const FEATURES = buildFeatures(t);
  const STEPS = buildSteps(t);
  return (
    <>
      <PageSEO
        title={t`Sobre la plataforma`}
        description={t`CertZen es un simulador inteligente de certificaciones profesionales. Aprende cómo funciona, qué certificaciones cubre y por qué miles de profesionales confían en nosotros.`}
        canonical="/about"
        jsonLd={SITE_JSON_LD}
      />

      {/* Skip-target */}
      <div id="main-content" />

      {/* Header */}
      <header className="border-b border-surface-border bg-white/90 backdrop-blur-xl sticky top-0 z-20" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label={t`CertZen inicio`}>
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-xs leading-none">CZ</span>
            </div>
            <span className="text-xl font-display font-black text-ink tracking-tight">
              Cert<span className="text-brand-500">Zen</span>
            </span>
          </Link>
          <nav aria-label={t`Navegación principal`} className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm"><Trans>Ingresar</Trans></Button></Link>
            <Link to="/register"><Button size="sm"><Trans>Registro gratis</Trans></Button></Link>
          </nav>
        </div>
      </header>

      <main id="about-content" tabIndex={-1}>
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden py-20 px-4">
          {/* Background blobs */}
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-brand-600/15 blur-3xl animate-float" />
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl animate-float" style={{ animationDelay: '-4s' }} />
          </div>

          <div className="max-w-3xl mx-auto text-center relative">
            <motion.p
              {...fade(0)}
              className="inline-flex items-center gap-2 text-xs font-semibold bg-brand-500/15 text-brand-600 border border-brand-500/30 rounded-full px-4 py-1.5 mb-6"
            >
              <span role="img" aria-label="pin">📌</span> <Trans>Plataforma de certificación profesional</Trans>
            </motion.p>
            <motion.h1
              {...fade(1)}
              id="hero-heading"
              className="text-4xl sm:text-5xl font-display font-bold text-ink mb-5 leading-tight"
            >
              <Trans>Practica como si fuera</Trans>{' '}
              <span className="text-gradient-brand"><Trans>el día real</Trans></span>
            </motion.h1>
            <motion.p
              {...fade(2)}
              className="text-ink-soft text-lg leading-relaxed mb-8"
            >
              <Trans>CertZen replica las condiciones exactas del examen: preguntas aleatorias, cronómetro real y feedback inmediato. Más del 85% de los usuarios que practican 5+ exámenes aprueban en su primer intento.</Trans>
            </motion.p>
            <motion.div {...fade(3)} className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg">
                  <Zap size={16} />
                  <Trans>Empezar gratis</Trans>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg">
                  <Trans>Ver simuladores</Trans> <ChevronRight size={15} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              {...fade(0)}
              id="how-heading"
              className="text-2xl font-display font-bold text-ink text-center mb-12"
            >
              <Trans>Cómo funciona</Trans>
            </motion.h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
              {STEPS.map((step, i) => (
                <motion.li key={step.num} {...fade(i)} className="glass rounded-2xl border border-surface-border p-5">
                  <span className="block font-display font-bold text-3xl text-brand-500/40 mb-2" aria-hidden="true">
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-ink text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-ink-soft leading-relaxed">{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section aria-labelledby="features-heading" className="py-16 px-4 border-t border-surface-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              {...fade(0)}
              id="features-heading"
              className="text-2xl font-display font-bold text-ink text-center mb-2"
            >
              <Trans>Todo lo que necesitas para aprobar</Trans>
            </motion.h2>
            <motion.p {...fade(1)} className="text-ink-soft text-sm text-center mb-10">
              <Trans>Diseñado por profesionales certificados, para profesionales que quieren serlo.</Trans>
            </motion.p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
              {FEATURES.map((f, i) => (
                <motion.li key={f.title} {...fade(i)} className="glass rounded-2xl border border-surface-border p-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${f.color}`} aria-hidden="true">
                    <f.icon size={18} />
                  </div>
                  <h3 className="font-semibold text-ink text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-ink-soft leading-relaxed">{f.body}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="py-20 px-4">
          <motion.div
            {...fade(0)}
            className="max-w-2xl mx-auto glass-bright rounded-2xl border border-brand-500/30 shadow-glow-brand p-10 text-center"
          >
            <h2 id="cta-heading" className="text-2xl font-display font-bold text-ink mb-3">
              <Trans>¿Listo para aprobar tu certificación?</Trans>
            </h2>
            <p className="text-ink-soft text-sm mb-6">
              <Trans>Únete de forma gratuita. Sin tarjeta de crédito requerida.</Trans>
            </p>
            <Link to="/register">
              <Button size="lg">
                <Zap size={16} />
                <Trans>Crear cuenta gratis</Trans>
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
