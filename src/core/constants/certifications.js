/**
 * Certification types configuration.
 * "available: false" = coco (skeleton) — structure exists, no questions yet.
 */
export const CERTIFICATIONS = [
  {
    id: 'developer-senior',
    label: 'Senior Developer',
    labelEs: 'Desarrollador Senior',
    category: 'developer',
    level: 'senior',
    questionCount: 50,
    timeMinutes: 60,
    passPercent: 60,
    available: true,
    color: 'blue',
  },
  {
    id: 'developer-associate',
    label: 'Associate Developer',
    labelEs: 'Desarrollador Associate',
    category: 'developer',
    level: 'associate',
    questionCount: 60,
    timeMinutes: 60,
    passPercent: 72,
    available: true,
    color: 'green',
  },
  {
    id: 'analyst-senior',
    label: 'Senior Analyst',
    labelEs: 'Analista Senior',
    category: 'analyst',
    level: 'senior',
    questionCount: 50,
    timeMinutes: 60,
    passPercent: 60,
    available: false,
    color: 'purple',
  },
  {
    id: 'analyst-associate',
    label: 'Associate Analyst',
    labelEs: 'Analista Associate',
    category: 'analyst',
    level: 'associate',
    questionCount: 50,
    timeMinutes: 60,
    passPercent: 60,
    available: true,
    color: 'purple',
  },
];
