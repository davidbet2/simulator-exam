import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import {
  BookOpen, BarChart2, ArrowRight,
  LayoutDashboard, User, Zap, Sparkles, CheckCircle2,
  Shield, Target,
} from 'lucide-react';
import { useAuthStore } from '../../core/store/useAuthStore';
import { useUserPlan } from '../plans/hooks/useUserPlan';
import { PageSEO } from '../../components/seo/PageSEO';
import { Footer } from '../../components/layout/Footer';
import { ZenDolphin } from '../../components/mascot/ZenDolphin';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

// â”€â”€â”€ Features list â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FEATURES = [
  {
    icon: Target,
    title: 'Simulación Real',
    description: 'Formato similar al examen oficial: cronómetro, navegación libre y revisión de errores al finalizar.',
    color: 'bg-brand-50 text-brand-600',
  },
  {
    icon: BookOpen,
    title: 'Banco Oficial',
    description: 'Preguntas basadas en el contenido real, organizadas por dominio y nivel de dificultad.',
    color: 'bg-sky-50 text-sky-600',
  },
  {
    icon: BarChart2,
    title: 'Progreso Inteligente',
    description: 'Registra cada intento, identifica tus debilidades y construye confianza antes del día del examen.',
    color: 'bg-amber-50 text-amber-600',
  },
];

// â”€â”€â”€ Social proof numbers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATS = [
  { value: '3',    label: 'Modos de práctica', emoji: '🎯' },
  { value: 'Multi', label: 'Certificaciones',   emoji: '🏅' },
  { value: 'Pro',  label: 'Sin límites',         emoji: '🚀' },
];

// â”€â”€â”€ Trust items â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TRUST = [
  'Acceso inmediato',
  'Progreso guardado',
  'Plan gratuito disponible',
];

// â”€â”€â”€ Animation variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

// â”€â”€â”€ Illustrated floating shapes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FloatingShape({ className, delay = 0, duration = 7 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -18, 0], rotate: [0, 4, 0, -4, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// â”€â”€â”€ Exam launch card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ─── Practice modes ──────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'exam',
    emoji: '🎯',
    title: 'Modo Examen',
    description: 'Cronómetro real, navegación libre entre preguntas y revisión completa de errores al finalizar. El formato exacto del día del examen.',
    tag: 'Más usado',
    tagColor: 'bg-brand-100 text-brand-700 border-brand-200',
    border: 'border-brand-200',
    bg: 'bg-brand-50',
    iconBg: 'bg-brand-100 text-brand-600',
    btn: 'bg-brand-500 hover:bg-brand-600',
    available: true,
  },
  {
    id: 'study',
    emoji: '📖',
    title: 'Modo Estudio',
    description: 'Sin cronómetro. Confirma cada respuesta y ve al instante si acertaste. Explicación incluida para cada pregunta.',
    tag: 'Para aprender',
    tagColor: 'bg-sky-100 text-sky-700 border-sky-200',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-100 text-sky-600',
    btn: 'bg-sky-500 hover:bg-sky-400',
    available: true,
  },
  {
    id: 'flashcards',
    emoji: '🃏',
    title: 'Flashcards',
    description: 'Repasa concepto a concepto con tarjetas interactivas de término-definición. Desliza para avanzar.',
    tag: 'Próximamente',
    tagColor: 'bg-amber-100 text-amber-700 border-amber-200',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
    btn: '',
    available: false,
  },
  {
    id: 'quick',
    emoji: '⚡',
    title: 'Repaso Rápido',
    description: '10 preguntas aleatorias con retroalimentación inmediata. Ideal para repasar en menos de 5 minutos.',
    tag: 'Próximamente',
    tagColor: 'bg-violet-100 text-violet-700 border-violet-200',
    border: 'border-violet-200',
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-100 text-violet-600',
    btn: '',
    available: false,
  },
];

// ─── Mode card ────────────────────────────────────────────────────────────────
function ModeCard({ mode, onLaunch }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={mode.available ? { y: -6, scale: 1.01 } : {}}
      whileTap={mode.available ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      className={`relative flex flex-col rounded-3xl border-2 ${mode.bg} ${mode.border}
        p-6 shadow-card transition-all duration-300
        ${mode.available ? 'hover:shadow-card-hover cursor-pointer' : 'opacity-60 cursor-default'}`}
      onClick={() => mode.available && onLaunch(mode.id)}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${mode.iconBg}`}>
          {mode.emoji}
        </div>
        <span className={`text-[11px] font-black border px-2.5 py-0.5 rounded-full ${mode.tagColor}`}>
          {mode.tag}
        </span>
      </div>
      <h3 className="font-display font-black text-ink text-lg leading-snug mb-2">
        {mode.title}
      </h3>
      <p className="text-ink-soft text-sm leading-relaxed font-semibold flex-1 mb-5">
        {mode.description}
      </p>
      {mode.available ? (
        <div className={`flex items-center justify-center gap-2 rounded-2xl
                         ${mode.btn} text-white text-sm font-black py-2.5 px-4
                         transition-colors duration-200`}>
          Probar demo <ArrowRight size={13} />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl
                        bg-surface-muted text-ink-muted text-sm font-bold py-2.5 px-4 border border-surface-border">
          Próximamente
        </div>
      )}
    </motion.div>
  );
}

export function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { remaining, isPro, isLoading: planLoading } = useUserPlan();
  const [_showGate, _setShowGate]   = useState(false);
  const [mascotMood, setMascotMood] = useState('default');

  function launchMode(modeId) {
    navigate(`/exam?cert=demo&mode=${modeId}`);
  }

  return (
    <ParallaxProvider>
      <PageSEO
        title="Simuladores de Certificación Profesional"
        description="Prepárate para tus certificaciones con simuladores reales, banco de preguntas oficial y seguimiento de progreso. Gratis para empezar."
        canonical="/"
      />

      <div className="min-h-screen" style={{ backgroundColor: '#f8f7f4' }}>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HEADER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <header className="sticky top-0 z-20 border-b border-surface-border bg-white/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="CertZen inicio">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-brand">
                <span className="text-white font-black text-xs leading-none">CZ</span>
              </div>
              <span className="text-xl font-display font-black text-ink tracking-tight">
                Cert<span className="text-brand-500">Zen</span>
              </span>
            </Link>

            {/* Nav right */}
            <nav className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  {!isPro && !planLoading && (
                    <Link to="/pricing">
                      <Badge variant="pro"><Zap size={10} className="mr-1" />Pro</Badge>
                    </Link>
                  )}
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard size={14} />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="ghost" size="sm">
                      <User size={14} />
                      <span className="hidden sm:inline">Perfil</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Ingresar</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">
                      Registro gratis
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="outline-none">

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <section
            className="relative overflow-hidden min-h-[90vh] flex items-center py-20 sm:py-28"
            style={{ background: 'linear-gradient(165deg, #f0f9ff 0%, #f8f7f4 45%, #fefce8 100%)' }}
          >
            {/* Parallax blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <Parallax speed={-8} className="absolute -top-24 -left-24 w-[520px] h-[520px]">
                <div className="w-full h-full rounded-full"
                     style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.20) 0%, transparent 70%)' }} />
              </Parallax>
              <Parallax speed={-5} className="absolute top-[20%] -right-20 w-[380px] h-[380px]">
                <div className="w-full h-full rounded-full"
                     style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.16) 0%, transparent 70%)' }} />
              </Parallax>
              <Parallax speed={-10} className="absolute -bottom-20 left-[25%] w-[350px] h-[350px]">
                <div className="w-full h-full rounded-full"
                     style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.14) 0%, transparent 70%)' }} />
              </Parallax>

              {/* Floating illustrated shapes */}
              <FloatingShape className="absolute top-[15%] left-[8%] w-14 h-14 rounded-3xl bg-brand-200 opacity-60" delay={0} duration={6} />
              <FloatingShape className="absolute top-[55%] right-[10%] w-10 h-10 rounded-full bg-sky-200/60" delay={1.5} duration={7.5} />
              <FloatingShape className="absolute bottom-[20%] left-[18%] w-8 h-8 rounded-2xl bg-amber-200/70" delay={0.8} duration={5.5} />
              <FloatingShape className="absolute top-[35%] right-[22%] w-12 h-12 rounded-full bg-violet-200/40" delay={2} duration={8} />
              <FloatingShape className="absolute top-[70%] right-[35%] w-6 h-6 rounded-xl bg-brand-300/50" delay={3} duration={6.5} />

              {/* Subtle dot grid */}
              <div className="absolute inset-0 dot-grid opacity-35" />
            </div>

            {/* Hero content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left â€” text */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 mb-6"
                  >
                    <span className="inline-flex items-center gap-2 rounded-full border border-brand-200
                                     bg-brand-50 px-4 py-1.5 text-xs font-black text-brand-600 tracking-wider uppercase">
                      <Sparkles size={10} />
                      Simulador de Certificaciones
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.08 }}
                    className="font-display font-black text-ink leading-[1.05] tracking-tight
                               text-5xl sm:text-6xl md:text-7xl mb-6"
                  >
                    Aprueba con{' '}
                    <span className="relative inline-block">
                      <span className="text-gradient-brand">confianza</span>
                      <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden="true">
                        <path d="M2 8 C30 2, 60 12, 90 6 C120 0, 150 10, 198 5"
                              stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.65"/>
                      </svg>
                    </span>
                    .
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.16 }}
                    className="text-ink-soft text-base sm:text-lg leading-relaxed mb-8 max-w-md font-semibold"
                  >
                    Simuladores con el formato similar del examen, banco de preguntas
                    y seguimiento de progreso. Gratis para empezar hoy.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.24 }}
                    className="flex flex-col sm:flex-row items-start gap-3 mb-10"
                  >
                    {!user && (
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600
                                   active:scale-[0.97] text-white font-black text-base px-8 py-3.5
                                   shadow-brand-lg transition-all duration-200"
                      >
                        Empezar gratis
                        <ArrowRight size={16} />
                      </Link>
                    )}
                    <a
                      href="#simuladores"
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-surface-border
                                 bg-white hover:bg-surface-soft hover:border-surface-border-bright
                                 text-ink font-bold text-base px-7 py-3.5
                                 transition-all duration-200 shadow-card"
                    >
                      Ver simuladores
                    </a>
                    {user && !isPro && !planLoading && remaining <= 1 && (
                      <Link
                        to="/pricing"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-amber-300
                                   bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold
                                   text-base px-7 py-3.5 transition-all duration-200"
                      >
                        <Zap size={14} /> Actualizar a Pro
                      </Link>
                    )}
                  </motion.div>

                  <motion.ul
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.32 }}
                    className="flex flex-wrap gap-x-5 gap-y-2"
                  >
                    {TRUST.map((item) => (
                      <li key={item} className="flex items-center gap-1.5 text-xs text-ink-soft font-bold">
                        <CheckCircle2 size={13} className="text-brand-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </motion.ul>
                </div>

                {/* Right â€” mascot + stats */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.18 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div
                    className="relative cursor-pointer select-none"
                    onMouseEnter={() => setMascotMood('happy')}
                    onMouseLeave={() => setMascotMood('default')}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 rounded-full bg-brand-200 blur-3xl opacity-55 scale-75" />
                    <ZenDolphin size={220} mood={mascotMood} />
                  </div>

                  <div className="grid grid-cols-3 gap-0 bg-white rounded-3xl border border-surface-border
                                  shadow-card w-full max-w-sm overflow-hidden">
                    {STATS.map(({ value, label, emoji }, i) => (
                      <div
                        key={label}
                        className={`p-5 text-center ${i < STATS.length - 1 ? 'border-r border-surface-border' : ''}`}
                      >
                        <div className="text-xl mb-1">{emoji}</div>
                        <div className="font-black text-ink text-xl leading-none">{value}</div>
                        <div className="text-ink-soft text-xs mt-1 font-bold leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Hero bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
              <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                <path d="M0,32 C320,64 720,0 1440,32 L1440,64 L0,64 Z" fill="#f8f7f4" />
              </svg>
            </div>
          </section>

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• FEATURES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
            <Parallax speed={3}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-14"
              >
                <h2 className="font-display font-black text-3xl sm:text-4xl text-ink mb-3 tracking-tight">
                  Todo lo que necesitas{' '}
                  <span className="text-gradient-brand">para aprobar</span>
                </h2>
                <p className="text-ink-soft text-sm sm:text-base max-w-lg mx-auto font-semibold">
                  Sin distracciones. Solo las herramientas que te acercan a tu certificación.
                </p>
              </motion.div>
            </Parallax>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {FEATURES.map(({ icon: Icon, title, description, color }) => (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                  className="rounded-3xl border border-surface-border bg-white p-8
                              shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-black text-ink text-xl leading-snug mb-3">{title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed font-semibold">{description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• SIMULATORS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          <section
            id="simuladores"
            className="py-20 px-4 sm:px-6 scroll-mt-20 relative overflow-hidden bg-white"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <Parallax speed={-4} className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px]">
                <div className="w-full h-full rounded-full opacity-50"
                     style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.18) 0%, transparent 70%)' }} />
              </Parallax>
              <Parallax speed={-6} className="absolute bottom-[-60px] left-[-60px] w-[350px] h-[350px]">
                <div className="w-full h-full rounded-full opacity-50"
                     style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.16) 0%, transparent 70%)' }} />
              </Parallax>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <h2 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight mb-2">
                  Elige tu{' '}
                  <span className="text-gradient-brand">modo de práctica</span>
                </h2>
                <p className="text-ink-soft text-sm sm:text-base font-semibold">
                  Prueba cada modo con preguntas de ejemplo. Regístrate para acceder a exámenes completos.
                </p>
              </motion.div>

              {/* Mode cards grid */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {MODES.map((mode) => (
                  <ModeCard key={mode.id} mode={mode} onLaunch={launchMode} />
                ))}
              </motion.div>

              <div className="flex items-center justify-between text-xs text-ink-soft mt-10 pt-8
                              border-t border-surface-border">
                <Link to="/explore" className="flex items-center gap-1.5 hover:text-ink transition-colors font-bold">
                  <BookOpen size={12} /> Explorar sets de la comunidad
                </Link>
                <a href="/admin/login" className="hover:text-ink-soft transition-colors">Administrador</a>
              </div>
            </div>
          </section>

          {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• CTA (non-logged) â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
          {!user && (
            <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <Parallax speed={-5} className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]">
                  <div className="w-full h-full"
                       style={{ background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.12) 0%, transparent 70%)' }} />
                </Parallax>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center relative z-10"
              >
                <div className="rounded-3xl border-2 border-brand-200 bg-white
                                shadow-card-lift px-8 py-12 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 to-transparent pointer-events-none" aria-hidden="true" />
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <ZenDolphin size={100} mood="happy" bob={false} />
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 text-brand-700
                                    text-xs font-black px-4 py-1 mb-4">
                      <Shield size={11} /> Freemium · Plan gratuito disponible
                    </div>
                    <h2 className="font-display font-black text-3xl sm:text-4xl text-ink mb-3">
                      Empieza gratis hoy
                    </h2>
                    <p className="text-ink-soft text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed font-semibold">
                      Crea tu cuenta en segundos y practica con simuladores reales.
                      Plan gratuito para siempre. Actualiza cuando lo necesites.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 hover:bg-brand-600
                                   active:scale-[0.97] text-white font-black text-base px-8 py-3.5
                                   shadow-brand-lg transition-all duration-200 w-full sm:w-auto justify-center"
                      >
                        Crear cuenta gratis
                        <ArrowRight size={16} />
                      </Link>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 rounded-2xl border-2 border-surface-border
                                   bg-surface-soft hover:bg-surface-muted text-ink font-bold
                                   text-base px-7 py-3.5 transition-all duration-200
                                   w-full sm:w-auto justify-center"
                      >
                        Ya tengo cuenta
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          )}

        </main>

      </div>
      <Footer />
    </ParallaxProvider>
  );
}