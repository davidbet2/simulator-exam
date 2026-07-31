/**
 * Per-domain SEO on-page copy (intro + FAQ) for /explore/:domain category pages.
 * Companion to `domains.js`, keyed by the same domain ids. Strings use the `msg`
 * macro so the extractor picks them up; resolve with `t(descriptor)` at render
 * time (see WelcomePage.jsx for the same pattern).
 *
 * Sparse by design — a domain with no entry here simply renders no intro/FAQ
 * section. Content sourced from memory/research/2026-07-31-seo-keyword-strategy.md.
 */
import { msg } from '@lingui/core/macro';

export const DOMAIN_SEO_CONTENT = {
  it: {
    intro: msg`Practica gratis para las certificaciones de IT y Cloud más buscadas: AWS Cloud Practitioner y Solutions Architect, Microsoft Azure Fundamentals (AZ-900), Google Cloud Digital Leader, Kubernetes (CKAD), Terraform Associate y CompTIA Network+. Preguntas basadas en las guías oficiales de cada examen, para que llegues seguro al día real.`,
    faq: [
      {
        q: msg`¿Los simulacros de IT están basados en exam guides oficiales?`,
        a: msg`Sí, cada set se construye a partir del temario y los exam guides públicos de la certificación correspondiente (AWS, Microsoft, Google, CompTIA, etc.), no de preguntas inventadas al azar.`,
      },
      {
        q: msg`¿Puedo practicar para AWS o Azure gratis sin registrarme?`,
        a: msg`Sí, puedes explorar y responder preguntas de práctica sin cuenta. Regístrate gratis solo si quieres guardar tu progreso y tus resultados.`,
      },
      {
        q: msg`¿Qué certificación de IT debería estudiar primero?`,
        a: msg`Si eres nuevo en la nube, AWS Cloud Practitioner o Azure Fundamentals (AZ-900) son los puntos de entrada más comunes. Si buscas fundamentos generales de IT, CompTIA Network+ es un buen inicio.`,
      },
    ],
  },
  security: {
    intro: msg`Simuladores gratuitos para las certificaciones de ciberseguridad más demandadas: CompTIA Security+, CEH (Certified Ethical Hacker), CISSP, OWASP Top 10 y fundamentos de SOC/Blue Team. Ideal para prepararte antes de presentar el examen oficial o para reforzar conceptos de seguridad ofensiva y defensiva.`,
    faq: [
      {
        q: msg`¿Cuál es la certificación de ciberseguridad más buscada para empezar?`,
        a: msg`CompTIA Security+ es la certificación de entrada más citada en listados de empleo de ciberseguridad, seguida de CEH para quienes buscan un perfil más ofensivo/pentesting.`,
      },
      {
        q: msg`¿Las preguntas de práctica cubren el examen real de Security+ o CEH?`,
        a: msg`Las preguntas están basadas en los dominios y objetivos oficiales publicados por CompTIA y EC-Council, no son las preguntas exactas del examen (que están protegidas por NDA), pero cubren los mismos temas y nivel de dificultad.`,
      },
    ],
  },
  agile: {
    intro: msg`Compara y practica para las certificaciones de gestión de proyectos y Agile más buscadas: PMP, Scrum Master (CSM/PSM I), ITIL 4 Foundation, CAPM, PRINCE2 y SAFe. Simulacros gratuitos para decidir qué certificación te conviene y prepararte para el examen oficial.`,
    faq: [
      {
        q: msg`¿PMP o Scrum Master: cuál certificación debería sacar primero?`,
        a: msg`PMP es más amplio y orientado a gestión de proyectos tradicional/híbrida; Scrum Master es específico de metodologías ágiles. Si trabajas en un equipo Scrum, empieza por ahí; si gestionas proyectos en general, PMP tiene mayor reconocimiento.`,
      },
      {
        q: msg`¿Necesito experiencia previa para presentar estos exámenes?`,
        a: msg`PMP requiere experiencia certificada en gestión de proyectos. CAPM, Scrum Master (PSM I) e ITIL Foundation no exigen experiencia previa, por lo que son buenos puntos de entrada.`,
      },
    ],
  },
  health: {
    intro: msg`Simulacros gratuitos de primeros auxilios, BLS/RCP, ACLS y fundamentos de salud. Preguntas de práctica en español, pensadas para quienes se preparan para certificaciones de soporte vital básico y avanzado o para reforzar conocimientos antes de una evaluación.`,
    faq: [
      {
        q: msg`¿Estos simulacros sirven para certificar BLS o primeros auxilios oficialmente?`,
        a: msg`No, son simuladores de práctica para reforzar conocimiento antes de tu certificación oficial (con una entidad acreditada). No otorgan una certificación válida por sí mismos.`,
      },
      {
        q: msg`¿Hay contenido de primeros auxilios en español?`,
        a: msg`Sí, el contenido de primeros auxilios está pensado específicamente para el público hispanohablante, con terminología y casos relevantes para Latinoamérica y España.`,
      },
    ],
  },
  english: {
    intro: msg`Evalúa tu nivel de inglés gratis según el Marco Común Europeo (CEFR, A1 a C2) y practica para IELTS, TOEFL iBT, Duolingo English Test y TOEIC. Preguntas de práctica en formato similar al examen oficial, ideales para saber en qué nivel estás antes de inscribirte a un examen real.`,
    faq: [
      {
        q: msg`¿Cómo sé en qué nivel de inglés estoy (A1 a C2)?`,
        a: msg`Puedes hacer uno de nuestros simulacros por nivel CEFR (A1-C2) gratis: tu desempeño te da una idea aproximada de tu nivel actual antes de inscribirte a un examen oficial como IELTS o TOEFL.`,
      },
      {
        q: msg`¿Qué diferencia hay entre IELTS, TOEFL y Duolingo English Test?`,
        a: msg`IELTS y TOEFL son los más aceptados para universidades e inmigración (Reino Unido/Australia/Canadá para IELTS, EE.UU. para TOEFL); Duolingo English Test es más rápido y económico, y cada vez más universidades lo aceptan.`,
      },
    ],
  },
  business: {
    intro: msg`Practica gratis para certificaciones de negocios y marketing digital: Google Analytics 4 (GA4), Google Ads Search, Salesforce Certified Platform Administrator, HubSpot y fundamentos de SEO y marketing digital. Preguntas basadas en los exámenes oficiales de cada plataforma.`,
    faq: [
      {
        q: msg`¿Las preguntas de GA4 o Google Ads están actualizadas?`,
        a: msg`Sí, el contenido se basa en el temario vigente de las certificaciones oficiales de Google Skillshop (GA4, Google Ads Search) y se actualiza cuando cambian los exámenes oficiales.`,
      },
      {
        q: msg`¿Qué certificación de marketing digital debería sacar primero?`,
        a: msg`Si trabajas con analítica web, Google Analytics 4 es el punto de partida más buscado. Si te dedicas a pauta digital, Google Ads Search es el más relevante.`,
      },
    ],
  },
  sports: {
    intro: msg`Simuladores gratuitos para certificaciones de entrenamiento y fitness: NSCA CSCS (Especialista en Fuerza y Acondicionamiento), CrossFit Level 1, Pilates y Yoga (RYT-200). Preguntas de práctica basadas en las guías oficiales de cada certificación.`,
    faq: [
      {
        q: msg`¿Estos simuladores sirven para certificarme oficialmente como entrenador?`,
        a: msg`No, son simuladores de práctica para reforzar conocimiento antes de presentar tu certificación oficial (NSCA, CrossFit, Yoga Alliance, etc.). No otorgan una certificación válida por sí mismos.`,
      },
      {
        q: msg`¿Qué certificación de entrenamiento físico es más reconocida?`,
        a: msg`Depende de tu especialidad: NSCA CSCS es la más reconocida para fuerza y acondicionamiento deportivo, CrossFit Level 1 para entrenamiento funcional, y Yoga Alliance RYT-200 para instructores de yoga.`,
      },
    ],
  },
  logic: {
    intro: msg`Practica gratis pruebas de razonamiento lógico, verbal y numérico, incluyendo simulacros tipo ICFES Saber Pro y pruebas psicotécnicas usadas en procesos de selección laboral y oposiciones. Ideal para prepararte antes de un examen de admisión o una prueba de selección.`,
    faq: [
      {
        q: msg`¿Estos simulacros sirven para prepararme para el ICFES Saber Pro?`,
        a: msg`Sí, tenemos simulacros enfocados en razonamiento cuantitativo y verbal con el mismo formato y nivel de dificultad que se usa en pruebas tipo ICFES Saber Pro.`,
      },
      {
        q: msg`¿Qué es una prueba psicotécnica y para qué se usa?`,
        a: msg`Es una evaluación de razonamiento lógico, verbal y numérico que muchas empresas y procesos de oposición usan para filtrar candidatos. Practicar con antelación ayuda a familiarizarte con el formato y mejorar tu tiempo de respuesta.`,
      },
    ],
  },
};
