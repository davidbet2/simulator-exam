// Generado por el subagente exam-content-architect (research + QA manual, sin LLM-API externo).
// Batch: security-extended — COMPLETO: 9 sets (comptia-security-plus + 8 nuevos).
//
// CompTIA Security+ (SY0-701) — única versión vigente (SY0-601 retirado 31-jul-2026).
// 5 dominios oficiales con peso publicado: General Security Concepts 12%,
// Threats/Vulnerabilities/Mitigations 22%, Security Architecture 18%,
// Security Operations 28%, Security Program Management & Oversight 20%.
// Examen real: hasta 90 preguntas, 90 min, passing score 750/900. — comptia.org/certifications/security
//
// CEH v13 (312-50) — vigente desde sep-2024 (Exam Blueprint v5.0). 5 dominios:
// Background 10%, Analysis/Assessment 10%, Security 20%, Tools/Systems 30%,
// Procedures/Methodology 30%. ~125 preguntas, 4 horas.
// CISSP — ISC2 CBK actualizado abr-2024 (vigente en 2026), 8 dominios: Security &
// Risk Management 16%, Asset Security 10%, Security Architecture & Engineering 13%,
// Communication & Network Security 13%, IAM 13%, Security Assessment & Testing 12%,
// Security Operations 13%, Software Development Security 10%.
// Los demás (Pentesting, Network Security, Cloud Security, Incident Response,
// SOC Analyst, Cryptography) son dominios de conocimiento estable basados en
// estándares públicos (PTES, NIST SP 800-61, MITRE ATT&CK, NIST FIPS, CSA), no
// atados a una certificación con versión datada.

export const SECURITY_EXTENDED_SETS = [
  {
    slug: 'comptia-security-plus',
    title: 'CompTIA Security+ (SY0-701)',
    description:
      'Examen de práctica alineado a los 5 dominios oficiales de CompTIA Security+ SY0-701: conceptos generales, amenazas, arquitectura, operaciones y gobernanza de seguridad.',
    domain: 'security',
    category: 'security-fundamentals',
    level: 'intermediate',
    language: 'es',
    tags: ['comptia', 'security-plus', 'sy0-701'],
    passPercent: 72,
    timeMinutes: 33,
    source:
      'Basado en CompTIA Security+ SY0-701 Exam Objectives — comptia.org/certifications/security (contenido original)',
    questions: [
      // ── Dominio 1: General Security Concepts — 12% (4) ────────────────
      {
        type: 'multiple',
        question:
          '¿Qué representan las siglas de la "CIA Triad" en seguridad de la información?',
        options: {
          A: 'Confidentiality, Integrity, Availability',
          B: 'Control, Inspection, Authorization',
          C: 'Cryptography, Identity, Access',
          D: 'Compliance, Investigation, Auditing',
        },
        answer: ['A'],
        explanation:
          'La CIA Triad (Confidencialidad, Integridad, Disponibilidad) es el modelo fundamental de seguridad: proteger la información de accesos no autorizados, garantizar que no sea alterada indebidamente, y asegurar que esté disponible cuando se necesite.',
        domain: 'General Security Concepts',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la diferencia entre autenticación y autorización?',
        options: {
          A: 'Son sinónimos intercambiables',
          B: 'Autenticación verifica quién es el usuario (identidad); autorización determina qué puede hacer ese usuario ya autenticado',
          C: 'Autorización siempre ocurre antes que la autenticación',
          D: 'Autenticación solo aplica a sistemas cloud',
        },
        answer: ['B'],
        explanation:
          'La autenticación (AuthN) confirma la identidad de un sujeto (ej. usuario/contraseña, MFA); la autorización (AuthZ) determina, una vez autenticado, qué recursos y acciones tiene permitido usar según sus permisos.',
        domain: 'General Security Concepts',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un modelo de seguridad "Zero Trust" se basa en el principio de:',
        options: {
          A: 'Confiar automáticamente en cualquier dispositivo dentro de la red corporativa (perímetro de confianza)',
          B: 'Nunca confiar por defecto y verificar explícitamente cada solicitud de acceso, sin importar si el origen está dentro o fuera de la red',
          C: 'Eliminar toda autenticación para simplificar el acceso',
          D: 'Confiar solo en dispositivos con más de 1 año de antigüedad',
        },
        answer: ['B'],
        explanation:
          'Zero Trust reemplaza el modelo de "confiar en la red interna" por "nunca confiar, siempre verificar": cada solicitud de acceso se autentica, autoriza y cifra explícitamente, independientemente de si proviene de dentro o fuera del perímetro corporativo.',
        domain: 'General Security Concepts',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa exige que ningún empleado tenga, por defecto, más permisos de los estrictamente necesarios para su función. ¿Qué principio de seguridad están aplicando?',
        options: {
          A: 'Separation of duties',
          B: 'Principle of least privilege',
          C: 'Defense in depth',
          D: 'Non-repudiation',
        },
        answer: ['B'],
        explanation:
          'El principio de menor privilegio (least privilege) establece que cada usuario o sistema debe tener únicamente los permisos mínimos necesarios para cumplir su función, reduciendo la superficie de ataque si una cuenta se ve comprometida.',
        domain: 'General Security Concepts',
        difficulty: 'easy',
      },

      // ── Dominio 2: Threats, Vulnerabilities, and Mitigations — 22% (7) ─
      {
        type: 'multiple',
        question:
          'Un empleado recibe un correo que aparenta ser de su banco, pidiéndole hacer clic en un enlace y actualizar su contraseña urgentemente. ¿Qué tipo de ataque es este?',
        options: {
          A: 'Denial of Service (DoS)',
          B: 'Phishing',
          C: 'SQL Injection',
          D: 'Man-in-the-Middle',
        },
        answer: ['B'],
        explanation:
          'El phishing usa correos (u otros mensajes) que suplantan una entidad confiable para engañar a la víctima y que revele credenciales o haga clic en enlaces maliciosos — un ataque de ingeniería social, no técnico.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un atacante inyecta código malicioso en un campo de formulario web que se concatena directamente en una consulta a la base de datos, logrando extraer datos que no debería ver. ¿Qué tipo de vulnerabilidad está explotando?',
        options: {
          A: 'Cross-Site Scripting (XSS)',
          B: 'SQL Injection',
          C: 'Buffer Overflow',
          D: 'DNS Spoofing',
        },
        answer: ['B'],
        explanation:
          'SQL Injection ocurre cuando la entrada del usuario se concatena sin sanitizar/parametrizar en una consulta SQL, permitiendo al atacante alterar la lógica de la consulta y acceder a datos no autorizados.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un servidor web recibe millones de solicitudes simultáneas desde miles de dispositivos comprometidos distintos, dejándolo inaccesible para usuarios legítimos. ¿Qué tipo de ataque describe mejor esta situación?',
        options: {
          A: 'Distributed Denial of Service (DDoS)',
          B: 'Cross-Site Request Forgery (CSRF)',
          C: 'Privilege Escalation',
          D: 'Pretexting',
        },
        answer: ['A'],
        explanation:
          'Un DDoS usa una red distribuida de dispositivos (a menudo una botnet) para saturar un servicio con tráfico simultáneo, agotando sus recursos y dejándolo inaccesible para usuarios legítimos — se diferencia del DoS por venir de múltiples orígenes.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un atacante intercepta el tráfico entre un usuario y un sitio web usando una red Wi-Fi pública no cifrada, leyendo y potencialmente alterando la comunicación sin que ninguna de las dos partes lo note. ¿Qué tipo de ataque es?',
        options: {
          A: 'Man-in-the-Middle (MitM)',
          B: 'Rainbow Table Attack',
          C: 'Watering Hole Attack',
          D: 'Typosquatting',
        },
        answer: ['A'],
        explanation:
          'Un ataque Man-in-the-Middle ocurre cuando un atacante se posiciona entre dos partes comunicantes (ej. en una red Wi-Fi insegura) para interceptar, leer o modificar el tráfico sin que las víctimas lo perciban.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un atacante que ya obtuvo acceso limitado a un sistema explota una falla del sistema operativo para obtener permisos de administrador. ¿Cómo se llama esta técnica?',
        options: {
          A: 'Privilege escalation',
          B: 'Social engineering',
          C: 'Session hijacking',
          D: 'Vishing',
        },
        answer: ['A'],
        explanation:
          'La escalación de privilegios (privilege escalation) es la técnica mediante la cual un atacante con acceso limitado explota una vulnerabilidad para obtener permisos más altos de los que originalmente tenía, a menudo el objetivo tras un compromiso inicial.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo de seguridad ejecuta escaneos periódicos que identifican software desactualizado y configuraciones inseguras en los servidores, priorizándolos por severidad (ej. CVSS) para remediarlos. ¿Qué proceso están realizando?',
        options: {
          A: 'Vulnerability management',
          B: 'Incident response',
          C: 'Digital forensics',
          D: 'Business continuity planning',
        },
        answer: ['A'],
        explanation:
          'La gestión de vulnerabilidades (vulnerability management) es el proceso continuo de identificar, clasificar (ej. con CVSS), priorizar y remediar debilidades en sistemas, antes de que puedan ser explotadas.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una organización descubre malware que se auto-replica entre equipos de la red sin necesidad de intervención del usuario ni de adjuntarse a un archivo ejecutable existente. ¿Qué tipo de malware es más probable?',
        options: {
          A: 'Virus',
          B: 'Worm (gusano)',
          C: 'Trojan',
          D: 'Adware',
        },
        answer: ['B'],
        explanation:
          'A diferencia de un virus (que requiere adjuntarse a un archivo/programa host y a menudo interacción del usuario), un worm se propaga de forma autónoma a través de la red explotando vulnerabilidades, sin necesitar un archivo huésped.',
        domain: 'Threats, Vulnerabilities, and Mitigations',
        difficulty: 'medium',
      },

      // ── Dominio 3: Security Architecture — 18% (5) ─────────────────────
      {
        type: 'multiple',
        question:
          'En un modelo de responsabilidad compartida de un proveedor cloud IaaS, ¿de quién es la responsabilidad de parchear el sistema operativo de una máquina virtual?',
        options: {
          A: 'Del proveedor cloud, siempre',
          B: 'Del cliente, ya que la seguridad "en la nube" (SO, aplicaciones, datos, configuración) es responsabilidad del cliente en modelos IaaS',
          C: 'De un tercero neutral designado por el gobierno',
          D: 'Nadie es responsable, se parchea automáticamente sin excepción',
        },
        answer: ['B'],
        explanation:
          'En IaaS, el proveedor cloud asegura la infraestructura física, red y virtualización ("seguridad DE la nube"); el cliente es responsable del sistema operativo, parches, configuración de red y datos ("seguridad EN la nube").',
        domain: 'Security Architecture',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una arquitectura de red segmenta la red interna en múltiples zonas aisladas (ej. VLANs) según función y sensibilidad, limitando el movimiento lateral de un atacante si compromete un segmento. ¿Cómo se llama esta estrategia?',
        options: {
          A: 'Network segmentation',
          B: 'Single sign-on',
          C: 'Load balancing',
          D: 'Data masking',
        },
        answer: ['A'],
        explanation:
          'La segmentación de red divide la red en zonas más pequeñas y controladas (VLANs, subredes, microsegmentación), limitando cuánto puede moverse lateralmente un atacante si compromete un solo segmento.',
        domain: 'Security Architecture',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una organización aplica múltiples capas de controles de seguridad (firewall perimetral, IDS, antivirus en endpoint, políticas de acceso) de forma que si una capa falla, otra sigue protegiendo el sistema. ¿Qué concepto de arquitectura de seguridad ejemplifica esto?',
        options: {
          A: 'Defense in depth',
          B: 'Single point of failure',
          C: 'Air gapping',
          D: 'Data sovereignty',
        },
        answer: ['A'],
        explanation:
          'Defense in depth (defensa en profundidad) implica implementar múltiples capas independientes de controles de seguridad, de modo que la falla de una sola capa no comprometa todo el sistema.',
        domain: 'Security Architecture',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una zona de red diseñada para exponer servicios públicos (ej. un servidor web) aislándolos de la red interna, de forma que si es comprometida el atacante no obtiene acceso directo a los sistemas internos, se conoce como:',
        options: {
          A: 'VPN',
          B: 'DMZ (Demilitarized Zone)',
          C: 'Honeypot',
          D: 'Jump box',
        },
        answer: ['B'],
        explanation:
          'Una DMZ es un segmento de red intermedio entre internet y la red interna, donde se alojan servicios expuestos públicamente, aislándolos para que su eventual compromiso no otorgue acceso directo a la red interna.',
        domain: 'Security Architecture',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa despliega un sistema señuelo que simula ser un servidor vulnerable real, con el objetivo de detectar y estudiar el comportamiento de atacantes sin arriesgar sistemas de producción. ¿Cómo se llama esta técnica?',
        options: {
          A: 'Honeypot',
          B: 'Load balancer',
          C: 'Reverse proxy',
          D: 'Content Delivery Network',
        },
        answer: ['A'],
        explanation:
          'Un honeypot es un sistema deliberadamente configurado para parecer vulnerable y atractivo para atacantes, usado para detectar, desviar y estudiar intentos de intrusión sin exponer activos reales.',
        domain: 'Security Architecture',
        difficulty: 'medium',
      },

      // ── Dominio 4: Security Operations — 28% (8) ───────────────────────
      {
        type: 'multiple',
        question:
          'Un administrador reduce la superficie de ataque de un servidor recién instalado deshabilitando servicios innecesarios, cerrando puertos no usados y eliminando cuentas por defecto. ¿Cómo se llama este proceso?',
        options: {
          A: 'Hardening',
          B: 'Patching',
          C: 'Provisioning',
          D: 'Decommissioning',
        },
        answer: ['A'],
        explanation:
          'El hardening (endurecimiento) es el proceso de reducir la superficie de ataque de un sistema: deshabilitar servicios y puertos innecesarios, eliminar cuentas/credenciales por defecto y aplicar configuraciones seguras.',
        domain: 'Security Operations',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una organización exige que, para acceder a sistemas críticos, el usuario proporcione su contraseña Y un código temporal generado en su teléfono. ¿Qué control de seguridad es este?',
        options: {
          A: 'Single Sign-On (SSO)',
          B: 'Multi-Factor Authentication (MFA)',
          C: 'Role-Based Access Control (RBAC) únicamente',
          D: 'Federation',
        },
        answer: ['B'],
        explanation:
          'MFA requiere al menos dos factores de autenticación distintos (algo que sabes, algo que tienes, algo que eres) — en este caso, contraseña (algo que sabes) + código de un dispositivo (algo que tienes).',
        domain: 'Security Operations',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un analista de seguridad usa una herramienta que centraliza y correlaciona logs de múltiples fuentes (firewalls, servidores, endpoints) para detectar patrones de ataque en tiempo casi real. ¿Qué tipo de herramienta es?',
        options: {
          A: 'SIEM (Security Information and Event Management)',
          B: 'VPN concentrator',
          C: 'DLP (Data Loss Prevention) exclusivamente',
          D: 'Load balancer',
        },
        answer: ['A'],
        explanation:
          'Un SIEM agrega y correlaciona eventos y logs de múltiples fuentes de la organización, aplicando reglas y analítica para detectar patrones sospechosos y generar alertas de seguridad centralizadas.',
        domain: 'Security Operations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un empleado del departamento de finanzas necesita acceso a cierto sistema. En vez de asignarle permisos individuales, se le agrega a un grupo "Finanzas" que ya tiene los permisos predefinidos para esa función. ¿Qué modelo de control de acceso es este?',
        options: {
          A: 'Discretionary Access Control (DAC)',
          B: 'Role-Based Access Control (RBAC)',
          C: 'Mandatory Access Control (MAC)',
          D: 'Rule-Based Access Control únicamente por IP',
        },
        answer: ['B'],
        explanation:
          'RBAC asigna permisos a roles (ej. "Finanzas", "RRHH") en vez de a usuarios individuales; los usuarios heredan los permisos del rol al que pertenecen, simplificando la administración y auditoría de accesos.',
        domain: 'Security Operations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo de seguridad detecta una brecha activa y sigue un proceso estructurado: identificación, contención, erradicación, recuperación y lecciones aprendidas. ¿Qué proceso están ejecutando?',
        options: {
          A: 'Change management',
          B: 'Incident response',
          C: 'Business impact analysis',
          D: 'Penetration testing',
        },
        answer: ['B'],
        explanation:
          'El ciclo de respuesta a incidentes (incident response) sigue fases estándar —preparación, identificación, contención, erradicación, recuperación y lecciones aprendidas— para manejar de forma estructurada una brecha de seguridad activa.',
        domain: 'Security Operations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa configura copias de sus datos críticos en una ubicación físicamente distinta y las prueba periódicamente restaurándolas, como parte de su plan ante desastres. ¿Qué elemento del plan de continuidad de negocio están asegurando?',
        options: {
          A: 'Non-repudiation',
          B: 'Backup and recovery (con pruebas de restauración)',
          C: 'Segmentation',
          D: 'Steganography',
        },
        answer: ['B'],
        explanation:
          'Mantener backups en ubicaciones separadas y probar activamente su restauración es parte central de un plan de continuidad de negocio/recuperación ante desastres — un backup nunca probado no garantiza poder recuperarse realmente.',
        domain: 'Security Operations',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un analista forense necesita preservar la integridad de la evidencia digital de un incidente para que sea admisible legalmente, documentando quién tuvo acceso a ella y cuándo. ¿Qué concepto describe este proceso de documentación?',
        options: {
          A: 'Chain of custody',
          B: 'Non-repudiation',
          C: 'Data classification',
          D: 'Tokenization',
        },
        answer: ['A'],
        explanation:
          'La cadena de custodia (chain of custody) documenta de forma detallada quién recolectó, manejó y almacenó cada pieza de evidencia digital y cuándo, garantizando su integridad y admisibilidad legal.',
        domain: 'Security Operations',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa configura reglas para bloquear automáticamente el envío de correos que contengan números de tarjeta de crédito fuera de la organización. ¿Qué tipo de control de seguridad es?',
        options: {
          A: 'Data Loss Prevention (DLP)',
          B: 'Intrusion Detection System (IDS) únicamente',
          C: 'Network Access Control (NAC)',
          D: 'Certificate pinning',
        },
        answer: ['A'],
        explanation:
          'Las herramientas de DLP (Data Loss Prevention) inspeccionan el tráfico saliente (correo, archivos) buscando patrones de datos sensibles (ej. números de tarjeta) y bloquean o alertan para evitar fugas de información.',
        domain: 'Security Operations',
        difficulty: 'medium',
      },

      // ── Dominio 5: Security Program Management and Oversight — 20% (6) ─
      {
        type: 'multiple',
        question:
          'Una empresa exige que una misma persona nunca pueda, por sí sola, iniciar Y aprobar una transferencia bancaria — se requieren dos personas distintas. ¿Qué principio de control interno se está aplicando?',
        options: {
          A: 'Separation of duties',
          B: 'Least privilege',
          C: 'Non-repudiation',
          D: 'Data minimization',
        },
        answer: ['A'],
        explanation:
          'La separación de funciones (separation of duties) divide tareas críticas entre distintas personas para que ninguna, por sí sola, pueda cometer o encubrir fraude o error sin colusión con otra persona.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Antes de contratar a un proveedor externo que manejará datos sensibles de clientes, el equipo legal y de seguridad evalúa sus controles de seguridad y firma un acuerdo que define responsabilidades y niveles de servicio. ¿Qué proceso describe esto?',
        options: {
          A: 'Third-party risk management, incluyendo due diligence y SLAs/contratos',
          B: 'Penetration testing interno',
          C: 'Vulnerability scanning automatizado',
          D: 'Disaster recovery testing',
        },
        answer: ['A'],
        explanation:
          'La gestión de riesgo de terceros (third-party/vendor risk management) implica evaluar (due diligence) los controles de seguridad de un proveedor antes de contratarlo, y formalizar responsabilidades mediante contratos y SLAs.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una organización que procesa pagos con tarjeta debe cumplir con un estándar específico de seguridad de datos de la industria de tarjetas de pago. ¿A qué marco de cumplimiento se refiere?',
        options: {
          A: 'PCI DSS',
          B: 'HIPAA',
          C: 'FERPA',
          D: 'COPPA',
        },
        answer: ['A'],
        explanation:
          'PCI DSS (Payment Card Industry Data Security Standard) es el estándar que deben cumplir las organizaciones que almacenan, procesan o transmiten datos de tarjetas de pago, definiendo requisitos técnicos y operativos de seguridad.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito principal de una evaluación de riesgos (risk assessment) dentro de un programa de seguridad?',
        options: {
          A: 'Eliminar por completo todo riesgo de la organización',
          B: 'Identificar, analizar y priorizar los riesgos (probabilidad × impacto) para decidir cómo tratarlos: mitigar, transferir, aceptar o evitar',
          C: 'Reemplazar la necesidad de tener políticas de seguridad escritas',
          D: 'Aplicar exclusivamente a riesgos financieros, no de TI',
        },
        answer: ['B'],
        explanation:
          'Una evaluación de riesgos identifica amenazas y vulnerabilidades, estima su probabilidad e impacto, y prioriza los riesgos resultantes para decidir la estrategia de tratamiento: mitigar, transferir (ej. seguro), aceptar o evitar — nunca elimina el riesgo por completo.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué documento define las reglas de comportamiento aceptable que los empleados deben seguir al usar los sistemas y recursos de TI de la organización?',
        options: {
          A: 'Acceptable Use Policy (AUP)',
          B: 'Business Impact Analysis (BIA)',
          C: 'Service Level Agreement (SLA)',
          D: 'Memorandum of Understanding (MOU)',
        },
        answer: ['A'],
        explanation:
          'La Acceptable Use Policy (AUP) establece explícitamente qué usos de los sistemas y recursos de TI están permitidos y prohibidos para los empleados, siendo un documento de gobernanza fundamental de todo programa de seguridad.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una empresa realiza capacitaciones periódicas obligatorias y simulacros de phishing para todos los empleados, sin importar su cargo. ¿Qué objetivo del programa de seguridad busca principalmente esta práctica?',
        options: {
          A: 'Cumplir un requisito puramente decorativo sin impacto real en el riesgo',
          B: 'Reducir el riesgo asociado al factor humano, generalmente el eslabón más débil de la cadena de seguridad, mediante security awareness training',
          C: 'Reemplazar la necesidad de controles técnicos como firewalls',
          D: 'Evaluar el desempeño laboral de los empleados en temas no relacionados con seguridad',
        },
        answer: ['B'],
        explanation:
          'Los programas de concientización en seguridad (security awareness training), incluyendo simulacros de phishing, buscan reducir el riesgo del factor humano —frecuentemente el vector de entrada más explotado— complementando (no reemplazando) los controles técnicos.',
        domain: 'Security Program Management and Oversight',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'certified-ethical-hacker-basics',
    title: 'Certified Ethical Hacker (CEH) — Fundamentos',
    description: 'Examen de práctica alineado a los 5 dominios del CEH v13 (312-50): fases del hacking ético, herramientas y metodologías de pentesting.',
    domain: 'security', category: 'ethical-hacking', level: 'advanced', language: 'es',
    tags: ['ceh', 'pentesting', 'hacking', 'ceh-v13'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en EC-Council CEH v13 (312-50) Exam Blueprint v5.0, vigente desde sep-2024 — eccouncil.org/programs/certified-ethical-hacker-ceh (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es el orden correcto de las cinco fases clásicas del hacking ético?', options: { A: 'Reconocimiento → Escaneo → Obtener acceso → Mantener acceso → Cubrir huellas', B: 'Escaneo → Reconocimiento → Cubrir huellas → Obtener acceso → Mantener acceso', C: 'Obtener acceso → Reconocimiento → Escaneo → Mantener acceso → Cubrir huellas', D: 'Mantener acceso → Obtener acceso → Escaneo → Reconocimiento → Cubrir huellas' }, answer: ['A'], explanation: 'El orden metodológico estándar es: reconocimiento (recopilar información), escaneo (identificar hosts/puertos/vulnerabilidades activas), obtener acceso (explotar), mantener acceso (persistencia) y cubrir huellas (eliminar evidencia de la intrusión).', domain: 'Background', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué diferencia hay entre reconocimiento pasivo y activo?', options: { A: 'El pasivo recopila información sin interactuar directamente con el objetivo (ej. OSINT, WHOIS); el activo implica interacción directa (ej. escaneo de puertos), con mayor riesgo de detección', B: 'Son exactamente lo mismo', C: 'El reconocimiento activo nunca puede ser detectado', D: 'El pasivo requiere acceso administrativo al sistema objetivo' }, answer: ['A'], explanation: 'El reconocimiento pasivo obtiene información sin tocar directamente los sistemas del objetivo (búsquedas públicas, redes sociales, WHOIS); el activo (ej. ping sweeps, escaneo de puertos) interactúa directamente y es más fácil de detectar por el objetivo.', domain: 'Background', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es el "footprinting" en la fase de reconocimiento?', options: { A: 'El proceso de recolectar la mayor cantidad de información posible sobre un objetivo (dominios, IPs, empleados, tecnologías) antes de un ataque', B: 'Un sinónimo de explotación directa de vulnerabilidades', C: 'Un tipo de malware', D: 'El proceso de eliminar evidencia tras un ataque' }, answer: ['A'], explanation: 'El footprinting es la recolección sistemática de información pública y semi-pública sobre el objetivo, construyendo un "mapa" de su superficie de ataque antes de intentar cualquier explotación.', domain: 'Analysis/Assessment', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué técnica de enumeración permite descubrir usuarios, grupos y recursos compartidos en un sistema Windows/red mediante consultas a servicios como SMB o LDAP?', options: { A: 'Enumeración (enumeration)', B: 'Fuzzing', C: 'Sniffing pasivo únicamente', D: 'Steganografía' }, answer: ['A'], explanation: 'La enumeración va más allá del footprinting: establece conexiones activas con servicios (SMB, LDAP, SNMP) para extraer detalles específicos como nombres de usuario, grupos, recursos compartidos y configuraciones.', domain: 'Analysis/Assessment', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta es ampliamente usada para escaneo de puertos y descubrimiento de servicios en una red durante la fase de escaneo?', options: { A: 'Nmap', B: 'Wireshark exclusivamente', C: 'John the Ripper', D: 'Hydra' }, answer: ['A'], explanation: 'Nmap es la herramienta estándar de la industria para descubrimiento de hosts, escaneo de puertos e identificación de servicios/versiones en una red, base de la fase de escaneo del hacking ético.', domain: 'Tools/Systems', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué tipo de malware se replica automáticamente entre sistemas a través de la red, sin necesidad de un archivo huésped ni intervención del usuario?', options: { A: 'Virus', B: 'Worm (gusano)', C: 'Rootkit', D: 'Adware' }, answer: ['B'], explanation: 'Un worm se propaga de forma autónoma explotando vulnerabilidades de red, a diferencia de un virus que requiere adjuntarse a un archivo/programa existente y a menudo interacción del usuario.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un ataque de "sniffing" en el contexto de seguridad de redes?', options: { A: 'Capturar y analizar el tráfico de red que pasa por un segmento, potencialmente exponiendo datos sensibles no cifrados', B: 'Un tipo de ataque de fuerza bruta contra contraseñas', C: 'Un método de escalación de privilegios exclusivamente en Linux', D: 'Un sinónimo de phishing' }, answer: ['A'], explanation: 'El sniffing captura paquetes de red que atraviesan un segmento (ej. con Wireshark), permitiendo al atacante analizar tráfico no cifrado en busca de credenciales u otra información sensible.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué técnica de ingeniería social implica investigar a fondo a una víctima específica para crear un ataque de phishing altamente personalizado y creíble?', options: { A: 'Spear phishing', B: 'Vishing genérico', C: 'Whaling exclusivamente hacia ejecutivos de nivel medio', D: 'Smishing masivo' }, answer: ['A'], explanation: 'El spear phishing dirige el ataque a una persona u organización específica, usando información investigada previamente sobre la víctima para aumentar la credibilidad del engaño, a diferencia del phishing masivo genérico.', domain: 'Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta es comúnmente usada como framework de explotación, permitiendo automatizar la ejecución de exploits contra vulnerabilidades conocidas?', options: { A: 'Metasploit Framework', B: 'Excel', C: 'Photoshop', D: 'Slack' }, answer: ['A'], explanation: 'Metasploit es un framework de explotación ampliamente usado en pentesting ético, con una amplia base de módulos de exploits, payloads y post-explotación para probar la seguridad de sistemas de forma autorizada.', domain: 'Tools/Systems', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta se usa comúnmente para realizar ataques de fuerza bruta contra credenciales de servicios de red (ej. SSH, FTP)?', options: { A: 'Hydra', B: 'Nmap exclusivamente', C: 'Wireshark', D: 'Nessus exclusivamente' }, answer: ['A'], explanation: 'Hydra es una herramienta de fuerza bruta que prueba sistemáticamente combinaciones de credenciales contra múltiples protocolos de red (SSH, FTP, HTTP-forms), usada en pentesting autorizado para evaluar la robustez de contraseñas.', domain: 'Tools/Systems', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta de escaneo de vulnerabilidades identifica automáticamente debilidades conocidas en sistemas y las prioriza por severidad?', options: { A: 'Nessus (o OpenVAS)', B: 'Photoshop', C: 'Microsoft Word', D: 'Slack' }, answer: ['A'], explanation: 'Nessus y OpenVAS son escáneres de vulnerabilidades que comparan la configuración/versión de software de un sistema contra bases de datos de vulnerabilidades conocidas (CVE), generando reportes priorizados por severidad.', domain: 'Tools/Systems', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un ataque de "SQL Injection" y qué lo hace posible?', options: { A: 'Inyectar código SQL malicioso a través de un campo de entrada no validado/sanitizado, alterando la lógica de la consulta a la base de datos', B: 'Un ataque exclusivo contra bases de datos NoSQL', C: 'Un tipo de ataque de denegación de servicio', D: 'Un ataque que solo afecta a servidores DNS' }, answer: ['A'], explanation: 'SQL Injection ocurre cuando la entrada del usuario se concatena sin sanitizar/parametrizar en una consulta SQL, permitiendo al atacante alterar la lógica de la consulta para extraer, modificar o eliminar datos no autorizados.', domain: 'Procedures/Methodology', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué técnica permite a un atacante, tras obtener acceso inicial limitado, obtener privilegios administrativos explotando una falla del sistema operativo o una mala configuración?', options: { A: 'Privilege escalation', B: 'Footprinting', C: 'Steganografía', D: 'Reconocimiento pasivo' }, answer: ['A'], explanation: 'La escalación de privilegios es la fase donde el atacante, con acceso inicial limitado, busca elevar sus permisos (vertical) o moverse a otras cuentas del mismo nivel (horizontal) para expandir su control sobre el sistema comprometido.', domain: 'Procedures/Methodology', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "rootkit" y por qué es especialmente peligroso?', options: { A: 'Software malicioso diseñado para ocultar su presencia y la de otros procesos/archivos maliciosos, obteniendo control de bajo nivel del sistema (a menudo a nivel de kernel), dificultando su detección', B: 'Un tipo de firewall', C: 'Una herramienta legítima de administración de sistemas sin ningún riesgo', D: 'Un sinónimo de antivirus' }, answer: ['A'], explanation: 'Un rootkit se instala con privilegios elevados (a menudo a nivel de kernel) y modifica el comportamiento del sistema operativo para ocultarse a sí mismo y a otros componentes maliciosos, siendo notoriamente difícil de detectar con herramientas convencionales.', domain: 'Security', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué acción realiza un atacante en la fase de "covering tracks" (cubrir huellas)?', options: { A: 'Eliminar o modificar logs del sistema, deshabilitar auditoría o usar técnicas de esteganografía, para evitar ser detectado o identificado tras el ataque', B: 'Escanear puertos abiertos', C: 'Investigar información pública de la empresa objetivo', D: 'Instalar software antivirus en el sistema comprometido' }, answer: ['A'], explanation: 'Cubrir huellas busca eliminar evidencia de la intrusión (limpiar logs, deshabilitar auditoría, ocultar archivos) para dificultar la detección forense y prolongar el acceso no autorizado sin ser descubierto.', domain: 'Procedures/Methodology', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "zero-day exploit"?', options: { A: 'Un exploit que aprovecha una vulnerabilidad conocida y ya parchada hace años', B: 'Un exploit que aprovecha una vulnerabilidad desconocida públicamente y para la cual el proveedor aún no ha lanzado un parche, dando "cero días" de tiempo de reacción', C: 'Un tipo de ataque que solo funciona el primer día de lanzado un sistema', D: 'Un sinónimo de ataque de fuerza bruta' }, answer: ['B'], explanation: 'Un zero-day exploit aprovecha una vulnerabilidad que el proveedor del software aún desconoce o no ha parcheado, siendo especialmente peligroso porque no existen defensas específicas disponibles al momento del ataque.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué se debe incluir obligatoriamente en un contrato/acuerdo previo a realizar un pentest ético, definiendo el alcance y los límites legales de las pruebas?', options: { A: 'Rules of Engagement (RoE) y un acuerdo de autorización firmado', B: 'Nada, basta con el acuerdo verbal', C: 'Solo el precio del servicio', D: 'Una lista de empleados de la empresa cliente' }, answer: ['A'], explanation: 'Las Rules of Engagement definen formalmente el alcance autorizado, sistemas incluidos/excluidos, ventanas de tiempo y límites legales del pentest, siendo un requisito ético y legal indispensable antes de realizar cualquier prueba ofensiva autorizada.', domain: 'Background', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre un "black hat", un "white hat" y un "grey hat" hacker?', options: { A: 'Black hat actúa con intención maliciosa y sin autorización; white hat (ethical hacker) actúa con autorización explícita para mejorar la seguridad; grey hat opera en una zona ambigua, a veces sin autorización pero sin intención maliciosa declarada', B: 'Son términos sin ninguna diferencia real', C: 'White hat siempre actúa sin autorización', D: 'Grey hat es sinónimo exacto de black hat' }, answer: ['A'], explanation: 'La distinción central es la autorización e intención: white hat opera con consentimiento explícito y objetivo defensivo; black hat actúa maliciosamente sin autorización; grey hat se ubica en un área intermedia, a veces descubriendo fallos sin autorización pero sin explotarlos maliciosamente.', domain: 'Background', difficulty: 'easy' },
    ],
  },
  {
    slug: 'cissp-domain-fundamentals',
    title: 'CISSP — Fundamentos por Dominio',
    description: 'Examen de práctica alineado a los 8 dominios oficiales del CBK de (ISC)² para la certificación CISSP.',
    domain: 'security', category: 'security-management', level: 'advanced', language: 'es',
    tags: ['cissp', 'isc2', 'infosec'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en (ISC)² CISSP Common Body of Knowledge (CBK), actualizado abr-2024 — isc2.org/certifications/cissp (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué modelo de seguridad describe la tríada fundamental de Confidencialidad, Integridad y Disponibilidad, base de todo el CBK de CISSP?', options: { A: 'CIA Triad', B: 'AAA (Authentication, Authorization, Accounting)', C: 'OSI Model', D: 'CVSS' }, answer: ['A'], explanation: 'La CIA Triad (Confidentiality, Integrity, Availability) es el modelo fundacional que sustenta prácticamente todos los dominios del CBK, guiando las decisiones de diseño y control de seguridad.', domain: 'Security and Risk Management', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué proceso identifica, analiza y prioriza los riesgos de una organización según su probabilidad e impacto, para decidir cómo tratarlos?', options: { A: 'Risk Assessment (evaluación de riesgos)', B: 'Penetration testing', C: 'Data classification', D: 'Business continuity testing' }, answer: ['A'], explanation: 'La evaluación de riesgos (risk assessment) identifica amenazas y vulnerabilidades, estima su probabilidad e impacto, y prioriza los riesgos resultantes para decidir la estrategia de tratamiento (mitigar, transferir, aceptar, evitar).', domain: 'Security and Risk Management', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es la "clasificación de datos" (data classification) y por qué es fundamental en Asset Security?', options: { A: 'Categorizar la información según su sensibilidad (ej. público, confidencial, secreto) para aplicar controles de protección proporcionales a su valor/riesgo', B: 'Un proceso exclusivo para clasificar hardware, no datos', C: 'Un sinónimo de cifrado de datos', D: 'Un proceso que solo aplica a bases de datos relacionales' }, answer: ['A'], explanation: 'La clasificación de datos categoriza la información según su sensibilidad, permitiendo aplicar controles de seguridad proporcionales (más estrictos para datos más sensibles) en vez de un enfoque uniforme ineficiente para todos los activos de información.', domain: 'Asset Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué principio arquitectónico establece que un sistema debe seguir funcionando de forma segura incluso ante un fallo de un componente (ej. denegando acceso por defecto)?', options: { A: 'Fail secure (o fail closed)', B: 'Fail open siempre', C: 'Security through obscurity', D: 'Defense in depth exclusivamente sin ningún otro principio' }, answer: ['A'], explanation: '"Fail secure" (fail closed) establece que, ante un fallo del sistema o control de seguridad, el estado por defecto debe ser el más restrictivo/seguro (ej. denegar acceso), en vez de "fail open" que permitiría acceso no controlado ante un fallo.', domain: 'Security Architecture and Engineering', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "defensa en profundidad" (defense in depth) como principio de arquitectura de seguridad?', options: { A: 'Implementar múltiples capas independientes de controles de seguridad, de forma que la falla de una capa no comprometa todo el sistema', B: 'Confiar en un único firewall perimetral robusto como única defensa', C: 'Un sinónimo de cifrado end-to-end', D: 'Un principio exclusivo de seguridad física' }, answer: ['A'], explanation: 'Defense in depth implica capas redundantes de controles (perimetrales, de red, de host, de aplicación, de datos), de modo que si una capa falla, otras siguen protegiendo el sistema.', domain: 'Security Architecture and Engineering', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué protocolo opera en la capa de transporte proveyendo cifrado, siendo la base de HTTPS?', options: { A: 'TLS (Transport Layer Security)', B: 'FTP', C: 'SNMP', D: 'ARP' }, answer: ['A'], explanation: 'TLS cifra la comunicación a nivel de transporte, siendo el protocolo subyacente que hace posible HTTPS (HTTP sobre TLS), protegiendo confidencialidad e integridad del tráfico entre cliente y servidor.', domain: 'Communication and Network Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es una VPN de tipo "site-to-site" y en qué se diferencia de una VPN de "acceso remoto" (client-to-site)?', options: { A: 'Una VPN site-to-site conecta permanentemente dos redes completas (ej. dos oficinas); una de acceso remoto conecta un dispositivo individual de un usuario a una red corporativa', B: 'Son exactamente lo mismo', C: 'Site-to-site solo funciona con IPv6', D: 'Acceso remoto conecta dos redes completas, no dispositivos individuales' }, answer: ['A'], explanation: 'Una VPN site-to-site establece un túnel permanente entre dos redes/gateways completos (ej. dos sedes de una empresa); una VPN de acceso remoto conecta el dispositivo de un usuario individual a la red corporativa de forma bajo demanda.', domain: 'Communication and Network Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué modelo de control de acceso asigna permisos basándose en el rol organizacional del usuario (ej. "Contador", "Gerente"), simplificando la administración?', options: { A: 'RBAC (Role-Based Access Control)', B: 'MAC (Mandatory Access Control) exclusivamente', C: 'DAC (Discretionary Access Control) exclusivamente', D: 'No existe ningún modelo basado en roles' }, answer: ['A'], explanation: 'RBAC asigna permisos a roles predefinidos (no a usuarios individuales directamente); los usuarios heredan los permisos del rol al que se les asigna, simplificando enormemente la gestión de accesos a gran escala.', domain: 'Identity and Access Management (IAM)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre autenticación multifactor (MFA) y autenticación de dos factores (2FA)?', options: { A: '2FA es un caso específico de MFA que usa exactamente dos factores; MFA es el término general que puede incluir dos o más factores de distintas categorías (algo que sabes, tienes, eres)', B: 'Son conceptos completamente distintos sin relación', C: 'MFA solo aplica a sistemas bancarios', D: '2FA es más seguro que cualquier implementación de MFA' }, answer: ['A'], explanation: '2FA es técnicamente un subconjunto de MFA que usa específicamente dos factores; MFA es el término más general que abarca dos o más factores de autenticación de categorías distintas (conocimiento, posesión, inherencia).', domain: 'Identity and Access Management (IAM)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tipo de prueba de seguridad simula un ataque real contra los sistemas de una organización, con el objetivo de identificar vulnerabilidades explotables, no solo listarlas?', options: { A: 'Vulnerability scanning pasivo', B: 'Penetration testing', C: 'Code review estático únicamente', D: 'Auditoría de cumplimiento documental' }, answer: ['B'], explanation: 'El pentesting va más allá de un escaneo de vulnerabilidades (que solo identifica debilidades potenciales): intenta activamente explotarlas para demostrar el impacto real y validar si los controles existentes son efectivos.', domain: 'Security Assessment and Testing', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un "Key Performance Indicator" (KPI) de seguridad y por qué es relevante en el dominio de Security Assessment and Testing?', options: { A: 'Una métrica cuantificable (ej. tiempo promedio de detección de incidentes, % de sistemas parcheados) que permite medir objetivamente la efectividad de los controles y procesos de seguridad a lo largo del tiempo', B: 'Un sinónimo de vulnerabilidad crítica', C: 'Un tipo de firewall', D: 'Un documento legal exclusivamente' }, answer: ['A'], explanation: 'Los KPIs de seguridad (ej. MTTD, % de parcheo, resultados de auditorías) permiten medir objetivamente si los controles y procesos de seguridad están funcionando efectivamente, más allá de auditorías puntuales.', domain: 'Security Assessment and Testing', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué proceso de Security Operations gestiona el ciclo de vida de un incidente, desde su detección hasta la recuperación y lecciones aprendidas?', options: { A: 'Incident Response Management', B: 'Change Management exclusivamente', C: 'Capacity Planning', D: 'Vendor Management' }, answer: ['A'], explanation: 'La gestión de respuesta a incidentes cubre el ciclo completo: preparación, detección/análisis, contención, erradicación, recuperación y lecciones aprendidas, minimizando el impacto de incidentes de seguridad.', domain: 'Security Operations', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un "runbook" (o playbook) de operaciones de seguridad?', options: { A: 'Un documento con procedimientos paso a paso predefinidos para responder a un tipo específico de incidente o evento operativo recurrente', B: 'Un sinónimo de código fuente', C: 'Un tipo de firewall físico', D: 'Un registro exclusivamente financiero' }, answer: ['A'], explanation: 'Un runbook/playbook define procedimientos estandarizados y repetibles para responder a escenarios específicos (ej. "ransomware detectado", "cuenta comprometida"), acelerando y estandarizando la respuesta del equipo de operaciones.', domain: 'Security Operations', difficulty: 'medium' },
      { type: 'multiple', question: '¿En qué etapa del Software Development Lifecycle (SDLC) es más costo-efectivo identificar y corregir vulnerabilidades de seguridad?', options: { A: 'En producción, tras un incidente', B: 'Lo más temprano posible (diseño y desarrollo), siguiendo el principio de "shift left" en seguridad', C: 'Solo durante la fase de mantenimiento', D: 'El momento del SDLC no afecta el costo de corrección' }, answer: ['B'], explanation: 'El principio de "shift left" establece que integrar consideraciones de seguridad desde las fases tempranas del SDLC (diseño, desarrollo) es significativamente más económico que corregir vulnerabilidades descubiertas en producción, donde el costo de remediación (y el riesgo) es mucho mayor.', domain: 'Software Development Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué práctica de desarrollo seguro implica revisar el código fuente de una aplicación en busca de patrones de vulnerabilidades sin ejecutar el programa?', options: { A: 'Static Application Security Testing (SAST)', B: 'Dynamic Application Security Testing (DAST)', C: 'Fuzzing exclusivamente en producción', D: 'Penetration testing de caja negra' }, answer: ['A'], explanation: 'SAST (análisis estático) examina el código fuente sin ejecutarlo, buscando patrones conocidos de vulnerabilidades (ej. SQL injection, uso de funciones inseguras); DAST, en cambio, prueba la aplicación en ejecución desde afuera.', domain: 'Software Development Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué principio de seguridad establece que cada usuario o proceso debe tener únicamente los permisos mínimos necesarios para realizar su función?', options: { A: 'Principle of Least Privilege', B: 'Separation of Duties exclusivamente', C: 'Need to Share', D: 'Full Disclosure' }, answer: ['A'], explanation: 'El principio de menor privilegio limita los permisos de cada identidad (usuario, servicio) al mínimo estrictamente necesario para cumplir su función, reduciendo el impacto potencial si esa identidad se ve comprometida.', domain: 'Security and Risk Management', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es el "Business Continuity Planning" (BCP) y cómo se diferencia del "Disaster Recovery Planning" (DRP)?', options: { A: 'BCP se enfoca en mantener las funciones críticas del NEGOCIO operando durante y después de una interrupción; DRP se enfoca específicamente en restaurar la infraestructura de TECNOLOGÍA/TI tras un desastre — DRP es un subconjunto de BCP', B: 'Son términos idénticos sin ninguna distinción', C: 'DRP es más amplio que BCP', D: 'BCP solo aplica a desastres naturales' }, answer: ['A'], explanation: 'BCP tiene un alcance más amplio, cubriendo la continuidad de todas las funciones críticas del negocio (personas, procesos, proveedores); DRP se enfoca específicamente en la recuperación de sistemas y datos de TI, siendo un componente dentro del plan más amplio de BCP.', domain: 'Security and Risk Management', difficulty: 'hard' },
    ],
  },
  {
    slug: 'penetration-testing-basics',
    title: 'Penetration Testing — Fundamentos',
    description: 'Examen de práctica sobre metodología, herramientas, fases y reporting profesional de pruebas de penetración.',
    domain: 'security', category: 'pentesting', level: 'intermediate', language: 'es',
    tags: ['pentesting', 'red-team', 'offensive'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en PTES (Penetration Testing Execution Standard) + OWASP Testing Guide — pentest-standard.org (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es la diferencia entre un pentest de "caja negra" (black box) y uno de "caja blanca" (white box)?', options: { A: 'En black box el pentester no tiene ningún conocimiento previo del sistema (simula un atacante externo real); en white box tiene acceso completo a documentación, código fuente y arquitectura, permitiendo una evaluación más profunda y exhaustiva', B: 'Son exactamente lo mismo con distinto nombre', C: 'Black box siempre es ilegal, white box siempre es legal', D: 'White box nunca requiere autorización previa' }, answer: ['A'], explanation: 'Black box simula un atacante externo sin conocimiento previo del sistema; white box otorga al pentester acceso completo a información interna (código, arquitectura, credenciales), permitiendo una evaluación más profunda y eficiente en tiempo limitado. Grey box es un punto intermedio con conocimiento parcial.', domain: 'Metodologías y tipos de pentest', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es PTES (Penetration Testing Execution Standard)?', options: { A: 'Un estándar/metodología que define las fases de un pentest profesional: pre-engagement, intelligence gathering, threat modeling, vulnerability analysis, exploitation, post-exploitation y reporting', B: 'Una herramienta específica de escaneo de puertos', C: 'Un tipo de malware', D: 'Un lenguaje de programación' }, answer: ['A'], explanation: 'PTES define un marco metodológico estandarizado con 7 fases para conducir pentests de forma profesional y consistente, desde el acuerdo inicial hasta el reporte final de hallazgos.', domain: 'Metodologías y tipos de pentest', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué actividad de OSINT (Open Source Intelligence) es común en la fase de recopilación de información de un pentest autorizado?', options: { A: 'Explotar directamente una vulnerabilidad del servidor', B: 'Recopilar información pública sobre la organización objetivo (empleados en LinkedIn, registros WHOIS, subdominios, tecnologías usadas) sin interactuar directamente con sus sistemas', C: 'Instalar malware en los sistemas del objetivo', D: 'Eliminar logs del sistema objetivo' }, answer: ['B'], explanation: 'OSINT recopila información disponible públicamente (redes sociales, WHOIS, registros DNS, ofertas de empleo que revelan tecnología usada) sin interactuar directamente con los sistemas del objetivo, construyendo un perfil útil para fases posteriores.', domain: 'Reconocimiento (OSINT, nmap)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué información obtiene un escaneo de puertos con Nmap sobre un host objetivo?', options: { A: 'Qué puertos están abiertos, cerrados o filtrados, y opcionalmente qué servicios/versiones corren en ellos', B: 'Las contraseñas de todos los usuarios del sistema', C: 'El contenido completo de la base de datos', D: 'El código fuente de las aplicaciones' }, answer: ['A'], explanation: 'Nmap identifica el estado de los puertos (abierto/cerrado/filtrado) y, con detección de servicios (-sV), puede identificar qué software y versión corre en cada puerto abierto, información base para buscar vulnerabilidades conocidas.', domain: 'Reconocimiento (OSINT, nmap)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un "payload" en el contexto de explotación con un framework como Metasploit?', options: { A: 'El código que se ejecuta en el sistema objetivo tras explotar exitosamente una vulnerabilidad, dando al atacante control (ej. una reverse shell)', B: 'Un sinónimo de vulnerabilidad', C: 'El nombre del reporte final del pentest', D: 'Un tipo de escaneo de red' }, answer: ['A'], explanation: 'El payload es el código entregado y ejecutado en el sistema comprometido tras una explotación exitosa, otorgando al atacante (o pentester autorizado) capacidades de control, como una shell remota.', domain: 'Explotación (Metasploit)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es una "reverse shell" y por qué se usa frecuentemente en explotación en lugar de una "bind shell"?', options: { A: 'Una reverse shell hace que el sistema comprometido inicie la conexión de vuelta hacia el atacante, lo cual suele evadir mejor firewalls que solo bloquean conexiones entrantes al objetivo (a diferencia de bind shell, donde el objetivo escucha y el atacante se conecta a él)', B: 'Son exactamente lo mismo', C: 'Una reverse shell siempre requiere privilegios de administrador', D: 'Bind shell es más difícil de detectar que reverse shell' }, answer: ['A'], explanation: 'En una reverse shell, el sistema comprometido inicia la conexión saliente hacia el atacante; esto suele evadir mejor firewalls perimetrales configurados para bloquear conexiones entrantes no solicitadas, a diferencia de una bind shell donde el objetivo abre un puerto a la espera de conexión.', domain: 'Explotación (Metasploit)', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué actividad se realiza durante la fase de "post-explotación" de un pentest?', options: { A: 'Recopilar información pública inicial sobre el objetivo', B: 'Determinar el valor real del sistema comprometido, buscar escalar privilegios, moverse lateralmente, y recopilar evidencia del impacto potencial, manteniendo siempre el alcance autorizado', C: 'Firmar el contrato del pentest', D: 'Entregar el reporte final al cliente' }, answer: ['B'], explanation: 'La post-explotación evalúa el impacto real del acceso obtenido: qué datos son accesibles, si se puede escalar privilegios o moverse lateralmente a otros sistemas, siempre dentro del alcance definido en las Rules of Engagement.', domain: 'Post-explotación', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "movimiento lateral" (lateral movement) en la fase de post-explotación?', options: { A: 'Técnicas para moverse desde el sistema inicialmente comprometido hacia otros sistemas dentro de la misma red, expandiendo el alcance del acceso obtenido', B: 'Un sinónimo de escalación vertical de privilegios exclusivamente', C: 'El proceso de eliminar evidencia', D: 'Un tipo de ataque de denegación de servicio' }, answer: ['A'], explanation: 'El movimiento lateral usa las credenciales o el acceso obtenido en un sistema comprometido para acceder a otros sistemas de la misma red, simulando cómo un atacante real expandiría su control tras el compromiso inicial.', domain: 'Escalación de privilegios', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre escalación de privilegios "vertical" y "horizontal"?', options: { A: 'La vertical obtiene mayores permisos que los originales (ej. de usuario a administrador); la horizontal obtiene acceso a recursos de otro usuario del mismo nivel de privilegio, sin necesariamente aumentar el nivel de permisos', B: 'Son sinónimos exactos', C: 'La horizontal siempre requiere acceso físico al servidor', D: 'La vertical solo aplica a bases de datos' }, answer: ['A'], explanation: 'La escalación vertical eleva el nivel de privilegio del atacante (ej. usuario estándar a administrador); la horizontal accede a recursos/cuentas de otros usuarios del mismo nivel de privilegio (ej. acceder a los datos de otro usuario regular).', domain: 'Escalación de privilegios', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué elemento es indispensable en un reporte profesional de pentest, más allá de la lista técnica de vulnerabilidades encontradas?', options: { A: 'Un resumen ejecutivo orientado a negocio, priorización por riesgo/impacto real, y recomendaciones de remediación accionables', B: 'Solo capturas de pantalla sin ningún texto explicativo', C: 'El código fuente completo de todas las herramientas usadas', D: 'Ningún resumen, solo el output crudo de las herramientas' }, answer: ['A'], explanation: 'Un reporte profesional debe incluir un resumen ejecutivo comprensible para stakeholders no técnicos, priorización de hallazgos por riesgo real de negocio (no solo severidad técnica) y recomendaciones concretas y accionables de remediación, no solo un volcado técnico de herramientas.', domain: 'Reporting profesional', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué es crítico definir claramente el "marco legal y reglas de engagement" antes de iniciar cualquier actividad de pentesting?', options: { A: 'No es realmente necesario si el pentester confía en su propio juicio', B: 'Porque realizar pruebas de intrusión sin autorización explícita, aunque sea con buenas intenciones, constituye un delito informático en la mayoría de jurisdicciones, y las RoE protegen tanto al cliente como al pentester delimitando el alcance legal', C: 'Solo aplica en Estados Unidos', D: 'Las reglas de engagement son opcionales si el pentest es "ético"' }, answer: ['B'], explanation: 'Acceder o intentar comprometer sistemas sin autorización explícita constituye un delito en la mayoría de las legislaciones, sin importar la intención; las Rules of Engagement documentan formalmente la autorización, alcance y límites, protegiendo legalmente tanto al cliente como al equipo de pentest.', domain: 'Marco legal y reglas de engagement', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es el "OWASP Testing Guide" y para qué tipo de pentest es particularmente relevante?', options: { A: 'Una metodología y checklist detallado orientado específicamente a pruebas de seguridad de aplicaciones web', B: 'Un estándar exclusivo para redes inalámbricas', C: 'Un framework de explotación como Metasploit', D: 'Un sinónimo de PTES sin ninguna diferencia de enfoque' }, answer: ['A'], explanation: 'El OWASP Testing Guide provee una metodología detallada y checklist específicos para evaluar la seguridad de aplicaciones web (inyección, autenticación, gestión de sesiones, etc.), complementando metodologías más generales como PTES.', domain: 'Metodologías y tipos de pentest', difficulty: 'medium' },
    ],
  },
  {
    slug: 'network-security-fundamentals',
    title: 'Network Security — Fundamentos',
    description: 'Examen de práctica sobre seguridad de redes: defensa en profundidad, firewalls, IDS/IPS, VPN, segmentación y Zero Trust.',
    domain: 'security', category: 'network-security', level: 'intermediate', language: 'es',
    tags: ['network', 'firewall', 'ids'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en NIST SP 800-53 + estándares de seguridad de red ampliamente adoptados en la industria (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué diferencia hay entre un firewall tradicional (stateless) y uno "stateful"?', options: { A: 'Un firewall stateless filtra cada paquete de forma aislada según reglas estáticas; uno stateful mantiene el contexto de las conexiones activas, permitiendo automáticamente el tráfico de retorno legítimo de una conexión ya establecida', B: 'Son exactamente lo mismo', C: 'Stateless siempre es más seguro que stateful', D: 'Stateful solo funciona en la capa de aplicación' }, answer: ['A'], explanation: 'Un firewall stateful rastrea el estado de las conexiones (ej. una conexión TCP establecida), permitiendo automáticamente el tráfico de retorno esperado sin necesitar una regla explícita para cada dirección, a diferencia del filtrado stateless paquete por paquete.', domain: 'Firewalls (stateful, NGFW)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué capacidades adicionales tiene un Next-Generation Firewall (NGFW) frente a un firewall tradicional?', options: { A: 'Inspección a nivel de aplicación (Deep Packet Inspection), identificación de aplicaciones específicas, prevención de intrusiones integrada y, a menudo, inteligencia de amenazas', B: 'Ninguna diferencia real, es solo marketing', C: 'Solo puede filtrar por dirección IP, igual que uno tradicional', D: 'Un NGFW nunca puede inspeccionar tráfico cifrado' }, answer: ['A'], explanation: 'Un NGFW añade inspección profunda de paquetes (DPI), reconocimiento de aplicaciones específicas (más allá de puertos/protocolos), capacidades de IPS integradas y, en muchos casos, integración con feeds de threat intelligence.', domain: 'Firewalls (stateful, NGFW)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre un IDS y un IPS?', options: { A: 'Un IDS (Intrusion Detection System) solo detecta y alerta sobre actividad sospechosa; un IPS (Intrusion Prevention System) además puede bloquear activamente el tráfico malicioso en tiempo real', B: 'Son exactamente lo mismo', C: 'Un IDS siempre bloquea el tráfico automáticamente', D: 'Un IPS solo funciona en redes inalámbricas' }, answer: ['A'], explanation: 'Un IDS opera de forma pasiva, detectando y generando alertas sobre patrones de tráfico sospechoso sin intervenir; un IPS se coloca inline y puede bloquear/descartar activamente el tráfico identificado como malicioso.', domain: 'IDS/IPS', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un IDS/IPS basado en firmas (signature-based) y cuál es su principal limitación?', options: { A: 'Detecta amenazas comparando el tráfico contra patrones conocidos de ataques previos; su limitación es que no puede detectar amenazas nuevas (zero-day) que no coincidan con firmas existentes', B: 'No tiene ninguna limitación práctica', C: 'Solo funciona con tráfico cifrado', D: 'Requiere que el atacante se identifique voluntariamente' }, answer: ['A'], explanation: 'La detección basada en firmas compara el tráfico contra una base de datos de patrones de ataques conocidos, siendo muy precisa para amenazas ya documentadas pero incapaz de detectar ataques completamente nuevos (zero-day) sin firma previa — por eso se complementa con detección basada en anomalías.', domain: 'IDS/IPS', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué protocolo de VPN combina cifrado y autenticación para crear túneles seguros a nivel de capa de red (Capa 3)?', options: { A: 'IPSec', B: 'FTP', C: 'SNMP', D: 'DHCP' }, answer: ['A'], explanation: 'IPSec (Internet Protocol Security) es un conjunto de protocolos que provee cifrado, autenticación e integridad para el tráfico IP, siendo ampliamente usado para crear túneles VPN site-to-site seguros.', domain: 'VPNs (IPSec, SSL/TLS)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué ventaja tiene una VPN basada en SSL/TLS frente a una IPSec en cuanto a facilidad de acceso remoto?', options: { A: 'Puede funcionar a través de un navegador web sin requerir software cliente pesado, facilitando el acceso remoto desde cualquier dispositivo con navegador', B: 'SSL/TLS VPN siempre es menos segura que IPSec sin excepción', C: 'IPSec siempre es más rápida en cualquier escenario', D: 'No existe ninguna diferencia práctica de uso' }, answer: ['A'], explanation: 'Las VPN SSL/TLS (clientless o con cliente ligero) pueden operar a través de un navegador estándar, simplificando el acceso remoto desde dispositivos diversos sin requerir configuración de cliente IPSec dedicado.', domain: 'VPNs (IPSec, SSL/TLS)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la segmentación de red mediante VLANs y qué beneficio de seguridad aporta?', options: { A: 'Divide una red física en múltiples redes lógicas aisladas, limitando el alcance del tráfico de broadcast y conteniendo el movimiento lateral de un atacante si un segmento se ve comprometido', B: 'Elimina completamente la necesidad de cualquier firewall', C: 'Solo mejora la velocidad de la red, sin ningún beneficio de seguridad', D: 'Requiere obligatoriamente hardware de un solo fabricante' }, answer: ['A'], explanation: 'Las VLANs segmentan lógicamente una red física, aislando el tráfico de broadcast y limitando qué dispositivos pueden comunicarse directamente entre sí, conteniendo así el alcance de un compromiso si un segmento es vulnerado.', domain: 'Segmentación de red y VLANs', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué principio central caracteriza una arquitectura de "Zero Trust"?', options: { A: 'Confiar automáticamente en cualquier dispositivo dentro del perímetro corporativo', B: 'Nunca confiar por defecto y verificar explícitamente cada solicitud de acceso (identidad, dispositivo, contexto), sin importar si el origen está dentro o fuera de la red tradicional', C: 'Eliminar toda forma de autenticación para simplificar el acceso', D: 'Confiar únicamente en el firewall perimetral como única defensa' }, answer: ['B'], explanation: 'Zero Trust reemplaza el modelo tradicional de "confiar en la red interna" por verificación explícita y continua de cada solicitud de acceso, independientemente de si el origen está dentro o fuera del perímetro tradicional de la red.', domain: 'Zero Trust Architecture', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un ataque de "ARP spoofing" y qué riesgo representa en una red local?', options: { A: 'El atacante envía respuestas ARP falsas, asociando su propia dirección MAC con la IP de un dispositivo legítimo (ej. el gateway), permitiendo interceptar tráfico (ataque Man-in-the-Middle)', B: 'Un ataque que solo afecta servidores DNS remotos', C: 'Un tipo de ataque de denegación de servicio volumétrico', D: 'Un ataque que requiere acceso físico directo al router' }, answer: ['A'], explanation: 'ARP spoofing envía respuestas ARP falsificadas para que otros dispositivos de la red local asocien incorrectamente una IP legítima con la MAC del atacante, permitiéndole interceptar o alterar el tráfico destinado a esa IP (típicamente el gateway).', domain: 'Ataques de red comunes (MITM, ARP spoofing, DDoS)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre un ataque DoS y uno DDoS?', options: { A: 'DoS proviene de una sola fuente/origen; DDoS (Distributed) proviene de múltiples fuentes distribuidas simultáneamente (a menudo una botnet), siendo más difícil de mitigar bloqueando una sola IP', B: 'Son exactamente lo mismo', C: 'DDoS siempre es menos peligroso que DoS', D: 'DoS solo puede ejecutarse contra servidores web' }, answer: ['A'], explanation: 'Un DoS satura un objetivo desde una sola fuente; un DDoS coordina múltiples orígenes (frecuentemente una botnet de dispositivos comprometidos), haciendo mucho más difícil la mitigación mediante simple bloqueo de una IP específica.', domain: 'Ataques de red comunes (MITM, ARP spoofing, DDoS)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta centraliza y correlaciona logs de múltiples dispositivos de red (firewalls, IDS, switches) para detectar patrones de ataque?', options: { A: 'SIEM (Security Information and Event Management)', B: 'DHCP Server', C: 'DNS resolver', D: 'Load balancer' }, answer: ['A'], explanation: 'Un SIEM agrega y correlaciona eventos de múltiples fuentes de red y seguridad, aplicando reglas de correlación para detectar patrones de ataque que serían difíciles de identificar revisando logs individuales de forma aislada.', domain: 'Monitoreo y SIEM', difficulty: 'medium' },
    ],
  },
  {
    slug: 'cloud-security-fundamentals',
    title: 'Cloud Security — Fundamentos',
    description: 'Examen de práctica sobre seguridad en la nube: modelo de responsabilidad compartida, IAM, cifrado, seguridad de contenedores y compliance.',
    domain: 'security', category: 'cloud-security', level: 'intermediate', language: 'es',
    tags: ['cloud', 'security', 'aws', 'azure'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en CSA (Cloud Security Alliance) Guidance + CCSP Exam Outline — cloudsecurityalliance.org (contenido original)',
    questions: [
      { type: 'multiple', question: 'Según el modelo de responsabilidad compartida en un servicio IaaS (ej. una VM en la nube), ¿de quién es la responsabilidad de configurar correctamente el sistema operativo y sus parches?', options: { A: 'Del proveedor cloud, siempre, en cualquier modelo de servicio', B: 'Del cliente, ya que en IaaS la "seguridad EN la nube" (SO, parches, configuración, datos) es responsabilidad del cliente', C: 'De un auditor externo obligatorio', D: 'Nadie es responsable en ningún modelo cloud' }, answer: ['B'], explanation: 'En IaaS, el proveedor asegura la infraestructura física y de virtualización ("seguridad DE la nube"); el cliente es responsable del sistema operativo, sus parches, configuración de red y datos ("seguridad EN la nube") — esta responsabilidad varía según el modelo de servicio (IaaS/PaaS/SaaS).', domain: 'Modelo de responsabilidad compartida', difficulty: 'easy' },
      { type: 'multiple', question: 'En un modelo SaaS (ej. Google Workspace), ¿qué parte de la "seguridad EN la nube" sigue siendo típicamente responsabilidad del cliente?', options: { A: 'Ninguna, todo es responsabilidad del proveedor SaaS', B: 'La gestión de identidades y accesos (quién tiene acceso a qué datos), la configuración de permisos, y la clasificación/gobernanza de los datos propios', C: 'El parcheo del sistema operativo subyacente', D: 'El mantenimiento del hardware físico' }, answer: ['B'], explanation: 'Aunque SaaS delega la mayor parte de la infraestructura y aplicación al proveedor, el cliente sigue siendo responsable de la gestión de identidades/accesos, configuración de permisos y gobernanza de sus propios datos dentro del servicio.', domain: 'Modelo de responsabilidad compartida', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué práctica de IAM en la nube reduce el riesgo de una cuenta comprometida al limitar sus permisos al mínimo necesario?', options: { A: 'Principio de menor privilegio (least privilege)', B: 'Otorgar permisos de administrador a todas las cuentas por conveniencia', C: 'Compartir una sola cuenta entre todo el equipo', D: 'Deshabilitar el logging de accesos' }, answer: ['A'], explanation: 'El principio de menor privilegio limita cada identidad (usuario, servicio) a los permisos estrictamente necesarios para su función, reduciendo el impacto potencial si esa cuenta se ve comprometida.', domain: 'IAM en cloud (least privilege, MFA)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué se recomienda habilitar MFA (autenticación multifactor) especialmente en cuentas con privilegios administrativos en la nube?', options: { A: 'Añade una capa adicional de verificación más allá de la contraseña, dificultando significativamente el acceso no autorizado incluso si la contraseña es robada/filtrada', B: 'MFA elimina por completo la necesidad de contraseñas', C: 'MFA solo es relevante para cuentas de usuarios finales, nunca para administradores', D: 'MFA ralentiza tanto el acceso que no se recomienda para cuentas críticas' }, answer: ['A'], explanation: 'MFA requiere un segundo factor (ej. código de un dispositivo) además de la contraseña, por lo que incluso si la contraseña es robada mediante phishing o una filtración, el atacante no puede acceder sin el segundo factor — especialmente crítico en cuentas administrativas de alto privilegio.', domain: 'IAM en cloud (least privilege, MFA)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre cifrado "at-rest" y cifrado "in-transit"?', options: { A: 'Cifrado at-rest protege los datos almacenados (ej. en disco, en una base de datos); cifrado in-transit protege los datos mientras se transmiten por la red (ej. entre cliente y servidor)', B: 'Son exactamente lo mismo', C: 'At-rest solo aplica a bases de datos NoSQL', D: 'In-transit nunca es necesario si ya se usa at-rest' }, answer: ['A'], explanation: 'Ambos tipos de cifrado protegen datos en distintos estados: at-rest asegura los datos almacenados (en disco/storage), in-transit asegura los datos mientras viajan por la red; una arquitectura segura típicamente implementa ambos, no uno solo.', domain: 'Encriptación at-rest e in-transit', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio de gestión de claves de cifrado en la nube permite centralizar la creación, rotación y control de acceso a las claves criptográficas?', options: { A: 'Un KMS (Key Management Service, ej. AWS KMS, Azure Key Vault)', B: 'Un balanceador de carga', C: 'Un servicio de DNS', D: 'Un CDN' }, answer: ['A'], explanation: 'Un servicio KMS centraliza la generación, almacenamiento, rotación y control de acceso a claves criptográficas usadas para cifrar datos, evitando que las claves se gestionen de forma dispersa e insegura por cada aplicación.', domain: 'Gestión de secretos (KMS, Key Vault, Secrets Manager)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué es una mala práctica hardcodear credenciales (API keys, contraseñas) directamente en el código fuente de una aplicación cloud-native?', options: { A: 'No hay ningún problema real en hacerlo si el repositorio es privado', B: 'Las credenciales quedan expuestas en el historial de control de versiones, son difíciles de rotar sin modificar/redesplegar código, y aumentan el riesgo si el repositorio se filtra o se vuelve público accidentalmente', C: 'El código se ejecuta más lento si las credenciales están hardcodeadas', D: 'Solo afecta el rendimiento, no la seguridad' }, answer: ['B'], explanation: 'Hardcodear credenciales las deja expuestas permanentemente en el historial de Git (incluso si se elimina después), dificulta su rotación (requiere modificar y redesplegar código) y aumenta drásticamente el riesgo si el repositorio se filtra — por eso se recomienda usar un secrets manager dedicado.', domain: 'Gestión de secretos (KMS, Key Vault, Secrets Manager)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué riesgo de seguridad específico introduce usar la imagen base "latest" de un contenedor Docker en producción, sin fijar una versión específica?', options: { A: 'Ninguno, es la práctica recomendada', B: 'La imagen puede cambiar sin previo aviso entre builds, introduciendo vulnerabilidades no probadas, dependencias inconsistentes o comportamientos inesperados sin control de versión explícito', C: '"latest" siempre es la versión más segura disponible', D: 'Docker no permite usar tags de versión específicos' }, answer: ['B'], explanation: 'Usar el tag "latest" significa que la imagen base puede cambiar entre builds sin que el equipo lo note explícitamente, introduciendo cambios no probados o vulnerabilidades nuevas; fijar una versión específica (o un digest inmutable) da control y reproducibilidad.', domain: 'Seguridad de containers y Kubernetes', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Pod Security Standard" (o Pod Security Policy, en versiones antiguas) en Kubernetes?', options: { A: 'Un mecanismo que restringe las capacidades de seguridad que pueden tener los pods (ej. impedir contenedores privilegiados, controlar acceso al host), reduciendo la superficie de ataque del cluster', B: 'Un tipo de firewall exclusivo para redes tradicionales, no relacionado con Kubernetes', C: 'Un sinónimo de RBAC de Kubernetes sin ninguna diferencia', D: 'Una herramienta de monitoreo de rendimiento' }, answer: ['A'], explanation: 'Los Pod Security Standards definen políticas que restringen configuraciones riesgosas de los pods (ej. ejecutar como root, acceso privilegiado al host, montar volúmenes sensibles), reduciendo la superficie de ataque si un contenedor se ve comprometido.', domain: 'Seguridad de containers y Kubernetes', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué estándar de cumplimiento deben seguir las organizaciones que almacenan, procesan o transmiten datos de tarjetas de pago en la nube?', options: { A: 'PCI-DSS', B: 'HIPAA exclusivamente', C: 'FERPA', D: 'COPPA' }, answer: ['A'], explanation: 'PCI-DSS (Payment Card Industry Data Security Standard) aplica específicamente a organizaciones que manejan datos de tarjetas de pago, exigiendo controles técnicos y de proceso específicos, independientemente de si la infraestructura está en la nube o on-premises.', domain: 'Compliance (PCI-DSS, HIPAA, GDPR)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué regulación europea establece requisitos estrictos sobre cómo se recopilan, procesan y almacenan datos personales, con impacto directo en decisiones de arquitectura cloud (ej. residencia de datos)?', options: { A: 'GDPR (Reglamento General de Protección de Datos)', B: 'PCI-DSS', C: 'SOX exclusivamente', D: 'FedRAMP' }, answer: ['A'], explanation: 'GDPR impone requisitos estrictos sobre consentimiento, derecho al olvido, notificación de brechas y, en muchos casos, restricciones sobre dónde pueden residir físicamente los datos personales de ciudadanos de la UE — un factor clave al diseñar arquitecturas cloud multi-región.', domain: 'Compliance (PCI-DSS, HIPAA, GDPR)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué diferencia hay entre una herramienta CSPM (Cloud Security Posture Management) y una CWPP (Cloud Workload Protection Platform)?', options: { A: 'CSPM detecta configuraciones erróneas y desviaciones de compliance a nivel de la infraestructura/cuenta cloud (ej. un bucket S3 público); CWPP protege las cargas de trabajo específicas en ejecución (VMs, contenedores) contra amenazas en tiempo de ejecución', B: 'Son exactamente lo mismo', C: 'CWPP solo funciona con bases de datos relacionales', D: 'CSPM reemplaza completamente la necesidad de IAM' }, answer: ['A'], explanation: 'CSPM se enfoca en la postura de seguridad de la CONFIGURACIÓN cloud (detectar recursos mal configurados, buckets públicos, violaciones de compliance); CWPP protege las CARGAS DE TRABAJO en ejecución (detección de malware, comportamiento anómalo en VMs/contenedores) — herramientas complementarias, no intercambiables.', domain: 'CSPM y CWPP', difficulty: 'hard' },
    ],
  },
  {
    slug: 'incident-response-basics',
    title: 'Incident Response — Fundamentos',
    description: 'Examen de práctica sobre manejo de incidentes de seguridad según el ciclo de vida definido en NIST SP 800-61.',
    domain: 'security', category: 'incident-response', level: 'intermediate', language: 'es',
    tags: ['incident-response', 'dfir', 'nist'], passPercent: 70, timeMinutes: 18,
    source: 'Basado en NIST SP 800-61 Rev. 2 (Computer Security Incident Handling Guide) — nvlpubs.nist.gov (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuáles son las cuatro fases del ciclo de vida de respuesta a incidentes según NIST SP 800-61?', options: { A: 'Preparation, Detection & Analysis, Containment/Eradication & Recovery, Post-Incident Activity', B: 'Planning, Testing, Deployment, Monitoring', C: 'Reconocimiento, Escaneo, Explotación, Reporte', D: 'Identificación, Clasificación, Facturación, Cierre' }, answer: ['A'], explanation: 'NIST SP 800-61 estructura la respuesta a incidentes en 4 fases: Preparación (antes del incidente), Detección y Análisis, Contención/Erradicación y Recuperación, y Actividad Post-Incidente (lecciones aprendidas).', domain: 'Ciclo de vida del IR según NIST', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué actividades se realizan en la fase de "Preparation" del ciclo de IR, ANTES de que ocurra un incidente?', options: { A: 'Establecer herramientas, procedimientos, roles del equipo (CSIRT), capacitación y comunicación previa, para poder responder eficazmente cuando ocurra un incidente real', B: 'Analizar los logs del incidente ya ocurrido', C: 'Notificar a los medios de comunicación', D: 'Restaurar los sistemas afectados desde backups' }, answer: ['A'], explanation: 'La fase de Preparación establece proactivamente la capacidad de respuesta: herramientas forenses, procedimientos documentados, roles y responsabilidades del CSIRT, canales de comunicación y capacitación, ANTES de que ocurra cualquier incidente.', domain: 'Ciclo de vida del IR según NIST', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué distingue a un "evento" de un "incidente" de seguridad, según la terminología estándar?', options: { A: 'Son sinónimos exactos sin ninguna distinción', B: 'Un evento es cualquier ocurrencia observable en un sistema/red (ej. un login); un incidente es una violación (real o inminente) de las políticas de seguridad que requiere respuesta', C: 'Un incidente siempre es menos grave que un evento', D: 'Un evento solo puede ocurrir en sistemas Windows' }, answer: ['B'], explanation: 'Un evento es cualquier ocurrencia observable (ej. un intento de login, tráfico de red), la mayoría benignos; un incidente es específicamente una violación real o inminente de las políticas de seguridad que amerita una respuesta formal.', domain: 'Ciclo de vida del IR según NIST', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué rol cumple un CSIRT (Computer Security Incident Response Team)?', options: { A: 'Es el equipo formalmente designado y capacitado para coordinar la respuesta organizacional a incidentes de seguridad, desde la detección hasta la recuperación', B: 'Es un software de firewall', C: 'Es un sinónimo de departamento de marketing', D: 'Solo existe en empresas de más de 10,000 empleados' }, answer: ['A'], explanation: 'El CSIRT es el equipo (interno, tercerizado o híbrido) responsable de coordinar toda la respuesta organizacional ante un incidente de seguridad, con roles y procedimientos definidos previamente en la fase de Preparación.', domain: 'CSIRT y roles', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es el objetivo principal de la fase de "Contención" tras detectar un incidente activo?', options: { A: 'Limitar el alcance y el impacto del incidente lo antes posible (ej. aislar sistemas comprometidos de la red), evitando que se propague más, antes de proceder a la erradicación completa', B: 'Eliminar inmediatamente todos los sistemas de la red sin ningún análisis previo', C: 'Notificar a los medios de comunicación de inmediato', D: 'Esperar a que el incidente se resuelva por sí solo' }, answer: ['A'], explanation: 'La contención busca limitar rápidamente el daño y el alcance del incidente (ej. aislar un sistema comprometido de la red) para evitar que se propague, antes de proceder a erradicar completamente la causa raíz y recuperar los sistemas.', domain: 'Playbooks de IR', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué es importante distinguir entre "contención a corto plazo" y "contención a largo plazo" durante un incidente?', options: { A: 'No hay ninguna distinción práctica real', B: 'La contención a corto plazo detiene el daño inmediato (ej. desconectar un cable de red) mientras se planifica una solución más sostenible; la contención a largo plazo implica cambios más permanentes (ej. reconstruir el sistema) que permiten mantener operaciones mientras se prepara la erradicación completa', C: 'La contención a largo plazo siempre ocurre antes que la de corto plazo', D: 'Solo aplica a incidentes de ransomware' }, answer: ['B'], explanation: 'La contención de corto plazo detiene el sangrado inmediato (ej. desconectar de la red), mientras la de largo plazo implica medidas más sostenibles (parchear, segmentar, reconstruir) que permiten seguir operando de forma controlada mientras se prepara la erradicación definitiva.', domain: 'Playbooks de IR', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué implica la fase de "Erradicación" tras contener un incidente?', options: { A: 'Eliminar por completo la causa raíz del incidente del entorno (ej. malware, cuentas comprometidas, backdoors), asegurando que no queden restos que permitan una reinfección', B: 'Simplemente reiniciar los servidores afectados sin más acciones', C: 'Restaurar inmediatamente desde el backup más reciente sin verificar la causa raíz', D: 'Es idéntica a la fase de contención, sin ninguna diferencia' }, answer: ['A'], explanation: 'La erradicación busca eliminar completamente la causa raíz (malware, cuentas comprometidas, vulnerabilidades explotadas, backdoors) para asegurar que el atacante no pueda reingresar por la misma vía tras la recuperación.', domain: 'Playbooks de IR', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "cadena de custodia" (chain of custody) en el manejo de evidencia digital durante un incidente?', options: { A: 'Un documento que registra quién recolectó, manejó y almacenó cada pieza de evidencia y cuándo, garantizando su integridad para uso legal/forense posterior', B: 'Un sinónimo de firewall', C: 'Un proceso exclusivo para incidentes que involucran a la policía', D: 'Un tipo de cifrado de datos' }, answer: ['A'], explanation: 'La cadena de custodia documenta detalladamente cada persona que tuvo acceso a la evidencia digital y cuándo, siendo fundamental para preservar la integridad de la evidencia y su validez si el incidente deriva en acciones legales.', domain: 'Evidencia digital y chain of custody', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué es importante comunicar de forma controlada y a través de canales predefinidos durante un incidente activo (en vez de discutirlo por canales que podrían estar comprometidos)?', options: { A: 'No es relevante mientras se resuelva el incidente eventualmente', B: 'Si el atacante todavía tiene acceso al sistema comprometido, comunicar el incidente por canales igualmente comprometidos (ej. el mismo correo corporativo hackeado) podría alertarlo, permitiéndole borrar evidencia o profundizar el daño antes de ser contenido', C: 'La comunicación durante un incidente es responsabilidad exclusiva del área legal, no del CSIRT', D: 'Solo importa comunicar después de que el incidente termine' }, answer: ['B'], explanation: 'Si el atacante aún tiene acceso a sistemas comprometidos (ej. el correo corporativo), discutir la respuesta por ese mismo canal podría alertarlo de que fue detectado, dándole oportunidad de destruir evidencia o escalar el ataque antes de ser contenido — por eso se usan canales "out-of-band" predefinidos.', domain: 'Comunicación durante un incidente', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué propósito tiene la reunión de "lessons learned" (post-mortem) tras cerrar un incidente de seguridad?', options: { A: 'Documentar qué funcionó bien, qué falló, y qué mejoras concretas de proceso/herramientas/capacitación se implementarán para prevenir o responder mejor ante incidentes futuros similares', B: 'Asignar culpas individuales de forma pública', C: 'Es un paso opcional que rara vez aporta valor real', D: 'Solo se realiza si el incidente fue causado por un empleado' }, answer: ['A'], explanation: 'La reunión de lecciones aprendidas cierra el ciclo de IR documentando de forma estructurada (sin buscar culpables individuales) qué funcionó, qué falló y qué mejoras concretas se implementarán, retroalimentando la fase de Preparación para el próximo ciclo.', domain: 'Ciclo de vida del IR según NIST', difficulty: 'easy' },
    ],
  },
  {
    slug: 'soc-analyst-fundamentals',
    title: 'SOC Analyst — Fundamentos',
    description: 'Examen de práctica sobre operaciones de un Security Operations Center: monitoreo, triage de alertas, SIEM y MITRE ATT&CK.',
    domain: 'security', category: 'soc', level: 'beginner', language: 'es',
    tags: ['soc', 'siem', 'blue-team'], passPercent: 70, timeMinutes: 20,
    source: 'Basado en CompTIA CySA+ CS0-003 Exam Objectives + MITRE ATT&CK Framework — attack.mitre.org (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué distingue típicamente a un analista SOC de Nivel 1 (L1) de uno de Nivel 2 (L2)?', options: { A: 'L1 realiza el triage inicial de alertas (revisar, clasificar por severidad, escalar si es necesario); L2 realiza análisis más profundo de los incidentes escalados, investigando la causa raíz con mayor detalle técnico', B: 'No hay ninguna diferencia real entre los niveles', C: 'L1 tiene más experiencia y autoridad que L2', D: 'L2 solo se encarga de tareas administrativas sin análisis técnico' }, answer: ['A'], explanation: 'La estructura típica de un SOC escala en profundidad de análisis: L1 hace triage inicial rápido de alertas (¿es un falso positivo? ¿qué severidad tiene?), escalando lo relevante a L2 para investigación más profunda, y L3 para amenazas complejas/threat hunting.', domain: 'Estructura de un SOC (L1, L2, L3)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué función principal cumple un analista SOC de Nivel 3 (L3), más allá del análisis de incidentes escalados?', options: { A: 'Threat hunting proactivo (buscar amenazas no detectadas por alertas automáticas), análisis forense profundo y mejora continua de reglas de detección', B: 'Únicamente responder llamadas telefónicas de clientes', C: 'Realizar exclusivamente tareas de instalación de software', D: 'L3 no existe en la estructura típica de un SOC' }, answer: ['A'], explanation: 'L3 (a menudo llamados threat hunters o analistas senior) van más allá de responder alertas: buscan proactivamente amenazas que podrían no haber disparado ninguna alerta automática, realizan análisis forense profundo y mejoran las reglas de detección del SOC.', domain: 'Estructura de un SOC (L1, L2, L3)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta automatiza y orquesta la respuesta a incidentes de seguridad, ejecutando "playbooks" de acciones (ej. bloquear una IP automáticamente) sin intervención manual constante?', options: { A: 'SOAR (Security Orchestration, Automation and Response)', B: 'Un antivirus tradicional', C: 'Un balanceador de carga', D: 'Un servidor DNS' }, answer: ['A'], explanation: 'Una plataforma SOAR automatiza respuestas a incidentes según playbooks predefinidos (ej. aislar automáticamente un endpoint comprometido, bloquear una IP maliciosa en el firewall), reduciendo el tiempo de respuesta y la carga manual del equipo SOC.', domain: 'Herramientas (SIEM, SOAR, EDR, XDR)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tipo de herramienta monitorea continuamente los endpoints (laptops, servidores) buscando comportamiento malicioso, permitiendo investigar y responder directamente desde el dispositivo?', options: { A: 'EDR (Endpoint Detection and Response)', B: 'DNS Server', C: 'CDN', D: 'Load Balancer' }, answer: ['A'], explanation: 'Un EDR monitorea continuamente la actividad de los endpoints (procesos, archivos, conexiones de red), detectando comportamiento sospechoso y permitiendo al analista investigar y responder (ej. aislar el endpoint) directamente desde la consola de EDR.', domain: 'Herramientas (SIEM, SOAR, EDR, XDR)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es XDR (Extended Detection and Response) y cómo se diferencia de EDR?', options: { A: 'XDR extiende la visibilidad y correlación más allá del endpoint, integrando datos de red, email, cloud e identidad en una sola plataforma unificada, en vez de limitarse solo a endpoints como EDR', B: 'Son exactamente el mismo producto con nombre distinto', C: 'XDR es una versión más antigua y limitada de EDR', D: 'XDR solo funciona en entornos on-premises, nunca en la nube' }, answer: ['A'], explanation: 'Mientras EDR se enfoca específicamente en endpoints, XDR correlaciona telemetría de múltiples fuentes (endpoint, red, email, identidad, cloud) en una plataforma unificada, dando una visión más completa de un ataque que podría abarcar múltiples vectores.', domain: 'Herramientas (SIEM, SOAR, EDR, XDR)', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué es el análisis de logs y por qué es una habilidad central de un analista SOC?', options: { A: 'Revisar y correlacionar registros de eventos de sistemas, aplicaciones y dispositivos de red para identificar patrones sospechosos, siendo la base de la mayoría de las investigaciones de seguridad', B: 'Un proceso exclusivamente automatizado que no requiere intervención humana', C: 'Solo relevante para auditorías financieras, no de seguridad', D: 'Un sinónimo de escaneo de vulnerabilidades' }, answer: ['A'], explanation: 'El análisis de logs (a menudo apoyado por un SIEM) es fundamental porque la mayoría de la evidencia de actividad maliciosa queda registrada en logs de sistema, aplicación, red o autenticación, requiriendo interpretación humana experta para distinguir patrones sospechosos de actividad legítima.', domain: 'Análisis de logs', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es el MITRE ATT&CK Framework y cómo lo usa un analista SOC?', options: { A: 'Una base de conocimiento pública que cataloga tácticas, técnicas y procedimientos (TTPs) reales usados por atacantes, usada para mapear alertas/incidentes a comportamientos conocidos y evaluar la cobertura de detección del SOC', B: 'Un framework exclusivo para desarrollar malware', C: 'Un sinónimo de CVE (Common Vulnerabilities and Exposures)', D: 'Una herramienta de escaneo de puertos' }, answer: ['A'], explanation: 'MITRE ATT&CK cataloga de forma estructurada las tácticas (objetivos, ej. "Persistence") y técnicas específicas que usan atacantes reales; los SOC lo usan para mapear alertas a comportamientos conocidos, priorizar detecciones y evaluar qué técnicas de ataque están cubiertas (o no) por sus controles actuales.', domain: 'MITRE ATT&CK framework', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "threat intelligence" (inteligencia de amenazas) y cómo apoya las operaciones de un SOC?', options: { A: 'Información contextualizada sobre amenazas actuales (indicadores de compromiso, TTPs de grupos de atacantes, campañas activas) que ayuda a priorizar alertas y anticipar ataques relevantes para la organización', B: 'Un sinónimo de firewall de nueva generación', C: 'Solo información histórica sin ninguna relevancia operativa actual', D: 'Un proceso que reemplaza completamente la necesidad de un SIEM' }, answer: ['A'], explanation: 'El threat intelligence provee contexto accionable (IOCs, TTPs de actores de amenaza específicos, campañas activas relevantes para el sector de la organización), permitiendo al SOC priorizar mejor sus alertas y anticipar amenazas relevantes en vez de reaccionar de forma genérica.', domain: 'Threat intelligence', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué significa hacer "triage" de una alerta de seguridad recibida en el SIEM?', options: { A: 'Ignorar automáticamente todas las alertas de baja severidad sin revisarlas', B: 'Evaluar rápidamente la alerta para determinar si es un falso positivo, su severidad real, y si requiere escalamiento inmediato o puede esperar un análisis más profundo', C: 'Eliminar la alerta del sistema sin ningún registro', D: 'Reenviar automáticamente todas las alertas al CEO de la empresa' }, answer: ['B'], explanation: 'El triage es la primera evaluación rápida de una alerta: determinar si es un falso positivo, evaluar su severidad real y decidir si requiere escalamiento inmediato (posible incidente) o puede registrarse para análisis posterior — la función central del analista L1.', domain: 'Triage de alertas', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué mide la métrica MTTD (Mean Time to Detect) de un SOC?', options: { A: 'El tiempo promedio que transcurre desde que ocurre un incidente/compromiso hasta que el SOC lo detecta', B: 'El tiempo promedio que tarda un empleado en llegar a la oficina', C: 'El número total de alertas generadas en un día', D: 'El costo promedio de cada incidente' }, answer: ['A'], explanation: 'MTTD (Mean Time to Detect) mide el tiempo promedio entre el momento en que ocurre un compromiso/incidente y el momento en que el SOC lo detecta — cuanto menor sea, más rápida es la capacidad de detección del equipo.', domain: 'Métricas SOC (MTTD, MTTR)', difficulty: 'medium' },
    ],
  },
  {
    slug: 'cryptography-basics',
    title: 'Cryptography — Fundamentos',
    description: 'Examen de práctica sobre criptografía simétrica, asimétrica, hashing, PKI y TLS.',
    domain: 'security', category: 'cryptography', level: 'intermediate', language: 'es',
    tags: ['crypto', 'cryptography', 'pki'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en NIST FIPS Standards + estándares criptográficos ampliamente adoptados (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Cuál es la diferencia fundamental entre criptografía simétrica y asimétrica?', options: { A: 'La simétrica usa la misma clave para cifrar y descifrar; la asimétrica usa un par de claves matemáticamente relacionadas (pública y privada), donde una cifra y la otra descifra', B: 'Son exactamente lo mismo con distinto nombre', C: 'La asimétrica siempre es más rápida que la simétrica para cifrar grandes volúmenes de datos', D: 'La simétrica no puede usarse para cifrar archivos, solo mensajes cortos' }, answer: ['A'], explanation: 'La criptografía simétrica usa una única clave compartida para cifrar y descifrar (más rápida, pero requiere compartir la clave de forma segura); la asimétrica usa un par de claves matemáticamente relacionadas, donde lo cifrado con la pública solo puede descifrarse con la privada correspondiente (o viceversa para firmas).', domain: 'Criptografía simétrica (AES, ChaCha20)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué algoritmo de cifrado simétrico es actualmente el estándar más ampliamente adoptado para cifrar datos en reposo y en tránsito?', options: { A: 'AES (Advanced Encryption Standard)', B: 'MD5', C: 'DES (el estándar original, ya obsoleto)', D: 'Base64' }, answer: ['A'], explanation: 'AES (típicamente con claves de 128, 192 o 256 bits) es el estándar de cifrado simétrico ampliamente adoptado por gobiernos e industria, reemplazando al obsoleto DES; Base64 no es cifrado, es solo codificación reversible sin clave.', domain: 'Criptografía simétrica (AES, ChaCha20)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué se considera a Base64 NO un método de cifrado, aunque transforme el texto en una representación distinta?', options: { A: 'Porque es un esquema de codificación reversible sin ninguna clave secreta: cualquiera puede decodificarlo instantáneamente sin necesitar información adicional', B: 'Porque Base64 sí es criptografía, solo que muy débil', C: 'Porque Base64 solo funciona con imágenes', D: 'Porque Base64 requiere una clave de 256 bits' }, answer: ['A'], explanation: 'Base64 es un esquema de codificación (no cifrado): transforma datos binarios en texto ASCII de forma completamente reversible sin ninguna clave secreta, por lo que no aporta ninguna protección de confidencialidad real.', domain: 'Criptografía simétrica (AES, ChaCha20)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué algoritmo de criptografía asimétrica, basado en la dificultad de factorizar números primos grandes, es ampliamente usado para intercambio de claves y firmas digitales?', options: { A: 'RSA', B: 'AES', C: 'SHA-256', D: 'HMAC' }, answer: ['A'], explanation: 'RSA basa su seguridad en la dificultad computacional de factorizar el producto de dos números primos grandes, siendo uno de los algoritmos asimétricos más usados para intercambio de claves y firmas digitales.', domain: 'Criptografía asimétrica (RSA, ECC)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué ventaja ofrece ECC (Elliptic Curve Cryptography) frente a RSA para un nivel de seguridad equivalente?', options: { A: 'ECC logra un nivel de seguridad comparable con claves significativamente más cortas, lo que reduce el costo computacional y el tamaño de las claves/certificados', B: 'ECC es exactamente igual de eficiente que RSA en todos los aspectos', C: 'ECC no puede usarse para firmas digitales, solo para cifrado', D: 'RSA siempre es más rápido que ECC para el mismo nivel de seguridad' }, answer: ['A'], explanation: 'ECC ofrece un nivel de seguridad equivalente a RSA con claves mucho más cortas (ej. una clave ECC de 256 bits es comparable en seguridad a una RSA de ~3072 bits), resultando en operaciones más rápidas y certificados más ligeros — por eso es cada vez más usado en TLS moderno.', domain: 'Criptografía asimétrica (RSA, ECC)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué característica distintiva tiene una función hash criptográfica como SHA-256?', options: { A: 'Es reversible: se puede recuperar el dato original a partir del hash', B: 'Es de un solo sentido (no reversible), determinística (mismo input siempre produce el mismo output) y produce un output de tamaño fijo sin importar el tamaño del input', C: 'Requiere una clave secreta para calcularse, igual que el cifrado simétrico', D: 'Su output cambia cada vez que se calcula, aunque el input sea idéntico' }, answer: ['B'], explanation: 'Una función hash criptográfica es de un solo sentido (no se puede "descifrar" el hash para obtener el input original), determinística (el mismo input siempre produce el mismo hash) y produce un output de longitud fija, usada para verificar integridad de datos, no para confidencialidad.', domain: 'Funciones hash (SHA-256, SHA-3)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué se considera actualmente inseguro usar MD5 o SHA-1 para aplicaciones criptográficas sensibles (ej. certificados digitales)?', options: { A: 'Son demasiado lentos de calcular para aplicaciones modernas', B: 'Se han demostrado ataques prácticos de colisión (encontrar dos inputs distintos que produzcan el mismo hash), comprometiendo su garantía de integridad para usos de seguridad crítica', C: 'MD5 y SHA-1 nunca fueron usados en ningún estándar de seguridad', D: 'No tienen ninguna debilidad conocida, solo están desactualizados por convención' }, answer: ['B'], explanation: 'Se han demostrado ataques prácticos de colisión contra MD5 y SHA-1 (encontrar dos mensajes distintos con el mismo hash), lo cual compromete su uso en aplicaciones donde la resistencia a colisiones es crítica (ej. firmas digitales, certificados) — por eso se recomienda SHA-256 o superior.', domain: 'Funciones hash (SHA-256, SHA-3)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un HMAC (Hash-based Message Authentication Code) y qué garantiza que un hash simple no garantiza por sí solo?', options: { A: 'Un HMAC combina una función hash con una clave secreta compartida, garantizando tanto integridad del mensaje como autenticidad (que provino de alguien que conoce la clave), algo que un hash simple sin clave no puede garantizar', B: 'Es exactamente lo mismo que un hash normal, sin ninguna diferencia', C: 'HMAC solo funciona con algoritmos de cifrado asimétrico', D: 'HMAC elimina la necesidad de usar TLS' }, answer: ['A'], explanation: 'Un hash simple sin clave solo garantiza integridad (detectar si el mensaje cambió), pero cualquiera podría recalcularlo; HMAC incorpora una clave secreta compartida, añadiendo autenticidad — solo alguien con la clave correcta puede generar un HMAC válido para un mensaje dado.', domain: 'HMAC', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué proceso usa criptografía asimétrica para que el firmante demuestre la autenticidad e integridad de un documento, de forma verificable por cualquiera con su clave pública?', options: { A: 'Firma digital', B: 'Cifrado simétrico', C: 'Hashing sin clave', D: 'Codificación Base64' }, answer: ['A'], explanation: 'Una firma digital se genera cifrando (típicamente) el hash del documento con la clave PRIVADA del firmante; cualquiera con la clave PÚBLICA correspondiente puede verificar que la firma es auténtica y que el documento no fue alterado.', domain: 'Firma digital', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un certificado digital X.509 y qué rol cumple en una infraestructura PKI?', options: { A: 'Un documento digital que vincula una clave pública con la identidad de su propietario, firmado por una Autoridad Certificadora (CA) confiable, permitiendo verificar esa identidad', B: 'Un tipo de contraseña de un solo uso', C: 'Un algoritmo de cifrado simétrico', D: 'Un protocolo exclusivo para redes inalámbricas' }, answer: ['A'], explanation: 'Un certificado X.509 vincula criptográficamente una clave pública con la identidad declarada de su propietario (ej. un dominio web), siendo firmado digitalmente por una CA confiable que da fe de esa vinculación dentro de la infraestructura PKI.', domain: 'PKI y certificados X.509', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué ocurre, en términos generales, durante el "TLS handshake" al establecer una conexión HTTPS?', options: { A: 'El cliente y servidor negocian la versión de TLS y algoritmos a usar, el servidor presenta su certificado (verificado contra una CA de confianza), y se establece una clave de sesión simétrica compartida usada para cifrar el resto de la comunicación', B: 'Se transfiere directamente la contraseña del usuario en texto plano', C: 'El servidor envía su clave privada al cliente', D: 'No hay ninguna negociación, la conexión se cifra automáticamente sin ningún intercambio' }, answer: ['A'], explanation: 'El TLS handshake combina criptografía asimétrica (para autenticar el servidor vía certificado e intercambiar/derivar una clave de forma segura) con criptografía simétrica (para cifrar el tráfico real de la sesión, más eficiente para grandes volúmenes de datos) — nunca se transmite la clave privada del servidor.', domain: 'TLS handshake', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué principio de gestión de claves establece que las claves criptográficas deben cambiarse periódicamente para limitar el impacto si una clave se ve comprometida?', options: { A: 'Rotación de claves (key rotation)', B: 'Codificación Base64', C: 'Hashing sin sal', D: 'Cifrado de un solo uso permanente sin cambios' }, answer: ['A'], explanation: 'La rotación periódica de claves limita la "ventana de exposición" si una clave llegara a comprometerse: al cambiarla regularmente, el atacante solo podría haber comprometido los datos cifrados durante el período en que esa clave específica estuvo activa.', domain: 'Gestión de claves', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un ataque de "fuerza bruta" contra un sistema criptográfico?', options: { A: 'Probar sistemáticamente todas las combinaciones posibles de clave hasta encontrar la correcta, siendo mitigado principalmente usando claves de longitud suficientemente grande', B: 'Un ataque que explota exclusivamente vulnerabilidades de red', C: 'Un método de cifrado alternativo a AES', D: 'Un ataque que solo funciona contra algoritmos de hash, nunca contra cifrado' }, answer: ['A'], explanation: 'Un ataque de fuerza bruta prueba exhaustivamente todas las combinaciones posibles de clave; su mitigación principal es usar longitudes de clave suficientemente grandes (ej. AES-256) para que el espacio de búsqueda sea computacionalmente inviable de agotar en un tiempo razonable.', domain: 'Ataques criptográficos comunes', difficulty: 'easy' },
    ],
  },
];
