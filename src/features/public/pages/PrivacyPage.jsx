import { Link } from 'react-router-dom';
import { PageSEO } from '../../../components/seo/PageSEO';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';

const LAST_UPDATED = '13 de abril de 2026';

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="mb-10">
      <h2 id={id} className="mb-3 border-b border-glass-light-border pb-2 text-lg font-bold dark:border-glass-dark-border">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-zen-ink/80 dark:text-white/70">
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <PublicLayout>
      <PageSEO
        title="Política de Privacidad"
        description="Conoce cómo CertZen recopila, usa y protege tu información personal. Última actualización: abril 2026."
        canonical="/privacy"
      />

      <div id="main-content" />

      <main id="privacy-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Política de Privacidad</h1>
          <p className="text-sm text-zen-ink/60 dark:text-white/50">Última actualización: {LAST_UPDATED}</p>
        </header>

        <GlassCard variant="elevated" className="space-y-0 p-6 sm:p-8">
          <Section id="intro" title="1. Introducción">
            <p>
              CertZen (&ldquo;nosotros&rdquo;, &ldquo;nos&rdquo; o &ldquo;nuestro&rdquo;) respeta tu privacidad y se
              compromete a proteger tus datos personales. Esta política describe qué información recopilamos,
              cómo la usamos y tus derechos al respecto.
            </p>
            <p>
              Al crear una cuenta o usar la plataforma, aceptas los términos de esta Política de Privacidad.
            </p>
          </Section>

          <Section id="data-collected" title="2. Datos que recopilamos">
            <p><strong className="font-semibold text-zen-ink dark:text-white">Datos que tú proporcionas:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Dirección de correo electrónico (para autenticación)</li>
              <li>Nombre o apodo (opcional, para personalizar tu perfil)</li>
              <li>Preguntas y sets de examen que crees en la plataforma</li>
            </ul>
            <p className="mt-2"><strong className="font-semibold text-zen-ink dark:text-white">Datos generados automáticamente:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Historial de intentos (puntuación, fecha, certificación, modo)</li>
              <li>Preferencias de uso almacenadas localmente en tu navegador (<code className="bg-glass-light-2 dark:bg-glass-dark-2 px-1 rounded text-xs">sessionStorage</code>)</li>
            </ul>
            <p className="mt-2">
              <strong className="font-semibold text-zen-ink dark:text-white">No recopilamos:</strong> datos de pago directamente (procesados por Dodo Payments con su propia política), ubicación precisa, ni identificadores biométricos.
            </p>
          </Section>

          <Section id="data-use" title="3. Cómo usamos tus datos">
            <ul className="list-disc ml-5 space-y-1">
              <li>Proveer y mejorar los servicios de la plataforma</li>
              <li>Mostrar tu historial de intentos y estadísticas de rendimiento</li>
              <li>Enviarte correos transaccionales (confirmación de cuenta, recuperación de contraseña)</li>
              <li>Detectar y prevenir usos fraudulentos o abusivos</li>
              <li>Cumplir obligaciones legales aplicables</li>
            </ul>
            <p>
              <strong className="font-semibold text-zen-ink dark:text-white">No vendemos ni alquilamos</strong> tu información personal a terceros.
              No usamos tus datos para publicidad comportamental de terceros.
            </p>
          </Section>


          <Section id="retention" title="4. Retención de datos">
            <p>
              Conservamos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de tu cuenta,
              borraremos tus datos personales en un plazo máximo de <strong className="font-semibold text-zen-ink dark:text-white">30 días</strong>,
              excepto aquellos que debamos conservar por obligación legal.
            </p>
          </Section>

          <Section id="cookies" title="5. Cookies y almacenamiento local">
            <p>
              CertZen <strong className="font-semibold text-zen-ink dark:text-white">no utiliza cookies de seguimiento ni publicidad</strong>.
              Usamos exclusivamente:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li><code className="bg-glass-light-2 dark:bg-glass-dark-2 px-1 rounded text-xs">sessionStorage</code>: para guardar el progreso de un examen en curso (se borra al cerrar el navegador)</li>
              
            </ul>
          </Section>

          <Section id="rights" title="6. Tus derechos">
            <p>Dependiendo de tu jurisdicción, tienes derecho a:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong className="font-semibold text-zen-ink dark:text-white">Acceso</strong>: solicitar una copia de tus datos</li>
              <li><strong className="font-semibold text-zen-ink dark:text-white">Rectificación</strong>: corregir datos inexactos</li>
              <li><strong className="font-semibold text-zen-ink dark:text-white">Eliminación</strong>: solicitar el borrado de tu cuenta y datos</li>
              <li><strong className="font-semibold text-zen-ink dark:text-white">Portabilidad</strong>: recibir tus datos en formato estructurado</li>
              <li><strong className="font-semibold text-zen-ink dark:text-white">Oposición</strong>: oponerte al procesamiento de tus datos</li>
            </ul>
            <p>Para ejercer cualquiera de estos derechos, contáctanos en <a href="mailto:privacy@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">privacy@certzen.app</a>.</p>
          </Section>

          <Section id="changes" title="7. Cambios a esta política">
            <p>
              Notificaremos cambios materiales con al menos <strong className="font-semibold text-zen-ink dark:text-white">14 días de anticipación</strong>
              {' '}por correo electrónico o mediante aviso destacado en la plataforma. El uso continuado
              de la plataforma después de dichos cambios constituye aceptación.
            </p>
          </Section>

          <Section id="contact-privacy" title="8. Contacto">
            <p>
              Para preguntas sobre privacidad: <a href="mailto:privacy@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">privacy@certzen.app</a>
            </p>
          </Section>
        </GlassCard>
      </main>

    </PublicLayout>
  );
}
