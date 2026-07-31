/**
 * Domain catalog — mirrors scripts/seed-data/domains.mjs.
 * Used by frontend for Explore filters and set landing metadata.
 */
export const DOMAINS = [
  { id: 'it',       label: 'IT & Cloud',      icon: '💻', description: 'Cloud, DevOps, contenedores y fundamentos de tecnología.',      color: 'indigo' },
  { id: 'security', label: 'Ciberseguridad',  icon: '🛡️', description: 'Security+, OWASP y fundamentos de seguridad ofensiva/defensiva.', color: 'red' },
  { id: 'agile',    label: 'Agile & PM',      icon: '📋', description: 'Scrum, ITIL, PMP y gestión de proyectos.',                      color: 'violet' },
  { id: 'health',   label: 'Salud',           icon: '🏥', description: 'Primeros auxilios, anatomía y fundamentos de salud.',            color: 'rose' },
  { id: 'english',  label: 'Inglés (CEFR)',   icon: '🇬🇧', description: 'Niveles A1 a C2 según el Marco Común Europeo.',                  color: 'emerald' },
  { id: 'logic',    label: 'Razonamiento',    icon: '🧠', description: 'Lógica, aptitud numérica y verbal.',                             color: 'amber' },
  { id: 'business', label: 'Negocios & Marketing', icon: '💼', description: 'Google Analytics, Google Ads, Salesforce, HubSpot y marketing digital.', color: 'blue' },
  { id: 'sports',   label: 'Deportes & Fitness',   icon: '🏋️', description: 'CrossFit, Yoga, Pilates y entrenamiento deportivo.',              color: 'lime' },
];

export const DOMAIN_BY_ID = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));

export function getDomain(id) {
  return DOMAIN_BY_ID[id] ?? { id: 'other', label: 'Otro', icon: '📚', color: 'slate' };
}
