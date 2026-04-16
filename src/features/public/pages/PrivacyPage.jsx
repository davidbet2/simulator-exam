import { Link } from 'react-router-dom';
import { PageSEO } from '../../../components/seo/PageSEO';
import { Footer } from '../../../components/layout/Footer';

const LAST_UPDATED = '13 de abril de 2026';

function Section({ id, title, children }) {
  return (
    <section aria-labelledby={id} className="mb-10">
      <h2 id={id} className="text-lg font-display font-bold text-ink mb-3 pb-2 border-b border-surface-border">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-ink-soft leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageSEO
        title="Política de Privacidad"
        description="Conoce cómo CertZen recopila, usa y protege tu información personal. Última actualización: abril 2026."
        canonical="/privacy"
      />

      <div id="main-content" />

      <header className="border-b border-surface-border bg-surface-soft/60 backdrop-blur-md sticky top-0 z-10" role="banner">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-display font-bold text-gradient-brand" aria-label="CertZen — inicio">
            CertZen
          </Link>
          <Link to="/" className="text-sm text-ink-soft hover:text-ink transition-colors">← Volver al inicio</Link>
        </div>
      </header>

      <main id="privacy-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Política de Privacidad</h1>
          <p className="text-sm text-ink-soft">Última actualización: {LAST_UPDATED}</p>
        </header>

        <div className="glass rounded-2xl border border-surface-border p-6 sm:p-8 space-y-0">
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
            <p><strong className="text-ink-soft">Datos que tú proporcionas:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Dirección de correo electrónico (para autenticación)</li>
              <li>Nombre o apodo (opcional, para personalizar tu perfil)</li>
              <li>Preguntas y sets de examen que crees en la plataforma</li>
            </ul>
            <p className="mt-2"><strong className="text-ink-soft">Datos generados automáticamente:</strong></p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Historial de intentos (puntuación, fecha, certificación, modo)</li>
              <li>Preferencias de uso almacenadas localmente en tu navegador (<code className="bg-surface-muted px-1 rounded text-xs">sessionStorage</code>)</li>
              <li>Logs de autenticación (gestionados por Firebase Authentication)</li>
            </ul>
            <p className="mt-2">
              <strong className="text-ink-soft">No recopilamos:</strong> datos de pago directamente (procesados por Stripe con su propia política), ubicación precisa, ni identificadores biométricos.
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
              <strong className="text-ink-soft">No vendemos ni alquilamos</strong> tu información personal a terceros.
              No usamos tus datos para publicidad comportamental de terceros.
            </p>
          </Section>

          <Section id="storage" title="4. Almacenamiento y seguridad">
            <p>
              Tus datos se almacenan en <strong className="text-ink-soft">Google Firebase (Firestore)</strong>,
              con servidores en la región <code className="bg-surface-muted px-1 rounded text-xs">us-central1</code>.
              Firebase cumple con SOC 2 Tipo II, ISO 27001 y es compatible con GDPR.
            </p>
            <p>
              Toda comunicación se realiza mediante <strong className="text-ink-soft">HTTPS/TLS 1.3</strong>.
              Las contraseñas no se almacenan en texto plano — Firebase Authentication las gestiona con
              hashing seguro (bcrypt) de forma interna.
            </p>
          </Section>

          <Section id="retention" title="5. Retención de datos">
            <p>
              Conservamos tus datos mientras tu cuenta esté activa. Si solicitas la eliminación de tu cuenta,
              borraremos tus datos personales en un plazo máximo de <strong className="text-ink-soft">30 días</strong>,
              excepto aquellos que debamos conservar por obligación legal.
            </p>
          </Section>

          <Section id="cookies" title="6. Cookies y almacenamiento local">
            <p>
              CertZen <strong className="text-ink-soft">no utiliza cookies de seguimiento ni publicidad</strong>.
              Usamos exclusivamente:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li><code className="bg-surface-muted px-1 rounded text-xs">sessionStorage</code>: para guardar el progreso de un examen en curso (se borra al cerrar el navegador)</li>
              <li>Firebase Auth persiste el token de sesión en <code className="bg-surface-muted px-1 rounded text-xs">localStorage</code> de forma segura</li>
            </ul>
          </Section>

          <Section id="rights" title="7. Tus derechos">
            <p>Dependiendo de tu jurisdicción, tienes derecho a:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong className="text-ink-soft">Acceso</strong>: solicitar una copia de tus datos</li>
              <li><strong className="text-ink-soft">Rectificación</strong>: corregir datos inexactos</li>
              <li><strong className="text-ink-soft">Eliminación</strong>: solicitar el borrado de tu cuenta y datos</li>
              <li><strong className="text-ink-soft">Portabilidad</strong>: recibir tus datos en formato estructurado</li>
              <li><strong className="text-ink-soft">Oposición</strong>: oponerte al procesamiento de tus datos</li>
            </ul>
            <p>Para ejercer cualquiera de estos derechos, contáctanos en <a href="mailto:privacy@certzen.app" className="text-brand-600 hover:text-brand-700 underline">privacy@certzen.app</a>.</p>
          </Section>

          <Section id="changes" title="8. Cambios a esta política">
            <p>
              Notificaremos cambios materiales con al menos <strong className="text-ink-soft">14 días de anticipación</strong>
              {' '}por correo electrónico o mediante aviso destacado en la plataforma. El uso continuado
              de la plataforma después de dichos cambios constituye aceptación.
            </p>
          </Section>

          <Section id="contact-privacy" title="9. Contacto">
            <p>
              Para preguntas sobre privacidad: <a href="mailto:privacy@certzen.app" className="text-brand-600 hover:text-brand-700 underline">privacy@certzen.app</a>
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </>
  );
}
