// Generado por el subagente exam-content-architect (research + QA manual, sin LLM-API externo).
// Batch: health-extended — COMPLETO: 10 sets (cna-fundamentos + 9 nuevos).
//
// CNA — NNAAP (National Nurse Aide Assessment Program) Written Exam, el examen
// estandarizado más usado en EE.UU. para certificar Nurse Aides. 3 áreas de
// contenido oficial con peso publicado: Physical Care Skills 64% (ADL 7%,
// Basic Nursing Skills 37%, Restorative Skills 5%, más Communication/Client
// Rights dentro de Role of the Nurse Aide), Role of the Nurse Aide 26%,
// Psychosocial Care Skills 10%. Examen real: 70 preguntas (60 evaluadas), 90 min.
//
// BLS y ACLS: grounding en las 2025 AHA Guidelines for CPR and ECC (publicadas
// 22-oct-2025, reemplazan las guías de 2020) — cambios clave verificados por
// research: cadena de supervivencia UNIFICADA (adulto+pediátrica, intra+extra
// hospitalaria, ya no dividida), secuencia de atragantamiento en ciclos de 5
// golpes en la espalda + 5 compresiones abdominales, guía de naloxona para
// sospecha de sobredosis de opioides durante el paro, y actualización del
// algoritmo de cuidados post-paro cardiaco. Mecánica central de RCP de alta
// calidad (frecuencia 100-120/min, profundidad adulto 5-6cm, ratio 30:2,
// permitir reexpansión completa) se mantiene estable desde 2015-2020.
// NCLEX-RN: 2026 Test Plan (vigente desde abr-2026) — estructura y porcentajes
// de las 4 categorías de Client Needs IDÉNTICOS al plan 2023, solo se renombró
// "Safety and Infection Control" a "Safety and Infection Prevention and Control".
// Los demás (Farmacología, Enfermería Clínica, Nutrición Clínica, Salud Mental,
// ECG, Pediatría, Primeros Auxilios Avanzados) son dominios de conocimiento
// clínico estable, no atados a una certificación con versión datada.

export const HEALTH_EXTENDED_SETS = [
  {
    slug: 'cna-fundamentos',
    title: 'CNA — Auxiliar de Enfermería (NNAAP)',
    description:
      'Examen de práctica alineado al NNAAP Written Exam para certificación de Certified Nursing Assistant: cuidados físicos, rol del auxiliar y cuidado psicosocial.',
    domain: 'health',
    category: 'nursing-assistant',
    level: 'beginner',
    language: 'es',
    tags: ['cna', 'nnaap', 'nurse-aide'],
    passPercent: 70,
    timeMinutes: 33,
    source:
      'Basado en NNAAP (National Nurse Aide Assessment Program) Written Exam Content Outline (contenido original)',
    questions: [
      // ── Actividades de la Vida Diaria — AVD (3) ────────────────────────
      {
        type: 'multiple',
        question:
          'Al ayudar a un residente a bañarse, ¿en qué orden general se recomienda lavar el cuerpo para mantener buena higiene y prevenir infecciones?',
        options: {
          A: 'De las áreas más sucias/contaminadas hacia las más limpias',
          B: 'De las áreas más limpias hacia las más sucias/contaminadas (ej. de los ojos hacia el área perineal)',
          C: 'El orden no tiene ninguna importancia clínica',
          D: 'Siempre empezando por los pies',
        },
        answer: ['B'],
        explanation:
          'Se lava de limpio a sucio (ej. cara y ojos primero, área perineal al final) para evitar transferir microorganismos de zonas más contaminadas a zonas más limpias, reduciendo el riesgo de infección.',
        domain: 'Actividades de la Vida Diaria',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un residente con disfagia (dificultad para tragar) está siendo alimentado. ¿Qué posición corporal reduce el riesgo de aspiración durante la comida?',
        options: {
          A: 'Acostado completamente horizontal',
          B: 'Sentado en posición vertical (upright), con la cabeza ligeramente flexionada hacia adelante',
          C: 'Recostado sobre el lado derecho',
          D: 'La posición no afecta el riesgo de aspiración',
        },
        answer: ['B'],
        explanation:
          'Mantener al residente sentado en posición vertical (idealmente 90°) durante y al menos 30 minutos después de comer, con la cabeza ligeramente flexionada, reduce significativamente el riesgo de aspiración en personas con disfagia.',
        domain: 'Actividades de la Vida Diaria',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el principio más importante que debe seguir un auxiliar de enfermería al ayudar a un residente con sus actividades de la vida diaria (AVD)?',
        options: {
          A: 'Hacer todo por el residente lo más rápido posible, sin involucrarlo',
          B: 'Fomentar la mayor independencia posible del residente, asistiendo solo en lo que realmente no puede hacer por sí mismo',
          C: 'Realizar las AVD únicamente cuando el residente lo exige explícitamente',
          D: 'Evitar cualquier contacto físico con el residente',
        },
        answer: ['B'],
        explanation:
          'Un principio central del cuidado de auxiliares de enfermería es promover la independencia y dignidad del residente, ayudando solo donde realmente lo necesita, en vez de hacer todo por él (lo que puede acelerar la pérdida de capacidades funcionales).',
        domain: 'Actividades de la Vida Diaria',
        difficulty: 'easy',
      },

      // ── Habilidades Básicas de Enfermería (15) ──────────────────────────
      {
        type: 'multiple',
        question: '¿Cuál es el rango normal de temperatura corporal oral en un adulto?',
        options: {
          A: '30.0°C – 32.0°C',
          B: '36.5°C – 37.5°C (aproximadamente 97.6°F – 99.6°F)',
          C: '39.0°C – 40.0°C',
          D: '33.0°C – 34.0°C',
        },
        answer: ['B'],
        explanation:
          'La temperatura corporal oral normal en un adulto se ubica generalmente entre 36.5°C y 37.5°C (97.6°F–99.6°F); valores fuera de este rango pueden indicar fiebre o hipotermia y deben reportarse.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuál es el rango normal de frecuencia cardíaca (pulso) en reposo para un adulto?',
        options: {
          A: '20-40 latidos por minuto',
          B: '60-100 latidos por minuto',
          C: '120-160 latidos por minuto',
          D: '150-200 latidos por minuto',
        },
        answer: ['B'],
        explanation:
          'La frecuencia cardíaca normal en reposo de un adulto se ubica entre 60 y 100 latidos por minuto; valores por debajo (bradicardia) o por encima (taquicardia) de ese rango deben reportarse a la enfermera.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el paso individual MÁS importante y efectivo para prevenir la propagación de infecciones en un centro de cuidado?',
        options: {
          A: 'Usar siempre guantes, sin importar si se lavan las manos',
          B: 'El lavado de manos (higiene de manos) correcto y frecuente, antes y después de cada contacto con un residente',
          C: 'Usar mascarilla únicamente cuando el residente tiene tos',
          D: 'Limpiar las habitaciones una vez por semana',
        },
        answer: ['B'],
        explanation:
          'El lavado de manos es reconocido universalmente como la medida individual más efectiva para prevenir la transmisión de infecciones en entornos de cuidado de salud, y debe realizarse antes y después de cada contacto con un residente, incluso si se usan guantes.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un residente con precauciones de contacto (ej. por una infección resistente) requiere que el auxiliar use, como mínimo:',
        options: {
          A: 'Ningún equipo de protección adicional, el lavado de manos es suficiente',
          B: 'Guantes y bata (gown) antes de entrar a la habitación, retirándolos y desechándolos antes de salir, seguido de higiene de manos',
          C: 'Solo mascarilla quirúrgica',
          D: 'Solo protección ocular',
        },
        answer: ['B'],
        explanation:
          'Las precauciones de contacto requieren usar guantes y bata al entrar en contacto con el residente o su entorno, retirando ambos elementos antes de salir de la habitación y realizando higiene de manos inmediatamente después, para evitar propagar el microorganismo.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué posición corporal se recomienda para prevenir úlceras por presión (escaras) en un residente encamado que no puede moverse por sí mismo?',
        options: {
          A: 'Dejarlo en la misma posición todo el día para no molestarlo',
          B: 'Reposicionarlo al menos cada 2 horas, alternando entre distintas posiciones para redistribuir la presión',
          C: 'Reposicionarlo solo una vez al día',
          D: 'Mantenerlo siempre boca arriba sin variación',
        },
        answer: ['B'],
        explanation:
          'El estándar de cuidado para prevenir úlceras por presión en residentes con movilidad reducida es reposicionarlos al menos cada 2 horas, alternando entre decúbito lateral, supino y otras posiciones para aliviar la presión sostenida sobre prominencias óseas.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Antes de trasladar a un residente de la cama a una silla de ruedas, ¿cuál es la primera acción de seguridad que debe realizar el auxiliar?',
        options: {
          A: 'Trasladar al residente lo más rápido posible sin verificar el entorno',
          B: 'Verificar y frenar (lock) las ruedas de la cama y de la silla de ruedas, asegurando que ambas estén estables antes del traslado',
          C: 'Quitarle los zapatos al residente',
          D: 'Apagar las luces de la habitación',
        },
        answer: ['B'],
        explanation:
          'Frenar las ruedas de la cama y de la silla de ruedas antes de cualquier traslado es un paso de seguridad fundamental para evitar que el equipo se mueva inesperadamente y cause una caída del residente o lesión del auxiliar.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un residente presenta una frecuencia respiratoria de 32 respiraciones por minuto en reposo. ¿Qué debe hacer el auxiliar de enfermería?',
        options: {
          A: 'No reportarlo porque está dentro de lo normal para un adulto',
          B: 'Reportarlo inmediatamente a la enfermera, ya que está por encima del rango normal (12-20 rpm) y podría indicar dificultad respiratoria',
          C: 'Esperar hasta el final del turno para mencionarlo',
          D: 'Administrar oxígeno directamente sin indicación',
        },
        answer: ['B'],
        explanation:
          'El rango normal de frecuencia respiratoria en un adulto en reposo es de 12 a 20 respiraciones por minuto; 32 rpm indica taquipnea y debe reportarse de inmediato a la enfermera, ya que el auxiliar no está autorizado a administrar tratamientos (como oxígeno) sin indicación.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el uso correcto del método "body mechanics" (mecánica corporal) al levantar o mover a un residente?',
        options: {
          A: 'Doblar la espalda y levantar con los músculos lumbares para tener más fuerza',
          B: 'Mantener la espalda recta, doblar las rodillas y levantar usando los músculos de las piernas, manteniendo la carga cerca del cuerpo',
          C: 'Girar la espalda mientras se sostiene el peso para ahorrar tiempo',
          D: 'Levantar siempre solo, sin pedir ayuda, sin importar el peso del residente',
        },
        answer: ['B'],
        explanation:
          'La mecánica corporal correcta implica mantener la espalda recta, flexionar las rodillas y usar los músculos de las piernas (más fuertes) en lugar de la espalda, manteniendo la carga cerca del cuerpo — previene lesiones tanto en el residente como en el auxiliar.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Al medir la presión arterial de un residente, el auxiliar obtiene una lectura de 190/110 mmHg. ¿Cuál es la acción apropiada?',
        options: {
          A: 'Registrar el valor sin comunicarlo a nadie, ya que es solo un número más',
          B: 'Reportar inmediatamente el valor a la enfermera, ya que está muy por encima del rango normal y podría indicar una crisis hipertensiva',
          C: 'Repetir la medición en una semana',
          D: 'Administrar medicación antihipertensiva directamente',
        },
        answer: ['B'],
        explanation:
          'Un valor de 190/110 mmHg está muy por encima del rango normal (aproximadamente 120/80) y puede indicar una crisis hipertensiva que requiere atención urgente; el auxiliar debe reportarlo inmediatamente a la enfermera, sin administrar medicamentos, ya que eso está fuera de su alcance.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué información NO debe omitir un auxiliar de enfermería al registrar (documentar) la ingesta y excreción (I&O) de un residente?',
        options: {
          A: 'Solo los líquidos que el residente bebió durante el desayuno',
          B: 'Toda la ingesta de líquidos (comidas, bebidas) y toda la salida (orina, vómito, drenajes) durante el turno completo, con horarios y cantidades',
          C: 'Solo si el residente lo pide explícitamente',
          D: 'Únicamente los alimentos sólidos consumidos',
        },
        answer: ['B'],
        explanation:
          'El registro preciso de ingesta y excreción (I&O) requiere documentar TODA la ingesta de líquidos y TODA la salida durante el turno completo, con cantidades y horarios, ya que es información clínica usada para evaluar el balance hídrico del residente.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un residente tiene una vía de oxígeno por cánula nasal. Al ayudarlo a comer, el auxiliar nota que el residente está cianótico (labios azulados) y con dificultad para respirar. ¿Cuál es la acción inmediata correcta?',
        options: {
          A: 'Continuar la comida y reportarlo al final del turno',
          B: 'Detener la actividad de inmediato y notificar urgentemente a la enfermera, ya que son signos de emergencia respiratoria',
          C: 'Aumentar el flujo de oxígeno por su cuenta sin indicación',
          D: 'Ignorarlo si el residente no se queja verbalmente',
        },
        answer: ['B'],
        explanation:
          'La cianosis y dificultad respiratoria son signos de una posible emergencia. El auxiliar debe detener la actividad de inmediato y notificar urgentemente a la enfermera — no está autorizado a ajustar el flujo de oxígeno por sí mismo.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito principal de aplicar medias de compresión (TED hose) a un residente encamado?',
        options: {
          A: 'Mejorar la apariencia estética de las piernas',
          B: 'Ayudar a prevenir la formación de coágulos sanguíneos (trombosis venosa profunda) al mejorar el retorno venoso',
          C: 'Aumentar la temperatura corporal general',
          D: 'Reemplazar la necesidad de movilización',
        },
        answer: ['B'],
        explanation:
          'Las medias de compresión ayudan a mejorar el retorno venoso en pacientes con movilidad reducida, reduciendo el riesgo de estasis sanguínea y formación de trombosis venosa profunda (TVP) — no reemplazan la movilización activa cuando es posible.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué debe hacer un auxiliar de enfermería si nota que un residente presenta un enrojecimiento persistente en la piel sobre el sacro que no desaparece al aliviar la presión?',
        options: {
          A: 'Aplicar una crema sin reportarlo, ya que es una decisión dentro de su alcance',
          B: 'Reportarlo de inmediato a la enfermera, ya que puede ser una etapa temprana de úlcera por presión',
          C: 'Ignorarlo porque el enrojecimiento es normal en personas mayores',
          D: 'Esperar una semana para ver si mejora por sí solo',
        },
        answer: ['B'],
        explanation:
          'Un enrojecimiento (eritema) que no blanquea ni desaparece al aliviar la presión es un signo temprano de úlcera por presión (Etapa 1) y debe reportarse de inmediato a la enfermera para intervención oportuna — el auxiliar no debe aplicar tratamientos por su cuenta.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Al usar una silla de baño (shower chair) para bañar a un residente con riesgo de caídas, ¿cuál es una medida de seguridad esencial?',
        options: {
          A: 'Dejar al residente solo brevemente para buscar toallas',
          B: 'Verificar que la silla tenga superficie antideslizante y nunca dejar al residente sin supervisión mientras está sentado en ella dentro de la ducha',
          C: 'Usar agua lo más caliente posible sin verificar la temperatura',
          D: 'No es necesario ningún cuidado adicional con residentes de riesgo de caídas',
        },
        answer: ['B'],
        explanation:
          'Con residentes de riesgo de caídas, nunca se debe dejar sola a la persona en la ducha, y se debe verificar que el equipo (silla de baño, superficie del piso) sea antideslizante — la supervisión continua es la medida de seguridad más crítica.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'easy',
      },

      {
        type: 'multiple',
        question:
          'Al ponerse y quitarse el equipo de protección personal (PPE) para atender a un residente con precauciones estándar, ¿en qué orden se deben RETIRAR los guantes y la mascarilla al salir de la habitación?',
        options: {
          A: 'Primero la mascarilla y luego los guantes, sin lavarse las manos entre pasos',
          B: 'Primero los guantes (la parte más contaminada), realizar higiene de manos, y luego retirar la mascarilla tocando solo las tiras, seguido de higiene de manos final',
          C: 'El orden de retiro no importa mientras se laven las manos al final',
          D: 'Nunca se deben retirar dentro de la habitación del residente',
        },
        answer: ['B'],
        explanation:
          'La secuencia correcta de retiro de PPE minimiza la autocontaminación: primero los guantes (lo más contaminado), higiene de manos, luego la mascarilla tocando solo las tiras (no la parte frontal contaminada), y finalmente higiene de manos otra vez.',
        domain: 'Habilidades Básicas de Enfermería',
        difficulty: 'hard',
      },

      // ── Habilidades Restaurativas (2) ────────────────────────────────
      {
        type: 'multiple',
        question:
          '¿Cuál es el objetivo principal del "cuidado restaurativo" (restorative care) en el contexto del rol del auxiliar de enfermería?',
        options: {
          A: 'Hacer todas las tareas por el residente para que descanse completamente',
          B: 'Ayudar al residente a mantener o recuperar el mayor nivel posible de independencia y función, mediante ejercicios y técnicas de apoyo específicas',
          C: 'Aplicar exclusivamente a residentes en cuidados paliativos',
          D: 'Reemplazar la fisioterapia profesional en todos los casos',
        },
        answer: ['B'],
        explanation:
          'El cuidado restaurativo busca ayudar al residente a mantener o recuperar su máximo nivel de independencia funcional posible (movilidad, autocuidado), mediante técnicas específicas de apoyo, en lugar de fomentar la dependencia haciendo todo por él.',
        domain: 'Habilidades Restaurativas',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué es el "range of motion" (ROM, rango de movimiento) pasivo y cuándo se aplica?',
        options: {
          A: 'Ejercicios que el residente realiza completamente por sí solo sin ayuda',
          B: 'Movimientos articulares realizados por el auxiliar en las extremidades del residente cuando este no puede moverlas por sí mismo, para prevenir rigidez y contracturas',
          C: 'Un tipo de medicamento para el dolor articular',
          D: 'Solo se aplica a residentes que pueden caminar sin ayuda',
        },
        answer: ['B'],
        explanation:
          'Los ejercicios de rango de movimiento pasivo son movimientos que el auxiliar realiza en las articulaciones del residente cuando este no tiene la capacidad de moverlas activamente, ayudando a prevenir rigidez, contracturas y complicaciones por inmovilidad prolongada.',
        domain: 'Habilidades Restaurativas',
        difficulty: 'medium',
      },

      // ── Rol del Auxiliar de Enfermería (7) ───────────────────────────
      {
        type: 'multiple',
        question:
          'Un residente le confía al auxiliar información personal sensible y le pide que no se la diga a nadie, ni siquiera a la enfermera. ¿Cuál es la respuesta correcta del auxiliar?',
        options: {
          A: 'Prometer guardar el secreto absoluto sin excepciones',
          B: 'Explicar con respeto que, como parte del equipo de cuidado, cierta información clínicamente relevante debe compartirse con la enfermera y el equipo, mientras se protege la confidencialidad frente a terceros no autorizados',
          C: 'Compartir la información con otros residentes por curiosidad',
          D: 'Ignorar al residente sin responder',
        },
        answer: ['B'],
        explanation:
          'La confidencialidad del residente se protege frente a terceros no autorizados, pero la información clínicamente relevante debe compartirse dentro del equipo de cuidado (enfermera, equipo tratante) para garantizar una atención segura y coordinada — el auxiliar no puede prometer secretismo absoluto que comprometa el cuidado.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál de los siguientes es un derecho fundamental del residente según la Carta de Derechos del Paciente/Residente?',
        options: {
          A: 'El derecho a rechazar tratamiento, siendo informado de las consecuencias de esa decisión',
          B: 'El derecho a que el personal decida todo por él sin consultarle',
          C: 'El derecho a no recibir ninguna información sobre su condición',
          D: 'El derecho a que se ignoren sus quejas sobre el cuidado recibido',
        },
        answer: ['A'],
        explanation:
          'El derecho a rechazar tratamiento (informado de las consecuencias) es un derecho fundamental reconocido en las cartas de derechos del paciente/residente, reflejando el principio de autonomía — el auxiliar debe respetar esta decisión y reportarla, no imponer un tratamiento.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el ámbito de práctica (scope of practice) correcto de un Nurse Aide/CNA respecto a la administración de medicamentos?',
        options: {
          A: 'Puede administrar cualquier medicamento oral si el residente se lo pide',
          B: 'NO está autorizado a administrar medicamentos; esa es responsabilidad de personal de enfermería licenciado (RN/LPN), salvo excepciones muy específicas según la regulación local',
          C: 'Puede ajustar dosis de insulina según su criterio',
          D: 'Puede recetar analgésicos de venta libre sin supervisión',
        },
        answer: ['B'],
        explanation:
          'En general, la administración de medicamentos está fuera del ámbito de práctica de un CNA/Nurse Aide y es responsabilidad de personal de enfermería licenciado; actuar fuera de este ámbito constituye una violación grave del scope of practice.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un auxiliar de enfermería sospecha que un residente está siendo víctima de abuso o negligencia por parte de un familiar. ¿Cuál es su obligación?',
        options: {
          A: 'No decir nada para evitar conflictos con la familia',
          B: 'Reportarlo inmediatamente según el protocolo de la institución (a la enfermera/supervisor), ya que los auxiliares son "mandatory reporters" de sospecha de abuso o negligencia',
          C: 'Confrontar directamente al familiar sin informar a nadie más',
          D: 'Esperar a tener pruebas contundentes antes de decir algo',
        },
        answer: ['B'],
        explanation:
          'Los Nurse Aides son "mandatory reporters": tienen la obligación legal y ética de reportar cualquier sospecha razonable de abuso, negligencia o explotación de un residente a través del canal correspondiente de la institución, sin necesidad de tener pruebas concluyentes.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué significa "HIPAA" en el contexto del trabajo de un auxiliar de enfermería en Estados Unidos?',
        options: {
          A: 'Una ley que regula exclusivamente los salarios del personal de salud',
          B: 'Una ley federal que protege la confidencialidad y privacidad de la información de salud del paciente/residente',
          C: 'Un protocolo de limpieza hospitalaria',
          D: 'Una certificación de primeros auxilios',
        },
        answer: ['B'],
        explanation:
          'HIPAA (Health Insurance Portability and Accountability Act) es la ley federal estadounidense que protege la privacidad y confidencialidad de la información de salud del paciente; el auxiliar debe evitar divulgar información del residente a personas no autorizadas.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un residente le pide al auxiliar que le ayude a decidir sobre un tratamiento médico complejo, pidiendo su opinión personal como si fuera un profesional médico. ¿Cuál es la respuesta apropiada?',
        options: {
          A: 'Dar una opinión médica personal basada en experiencia propia',
          B: 'Explicar con respeto que esa decisión está fuera de su ámbito de práctica y sugerir que hable con la enfermera o el médico tratante',
          C: 'Decidir por el residente para ahorrarle la preocupación',
          D: 'Ignorar la pregunta sin dar ninguna respuesta',
        },
        answer: ['B'],
        explanation:
          'Dar opiniones o consejos médicos está fuera del ámbito de práctica de un auxiliar de enfermería; la respuesta correcta es redirigir con respeto al residente hacia el personal calificado (enfermera o médico) para esa decisión clínica.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál de las siguientes es una técnica de comunicación efectiva recomendada al hablar con un residente con pérdida auditiva?',
        options: {
          A: 'Gritar desde otra habitación sin contacto visual',
          B: 'Colocarse frente al residente, mantener contacto visual y hablar con claridad y a un ritmo moderado, sin necesariamente gritar',
          C: 'Hablar siempre por detrás del residente para no incomodarlo',
          D: 'Evitar cualquier comunicación verbal y usar solo gestos',
        },
        answer: ['B'],
        explanation:
          'Con residentes con pérdida auditiva, se recomienda colocarse frente a ellos (permite lectura labial), mantener contacto visual y hablar con claridad a un ritmo moderado — gritar o hablar desde atrás no mejora, e incluso puede empeorar, la comprensión.',
        domain: 'Rol del Auxiliar de Enfermería',
        difficulty: 'easy',
      },

      // ── Cuidado Psicosocial (3) ───────────────────────────────────────
      {
        type: 'multiple',
        question:
          'Un residente recién ingresado a una residencia muestra tristeza, aislamiento y pérdida de apetito. ¿Qué necesidad psicosocial es más probable que esté afectada?',
        options: {
          A: 'Necesidad de nutrición exclusivamente física, sin componente emocional',
          B: 'Necesidad emocional relacionada con el proceso de adaptación y posible duelo por la pérdida de independencia/hogar (ajuste psicosocial al ingreso)',
          C: 'Ninguna necesidad psicosocial, es solo un problema médico',
          D: 'Necesidad exclusivamente relacionada con la temperatura de la habitación',
        },
        answer: ['B'],
        explanation:
          'El ingreso a una residencia frecuentemente implica un proceso de duelo por la pérdida de independencia, hogar y rutina; síntomas como tristeza, aislamiento y pérdida de apetito son señales de necesidades emocionales/psicosociales que deben reportarse y abordarse con apoyo.',
        domain: 'Cuidado Psicosocial',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cómo debe responder un auxiliar de enfermería ante las necesidades espirituales o culturales específicas de un residente (ej. preferencias religiosas, dietéticas o rituales)?',
        options: {
          A: 'Ignorarlas porque no forman parte del cuidado clínico',
          B: 'Respetarlas y facilitarlas dentro de lo razonable, y comunicar al equipo cualquier necesidad especial para asegurar que se incorpore al plan de cuidado',
          C: 'Imponer sus propias creencias personales al residente',
          D: 'Solo respetarlas si coinciden con las creencias del auxiliar',
        },
        answer: ['B'],
        explanation:
          'El respeto a las necesidades espirituales y culturales es parte integral del cuidado centrado en la persona; el auxiliar debe facilitarlas dentro de lo razonable y comunicarlas al equipo para que se reflejen en el plan de cuidado, sin imponer sus propias creencias.',
        domain: 'Cuidado Psicosocial',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un residente con demencia se muestra agitado y confundido durante la tarde (fenómeno conocido como "sundowning"). ¿Cuál es un enfoque apropiado del auxiliar de enfermería?',
        options: {
          A: 'Discutir con el residente para corregir su confusión con lógica',
          B: 'Mantener un ambiente calmado, predecible y con buena iluminación, usar un tono de voz tranquilo, y evitar confrontaciones directas sobre su confusión',
          C: 'Dejarlo completamente solo hasta que se calme',
          D: 'Aumentar el ruido y la estimulación del ambiente para distraerlo',
        },
        answer: ['B'],
        explanation:
          'Ante el "sundowning" (agitación vespertina en demencia), se recomienda un ambiente tranquilo, predecible y bien iluminado, comunicación calmada y no confrontacional, evitando corregir con lógica una confusión que tiene origen neurológico, no de razonamiento.',
        domain: 'Cuidado Psicosocial',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'bls-basic-life-support',
    title: 'BLS — Soporte Vital Básico (AHA)',
    description: 'Examen de práctica estilo AHA BLS Provider, alineado a las 2025 AHA Guidelines for CPR and ECC: RCP de alta calidad, DEA y atención de atragantamiento.',
    domain: 'health', category: 'emergency', level: 'beginner', language: 'es',
    tags: ['bls', 'rcp', 'dea'], passPercent: 80, timeMinutes: 20,
    source: 'Basado en 2025 AHA Guidelines for CPR and ECC + BLS Provider Manual — cpr.heart.org (contenido original)',
    questions: [
      { type: 'multiple', question: 'Las 2025 AHA Guidelines unificaron la cadena de supervivencia. ¿Qué cambio clave introdujo esta actualización?', options: { A: 'Se dividió en cuatro cadenas distintas según edad', B: 'Se estableció UNA sola cadena de supervivencia que cubre paro cardiaco adulto y pediátrico, tanto intrahospitalario como extrahospitalario, con un lenguaje compartido', C: 'Se eliminó por completo el concepto de cadena de supervivencia', D: 'Solo aplica a paros extrahospitalarios' }, answer: ['B'], explanation: 'Las 2025 AHA Guidelines reemplazaron las cadenas separadas (adulto/pediátrica, intra/extrahospitalaria) por una sola cadena de supervivencia unificada, con eslabones compartidos aplicables a cualquier contexto de paro cardiaco.', domain: 'Cadena de supervivencia (unificada 2025)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la frecuencia recomendada de compresiones torácicas en RCP de alta calidad para un adulto?', options: { A: '60-80 compresiones por minuto', B: '100-120 compresiones por minuto', C: '140-160 compresiones por minuto', D: 'No importa la frecuencia mientras se comprima' }, answer: ['B'], explanation: 'La frecuencia recomendada es de 100 a 120 compresiones por minuto, un parámetro central de la RCP de alta calidad que se ha mantenido estable en las guías AHA.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la profundidad recomendada de las compresiones torácicas en un adulto durante RCP?', options: { A: 'Al menos 2 cm', B: 'Al menos 5 cm, sin exceder 6 cm', C: 'Al menos 10 cm', D: 'La profundidad no es relevante' }, answer: ['B'], explanation: 'Se recomienda comprimir al menos 5 cm (2 pulgadas) sin exceder 6 cm (2.4 pulgadas) en adultos, ya que compresiones insuficientes o excesivas reducen la eficacia o aumentan el riesgo de lesión.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la relación (ratio) compresión-ventilación recomendada para RCP de un solo reanimador en un adulto, sin vía aérea avanzada?', options: { A: '15:2', B: '30:2', C: '5:1', D: '10:1' }, answer: ['B'], explanation: 'Para un reanimador único en adultos sin vía aérea avanzada, la relación recomendada es 30 compresiones por cada 2 ventilaciones de rescate.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué es importante permitir la reexpansión completa del tórax entre compresiones durante la RCP?', options: { A: 'No tiene ningún efecto real en la calidad de la RCP', B: 'Permite que el corazón se llene adecuadamente de sangre entre compresiones, optimizando el flujo sanguíneo generado por la siguiente compresión', C: 'Solo afecta la comodidad del reanimador', D: 'Acelera la frecuencia de compresiones' }, answer: ['B'], explanation: 'La reexpansión completa del tórax permite que las cavidades cardíacas se llenen de sangre entre compresiones; apoyarse sobre el tórax sin permitir esta reexpansión reduce el retorno venoso y, por lo tanto, la eficacia de la siguiente compresión.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué se debe minimizar durante toda la reanimación para mejorar la supervivencia, según los principios de RCP de alta calidad?', options: { A: 'El número de reanimadores presentes', B: 'Las interrupciones de las compresiones torácicas, manteniéndolas lo más breves posible (idealmente menos de 10 segundos)', C: 'El uso del DEA', D: 'La ventilación con bolsa-mascarilla' }, answer: ['B'], explanation: 'Minimizar las interrupciones de las compresiones (ej. al analizar el ritmo con el DEA o cambiar de reanimador) es un pilar de la RCP de alta calidad, ya que cada pausa reduce la perfusión de órganos vitales generada por las compresiones previas.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué debe hacer un reanimador inmediatamente después de colocar los parches del DEA y que el dispositivo indique "analizando"?', options: { A: 'Continuar las compresiones sin detenerse', B: 'Alejarse del paciente y asegurarse de que nadie lo esté tocando, permitiendo que el DEA analice el ritmo sin interferencia', C: 'Ventilar al paciente simultáneamente', D: 'Apagar el DEA inmediatamente' }, answer: ['B'], explanation: 'Durante el análisis del ritmo, nadie debe tocar al paciente (incluyendo detener las compresiones), ya que el movimiento puede interferir con la capacidad del DEA de analizar correctamente el ritmo cardiaco.', domain: 'Uso del DEA', difficulty: 'easy' },
      { type: 'multiple', question: 'Si el DEA indica "descarga no aconsejada" (no shockable), ¿qué debe hacer el reanimador inmediatamente?', options: { A: 'Aplicar la descarga de todas formas', B: 'Reanudar inmediatamente las compresiones torácicas de alta calidad', C: 'Esperar 5 minutos antes de continuar', D: 'Retirar los parches del DEA y detener la reanimación' }, answer: ['B'], explanation: 'Cuando el DEA determina que el ritmo no es desfibrilable (ej. asistolia o AESP), el reanimador debe reanudar inmediatamente la RCP con compresiones de alta calidad, ya que la descarga no ayudaría en ese ritmo específico.', domain: 'Uso del DEA', difficulty: 'medium' },
      { type: 'multiple', question: 'Según la actualización de las 2025 AHA Guidelines, ¿cuál es la secuencia recomendada para atender a un adulto consciente con obstrucción severa de la vía aérea (atragantamiento)?', options: { A: 'Solo compresiones abdominales (maniobra de Heimlich) hasta que expulse el objeto', B: 'Ciclos alternados de 5 golpes en la espalda seguidos de 5 compresiones abdominales, repitiendo hasta que se resuelva la obstrucción o la persona quede inconsciente', C: 'Solo golpes en la espalda, sin compresiones abdominales', D: 'Ninguna intervención hasta que llegue personal médico' }, answer: ['B'], explanation: 'La actualización de 2025 AHA formaliza la secuencia de ciclos alternados de 5 golpes en la espalda seguidos de 5 compresiones abdominales, repitiendo hasta resolver la obstrucción o hasta que la persona pierda el conocimiento (momento en que se inicia RCP).', domain: 'OVACE (obstrucción de vía aérea)', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué se debe hacer si una persona con obstrucción de vía aérea pierde el conocimiento mientras se le atiende?', options: { A: 'Dejarla en el suelo sin hacer nada más', B: 'Bajarla cuidadosamente al suelo e iniciar RCP, comenzando con compresiones torácicas', C: 'Continuar únicamente con golpes en la espalda de pie', D: 'Levantarla en el aire y agitarla' }, answer: ['B'], explanation: 'Si la persona pierde el conocimiento, se debe bajar cuidadosamente al suelo e iniciar RCP (comenzando con compresiones torácicas); cada vez que se abre la vía aérea para ventilar, se debe revisar si el objeto es visible para poder retirarlo.', domain: 'OVACE (obstrucción de vía aérea)', difficulty: 'medium' },
      { type: 'multiple', question: 'Según la guía incorporada en las 2025 AHA Guidelines, ¿qué medicamento se debe considerar administrar ante sospecha de paro respiratorio/cardiopulmonar por sobredosis de opioides?', options: { A: 'Naloxona', B: 'Adrenalina exclusivamente sin ningún otro medicamento', C: 'Insulina', D: 'Aspirina' }, answer: ['A'], explanation: 'Las 2025 AHA Guidelines incorporan explícitamente el lugar de la naloxona dentro del algoritmo de BLS ante sospecha de sobredosis de opioides con paro respiratorio o cardiopulmonar, sin que su administración deba retrasar el inicio de RCP y la activación del sistema de emergencias.', domain: 'Situaciones especiales (embarazo, ahogamiento, opioides)', difficulty: 'hard' },
      { type: 'multiple', question: '¿Cuál es la primera acción al encontrar a una persona adulta que parece inconsciente en un espacio público?', options: { A: 'Iniciar compresiones torácicas inmediatamente sin evaluar nada', B: 'Verificar la seguridad de la escena y evaluar la respuesta de la persona (dar toques y llamarla en voz alta)', C: 'Llamar directamente a un familiar de la víctima', D: 'Esperar a que la persona despierte por sí sola' }, answer: ['B'], explanation: 'El primer paso siempre es verificar que la escena sea segura para el reanimador, y luego evaluar la respuesta de la víctima (estímulo táctil y verbal) antes de decidir los siguientes pasos de la cadena de supervivencia.', domain: 'RCP en equipo', difficulty: 'easy' },
      { type: 'multiple', question: 'En una reanimación con múltiples reanimadores entrenados, ¿por qué se recomienda rotar la persona que realiza las compresiones cada 2 minutos aproximadamente?', options: { A: 'Para que todos "tengan su turno" sin ningún motivo clínico', B: 'Porque la fatiga del reanimador reduce progresivamente la calidad (profundidad/frecuencia) de las compresiones, incluso sin que el reanimador lo perciba subjetivamente', C: 'Es un requisito exclusivamente legal sin fundamento clínico', D: 'Solo aplica si hay más de 5 reanimadores presentes' }, answer: ['B'], explanation: 'La fatiga reduce objetivamente la calidad de las compresiones (profundidad y frecuencia) incluso antes de que el reanimador lo note subjetivamente; rotar cada 2 minutos (aprovechando el análisis del ritmo por el DEA) mantiene una RCP de alta calidad sostenida.', domain: 'RCP en equipo', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la secuencia correcta de RCP en adultos según BLS: compresiones primero (C-A-B) o vía aérea primero (A-B-C)?', options: { A: 'A-B-C: vía aérea, respiración, compresiones', B: 'C-A-B: compresiones, vía aérea, respiración — iniciar con compresiones sin demora', C: 'El orden no tiene ninguna importancia', D: 'B-A-C: respiración, vía aérea, compresiones' }, answer: ['B'], explanation: 'La secuencia C-A-B (Compresiones-vía Aérea-respiración/Breathing) prioriza iniciar las compresiones torácicas sin demora, en lugar de dedicar tiempo primero a la vía aérea, minimizando el tiempo sin flujo sanguíneo tras el paro.', domain: 'RCP de alta calidad (compresiones, ventilaciones, ratio)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el primer paso al identificar que una persona no respira o solo jadea/boquea (gasping) y no responde?', options: { A: 'Esperar unos minutos para confirmar antes de actuar', B: 'Activar el sistema de emergencias (o pedir a alguien que lo haga) y solicitar un DEA, iniciando RCP de inmediato', C: 'Darle agua a la persona', D: 'Colocarla en posición de recuperación sin más acciones' }, answer: ['B'], explanation: 'La respiración agónica (gasping) NO es respiración normal y es un signo de paro cardiaco; se debe activar inmediatamente el sistema de emergencias, solicitar un DEA e iniciar RCP sin demora, sin esperar a "confirmar" con más tiempo de observación.', domain: 'Cadena de supervivencia (unificada 2025)', difficulty: 'medium' },
    ],
  },
  {
    slug: 'acls-advanced-cardiac',
    title: 'ACLS — Soporte Vital Cardiovascular Avanzado',
    description: 'Examen de práctica estilo AHA ACLS Provider: algoritmos de paro cardiaco, bradicardia, taquicardia y cuidados post-paro, alineado a las 2025 AHA Guidelines.',
    domain: 'health', category: 'emergency', level: 'advanced', language: 'es',
    tags: ['acls', 'algoritmos', 'aha'], passPercent: 80, timeMinutes: 22,
    source: 'Basado en 2025 AHA Guidelines for CPR and ECC + ACLS Provider Manual — cpr.heart.org (contenido original)',
    questions: [
      { type: 'multiple', question: 'En el algoritmo de paro cardiaco, ¿qué dos ritmos son "desfibrilables" (shockables)?', options: { A: 'Asistolia y AESP', B: 'Fibrilación ventricular (FV) y taquicardia ventricular sin pulso (TV sin pulso)', C: 'Bradicardia sinusal y taquicardia sinusal', D: 'Bloqueo AV de primer grado y segundo grado' }, answer: ['B'], explanation: 'FV y TV sin pulso son los únicos ritmos de paro cardiaco desfibrilables; asistolia y AESP (Actividad Eléctrica Sin Pulso) NO se tratan con descargas, sino con RCP de alta calidad y manejo de causas reversibles.', domain: 'Algoritmo de paro cardiaco (FV/TV sin pulso, AESP/asistolia)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el manejo prioritario ante un ritmo de Actividad Eléctrica Sin Pulso (AESP)?', options: { A: 'Desfibrilar inmediatamente', B: 'RCP de alta calidad continua, identificar y tratar causas reversibles (las "H y T"), y administrar adrenalina según el algoritmo', C: 'Solo observar sin ninguna intervención', D: 'Administrar amiodarona como primera línea' }, answer: ['B'], explanation: 'AESP no es desfibrilable; el manejo se centra en RCP de alta calidad continua, la búsqueda activa de causas reversibles (Hipovolemia, Hipoxia, H+/acidosis, Hipo/hiperkalemia, Hipotermia, Neumotórax a Tensión, Taponamiento, Toxinas, Trombosis) y adrenalina según el algoritmo.', domain: 'Algoritmo de paro cardiaco (FV/TV sin pulso, AESP/asistolia)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué fármaco es la primera línea vasopresora en el algoritmo de paro cardiaco de ACLS, sin importar el ritmo?', options: { A: 'Adrenalina (epinefrina)', B: 'Amiodarona', C: 'Atropina', D: 'Dopamina' }, answer: ['A'], explanation: 'La adrenalina es el vasopresor de primera línea en el algoritmo de paro cardiaco de ACLS, administrada en todos los ritmos de paro según los intervalos del algoritmo, buscando mejorar la presión de perfusión coronaria durante la RCP.', domain: 'Fármacos ACLS (adrenalina, amiodarona, atropina)', difficulty: 'easy' },
      { type: 'multiple', question: '¿En qué contexto del algoritmo de paro cardiaco se considera administrar amiodarona (o lidocaína como alternativa)?', options: { A: 'En FV/TV sin pulso refractaria a las descargas iniciales', B: 'En cualquier ritmo de paro cardiaco sin distinción', C: 'Solo en bradicardia sintomática', D: 'Nunca se usa amiodarona en el contexto de paro cardiaco' }, answer: ['A'], explanation: 'La amiodarona (o lidocaína como alternativa) se considera como antiarrítmico en FV/TV sin pulso que persiste después de las descargas iniciales y la adrenalina, buscando facilitar la conversión a un ritmo con perfusión.', domain: 'Fármacos ACLS (adrenalina, amiodarona, atropina)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Para qué ritmo se usa principalmente la atropina en el algoritmo de bradicardia?', options: { A: 'Bradicardia sintomática, como primera línea farmacológica', B: 'Fibrilación ventricular', C: 'Taquicardia supraventricular estable', D: 'Asistolia como tratamiento definitivo' }, answer: ['A'], explanation: 'La atropina es el fármaco de primera línea en el algoritmo de bradicardia sintomática, buscando aumentar la frecuencia cardiaca al bloquear el efecto vagal sobre el nodo sinusal/AV; su eficacia es limitada en bloqueos de alto grado, donde puede requerirse marcapasos.', domain: 'Bradicardia con pulso', difficulty: 'medium' },
      { type: 'multiple', question: 'Un paciente presenta bradicardia sintomática (hipotensión, alteración del estado mental) que no responde a atropina. ¿Cuál es la siguiente opción de manejo según el algoritmo ACLS?', options: { A: 'Marcapasos transcutáneo o infusión de dopamina/adrenalina', B: 'Desfibrilación inmediata', C: 'Amiodarona en bolo', D: 'No hay más opciones de tratamiento disponibles' }, answer: ['A'], explanation: 'Si la bradicardia sintomática no responde a atropina, el algoritmo indica considerar marcapasos transcutáneo o una infusión de dopamina o adrenalina mientras se prepara el marcapasos, buscando estabilizar al paciente.', domain: 'Bradicardia con pulso', difficulty: 'hard' },
      { type: 'multiple', question: 'Un paciente con taquicardia de complejo estrecho y pulso presenta signos de inestabilidad (hipotensión severa, alteración aguda del estado mental, signos de shock). ¿Cuál es el manejo prioritario?', options: { A: 'Cardioversión sincronizada inmediata', B: 'Observación sin ninguna intervención', C: 'Adenosina exclusivamente, sin considerar cardioversión', D: 'Amiodarona oral' }, answer: ['A'], explanation: 'Ante taquicardia CON signos de inestabilidad hemodinámica, el manejo prioritario es la cardioversión sincronizada inmediata, independientemente del tipo específico de taquicardia (a menos que sea una taquicardia de complejo estrecho regular donde se pueda intentar adenosina brevemente si no retrasa la cardioversión).', domain: 'Taquicardia con pulso', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué fármaco se usa como primera línea para una taquicardia supraventricular (TSV) regular de complejo estrecho, ESTABLE hemodinámicamente?', options: { A: 'Adenosina', B: 'Adrenalina', C: 'Atropina', D: 'Naloxona' }, answer: ['A'], explanation: 'La adenosina, administrada en bolo rápido IV seguido de flush de solución salina, es el fármaco de primera línea para TSV regular estable, actuando al bloquear brevemente la conducción a través del nodo AV.', domain: 'Taquicardia con pulso', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el manejo inicial prioritario ante sospecha de Síndrome Coronario Agudo (SCA), resumido en el mnemónico MONA (aunque el orden de administración puede variar según la evidencia actual)?', options: { A: 'Morfina, Oxígeno, Nitroglicerina, Aspirina — con Aspirina como intervención temprana prioritaria y oxígeno solo si hay hipoxemia', B: 'Solo morfina, sin ninguna otra intervención', C: 'Únicamente observación sin tratamiento farmacológico', D: 'Antibióticos de amplio espectro' }, answer: ['A'], explanation: 'Ante sospecha de SCA, la Aspirina (si no está contraindicada) es una intervención temprana prioritaria por su beneficio en mortalidad; el oxígeno se reserva para pacientes con hipoxemia (SpO2 <90%) en vez de administrarse rutinariamente a todos los pacientes, un refinamiento importante de las guías más recientes.', domain: 'SCA', difficulty: 'hard' },
      { type: 'multiple', question: '¿Cuál es la ventana de tiempo generalmente crítica para considerar terapia de reperfusión (ej. trombolisis) en un ACV isquémico agudo?', options: { A: 'Dentro de las primeras horas desde el inicio de los síntomas, siendo "tiempo es cerebro" el principio guía para actuar lo más rápido posible', B: 'No existe ninguna ventana de tiempo relevante', C: 'Solo dentro de la primera semana', D: 'Únicamente después de 24 horas de observación' }, answer: ['A'], explanation: 'El principio "tiempo es cerebro" guía el manejo del ACV isquémico agudo: la terapia de reperfusión (trombolíticos, trombectomía mecánica) tiene ventanas de tiempo críticas desde el inicio de los síntomas, por lo que la identificación y traslado rápidos son esenciales.', domain: 'ACV', difficulty: 'medium' },
      { type: 'multiple', question: 'Según la actualización de las 2025 AHA Guidelines, ¿qué aspecto del cuidado post-paro cardiaco recibió actualizaciones relevantes?', options: { A: 'El algoritmo de cuidados post-paro cardiaco, con refinamientos en el manejo tras el retorno de circulación espontánea (RCE)', B: 'Ningún aspecto del cuidado post-paro fue actualizado', C: 'Solo se actualizó el manejo de vía aérea pediátrica', D: 'Se eliminó completamente el concepto de cuidados post-paro' }, answer: ['A'], explanation: 'Las 2025 AHA Guidelines incluyeron actualizaciones específicas al algoritmo de cuidados post-paro cardiaco, refinando el manejo del paciente tras lograr el retorno de circulación espontánea (RCE), incluyendo aspectos como control de temperatura y optimización hemodinámica.', domain: 'Post-cardiac arrest care', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué caracteriza la "dinámica de equipo de alto rendimiento" (high-performance team dynamics) en un escenario de reanimación ACLS?', options: { A: 'Un solo líder que realiza todas las tareas sin delegar nada al equipo', B: 'Roles claramente definidos, comunicación en circuito cerrado (confirmar que la orden fue escuchada y ejecutada), y un líder de equipo que coordina sin necesariamente realizar tareas manuales directamente', C: 'Ausencia total de comunicación verbal durante la reanimación', D: 'Rotación aleatoria de quién da las órdenes cada minuto' }, answer: ['B'], explanation: 'La dinámica de equipo efectiva en ACLS incluye roles claramente asignados, comunicación en circuito cerrado (el receptor confirma verbalmente que entendió y ejecutó la orden), y un líder que coordina la reanimación en vez de realizar todas las tareas manuales él mismo.', domain: 'Dinámica de equipo de alto rendimiento', difficulty: 'medium' },
    ],
  },
  {
    slug: 'farmacologia-basica',
    title: 'Farmacología Básica',
    description: 'Examen de práctica sobre principios de farmacocinética, farmacodinamia y grupos terapéuticos clave.',
    domain: 'health', category: 'pharmacology', level: 'intermediate', language: 'es',
    tags: ['farmacologia', 'medicamentos'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en Goodman & Gilman\'s The Pharmacological Basis of Therapeutics (14th Ed) — principios farmacológicos estándar (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué representan las siglas ADME en farmacocinética?', options: { A: 'Absorción, Distribución, Metabolismo, Excreción', B: 'Administración, Dosis, Mecanismo, Efecto', C: 'Análisis, Diagnóstico, Manejo, Evaluación', D: 'Absorción, Diagnóstico, Medicación, Efecto' }, answer: ['A'], explanation: 'ADME describe los cuatro procesos farmacocinéticos que determinan la concentración de un fármaco en el organismo a lo largo del tiempo: Absorción, Distribución, Metabolismo y Excreción.', domain: 'Farmacocinética (ADME)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es la "biodisponibilidad" de un fármaco?', options: { A: 'La fracción de la dosis administrada que llega a la circulación sistémica en forma activa, disponible para ejercer su efecto', B: 'El tiempo que tarda en eliminarse completamente el fármaco', C: 'El costo del medicamento', D: 'El número de efectos secundarios que produce' }, answer: ['A'], explanation: 'La biodisponibilidad mide qué proporción de la dosis administrada realmente alcanza la circulación sistémica de forma activa; la vía IV tiene 100% de biodisponibilidad por definición, mientras que la vía oral suele ser menor debido a la absorción incompleta y el metabolismo de primer paso hepático.', domain: 'Farmacocinética (ADME)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "vida media" (t½) de un fármaco?', options: { A: 'El tiempo que tarda en administrarse la dosis completa', B: 'El tiempo requerido para que la concentración plasmática del fármaco se reduzca a la mitad', C: 'El tiempo que tarda en aparecer el primer efecto terapéutico', D: 'La mitad de la dosis máxima recomendada' }, answer: ['B'], explanation: 'La vida media es el tiempo necesario para que la concentración plasmática de un fármaco se reduzca al 50% de su valor, un parámetro clave para determinar la frecuencia de dosificación y el tiempo hasta alcanzar un estado estable.', domain: 'Farmacocinética (ADME)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre un "agonista" y un "antagonista" en farmacodinamia?', options: { A: 'Un agonista se une a un receptor y activa una respuesta biológica; un antagonista se une al receptor pero bloquea o inhibe la respuesta, sin activarla', B: 'Son exactamente lo mismo', C: 'Los antagonistas siempre son más potentes que los agonistas', D: 'Solo los agonistas pueden unirse a receptores' }, answer: ['A'], explanation: 'Un agonista se une a un receptor y desencadena la respuesta biológica asociada; un antagonista ocupa el receptor sin activarlo, bloqueando así el efecto de agonistas naturales o exógenos.', domain: 'Farmacodinamia (receptores, agonistas, antagonistas)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el mecanismo de acción general de los antibióticos beta-lactámicos (ej. penicilinas, cefalosporinas)?', options: { A: 'Inhiben la síntesis de la pared celular bacteriana', B: 'Inhiben la síntesis de proteínas bacterianas', C: 'Inhiben la replicación del ADN viral', D: 'Bloquean receptores de dopamina' }, answer: ['A'], explanation: 'Los beta-lactámicos inhiben las enzimas transpeptidasas involucradas en la síntesis de la pared celular bacteriana, causando lisis celular — un mecanismo específico de bacterias (que tienen pared celular), sin afectar células humanas.', domain: 'Antibióticos por familias', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué clase de antihipertensivos actúa bloqueando la enzima convertidora de angiotensina (IECA), reduciendo la formación de angiotensina II?', options: { A: 'Inhibidores de la ECA (ej. enalapril, lisinopril)', B: 'Diuréticos tiazídicos', C: 'Betabloqueadores', D: 'Bloqueadores de canales de calcio' }, answer: ['A'], explanation: 'Los inhibidores de la ECA bloquean la enzima convertidora de angiotensina, reduciendo la formación de angiotensina II (un potente vasoconstrictor), disminuyendo así la presión arterial y la poscarga cardiaca.', domain: 'Antihipertensivos', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre analgésicos AINEs (ej. ibuprofeno) y opioides en su mecanismo de acción?', options: { A: 'Los AINEs inhiben la enzima ciclooxigenasa (COX), reduciendo la síntesis de prostaglandinas; los opioides actúan sobre receptores opioides del sistema nervioso central, modulando la percepción del dolor', B: 'Son exactamente el mismo mecanismo de acción', C: 'Los AINEs actúan sobre receptores opioides', D: 'Los opioides no tienen ningún mecanismo relacionado con el dolor' }, answer: ['A'], explanation: 'Los AINEs bloquean la COX, reduciendo la síntesis de prostaglandinas responsables de inflamación/dolor periférico; los opioides actúan centralmente sobre receptores opioides (mu, kappa, delta), modulando la percepción y transmisión del dolor a nivel del sistema nervioso central.', domain: 'Analgésicos (AINEs, opioides)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué clase de psicofármacos se usa como primera línea en el tratamiento de la depresión mayor y ansiedad, actuando principalmente sobre la recaptación de serotonina?', options: { A: 'ISRS (Inhibidores Selectivos de la Recaptación de Serotonina)', B: 'Antipsicóticos típicos', C: 'Benzodiacepinas exclusivamente', D: 'Antiepilépticos exclusivamente' }, answer: ['A'], explanation: 'Los ISRS (ej. sertralina, fluoxetina) son la primera línea de tratamiento farmacológico para depresión mayor y varios trastornos de ansiedad, actuando al bloquear la recaptación de serotonina en la hendidura sináptica, aumentando su disponibilidad.', domain: 'Psicofármacos básicos', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es una "interacción farmacocinética" entre dos medicamentos?', options: { A: 'Cuando un fármaco altera la absorción, distribución, metabolismo o excreción de otro, cambiando su concentración plasmática efectiva', B: 'Cuando dos fármacos tienen el mismo color de presentación', C: 'Un sinónimo de efecto secundario aislado de un solo fármaco', D: 'Solo ocurre cuando ambos fármacos se administran por la misma vía' }, answer: ['A'], explanation: 'Una interacción farmacocinética ocurre cuando un fármaco afecta alguno de los procesos ADME de otro (ej. inhibiendo su metabolismo hepático), alterando su concentración plasmática y por tanto su efecto — distinta de una interacción farmacodinámica, donde ambos fármacos actúan sobre el mismo sistema/receptor.', domain: 'Interacciones medicamentosas frecuentes', difficulty: 'hard' },
      { type: 'multiple', question: '¿Por qué la combinación de warfarina con antiinflamatorios no esteroideos (AINEs) representa un riesgo clínico relevante?', options: { A: 'No representa ningún riesgo adicional', B: 'Ambos aumentan el riesgo de sangrado por mecanismos distintos (warfarina anticoagula, los AINEs afectan la función plaquetaria e irritan la mucosa gástrica), potenciando el riesgo hemorrágico combinado', C: 'Los AINEs eliminan completamente el efecto anticoagulante de la warfarina', D: 'Solo representa riesgo en pacientes pediátricos' }, answer: ['B'], explanation: 'La warfarina anticoagula inhibiendo factores de coagulación dependientes de vitamina K, mientras los AINEs afectan la agregación plaquetaria e irritan la mucosa gástrica; combinados, aumentan significativamente el riesgo de sangrado, especialmente gastrointestinal.', domain: 'Interacciones medicamentosas frecuentes', difficulty: 'hard' },
    ],
  },
  {
    slug: 'enfermeria-clinica-basica',
    title: 'Enfermería Clínica Básica',
    description: 'Examen de práctica sobre cuidados básicos, signos vitales, administración segura de medicamentos y bioseguridad.',
    domain: 'health', category: 'nursing', level: 'beginner', language: 'es',
    tags: ['enfermeria', 'clinica'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en Fundamentals of Nursing — Potter & Perry (10th Ed) (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuáles son los "5 correctos" clásicos de la administración segura de medicamentos?', options: { A: 'Paciente correcto, medicamento correcto, dosis correcta, vía correcta, hora correcta', B: 'Nombre, edad, peso, altura, presión arterial', C: 'Color, sabor, tamaño, forma, precio', D: 'Diagnóstico, tratamiento, pronóstico, seguimiento, alta' }, answer: ['A'], explanation: 'Los 5 correctos (a menudo extendidos a más) son un checklist de seguridad fundamental antes de administrar cualquier medicamento: paciente correcto, medicamento correcto, dosis correcta, vía correcta y hora correcta.', domain: 'Vías de administración de medicamentos (5 correctos)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el rango normal de frecuencia respiratoria en un adulto en reposo?', options: { A: '4-8 respiraciones por minuto', B: '12-20 respiraciones por minuto', C: '30-40 respiraciones por minuto', D: '50-60 respiraciones por minuto' }, answer: ['B'], explanation: 'El rango normal de frecuencia respiratoria en un adulto en reposo es de 12 a 20 respiraciones por minuto; valores fuera de este rango (taquipnea o bradipnea) deben investigarse.', domain: 'Toma e interpretación de signos vitales', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es la saturación de oxígeno (SpO2) y cuál es su rango normal en una persona sana a nivel del mar?', options: { A: 'El porcentaje de hemoglobina saturada con oxígeno, con un rango normal de 95-100%', B: 'La presión arterial de oxígeno en la sangre venosa', C: 'Un sinónimo de frecuencia respiratoria', D: 'Un valor que siempre debe ser exactamente 100%' }, answer: ['A'], explanation: 'La SpO2, medida por pulsioximetría, indica el porcentaje de hemoglobina saturada con oxígeno; el rango normal en una persona sana a nivel del mar es aproximadamente 95-100%, con valores menores indicando posible hipoxemia.', domain: 'Toma e interpretación de signos vitales', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre "precauciones estándar" y "precauciones basadas en la transmisión" en control de infecciones?', options: { A: 'Las precauciones estándar (higiene de manos, EPP según exposición) se aplican SIEMPRE con todos los pacientes; las precauciones basadas en la transmisión (contacto, gotas, aéreas) se AÑADEN según el patógeno específico sospechado/confirmado', B: 'Son exactamente lo mismo', C: 'Las precauciones basadas en la transmisión reemplazan siempre a las estándar', D: 'Las precauciones estándar solo se aplican a pacientes con infecciones confirmadas' }, answer: ['A'], explanation: 'Las precauciones estándar se aplican universalmente a todos los pacientes independientemente de su diagnóstico; las precauciones basadas en la transmisión (contacto, gotas, aéreas) se agregan específicamente según el patógeno sospechado o confirmado, complementando (no reemplazando) a las estándar.', domain: 'Aislamientos y precauciones estándar', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué escala se usa comúnmente para clasificar la severidad de una úlcera por presión según la profundidad del tejido afectado?', options: { A: 'Escala de estadificación de úlceras por presión (Etapas I-IV, más lesión de tejido profundo y no clasificable)', B: 'Escala de Glasgow', C: 'Escala de Apgar', D: 'Escala visual analógica del dolor' }, answer: ['A'], explanation: 'Las úlceras por presión se clasifican en etapas (I a IV) según la profundidad del daño tisular, desde eritema no blanqueable (Etapa I) hasta pérdida total del espesor con exposición de hueso/músculo (Etapa IV), además de categorías especiales.', domain: 'Manejo de heridas y úlceras por presión', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "balance hídrico" y por qué es relevante monitorearlo en pacientes hospitalizados?', options: { A: 'La comparación entre el total de líquidos que ingresan (ingesta oral, IV) y los que egresan (orina, drenajes, pérdidas insensibles) del paciente, ayudando a detectar sobrecarga o deshidratación', B: 'Un sinónimo de presión arterial', C: 'Solo relevante en pacientes pediátricos', D: 'Un cálculo que solo se realiza al ingreso hospitalario, una sola vez' }, answer: ['A'], explanation: 'El balance hídrico compara la ingesta total de líquidos con las pérdidas (orina, drenajes, vómito, pérdidas insensibles), siendo una herramienta clínica clave para detectar tempranamente sobrecarga de volumen o deshidratación en pacientes con riesgo (ej. insuficiencia renal, cardiaca).', domain: 'Balance hídrico', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué es importante que el registro clínico de enfermería sea objetivo, oportuno y completo?', options: { A: 'No es realmente importante mientras el paciente reciba buen cuidado', B: 'Porque es un documento legal que refleja la atención brindada, facilita la continuidad del cuidado entre turnos y profesionales, y puede usarse como evidencia en procesos legales', C: 'Solo se usa para fines administrativos de facturación', D: 'El registro clínico solo es responsabilidad del médico, no de enfermería' }, answer: ['B'], explanation: 'El registro clínico de enfermería es tanto un documento legal (evidencia de la atención brindada) como una herramienta de comunicación esencial para la continuidad del cuidado entre distintos turnos y profesionales de salud.', domain: 'Registros clínicos', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la vía de administración de medicamentos que logra el inicio de acción más rápido, al evitar por completo los procesos de absorción?', options: { A: 'Vía oral', B: 'Vía intravenosa (IV)', C: 'Vía tópica', D: 'Vía subcutánea' }, answer: ['B'], explanation: 'La vía IV administra el medicamento directamente al torrente sanguíneo, evitando por completo el proceso de absorción y logrando el inicio de acción más rápido entre las vías comunes de administración.', domain: 'Vías de administración de medicamentos (5 correctos)', difficulty: 'easy' },
    ],
  },
  {
    slug: 'nclex-rn-fundamentos',
    title: 'NCLEX-RN — Fundamentos',
    description: 'Examen de práctica alineado a las 4 categorías de Client Needs del NCLEX-RN 2026 Test Plan: cuidado seguro, promoción de la salud, integridad psicosocial y fisiológica.',
    domain: 'health', category: 'nursing', level: 'advanced', language: 'es',
    tags: ['nclex', 'rn', 'enfermeria'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en NCSBN 2026 NCLEX-RN Test Plan, vigente desde abr-2026 (idéntico en estructura y porcentajes al plan 2023) — ncsbn.org/nclex (contenido original)',
    questions: [
      { type: 'multiple', question: 'Una enfermera debe decidir a qué paciente atender primero entre varios con distintas necesidades. ¿Qué principio de la categoría "Management of Care" guía esta decisión?', options: { A: 'Atender siempre al paciente que llegó primero, sin importar la gravedad', B: 'Priorización según la urgencia clínica y el riesgo para la vida/estabilidad del paciente, usando marcos como el ABC (vía aérea, respiración, circulación)', C: 'Atender siempre al paciente con la habitación más cercana', D: 'La priorización no es relevante en enfermería' }, answer: ['B'], explanation: 'La priorización de cuidados se basa en la urgencia clínica real, frecuentemente guiada por el marco ABC (Airway-Breathing-Circulation) y otros modelos de triage, no en el orden de llegada o conveniencia logística.', domain: 'Management of Care', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué implica el concepto de "delegación" de enfermería, y qué NO se puede delegar a un asistente de enfermería (CNA/UAP)?', options: { A: 'Delegar es asignar una tarea a otro miembro del equipo dentro de su alcance de práctica; la valoración de enfermería, el juicio clínico y la planificación del cuidado NO son delegables a personal no licenciado', B: 'Se puede delegar absolutamente cualquier tarea a cualquier miembro del equipo sin restricción', C: 'La delegación es un concepto exclusivo de la administración hospitalaria, sin relación con el cuidado directo', D: 'Solo los médicos pueden delegar tareas' }, answer: ['A'], explanation: 'La delegación efectiva asigna tareas dentro del alcance de práctica del receptor (ej. tareas rutinarias de cuidado a un CNA), pero la valoración de enfermería, el juicio clínico y la planificación del cuidado requieren el criterio de un profesional de enfermería licenciado y no son delegables.', domain: 'Management of Care', difficulty: 'medium' },
      { type: 'multiple', question: 'Según la categoría "Safety and Infection Prevention and Control" (renombrada en el 2026 Test Plan), ¿qué acción reduce el riesgo de caídas en un paciente hospitalizado de alto riesgo?', options: { A: 'Dejar la cama en posición elevada sin barandales', B: 'Mantener la cama en posición baja, barandales según protocolo, timbre de llamada al alcance, y evaluación regular del riesgo de caídas', C: 'Restringir físicamente a todos los pacientes de alto riesgo sin evaluación individual', D: 'No es necesaria ninguna intervención preventiva específica' }, answer: ['B'], explanation: 'La prevención de caídas incluye medidas ambientales (cama baja, barandales según protocolo individualizado, timbre accesible) y evaluación continua del riesgo, evitando tanto la negligencia como restricciones físicas innecesarias no individualizadas.', domain: 'Safety and Infection Prevention and Control', difficulty: 'easy' },
      { type: 'multiple', question: 'Un paciente pregunta sobre las vacunas recomendadas para adultos mayores. ¿A qué categoría de Client Needs corresponde principalmente esta intervención de enfermería?', options: { A: 'Health Promotion and Maintenance', B: 'Psychosocial Integrity exclusivamente', C: 'Safety and Infection Prevention and Control exclusivamente, sin relación con promoción de salud', D: 'Management of Care exclusivamente' }, answer: ['A'], explanation: 'La educación sobre inmunizaciones y prevención (screening, estilo de vida saludable según etapa del ciclo vital) corresponde principalmente a la categoría Health Promotion and Maintenance del test plan de NCLEX-RN.', domain: 'Health Promotion and Maintenance', difficulty: 'easy' },
      { type: 'multiple', question: 'Un paciente expresa ansiedad intensa antes de una cirugía mayor. ¿Qué intervención de enfermería corresponde principalmente a la categoría "Psychosocial Integrity"?', options: { A: 'Escuchar activamente las preocupaciones del paciente, validar sus emociones y proporcionar información clara sobre el procedimiento para reducir la incertidumbre', B: 'Ignorar la ansiedad y proceder directamente con el protocolo preoperatorio estándar', C: 'Sedar inmediatamente al paciente sin ninguna conversación previa', D: 'Delegar completamente el manejo emocional a un familiar' }, answer: ['A'], explanation: 'La categoría Psychosocial Integrity aborda el bienestar emocional, mental y social del paciente; escuchar activamente, validar emociones y proveer información clara son intervenciones de enfermería estándar para el manejo de ansiedad preoperatoria.', domain: 'Psychosocial Integrity', difficulty: 'medium' },
      { type: 'multiple', question: 'Dentro de la categoría "Physiological Integrity", ¿qué subcategoría cubre la administración segura de medicamentos y terapias intravenosas?', options: { A: 'Pharmacological and Parenteral Therapies', B: 'Basic Care and Comfort exclusivamente', C: 'Reduction of Risk Potential exclusivamente', D: 'Physiological Adaptation exclusivamente' }, answer: ['A'], explanation: 'La subcategoría "Pharmacological and Parenteral Therapies" (dentro de Physiological Integrity, con peso de 12-18% en el test plan) cubre específicamente la administración segura de medicamentos, terapias IV y monitoreo de efectos terapéuticos/adversos.', domain: 'Physiological Integrity (terapias farmacológicas y parenterales)', difficulty: 'medium' },
      { type: 'multiple', question: 'Un paciente postoperatorio presenta signos tempranos de shock hipovolémico. ¿A qué subcategoría de Physiological Integrity corresponde principalmente la intervención de enfermería en este escenario?', options: { A: 'Physiological Adaptation (manejo de alteraciones agudas/crónicas que amenazan la vida)', B: 'Basic Care and Comfort exclusivamente', C: 'Health Promotion and Maintenance', D: 'Management of Care exclusivamente' }, answer: ['A'], explanation: 'El manejo de complicaciones fisiológicas agudas que amenazan la vida (como el shock hipovolémico) corresponde a la subcategoría "Physiological Adaptation" dentro de Physiological Integrity, con un peso significativo (11-17%) en el test plan.', domain: 'Physiological Integrity (adaptación fisiológica)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué intervención corresponde a la subcategoría "Basic Care and Comfort" de Physiological Integrity?', options: { A: 'Asistir con el posicionamiento, higiene, nutrición y manejo no farmacológico del dolor de un paciente', B: 'Administrar quimioterapia intravenosa', C: 'Interpretar resultados de laboratorio complejos', D: 'Realizar un procedimiento quirúrgico' }, answer: ['A'], explanation: 'Basic Care and Comfort cubre las necesidades básicas de cuidado y confort del paciente: posicionamiento, higiene, nutrición, movilidad y manejo no farmacológico del dolor, entre otras intervenciones fundamentales de enfermería.', domain: 'Physiological Integrity (cuidados básicos)', difficulty: 'easy' },
      { type: 'multiple', question: 'Al detectar un valor de laboratorio crítico (ej. potasio sérico muy elevado) en un paciente, ¿qué principio de "Reduction of Risk Potential" debe aplicar la enfermera?', options: { A: 'Ignorar el valor hasta la siguiente ronda de laboratorios programada', B: 'Reconocer la anormalidad, evaluar al paciente clínicamente, y notificar oportunamente al proveedor responsable según el protocolo de valores críticos', C: 'Administrar potasio adicional sin verificar el contexto clínico', D: 'Delegar la interpretación del resultado a personal no licenciado' }, answer: ['B'], explanation: 'La subcategoría "Reduction of Risk Potential" (9-15% del examen) incluye reconocer resultados de laboratorio anormales/críticos, correlacionarlos con el estado clínico del paciente y notificar oportunamente, previniendo complicaciones potenciales.', domain: 'Physiological Integrity (reducción de riesgo)', difficulty: 'medium' },
    ],
  },
  {
    slug: 'nutricion-clinica-basica',
    title: 'Nutrición Clínica Básica',
    description: 'Examen de práctica sobre valoración nutricional, dietoterapia en patologías crónicas y soporte nutricional especializado.',
    domain: 'health', category: 'nutrition', level: 'intermediate', language: 'es',
    tags: ['nutricion', 'clinica', 'dietoterapia'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en ASPEN Clinical Guidelines + Krause\'s Food & the Nutrition Care Process (15th Ed) (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué mide el Índice de Masa Corporal (IMC) y cuál es una limitación reconocida de este indicador?', options: { A: 'Estima la relación peso/talla como proxy de adiposidad, pero no distingue entre masa grasa y masa muscular, pudiendo clasificar erróneamente a personas muy musculosas como "sobrepeso"', B: 'Mide directamente el porcentaje de grasa corporal con total precisión', C: 'Es la única medida necesaria para una valoración nutricional completa', D: 'Solo es válido en niños, nunca en adultos' }, answer: ['A'], explanation: 'El IMC (peso/talla²) es un indicador poblacional útil pero limitado, ya que no distingue composición corporal (grasa vs. músculo); una persona muy musculosa puede tener un IMC "elevado" sin exceso real de grasa corporal.', domain: 'Valoración nutricional (antropometría, bioquímica, dietética)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué marcador bioquímico se usa comúnmente (con limitaciones) para evaluar el estado de las proteínas viscerales en la valoración nutricional?', options: { A: 'Albúmina sérica', B: 'Glucosa en ayunas', C: 'Colesterol total', D: 'Hemoglobina glicosilada' }, answer: ['A'], explanation: 'La albúmina sérica se usa como marcador de proteínas viscerales, aunque tiene limitaciones importantes (vida media larga, se afecta por inflamación/hidratación, no exclusivo del estado nutricional), por lo que debe interpretarse en conjunto con otros datos clínicos.', domain: 'Valoración nutricional (antropometría, bioquímica, dietética)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué recomendación dietética general es apropiada para un paciente con diabetes tipo 2 en cuanto a carbohidratos?', options: { A: 'Eliminar completamente todos los carbohidratos de la dieta', B: 'Priorizar carbohidratos complejos con fibra, controlar las porciones y distribuir la ingesta a lo largo del día, en vez de eliminar el grupo completo', C: 'Consumir únicamente azúcares simples en cualquier cantidad', D: 'No existe ninguna consideración dietética especial para diabetes' }, answer: ['B'], explanation: 'El manejo dietético de la diabetes tipo 2 no elimina los carbohidratos por completo, sino que prioriza fuentes complejas con fibra (que enlentecen la absorción de glucosa), controla porciones y distribuye la ingesta, evitando picos glucémicos abruptos.', domain: 'Dietoterapia en diabetes, hipertensión, ERC, hepatopatía', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué recomendación dietética es central en el manejo nutricional de la hipertensión arterial?', options: { A: 'Reducir la ingesta de sodio y seguir un patrón dietético rico en frutas, verduras y lácteos bajos en grasa (ej. dieta DASH)', B: 'Aumentar significativamente la ingesta de sodio', C: 'Eliminar completamente el consumo de agua', D: 'No existe ninguna relación entre dieta e hipertensión' }, answer: ['A'], explanation: 'La reducción de sodio y patrones dietéticos como DASH (Dietary Approaches to Stop Hypertension, rico en frutas, verduras y lácteos bajos en grasa) tienen evidencia sólida en la reducción de la presión arterial.', domain: 'Dietoterapia en diabetes, hipertensión, ERC, hepatopatía', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué se restringe habitualmente el potasio y el fósforo en la dieta de pacientes con enfermedad renal crónica (ERC) avanzada?', options: { A: 'Porque riñones con función reducida no pueden excretar adecuadamente estos electrolitos, pudiendo acumularse a niveles peligrosos (ej. hiperkalemia con riesgo de arritmias)', B: 'No existe ninguna razón clínica real para esta restricción', C: 'Porque el potasio y fósforo son tóxicos para cualquier persona en cualquier cantidad', D: 'Solo se restringen en niños con ERC, no en adultos' }, answer: ['A'], explanation: 'En la ERC avanzada, la capacidad renal reducida de excretar potasio y fósforo puede llevar a su acumulación peligrosa (la hiperkalemia puede causar arritmias fatales), por lo que la restricción dietética es una estrategia central de manejo.', domain: 'Dietoterapia en diabetes, hipertensión, ERC, hepatopatía', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la nutrición enteral y en qué se diferencia de la parenteral?', options: { A: 'La nutrición enteral administra nutrientes directamente al tracto gastrointestinal (vía sonda), aprovechando la función digestiva; la parenteral administra nutrientes directamente al torrente sanguíneo, evitando el tracto GI', B: 'Son exactamente lo mismo', C: 'La nutrición parenteral siempre es preferible a la enteral en cualquier escenario clínico', D: 'La nutrición enteral solo puede administrarse por vía oral' }, answer: ['A'], explanation: 'La nutrición enteral usa el tracto gastrointestinal (vía oral o sonda) para administrar nutrientes, siendo la opción preferida cuando el tracto GI funciona ("si el intestino funciona, úsalo"); la parenteral (IV) se reserva para cuando el tracto GI no es funcional o accesible.', domain: 'Soporte nutricional enteral y parenteral', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué se prefiere la nutrición enteral sobre la parenteral cuando el tracto gastrointestinal del paciente es funcional?', options: { A: 'La enteral es siempre más costosa y por eso se evita', B: 'La enteral preserva mejor la integridad de la mucosa intestinal, tiene menor riesgo de infecciones asociadas a catéteres, y es fisiológicamente más similar a la alimentación normal', C: 'No existe ninguna ventaja real de la nutrición enteral sobre la parenteral', D: 'La parenteral siempre tiene menos complicaciones que la enteral' }, answer: ['B'], explanation: 'Cuando el tracto GI funciona, la nutrición enteral se prefiere porque preserva la integridad de la mucosa intestinal (reduciendo translocación bacteriana), tiene menor riesgo de complicaciones infecciosas asociadas a catéteres centrales, y es más fisiológica que la vía parenteral.', domain: 'Soporte nutricional enteral y parenteral', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué los requerimientos energéticos y proteicos suelen aumentar significativamente en pacientes de cirugía mayor o trauma?', options: { A: 'No aumentan en absoluto en estos escenarios', B: 'El estrés metabólico (respuesta inflamatoria, catabolismo aumentado) eleva las demandas energéticas y proteicas para apoyar la cicatrización de heridas y la respuesta inmune', C: 'Los requerimientos disminuyen siempre después de una cirugía', D: 'Solo aumentan los requerimientos de grasas, nunca de proteínas' }, answer: ['B'], explanation: 'El trauma y la cirugía mayor desencadenan una respuesta de estrés metabólico con catabolismo proteico aumentado; cubrir adecuadamente las demandas energéticas y proteicas elevadas apoya la cicatrización de heridas y la respuesta inmune, reduciendo complicaciones.', domain: 'Requerimientos en cirugía y trauma', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "malnutrición hospitalaria" y por qué es un problema clínico relevante frecuentemente subdiagnosticado?', options: { A: 'El deterioro del estado nutricional que ocurre o se agrava durante la hospitalización, asociado a mayor estancia hospitalaria, complicaciones e infecciones, pero que a menudo no se detecta sistemáticamente si no se realiza tamizaje nutricional', B: 'Un problema que solo ocurre en países de bajos ingresos', C: 'Un término sin ninguna relevancia clínica real', D: 'Solo afecta a pacientes pediátricos hospitalizados' }, answer: ['A'], explanation: 'La malnutrición hospitalaria (frecuente incluso en países desarrollados) se asocia a mayor estancia hospitalaria, tasas de complicaciones e infecciones, pero a menudo pasa desapercibida si no existe un protocolo sistemático de tamizaje nutricional al ingreso.', domain: 'Malnutrición hospitalaria', difficulty: 'medium' },
    ],
  },
  {
    slug: 'salud-mental-basica',
    title: 'Salud Mental Básica',
    description: 'Examen de práctica sobre trastornos comunes de salud mental, primeros auxilios psicológicos y evaluación de riesgo suicida.',
    domain: 'health', category: 'mental-health', level: 'beginner', language: 'es',
    tags: ['salud-mental', 'primeros-auxilios-psicologicos'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en DSM-5-TR (APA 2022) + OMS CIE-11 (capítulo de trastornos mentales) (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es un criterio central para el diagnóstico de un episodio depresivo mayor según DSM-5-TR?', options: { A: 'Presencia de estado de ánimo deprimido y/o pérdida de interés/placer (anhedonia) casi todos los días durante al menos 2 semanas, junto con otros síntomas asociados que afecten el funcionamiento', B: 'Un solo día de tristeza es suficiente para el diagnóstico', C: 'Solo se diagnostica si hay antecedentes familiares confirmados', D: 'El diagnóstico requiere obligatoriamente hospitalización' }, answer: ['A'], explanation: 'El DSM-5-TR requiere la presencia de ánimo deprimido y/o anhedonia (pérdida de interés/placer) casi a diario durante al menos 2 semanas, junto con otros síntomas asociados (sueño, apetito, concentración, energía) que causen malestar o deterioro funcional significativo.', domain: 'Trastornos depresivos y de ansiedad (síntomas DSM-5/CIE-11)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué caracteriza al Trastorno de Ansiedad Generalizada (TAG)?', options: { A: 'Preocupación excesiva y difícil de controlar sobre múltiples áreas de la vida, presente la mayoría de los días durante al menos 6 meses, acompañada de síntomas físicos como tensión muscular o inquietud', B: 'Miedo intenso exclusivamente a un objeto o situación específica, como arañas o alturas', C: 'Episodios recurrentes de pánico exclusivamente en espacios cerrados', D: 'Un diagnóstico que solo aplica a niños' }, answer: ['A'], explanation: 'El TAG se caracteriza por preocupación excesiva y difícil de controlar sobre múltiples esferas (trabajo, salud, relaciones), persistente la mayoría de los días durante al menos 6 meses, con síntomas físicos asociados (tensión, fatiga, irritabilidad, alteraciones del sueño).', domain: 'Trastornos depresivos y de ansiedad (síntomas DSM-5/CIE-11)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué patrón de consumo caracteriza a un "trastorno por uso de sustancias" según el enfoque dimensional del DSM-5?', options: { A: 'Un patrón problemático de consumo que causa deterioro o malestar clínicamente significativo, evaluado en un espectro de severidad (leve, moderado, grave) según el número de criterios presentes, en vez de una categoría binaria de "adicto" o "no adicto"', B: 'Cualquier consumo de sustancias, sin importar la frecuencia o consecuencias', C: 'Solo se considera un trastorno si la persona consume diariamente', D: 'Un diagnóstico que no considera ningún criterio clínico específico' }, answer: ['A'], explanation: 'El DSM-5 reemplazó la distinción binaria previa (abuso/dependencia) por un enfoque dimensional de severidad (leve/moderado/grave) según el número de criterios diagnósticos presentes, reconociendo que el uso problemático de sustancias existe en un espectro.', domain: 'Trastornos por uso de sustancias', difficulty: 'hard' },
      { type: 'multiple', question: 'Al evaluar el riesgo suicida de una persona, ¿qué elemento es más indicativo de mayor riesgo inmediato?', options: { A: 'La persona menciona pensamientos de muerte de forma vaga y ocasional', B: 'La persona tiene un plan específico, medios disponibles para llevarlo a cabo, y ha fijado un momento/lugar concreto', C: 'La persona nunca ha hablado del tema', D: 'La persona tiene una red de apoyo social activa' }, answer: ['B'], explanation: 'La presencia de un plan específico, acceso a los medios para ejecutarlo y un momento/lugar concreto elevan significativamente el riesgo inmediato, en comparación con ideación pasiva o vaga sin plan estructurado.', domain: 'Riesgo suicida y evaluación', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué acción es apropiada al identificar que alguien tiene riesgo suicida inminente (plan específico, medios disponibles)?', options: { A: 'No hacer nada y esperar a que la persona lo mencione espontáneamente de nuevo', B: 'Mantenerse cerca de la persona (no dejarla sola), retirar el acceso a los medios letales si es posible, y buscar ayuda profesional/de emergencia inmediatamente', C: 'Prometer guardar el secreto absoluto sin buscar ayuda de nadie más', D: 'Minimizar la situación diciéndole que "todo va a estar bien" sin ninguna acción adicional' }, answer: ['B'], explanation: 'Ante riesgo suicida inminente, se debe mantener a la persona acompañada, restringir el acceso a medios letales cuando sea posible, y buscar ayuda profesional/de emergencia de inmediato — nunca prometer confidencialidad absoluta que impida buscar ayuda ante un riesgo vital.', domain: 'Riesgo suicida y evaluación', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué son los "primeros auxilios psicológicos" (PAP) y en qué se diferencian de una intervención psicoterapéutica formal?', options: { A: 'Un conjunto de habilidades básicas de apoyo humano inmediato (escuchar, dar seguridad, conectar con recursos) proporcionado a personas en crisis por personal entrenado, no necesariamente profesional de salud mental, sin sustituir el tratamiento especializado', B: 'Un sinónimo exacto de psicoterapia formal a largo plazo', C: 'Un procedimiento exclusivamente farmacológico', D: 'Solo pueden aplicarlos psiquiatras certificados' }, answer: ['A'], explanation: 'Los primeros auxilios psicológicos son un apoyo humano inmediato y práctico (escuchar sin juzgar, dar seguridad, conectar con recursos) que puede ser proporcionado por personal entrenado no necesariamente especializado, en el momento inmediato de una crisis, sin reemplazar el tratamiento psicoterapéutico formal posterior si es necesario.', domain: 'Primeros auxilios psicológicos', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuándo es apropiado derivar a un paciente a un especialista en salud mental (psiquiatra/psicólogo clínico)?', options: { A: 'Nunca es necesario derivar, cualquier profesional puede manejar cualquier condición de salud mental', B: 'Cuando los síntomas son severos, persistentes, hay riesgo para la vida (ej. ideación suicida activa), o el caso excede la competencia/alcance del profesional que realiza la primera evaluación', C: 'Solo cuando el paciente lo solicita explícitamente por escrito', D: 'Solo en casos de trastornos psicóticos, nunca en depresión o ansiedad' }, answer: ['B'], explanation: 'La derivación a un especialista es apropiada cuando los síntomas son severos, persistentes, hay riesgo para la vida, o el caso excede el alcance de práctica del profesional que hace la evaluación inicial — un principio de seguridad del paciente y práctica ética.', domain: 'Derivación a especialista', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "estigma" en salud mental y cómo puede afectar la búsqueda de ayuda de una persona?', options: { A: 'Actitudes negativas y estereotipos sociales hacia las personas con trastornos mentales, que pueden generar vergüenza o miedo al juicio, retrasando o impidiendo que la persona busque ayuda profesional', B: 'Un término médico exclusivo para describir síntomas físicos', C: 'El estigma no tiene ningún impacto real en el comportamiento de búsqueda de ayuda', D: 'Un sinónimo de diagnóstico clínico' }, answer: ['A'], explanation: 'El estigma social hacia la salud mental (estereotipos, discriminación, vergüenza asociada) es una barrera documentada que retrasa o impide que las personas busquen ayuda profesional oportuna, siendo un objetivo central de las campañas de concientización en salud mental.', domain: 'Mitos y estigma', difficulty: 'easy' },
    ],
  },
  {
    slug: 'ecg-interpretacion-basica',
    title: 'ECG — Interpretación Básica',
    description: 'Examen de práctica sobre lectura sistemática del electrocardiograma de 12 derivaciones y reconocimiento de arritmias frecuentes.',
    domain: 'health', category: 'cardiology', level: 'intermediate', language: 'es',
    tags: ['ecg', 'arritmias', 'cardiologia'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en AHA/ACC ECG Interpretation Guidelines + Dubin\'s Rapid Interpretation of EKGs (7th Ed) (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué estructura del sistema de conducción cardiaca genera normalmente el impulso eléctrico que inicia cada latido?', options: { A: 'El nodo sinoauricular (SA)', B: 'El nodo auriculoventricular (AV)', C: 'El haz de His', D: 'Las fibras de Purkinje' }, answer: ['A'], explanation: 'El nodo sinoauricular (SA), ubicado en la aurícula derecha, es el marcapasos natural del corazón, generando el impulso eléctrico que inicia normalmente cada ciclo cardiaco a una frecuencia de 60-100 lpm.', domain: 'Sistema de conducción cardiaca', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué representa la onda P en un trazado de ECG?', options: { A: 'La despolarización ventricular', B: 'La despolarización auricular', C: 'La repolarización ventricular', D: 'El intervalo entre latidos' }, answer: ['B'], explanation: 'La onda P representa la despolarización (activación eléctrica) de las aurículas, siendo el primer componente visible de un ciclo cardiaco normal en el ECG.', domain: 'Lectura sistemática del ECG (frecuencia, ritmo, eje, intervalos)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué representa el complejo QRS en un ECG?', options: { A: 'La despolarización auricular', B: 'La despolarización ventricular', C: 'La repolarización auricular', D: 'La pausa entre latidos' }, answer: ['B'], explanation: 'El complejo QRS representa la despolarización de los ventrículos, un evento eléctrico de mayor amplitud debido a la mayor masa muscular ventricular comparada con las aurículas.', domain: 'Lectura sistemática del ECG (frecuencia, ritmo, eje, intervalos)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué representa la onda T en el ECG?', options: { A: 'La repolarización ventricular', B: 'La despolarización ventricular', C: 'La despolarización auricular', D: 'Un artefacto sin significado fisiológico' }, answer: ['A'], explanation: 'La onda T representa la repolarización ventricular (el "reseteo" eléctrico de los ventrículos tras la contracción), y sus cambios de morfología pueden indicar isquemia u otras alteraciones.', domain: 'Lectura sistemática del ECG (frecuencia, ritmo, eje, intervalos)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el enfoque sistemático recomendado para leer un ECG de 12 derivaciones, evaluando de forma ordenada?', options: { A: 'Frecuencia, ritmo, eje, intervalos (PR, QRS, QT), morfología de ondas, y cambios de ST/T sugestivos de isquemia', B: 'Solo mirar la frecuencia cardiaca, ignorando el resto de los componentes', C: 'Leer el ECG de derecha a izquierda sin ningún orden sistemático', D: 'Evaluar únicamente el color del papel del ECG' }, answer: ['A'], explanation: 'Una lectura sistemática de ECG sigue un orden estructurado: frecuencia, ritmo (regular/irregular, origen sinusal o no), eje eléctrico, intervalos (PR, QRS, QT), morfología de las ondas, y finalmente cambios de segmento ST/onda T sugestivos de isquemia — evitando pasar por alto hallazgos relevantes.', domain: 'Lectura sistemática del ECG (frecuencia, ritmo, eje, intervalos)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué caracteriza a la Fibrilación Auricular (FA) en el ECG?', options: { A: 'Ritmo auricular irregularmente irregular, ausencia de ondas P discretas (reemplazadas por actividad fibrilatoria caótica), y respuesta ventricular variable', B: 'Un ritmo perfectamente regular con ondas P normales', C: 'Ausencia total de actividad eléctrica cardiaca', D: 'Complejos QRS anchos exclusivamente' }, answer: ['A'], explanation: 'La FA se caracteriza por un ritmo "irregularmente irregular" (sin patrón predecible entre latidos), ausencia de ondas P organizadas (reemplazadas por ondulaciones fibrilatorias caóticas), y una respuesta ventricular de frecuencia variable.', domain: 'Arritmias supraventriculares (FA, flutter, TSV)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué caracteriza al flutter auricular en el ECG, en su patrón clásico?', options: { A: 'Ondas de flutter con patrón característico "en dientes de sierra" (sawtooth), frecuentemente con conducción AV regular (ej. 2:1, 3:1)', B: 'Ausencia total de actividad auricular organizada', C: 'Un ritmo idéntico visualmente a la fibrilación auricular, sin ninguna diferencia', D: 'Complejos QRS con morfología siempre anormal' }, answer: ['A'], explanation: 'A diferencia de la FA (caótica), el flutter auricular presenta actividad auricular organizada con el clásico patrón "en dientes de sierra" en derivaciones inferiores, y frecuentemente una conducción AV regular con proporciones fijas (ej. 2:1).', domain: 'Arritmias supraventriculares (FA, flutter, TSV)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué caracteriza a la Taquicardia Ventricular (TV) en el ECG?', options: { A: 'Complejos QRS anchos (>120 ms) a frecuencia rápida (típicamente >100 lpm), de origen ventricular sin relación con ondas P normales', B: 'Complejos QRS estrechos con ondas P normales precediendo cada complejo', C: 'Un ritmo lento (<60 lpm) con QRS estrecho', D: 'Ausencia total de complejos QRS' }, answer: ['A'], explanation: 'La TV se caracteriza por complejos QRS anchos (originados en el ventrículo, sin pasar por el sistema de conducción normal) a frecuencia rápida, generalmente sin relación de ondas P normales precediendo cada complejo — una arritmia potencialmente inestable/letal.', domain: 'Arritmias ventriculares', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre un bloqueo AV de primer grado y uno de tercer grado (completo)?', options: { A: 'El de primer grado muestra un intervalo PR prolongado pero constante (toda onda P conduce, solo con retraso); el de tercer grado muestra disociación completa entre ondas P y complejos QRS (ninguna P conduce a los ventrículos)', B: 'Son exactamente lo mismo con distinto nombre', C: 'El bloqueo de primer grado es más peligroso que el de tercer grado', D: 'Ninguno de los dos afecta la conducción AV' }, answer: ['A'], explanation: 'El bloqueo AV de primer grado solo retrasa la conducción (PR prolongado >200ms, pero cada P sigue conduciendo a un QRS); el de tercer grado (completo) presenta disociación total entre la actividad auricular y ventricular, con un ritmo de escape ventricular independiente, siendo clínicamente mucho más grave.', domain: 'Bloqueos AV', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué cambio en el segmento ST del ECG es clásicamente sugestivo de isquemia miocárdica aguda con elevación (IAMCEST)?', options: { A: 'Elevación del segmento ST en derivaciones anatómicamente contiguas, correspondiente al territorio coronario afectado', B: 'Un intervalo PR acortado exclusivamente', C: 'Solo cambios en la onda P, sin ningún cambio en ST', D: 'Un aumento de la frecuencia cardiaca sin ningún otro cambio' }, answer: ['A'], explanation: 'La elevación del segmento ST en derivaciones anatómicamente contiguas (correspondientes a un territorio coronario específico) es el hallazgo clásico del infarto agudo de miocardio con elevación del ST (IAMCEST), indicando oclusión coronaria aguda que requiere reperfusión urgente.', domain: 'Signos de isquemia (ST/T)', difficulty: 'medium' },
    ],
  },
  {
    slug: 'pediatria-basica',
    title: 'Pediatría Básica',
    description: 'Examen de práctica sobre crecimiento, desarrollo, vacunación y patologías pediátricas frecuentes.',
    domain: 'health', category: 'pediatrics', level: 'intermediate', language: 'es',
    tags: ['pediatria', 'niños'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en Nelson Textbook of Pediatrics (21st Ed) + OPS/OMS Guías Clínicas AIEPI (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué herramienta usan los profesionales de salud para monitorear el crecimiento de un niño a lo largo del tiempo, comparándolo con patrones poblacionales de referencia?', options: { A: 'Curvas de crecimiento (percentiles de peso, talla, perímetro cefálico según edad)', B: 'La escala de Glasgow', C: 'El test de Apgar exclusivamente', D: 'La escala de Braden' }, answer: ['A'], explanation: 'Las curvas de crecimiento (ej. de la OMS) grafican percentiles de peso, talla y perímetro cefálico según edad, permitiendo monitorear la trayectoria de crecimiento individual de un niño frente a patrones de referencia poblacional.', domain: 'Crecimiento y desarrollo por etapas', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la recomendación general de la OMS/OPS sobre lactancia materna exclusiva en los primeros meses de vida?', options: { A: 'Lactancia materna exclusiva durante los primeros 6 meses de vida, sin necesidad de agua u otros líquidos adicionales', B: 'Lactancia materna exclusiva durante solo la primera semana', C: 'Nunca se recomienda la lactancia materna exclusiva', D: 'Se recomienda introducir alimentación complementaria desde el nacimiento' }, answer: ['A'], explanation: 'La OMS y OPS recomiendan lactancia materna exclusiva durante los primeros 6 meses de vida (sin necesidad de agua, jugos u otros líquidos), seguida de alimentación complementaria adecuada manteniendo la lactancia hasta los 2 años o más.', domain: 'Lactancia y alimentación complementaria', difficulty: 'easy' },
      { type: 'multiple', question: '¿A partir de qué edad aproximada se recomienda iniciar la alimentación complementaria (introducción de alimentos sólidos) en un lactante, según las guías de la OMS?', options: { A: 'Desde el nacimiento', B: 'Alrededor de los 6 meses de edad, manteniendo la lactancia materna', C: 'Solo después de los 2 años', D: 'A partir de los 12 meses exclusivamente' }, answer: ['B'], explanation: 'La alimentación complementaria se introduce alrededor de los 6 meses, momento en que la lactancia materna exclusiva ya no cubre todas las necesidades nutricionales del lactante en crecimiento, manteniendo la lactancia como complemento importante.', domain: 'Lactancia y alimentación complementaria', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el esquema de vacunación infantil y por qué es importante seguirlo según el calendario recomendado?', options: { A: 'El conjunto y calendario de vacunas recomendadas por edad para proteger al niño contra enfermedades prevenibles; seguir el calendario asegura protección oportuna durante las ventanas de mayor vulnerabilidad', B: 'Un esquema opcional sin ninguna base científica', C: 'Un conjunto de vacunas que solo se aplican una vez en la vida, sin importar la edad', D: 'Un esquema idéntico en todos los países del mundo sin ninguna variación' }, answer: ['A'], explanation: 'El esquema de vacunación está diseñado para proteger a los niños durante las ventanas etarias de mayor vulnerabilidad a enfermedades prevenibles; seguir el calendario recomendado (que puede variar levemente por país) asegura protección inmunológica oportuna.', domain: 'Esquema de vacunación', difficulty: 'easy' },
      { type: 'multiple', question: 'Según el enfoque AIEPI (Atención Integrada a las Enfermedades Prevalentes de la Infancia), ¿qué signos de alarma en un niño con infección respiratoria aguda (IRA) indican derivación urgente?', options: { A: 'Tos leve sin fiebre', B: 'Tiraje subcostal, estridor en reposo, o incapacidad para beber/mamar — signos de dificultad respiratoria severa o compromiso sistémico', C: 'Congestión nasal leve sin otros síntomas', D: 'Ningún signo de una IRA requiere derivación urgente' }, answer: ['B'], explanation: 'El AIEPI identifica signos de peligro específicos en IRA (tiraje subcostal, estridor en reposo, incapacidad de beber, letargia) que indican enfermedad grave y requieren derivación urgente, diferenciándolos de cuadros leves manejables ambulatoriamente.', domain: 'Infecciones respiratorias agudas', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la enfermedad diarreica aguda (EDA) y cuál es su principal riesgo en la población pediátrica?', options: { A: 'Un cuadro de deposiciones líquidas frecuentes de inicio agudo, cuyo principal riesgo es la deshidratación, especialmente peligrosa en lactantes y niños pequeños', B: 'Un término exclusivo para diarrea crónica de más de un año de duración', C: 'Una condición sin ningún riesgo relevante en niños', D: 'Un cuadro que nunca requiere manejo con líquidos' }, answer: ['A'], explanation: 'La EDA se caracteriza por deposiciones líquidas frecuentes de inicio agudo; su principal riesgo es la deshidratación, que puede progresar rápidamente en lactantes/niños pequeños debido a su menor reserva de líquidos corporales.', domain: 'Enfermedad diarreica aguda', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el tratamiento de primera línea para la deshidratación leve a moderada por diarrea en un niño, según las guías AIEPI/OMS?', options: { A: 'Sales de rehidratación oral (SRO), administradas en pequeñas cantidades frecuentes', B: 'Hidratación intravenosa inmediata en todos los casos, sin importar la severidad', C: 'Suspender toda ingesta de líquidos hasta que la diarrea desaparezca por completo', D: 'Antibióticos de amplio espectro como primera línea, sin importar la causa' }, answer: ['A'], explanation: 'Las sales de rehidratación oral (SRO), administradas en pequeñas cantidades frecuentes, son el tratamiento de primera línea para deshidratación leve-moderada por diarrea; la vía IV se reserva para deshidratación severa o intolerancia a la vía oral.', domain: 'Deshidratación y rehidratación oral', difficulty: 'medium' },
      { type: 'multiple', question: 'En un lactante menor de 3 meses con fiebre, ¿por qué se considera generalmente una situación de mayor preocupación clínica que en un niño mayor con el mismo síntoma?', options: { A: 'No hay ninguna diferencia real en el manejo según la edad', B: 'El sistema inmune inmaduro de los lactantes pequeños aumenta el riesgo de infecciones bacterianas graves, y a menudo presentan menos signos localizadores claros, dificultando identificar la causa sin evaluación más exhaustiva', C: 'La fiebre en lactantes menores de 3 meses nunca representa ningún riesgo', D: 'Solo se considera preocupante después de los 6 meses de edad' }, answer: ['B'], explanation: 'Los lactantes menores de 3 meses tienen un sistema inmune inmaduro con mayor riesgo de infección bacteriana grave (sepsis, meningitis), y frecuentemente presentan cuadros clínicos menos específicos, por lo que la fiebre en este grupo etario amerita evaluación más exhaustiva y cautelosa que en niños mayores.', domain: 'Fiebre en pediatría', difficulty: 'hard' },
    ],
  },
  {
    slug: 'primeros-auxilios-avanzados',
    title: 'Primeros Auxilios Avanzados',
    description: 'Examen de práctica sobre manejo de trauma, hemorragias, quemaduras y emergencias médicas más allá de los primeros auxilios básicos.',
    domain: 'health', category: 'emergency', level: 'intermediate', language: 'es',
    tags: ['trauma', 'primeros-auxilios'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en Cruz Roja Internacional First Aid Guidelines + PHTLS (Prehospital Trauma Life Support) 10th Ed (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué significa el mnemónico XABCDE usado en la evaluación primaria de un paciente traumatizado, y qué agrega la "X" a la secuencia clásica ABCDE?', options: { A: 'La "X" antepuesta prioriza el control de hemorragias eXanguinantes (masivas y potencialmente letales) ANTES incluso de la vía aérea, cuando la hemorragia representa la amenaza inmediata más letal', B: 'La "X" es un paso opcional sin ninguna prioridad real', C: 'La "X" significa "examen físico completo" y siempre va al final', D: 'La secuencia XABCDE elimina la necesidad de evaluar la vía aérea' }, answer: ['A'], explanation: 'La evaluación XABCDE prioriza el control de hemorragias exanguinantes (masivas, con riesgo inminente de muerte) incluso antes de la vía aérea, reconociendo que una hemorragia masiva no controlada puede matar más rápido que un problema de vía aérea en ciertos escenarios de trauma.', domain: 'Evaluación primaria y secundaria (XABCDE)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre la evaluación primaria y la evaluación secundaria en la atención de un paciente traumatizado?', options: { A: 'La evaluación primaria identifica y trata rápidamente amenazas inmediatas para la vida (XABCDE); la evaluación secundaria es un examen más detallado de cabeza a pies, realizado una vez estabilizadas las amenazas vitales', B: 'Son exactamente lo mismo, sin ningún orden de prioridad', C: 'La evaluación secundaria siempre se realiza antes que la primaria', D: 'La evaluación primaria solo aplica a pacientes conscientes' }, answer: ['A'], explanation: 'La evaluación primaria (XABCDE) identifica y trata rápidamente amenazas inmediatas para la vida; solo después de estabilizar estas amenazas se realiza la evaluación secundaria, un examen sistemático más detallado de cabeza a pies para identificar lesiones adicionales.', domain: 'Evaluación primaria y secundaria (XABCDE)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el método más efectivo y de primera línea para controlar una hemorragia externa severa en una extremidad?', options: { A: 'Presión directa firme y sostenida sobre la herida, con vendaje compresivo; si es inefectiva y la hemorragia es exanguinante, considerar un torniquete', B: 'Elevar la extremidad exclusivamente, sin ninguna presión directa', C: 'Aplicar hielo directamente sobre la herida sangrante', D: 'No hacer nada y esperar a que el sangrado se detenga solo' }, answer: ['A'], explanation: 'La presión directa firme sobre la herida es la primera línea para controlar hemorragias; si es inefectiva o la hemorragia es masiva/exanguinante en una extremidad, se debe considerar un torniquete aplicado correctamente, priorizando salvar la vida sobre el riesgo de la extremidad.', domain: 'Control de hemorragias (torniquetes, vendajes hemostáticos)', difficulty: 'medium' },
      { type: 'multiple', question: '¿En qué situación está indicado aplicar un torniquete, y qué información es crítica registrar al aplicarlo?', options: { A: 'Cuando la hemorragia de una extremidad es masiva/exanguinante y no se controla con presión directa; es crítico registrar la HORA exacta de aplicación, ya que afecta decisiones médicas posteriores', B: 'Nunca debe usarse un torniquete bajo ninguna circunstancia', C: 'Se aplica rutinariamente en cualquier herida menor, sin importar la severidad', D: 'No es necesario registrar ninguna información al aplicarlo' }, answer: ['A'], explanation: 'El torniquete se reserva para hemorragias exanguinantes de extremidad no controlables con presión directa; registrar la hora exacta de aplicación es crítico, ya que el equipo médico receptor necesita ese dato para tomar decisiones sobre el tiempo de isquemia y el manejo posterior.', domain: 'Control de hemorragias (torniquetes, vendajes hemostáticos)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el principio general al inmovilizar una sospecha de fractura en el ámbito prehospitalario?', options: { A: 'Inmovilizar la articulación por encima y por debajo del sitio de la fractura, evitando mover innecesariamente el área lesionada', B: 'Intentar realinear la fractura activamente antes de inmovilizar, sin importar el dolor que genere', C: 'No es necesario inmovilizar nunca una sospecha de fractura', D: 'Solo se debe inmovilizar la zona exacta de la fractura, sin incluir las articulaciones adyacentes' }, answer: ['A'], explanation: 'El principio estándar de inmovilización es fijar la articulación por encima y por debajo del sitio de la fractura sospechada, minimizando el movimiento del área lesionada para reducir dolor y prevenir daño adicional a tejidos blandos, vasos o nervios.', domain: 'Inmovilización de fracturas', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "regla de los 9" (rule of nines) en el manejo de quemaduras?', options: { A: 'Un método rápido para estimar el porcentaje de superficie corporal total (SCT) quemada, dividiendo el cuerpo en regiones que representan aproximadamente 9% (o múltiplos) cada una', B: 'Una regla que indica que solo se deben tratar quemaduras de más de 9 días de evolución', C: 'Un método exclusivo para calcular la profundidad de la quemadura, no su extensión', D: 'Una regla que solo aplica a quemaduras químicas' }, answer: ['A'], explanation: 'La regla de los 9 divide el cuerpo del adulto en regiones que representan aproximadamente 9% (o múltiplos) de la superficie corporal total (ej. cabeza 9%, cada brazo 9%, cada pierna 18%, tronco anterior/posterior 18% cada uno), permitiendo estimar rápidamente la extensión de una quemadura para guiar el manejo inicial (ej. reposición de líquidos).', domain: 'Quemaduras (regla de los 9, manejo inicial)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el manejo inicial apropiado para una quemadura térmica leve a moderada (ej. de segundo grado, área limitada)?', options: { A: 'Aplicar hielo directamente sobre la quemadura', B: 'Enfriar la zona con agua corriente a temperatura ambiente/fresca (no helada) durante varios minutos, cubrir con un apósito limpio no adherente, y evitar reventar ampollas', C: 'Aplicar mantequilla o pasta dental sobre la quemadura', D: 'No aplicar ningún manejo, dejar la quemadura completamente expuesta al aire sin cubrir' }, answer: ['B'], explanation: 'El manejo inicial de quemaduras leves-moderadas incluye enfriar con agua corriente fresca (no helada, que puede causar mayor daño tisular) durante varios minutos, cubrir con un apósito limpio no adherente, y evitar remedios caseros como mantequilla o pasta dental, que pueden empeorar la lesión o dificultar la evaluación posterior.', domain: 'Quemaduras (regla de los 9, manejo inicial)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cómo se debe actuar ante una persona con sospecha de hipoglucemia (confusión, sudoración, temblor) que aún está consciente y puede tragar de forma segura?', options: { A: 'Administrar rápidamente algo con azúcar de absorción rápida por vía oral (ej. jugo, tabletas de glucosa)', B: 'No hacer nada hasta que llegue ayuda profesional, sin ninguna intervención inicial', C: 'Inyectar insulina inmediatamente', D: 'Dar únicamente agua sin ningún contenido de azúcar' }, answer: ['A'], explanation: 'En una persona consciente que puede tragar de forma segura con sospecha de hipoglucemia, se debe administrar rápidamente una fuente de azúcar de absorción rápida (jugo, tabletas de glucosa) por vía oral; administrar insulina en este contexto sería peligrosamente contraproducente, ya que empeoraría la hipoglucemia.', domain: 'Emergencias médicas (hipoglucemia, crisis convulsiva, anafilaxia, IAM)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la acción MÁS importante para proteger a una persona durante una crisis convulsiva tónico-clónica activa?', options: { A: 'Sujetar firmemente las extremidades de la persona para evitar que se mueva', B: 'Proteger su cabeza de golpes contra el suelo/objetos cercanos, retirar objetos peligrosos alrededor, y NO introducir nada en su boca', C: 'Introducir un objeto en la boca para evitar que "se trague la lengua"', D: 'Levantar a la persona y sostenerla de pie durante toda la convulsión' }, answer: ['B'], explanation: 'Durante una convulsión activa, se debe proteger la cabeza y retirar objetos peligrosos del entorno, sin sujetar ni restringir los movimientos (puede causar lesiones) y NUNCA introducir objetos en la boca (mito peligroso: no existe riesgo real de "tragarse la lengua", y el objeto puede causar lesión dental o vía aérea obstruida).', domain: 'Emergencias médicas (hipoglucemia, crisis convulsiva, anafilaxia, IAM)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué signos hacen sospechar una reacción anafiláctica que requiere manejo de emergencia inmediato?', options: { A: 'Solo un leve enrojecimiento localizado en la piel, sin ningún otro síntoma', B: 'Dificultad respiratoria/estridor, hinchazón de labios-lengua-garganta, urticaria generalizada y/o caída de la presión arterial, típicamente tras exposición a un alérgeno conocido', C: 'Un dolor de cabeza leve aislado', D: 'Ningún signo específico permite sospechar anafilaxia' }, answer: ['B'], explanation: 'La anafilaxia se sospecha ante la combinación de compromiso respiratorio (estridor, dificultad para respirar), angioedema (hinchazón de labios/lengua/garganta), urticaria generalizada y/o hipotensión, típicamente de inicio rápido tras exposición a un alérgeno — una emergencia que requiere epinefrina de urgencia si está disponible y activación inmediata del sistema de emergencias.', domain: 'Emergencias médicas (hipoglucemia, crisis convulsiva, anafilaxia, IAM)', difficulty: 'medium' },
    ],
  },
];
