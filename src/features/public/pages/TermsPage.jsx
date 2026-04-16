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

export function TermsPage() {
  return (
    <>
      <PageSEO
        title="Términos de Uso"
        description="Lee los términos y condiciones de uso de CertZen. Al usar la plataforma aceptas estos términos."
        canonical="/terms"
      />

      <div id="main-content" />

      <header className="border-b border-surface-border bg-white/90 backdrop-blur-xl sticky top-0 z-20" role="banner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="CertZen inicio">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-xs leading-none">CZ</span>
            </div>
            <span className="text-xl font-display font-black text-ink tracking-tight">
              Cert<span className="text-brand-500">Zen</span>
            </span>
          </Link>
          <Link to="/" className="text-sm text-ink-soft hover:text-ink transition-colors">← Volver al inicio</Link>
        </div>
      </header>

      <main id="terms-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Términos de Uso</h1>
          <p className="text-sm text-ink-soft">Última actualización: {LAST_UPDATED}</p>
        </header>

        <div className="glass rounded-2xl border border-surface-border p-6 sm:p-8 space-y-0">
          <Section id="acceptance" title="1. Aceptación de los términos">
            <p>
              Al acceder o usar CertZen (&ldquo;la Plataforma&rdquo;), aceptas quedar vinculado por estos
              Términos de Uso. Si no estás de acuerdo, no uses la Plataforma.
            </p>
          </Section>

          <Section id="service" title="2. Descripción del servicio">
            <p>
              CertZen es una plataforma web de simulación de exámenes de certificación profesional.
              Ofrecemos:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Simuladores de exámenes con preguntas de práctica</li>
              <li>Seguimiento de progreso y estadísticas de rendimiento</li>
              <li>Creación y compartición de sets de preguntas por la comunidad</li>
            </ul>
            <p>
              CertZen <strong className="text-ink-soft">no está afiliado ni patrocinado</strong> por ningún proveedor de certificaciones
              (incluyendo sus marcas, productos y exámenes oficiales). Las preguntas son creadas con fines educativos.
            </p>
          </Section>

          <Section id="account" title="3. Cuentas de usuario">
            <p>Para usar funciones protegidas debes crear una cuenta. Eres responsable de:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Mantener la confidencialidad de tu contraseña</li>
              <li>Todas las actividades realizadas desde tu cuenta</li>
              <li>Notificarnos inmediatamente ante cualquier uso no autorizado</li>
            </ul>
            <p>
              Debes tener al menos <strong className="text-ink-soft">18 años</strong> para crear una cuenta,
              o contar con el consentimiento de un tutor legal.
            </p>
          </Section>

          <Section id="plans" title="4. Planes y pagos">
            <p>
              CertZen ofrece un <strong className="text-ink-soft">plan gratuito</strong> con 3 exámenes por mes
              y un <strong className="text-ink-soft">plan Pro</strong> de pago con acceso ilimitado.
            </p>
            <p>
              Los pagos son procesados por <strong className="text-ink-soft">Stripe</strong> de forma segura.
              CertZen no almacena datos de tarjetas de crédito. Los precios pueden cambiar con
              30 días de aviso previo a suscriptores activos.
            </p>
            <p>
              Los reembolsos se evalúan caso por caso dentro de los <strong className="text-ink-soft">7 días</strong>
              {' '}siguientes al cargo. Contáctanos en <a href="mailto:support@certzen.app" className="text-brand-600 hover:text-brand-700 underline">support@certzen.app</a>.
            </p>
          </Section>

          <Section id="content" title="5. Contenido de usuario">
            <p>
              Al publicar preguntas, sets o cualquier contenido en la Plataforma, garantizas que:
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Tienes los derechos necesarios para compartir dicho contenido</li>
              <li>El contenido no infringe derechos de autor de terceros</li>
              <li>El contenido no contiene información confidencial de exámenes obtenida de forma irregular (&ldquo;brain dumps&rdquo;)</li>
            </ul>
            <p>
              Nos reservamos el derecho de eliminar contenido que viole estas condiciones sin previo aviso.
            </p>
          </Section>

          <Section id="prohibited" title="6. Usos prohibidos">
            <p>Queda prohibido:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Intentar acceder sin autorización a cuentas de otros usuarios o sistemas</li>
              <li>Usar scraping, bots o herramientas automatizadas para extraer contenido masivamente</li>
              <li>Publicar &ldquo;brain dumps&rdquo; o preguntas filtradas de exámenes reales</li>
              <li>Revender o redistribuir el contenido de la plataforma sin autorización escrita</li>
              <li>Usar la plataforma para actividades ilegales o que violen derechos de terceros</li>
            </ul>
          </Section>

          <Section id="disclaimer" title="7. Limitación de responsabilidad">
            <p>
              CertZen se proporciona &ldquo;tal cual&rdquo; sin garantías de ningún tipo.
              No garantizamos que el uso de la Plataforma resulte en la aprobación de ningún examen oficial.
              En ningún caso seremos responsables por daños indirectos, incidentales o consecuentes.
            </p>
          </Section>

          <Section id="ip" title="8. Propiedad intelectual">
            <p>
              El diseño, logo, código y contenido propietario de CertZen son propiedad de sus creadores
              y están protegidos por leyes de propiedad intelectual. No puedes copiar, distribuir ni
              modificar estos elementos sin autorización expresa.
            </p>
          </Section>

          <Section id="termination" title="9. Terminación">
            <p>
              Podemos suspender o terminar tu acceso si violas estos términos, con o sin previo aviso.
              Ante una terminación por nuestra parte sin causa justificada, reembolsaremos la parte
              proporcional de cualquier suscripción vigente.
            </p>
          </Section>

          <Section id="governing-law" title="10. Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de la <strong className="text-ink-soft">República de Colombia</strong>.
              Cualquier disputa se resolverá en los tribunales competentes de Medellín, Colombia,
              sin perjuicio de los derechos del consumidor que te apliquen en tu jurisdicción.
            </p>
          </Section>

          <Section id="contact-terms" title="11. Contacto">
            <p>
              Para preguntas sobre estos términos: <a href="mailto:legal@certzen.app" className="text-brand-600 hover:text-brand-700 underline">legal@certzen.app</a>
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </>
  );
}
