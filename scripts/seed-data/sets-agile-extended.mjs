// Generado por el subagente exam-content-architect (research + QA manual, sin LLM-API externo).
// Batch: agile-extended — COMPLETO: 10 sets (pmp-fundamentos, csm-scrum-master + 8 nuevos).
//
// PRINCE2 7th Edition (2023), vigente en 2026: 7 Principios, 7 Prácticas (antes
// "temas"), 7 Procesos; incorpora People, Sustainability y Digital & Data.
// SAFe 6.0 Scrum Master (SSM): vigente, curso de 2 días, examen de 90 min.
// PMI CAPM: Exam Content Outline 2023 (vigente en 2026), 4 dominios: Project
// Management Fundamentals 36%, Predictive (Plan-Based) 17%, Agile 20%, Business
// Analysis 27% — 150 preguntas, 180 min.
// Los demás (PSPO, Kanban KMP, Lean Six Sigma Yellow Belt, Design Thinking,
// Agile Coaching) son cuerpos de conocimiento estables basados en fuentes
// oficiales públicas (Scrum.org, Kanban University, ASQ, IDEO, ICAgile).
//
// PMP — PMI Examination Content Outline (ECO) 2026, vigente desde jul-2026 (mayor
// cambio estructural desde 2021). 3 dominios: People 33%, Process 41%, Business
// Environment 26%. El examen real de 180 preguntas incluye clusters de caso de
// estudio y preguntas gráficas que este set (formato opción múltiple simple) no
// replica exactamente — se cubre el conocimiento evaluado, no el formato de cluster.
// https://www.pmi.org/certifications/project-management-pmp
//
// CSM — Scrum Alliance Certified ScrumMaster. Examen real: 50 preguntas, 60 min,
// 74% para aprobar, requiere curso presencial previo con un CST. Este set cubre
// el conocimiento evaluado (roles, eventos, artefactos, valores de Scrum).
// https://www.scrumalliance.org/get-certified/scrum-master-track/certified-scrummaster

export const AGILE_EXTENDED_SETS = [
  {
    slug: 'pmp-fundamentos',
    title: 'PMP — Project Management Professional',
    description:
      'Examen de práctica alineado al Examination Content Outline (ECO) 2026 del PMI: dominios People, Process y Business Environment, con fuerte enfoque agile/híbrido.',
    domain: 'agile',
    category: 'project-management',
    level: 'advanced',
    language: 'es',
    tags: ['pmp', 'pmi', 'project-management'],
    passPercent: 70,
    timeMinutes: 33,
    source:
      'Basado en PMI PMP Examination Content Outline (ECO) 2026 — pmi.org/certifications/project-management-pmp (contenido original)',
    questions: [
      // ── Dominio People — 33% (10) ──────────────────────────────────────
      {
        type: 'multiple',
        question:
          'Dos miembros clave del equipo tienen un desacuerdo técnico recurrente que empieza a afectar el ambiente del equipo. Según las mejores prácticas de gestión de conflictos del PMI, ¿cuál debería ser el primer paso del director de proyecto?',
        options: {
          A: 'Escalar inmediatamente el conflicto al sponsor para que decida',
          B: 'Facilitar una conversación directa entre las partes para entender causas raíz y buscar colaboración (problem solving/confronting)',
          C: 'Ignorar el conflicto esperando que se resuelva solo',
          D: 'Remover a ambos miembros del equipo de inmediato',
        },
        answer: ['B'],
        explanation:
          'El PMI prioriza el estilo "collaborate/problem solve" para conflictos importantes: facilitar diálogo directo entre las partes para identificar la causa raíz y llegar a una solución conjunta, antes de escalar o evitar el tema.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un director de proyecto ágil elimina obstáculos para el equipo, protege su tiempo de enfoque y facilita la autoorganización en lugar de asignar tareas directamente. ¿Qué estilo de liderazgo está aplicando?',
        options: {
          A: 'Liderazgo autocrático',
          B: 'Servant leadership',
          C: 'Liderazgo transaccional puro',
          D: 'Micromanagement',
        },
        answer: ['B'],
        explanation:
          'El servant leadership (liderazgo de servicio) prioriza remover impedimentos, empoderar al equipo y facilitar su autoorganización por encima de dirigir o controlar directamente el trabajo — el estilo predominante recomendado en entornos ágiles.',
        domain: 'People',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un stakeholder clave tiene alto poder e alto interés en el proyecto, pero actualmente se muestra resistente al cambio propuesto. Según la matriz de poder/interés, ¿qué estrategia de engagement es más apropiada?',
        options: {
          A: 'Monitorear con esfuerzo mínimo (Monitor)',
          B: 'Gestionar de cerca (Manage Closely), invirtiendo tiempo activo en entender sus preocupaciones y construir consenso',
          C: 'Mantener informado sin más esfuerzo (Keep Informed)',
          D: 'Ignorarlo hasta que cambie de opinión por sí solo',
        },
        answer: ['B'],
        explanation:
          'En la matriz poder/interés, los stakeholders de alto poder y alto interés requieren "Manage Closely": engagement activo y frecuente, especialmente crítico cuando muestran resistencia, para evitar que bloqueen el proyecto.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo distribuido en distintas zonas horarias reporta baja participación en las reuniones diarias y falta de sentido de pertenencia. ¿Qué acción del director de proyecto aborda mejor esta situación?',
        options: {
          A: 'Cancelar todas las reuniones sincrónicas',
          B: 'Establecer normas de equipo (team charter) claras sobre comunicación, horarios rotativos justos y espacios de conexión informal',
          C: 'Exigir que todos trabajen en el mismo huso horario sin excepción',
          D: 'Reducir el tamaño del equipo eliminando a quienes participan menos',
        },
        answer: ['B'],
        explanation:
          'Para equipos distribuidos, establecer normas de equipo explícitas (team charter) —incluyendo rotación justa de horarios y espacios de conexión— mejora la cohesión y participación sin imponer cargas desiguales por zona horaria.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué busca principalmente el "empowerment" (empoderamiento) de un equipo de proyecto según el enfoque del PMI?',
        options: {
          A: 'Que el director de proyecto tome todas las decisiones para el equipo',
          B: 'Delegar autoridad de decisión al nivel más cercano a donde se ejecuta el trabajo, dando al equipo autonomía real dentro de límites claros',
          C: 'Eliminar por completo cualquier tipo de supervisión',
          D: 'Aplicar empoderamiento únicamente a roles gerenciales',
        },
        answer: ['B'],
        explanation:
          'El empoderamiento delega autoridad de decisión a quienes están más cerca del trabajo (a menudo el equipo), dentro de límites y objetivos claros — mejora velocidad de decisión y compromiso, sin significar ausencia total de dirección.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un nuevo integrante del equipo no entiende por qué se prioriza cierto trabajo. ¿Qué práctica de comunicación ayuda a alinear rápidamente su comprensión con los objetivos del proyecto?',
        options: {
          A: 'No explicarle nada y dejar que lo descubra con el tiempo',
          B: 'Compartir el business case, los objetivos del proyecto y cómo el backlog/plan se conecta con el valor esperado',
          C: 'Darle solo la lista de tareas sin contexto',
          D: 'Pedirle que espere a la próxima retrospectiva para preguntar',
        },
        answer: ['B'],
        explanation:
          'Conectar explícitamente el trabajo diario con el business case y los objetivos de valor del proyecto acelera el onboarding y mejora la toma de decisiones autónoma del nuevo integrante.',
        domain: 'People',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Durante una retrospectiva, el equipo identifica que la falta de habilidades específicas en pruebas automatizadas está generando cuellos de botella. ¿Qué acción del director de proyecto aborda esta brecha de forma sostenible?',
        options: {
          A: 'Ignorar el hallazgo porque no es responsabilidad del director de proyecto',
          B: 'Gestionar el desarrollo de competencias del equipo: capacitación, mentoring o incorporar a alguien con esa habilidad',
          C: 'Reasignar todo el trabajo de pruebas a una sola persona indefinidamente sin desarrollar al resto',
          D: 'Eliminar las pruebas automatizadas del proceso',
        },
        answer: ['B'],
        explanation:
          'El desarrollo de competencias del equipo (mediante capacitación, mentoring o ajuste de composición) es responsabilidad activa del director de proyecto para resolver brechas de habilidades que generan cuellos de botella recurrentes.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un miembro del equipo comete un error que retrasa una entrega. ¿Qué respuesta del director de proyecto fomenta mejor una cultura de mejora continua y seguridad psicológica?',
        options: {
          A: 'Reprender públicamente al miembro del equipo frente a los demás',
          B: 'Analizar la causa raíz del error de forma constructiva, sin buscar culpables, y ajustar procesos para prevenir recurrencias',
          C: 'Ocultar el error para no afectar la moral del equipo',
          D: 'Remover automáticamente al miembro del proyecto',
        },
        answer: ['B'],
        explanation:
          'Un enfoque de análisis de causa raíz sin buscar culpables ("blameless") fomenta la seguridad psicológica: el equipo se siente seguro reportando errores temprano, lo que mejora la calidad y el aprendizaje continuo del proyecto.',
        domain: 'People',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'En un proyecto híbrido, parte del equipo usa Scrum y otra parte sigue un enfoque predictivo. ¿Qué habilidad de "tailoring" (adaptación) debe aplicar el director de proyecto según el ECO 2026?',
        options: {
          A: 'Forzar a todo el equipo a usar exactamente el mismo enfoque sin excepciones',
          B: 'Adaptar los procesos de gobernanza, cadencia de reportes y ceremonias según las necesidades reales de cada parte del equipo, manteniendo coherencia general del proyecto',
          C: 'Prohibir cualquier metodología ágil en proyectos híbridos',
          D: 'Delegar toda decisión de tailoring únicamente al PMO sin involucrar al equipo',
        },
        answer: ['B'],
        explanation:
          'El tailoring (adaptación de enfoque) es una competencia central del ECO 2026, dado el fuerte peso de proyectos híbridos: el director de proyecto debe ajustar procesos, cadencias y gobernanza a las necesidades reales de cada parte del equipo sin perder coherencia global.',
        domain: 'People',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué diferencia hay entre negociar y resolver un conflicto en el contexto de gestión de equipos de proyecto?',
        options: {
          A: 'Son términos idénticos sin ninguna diferencia práctica',
          B: 'Negociar busca llegar a un acuerdo mutuamente aceptable sobre un tema puntual; resolver un conflicto busca atender la causa raíz de una tensión interpersonal o de proceso más profunda',
          C: 'La negociación solo aplica a contratos con proveedores externos',
          D: 'Resolver conflictos nunca requiere comunicación directa entre las partes',
        },
        answer: ['B'],
        explanation:
          'La negociación se enfoca en llegar a un acuerdo sobre un asunto específico (ej. alcance, recursos); la resolución de conflictos aborda tensiones interpersonales o de proceso más profundas que pueden requerir mediación y trabajo continuo, no solo un acuerdo puntual.',
        domain: 'People',
        difficulty: 'hard',
      },

      // ── Dominio Process — 41% (12) ─────────────────────────────────────
      {
        type: 'multiple',
        question:
          'Un proyecto tiene requisitos claros, estables y bien conocidos desde el inicio (ej. construcción de infraestructura física). ¿Qué enfoque de ciclo de vida es más apropiado?',
        options: {
          A: 'Predictivo (waterfall)',
          B: 'Ágil puro con sprints de 1 semana obligatorios',
          C: 'Kanban sin ninguna planificación inicial',
          D: 'No es posible aplicar ningún enfoque estructurado',
        },
        answer: ['A'],
        explanation:
          'Cuando los requisitos son claros, estables y con bajo riesgo de cambio, un enfoque predictivo (planificación detallada por adelantado, ejecución secuencial) suele ser más eficiente que uno ágil, diseñado para alta incertidumbre y cambio frecuente.',
        domain: 'Process',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué es una Work Breakdown Structure (WBS)?',
        options: {
          A: 'Un cronograma con fechas exactas de cada tarea',
          B: 'Una descomposición jerárquica del alcance total del trabajo a realizar por el equipo del proyecto, organizada en entregables',
          C: 'Un documento exclusivamente financiero de presupuesto',
          D: 'La lista de riesgos identificados del proyecto',
        },
        answer: ['B'],
        explanation:
          'La WBS descompone jerárquicamente el alcance del proyecto en entregables y paquetes de trabajo cada vez más pequeños y manejables — es una herramienta de definición de alcance, no de cronograma ni presupuesto directamente.',
        domain: 'Process',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Durante la ejecución, el equipo identifica que una tarea del camino crítico se retrasará 3 días. ¿Qué técnica permite comprimir el cronograma añadiendo recursos adicionales a esa tarea sin cambiar su secuencia lógica?',
        options: {
          A: 'Fast tracking',
          B: 'Crashing',
          C: 'Resource leveling',
          D: 'Monte Carlo simulation',
        },
        answer: ['B'],
        explanation:
          '"Crashing" comprime el cronograma añadiendo recursos adicionales a las actividades del camino crítico (generalmente aumentando costo), a diferencia de "fast tracking" que reordena actividades para ejecutarlas en paralelo.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'El Valor Ganado (Earned Value) de un proyecto es menor que el Costo Real (Actual Cost) en el mismo período. ¿Qué indica esto sobre el desempeño de costos?',
        options: {
          A: 'El proyecto está por debajo del presupuesto (Cost Performance Index > 1)',
          B: 'El proyecto está por encima del presupuesto para el trabajo realizado (Cost Performance Index < 1)',
          C: 'El proyecto está exactamente en el presupuesto planificado',
          D: 'Earned Value y Actual Cost no tienen relación con el desempeño de costos',
        },
        answer: ['B'],
        explanation:
          'CPI = EV / AC. Si EV < AC, el CPI es menor a 1, indicando que se ha gastado más de lo que el trabajo realmente completado vale — el proyecto está sobrecostado respecto a su avance real.',
        domain: 'Process',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito principal de un registro de riesgos (risk register) durante la ejecución del proyecto?',
        options: {
          A: 'Documentar únicamente riesgos que ya se materializaron como problemas',
          B: 'Llevar seguimiento de los riesgos identificados, su análisis (probabilidad/impacto), dueños y estrategias de respuesta, actualizándolo durante todo el proyecto',
          C: 'Reemplazar la necesidad del plan de gestión de riesgos',
          D: 'Aplicarse solo una vez, al inicio del proyecto, sin actualizaciones posteriores',
        },
        answer: ['B'],
        explanation:
          'El risk register es un documento vivo que registra cada riesgo identificado, su evaluación cualitativa/cuantitativa, el dueño responsable y la estrategia de respuesta, actualizándose continuamente conforme el proyecto avanza y surgen nuevos riesgos.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo Scrum dentro de un proyecto híbrido termina su Sprint con varios ítems del Sprint Backlog sin completar. Según las prácticas ágiles, ¿qué debe pasar con esos ítems?',
        options: {
          A: 'Se descartan automáticamente y no se vuelven a considerar',
          B: 'Se regresan al Product Backlog para ser re-priorizados por el Product Owner en un futuro Sprint',
          C: 'Se fuerzan a completar extendiendo el Sprint más allá de su duración fija (time-box)',
          D: 'Se penaliza al equipo reduciendo su velocity objetivo',
        },
        answer: ['B'],
        explanation:
          'El Sprint es un time-box fijo que no se extiende. Los ítems incompletos regresan al Product Backlog para que el Product Owner los re-priorice en un Sprint futuro según el valor de negocio actual.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué diferencia principal existe entre control de calidad (quality control) y aseguramiento de calidad (quality assurance)?',
        options: {
          A: 'Son sinónimos exactos sin distinción práctica',
          B: 'QA es un enfoque preventivo sobre los procesos usados para producir el entregable; QC es la inspección/verificación reactiva de los entregables ya producidos',
          C: 'QC solo aplica a software, QA solo aplica a construcción',
          D: 'QA ocurre únicamente al final del proyecto',
        },
        answer: ['B'],
        explanation:
          'El aseguramiento de calidad (QA) se enfoca en mejorar y auditar los PROCESOS para prevenir defectos; el control de calidad (QC) inspecciona los ENTREGABLES ya producidos para detectar y corregir defectos — uno es preventivo, el otro reactivo.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un stakeholder solicita agregar una nueva funcionalidad no contemplada en el alcance original, ya avanzada la ejecución. ¿Cuál es el proceso correcto según las buenas prácticas de gestión de cambios?',
        options: {
          A: 'Implementarlo de inmediato porque el stakeholder lo pidió',
          B: 'Documentar la solicitud formalmente y someterla al proceso de control integrado de cambios (evaluación de impacto, aprobación del comité correspondiente) antes de implementarla',
          C: 'Rechazarlo automáticamente sin evaluación',
          D: 'Ignorar la solicitud hasta que el proyecto termine',
        },
        answer: ['B'],
        explanation:
          'Toda solicitud de cambio debe pasar por el proceso formal de control integrado de cambios: documentación, análisis de impacto en alcance/costo/cronograma/riesgo, y aprobación del Change Control Board o autoridad correspondiente antes de implementarse.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué mide el "burndown chart" en un proyecto ágil?',
        options: {
          A: 'El presupuesto total gastado por el proyecto',
          B: 'El trabajo restante (en puntos de historia u horas) a lo largo del tiempo dentro de un Sprint o release, mostrando si el equipo va en línea para completarlo',
          C: 'La cantidad de defectos reportados en producción',
          D: 'El número de reuniones realizadas por el equipo',
        },
        answer: ['B'],
        explanation:
          'El burndown chart grafica el trabajo restante (story points u horas) contra el tiempo, permitiendo visualizar si el equipo va en camino a completar el Sprint o release en el plazo previsto.',
        domain: 'Process',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un director de proyecto identifica que dos actividades no relacionadas por dependencia lógica pueden ejecutarse en paralelo para acortar la duración total del proyecto. ¿Qué técnica está aplicando?',
        options: {
          A: 'Crashing',
          B: 'Fast tracking',
          C: 'Resource smoothing',
          D: 'Critical chain buffering',
        },
        answer: ['B'],
        explanation:
          'El "fast tracking" acorta la duración del proyecto ejecutando en paralelo actividades que normalmente se harían de forma secuencial, sin necesariamente añadir recursos — a diferencia de "crashing" que sí implica más recursos/costo.',
        domain: 'Process',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito de una reunión de cierre de proyecto (lessons learned / retrospectiva final)?',
        options: {
          A: 'Culpar formalmente a los responsables de los problemas del proyecto',
          B: 'Documentar qué funcionó bien, qué no, y las recomendaciones para futuros proyectos, alimentando los activos de procesos organizacionales',
          C: 'Es un paso opcional que rara vez aporta valor real',
          D: 'Solo debe hacerse si el proyecto falló completamente',
        },
        answer: ['B'],
        explanation:
          'Las lecciones aprendidas capturan de forma estructurada qué funcionó, qué no, y recomendaciones accionables, alimentando la base de conocimiento organizacional para mejorar la ejecución de proyectos futuros — independientemente de si el proyecto fue exitoso o no.',
        domain: 'Process',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un proyecto usa Kanban para gestionar el flujo de trabajo de soporte continuo. El equipo nota que las tareas se acumulan en la columna "En revisión". ¿Qué ajuste de práctica Kanban ayuda a resolver este cuello de botella?',
        options: {
          A: 'Eliminar la columna "En revisión" del tablero',
          B: 'Establecer o reducir el límite de Work In Progress (WIP) de esa columna, forzando al equipo a resolver el cuello de botella antes de tomar trabajo nuevo',
          C: 'Aumentar el WIP de todas las columnas sin excepción',
          D: 'Ignorar la acumulación mientras el trabajo eventualmente se complete',
        },
        answer: ['B'],
        explanation:
          'Ajustar (típicamente reducir) el límite de WIP de la columna donde se acumula trabajo obliga al equipo a enfocar esfuerzo en destrabar ese cuello de botella antes de iniciar trabajo nuevo — principio central de gestión de flujo en Kanban.',
        domain: 'Process',
        difficulty: 'hard',
      },

      // ── Dominio Business Environment — 26% (8) ────────────────────────
      {
        type: 'multiple',
        question:
          '¿Qué es un "business case" y cuándo se utiliza principalmente en el ciclo de vida del proyecto?',
        options: {
          A: 'Un documento técnico usado solo durante la ejecución',
          B: 'Un documento que justifica la inversión del proyecto en términos de valor de negocio, usado antes del inicio para decidir si el proyecto debe aprobarse',
          C: 'El acta de constitución del proyecto (project charter), son el mismo documento',
          D: 'Un reporte que se genera únicamente al cierre del proyecto',
        },
        answer: ['B'],
        explanation:
          'El business case documenta la justificación de negocio de la inversión (beneficios esperados, alternativas, ROI) y se usa antes de aprobar el proyecto para decidir si vale la pena ejecutarlo — es un insumo para el project charter, no lo mismo.',
        domain: 'Business Environment',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una nueva regulación de protección de datos entra en vigor a mitad del proyecto, afectando cómo se debe manejar la información de usuarios. ¿Qué elemento del entorno de negocio debe monitorear activamente el director de proyecto?',
        options: {
          A: 'Factores ambientales externos y de cumplimiento regulatorio (compliance)',
          B: 'Únicamente el presupuesto del proyecto',
          C: 'El clima organizacional del equipo',
          D: 'La disponibilidad de salas de reuniones',
        },
        answer: ['A'],
        explanation:
          'Los cambios regulatorios son factores ambientales externos que pueden impactar directamente el alcance, cumplimiento y riesgo del proyecto; el director de proyecto debe monitorearlos activamente y ajustar el plan cuando sea necesario.',
        domain: 'Business Environment',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué mide principalmente el Retorno de la Inversión (ROI) de un proyecto?',
        options: {
          A: 'El tiempo total que tomó completar el proyecto',
          B: 'La ganancia o beneficio neto generado por el proyecto en relación con su costo de inversión',
          C: 'La cantidad de riesgos identificados durante la planificación',
          D: 'El número de stakeholders involucrados',
        },
        answer: ['B'],
        explanation:
          'El ROI compara el beneficio neto generado por una inversión (el proyecto) contra su costo, expresado típicamente como porcentaje — una métrica clave para justificar y priorizar proyectos frente a otras oportunidades de inversión.',
        domain: 'Business Environment',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un proyecto interno reemplaza un sistema legacy que ya no es sostenible operativamente, aunque no genera ingresos directos nuevos. ¿Qué tipo de valor de negocio está entregando principalmente?',
        options: {
          A: 'Ningún valor de negocio, ya que no genera ingresos',
          B: 'Valor de negocio en forma de reducción de riesgo operativo y eficiencia/sostenibilidad a largo plazo, no solo ingresos directos',
          C: 'Valor exclusivamente reputacional sin ningún beneficio medible',
          D: 'Valor únicamente para el equipo de TI, no para la organización',
        },
        answer: ['B'],
        explanation:
          'El valor de negocio no se limita a ingresos directos: reducir riesgo operativo, mejorar sostenibilidad, eficiencia o cumplimiento también son formas legítimas y medibles de valor que el ECO 2026 reconoce explícitamente.',
        domain: 'Business Environment',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'El ECO 2026 del PMP incorpora explícitamente el tema de "IA en la gestión de proyectos". ¿Cuál es un uso apropiado de IA generativa en este contexto, según buenas prácticas?',
        options: {
          A: 'Delegar por completo decisiones críticas de negocio a la IA sin revisión humana',
          B: 'Usarla como apoyo para tareas como resumir reportes de estado, generar borradores de comunicación o analizar patrones en datos, siempre con juicio y validación humana',
          C: 'Prohibir cualquier uso de IA en proyectos por razones de riesgo',
          D: 'Usarla exclusivamente para automatizar la aprobación de cambios de alcance',
        },
        answer: ['B'],
        explanation:
          'El PMI enmarca la IA como una herramienta de apoyo (resumir información, generar borradores, detectar patrones) que aumenta la productividad del director de proyecto, sin reemplazar el juicio profesional ni la validación humana en decisiones críticas.',
        domain: 'Business Environment',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué es un "PMO" (Project Management Office) y qué función típica cumple?',
        options: {
          A: 'Es sinónimo exacto de "director de proyecto"',
          B: 'Es una unidad organizacional que estandariza procesos de gobernanza de proyectos, provee soporte metodológico y puede supervisar el portafolio de proyectos',
          C: 'Es un software específico de gestión de tareas',
          D: 'Solo existe en organizaciones que usan metodologías predictivas',
        },
        answer: ['B'],
        explanation:
          'Un PMO es una estructura organizacional (no una persona ni un software) que estandariza la gobernanza de proyectos, provee plantillas/metodología/soporte, y en algunos modelos supervisa la alineación estratégica del portafolio de proyectos.',
        domain: 'Business Environment',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un proyecto de construcción debe considerar el impacto ambiental de sus materiales y procesos como parte de los criterios de éxito, no solo costo y cronograma. ¿A qué tendencia reforzada en el ECO 2026 corresponde esto?',
        options: {
          A: 'Sustainability (sostenibilidad) como criterio explícito del entorno de negocio del proyecto',
          B: 'Gestión de la calidad exclusivamente técnica',
          C: 'Gestión de adquisiciones sin relación con sostenibilidad',
          D: 'No corresponde a ningún dominio del ECO',
        },
        answer: ['A'],
        explanation:
          'El ECO 2026 incorpora explícitamente la sostenibilidad como un factor del entorno de negocio que los directores de proyecto deben considerar activamente en sus decisiones, más allá de la tríada tradicional de alcance/costo/cronograma.',
        domain: 'Business Environment',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una organización experimenta un cambio de estrategia corporativa que hace que un proyecto en curso ya no esté alineado con los objetivos del negocio. ¿Qué debe evaluar el director de proyecto según la gestión del entorno de negocio?',
        options: {
          A: 'Continuar el proyecto sin cambios porque ya se aprobó el presupuesto',
          B: 'Reevaluar el business case y comunicar al sponsor/comité de gobernanza si el proyecto debe ajustarse, pausarse o cancelarse para mantener alineación estratégica',
          C: 'Decidir unilateralmente cancelar el proyecto sin informar a nadie',
          D: 'Ignorar el cambio de estrategia porque no afecta la ejecución técnica',
        },
        answer: ['B'],
        explanation:
          'Cuando cambia la estrategia organizacional, el director de proyecto debe reevaluar la vigencia del business case y escalar la situación al sponsor o comité de gobernanza correspondiente — los proyectos deben mantenerse alineados al valor de negocio vigente, no ejecutarse por inercia.',
        domain: 'Business Environment',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'csm-scrum-master',
    title: 'Certified ScrumMaster (CSM) — Scrum Alliance',
    description:
      'Examen de práctica sobre los fundamentos de Scrum evaluados en el CSM de Scrum Alliance: roles, eventos, artefactos, valores ágiles y servant leadership.',
    domain: 'agile',
    category: 'scrum',
    level: 'beginner',
    language: 'es',
    tags: ['csm', 'scrum', 'scrum-alliance'],
    passPercent: 74,
    timeMinutes: 33,
    source:
      'Basado en Scrum Alliance Certified ScrumMaster (CSM) content + The Scrum Guide 2020 — scrumalliance.org (contenido original)',
    questions: [
      // ── Roles de Scrum (6) ──────────────────────────────────────────
      {
        type: 'multiple',
        question: '¿Cuál es la responsabilidad principal del Product Owner en Scrum?',
        options: {
          A: 'Asignar tareas diarias a cada Developer',
          B: 'Maximizar el valor del producto resultante del trabajo del Scrum Team, principalmente gestionando el Product Backlog',
          C: 'Facilitar las ceremonias de Scrum y remover impedimentos',
          D: 'Escribir el código de las funcionalidades del producto',
        },
        answer: ['B'],
        explanation:
          'El Product Owner es responsable de maximizar el valor del producto, principalmente a través de la gestión efectiva del Product Backlog: definir y comunicar el Product Goal, ordenar los ítems por valor y asegurar que el backlog sea transparente y comprensible.',
        domain: 'Roles de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la función principal del Scrum Master según la Scrum Guide 2020?',
        options: {
          A: 'Ser el jefe jerárquico de los Developers',
          B: 'Establecer Scrum tal como se define en la Scrum Guide, ayudando a todos a entender la teoría y práctica de Scrum, tanto dentro del Scrum Team como en la organización',
          C: 'Escribir los requisitos técnicos del producto',
          D: 'Aprobar el presupuesto del proyecto',
        },
        answer: ['B'],
        explanation:
          'El Scrum Master es responsable de establecer Scrum, actuando como líder-servidor del Scrum Team y ayudando a la organización más amplia a entender y adoptar las interacciones de Scrum — no es un gerente jerárquico ni asigna tareas.',
        domain: 'Roles de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Quiénes conforman los "Developers" dentro del Scrum Team?',
        options: {
          A: 'Únicamente las personas con el título formal de "programador"',
          B: 'Las personas comprometidas en crear cualquier aspecto de un Increment usable en cada Sprint, sin importar su especialidad técnica específica',
          C: 'Solo el Product Owner y el Scrum Master',
          D: 'Personas externas al Scrum Team que solo dan asesoría puntual',
        },
        answer: ['B'],
        explanation:
          'En la Scrum Guide, "Developers" se refiere a cualquier persona del Scrum Team comprometida en crear un Increment del producto en cada Sprint (diseño, código, pruebas, documentación, etc.), no solo a quienes escriben código.',
        domain: 'Roles de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un stakeholder externo le pide directamente a un Developer que cambie la prioridad del trabajo del Sprint actual sin pasar por el Product Owner. ¿Cuál es la respuesta alineada a Scrum?',
        options: {
          A: 'El Developer acepta el cambio directamente para complacer al stakeholder',
          B: 'El Developer redirige la solicitud al Product Owner, quien es el único responsable de gestionar y priorizar el Product Backlog',
          C: 'El Scrum Master decide unilateralmente si aceptar el cambio',
          D: 'El equipo vota democráticamente sin involucrar al Product Owner',
        },
        answer: ['B'],
        explanation:
          'El Product Owner es la única persona responsable de gestionar el Product Backlog y sus prioridades; cualquier solicitud de cambio de alcance o prioridad debe canalizarse a través de él, protegiendo al equipo de interrupciones no gestionadas durante el Sprint.',
        domain: 'Roles de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Es el Scrum Master responsable de gestionar el presupuesto y reportar el estatus del proyecto a la gerencia como lo haría un director de proyecto tradicional?',
        options: {
          A: 'Sí, es su responsabilidad principal según la Scrum Guide',
          B: 'No — el Scrum Master es un líder-servidor enfocado en Scrum, la efectividad del equipo y la organización; la gestión de presupuesto tradicional no es un rol definido en la Scrum Guide',
          C: 'Solo en proyectos grandes',
          D: 'Solo si el Product Owner se lo delega formalmente',
        },
        answer: ['B'],
        explanation:
          'La Scrum Guide no define al Scrum Master como gestor de presupuesto o reportero de estatus tradicional; su enfoque es servir al Scrum Team, al Product Owner y a la organización para maximizar el valor entregado a través de Scrum.',
        domain: 'Roles de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el tamaño recomendado del Scrum Team (incluyendo Scrum Master y Product Owner) según la Scrum Guide 2020, para mantener agilidad?',
        options: {
          A: 'Generalmente 10 personas o menos',
          B: 'Siempre exactamente 20 personas',
          C: 'No hay ninguna recomendación de tamaño',
          D: 'Mínimo 30 personas para ser efectivo',
        },
        answer: ['A'],
        explanation:
          'La Scrum Guide 2020 recomienda que el Scrum Team sea usualmente de 10 personas o menos, lo suficientemente pequeño para mantenerse ágil y lo suficientemente grande para completar trabajo significativo dentro de un Sprint.',
        domain: 'Roles de Scrum',
        difficulty: 'medium',
      },

      // ── Eventos de Scrum (8) ────────────────────────────────────────
      {
        type: 'multiple',
        question: '¿Cuál es la duración máxima recomendada de un Sprint según la Scrum Guide?',
        options: {
          A: '1 mes o menos',
          B: 'Exactamente 2 semanas, sin excepción',
          C: '3 meses',
          D: 'No tiene límite máximo definido',
        },
        answer: ['A'],
        explanation:
          'La Scrum Guide define el Sprint como un time-box de un mes o menos, dentro del cual se crea un Increment de producto usable; muchos equipos usan 2 semanas, pero la guía permite hasta 1 mes.',
        domain: 'Eventos de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito principal del Daily Scrum?',
        options: {
          A: 'Que cada Developer reporte su estatus individual al Scrum Master como si fuera su jefe',
          B: 'Inspeccionar el progreso hacia el Sprint Goal y adaptar el Sprint Backlog según sea necesario, ajustando el plan de trabajo próximo',
          C: 'Aprobar formalmente el presupuesto del Sprint',
          D: 'Reemplazar la necesidad de la Sprint Review',
        },
        answer: ['B'],
        explanation:
          'El Daily Scrum es un evento de 15 minutos para que los Developers inspeccionen el progreso hacia el Sprint Goal y adapten el Sprint Backlog, planificando el trabajo de las próximas 24 horas — no es un reporte de estatus jerárquico al Scrum Master.',
        domain: 'Eventos de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué se define como resultado principal de la Sprint Planning?',
        options: {
          A: 'El Sprint Goal, junto con el Sprint Backlog: los ítems seleccionados del Product Backlog y un plan para entregarlos',
          B: 'El presupuesto anual del producto',
          C: 'La lista de bugs reportados en producción',
          D: 'El organigrama del equipo',
        },
        answer: ['A'],
        explanation:
          'La Sprint Planning produce el Sprint Goal (el "por qué" del Sprint) y el Sprint Backlog (los ítems del Product Backlog seleccionados más el plan de los Developers para entregarlos) — la base de trabajo para todo el Sprint.',
        domain: 'Eventos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Durante la Sprint Review, ¿qué actividad es central según la Scrum Guide?',
        options: {
          A: 'El Scrum Team presenta el Increment y colabora con los stakeholders sobre qué hacer a continuación, inspeccionando el resultado del Sprint frente al mercado/entorno',
          B: 'El equipo se autoevalúa internamente sin la presencia de stakeholders',
          C: 'Se define el presupuesto del próximo trimestre',
          D: 'Se realiza exclusivamente una demo sin ninguna discusión posterior',
        },
        answer: ['A'],
        explanation:
          'La Sprint Review es un evento de trabajo (no solo una demo) donde el Scrum Team y los stakeholders inspeccionan el resultado del Sprint y colaboran sobre los próximos pasos, ajustando el Product Backlog según sea necesario según el contexto de mercado/negocio.',
        domain: 'Eventos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Cuál es el objetivo principal de la Sprint Retrospective?',
        options: {
          A: 'Revisar el Increment de producto con los stakeholders',
          B: 'Inspeccionar cómo fue el último Sprint en términos de personas, relaciones, procesos y herramientas, e identificar mejoras a implementar',
          C: 'Planificar el trabajo técnico del próximo Sprint en detalle',
          D: 'Evaluar el desempeño individual de cada Developer para fines de compensación',
        },
        answer: ['B'],
        explanation:
          'La Sprint Retrospective es el evento donde el Scrum Team inspecciona cómo transcurrió el Sprint (personas, relaciones, procesos, herramientas) y planea mejoras concretas a implementar en el siguiente Sprint — enfocado en mejora continua del equipo, no evaluación individual.',
        domain: 'Eventos de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un Sprint termina anticipadamente antes de su duración planeada. Según la Scrum Guide, ¿quién tiene autoridad para cancelar un Sprint?',
        options: {
          A: 'Cualquier Developer del equipo',
          B: 'Únicamente el Product Owner, si el Sprint Goal se vuelve obsoleto',
          C: 'Cualquier stakeholder externo con suficiente autoridad',
          D: 'Nunca se puede cancelar un Sprint una vez iniciado',
        },
        answer: ['B'],
        explanation:
          'La Scrum Guide establece que solo el Product Owner tiene la autoridad de cancelar un Sprint, y típicamente lo haría si el Sprint Goal se vuelve obsoleto — es un evento poco común e infrecuente.',
        domain: 'Eventos de Scrum',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué es el Sprint Goal y qué característica clave tiene durante el Sprint?',
        options: {
          A: 'Una lista detallada de tareas que puede cambiar libremente cada día del Sprint',
          B: 'El único objetivo del Sprint que da coherencia al trabajo; se mantiene estable, aunque el alcance exacto para lograrlo puede clarificarse mientras el equipo aprende más',
          C: 'Un documento que solo define el Product Owner sin participación del equipo',
          D: 'Se define después de terminado el Sprint, no antes',
        },
        answer: ['B'],
        explanation:
          'El Sprint Goal es el único objetivo del Sprint, negociado durante la Sprint Planning; brinda flexibilidad al equipo sobre el trabajo exacto, pero el objetivo en sí se mantiene estable durante el Sprint, dando coherencia y enfoque.',
        domain: 'Eventos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la duración time-boxed recomendada para el Daily Scrum, independientemente de la duración del Sprint?',
        options: {
          A: '5 minutos',
          B: '15 minutos',
          C: '1 hora',
          D: 'No tiene time-box definido',
        },
        answer: ['B'],
        explanation:
          'El Daily Scrum es un evento de 15 minutos, la misma duración sin importar cuán largo sea el Sprint, diseñado para mantener el enfoque en el progreso hacia el Sprint Goal de forma ágil y frecuente.',
        domain: 'Eventos de Scrum',
        difficulty: 'easy',
      },

      // ── Artefactos de Scrum (6) ─────────────────────────────────────
      {
        type: 'multiple',
        question: '¿Qué es el Product Backlog?',
        options: {
          A: 'Una lista fija de tareas que nunca cambia durante el proyecto',
          B: 'Una lista emergente y ordenada de lo que se necesita para mejorar el producto, la única fuente de trabajo del Scrum Team',
          C: 'El plan de trabajo exclusivo del Sprint actual',
          D: 'Un documento que solo usan los stakeholders, no el equipo',
        },
        answer: ['B'],
        explanation:
          'El Product Backlog es una lista emergente (nunca completa) y ordenada por valor de todo lo que se necesita para mejorar el producto — es la única fuente de trabajo para el Scrum Team, gestionada por el Product Owner.',
        domain: 'Artefactos de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué compromiso (commitment) está asociado al Product Backlog?',
        options: {
          A: 'El Sprint Goal',
          B: 'El Product Goal, que describe un estado futuro del producto que sirve como objetivo a largo plazo para el Scrum Team',
          C: 'La Definition of Done',
          D: 'No tiene ningún compromiso asociado',
        },
        answer: ['B'],
        explanation:
          'Cada uno de los tres artefactos de Scrum tiene un "commitment" asociado: el Product Backlog tiene el Product Goal, el Sprint Backlog tiene el Sprint Goal, y el Increment tiene la Definition of Done.',
        domain: 'Artefactos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué compone el Sprint Backlog?',
        options: {
          A: 'Solo la lista de bugs encontrados en producción',
          B: 'El Sprint Goal, los ítems del Product Backlog seleccionados para el Sprint, y el plan de acción de los Developers para entregar el Increment',
          C: 'Únicamente el presupuesto asignado al Sprint',
          D: 'La lista completa e histórica de todos los Sprints anteriores',
        },
        answer: ['B'],
        explanation:
          'El Sprint Backlog combina tres elementos: el Sprint Goal (el porqué), los ítems del Product Backlog seleccionados (el qué) y el plan de entrega de los Developers (el cómo) — es propiedad exclusiva de los Developers.',
        domain: 'Artefactos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué es la "Definition of Done" (DoD) y por qué es importante?',
        options: {
          A: 'Una lista de tareas pendientes que aún no se han iniciado',
          B: 'Una descripción formal del estado que debe cumplir un Increment para considerarse terminado, asegurando transparencia y un entendimiento compartido de calidad',
          C: 'El nombre alternativo del Sprint Backlog',
          D: 'Un documento que solo aplica al final de todo el proyecto, no de cada Sprint',
        },
        answer: ['B'],
        explanation:
          'La Definition of Done es un criterio formal y compartido que determina cuándo un incremento de trabajo está realmente "terminado" (ej. probado, documentado, desplegable), garantizando transparencia sobre la calidad real del Increment.',
        domain: 'Artefactos de Scrum',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un ítem del Product Backlog aún no cumple con la Definition of Done al finalizar el Sprint. ¿Puede presentarse como parte del Increment en la Sprint Review?',
        options: {
          A: 'Sí, siempre que el Product Owner lo autorice verbalmente',
          B: 'No — un ítem que no cumple la Definition of Done no puede ser liberado ni presentado como parte del Increment; regresa al Product Backlog',
          C: 'Sí, si el cliente está de acuerdo en flexibilizar la calidad',
          D: 'Depende únicamente de la opinión del Scrum Master',
        },
        answer: ['B'],
        explanation:
          'La Definition of Done es un estándar objetivo y no negociable caso a caso: un ítem que no la cumple no forma parte del Increment y regresa al Product Backlog para consideración futura, sin importar presión de tiempo o stakeholders.',
        domain: 'Artefactos de Scrum',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué es el Increment en Scrum?',
        options: {
          A: 'Un documento de planificación que se crea antes de iniciar el Sprint',
          B: 'Un paso concreto y funcional hacia el Product Goal, que se suma a todos los Increments anteriores y debe cumplir la Definition of Done',
          C: 'El listado de impedimentos del Scrum Master',
          D: 'Un reporte financiero del Sprint',
        },
        answer: ['B'],
        explanation:
          'El Increment es la suma acumulativa de todos los ítems del Product Backlog completados durante un Sprint y todos los Sprints anteriores, y debe ser usable y cumplir la Definition of Done — cada Increment es un paso concreto hacia el Product Goal.',
        domain: 'Artefactos de Scrum',
        difficulty: 'medium',
      },

      // ── Valores y principios ágiles (5) ──────────────────────────────
      {
        type: 'multiple',
        question: '¿Cuáles son los cinco valores de Scrum según la Scrum Guide?',
        options: {
          A: 'Velocidad, eficiencia, calidad, costo, alcance',
          B: 'Compromiso, foco, apertura, respeto y coraje',
          C: 'Planificación, ejecución, monitoreo, control y cierre',
          D: 'Individuos, herramientas, colaboración y respuesta al cambio',
        },
        answer: ['B'],
        explanation:
          'Los cinco valores de Scrum son: Compromiso (Commitment), Foco (Focus), Apertura (Openness), Respeto (Respect) y Coraje (Courage) — sustentan la implementación de los pilares empíricos de Scrum (transparencia, inspección, adaptación).',
        domain: 'Valores y principios ágiles',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuáles son los tres pilares del control de procesos empírico en los que se basa Scrum?',
        options: {
          A: 'Planificación, ejecución y cierre',
          B: 'Transparencia, inspección y adaptación',
          C: 'Velocidad, calidad y costo',
          D: 'Roles, eventos y artefactos',
        },
        answer: ['B'],
        explanation:
          'Scrum se basa en el empirismo, sustentado en tres pilares: transparencia (el trabajo es visible para quienes lo realizan y lo reciben), inspección (revisión frecuente del progreso) y adaptación (ajustar el proceso cuando se detectan desviaciones).',
        domain: 'Valores y principios ágiles',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Según el Manifiesto Ágil, ¿cuál de las siguientes es una de las cuatro preferencias de valor declaradas?',
        options: {
          A: 'Seguir un plan sobre responder al cambio',
          B: 'Individuos e interacciones sobre procesos y herramientas',
          C: 'Documentación exhaustiva sobre software funcionando',
          D: 'Negociación de contratos sobre colaboración con el cliente',
        },
        answer: ['B'],
        explanation:
          'El Manifiesto Ágil valora "individuos e interacciones sobre procesos y herramientas" (junto con software funcionando sobre documentación exhaustiva, colaboración con el cliente sobre negociación de contratos, y responder al cambio sobre seguir un plan) — sin descartar el valor de la segunda parte de cada par.',
        domain: 'Valores y principios ágiles',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un equipo que dice seguir Scrum en realidad omite la Sprint Retrospective "para ahorrar tiempo" y nunca actualiza su forma de trabajar. ¿Qué principio ágil está vulnerando principalmente?',
        options: {
          A: 'El pilar de adaptación: sin inspeccionar y ajustar el proceso regularmente, el equipo no mejora de forma continua',
          B: 'Ningún principio, ya que las retrospectivas son opcionales',
          C: 'El valor de "negociación de contratos sobre colaboración con el cliente"',
          D: 'El principio de documentación exhaustiva',
        },
        answer: ['A'],
        explanation:
          'Omitir la Sprint Retrospective rompe el pilar de adaptación del empirismo: sin ese espacio de inspección y ajuste continuo, el equipo pierde su mecanismo formal de mejora de procesos, personas y herramientas — un elemento no opcional de Scrum real.',
        domain: 'Valores y principios ágiles',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Por qué se dice que Scrum es un "framework" y no una metodología prescriptiva completa?',
        options: {
          A: 'Porque Scrum define exactamente cada técnica y herramienta que el equipo debe usar',
          B: 'Porque Scrum define un conjunto mínimo de roles, eventos y artefactos, dejando a los equipos decidir las prácticas y técnicas específicas dentro de ese marco',
          C: 'Porque Scrum no tiene ninguna estructura definida',
          D: 'Porque Scrum solo aplica a proyectos de software',
        },
        answer: ['B'],
        explanation:
          'Scrum es deliberadamente un framework ligero: define la estructura mínima (roles, eventos, artefactos, reglas) para gestionar trabajo complejo, pero no prescribe técnicas específicas (ej. cómo estimar, qué herramienta usar) — eso queda a criterio de cada equipo/organización.',
        domain: 'Valores y principios ágiles',
        difficulty: 'medium',
      },

      // ── Responsabilidades y servant leadership del Scrum Master (5) ──
      {
        type: 'multiple',
        question:
          'El equipo enfrenta un impedimento organizacional recurrente: otro departamento tarda semanas en aprobar despliegues. ¿Cuál es el rol del Scrum Master frente a este impedimento?',
        options: {
          A: 'Ignorarlo porque está fuera del equipo Scrum',
          B: 'Trabajar activamente para remover o escalar el impedimento, incluso si involucra a la organización más amplia fuera del Scrum Team',
          C: 'Decirle al equipo que se adapte permanentemente a la demora sin buscar solución',
          D: 'Delegar la resolución exclusivamente al Product Owner',
        },
        answer: ['B'],
        explanation:
          'Remover impedimentos —incluso organizacionales que trascienden al Scrum Team— es una responsabilidad central del Scrum Master como líder-servidor, ya sea resolviéndolos directamente o facilitando su escalamiento a quien pueda resolverlos.',
        domain: 'Servant Leadership del Scrum Master',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿De qué forma sirve el Scrum Master al Product Owner según la Scrum Guide?',
        options: {
          A: 'Tomando las decisiones de priorización del Product Backlog en su lugar',
          B: 'Ayudándolo a encontrar técnicas para una gestión efectiva del Product Backlog, facilitando la comunicación con stakeholders y ayudando a establecer el Product Goal',
          C: 'Reemplazándolo cuando está de vacaciones',
          D: 'Aprobando el presupuesto del producto en su nombre',
        },
        answer: ['B'],
        explanation:
          'El Scrum Master sirve al Product Owner apoyándolo con técnicas de gestión del Product Backlog, facilitando la colaboración con stakeholders y el resto de la organización, sin tomar las decisiones de priorización que son responsabilidad exclusiva del Product Owner.',
        domain: 'Servant Leadership del Scrum Master',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una organización nueva en agilidad le pide al Scrum Master que "controle" al equipo para que trabaje más rápido. ¿Cuál es la respuesta más alineada al rol real de Scrum Master?',
        options: {
          A: 'Aceptar y comenzar a asignar tareas individuales para acelerar el ritmo',
          B: 'Explicar que su rol es servir y facilitar, no controlar, y trabajar con la organización para entender y adoptar correctamente Scrum y sus beneficios reales',
          C: 'Renunciar inmediatamente sin dar explicaciones',
          D: 'Ignorar la solicitud sin dialogar con la organización',
        },
        answer: ['B'],
        explanation:
          'Parte del rol del Scrum Master es ayudar a la organización a entender las interacciones de Scrum, corrigiendo malentendidos sobre su rol (no es un gestor de control) y guiando una adopción genuina del framework en lugar de solo "ir más rápido".',
        domain: 'Servant Leadership del Scrum Master',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cómo sirve el Scrum Master a la organización, más allá del Scrum Team?',
        options: {
          A: 'No tiene ninguna responsabilidad fuera del Scrum Team',
          B: 'Liderando, entrenando y guiando a la organización en su adopción de Scrum, planificando implementaciones y trabajando con otros Scrum Masters para aumentar la efectividad de la aplicación de Scrum',
          C: 'Aprobando contrataciones de nuevo personal',
          D: 'Definiendo la estrategia comercial de la empresa',
        },
        answer: ['B'],
        explanation:
          'La Scrum Guide define explícitamente que el Scrum Master sirve a la organización liderando su adopción de Scrum, planificando implementaciones, ayudando a stakeholders a entender el trabajo empírico y de producto, y colaborando con otros Scrum Masters para elevar la efectividad general.',
        domain: 'Servant Leadership del Scrum Master',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Un Developer le pide al Scrum Master que le diga exactamente cómo resolver un problema técnico dentro del Sprint. ¿Cuál es la respuesta más alineada al servant leadership?',
        options: {
          A: 'Resolver el problema técnico directamente en lugar del equipo',
          B: 'Facilitar que el equipo, que es autoorganizado, encuentre su propia solución (ej. haciendo preguntas, conectándolos con quien tenga el conocimiento), en vez de dictar la solución técnica',
          C: 'Decirle que no es su problema y no ofrecer ningún apoyo',
          D: 'Escalar automáticamente el problema a la gerencia sin involucrar al equipo',
        },
        answer: ['B'],
        explanation:
          'El servant leadership del Scrum Master no implica resolver problemas técnicos por el equipo (que es autoorganizado y multifuncional), sino facilitar que el equipo mismo encuentre soluciones, preservando su autonomía y capacidad de autogestión.',
        domain: 'Servant Leadership del Scrum Master',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'scrum-product-owner-pspo',
    title: 'Scrum.org PSPO I — Product Owner',
    description: 'Examen de práctica alineado al Professional Scrum Product Owner I: rol del PO, valor de producto, Product Backlog y stakeholders.',
    domain: 'agile', category: 'scrum', level: 'intermediate', language: 'es',
    tags: ['scrum', 'pspo', 'product-owner'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en Scrum.org PSPO I Assessment + The Scrum Guide 2020 — scrumguides.org (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es la responsabilidad central del Product Owner según la Scrum Guide?', options: { A: 'Maximizar el valor del producto resultante del trabajo del Scrum Team, principalmente gestionando el Product Backlog', B: 'Asignar tareas diarias a cada Developer', C: 'Facilitar las ceremonias de Scrum', D: 'Aprobar el presupuesto anual de la empresa' }, answer: ['A'], explanation: 'El Product Owner es responsable de maximizar el valor del producto, principalmente a través de la gestión efectiva del Product Backlog: definir el Product Goal, ordenar ítems por valor y mantener transparencia sobre el backlog.', domain: 'Marco Scrum y rol del Product Owner', difficulty: 'easy' },
      { type: 'multiple', question: '¿Puede el Product Owner delegar la gestión del Product Backlog a los Developers, mientras sigue siendo responsable del resultado?', options: { A: 'No, nunca puede delegar ninguna parte de su trabajo', B: 'Sí, el Product Owner puede delegar este trabajo, pero sigue siendo el responsable final ante el resultado', C: 'Solo el Scrum Master puede gestionar el backlog', D: 'La gestión del backlog es responsabilidad exclusiva de los stakeholders' }, answer: ['B'], explanation: 'La Scrum Guide permite que el Product Owner delegue partes del trabajo de gestión del backlog a otros (ej. Developers), pero la responsabilidad final sigue siendo del Product Owner.', domain: 'Marco Scrum y rol del Product Owner', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "Product Goal" y qué función cumple para el Product Owner?', options: { A: 'Describe un estado futuro deseado del producto que sirve como objetivo a largo plazo para todo el Scrum Team, guiando la planificación del Product Backlog', B: 'Un sinónimo de Sprint Goal', C: 'Una lista de tareas técnicas específicas de un Sprint', D: 'Un documento que solo usa el Scrum Master' }, answer: ['A'], explanation: 'El Product Goal es el compromiso asociado al Product Backlog: describe un estado futuro del producto que da dirección a largo plazo, y cada Sprint debe acercar al Scrum Team a alcanzarlo.', domain: 'Producto y meta de producto', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "refinement" (refinamiento) del Product Backlog?', options: { A: 'La actividad continua de agregar detalle, estimaciones y orden a los ítems del Product Backlog, típicamente involucrando al PO y a los Developers', B: 'Un evento formal obligatorio con time-box fijo definido por la Scrum Guide', C: 'Un proceso que solo ocurre una vez al inicio del proyecto', D: 'Una tarea exclusiva del Scrum Master' }, answer: ['A'], explanation: 'El refinamiento es una actividad continua (no un evento formal con time-box fijo en la Scrum Guide) donde el Product Owner y los Developers colaboran para agregar detalle, claridad y orden a los ítems próximos del Product Backlog.', domain: 'Product Backlog y refinement', difficulty: 'medium' },
      { type: 'multiple', question: 'Un ítem del Product Backlog debe estar lo suficientemente refinado (claro, estimado, pequeño) antes de qué evento, según la práctica común de Scrum?', options: { A: 'Sprint Planning, para que pueda ser seleccionado y comprendido por los Developers', B: 'Sprint Retrospective', C: 'La creación de la empresa', D: 'El primer Daily Scrum de todo el proyecto' }, answer: ['A'], explanation: 'Los ítems suficientemente refinados (con claridad de valor y esfuerzo) son los que el Product Owner presenta como candidatos en Sprint Planning, facilitando que los Developers puedan comprometerse con un Sprint Goal realista.', domain: 'Product Backlog y refinement', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cómo debe un Product Owner priorizar el Product Backlog cuando existen múltiples stakeholders con demandas contradictorias?', options: { A: 'Priorizar automáticamente al stakeholder de mayor jerarquía sin ningún otro criterio', B: 'Tomar la decisión final basándose en el valor de negocio esperado, después de escuchar y considerar las perspectivas de los distintos stakeholders', C: 'Delegar la decisión final a los Developers', D: 'Nunca priorizar y dejar que cada stakeholder trabaje en su propia versión del producto' }, answer: ['B'], explanation: 'Aunque el Product Owner debe escuchar activamente a los stakeholders, la autoridad final de priorización según valor de negocio recae únicamente en él/ella — no delega esa decisión, pero tampoco la toma en aislamiento sin considerar el contexto de los stakeholders.', domain: 'Gestión de stakeholders', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué métrica podría usar un Product Owner para medir si el producto realmente está generando el valor esperado, más allá de simplemente completar ítems del backlog?', options: { A: 'Cantidad de story points completados por Sprint (velocity)', B: 'Métricas de resultado (outcome), como retención de usuarios, satisfacción del cliente o ingresos generados, en lugar de solo métricas de output (cantidad de features entregadas)', C: 'Número de reuniones realizadas', D: 'Número de horas trabajadas por el equipo' }, answer: ['B'], explanation: 'El Product Owner debe enfocarse en métricas de resultado/valor real para el usuario y el negocio (retención, satisfacción, ingresos), no solo en métricas de output como velocity, que miden actividad pero no necesariamente valor generado.', domain: 'Valor entregado y métricas', difficulty: 'hard' },
      { type: 'multiple', question: 'Durante la Sprint Planning, ¿cuál es el rol específico del Product Owner respecto al "por qué" del Sprint?', options: { A: 'Ayudar a los Developers a entender el "por qué" (el valor de negocio) de los ítems seleccionados, colaborando en la definición del Sprint Goal', B: 'No participa en absoluto en la Sprint Planning', C: 'Decide unilateralmente todas las tareas técnicas del Sprint', D: 'Solo observa sin ninguna participación activa' }, answer: ['A'], explanation: 'El Product Owner participa activamente en Sprint Planning aclarando el valor de negocio y el "por qué" de los ítems propuestos, colaborando con los Developers en la definición del Sprint Goal, aunque no decide las tareas técnicas específicas (eso corresponde a los Developers).', domain: 'Sprint Planning desde la perspectiva del PO', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el rol del Product Owner durante la Sprint Review?', options: { A: 'Presentar el Increment junto al equipo y colaborar con los stakeholders sobre qué hacer a continuación, ajustando el Product Backlog según el feedback recibido si es necesario', B: 'Solo tomar notas sin participar activamente', C: 'Prohibir cualquier feedback de los stakeholders', D: 'Evaluar el desempeño individual de cada Developer' }, answer: ['A'], explanation: 'El Product Owner participa activamente en la Sprint Review, presentando (junto al equipo) el estado del Product Backlog y el progreso hacia el Product Goal, y colaborando con los stakeholders sobre los próximos pasos según el feedback recibido.', domain: 'Sprint Review', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué técnica de priorización ayuda a un Product Owner a categorizar ítems del backlog según su urgencia e importancia relativa?', options: { A: 'MoSCoW (Must have, Should have, Could have, Won\'t have)', B: 'HTML y CSS', C: 'TCP/IP', D: 'OSI Model' }, answer: ['A'], explanation: 'MoSCoW es una técnica de priorización que categoriza los requisitos en Must have (imprescindible), Should have (importante pero no crítico), Could have (deseable) y Won\'t have (fuera de alcance por ahora), ayudando al PO a comunicar prioridades claramente.', domain: 'Product Backlog y refinement', difficulty: 'medium' },
    ],
  },
  {
    slug: 'safe-scrum-master',
    title: 'SAFe Scrum Master (SSM)',
    description: 'Examen de práctica sobre el rol del Scrum Master dentro del Scaled Agile Framework (SAFe) 6.0: ART, PI Planning y facilitación.',
    domain: 'agile', category: 'safe', level: 'advanced', language: 'es',
    tags: ['safe', 'sm', 'scaled-agile'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en Scaled Agile Framework 6.0 — scaledagile.com/certification (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué es un Agile Release Train (ART) en SAFe?', options: { A: 'Un equipo virtual de agile teams (típicamente 50-125 personas) que planifican, se comprometen y entregan valor juntos de forma sincronizada', B: 'Un sinónimo de Product Backlog', C: 'Un tipo de servidor de CI/CD', D: 'Un evento que ocurre una sola vez al año' }, answer: ['A'], explanation: 'Un ART agrupa a múltiples equipos ágiles (típicamente entre 50 y 125 personas) que trabajan de forma sincronizada bajo una cadencia común, entregando valor de forma incremental e integrada como parte de un mismo tren de desarrollo.', domain: 'Scaled Agile Framework', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el rol principal del Scrum Master dentro de un ART de SAFe, más allá de su equipo individual?', options: { A: 'Únicamente facilitar el Daily Scrum de su propio equipo, sin ninguna otra responsabilidad', B: 'Facilitar la coordinación entre equipos, identificar y ayudar a resolver dependencias e impedimentos que trascienden su equipo, y contribuir a la salud del ART en general', C: 'Aprobar el presupuesto de todo el ART', D: 'Decidir la arquitectura técnica del sistema' }, answer: ['B'], explanation: 'A diferencia de un Scrum Master de un solo equipo, en SAFe el Scrum Master también contribuye a la coordinación entre equipos, ayudando a identificar y resolver dependencias e impedimentos a nivel de ART, no solo dentro de su equipo.', domain: 'Rol del SM en el Agile Release Train (ART)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el PI Planning (Program Increment Planning) en SAFe?', options: { A: 'Un evento presencial (o virtual) donde todos los equipos de un ART se reúnen para planificar y alinear su trabajo del próximo Program Increment (típicamente 8-12 semanas)', B: 'Un evento exclusivamente individual sin participación de otros equipos', C: 'Un sinónimo de Sprint Retrospective', D: 'Un proceso que ocurre solo al final de cada release' }, answer: ['A'], explanation: 'El PI Planning es un evento cadenciado donde todos los equipos de un ART se reúnen para planificar de forma alineada y colaborativa su trabajo del próximo Program Increment, identificando dependencias y riesgos entre equipos.', domain: 'PI Planning y eventos', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué rol tiene el Scrum Master durante el PI Planning respecto a su equipo?', options: { A: 'Facilitar que su equipo participe efectivamente, ayudando a estimar capacidad, identificar riesgos y dependencias, y contribuir a definir los objetivos del equipo para el PI', B: 'Ninguna participación, el PI Planning es solo para Product Managers', C: 'Tomar las decisiones técnicas por el equipo', D: 'Prohibir que el equipo interactúe con otros equipos durante el evento' }, answer: ['A'], explanation: 'Durante el PI Planning, el Scrum Master facilita la participación efectiva de su equipo: ayuda con la estimación de capacidad, la identificación de dependencias/riesgos con otros equipos, y guía la definición de los objetivos del equipo para el PI.', domain: 'PI Planning y eventos', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "ROAM board" usado durante el PI Planning para gestionar riesgos identificados?', options: { A: 'Una herramienta que clasifica cada riesgo identificado como Resolved, Owned, Accepted o Mitigated, dando visibilidad y seguimiento explícito a cómo se gestionará', B: 'Un tipo de tablero Kanban exclusivo para bugs', C: 'Un sinónimo de Product Backlog', D: 'Un documento financiero de presupuesto' }, answer: ['A'], explanation: 'El ROAM board categoriza los riesgos identificados durante el PI Planning en Resolved (resueltos), Owned (con un dueño asignado para seguimiento), Accepted (aceptados conscientemente) o Mitigated (con un plan de mitigación), dando transparencia sobre su gestión.', domain: 'PI Planning y eventos', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué evento de coordinación entre Scrum Masters de distintos equipos dentro de un ART ayuda a identificar y resolver dependencias/impedimentos entre equipos de forma regular?', options: { A: 'Scrum of Scrums', B: 'Retrospectiva individual de un solo equipo', C: 'Sprint Planning de un solo equipo', D: 'Revisión de código' }, answer: ['A'], explanation: 'El Scrum of Scrums reúne regularmente a representantes (a menudo Scrum Masters) de los distintos equipos del ART para coordinar el progreso, identificar y resolver dependencias e impedimentos que afectan a múltiples equipos.', domain: 'Dependencias entre equipos', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué métrica de SAFe se usa comúnmente para medir qué tan bien un equipo o ART cumplió con los objetivos comprometidos al final de un Program Increment?', options: { A: 'PI Predictability Measure (medida de predictibilidad del PI)', B: 'Cantidad de commits en el repositorio de código', C: 'Número de reuniones realizadas', D: 'Tamaño del equipo' }, answer: ['A'], explanation: 'La medida de predictibilidad del PI compara el valor de negocio planificado versus el realmente entregado al final del Program Increment, dando una señal de qué tan confiable es la capacidad de planificación y entrega del equipo/ART.', domain: 'Métricas SAFe', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué principio del Lean-Agile Mindset de SAFe enfatiza tomar decisiones lo más tarde posible responsablemente, manteniendo opciones abiertas mientras se reduce la incertidumbre?', options: { A: 'Set-Based Design (o "last responsible moment")', B: 'Waterfall planning estricto', C: 'Comprometerse con todo el alcance desde el día 1 sin flexibilidad', D: 'Ignorar por completo la incertidumbre del proyecto' }, answer: ['A'], explanation: 'El principio de Lean de "last responsible moment" / set-based design promueve mantener múltiples opciones de diseño abiertas y postergar decisiones críticas hasta tener suficiente información, en vez de comprometerse prematuramente con una sola opción.', domain: 'Lean-Agile mindset', difficulty: 'hard' },
      { type: 'multiple', question: '¿Cómo se relaciona el "servant leadership" (liderazgo de servicio) con el rol del Scrum Master en SAFe?', options: { A: 'El SM lidera removiendo impedimentos y sirviendo al equipo/ART, en lugar de dirigir o controlar directamente el trabajo técnico', B: 'El servant leadership no es relevante para el rol de Scrum Master en SAFe', C: 'El SM debe tomar todas las decisiones técnicas del equipo sin delegar nada', D: 'Servant leadership es exclusivo de los Release Train Engineers, no de los Scrum Masters' }, answer: ['A'], explanation: 'Al igual que en Scrum tradicional, el Scrum Master de SAFe ejerce liderazgo de servicio: prioriza remover impedimentos, facilitar y empoderar al equipo, en lugar de dirigir el trabajo técnico o tomar decisiones que corresponden al equipo.', domain: 'Coaching y servant leadership', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué evento se realiza al final de cada Iteración (Sprint) dentro de SAFe, similar a una retrospectiva pero también incluyendo una revisión del Iteration Backlog?', options: { A: 'Iteration Review y Iteration Retrospective', B: 'PI Planning', C: 'Inspect & Adapt exclusivamente a nivel de todo el ART', D: 'System Demo únicamente' }, answer: ['A'], explanation: 'Al final de cada Iteración, el equipo realiza una Iteration Review (revisar el trabajo completado) y una Iteration Retrospective (reflexionar sobre el proceso), de forma análoga a la Sprint Review y Retrospective de Scrum, pero dentro del contexto de SAFe.', domain: 'Facilitación de iteraciones', difficulty: 'medium' },
    ],
  },
  {
    slug: 'kanban-management-professional',
    title: 'Kanban Management Professional (KMP)',
    description: 'Examen de práctica sobre el Método Kanban: principios, prácticas, gestión del flujo y métricas de Kanban University.',
    domain: 'agile', category: 'kanban', level: 'intermediate', language: 'es',
    tags: ['kanban', 'flow', 'lean'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en Kanban University KMP I Body of Knowledge + "Kanban" de David J. Anderson — kanban.university (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es uno de los principios fundamentales del Método Kanban respecto a cómo iniciar su adopción en un equipo?', options: { A: 'Comenzar con lo que se hace ahora (start with what you do now), en vez de imponer un proceso completamente nuevo desde el inicio', B: 'Reemplazar inmediatamente todo el proceso existente por uno completamente nuevo', C: 'Requiere obligatoriamente contratar un equipo completamente nuevo', D: 'Solo puede aplicarse en equipos de desarrollo de software' }, answer: ['A'], explanation: 'Uno de los principios centrales de Kanban es "comenzar con lo que haces ahora": en vez de imponer un proceso disruptivo desde cero, se parte del proceso/roles/responsabilidades actuales y se mejora incrementalmente desde ahí.', domain: 'Principios y prácticas del Método Kanban', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué práctica de Kanban implica hacer visible el flujo de trabajo (típicamente mediante un tablero con columnas que representan etapas)?', options: { A: 'Visualizar el flujo de trabajo', B: 'Limitar el número de reuniones', C: 'Eliminar por completo el trabajo en progreso', D: 'Ocultar el estado del trabajo a los stakeholders' }, answer: ['A'], explanation: 'Visualizar el flujo de trabajo (típicamente con un tablero Kanban) hace explícito el estado del trabajo, las etapas del proceso y los cuellos de botella, siendo la primera práctica fundamental del método.', domain: 'Visualización del flujo', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué problema busca resolver establecer límites de Work In Progress (WIP) en cada columna del tablero Kanban?', options: { A: 'Reducir el multitasking excesivo y los cuellos de botella, forzando al equipo a completar trabajo en curso antes de tomar trabajo nuevo, mejorando el flujo general', B: 'Aumentar la cantidad de trabajo iniciado simultáneamente sin ningún límite', C: 'Eliminar la necesidad de priorizar el trabajo', D: 'No tiene ningún propósito práctico real' }, answer: ['A'], explanation: 'Los límites de WIP fuerzan al equipo a enfocarse en completar el trabajo actual antes de iniciar más, reduciendo el multitasking (que degrada la eficiencia) y haciendo visibles los cuellos de botella cuando una columna se satura.', domain: 'Límites WIP', difficulty: 'easy' },
      { type: 'multiple', question: 'Si el equipo nota que el trabajo se acumula constantemente en una columna específica del tablero (ej. "En revisión"), superando su límite WIP, ¿qué acción sugiere el método Kanban?', options: { A: 'Ignorar la acumulación mientras eventualmente se resuelva', B: 'Enfocar el esfuerzo del equipo en destrabar ese cuello de botella (ej. reasignando temporalmente personas a esa etapa) antes de tomar trabajo nuevo en etapas anteriores', C: 'Aumentar indefinidamente el límite WIP de esa columna sin investigar la causa', D: 'Eliminar la columna del tablero para que el problema "desaparezca"' }, answer: ['B'], explanation: 'Kanban promueve gestionar el flujo activamente: cuando se identifica un cuello de botella, el equipo debe enfocar esfuerzo en resolverlo (swarming) antes de seguir alimentando etapas anteriores con más trabajo que solo empeoraría la acumulación.', domain: 'Gestión del flujo', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué son las "políticas explícitas" en el contexto del Método Kanban?', options: { A: 'Reglas claramente definidas y visibles sobre cómo se mueve el trabajo entre columnas (ej. criterios para pasar de "en progreso" a "listo"), reduciendo ambigüedad y facilitando decisiones consistentes', B: 'Un documento legal exclusivo del departamento de RRHH', C: 'Reglas que solo conocen los gerentes, no el equipo', D: 'Un sinónimo de límites WIP' }, answer: ['A'], explanation: 'Hacer explícitas las políticas del proceso (ej. "Definition of Done" de cada columna) elimina ambigüedad sobre cuándo un ítem puede avanzar entre etapas, permitiendo que cualquier miembro del equipo tome decisiones consistentes sin depender de interpretaciones individuales.', domain: 'Políticas explícitas', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué práctica de Kanban implica reuniones regulares (ej. revisiones de operaciones, revisiones de riesgo) para inspeccionar el desempeño y ajustar el sistema?', options: { A: 'Implementar ciclos de feedback', B: 'Eliminar toda comunicación entre equipos', C: 'Aumentar indefinidamente el WIP sin ninguna revisión', D: 'Ignorar las métricas de flujo' }, answer: ['A'], explanation: 'Los ciclos de feedback (cadencias como daily standups, revisiones de servicio, revisiones de riesgo) permiten al equipo inspeccionar regularmente cómo está funcionando el sistema y hacer ajustes basados en datos reales.', domain: 'Ciclos de feedback', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué principio de Kanban promueve realizar mejoras de forma incremental y colaborativa, usando modelos y el método científico, en lugar de cambios radicales impuestos unilateralmente?', options: { A: 'Mejora colaborativa y evolutiva usando el método científico', B: 'Reorganizar completamente el equipo cada mes sin ningún análisis', C: 'Nunca cambiar el proceso una vez establecido', D: 'Delegar todas las mejoras exclusivamente a la gerencia' }, answer: ['A'], explanation: 'Kanban promueve la mejora evolutiva: cambios pequeños, basados en evidencia/modelos y con la colaboración del equipo, en vez de transformaciones radicales impuestas de arriba hacia abajo, reduciendo la resistencia al cambio.', domain: 'Mejora colaborativa', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué mide el "Lead Time" en las métricas de flujo de Kanban?', options: { A: 'El tiempo transcurrido desde que un ítem de trabajo es solicitado/comprometido hasta que se completa y entrega', B: 'El número total de ítems en el tablero en un momento dado', C: 'El costo total del proyecto', D: 'El número de personas en el equipo' }, answer: ['A'], explanation: 'El Lead Time mide el tiempo total desde que un ítem entra al sistema (es solicitado) hasta que se completa, dando una medida directamente relevante para el cliente sobre cuánto tarda en recibir lo que pidió.', domain: 'Métricas (lead time, cycle time, throughput, CFD)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre "Lead Time" y "Cycle Time"?', options: { A: 'Son exactamente lo mismo', B: 'Lead Time mide desde la solicitud hasta la entrega; Cycle Time mide específicamente desde que el trabajo comienza activamente hasta que se completa, un subconjunto más acotado del Lead Time', C: 'Cycle Time siempre es mayor que Lead Time', D: 'Lead Time solo aplica a proyectos de software' }, answer: ['B'], explanation: 'El Lead Time abarca todo el tiempo desde la solicitud (incluyendo tiempo de espera antes de iniciar el trabajo); el Cycle Time mide únicamente el tiempo de trabajo activo, desde que se empieza a trabajar en el ítem hasta que se completa — siempre es menor o igual al Lead Time.', domain: 'Métricas (lead time, cycle time, throughput, CFD)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué mide el "Throughput" en Kanban?', options: { A: 'El número de ítems de trabajo completados por unidad de tiempo (ej. por semana)', B: 'El tiempo que tarda un solo ítem en completarse', C: 'El costo total del equipo', D: 'La cantidad de columnas en el tablero' }, answer: ['A'], explanation: 'El Throughput mide la cantidad de trabajo completado (ítems entregados) por unidad de tiempo, dando una medida de la capacidad de entrega real del sistema, útil para pronosticar entregas futuras.', domain: 'Métricas (lead time, cycle time, throughput, CFD)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué muestra un Cumulative Flow Diagram (CFD)?', options: { A: 'La cantidad acumulada de ítems en cada etapa del flujo a lo largo del tiempo, permitiendo visualizar cuellos de botella, WIP y tendencias de Lead Time de un vistazo', B: 'Solo el presupuesto gastado en el proyecto', C: 'Un diagrama exclusivo de arquitectura de software', D: 'La cantidad de bugs reportados' }, answer: ['A'], explanation: 'El CFD grafica bandas acumuladas de ítems en cada etapa del flujo a lo largo del tiempo; un ensanchamiento de una banda indica acumulación (cuello de botella) en esa etapa, siendo una herramienta visual potente para diagnosticar el estado del flujo.', domain: 'Métricas (lead time, cycle time, throughput, CFD)', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué representa el Kanban Maturity Model (KMM)?', options: { A: 'Un modelo que describe niveles de madurez organizacional en la adopción de prácticas Kanban, desde equipos aislados con caos operativo hasta organizaciones con gestión de flujo adaptativa a gran escala', B: 'Un tipo de certificación exclusiva de software', C: 'Un sinónimo de Scrum Maturity Model', D: 'Un modelo que solo aplica a equipos de un solo integrante' }, answer: ['A'], explanation: 'El Kanban Maturity Model describe una progresión de niveles de madurez organizacional (desde nivel -1/caos hasta niveles de fitness-for-purpose y adaptabilidad a gran escala), ayudando a las organizaciones a entender dónde están y hacia dónde evolucionar en su adopción de Kanban.', domain: 'Kanban Maturity Model', difficulty: 'hard' },
    ],
  },
  {
    slug: 'prince2-foundation',
    title: 'PRINCE2 Foundation',
    description: 'Examen de práctica alineado a PRINCE2 7th Edition: principios, prácticas, procesos, tailoring y roles de gestión de proyectos.',
    domain: 'agile', category: 'project-management', level: 'intermediate', language: 'es',
    tags: ['prince2', 'foundation', 'pm'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en PRINCE2 7th Edition Manual (2023), vigente en 2026 — axelos.com/certifications/prince2 (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuántos principios fundamentales define PRINCE2, que deben aplicarse en su totalidad para considerar que un proyecto realmente sigue la metodología?', options: { A: '5', B: '7', C: '10', D: '3' }, answer: ['B'], explanation: 'PRINCE2 define 7 principios (ej. justificación de negocio continua, aprender de la experiencia, roles y responsabilidades definidos, gestión por etapas, gestión por excepción, enfoque en productos, adaptar al contexto del proyecto), todos obligatorios para considerar que un proyecto sigue PRINCE2.', domain: '7 principios PRINCE2', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué establece el principio PRINCE2 de "justificación de negocio continua" (continued business justification)?', options: { A: 'Que el proyecto solo necesita justificarse una vez, al inicio, sin revisión posterior', B: 'Que debe existir una razón de negocio válida para el proyecto durante todo su ciclo de vida, revisándola en cada etapa; si deja de ser justificable, el proyecto debe detenerse', C: 'Que la justificación de negocio es responsabilidad exclusiva del equipo técnico', D: 'Que este principio es opcional en PRINCE2 7' }, answer: ['B'], explanation: 'PRINCE2 exige que el business case se mantenga válido durante todo el proyecto, revisándose en cada etapa; si el proyecto deja de estar justificado desde una perspectiva de negocio, debe detenerse o replantearse, en vez de continuar por inercia.', domain: '7 principios PRINCE2', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué nombre reciben las 7 "Prácticas" de PRINCE2 7th Edition (renombradas desde "Temas" en ediciones anteriores)?', options: { A: 'Business Case, Organization, Quality, Plans, Risk, Issues (antes "Change"), Progress', B: 'Iniciación, Ejecución, Cierre, Monitoreo, Control, Riesgo, Calidad', C: 'Scrum, Kanban, Lean, Six Sigma, Agile, Waterfall, Hybrid', D: 'Personas, Procesos, Herramientas, Tecnología, Datos, Cultura, Gobernanza' }, answer: ['A'], explanation: 'Las 7 prácticas de PRINCE2 7 (llamadas "temas" en ediciones anteriores) son: Business Case, Organization, Quality, Plans, Risk, Issues y Progress — cada una aporta un aspecto específico que debe abordarse a lo largo del proyecto.', domain: '7 prácticas (Business Case, Organization, Quality, Plans, Risk, Issues, Progress)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué proceso de PRINCE2 ocurre antes de la iniciación formal del proyecto, evaluando si vale la pena continuar con la planificación detallada?', options: { A: 'Starting Up a Project (SU)', B: 'Closing a Project (CP)', C: 'Controlling a Stage (CS)', D: 'Managing Product Delivery (MP)' }, answer: ['A'], explanation: '"Starting Up a Project" es el proceso pre-proyecto que evalúa de forma preliminar la viabilidad de la idea, produciendo información suficiente para decidir si vale la pena proceder a la iniciación formal (con planificación detallada).', domain: '7 procesos (SU, IP, DP, CS, MP, SB, CP)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué proceso de PRINCE2 se encarga de la toma de decisiones estratégicas del proyecto por parte de la Junta de Proyecto (Project Board), como autorizar el inicio de cada etapa?', options: { A: 'Directing a Project (DP)', B: 'Managing Product Delivery (MP)', C: 'Starting Up a Project (SU)', D: 'Controlling a Stage (CS)' }, answer: ['A'], explanation: '"Directing a Project" cubre las decisiones de nivel estratégico que toma la Junta de Proyecto durante todo el proyecto: autorizar el inicio, cada etapa de gestión, cambios importantes y el cierre del proyecto.', domain: '7 procesos (SU, IP, DP, CS, MP, SB, CP)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué significa "tailoring" (adaptación) en PRINCE2, y por qué es importante?', options: { A: 'Ajustar la aplicación de PRINCE2 (documentación, roles, controles) al contexto específico y escala del proyecto, en vez de aplicar la metodología de forma rígida e idéntica en todos los casos', B: 'Ignorar por completo los principios de PRINCE2', C: 'Un proceso exclusivo para proyectos de construcción', D: 'Sinónimo de "seguir PRINCE2 al pie de la letra sin ningún ajuste"' }, answer: ['A'], explanation: 'El tailoring adapta la aplicación de PRINCE2 (nivel de documentación, formalidad de controles, roles combinados) según el tamaño, complejidad, riesgo y contexto específico del proyecto — un proyecto pequeño no debería aplicar la misma carga burocrática que uno grande y complejo.', domain: 'Tailoring', difficulty: 'medium' },
      { type: 'multiple', question: '¿Quién es el "Executive" en la estructura de gobierno de un proyecto PRINCE2, y cuál es su rol principal?', options: { A: 'El responsable final del proyecto, representando los intereses del negocio, con autoridad final sobre las decisiones clave', B: 'Un rol técnico exclusivamente de desarrollo de software', C: 'Un sinónimo del Project Manager', D: 'Un rol opcional que rara vez se asigna' }, answer: ['A'], explanation: 'El Executive es el único responsable final del proyecto dentro de la Junta de Proyecto, representando los intereses de negocio y con la autoridad última sobre decisiones clave, apoyado (pero no reemplazado) por los roles de Senior User y Senior Supplier.', domain: 'Roles y responsabilidades', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre el rol de "Senior User" y "Senior Supplier" en la Junta de Proyecto PRINCE2?', options: { A: 'Senior User representa a quienes usarán/se beneficiarán de los productos del proyecto; Senior Supplier representa a quienes proveen los recursos/expertise técnica para crear esos productos', B: 'Son exactamente el mismo rol con distinto nombre', C: 'Senior Supplier siempre tiene más autoridad que el Executive', D: 'Senior User es responsable exclusivamente del presupuesto' }, answer: ['A'], explanation: 'Senior User representa los intereses de quienes usarán los productos entregados (garantizando que cumplan sus necesidades); Senior Supplier representa a los proveedores de los recursos, conocimientos y habilidades técnicas necesarias para crear esos productos.', domain: 'Roles y responsabilidades', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Highlight Report" en PRINCE2?', options: { A: 'Un reporte periódico y resumido que el Project Manager envía a la Junta de Proyecto sobre el progreso de la etapa actual, sin necesidad de una reunión completa', B: 'Un documento que solo se usa al cierre del proyecto', C: 'Un sinónimo del Business Case', D: 'Un producto técnico exclusivo del equipo de desarrollo' }, answer: ['A'], explanation: 'El Highlight Report es un reporte de progreso periódico (ej. semanal/quincenal) que el Project Manager envía a la Junta de Proyecto para mantenerla informada del avance de la etapa actual sin requerir una reunión formal completa cada vez.', domain: 'Productos de gestión', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué elemento incorpora explícitamente PRINCE2 7th Edition que no tenía el mismo nivel de énfasis en ediciones anteriores?', options: { A: 'Sostenibilidad (sustainability), gestión de personas (people) y gestión de datos digitales, integrados como consideraciones activas a lo largo del proyecto', B: 'La eliminación completa de los 7 procesos', C: 'La eliminación completa del rol de Executive', D: 'PRINCE2 7 no incorpora ningún elemento nuevo respecto a ediciones anteriores' }, answer: ['A'], explanation: 'PRINCE2 7th Edition (2023) incorpora explícitamente consideraciones de sostenibilidad, un mayor énfasis en la gestión de personas/cultura de equipo, y la gestión de datos/transformación digital como elementos activos a considerar durante la planificación y ejecución del proyecto.', domain: 'Tailoring', difficulty: 'medium' },
    ],
  },
  {
    slug: 'lean-six-sigma-yellow-belt',
    title: 'Lean Six Sigma Yellow Belt',
    description: 'Examen de práctica sobre los fundamentos de Lean Six Sigma: los 8 desperdicios, DMAIC, herramientas básicas y métricas de calidad.',
    domain: 'agile', category: 'lean-six-sigma', level: 'beginner', language: 'es',
    tags: ['six-sigma', 'yellow-belt', 'lean'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en ASQ (American Society for Quality) Lean Six Sigma Yellow Belt Body of Knowledge — asq.org/cert/six-sigma-yellow-belt (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué representan las siglas DOWNTIME, el acrónimo usado en Lean para recordar los 8 desperdicios (wastes)?', options: { A: 'Defects, Overproduction, Waiting, Non-utilized talent, Transportation, Inventory, Motion, Extra-processing', B: 'Development, Operations, Workflow, Networking, Testing, Integration, Maintenance, Evaluation', C: 'Data, Objectives, Workforce, Numbers, Time, Info, Metrics, Efficiency', D: 'Design, Ownership, Workflow,ニーズ, Training, Ideas, Money, Effort' }, answer: ['A'], explanation: 'DOWNTIME resume los 8 desperdicios de Lean: Defectos, Sobreproducción, Espera, Talento no utilizado, Transporte innecesario, Inventario excesivo, Movimiento innecesario y Sobreprocesamiento — todos actividades que no agregan valor al cliente.', domain: 'Los 8 desperdicios (DOWNTIME)', difficulty: 'medium' },
      { type: 'multiple', question: 'Un equipo produce más unidades de las que el cliente actualmente demanda, generando inventario acumulado sin venderse. ¿Qué tipo de desperdicio Lean representa esto?', options: { A: 'Overproduction (sobreproducción)', B: 'Motion (movimiento)', C: 'Defects (defectos)', D: 'Transportation (transporte)' }, answer: ['A'], explanation: 'La sobreproducción es producir más de lo que el cliente demanda actualmente (o antes de que se necesite), generando inventario acumulado y consumiendo recursos que podrían usarse en trabajo de mayor valor inmediato.', domain: 'Los 8 desperdicios (DOWNTIME)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué desperdicio Lean representa el talento y las ideas de los empleados que no se aprovechan porque nadie les pregunta o escucha sus sugerencias de mejora?', options: { A: 'Non-utilized talent (talento no utilizado)', B: 'Inventory (inventario)', C: 'Waiting (espera)', D: 'Extra-processing (sobreprocesamiento)' }, answer: ['A'], explanation: 'El desperdicio de "talento no utilizado" es el único de los 8 relacionado directamente con las personas: ocurre cuando la organización no aprovecha el conocimiento, creatividad y habilidades de sus empleados para mejorar procesos.', domain: 'Los 8 desperdicios (DOWNTIME)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuáles son las cinco fases del ciclo DMAIC usado en proyectos Six Sigma de mejora de procesos?', options: { A: 'Define, Measure, Analyze, Improve, Control', B: 'Design, Model, Assess, Implement, Close', C: 'Discover, Map, Act, Inspect, Change', D: 'Develop, Manage, Audit, Iterate, Complete' }, answer: ['A'], explanation: 'DMAIC estructura los proyectos de mejora de procesos en 5 fases: Definir el problema/objetivo, Medir el desempeño actual, Analizar las causas raíz, Mejorar (Improve) implementando soluciones, y Controlar para sostener las mejoras en el tiempo.', domain: 'DMAIC overview', difficulty: 'easy' },
      { type: 'multiple', question: '¿En qué fase de DMAIC se identifican las causas raíz del problema, antes de proponer soluciones?', options: { A: 'Define', B: 'Measure', C: 'Analyze', D: 'Control' }, answer: ['C'], explanation: 'La fase "Analyze" usa los datos recolectados en "Measure" para identificar las causas raíz reales del problema (con herramientas como el diagrama de Ishikawa o los 5 porqués), antes de diseñar soluciones en la fase "Improve".', domain: 'DMAIC overview', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "Voz del Cliente" (Voice of the Customer, VOC) y para qué se usa en un proyecto Six Sigma?', options: { A: 'Recopilar las necesidades y expectativas expresadas por el cliente, traduciéndolas en requisitos específicos y medibles (CTQ) que el proceso debe cumplir', B: 'Un sinónimo de encuesta de satisfacción del empleado', C: 'Una etapa exclusiva de la fase Control', D: 'Un documento legal sin relación con la mejora de procesos' }, answer: ['A'], explanation: 'La Voz del Cliente captura las necesidades y expectativas del cliente en su propio lenguaje, traduciéndolas posteriormente en Critical to Quality (CTQ): características específicas y medibles que el proceso/producto debe cumplir para satisfacerlas.', domain: 'Voz del cliente y CTQ', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la metodología 5S usada como herramienta básica de Lean para organizar el lugar de trabajo?', options: { A: 'Seiri (clasificar), Seiton (ordenar), Seiso (limpiar), Seiketsu (estandarizar), Shitsuke (disciplina/sostener)', B: 'Un acrónimo exclusivo de software de gestión de proyectos', C: 'Un sinónimo de las 5 fases de DMAIC', D: 'Un método exclusivo para líneas de producción automotriz' }, answer: ['A'], explanation: '5S es una metodología de organización del lugar de trabajo con 5 pasos secuenciales (Clasificar, Ordenar, Limpiar, Estandarizar, Sostener), reduciendo desperdicios asociados a desorganización, tiempo de búsqueda y errores.', domain: 'Herramientas básicas (5S, mapeo de procesos, Ishikawa, 5 porqués)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Para qué se usa el diagrama de Ishikawa (o "diagrama de espina de pescado")?', options: { A: 'Visualizar y organizar de forma estructurada las posibles causas raíz de un problema específico, agrupadas por categorías (ej. personas, procesos, materiales, máquinas)', B: 'Calcular el presupuesto exacto de un proyecto', C: 'Medir la velocidad de un equipo Scrum', D: 'Diseñar la arquitectura técnica de un sistema' }, answer: ['A'], explanation: 'El diagrama de Ishikawa organiza visualmente las posibles causas de un problema (el "efecto") agrupadas en categorías (personas, procesos, materiales, máquinas, medio ambiente, medición), facilitando un análisis estructurado de causa raíz.', domain: 'Herramientas básicas (5S, mapeo de procesos, Ishikawa, 5 porqués)', difficulty: 'medium' },
      { type: 'multiple', question: '¿En qué consiste la técnica de los "5 porqués" (5 Whys) para el análisis de causa raíz?', options: { A: 'Preguntar "¿por qué?" repetidamente (típicamente 5 veces) sobre un problema, profundizando en cada respuesta hasta llegar a la causa raíz real, en lugar de quedarse en un síntoma superficial', B: 'Hacer exactamente 5 preguntas distintas sin relación entre sí sobre el proceso', C: 'Un método exclusivo para calcular presupuestos', D: 'Una técnica que solo se usa una vez al año en auditorías' }, answer: ['A'], explanation: 'Los 5 porqués preguntan reiterativamente "¿por qué ocurrió esto?" sobre cada respuesta anterior, profundizando progresivamente desde el síntoma superficial hasta la causa raíz sistémica real del problema.', domain: 'Herramientas básicas (5S, mapeo de procesos, Ishikawa, 5 porqués)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué mide el DPMO (Defects Per Million Opportunities) en Six Sigma?', options: { A: 'La cantidad de defectos que ocurrirían por cada millón de oportunidades de que ocurra un defecto, una métrica estandarizada para comparar la calidad de procesos distintos entre sí', B: 'El costo total de un proyecto en dólares', C: 'El número de empleados capacitados en Six Sigma', D: 'El tiempo total del ciclo DMAIC' }, answer: ['A'], explanation: 'DPMO normaliza la tasa de defectos a una base común (por millón de oportunidades), permitiendo comparar objetivamente la calidad de procesos con distinto volumen o complejidad — la métrica base para calcular el nivel Sigma de un proceso.', domain: 'Métricas básicas (DPMO, sigma level)', difficulty: 'medium' },
      { type: 'multiple', question: 'En Six Sigma, ¿qué implica que un proceso alcance un "nivel Sigma" más alto (ej. Six Sigma vs. Three Sigma)?', options: { A: 'Que el proceso tiene una tasa de defectos significativamente MENOR (mayor calidad y consistencia); Six Sigma apunta a aproximadamente 3.4 defectos por millón de oportunidades', B: 'Que el proceso tiene más defectos y es menos confiable', C: 'El nivel Sigma no tiene relación con la calidad del proceso', D: 'Un nivel Sigma más alto siempre implica un proceso más lento' }, answer: ['A'], explanation: 'Un nivel Sigma más alto indica una tasa de defectos por millón de oportunidades significativamente menor: "Six Sigma" apunta a un proceso con apenas ~3.4 DPMO, un nivel de calidad y consistencia muy superior a niveles Sigma más bajos.', domain: 'Métricas básicas (DPMO, sigma level)', difficulty: 'hard' },
    ],
  },
  {
    slug: 'pmi-capm-fundamentals',
    title: 'PMI CAPM — Fundamentos',
    description: 'Examen de práctica alineado a los 4 dominios oficiales del Certified Associate in Project Management (CAPM) del PMI.',
    domain: 'agile', category: 'project-management', level: 'beginner', language: 'es',
    tags: ['capm', 'pmi', 'pmbok'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en PMI CAPM Examination Content Outline (2023), vigente en 2026 — pmi.org/certifications/associate-in-project-management-capm (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué es un "proyecto" según la definición estándar del PMI?', options: { A: 'Un esfuerzo temporal emprendido para crear un producto, servicio o resultado único, con un inicio y fin definidos', B: 'Cualquier actividad recurrente y repetitiva sin fecha de finalización, como una operación diaria', C: 'Un sinónimo exacto de "programa" sin ninguna diferencia', D: 'Un documento financiero de presupuesto anual' }, answer: ['A'], explanation: 'Un proyecto se define por ser temporal (tiene inicio y fin definidos) y por producir un resultado único, a diferencia de las operaciones continuas y repetitivas del negocio del día a día.', domain: 'Project Management Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre un "proyecto", un "programa" y un "portafolio"?', options: { A: 'Un proyecto es un esfuerzo temporal único; un programa agrupa proyectos relacionados gestionados de forma coordinada para obtener beneficios no disponibles si se gestionan por separado; un portafolio agrupa proyectos/programas alineados a objetivos estratégicos de la organización', B: 'Son términos exactamente idénticos e intercambiables', C: 'Un portafolio siempre es más pequeño que un proyecto individual', D: 'Un programa nunca puede contener más de un proyecto' }, answer: ['A'], explanation: 'La jerarquía típica es: proyecto (esfuerzo temporal individual) → programa (grupo de proyectos relacionados gestionados juntos para sinergias) → portafolio (colección de proyectos/programas alineados a la estrategia organizacional, no necesariamente relacionados entre sí operativamente).', domain: 'Project Management Fundamentals', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué rol cumple el "Project Sponsor" (patrocinador) en un proyecto?', options: { A: 'Provee los recursos y apoyo para el proyecto, y es responsable de facilitar su éxito, actuando frecuentemente como el vínculo entre la dirección estratégica y el equipo del proyecto', B: 'Es sinónimo exacto del Project Manager', C: 'Solo tiene un rol simbólico sin ninguna responsabilidad real', D: 'Es responsable de ejecutar las tareas técnicas del proyecto' }, answer: ['A'], explanation: 'El Sponsor provee los recursos financieros y el apoyo organizacional necesarios, defendiendo el proyecto a nivel ejecutivo y ayudando a resolver problemas que exceden la autoridad del Project Manager.', domain: 'Project Management Fundamentals', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué documento formal autoriza oficialmente la existencia de un proyecto y otorga al director de proyecto la autoridad para aplicar recursos organizacionales?', options: { A: 'Project Charter (Acta de Constitución del Proyecto)', B: 'Business Case', C: 'Sprint Backlog', D: 'Lessons Learned Register' }, answer: ['A'], explanation: 'El Project Charter es el documento formal que autoriza la existencia del proyecto, otorgando al director de proyecto la autoridad para usar recursos organizacionales, siendo emitido típicamente por el sponsor o patrocinador.', domain: 'Project Management Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: 'En un enfoque predictivo (waterfall) tradicional, ¿en qué orden general se desarrollan las fases de un proyecto?', options: { A: 'Inicio → Planificación → Ejecución → Monitoreo y Control → Cierre', B: 'Ejecución → Inicio → Cierre → Planificación', C: 'Cierre → Ejecución → Planificación → Inicio', D: 'No existe ningún orden definido en un enfoque predictivo' }, answer: ['A'], explanation: 'El enfoque predictivo secuencial sigue el orden clásico: Inicio (definir el proyecto), Planificación (detallar el plan), Ejecución (realizar el trabajo), Monitoreo y Control (paralelo a la ejecución, verificando desviaciones) y Cierre (finalización formal).', domain: 'Predictivo (Plan-Based Methodologies)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué caracteriza a un enfoque de proyecto "predictivo" frente a uno "adaptativo" (ágil)?', options: { A: 'El predictivo define el alcance, cronograma y costo detalladamente por adelantado, con cambios controlados formalmente; el adaptativo entrega en incrementos cortos, dando la bienvenida al cambio basado en aprendizaje continuo', B: 'Son exactamente lo mismo', C: 'El adaptativo siempre requiere más documentación previa que el predictivo', D: 'El predictivo no puede usarse en ningún proyecto de construcción' }, answer: ['A'], explanation: 'El enfoque predictivo detalla el alcance/cronograma/costo por adelantado, gestionando cambios mediante control formal; el adaptativo (ágil) trabaja en ciclos cortos, incorporando el cambio como algo esperado y valioso basado en el aprendizaje continuo del equipo.', domain: 'Predictivo (Plan-Based Methodologies)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Gantt Chart" y para qué se usa en la gestión predictiva de proyectos?', options: { A: 'Un diagrama de barras horizontales que muestra el cronograma del proyecto: las actividades, su duración y sus dependencias en el tiempo', B: 'Un sinónimo de Kanban board', C: 'Un documento exclusivo de presupuesto financiero', D: 'Un formulario de evaluación de riesgos' }, answer: ['A'], explanation: 'El diagrama de Gantt visualiza el cronograma del proyecto mediante barras horizontales que representan la duración de cada actividad, permitiendo ver fácilmente su secuencia, solapamiento y dependencias en el tiempo.', domain: 'Predictivo (Plan-Based Methodologies)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué framework ágil es el más comúnmente asociado a Sprints de duración fija, con roles de Product Owner, Scrum Master y Developers?', options: { A: 'Scrum', B: 'PRINCE2', C: 'Waterfall', D: 'Critical Path Method' }, answer: ['A'], explanation: 'Scrum es el framework ágil más ampliamente adoptado, estructurado en Sprints de duración fija (time-boxed) con roles específicos (Product Owner, Scrum Master, Developers) y eventos definidos (Planning, Daily, Review, Retrospective).', domain: 'Agile', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un enfoque "híbrido" en gestión de proyectos?', options: { A: 'Combinar elementos de enfoques predictivos y ágiles dentro del mismo proyecto, según las necesidades específicas de cada componente del trabajo', B: 'Un enfoque que prohíbe usar cualquier metodología formal', C: 'Un sinónimo exacto de Scrum puro', D: 'Un enfoque exclusivo para proyectos de menos de una semana de duración' }, answer: ['A'], explanation: 'Un enfoque híbrido combina prácticas predictivas y ágiles dentro del mismo proyecto (ej. planificación predictiva de alto nivel con ejecución ágil por Sprints en componentes de mayor incertidumbre), adaptándose a la naturaleza específica de cada parte del trabajo.', domain: 'Agile', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "análisis de negocio" (business analysis) dentro de la gestión de proyectos, y quién suele desempeñar este rol?', options: { A: 'El proceso de identificar necesidades de negocio y recomendar soluciones que aporten valor a los stakeholders, desempeñado a menudo por un Business Analyst, pero cuyos fundamentos también debe conocer un director de proyecto', B: 'Es idéntico y sin ninguna distinción respecto a la gestión de proyectos', C: 'Solo se realiza después de cerrado el proyecto', D: 'Es exclusivamente responsabilidad del área de finanzas' }, answer: ['A'], explanation: 'El análisis de negocio identifica necesidades reales y evalúa soluciones que generen valor, complementando la gestión de proyectos; aunque a menudo lo realiza un Business Analyst dedicado, el CAPM exige conocer sus fundamentos dado el dominio "Business Analysis" (27% del examen).', domain: 'Business Analysis', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué técnica de análisis de negocio documenta los requisitos de los stakeholders, categorizándolos y rastreándolos hasta su implementación final?', options: { A: 'Requirements Traceability Matrix', B: 'Gantt Chart', C: 'Sprint Burndown Chart', D: 'Fishbone Diagram' }, answer: ['A'], explanation: 'La Matriz de Trazabilidad de Requisitos vincula cada requisito documentado con su origen (necesidad de negocio/stakeholder) y su implementación final, asegurando que ningún requisito se pierda y facilitando el análisis de impacto ante cambios.', domain: 'Business Analysis', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué son los "criterios de aceptación" de un requisito o producto entregable?', options: { A: 'Condiciones específicas y verificables que un entregable debe cumplir para ser considerado aceptable por el cliente/stakeholder', B: 'Un sinónimo de Business Case', C: 'Un documento exclusivo de gestión de riesgos', D: 'Solo se definen después de completado el proyecto' }, answer: ['A'], explanation: 'Los criterios de aceptación definen de forma clara y verificable cuándo un entregable cumple con lo esperado, sirviendo como base objetiva para que el cliente/stakeholder confirme la aceptación formal del trabajo entregado.', domain: 'Business Analysis', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre un "requisito funcional" y uno "no funcional"?', options: { A: 'Un requisito funcional describe QUÉ debe hacer el sistema/producto (comportamiento específico); un requisito no funcional describe CÓMO debe comportarse en términos de calidad (rendimiento, seguridad, usabilidad)', B: 'Son exactamente lo mismo', C: 'Los requisitos no funcionales nunca se documentan formalmente', D: 'Un requisito funcional siempre es más importante que uno no funcional' }, answer: ['A'], explanation: 'Los requisitos funcionales especifican comportamientos concretos del sistema (ej. "el usuario puede restablecer su contraseña"); los no funcionales especifican atributos de calidad (ej. "el sistema debe responder en menos de 2 segundos"), ambos igualmente necesarios para un producto completo.', domain: 'Business Analysis', difficulty: 'medium' },
    ],
  },
  {
    slug: 'design-thinking-fundamentals',
    title: 'Design Thinking — Fundamentos',
    description: 'Examen de práctica sobre el proceso, mindset y herramientas del Design Thinking: empatía, ideación, prototipado y testing.',
    domain: 'agile', category: 'innovation', level: 'beginner', language: 'es',
    tags: ['design-thinking', 'innovation', 'ux'], passPercent: 70, timeMinutes: 18,
    source: 'Basado en el framework de Design Thinking de IDEO + Nielsen Norman Group (nngroup.com/articles/design-thinking) — contenido original',
    questions: [
      { type: 'multiple', question: '¿Cuáles son las cinco etapas clásicas del proceso de Design Thinking según el modelo popularizado por IDEO/Stanford d.school?', options: { A: 'Empathize, Define, Ideate, Prototype, Test', B: 'Planificar, Ejecutar, Monitorear, Controlar, Cerrar', C: 'Investigar, Diseñar, Codificar, Probar, Desplegar', D: 'Definir, Medir, Analizar, Mejorar, Controlar' }, answer: ['A'], explanation: 'Las cinco etapas son: Empatizar (entender profundamente al usuario), Definir (sintetizar un problema claro), Idear (generar múltiples soluciones posibles), Prototipar (crear representaciones tangibles rápidas) y Testear (validar con usuarios reales) — un proceso no estrictamente lineal, sino iterativo.', domain: '5 etapas del Design Thinking', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué se dice que el proceso de Design Thinking es "no lineal" o "iterativo", a pesar de tener 5 etapas nombradas en un orden?', options: { A: 'Porque el equipo puede volver a etapas anteriores (ej. de Prototype de vuelta a Empathize) según lo que aprende en cada etapa, en vez de avanzar estrictamente en secuencia una sola vez', B: 'Porque en realidad no tiene ningún orden ni estructura', C: 'Porque cada etapa solo puede ejecutarse una vez, en un orden aleatorio', D: 'Porque las 5 etapas ocurren simultáneamente sin ninguna secuencia' }, answer: ['A'], explanation: 'El proceso es iterativo: los hallazgos de una etapa posterior (ej. testear un prototipo) frecuentemente revelan la necesidad de volver a una etapa anterior (ej. redefinir el problema o generar nuevas ideas), en vez de avanzar de forma estrictamente secuencial una única vez.', domain: '5 etapas del Design Thinking', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué caracteriza al "mindset" (forma de pensar) central del Design Thinking?', options: { A: 'Centrado en el ser humano (human-centered), iterativo, colaborativo y con tolerancia a la ambigüedad y el fracaso temprano como parte del aprendizaje', B: 'Centrado exclusivamente en la tecnología disponible, sin considerar las necesidades del usuario', C: 'Un enfoque estrictamente secuencial sin ninguna posibilidad de retroceso', D: 'Un mindset que evita cualquier tipo de colaboración entre disciplinas' }, answer: ['A'], explanation: 'El mindset de Design Thinking pone al ser humano/usuario en el centro de todas las decisiones, fomenta la colaboración multidisciplinaria, itera con base en aprendizaje continuo, y acepta el fracaso temprano de un prototipo como una fuente valiosa de información, no como un error a evitar.', domain: 'Mindset (human-centered, iterativo, colaborativo)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta de la etapa de Empatizar ayuda a visualizar de forma estructurada lo que un usuario piensa, siente, ve, dice y hace en un contexto específico?', options: { A: 'Mapa de empatía (Empathy Map)', B: 'Diagrama de Gantt', C: 'Matriz RACI', D: 'Diagrama de Ishikawa' }, answer: ['A'], explanation: 'El mapa de empatía organiza en cuadrantes lo que el usuario piensa/siente, ve, oye, dice/hace (y a veces sus dolores y ganancias), ayudando al equipo a sintetizar observaciones cualitativas de entrevistas/investigación en una comprensión más profunda del usuario.', domain: 'Herramientas de empatía (entrevistas, mapa de empatía, journey map)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué visualiza un "customer journey map" (mapa del viaje del cliente)?', options: { A: 'La secuencia de pasos, puntos de contacto, emociones y fricciones que experimenta un usuario al interactuar con un producto/servicio a lo largo del tiempo', B: 'Únicamente el precio de cada funcionalidad del producto', C: 'La arquitectura técnica del backend de un sistema', D: 'El organigrama de la empresa' }, answer: ['A'], explanation: 'Un journey map documenta cronológicamente la experiencia completa del usuario (pasos, puntos de contacto, pensamientos, emociones y fricciones), revelando oportunidades de mejora que podrían no ser evidentes analizando cada interacción de forma aislada.', domain: 'Herramientas de empatía (entrevistas, mapa de empatía, journey map)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué técnica de ideación fomenta la generación rápida de un gran número de ideas (cantidad sobre calidad inicial), típicamente en sesiones grupales de tiempo limitado?', options: { A: 'Brainstorming', B: 'Auditoría financiera', C: 'Análisis de código estático', D: 'Retrospectiva de Sprint exclusivamente' }, answer: ['A'], explanation: 'El brainstorming busca generar la mayor cantidad de ideas posible en un tiempo limitado, aplazando el juicio crítico (no descartar ideas prematuramente) para maximizar la diversidad de opciones antes de evaluarlas.', domain: 'Técnicas de ideación (brainstorming, Crazy 8s, SCAMPER)', difficulty: 'easy' },
      { type: 'multiple', question: '¿En qué consiste la técnica de ideación "Crazy 8s"?', options: { A: 'Dibujar 8 variaciones distintas de una idea/solución en 8 minutos (un minuto por boceto), forzando la generación rápida de múltiples enfoques sin sobrepensar cada uno', B: 'Un método para calcular el presupuesto de un proyecto en 8 pasos', C: 'Reunir a 8 personas para una sola sesión de una hora', D: 'Una técnica exclusiva para revisar código' }, answer: ['A'], explanation: 'Crazy 8s pide dibujar rápidamente 8 ideas/variaciones distintas de una solución en 8 minutos (un boceto por minuto), forzando al participante a superar la primera idea obvia y explorar alternativas más creativas bajo presión de tiempo.', domain: 'Técnicas de ideación (brainstorming, Crazy 8s, SCAMPER)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es SCAMPER como técnica de ideación?', options: { A: 'Un checklist de verbos de acción (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse) usado para generar nuevas ideas modificando sistemáticamente una idea/producto existente', B: 'Un tipo de prototipo físico de alta fidelidad', C: 'Un método exclusivo de testing con usuarios', D: 'Un sinónimo de brainstorming sin ninguna diferencia' }, answer: ['A'], explanation: 'SCAMPER guía la ideación aplicando sistemáticamente 7 verbos de transformación (Sustituir, Combinar, Adaptar, Modificar, Dar otro uso, Eliminar, Revertir) a una idea o producto existente, generando nuevas variantes de forma estructurada.', domain: 'Técnicas de ideación (brainstorming, Crazy 8s, SCAMPER)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el propósito principal de un prototipo de "baja fidelidad" (ej. bocetos en papel) en la etapa de Prototype?', options: { A: 'Probar rápidamente y a bajo costo una idea o concepto con usuarios reales, antes de invertir tiempo/recursos en algo más pulido y costoso de cambiar', B: 'Ser el producto final que se lanzará directamente a producción', C: 'Reemplazar completamente la necesidad de hacer testing con usuarios', D: 'Servir únicamente como material de marketing' }, answer: ['A'], explanation: 'Un prototipo de baja fidelidad (bocetos, wireframes en papel) permite validar rápidamente conceptos con usuarios a bajo costo y esfuerzo, facilitando iterar o descartar ideas antes de invertir en prototipos más pulidos y costosos de modificar.', domain: 'Prototipado rápido', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué busca principalmente la etapa de "Test" (testing con usuarios) en Design Thinking?', options: { A: 'Confirmar que el prototipo funciona técnicamente sin errores de código', B: 'Obtener feedback real de usuarios sobre el prototipo, validando o invalidando las suposiciones del equipo, y frecuentemente generando nuevos insights que llevan a iterar en etapas anteriores', C: 'Medir exclusivamente el tiempo que tarda en cargar una página', D: 'Reemplazar por completo la necesidad de haber empatizado con el usuario' }, answer: ['B'], explanation: 'La etapa de Test busca aprendizaje real observando cómo usuarios reales interactúan con el prototipo, validando o refutando las suposiciones del equipo — a menudo revela información nueva que motiva volver a etapas anteriores (Define, Ideate) para ajustar el enfoque.', domain: 'Testing con usuarios', difficulty: 'medium' },
    ],
  },
  {
    slug: 'agile-coaching-basics',
    title: 'Agile Coaching — Fundamentos',
    description: 'Examen de práctica sobre las competencias del Agile Coach: diferencias con roles afines, facilitación, coaching de equipos y ética.',
    domain: 'agile', category: 'coaching', level: 'intermediate', language: 'es',
    tags: ['coaching', 'agile', 'facilitation'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en ICAgile ICP-ACC Competency Framework — icagile.com (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre "coaching" y "mentoring"?', options: { A: 'El coaching ayuda a la persona a encontrar sus propias respuestas mediante preguntas poderosas, sin imponer soluciones; el mentoring implica compartir experiencia y consejo directo basado en el propio conocimiento del mentor', B: 'Son términos exactamente sinónimos, sin ninguna diferencia', C: 'El mentoring siempre es más corto en duración que el coaching', D: 'El coaching solo puede hacerse en grupos, nunca individualmente' }, answer: ['A'], explanation: 'El coaching se centra en hacer preguntas que ayuden a la persona a descubrir sus propias respuestas y desarrollar su capacidad de resolver problemas; el mentoring implica que el mentor comparte activamente su propia experiencia y consejo directo basado en su trayectoria.', domain: 'Diferencias entre coaching, mentoring, facilitating y consulting', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué diferencia hay entre "facilitar" y "consultar" en el contexto de las competencias de un Agile Coach?', options: { A: 'Facilitar guía un proceso grupal (ej. una retrospectiva) sin imponer contenido ni opinión sobre las decisiones; consultar implica dar recomendaciones expertas basadas en el conocimiento propio sobre QUÉ decisión tomar', B: 'Son exactamente lo mismo', C: 'Facilitar siempre implica dar la respuesta correcta al equipo', D: 'Consultar nunca involucra compartir una opinión experta' }, answer: ['A'], explanation: 'Facilitar guía la estructura y el proceso de una conversación/actividad grupal, manteniéndose neutral sobre el contenido de las decisiones que toma el grupo; consultar implica ofrecer activamente una recomendación experta sobre qué solución específica adoptar.', domain: 'Diferencias entre coaching, mentoring, facilitating y consulting', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué representa el modelo GROW usado frecuentemente en sesiones de coaching?', options: { A: 'Goal, Reality, Options, Will (o Way Forward): una estructura de conversación que guía desde definir el objetivo hasta comprometerse con un plan de acción', B: 'Un acrónimo exclusivo de metodologías ágiles de desarrollo de software', C: 'Un modelo financiero de crecimiento de ingresos', D: 'Un sinónimo de DMAIC de Six Sigma' }, answer: ['A'], explanation: 'GROW estructura una conversación de coaching en 4 etapas: definir el Goal (objetivo), explorar la Reality (situación actual), identificar Options (opciones posibles) y comprometerse con el Will/Way Forward (plan de acción concreto).', domain: 'Modelos (GROW, ICAgile competency framework)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué son las "powerful questions" (preguntas poderosas) en coaching, y qué buscan lograr?', options: { A: 'Preguntas abiertas y reflexivas (a menudo empezando con "qué" o "cómo") que invitan a la persona a explorar más profundamente su propio pensamiento, en lugar de preguntas cerradas que solo buscan un sí/no', B: 'Preguntas cerradas diseñadas para confirmar lo que el coach ya piensa que es correcto', C: 'Un sinónimo de preguntas de examen técnico', D: 'Preguntas que buscan hacer sentir mal a la persona sobre su desempeño' }, answer: ['A'], explanation: 'Las preguntas poderosas son abiertas y reflexivas (ej. "¿qué opciones ves aquí?", "¿cómo te gustaría que fuera esto?"), invitando a la persona a explorar y profundizar en su propio pensamiento, en vez de preguntas cerradas o dirigidas que limitan la reflexión.', domain: 'Powerful questions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué implica la "escucha activa" como habilidad central del coaching?', options: { A: 'Prestar atención completa a lo que dice la persona (verbal y no verbal), sin planear la siguiente pregunta mientras habla, y reflejar/parafrasear para confirmar comprensión', B: 'Escuchar solo para encontrar el momento de dar la propia opinión', C: 'Interrumpir frecuentemente para acelerar la conversación', D: 'Un sinónimo de tomar notas detalladas sin ninguna interacción verbal' }, answer: ['A'], explanation: 'La escucha activa implica atención completa (verbal y no verbal) a la persona, evitando planificar mentalmente la próxima pregunta/respuesta mientras habla, y usando técnicas como parafrasear o reflejar para confirmar y profundizar en la comprensión.', domain: 'Escucha activa', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el rol de un Agile Coach al facilitar una retrospectiva de equipo?', options: { A: 'Guiar la estructura de la conversación (ej. con un formato como "Start, Stop, Continue") de forma neutral, asegurando participación equitativa, sin imponer sus propias conclusiones sobre qué debe cambiar el equipo', B: 'Decidir unilateralmente qué acciones de mejora debe implementar el equipo', C: 'Evaluar el desempeño individual de cada miembro del equipo', D: 'Cancelar la retrospectiva si el equipo no tiene suficientes temas para discutir' }, answer: ['A'], explanation: 'Al facilitar una retrospectiva, el Agile Coach guía la estructura y el proceso (ej. usando un formato de facilitación conocido), fomentando participación equitativa de todo el equipo, sin imponer sus propias opiniones sobre qué conclusiones o acciones debería adoptar el equipo.', domain: 'Facilitación de retrospectivas', difficulty: 'medium' },
      { type: 'multiple', question: 'Durante una sesión de facilitación, dos miembros del equipo entran en un conflicto acalorado sobre un tema técnico. ¿Cuál es una intervención apropiada del Agile Coach como facilitador?', options: { A: 'Ignorar el conflicto por completo y continuar con la agenda planeada', B: 'Pausar la discusión, reconocer las emociones presentes, y guiar al grupo hacia una conversación estructurada que explore intereses subyacentes en lugar de posiciones fijas', C: 'Tomar partido públicamente por uno de los dos miembros del equipo', D: 'Terminar la sesión inmediatamente sin ningún intento de resolución' }, answer: ['B'], explanation: 'Un facilitador hábil no ignora el conflicto ni toma partido: reconoce las emociones presentes y guía al grupo hacia una conversación estructurada, ayudando a explorar los intereses subyacentes (el "por qué" de cada posición) en lugar de simplemente las posiciones enfrentadas.', domain: 'Manejo de conflictos', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué diferencia hay entre el "coaching de equipos" (team coaching) y el "coaching individual" (1-on-1 coaching)?', options: { A: 'El coaching de equipos trabaja con la dinámica, relaciones y desempeño colectivo del grupo como un sistema; el coaching individual se enfoca en el desarrollo, objetivos y desafíos personales de una sola persona', B: 'Son exactamente lo mismo, solo cambia el número de asistentes en la sala', C: 'El coaching individual siempre es más efectivo que el de equipos en cualquier contexto', D: 'El coaching de equipos nunca puede combinarse con sesiones individuales' }, answer: ['A'], explanation: 'El coaching de equipos aborda la dinámica sistémica del grupo (comunicación, relaciones, desempeño colectivo), mientras el coaching individual se enfoca en el desarrollo personal, objetivos y desafíos específicos de una sola persona — ambos son complementarios, no mutuamente excluyentes.', domain: 'Coaching de equipos vs individual', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué principio ético es fundamental para un Agile Coach al trabajar con la información compartida por un equipo o individuo durante una sesión de coaching?', options: { A: 'Confidencialidad: mantener privada la información compartida en el contexto de coaching, salvo acuerdos explícitos sobre qué se puede compartir con otros stakeholders', B: 'Compartir libremente toda la información con la gerencia sin ninguna restricción', C: 'No existe ninguna consideración ética relevante en el coaching ágil', D: 'Publicar la información en canales públicos de la empresa para mayor transparencia' }, answer: ['A'], explanation: 'La confidencialidad es un principio ético central del coaching: la información compartida durante una sesión debe mantenerse privada, salvo que exista un acuerdo explícito previo sobre qué información puede compartirse (y con quién), protegiendo la confianza necesaria para un coaching efectivo.', domain: 'Ética del coaching', difficulty: 'medium' },
    ],
  },
];
