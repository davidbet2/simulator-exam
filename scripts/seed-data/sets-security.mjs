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
  // ═══════════════════════════════════════════════════════════════════
  // CompTIA Security+
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'comptia-security-plus',
    title: 'CompTIA Security+ (SY0-701)',
    description:
      'Amenazas, arquitectura, operaciones y gobernanza de seguridad. Certificación baseline más reconocida en ciberseguridad.',
    domain: 'security',
    category: 'cybersecurity',
    level: 'intermediate',
    language: 'es',
    tags: ['security-plus', 'comptia', 'cybersecurity', 'infosec'],
    passPercent: 75,
    timeMinutes: 40,
    source: 'Basado en CompTIA Security+ SY0-701 Exam Objectives (comptia.org, documento público)',
    questions: [
      {
        type: 'multiple',
        question: 'La tríada CIA en seguridad de la información se refiere a:',
        options: {
          A: 'Confidentiality, Integrity, Availability',
          B: 'Central Intelligence Agency',
          C: 'Confidentiality, Identity, Access',
          D: 'Control, Identity, Audit',
        },
        answer: ['A'],
        explanation:
          'La tríada CIA es el pilar fundamental: Confidencialidad (solo autorizados ven), Integridad (datos no alterados), Disponibilidad (accesible cuando se requiere).',
        domain: 'Conceptos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué tipo de malware cifra archivos y exige pago para el rescate?',
        options: { A: 'Rootkit', B: 'Ransomware', C: 'Spyware', D: 'Adware' },
        answer: ['B'],
        explanation:
          'Ransomware cifra datos del usuario/empresa y exige pago (usualmente en cripto) para entregar la clave.',
        domain: 'Malware',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un atacante engaña a un usuario por email para que revele credenciales. Esto es:',
        options: { A: 'Phishing', B: 'Smishing', C: 'Vishing', D: 'Pharming' },
        answer: ['A'],
        explanation:
          'Phishing = email. Smishing = SMS. Vishing = voz/llamadas. Pharming = redirección DNS.',
        domain: 'Ingeniería Social',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'MFA con "algo que sabes + algo que tienes" es un ejemplo de:',
        options: {
          A: 'Single-factor',
          B: 'Dos factores de categorías distintas (conocimiento + posesión)',
          C: 'Biometría',
          D: 'SSO',
        },
        answer: ['B'],
        explanation:
          'Factores: conocimiento (password), posesión (token/móvil), inherencia (biometría), ubicación, comportamiento. MFA verdadera combina factores DE DISTINTA categoría.',
        domain: 'Autenticación',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS algoritmos de cifrado simétrico.',
        options: { A: 'AES', B: 'RSA', C: 'ChaCha20', D: 'ECDSA' },
        answer: ['A', 'C'],
        explanation:
          'AES y ChaCha20 son simétricos (misma clave cifra y descifra). RSA y ECDSA son asimétricos.',
        domain: 'Criptografía',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué algoritmo debe ELIMINARSE por ser criptográficamente roto?',
        options: { A: 'SHA-256', B: 'AES-256', C: 'MD5', D: 'bcrypt' },
        answer: ['C'],
        explanation:
          'MD5 (y SHA-1) tienen colisiones demostradas. NUNCA usar para integridad ni passwords. bcrypt es adecuado para hashing de passwords con salt.',
        domain: 'Criptografía',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Para qué sirve un certificado digital X.509?',
        options: {
          A: 'Solo cifrar archivos',
          B: 'Vincular una clave pública a una identidad, firmada por una CA',
          C: 'Almacenar passwords',
          D: 'Escanear malware',
        },
        answer: ['B'],
        explanation:
          'X.509 enlaza clave pública con identidad (subject) firmado por una Certificate Authority. Base de TLS/HTTPS, S/MIME, code signing.',
        domain: 'PKI',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un firewall que inspecciona conexiones TCP y aplica reglas por estado de sesión se llama:',
        options: {
          A: 'Packet filter',
          B: 'Stateful firewall',
          C: 'Proxy de aplicación',
          D: 'Antivirus',
        },
        answer: ['B'],
        explanation:
          'Stateful: rastrea estado de conexiones (SYN/ACK/FIN). Packet filter es stateless. NGFW añade L7/DPI.',
        domain: 'Redes',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué es un ataque de fuerza bruta?',
        options: {
          A: 'Explotar vulnerabilidades de buffer overflow',
          B: 'Probar sistemáticamente todas las combinaciones posibles de credenciales',
          C: 'Escuchar tráfico de red',
          D: 'Manipular URLs',
        },
        answer: ['B'],
        explanation:
          'Fuerza bruta = probar credenciales exhaustivamente. Mitigaciones: rate limiting, lockout, MFA, passwords fuertes.',
        domain: 'Ataques',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué protocolo autentica y cifra tráfico IP a nivel de red?',
        options: { A: 'TLS', B: 'IPsec', C: 'SSH', D: 'HTTPS' },
        answer: ['B'],
        explanation:
          'IPsec opera a nivel IP (L3). TLS/SSH/HTTPS operan más arriba (transporte/aplicación).',
        domain: 'Redes',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Principio de "least privilege":',
        options: {
          A: 'Dar todos los permisos a los admins',
          B: 'Conceder solo los permisos mínimos necesarios para realizar una tarea',
          C: 'Nunca dar permisos',
          D: 'Rotar permisos mensualmente',
        },
        answer: ['B'],
        explanation:
          'Least privilege limita el blast radius de una credencial comprometida. Es uno de los principios clave de Zero Trust.',
        domain: 'Governance',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué tipo de backup copia solo los datos modificados desde el último FULL backup?',
        options: { A: 'Incremental', B: 'Differential', C: 'Snapshot', D: 'Archivo' },
        answer: ['B'],
        explanation:
          'Differential: cambios desde el último FULL. Incremental: cambios desde el último backup de cualquier tipo. Incremental ocupa menos pero requiere todos los incrementales para restaurar.',
        domain: 'Continuidad',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué hace un SIEM?',
        options: {
          A: 'Solo antivirus',
          B: 'Recolectar, correlacionar y alertar sobre logs y eventos de seguridad en tiempo real',
          C: 'Encriptar discos',
          D: 'Bloquear IPs automáticamente',
        },
        answer: ['B'],
        explanation:
          'SIEM (Security Information and Event Management): centraliza logs, correlaciona y genera alertas.',
        domain: 'Operaciones',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'En DRP, RTO se refiere a:',
        options: {
          A: 'Tiempo máximo aceptable para restaurar un servicio después de un incidente',
          B: 'Cantidad máxima de datos que la org tolera perder',
          C: 'Costo de la recuperación',
          D: 'Tiempo medio entre fallos',
        },
        answer: ['A'],
        explanation:
          'RTO (Recovery Time Objective): tiempo máx. para volver a operativo. RPO (Recovery Point Objective): cuánto dato puedes perder (última copia buena).',
        domain: 'Continuidad',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: 'Un escaneo de vulnerabilidades es:',
        options: {
          A: 'Un ataque real controlado para ganar acceso',
          B: 'Un análisis no intrusivo que identifica vulnerabilidades conocidas en sistemas',
          C: 'Un firewall',
          D: 'Una revisión de logs',
        },
        answer: ['B'],
        explanation:
          'Vulnerability Scan es pasivo/no-intrusivo (Nessus, OpenVAS). Penetration Test explota activamente las vulnerabilidades encontradas.',
        domain: 'Testing',
        difficulty: 'medium',
      },
    ],
  },

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
