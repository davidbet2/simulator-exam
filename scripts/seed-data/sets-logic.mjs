/**
 * Logic / Aptitude reasoning set.
 *
 * Original questions — classical reasoning patterns (public-domain methodology).
 */

export const LOGIC_SETS = [
  {
    slug: 'razonamiento-logico-basico',
    title: 'Razonamiento Lógico — Básico',
    description:
      'Aptitud numérica, verbal y series lógicas. Útil para pruebas psicotécnicas y de ingreso.',
    domain: 'logic',
    category: 'aptitude',
    level: 'beginner',
    language: 'es',
    tags: ['logica', 'psicotecnico', 'aptitud', 'razonamiento'],
    passPercent: 60,
    timeMinutes: 25,
    source: 'Original — Patrones clásicos de razonamiento (dominio público)',
    questions: [
      {
        type: 'multiple',
        question: 'Complete la serie: 2, 4, 8, 16, __',
        options: { A: '24', B: '30', C: '32', D: '64' },
        answer: ['C'],
        explanation: 'Cada término se duplica: 16 × 2 = 32.',
        domain: 'Series Numéricas',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Si TODOS los perros ladran y Rex es un perro, entonces:',
        options: {
          A: 'Rex puede ladrar o no',
          B: 'Rex ladra',
          C: 'Solo los perros grandes ladran',
          D: 'No se puede concluir nada',
        },
        answer: ['B'],
        explanation: 'Silogismo válido: premisa universal + particular.',
        domain: 'Silogismos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un tren recorre 240 km en 3 horas. ¿Cuál es su velocidad media?',
        options: { A: '60 km/h', B: '80 km/h', C: '100 km/h', D: '120 km/h' },
        answer: ['B'],
        explanation: 'v = d/t = 240/3 = 80 km/h.',
        domain: 'Problemas de Velocidad',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué número falta? 3, 6, 12, __, 48',
        options: { A: '18', B: '20', C: '24', D: '36' },
        answer: ['C'],
        explanation: 'Cada término se duplica: 12 × 2 = 24.',
        domain: 'Series Numéricas',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'En un aula hay 30 estudiantes. 18 estudian inglés, 12 francés y 5 ambos. ¿Cuántos no estudian ningún idioma?',
        options: { A: '3', B: '5', C: '7', D: '10' },
        answer: ['B'],
        explanation:
          'Inclusión-exclusión: 18 + 12 − 5 = 25 estudian al menos uno. 30 − 25 = 5 no estudian ninguno.',
        domain: 'Conjuntos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '"Libro" es a "leer" como "música" es a:',
        options: { A: 'ver', B: 'escuchar', C: 'tocar', D: 'cantar' },
        answer: ['B'],
        explanation: 'Analogía de acción principal asociada.',
        domain: 'Analogías',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Si A > B y B > C, entonces:',
        options: {
          A: 'A < C',
          B: 'A > C',
          C: 'A = C',
          D: 'No se puede determinar',
        },
        answer: ['B'],
        explanation: 'Propiedad transitiva de las desigualdades.',
        domain: 'Lógica Deductiva',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un producto cuesta $120. Con un 25% de descuento, el precio final es:',
        options: { A: '$90', B: '$95', C: '$100', D: '$105' },
        answer: ['A'],
        explanation: '120 × 0.75 = 90. O bien 120 − 30 (25%) = 90.',
        domain: 'Porcentajes',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '5 obreros construyen un muro en 6 días. ¿Cuántos días necesitan 10 obreros trabajando al mismo ritmo?',
        options: { A: '2', B: '3', C: '4', D: '12' },
        answer: ['B'],
        explanation:
          'Relación inversa: más obreros, menos días. 5×6 = 10×x → x = 3.',
        domain: 'Regla de Tres Inversa',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Complete: JUEVES es a SEMANA como MARZO es a:',
        options: { A: 'DÍA', B: 'MES', C: 'AÑO', D: 'ESTACIÓN' },
        answer: ['C'],
        explanation:
          'Jueves es un elemento de la semana; marzo es un elemento del año.',
        domain: 'Analogías',
        difficulty: 'medium',
      },
    ],
  },
];
