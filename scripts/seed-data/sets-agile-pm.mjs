/**
 * Agile / Project Management certification sets.
 *
 * SOURCES (public only):
 *   - Scrum Guide 2020 (scrumguides.org — Creative Commons BY-SA)
 *   - ITIL 4 Foundation syllabus (AXELOS public documentation summary)
 *   - PMBOK® Guide concepts publicly documented
 *
 * All questions are original, written from blueprint understanding.
 */

export const AGILE_PM_SETS = [
  // ═══════════════════════════════════════════════════════════════════
  // Scrum Master (PSM I)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'scrum-master-psm-i',
    title: 'Professional Scrum Master I (PSM I)',
    description:
      'Roles, eventos, artefactos y principios de Scrum según la Scrum Guide 2020 (scrumguides.org). Una de las certificaciones agile más solicitadas del mundo.',
    domain: 'agile',
    category: 'agile',
    level: 'intermediate',
    language: 'es',
    tags: ['scrum', 'agile', 'psm', 'scrum-master'],
    passPercent: 85,
    timeMinutes: 40,
    source: 'Basado en The Scrum Guide 2020 (scrumguides.org — Creative Commons BY-SA)',
    questions: [
      {
        type: 'multiple',
        question: 'Según la Scrum Guide 2020, ¿cuántos roles/accountabilities existen en un Scrum Team?',
        options: { A: '2', B: '3', C: '4', D: '5' },
        answer: ['B'],
        explanation:
          'Tres accountabilities: Product Owner, Scrum Master y Developers. "Developer" reemplazó "Development Team" en la Guide 2020.',
        domain: 'Equipo Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuál es la duración MÁXIMA de un Sprint?',
        options: { A: '1 semana', B: '2 semanas', C: '4 semanas', D: '6 semanas' },
        answer: ['C'],
        explanation:
          'Un Sprint dura un mes o menos. Típicamente 1, 2, 3 o 4 semanas. La duración debe ser consistente.',
        domain: 'Eventos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Quién es responsable del Product Backlog?',
        options: {
          A: 'El Scrum Master',
          B: 'El Product Owner',
          C: 'Los Developers',
          D: 'El cliente',
        },
        answer: ['B'],
        explanation:
          'El Product Owner es responsable del Product Backlog: su contenido, disponibilidad y ordenamiento. Otros pueden colaborar pero la accountability es suya.',
        domain: 'Roles',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuál es el propósito del Sprint Review?',
        options: {
          A: 'Inspeccionar el equipo y planear mejoras',
          B: 'Inspeccionar el Increment y adaptar el Product Backlog',
          C: 'Estimar historias futuras',
          D: 'Reportar al management',
        },
        answer: ['B'],
        explanation:
          'La Sprint Review inspecciona el resultado del Sprint (Increment) con stakeholders y determina adaptaciones futuras del Product Backlog.',
        domain: 'Eventos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia entre la Definition of Done y los Acceptance Criteria?',
        options: {
          A: 'Son lo mismo',
          B: 'DoD aplica a TODO el Increment; Acceptance Criteria son específicos por PBI',
          C: 'DoD la define el PO; AC los Developers',
          D: 'DoD es opcional',
        },
        answer: ['B'],
        explanation:
          'DoD es un commitment de calidad aplicable a todo Increment. Los Acceptance Criteria son requisitos específicos de cada Product Backlog Item.',
        domain: 'Artefactos',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS afirmaciones CORRECTAS sobre el Daily Scrum.',
        options: {
          A: 'Es un evento time-boxed de 15 minutos',
          B: 'Solo los Developers son requeridos',
          C: 'Debe seguir el formato "¿qué hice?, ¿qué haré?, ¿impedimentos?"',
          D: 'Lo facilita obligatoriamente el Scrum Master',
        },
        answer: ['A', 'B'],
        explanation:
          'Daily Scrum: 15 min, para Developers. El formato de las 3 preguntas NO es obligatorio (eliminado en Guide 2020). El SM no tiene que facilitarlo.',
        domain: 'Eventos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Durante el Sprint, el alcance puede:',
        options: {
          A: 'No puede cambiar bajo ninguna circunstancia',
          B: 'Puede aclararse y renegociarse con el PO conforme se aprende más',
          C: 'Solo lo cambia el Scrum Master',
          D: 'Lo cambia el cliente directamente',
        },
        answer: ['B'],
        explanation:
          'El Sprint Goal es fijo; el alcance puede aclararse y renegociarse entre PO y Developers cuando se descubre más información.',
        domain: 'Sprint',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Cuál es el commitment del Sprint Backlog?',
        options: {
          A: 'Product Goal',
          B: 'Sprint Goal',
          C: 'Definition of Done',
          D: 'Release Plan',
        },
        answer: ['B'],
        explanation:
          'En la Guide 2020 cada artefacto tiene un commitment: Product Backlog → Product Goal, Sprint Backlog → Sprint Goal, Increment → DoD.',
        domain: 'Artefactos',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Si un equipo no termina todos los PBIs al final del Sprint, ¿qué sucede?',
        options: {
          A: 'El Sprint se extiende hasta completar',
          B: 'Los PBIs incompletos regresan al Product Backlog; el PO los reordena',
          C: 'Se cancela el Sprint',
          D: 'Los PBIs se marcan como Done parcial',
        },
        answer: ['B'],
        explanation:
          'Los incompletos vuelven al Product Backlog. NO existe "Done parcial". El Sprint termina en la fecha programada.',
        domain: 'Sprint',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Quién puede cancelar un Sprint?',
        options: {
          A: 'Cualquier miembro del equipo',
          B: 'Únicamente el Product Owner',
          C: 'El Scrum Master',
          D: 'Los stakeholders',
        },
        answer: ['B'],
        explanation:
          'Solo el PO puede cancelar un Sprint, usualmente si el Sprint Goal pierde su sentido.',
        domain: 'Roles',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'El Scrum Master es un líder servidor (servant-leader) para:',
        options: {
          A: 'Solo los Developers',
          B: 'Solo el Product Owner',
          C: 'El Scrum Team y la organización',
          D: 'Solo la organización',
        },
        answer: ['C'],
        explanation:
          'El Scrum Master sirve al Scrum Team (PO, Developers) y a la organización entera.',
        domain: 'Roles',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el time-box de la Sprint Retrospective para un Sprint de 1 mes?',
        options: { A: '1 hora', B: '2 horas', C: '3 horas', D: '4 horas' },
        answer: ['C'],
        explanation:
          'Retrospective: máximo 3 horas para un Sprint de 1 mes. Proporcional para Sprints más cortos.',
        domain: 'Eventos',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: 'Los tres pilares del empirismo en Scrum son:',
        options: {
          A: 'Compromiso, Foco, Apertura',
          B: 'Transparencia, Inspección, Adaptación',
          C: 'Planning, Doing, Reviewing',
          D: 'Individuos, Interacciones, Software',
        },
        answer: ['B'],
        explanation:
          'Los tres pilares del empirismo son Transparencia, Inspección y Adaptación. Los cinco valores son Compromiso, Foco, Apertura, Respeto y Coraje.',
        domain: 'Teoría',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'El Product Goal:',
        options: {
          A: 'Es un objetivo a corto plazo del Sprint',
          B: 'Es un objetivo a largo plazo que define el futuro del producto y vive en el Product Backlog',
          C: 'Solo existe en SAFe',
          D: 'Lo define el Scrum Master',
        },
        answer: ['B'],
        explanation:
          'El Product Goal (nuevo en Guide 2020) describe un estado futuro del producto. El Scrum Team debe cumplirlo (o abandonarlo) antes de tomar otro.',
        domain: 'Artefactos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿El Scrum Master puede ser también un Developer en el mismo equipo?',
        options: {
          A: 'No, jamás',
          B: 'Sí, siempre que cumpla ambas accountabilities efectivamente',
          C: 'Solo si lo aprueba el PO',
          D: 'Solo en equipos de menos de 3 personas',
        },
        answer: ['B'],
        explanation:
          'La Guide permite que una persona tenga múltiples accountabilities, siempre que las cumpla bien. No es ideal pero no está prohibido.',
        domain: 'Roles',
        difficulty: 'hard',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // ITIL 4 Foundation
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'itil-4-foundation',
    title: 'ITIL 4 Foundation',
    description:
      'Principios guía, Service Value System, las 4 dimensiones y prácticas de management. Basado en el syllabus público de ITIL 4 Foundation.',
    domain: 'agile',
    category: 'management',
    level: 'beginner',
    language: 'es',
    tags: ['itil', 'itsm', 'service-management'],
    passPercent: 65,
    timeMinutes: 30,
    source: 'Basado en el ITIL® 4 Foundation syllabus público (AXELOS)',
    questions: [
      {
        type: 'multiple',
        question:
          '¿Cuántos principios guía define ITIL 4?',
        options: { A: '5', B: '7', C: '9', D: '10' },
        answer: ['B'],
        explanation:
          'Los 7 principios: Focus on value, Start where you are, Progress iteratively with feedback, Collaborate and promote visibility, Think and work holistically, Keep it simple and practical, Optimize and automate.',
        domain: 'Principios Guía',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Las cuatro dimensiones de Service Management en ITIL 4 son:',
        options: {
          A: 'People, Process, Technology, Service',
          B: 'Organizations & People, Information & Technology, Partners & Suppliers, Value Streams & Processes',
          C: 'Plan, Build, Run, Improve',
          D: 'Strategy, Design, Transition, Operation',
        },
        answer: ['B'],
        explanation:
          'Las 4 dimensiones aseguran enfoque holístico. La opción D son las fases de ITIL v3 (obsoletas).',
        domain: '4 Dimensiones',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué es el Service Value System (SVS)?',
        options: {
          A: 'Una herramienta de CMDB',
          B: 'El modelo que describe cómo los componentes y actividades de una organización trabajan juntos para facilitar la co-creación de valor',
          C: 'Una lista de prácticas ITIL',
          D: 'Una métrica financiera',
        },
        answer: ['B'],
        explanation:
          'El SVS es el corazón de ITIL 4: entradas (oportunidad/demanda) → actividades (principios, governance, SVC, prácticas, mejora continua) → salida (valor).',
        domain: 'SVS',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'La Service Value Chain incluye CUÁNTAS actividades:',
        options: { A: '4', B: '5', C: '6', D: '7' },
        answer: ['C'],
        explanation:
          'Seis: Plan, Improve, Engage, Design & Transition, Obtain/Build, Deliver & Support.',
        domain: 'Service Value Chain',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué es un "incident" en ITIL 4?',
        options: {
          A: 'Un cambio planeado',
          B: 'Una interrupción no planificada de un servicio o reducción de su calidad',
          C: 'Una solicitud de usuario rutinaria',
          D: 'Un error conocido',
        },
        answer: ['B'],
        explanation:
          'Incident = interrupción no planeada. Problem = causa raíz de uno o más incidents. Service Request = solicitud formal normal.',
        domain: 'Prácticas',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS características de un "problem" en ITIL 4.',
        options: {
          A: 'Una causa (o causa potencial) de uno o más incidents',
          B: 'Siempre tiene solución inmediata',
          C: 'Puede tener un workaround mientras se investiga',
          D: 'Es lo mismo que un incident',
        },
        answer: ['A', 'C'],
        explanation:
          'Problem es la causa raíz. El Problem Management busca la raíz; un workaround puede aplicarse durante investigación. Known Error = problem con causa identificada y workaround documentado.',
        domain: 'Prácticas',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué significa "Focus on value" como principio guía?',
        options: {
          A: 'Optimizar costos al mínimo',
          B: 'Cada actividad debe contribuir al valor percibido por stakeholders',
          C: 'Priorizar solo revenue',
          D: 'Automatizar todo',
        },
        answer: ['B'],
        explanation:
          'Todo lo que hace la organización debe mapearse a valor para stakeholders internos y externos.',
        domain: 'Principios Guía',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué es Continual Improvement en ITIL 4?',
        options: {
          A: 'Una práctica opcional',
          B: 'Un componente del SVS y una práctica recurrente en toda la organización',
          C: 'Solo aplica a Service Operation',
          D: 'Se hace al final del año fiscal',
        },
        answer: ['B'],
        explanation:
          'Es a la vez un componente del SVS, un modelo (7 pasos) y una práctica. Es central en ITIL 4.',
        domain: 'Continual Improvement',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un change que es pre-autorizado, bajo riesgo y bien documentado se llama:',
        options: { A: 'Emergency change', B: 'Normal change', C: 'Standard change', D: 'Major change' },
        answer: ['C'],
        explanation:
          'Standard change: pre-autorizado, bajo riesgo, proceso establecido (ej. resetear password). Normal requiere evaluación. Emergency es urgente.',
        domain: 'Change Enablement',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Un "utility" en la definición de servicio significa:',
        options: {
          A: 'El precio',
          B: 'La funcionalidad ofrecida ("fit for purpose")',
          C: 'La disponibilidad/rendimiento ("fit for use")',
          D: 'El SLA',
        },
        answer: ['B'],
        explanation:
          'Utility = "fit for purpose" (lo que hace). Warranty = "fit for use" (cómo lo hace — disponibilidad, capacidad, seguridad, continuidad).',
        domain: 'Conceptos',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué práctica de ITIL 4 gestiona la relación con proveedores externos?',
        options: {
          A: 'Service Level Management',
          B: 'Supplier Management',
          C: 'Monitoring and Event Management',
          D: 'Deployment Management',
        },
        answer: ['B'],
        explanation:
          'Supplier Management: contratos, rendimiento y relaciones con proveedores.',
        domain: 'Prácticas',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué es Service Request Management?',
        options: {
          A: 'Gestión de interrupciones',
          B: 'Soporte para solicitudes normales pre-definidas del usuario (ej. acceso a app, info, recurso)',
          C: 'Gestión de incidentes urgentes',
          D: 'Gestión de cambios',
        },
        answer: ['B'],
        explanation:
          'Maneja solicitudes rutinarias del negocio (ej. acceso, equipo, información). Es distinto a Incident Management.',
        domain: 'Prácticas',
        difficulty: 'medium',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // PMP Fundamentals
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'pmp-fundamentals',
    title: 'PMP® — Fundamentos de Gestión de Proyectos',
    description:
      'Conceptos esenciales de project management: ciclo de vida, stakeholders, procesos, áreas de conocimiento y gestión predictiva vs ágil.',
    domain: 'agile',
    category: 'management',
    level: 'intermediate',
    language: 'es',
    tags: ['pmp', 'pmi', 'project-management', 'pmbok'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Basado en conceptos públicos de PMBOK® Guide y Agile Practice Guide',
    questions: [
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia principal entre proyecto y operación?',
        options: {
          A: 'Proyecto es más barato',
          B: 'Un proyecto es temporal con un objetivo único; una operación es continua y repetitiva',
          C: 'Una operación requiere más gente',
          D: 'No hay diferencia',
        },
        answer: ['B'],
        explanation:
          'Proyecto: temporal, produce un resultado único. Operación: ongoing, produce resultados repetitivos.',
        domain: 'Conceptos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Las restricciones tradicionales ("triple constraint") del proyecto son:',
        options: {
          A: 'Alcance, tiempo, costo',
          B: 'Calidad, riesgo, personal',
          C: 'Cliente, equipo, sponsor',
          D: 'Inicio, ejecución, cierre',
        },
        answer: ['A'],
        explanation:
          'Triple constraint clásica. Modernamente se suma Calidad, Recursos y Riesgo (six constraints).',
        domain: 'Conceptos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué enfoque de desarrollo es mejor cuando los requisitos son volátiles y se espera aprender rápido?',
        options: { A: 'Predictivo (waterfall)', B: 'Ágil/iterativo', C: 'Cascada pura', D: 'V-Model' },
        answer: ['B'],
        explanation:
          'Ágil permite entregas incrementales con retroalimentación frecuente, ideal para incertidumbre alta.',
        domain: 'Enfoques',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué documento autoriza formalmente la existencia de un proyecto?',
        options: { A: 'Plan del proyecto', B: 'Project Charter', C: 'WBS', D: 'RACI' },
        answer: ['B'],
        explanation:
          'El Project Charter autoriza el proyecto, otorga autoridad al PM y documenta el objetivo de alto nivel.',
        domain: 'Iniciación',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Una matriz RACI define:',
        options: {
          A: 'Riesgos del proyecto',
          B: 'Responsable, Accountable, Consulted, Informed para cada tarea',
          C: 'Costos por actividad',
          D: 'Cronograma con dependencias',
        },
        answer: ['B'],
        explanation: 'RACI clarifica roles por actividad. Solo UN Accountable por tarea.',
        domain: 'Recursos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS técnicas de estimación de actividades.',
        options: {
          A: 'Estimación análoga',
          B: 'Estimación de tres puntos (PERT)',
          C: 'Gold plating',
          D: 'Fast tracking',
        },
        answer: ['A', 'B'],
        explanation:
          'Análoga usa proyectos similares pasados. PERT usa optimista, pesimista y más probable. Gold plating y fast tracking son otros conceptos.',
        domain: 'Estimación',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué representa la "ruta crítica" (critical path)?',
        options: {
          A: 'Las tareas más caras',
          B: 'La secuencia más larga de actividades dependientes que determina la duración mínima del proyecto',
          C: 'Las tareas en riesgo',
          D: 'Las tareas opcionales',
        },
        answer: ['B'],
        explanation:
          'La ruta crítica es la cadena más larga de dependencias; retrasos en ella retrasan todo el proyecto.',
        domain: 'Cronograma',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'EVM: Si CPI = 0.85, ¿qué significa?',
        options: {
          A: 'Proyecto adelantado en tiempo',
          B: 'Proyecto gastando más de lo presupuestado por el trabajo realizado',
          C: 'Proyecto en presupuesto',
          D: 'Cronograma al día',
        },
        answer: ['B'],
        explanation:
          'CPI (Cost Performance Index) = EV/AC. < 1 → sobre costo (por cada peso gastado obtuve 0.85 de valor).',
        domain: 'Control',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: 'En gestión de riesgos, un plan de "mitigación" busca:',
        options: {
          A: 'Eliminar el riesgo por completo',
          B: 'Reducir la probabilidad y/o impacto del riesgo',
          C: 'Aceptar el riesgo sin acción',
          D: 'Transferir el riesgo a un tercero',
        },
        answer: ['B'],
        explanation:
          'Estrategias para amenazas: Evitar, Mitigar, Transferir, Aceptar. Para oportunidades: Explotar, Mejorar, Compartir, Aceptar.',
        domain: 'Riesgos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Un WBS (Work Breakdown Structure) es:',
        options: {
          A: 'Una lista de recursos',
          B: 'Una descomposición jerárquica del trabajo total del proyecto en entregables manejables',
          C: 'Un diagrama de Gantt',
          D: 'Un análisis financiero',
        },
        answer: ['B'],
        explanation: 'WBS descompone el alcance en paquetes de trabajo estimables y asignables.',
        domain: 'Alcance',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'El proceso "Close Project or Phase" incluye principalmente:',
        options: {
          A: 'Formalizar aceptación, liberar recursos, archivar documentos y capturar lecciones aprendidas',
          B: 'Comenzar el siguiente proyecto',
          C: 'Solo facturar al cliente',
          D: 'Despedir al equipo',
        },
        answer: ['A'],
        explanation:
          'Cierre formal: aceptación del entregable, liberación de recursos, archivo y lecciones aprendidas en activos de la organización.',
        domain: 'Cierre',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'En un contrato Fixed Price (precio fijo), ¿quién asume MÁS riesgo financiero?',
        options: {
          A: 'El comprador',
          B: 'El vendedor/proveedor',
          C: 'Ambos por igual',
          D: 'Ninguno',
        },
        answer: ['B'],
        explanation:
          'Fixed Price: el vendedor se compromete a precio cerrado. Si el costo real sube, lo absorbe él. Cost-plus transfiere riesgo al comprador.',
        domain: 'Adquisiciones',
        difficulty: 'hard',
      },
    ],
  },
];
