/**
 * Cybersecurity certification sets.
 *
 * SOURCES (public only):
 *   - CompTIA Security+ SY0-701 Exam Objectives (comptia.org public PDF)
 *   - OWASP Top 10:2021 (owasp.org — CC BY-SA 4.0)
 *   - NIST Cybersecurity Framework public documents
 *
 * All questions are original, written from blueprint understanding.
 */

export const SECURITY_SETS = [
  // NOTA: el set 'comptia-security-plus' (15 preguntas) que vivía aquí fue
  // removido — reemplazado por una versión más completa (30 preguntas, con
  // pesos de dominio reales investigados) en scripts/seed-data/sets-security-extended.mjs
  // para evitar slugs duplicados. Ver ese archivo para el contenido vigente.

  // ═══════════════════════════════════════════════════════════════════
  // OWASP Top 10 (2021)
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'owasp-top-10',
    title: 'OWASP Top 10:2021 — Seguridad Web',
    description:
      'Los 10 riesgos críticos en aplicaciones web según OWASP. Esencial para developers y security engineers.',
    domain: 'security',
    category: 'appsec',
    level: 'intermediate',
    language: 'es',
    tags: ['owasp', 'appsec', 'web-security'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Basado en OWASP Top 10:2021 (owasp.org — Creative Commons BY-SA 4.0)',
    questions: [
      {
        type: 'multiple',
        question:
          '¿Cuál es la categoría #1 de OWASP Top 10:2021?',
        options: {
          A: 'Injection',
          B: 'Broken Access Control',
          C: 'Cryptographic Failures',
          D: 'Insecure Design',
        },
        answer: ['B'],
        explanation:
          'Broken Access Control subió al #1 en la versión 2021 tras aparecer en el 94% de apps analizadas.',
        domain: 'Top 10',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Un usuario autenticado modifica `user_id` en la URL para ver datos de otro usuario. Esto es:',
        options: {
          A: 'SQL Injection',
          B: 'IDOR (Insecure Direct Object Reference) — variante de Broken Access Control',
          C: 'XSS',
          D: 'CSRF',
        },
        answer: ['B'],
        explanation:
          'IDOR ocurre cuando el servidor expone referencias directas sin validar autorización por objeto. Mitigación: verificar ownership en CADA request.',
        domain: 'Access Control',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'La forma MÁS efectiva de prevenir SQL Injection es:',
        options: {
          A: 'Escape manual de caracteres',
          B: 'Prepared statements / parameterized queries',
          C: 'Filtrar palabras clave como SELECT',
          D: 'Usar HTTPS',
        },
        answer: ['B'],
        explanation:
          'Prepared statements separan código de datos estructuralmente. Escaping manual es propenso a errores.',
        domain: 'Injection',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué tipo de XSS persiste en la BD del servidor y afecta a todos los usuarios que vean el contenido?',
        options: {
          A: 'Reflected XSS',
          B: 'DOM-based XSS',
          C: 'Stored/Persistent XSS',
          D: 'Blind XSS',
        },
        answer: ['C'],
        explanation:
          'Stored XSS: payload guardado en BD (ej. comentario malicioso). Reflected: payload en URL no guardado. DOM-based: en JS cliente.',
        domain: 'Injection',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS buenas prácticas contra Broken Authentication (A07).',
        options: {
          A: 'Implementar MFA',
          B: 'Usar tokens de sesión aleatorios criptográficamente seguros, httpOnly',
          C: 'Almacenar passwords en texto plano',
          D: 'Exponer IDs de sesión en la URL',
        },
        answer: ['A', 'B'],
        explanation:
          'MFA y session tokens seguros httpOnly son estándar. Passwords en texto plano e IDs en URL son anti-patrones.',
        domain: 'Autenticación',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué categoría cubre el uso de librerías con CVEs conocidos?',
        options: {
          A: 'A02: Cryptographic Failures',
          B: 'A05: Security Misconfiguration',
          C: 'A06: Vulnerable and Outdated Components',
          D: 'A09: Security Logging and Monitoring Failures',
        },
        answer: ['C'],
        explanation:
          'A06 cubre dependencias con CVEs. Mitigación: SBOM, `npm audit`, Dependabot, Renovate.',
        domain: 'Componentes',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un atacante explota un servidor para que éste realice peticiones a recursos internos (ej. AWS metadata endpoint). Esto es:',
        options: {
          A: 'XSS',
          B: 'SSRF (Server-Side Request Forgery) — A10',
          C: 'CSRF',
          D: 'Path traversal',
        },
        answer: ['B'],
        explanation:
          'SSRF: el servidor hace peticiones a URLs controladas por el atacante. Puede exponer metadata cloud (169.254.169.254), servicios internos, etc.',
        domain: 'SSRF',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '"Insecure Design" (A04) se mitiga PRINCIPALMENTE con:',
        options: {
          A: 'Más parches',
          B: 'Threat modeling y secure design patterns desde la arquitectura',
          C: 'Más firewalls',
          D: 'Reinstalar servidores',
        },
        answer: ['B'],
        explanation:
          'A04 es nueva en 2021. Se refiere a fallas en el DISEÑO que no pueden arreglarse en el código. Shift-left: threat modeling, secure SDLC.',
        domain: 'Diseño',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué header HTTP mitiga principalmente ataques XSS al limitar qué scripts pueden ejecutarse?',
        options: {
          A: 'X-Frame-Options',
          B: 'Content-Security-Policy (CSP)',
          C: 'Strict-Transport-Security',
          D: 'X-Content-Type-Options',
        },
        answer: ['B'],
        explanation:
          'CSP define qué orígenes de script/style/img están permitidos. Previene XSS inline y de orígenes externos no listados.',
        domain: 'Defense-in-Depth',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un API deserializa objetos sin validar, permitiendo ejecución remota. Esto cae bajo:',
        options: {
          A: 'A08: Software and Data Integrity Failures',
          B: 'A02: Cryptographic Failures',
          C: 'A07: Identification and Authentication Failures',
          D: 'A05: Security Misconfiguration',
        },
        answer: ['A'],
        explanation:
          'A08 incluye insecure deserialization y supply chain attacks (actualización sin firma verificada, CI/CD comprometido, etc.).',
        domain: 'Integridad',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Un atacante detona "brute force" por hora sin que la app lo detecte. Esto es una falla de:',
        options: {
          A: 'A09: Security Logging and Monitoring Failures',
          B: 'A01: Broken Access Control',
          C: 'A02: Cryptographic Failures',
          D: 'A03: Injection',
        },
        answer: ['A'],
        explanation:
          'A09 cubre la falta de logs, alertas y respuesta. Sin detección, los ataques persisten. Mitigación: SIEM, alertas en anomalías, logs en auth failures.',
        domain: 'Monitoring',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué técnica previene CSRF (Cross-Site Request Forgery)?',
        options: {
          A: 'Tokens anti-CSRF sincronizados / SameSite=Strict en cookies',
          B: 'Cifrado AES',
          C: 'Hashing de passwords',
          D: 'HTTPS only',
        },
        answer: ['A'],
        explanation:
          'CSRF se mitiga con tokens sincronizados (Double Submit, Synchronizer Token) y cookies SameSite=Strict/Lax. HTTPS no es suficiente.',
        domain: 'Ataques Web',
        difficulty: 'hard',
      },
    ],
  },
];
