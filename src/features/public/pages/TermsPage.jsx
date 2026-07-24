import { Link } from 'react-router-dom';
import { SEOHead } from '../../../components/SEOHead';
import { PublicLayout } from '../../../components/layout/PublicLayout';
import { GlassCard } from '../../../components/glass/GlassCard';

const LAST_UPDATED = '18 de abril de 2026';

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

export function TermsPage() {
  return (
    <PublicLayout>
      <SEOHead
        title="Términos de Uso"
        description="Lee los términos y condiciones de uso de CertZen. Al usar la plataforma aceptas estos términos."
        path="/terms"
      />

      <div id="main-content" />

      <main id="terms-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight">Términos de Uso</h1>
          <p className="text-sm text-zen-ink/60 dark:text-white/50">Última actualización: {LAST_UPDATED}</p>
        </header>

        <GlassCard variant="elevated" className="space-y-0 p-6 sm:p-8">
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
              CertZen <strong className="font-semibold text-zen-ink dark:text-white">no está afiliado ni patrocinado</strong> por ningún proveedor de certificaciones
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
              Debes tener al menos <strong className="font-semibold text-zen-ink dark:text-white">18 años</strong> para crear una cuenta,
              o contar con el consentimiento de un tutor legal.
            </p>
          </Section>

          <Section id="plans" title="4. Planes y pagos">
            <p>
              CertZen ofrece un <strong className="font-semibold text-zen-ink dark:text-white">plan gratuito</strong> con 3 exámenes por mes
              y un <strong className="font-semibold text-zen-ink dark:text-white">plan Pro</strong> de pago con acceso ilimitado.
            </p>
            <p>
              Los pagos son procesados por <strong className="font-semibold text-zen-ink dark:text-white">Dodo Payments</strong> de forma segura.
              CertZen no almacena datos de tarjetas de crédito. Los precios pueden cambiar con
              30 días de aviso previo a suscriptores activos.
            </p>
            <p>
              <strong className="font-semibold text-zen-ink dark:text-white">Todos los pagos son definitivos y no se realizan reembolsos</strong>,
              salvo donde la ley aplicable lo exija expresamente. Al completar un pago aceptas esta política.
              Para consultas sobre tu suscripción contáctanos en{' '}
              <a href="mailto:support@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">support@certzen.app</a>.
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
              La cancelación de tu cuenta no da derecho a reembolso alguno de los cargos ya realizados.
            </p>
          </Section>

          <Section id="governing-law" title="10. Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de la <strong className="font-semibold text-zen-ink dark:text-white">República de Colombia</strong>.
              Cualquier disputa se resolverá en los tribunales competentes de Medellín, Colombia,
              sin perjuicio de los derechos del consumidor que te apliquen en tu jurisdicción.
            </p>
          </Section>

          <Section id="contact-terms" title="11. Contacto">
            <p>
              Para preguntas sobre estos términos: <a href="mailto:legal@certzen.app" className="text-zen underline hover:text-zen-violet dark:text-indigo-300 dark:hover:text-indigo-200">legal@certzen.app</a>
            </p>
          </Section>
        </GlassCard>
      </main>

    </PublicLayout>
  );
}
