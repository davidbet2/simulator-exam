/**
 * Official Health exam sets.
 *
 * Sources (public domain / open guidelines):
 *   - WHO First Aid guidelines (who.int)
 *   - American Red Cross public educational material
 *   - Wikipedia (anatomy, human systems)
 */

export const HEALTH_SETS = [
  {
    slug: 'primeros-auxilios-basicos',
    title: 'Primeros Auxilios — Básicos',
    description:
      'Actuación inicial ante emergencias comunes: RCP, atragantamiento, hemorragias, quemaduras. Basado en guías públicas de OMS y Cruz Roja.',
    domain: 'health',
    category: 'first-aid',
    level: 'beginner',
    language: 'es',
    tags: ['primeros-auxilios', 'rcp', 'emergencia'],
    passPercent: 75,
    timeMinutes: 20,
    source: 'Basado en WHO First Aid Guidelines y American Red Cross material público',
    questions: [
      {
        type: 'multiple',
        question:
          'En un adulto inconsciente que no respira normalmente, ¿cuál es la frecuencia recomendada de compresiones torácicas en RCP?',
        options: {
          A: '60–80 por minuto',
          B: '100–120 por minuto',
          C: '140–160 por minuto',
          D: '30–40 por minuto',
        },
        answer: ['B'],
        explanation:
          'La guías internacionales (ILCOR/AHA) recomiendan 100–120 compresiones por minuto con profundidad de 5–6 cm en adultos.',
        domain: 'RCP',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la relación compresiones:ventilaciones en RCP de un adulto con un rescatador?',
        options: {
          A: '15:2',
          B: '30:2',
          C: '50:2',
          D: '5:1',
        },
        answer: ['B'],
        explanation:
          '30 compresiones seguidas de 2 ventilaciones. En niños con dos rescatadores entrenados: 15:2.',
        domain: 'RCP',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Al encontrar a una persona consciente con atragantamiento severo (no puede toser ni hablar), ¿qué maniobra se aplica primero?',
        options: {
          A: 'Golpes interescapulares y luego compresiones abdominales (Heimlich)',
          B: 'Ofrecerle agua',
          C: 'Acostarla boca arriba',
          D: 'Esperar a que se resuelva solo',
        },
        answer: ['A'],
        explanation:
          '5 golpes entre los omóplatos alternando con 5 compresiones abdominales (Heimlich) hasta que el objeto sea expulsado o la persona pierda la consciencia.',
        domain: 'Obstrucción de Vía Aérea',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Ante una hemorragia externa abundante en un brazo, la PRIMERA acción debe ser:',
        options: {
          A: 'Aplicar torniquete inmediatamente',
          B: 'Presión directa sobre la herida con tela limpia',
          C: 'Dar agua al herido',
          D: 'Elevar el brazo y esperar',
        },
        answer: ['B'],
        explanation:
          'La presión directa es la primera línea. Torniquete solo si la hemorragia es masiva y no controlable con presión, y preferiblemente por personal entrenado.',
        domain: 'Hemorragias',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál NO es un signo de shock?',
        options: {
          A: 'Piel fría y sudorosa',
          B: 'Pulso rápido y débil',
          C: 'Confusión o alteración de conciencia',
          D: 'Piel caliente y enrojecida con pulso fuerte',
        },
        answer: ['D'],
        explanation:
          'El shock causa vasoconstricción periférica: piel pálida/fría/sudorosa, taquicardia, hipotensión.',
        domain: 'Shock',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Ante una quemadura de segundo grado (ampollas), ¿qué acción está contraindicada?',
        options: {
          A: 'Enfriar con agua corriente 10–20 minutos',
          B: 'Cubrir con apósito limpio no adherente',
          C: 'Reventar las ampollas',
          D: 'Acudir a centro médico',
        },
        answer: ['C'],
        explanation:
          'Nunca reventar las ampollas: aumentan riesgo de infección. La barrera natural ayuda a la cicatrización.',
        domain: 'Quemaduras',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'En un paciente que sufrió posible lesión de columna, ¿qué se debe evitar?',
        options: {
          A: 'Llamar al servicio de emergencias',
          B: 'Movilizarlo sin necesidad',
          C: 'Mantenerlo abrigado',
          D: 'Estabilizar su cabeza con las manos',
        },
        answer: ['B'],
        explanation:
          'Cualquier movimiento puede agravar una lesión medular. Movilizar solo si hay peligro vital (fuego, colapso).',
        domain: 'Traumas',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'La posición lateral de seguridad se usa en pacientes:',
        options: {
          A: 'Con fractura evidente de cadera',
          B: 'Inconscientes que respiran con normalidad y sin sospecha de lesión medular',
          C: 'En parada cardiorrespiratoria',
          D: 'Con hemorragia masiva',
        },
        answer: ['B'],
        explanation:
          'La PLS protege la vía aérea (evita aspiración) en pacientes inconscientes que respiran.',
        domain: 'Manejo de Paciente',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Ante sospecha de ictus/ACV en alguien, ¿qué acrónimo ayuda a identificar signos?',
        options: {
          A: 'FAST (Face, Arms, Speech, Time)',
          B: 'ABCDE',
          C: 'RICE',
          D: 'PQRST',
        },
        answer: ['A'],
        explanation:
          'FAST: asimetría facial, debilidad de brazos, dificultad de habla → llamar YA. El tiempo es cerebro.',
        domain: 'Emergencias Médicas',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Seleccione DOS acciones correctas ante un desmayo.',
        options: {
          A: 'Acostar a la persona y elevar las piernas',
          B: 'Darle de beber inmediatamente',
          C: 'Asegurar ventilación (aflojar ropa ajustada)',
          D: 'Sentarla rápidamente con la cabeza entre las rodillas con fuerza',
        },
        answer: ['A', 'C'],
        explanation:
          'Posición de Trendelenburg (acostado con piernas elevadas) aumenta retorno venoso al cerebro. Aflojar ropa ajustada facilita respiración.',
        domain: 'Emergencias Médicas',
        difficulty: 'easy',
      },
    ],
  },

  {
    slug: 'anatomia-humana-sistemas',
    title: 'Anatomía Humana — Sistemas Corporales',
    description:
      'Estructura y función de los principales sistemas del cuerpo humano: cardiovascular, respiratorio, nervioso, digestivo.',
    domain: 'health',
    category: 'anatomy',
    level: 'beginner',
    language: 'es',
    tags: ['anatomia', 'biologia', 'sistemas'],
    passPercent: 70,
    timeMinutes: 20,
    source: 'Basado en contenido de dominio público (Gray\'s Anatomy, Wikipedia anatomy articles)',
    questions: [
      {
        type: 'multiple',
        question: '¿Cuántas cámaras tiene el corazón humano?',
        options: { A: '2', B: '3', C: '4', D: '5' },
        answer: ['C'],
        explanation:
          'Dos aurículas (derecha e izquierda) y dos ventrículos (derecho e izquierdo). Separados por tabiques.',
        domain: 'Sistema Cardiovascular',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué estructura del pulmón es donde ocurre el intercambio de gases?',
        options: { A: 'Bronquios', B: 'Alvéolos', C: 'Tráquea', D: 'Laringe' },
        answer: ['B'],
        explanation:
          'Los alvéolos son pequeños sacos rodeados de capilares donde O₂ y CO₂ se intercambian por difusión.',
        domain: 'Sistema Respiratorio',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la neurona más grande del cuerpo humano?',
        options: {
          A: 'Motoneurona alfa',
          B: 'Neurona piramidal',
          C: 'Célula de Purkinje',
          D: 'Neurona ciática (nervio ciático)',
        },
        answer: ['D'],
        explanation:
          'Las neuronas del nervio ciático pueden tener axones de hasta ~1 metro desde la médula espinal hasta el pie.',
        domain: 'Sistema Nervioso',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué órgano produce la bilis?',
        options: { A: 'Páncreas', B: 'Hígado', C: 'Vesícula biliar', D: 'Estómago' },
        answer: ['B'],
        explanation:
          'El hígado produce la bilis; la vesícula biliar solo la almacena y concentra antes de liberarla al duodeno.',
        domain: 'Sistema Digestivo',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuántos huesos tiene aproximadamente un adulto humano?',
        options: { A: '120', B: '206', C: '300', D: '450' },
        answer: ['B'],
        explanation:
          'Un adulto tiene 206 huesos. Un bebé nace con ~270 que se fusionan durante el desarrollo.',
        domain: 'Sistema Óseo',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué tipo de vaso sanguíneo lleva sangre OXIGENADA desde el corazón al resto del cuerpo?',
        options: { A: 'Venas', B: 'Arterias', C: 'Capilares', D: 'Vénulas' },
        answer: ['B'],
        explanation:
          'Arterias llevan sangre oxigenada (excepto la arteria pulmonar). Venas llevan desoxigenada (excepto venas pulmonares).',
        domain: 'Sistema Cardiovascular',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'La unidad funcional del riñón se llama:',
        options: { A: 'Alvéolo', B: 'Nefrona', C: 'Sarcómero', D: 'Hepatocito' },
        answer: ['B'],
        explanation:
          'Cada riñón contiene ~1 millón de nefronas, que filtran la sangre y producen orina.',
        domain: 'Sistema Urinario',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué parte del cerebro controla la coordinación motora y el equilibrio?',
        options: { A: 'Cerebelo', B: 'Hipotálamo', C: 'Bulbo raquídeo', D: 'Corteza prefrontal' },
        answer: ['A'],
        explanation:
          'El cerebelo, detrás del tronco encefálico, coordina movimientos, postura y equilibrio.',
        domain: 'Sistema Nervioso',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Seleccione DOS componentes principales de la sangre.',
        options: {
          A: 'Plasma',
          B: 'Quilo',
          C: 'Eritrocitos (glóbulos rojos)',
          D: 'Osteoblastos',
        },
        answer: ['A', 'C'],
        explanation:
          'La sangre tiene plasma (55%) y elementos formes (eritrocitos, leucocitos, plaquetas).',
        domain: 'Sistema Cardiovascular',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el músculo más grande del cuerpo humano?',
        options: {
          A: 'Bíceps braquial',
          B: 'Glúteo mayor',
          C: 'Corazón',
          D: 'Cuádriceps',
        },
        answer: ['B'],
        explanation:
          'El glúteo mayor es el músculo más voluminoso. El corazón es involuntario (cardiaco); el más largo es el sartorio.',
        domain: 'Sistema Muscular',
        difficulty: 'medium',
      },
    ],
  },
];
