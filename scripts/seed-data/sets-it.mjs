/**
 * Official IT / Cloud exam sets.
 *
 * IMPORTANT: All questions are ORIGINAL, written by referencing ONLY
 * publicly available exam objectives/blueprints. No copyrighted material
 * from official exams has been copied.
 *
 * Sources (public blueprints):
 *   - AWS Certified Cloud Practitioner Exam Guide (aws.amazon.com)
 *   - Microsoft AZ-900 Exam Skills Outline (learn.microsoft.com)
 *   - Git documentation (git-scm.com)
 *   - W3C / MDN SQL specification
 */

export const IT_SETS = [
  // ═══════════════════════════════════════════════════════════════════
  // AWS Cloud Practitioner
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'aws-cloud-practitioner-fundamentals',
    title: 'AWS Cloud Practitioner — Fundamentos',
    description:
      'Introducción a los servicios core de AWS: EC2, S3, IAM, VPC, modelos de precio y responsabilidad compartida. Basado en el exam guide público.',
    domain: 'it',
    category: 'cloud',
    level: 'beginner',
    language: 'es',
    tags: ['aws', 'cloud', 'clf-c02', 'fundamentals'],
    passPercent: 70,
    timeMinutes: 30,
    source: 'Basado en AWS Certified Cloud Practitioner Exam Guide (CLF-C02) v1.0',
    questions: [
      {
        type: 'multiple',
        question:
          '¿Cuál es el modelo de responsabilidad compartida de AWS?',
        options: {
          A: 'AWS es responsable de toda la seguridad, incluyendo los datos del cliente',
          B: 'El cliente es responsable de toda la seguridad en AWS',
          C: 'AWS es responsable de la seguridad DE la nube; el cliente es responsable de la seguridad EN la nube',
          D: 'Solo el cliente es responsable de la infraestructura física',
        },
        answer: ['C'],
        explanation:
          'AWS asegura la infraestructura global (hardware, red, data centers). El cliente asegura la configuración, datos, IAM y aplicaciones que despliega.',
        domain: 'Seguridad y Compliance',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué servicio de AWS permite almacenar objetos con alta durabilidad (99.999999999%)?',
        options: {
          A: 'Amazon EBS',
          B: 'Amazon S3',
          C: 'Amazon EFS',
          D: 'Amazon RDS',
        },
        answer: ['B'],
        explanation:
          'S3 ofrece 11 nueves de durabilidad para objetos almacenados en una región, distribuyendo réplicas entre al menos 3 Availability Zones.',
        domain: 'Almacenamiento',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué componente de AWS IAM otorga permisos temporales a servicios o usuarios externos?',
        options: {
          A: 'IAM User',
          B: 'IAM Group',
          C: 'IAM Role',
          D: 'IAM Policy',
        },
        answer: ['C'],
        explanation:
          'Un Role IAM permite que un servicio (ej. EC2) o un principal externo asuma permisos temporales vía STS, sin credenciales permanentes.',
        domain: 'Identidad y Acceso',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Seleccione DOS ventajas del modelo pay-as-you-go de AWS.',
        options: {
          A: 'Costos fijos mensuales independientes del uso',
          B: 'Sin inversión inicial (CapEx → OpEx)',
          C: 'Ajustar capacidad según demanda real',
          D: 'Requiere contratos de varios años',
        },
        answer: ['B', 'C'],
        explanation:
          'El modelo pay-as-you-go elimina CapEx inicial y permite elasticidad: solo pagas el consumo real.',
        domain: 'Facturación y Precio',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio se recomienda para ejecutar código sin aprovisionar servidores?',
        options: {
          A: 'Amazon EC2',
          B: 'AWS Lambda',
          C: 'Amazon ECS',
          D: 'AWS Batch',
        },
        answer: ['B'],
        explanation:
          'Lambda es el servicio serverless de AWS; ejecuta funciones en respuesta a eventos sin gestionar infraestructura.',
        domain: 'Compute',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el propósito principal de una Availability Zone (AZ)?',
        options: {
          A: 'Aislar fallos dentro de una región geográfica',
          B: 'Reducir latencia entre clientes de distintos países',
          C: 'Separar ambientes de desarrollo y producción',
          D: 'Ofrecer servicios exclusivos por país',
        },
        answer: ['A'],
        explanation:
          'Una AZ es un conjunto aislado de data centers dentro de una Region, diseñado para ser independiente de fallos de otras AZs.',
        domain: 'Infraestructura Global',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué plan de soporte de AWS incluye un Technical Account Manager (TAM) dedicado?',
        options: {
          A: 'Basic',
          B: 'Developer',
          C: 'Business',
          D: 'Enterprise',
        },
        answer: ['D'],
        explanation:
          'El plan Enterprise incluye un TAM designado, revisiones de arquitectura Well-Architected y respuesta en 15 minutos para casos críticos.',
        domain: 'Soporte y Recursos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué herramienta ayuda a estimar los costos de una arquitectura AWS antes de desplegarla?',
        options: {
          A: 'AWS Budgets',
          B: 'AWS Cost Explorer',
          C: 'AWS Pricing Calculator',
          D: 'AWS Trusted Advisor',
        },
        answer: ['C'],
        explanation:
          'AWS Pricing Calculator permite modelar arquitecturas futuras y obtener una estimación. Cost Explorer analiza gasto histórico, Budgets alerta desviaciones.',
        domain: 'Facturación y Precio',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué pilar del AWS Well-Architected Framework se enfoca en minimizar impacto ambiental?',
        options: {
          A: 'Operational Excellence',
          B: 'Reliability',
          C: 'Sustainability',
          D: 'Performance Efficiency',
        },
        answer: ['C'],
        explanation:
          'Sustainability fue añadido como sexto pilar en 2021, enfocado en reducir huella de carbono de workloads en la nube.',
        domain: 'Arquitectura',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio de base de datos está gestionado por AWS y es compatible con MySQL y PostgreSQL?',
        options: {
          A: 'Amazon DynamoDB',
          B: 'Amazon RDS',
          C: 'Amazon Redshift',
          D: 'Amazon Neptune',
        },
        answer: ['B'],
        explanation:
          'RDS es el servicio gestionado de bases relacionales. Soporta MySQL, PostgreSQL, MariaDB, Oracle, SQL Server y Aurora.',
        domain: 'Bases de Datos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio permite detectar configuraciones inseguras de IAM o recursos públicos expuestos?',
        options: {
          A: 'AWS Config',
          B: 'AWS CloudTrail',
          C: 'AWS Trusted Advisor',
          D: 'AWS Artifact',
        },
        answer: ['C'],
        explanation:
          'Trusted Advisor ejecuta checks automáticos sobre la cuenta (seguridad, costos, fault tolerance, performance, service limits).',
        domain: 'Seguridad y Compliance',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un cliente necesita servir contenido estático con baja latencia a usuarios globales. ¿Qué servicio usa?',
        options: {
          A: 'Amazon Route 53',
          B: 'Amazon CloudFront',
          C: 'AWS Global Accelerator',
          D: 'Elastic Load Balancer',
        },
        answer: ['B'],
        explanation:
          'CloudFront es el CDN de AWS que cachea contenido en edge locations cerca del usuario final.',
        domain: 'Networking y Content Delivery',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué afirmación sobre AWS Free Tier es correcta?',
        options: {
          A: 'Todos los servicios son gratis durante 12 meses',
          B: 'Solo incluye servicios de compute',
          C: 'Incluye ofertas "always free", "12 meses" y "trials"',
          D: 'Requiere plan Business o superior',
        },
        answer: ['C'],
        explanation:
          'El Free Tier tiene tres tipos: Always Free (Lambda 1M requests/mes), 12 Months Free (EC2 t2.micro), y Trials específicos por servicio.',
        domain: 'Facturación y Precio',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué protocolo usa Amazon Route 53 principalmente?',
        options: {
          A: 'HTTP',
          B: 'DNS',
          C: 'SMTP',
          D: 'FTP',
        },
        answer: ['B'],
        explanation:
          'Route 53 es un servicio DNS altamente disponible y escalable con routing policies (simple, weighted, latency, geolocation, failover).',
        domain: 'Networking y Content Delivery',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál de los siguientes es un servicio de migración de bases de datos de AWS?',
        options: {
          A: 'AWS DMS',
          B: 'AWS Snowball',
          C: 'AWS Transfer Family',
          D: 'AWS Storage Gateway',
        },
        answer: ['A'],
        explanation:
          'AWS Database Migration Service (DMS) permite migrar bases relacionales, NoSQL y data warehouses hacia AWS con downtime mínimo.',
        domain: 'Bases de Datos',
        difficulty: 'medium',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Azure Fundamentals
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'azure-fundamentals-az900',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    description:
      'Conceptos cloud, servicios core de Azure, seguridad, governance y costos. Basado en el exam skills outline público de Microsoft Learn.',
    domain: 'it',
    category: 'cloud',
    level: 'beginner',
    language: 'es',
    tags: ['azure', 'microsoft', 'az-900', 'cloud'],
    passPercent: 70,
    timeMinutes: 30,
    source: 'Basado en Microsoft AZ-900 Exam Skills Outline (learn.microsoft.com/certifications/azure-fundamentals)',
    questions: [
      {
        type: 'multiple',
        question:
          '¿Cuál de los siguientes es un beneficio del consumo cloud (OpEx) versus on-premises (CapEx)?',
        options: {
          A: 'Mayor inversión inicial',
          B: 'Pago por uso sin inversión inicial',
          C: 'Depreciación contable',
          D: 'Tiempo de provisión de semanas',
        },
        answer: ['B'],
        explanation:
          'OpEx en cloud convierte gastos de capital en gastos operativos variables basados en consumo real.',
        domain: 'Conceptos Cloud',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué modelo de servicio proporciona máquinas virtuales, red y almacenamiento bajo demanda?',
        options: {
          A: 'SaaS',
          B: 'PaaS',
          C: 'IaaS',
          D: 'FaaS',
        },
        answer: ['C'],
        explanation:
          'IaaS entrega infraestructura virtualizada. Azure Virtual Machines es el ejemplo típico.',
        domain: 'Modelos de Servicio',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'En Azure, ¿qué nivel jerárquico agrupa suscripciones bajo políticas comunes?',
        options: {
          A: 'Resource Group',
          B: 'Management Group',
          C: 'Tenant',
          D: 'Region',
        },
        answer: ['B'],
        explanation:
          'Jerarquía: Management Group → Subscription → Resource Group → Resource. Los MGs permiten políticas y RBAC agrupados.',
        domain: 'Governance',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio permite ejecutar contenedores sin gestionar un clúster?',
        options: {
          A: 'Azure Kubernetes Service (AKS)',
          B: 'Azure Container Instances (ACI)',
          C: 'Azure Virtual Machines',
          D: 'Azure App Service',
        },
        answer: ['B'],
        explanation:
          'ACI ofrece contenedores serverless. AKS provee orquestación Kubernetes gestionada.',
        domain: 'Compute',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio es el directorio de identidad principal de Azure?',
        options: {
          A: 'Azure AD (ahora Microsoft Entra ID)',
          B: 'Active Directory Domain Services',
          C: 'Azure Key Vault',
          D: 'Azure Policy',
        },
        answer: ['A'],
        explanation:
          'Microsoft Entra ID (antes Azure Active Directory) es el servicio de identidad en la nube que gestiona usuarios, grupos y SSO.',
        domain: 'Identidad',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué herramienta permite estimar el Total Cost of Ownership (TCO) de migrar a Azure?',
        options: {
          A: 'Azure Advisor',
          B: 'Azure TCO Calculator',
          C: 'Azure Cost Management',
          D: 'Azure Monitor',
        },
        answer: ['B'],
        explanation:
          'El TCO Calculator compara costos on-premises vs Azure. Cost Management analiza gasto actual, Advisor optimiza.',
        domain: 'Costos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Seleccione DOS características de Azure Resource Manager (ARM).',
        options: {
          A: 'Agrupa recursos relacionados en Resource Groups',
          B: 'Reemplaza a Microsoft Entra ID',
          C: 'Soporta plantillas declarativas (ARM templates / Bicep)',
          D: 'Solo funciona con máquinas virtuales',
        },
        answer: ['A', 'C'],
        explanation:
          'ARM es el plano de control de Azure. Gestiona resource groups y permite IaC vía templates JSON o Bicep.',
        domain: 'Governance',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio protege aplicaciones web contra ataques comunes (SQL injection, XSS)?',
        options: {
          A: 'Azure Firewall',
          B: 'Network Security Group',
          C: 'Azure Web Application Firewall (WAF)',
          D: 'Azure DDoS Protection',
        },
        answer: ['C'],
        explanation:
          'WAF, parte de Application Gateway / Front Door, protege contra OWASP Top 10 a nivel aplicación.',
        domain: 'Seguridad',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué modelo de precio ofrece descuentos por compromiso de 1 o 3 años para VMs?',
        options: {
          A: 'Pay-as-you-go',
          B: 'Spot pricing',
          C: 'Reserved Instances',
          D: 'Dev/Test pricing',
        },
        answer: ['C'],
        explanation:
          'Reserved Instances dan hasta ~72% de descuento por compromisos plurianuales para workloads predecibles.',
        domain: 'Costos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio recopila telemetría y genera alertas basadas en métricas y logs?',
        options: {
          A: 'Azure Monitor',
          B: 'Azure Policy',
          C: 'Azure Blueprints',
          D: 'Azure Arc',
        },
        answer: ['A'],
        explanation:
          'Azure Monitor centraliza métricas, logs (Log Analytics), alertas y Application Insights.',
        domain: 'Monitoreo',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué tipo de cuenta de almacenamiento es óptima para archivos poco accedidos con baja prioridad?',
        options: {
          A: 'Hot tier',
          B: 'Cool tier',
          C: 'Archive tier',
          D: 'Premium tier',
        },
        answer: ['C'],
        explanation:
          'Archive tier es el más económico para datos rara vez accedidos (rehidratación puede tardar horas).',
        domain: 'Almacenamiento',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué garantiza Azure Service Level Agreement (SLA)?',
        options: {
          A: 'Que todos los servicios tienen 100% uptime',
          B: 'Compromisos formales de disponibilidad y créditos en caso de incumplimiento',
          C: 'Que los datos nunca se pierden',
          D: 'Velocidad de respuesta del soporte técnico',
        },
        answer: ['B'],
        explanation:
          'Los SLAs definen el % de disponibilidad esperado (ej. 99.99%) y dan créditos en la factura si se incumple.',
        domain: 'SLAs',
        difficulty: 'medium',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Git & GitHub Essentials
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'git-github-essentials',
    title: 'Git & GitHub — Fundamentos',
    description:
      'Comandos, flujos de trabajo (branches, merge, rebase), colaboración en GitHub (PRs, issues). Basado en documentación oficial de Git.',
    domain: 'it',
    category: 'devops',
    level: 'beginner',
    language: 'es',
    tags: ['git', 'github', 'version-control', 'devops'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Basado en Git Reference Manual (git-scm.com/docs) y GitHub Docs',
    questions: [
      {
        type: 'multiple',
        question: '¿Qué comando inicia un nuevo repositorio Git en un directorio?',
        options: { A: 'git start', B: 'git init', C: 'git new', D: 'git create' },
        answer: ['B'],
        explanation: '`git init` crea el directorio `.git` con la estructura interna del repositorio.',
        domain: 'Comandos Básicos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia entre `git fetch` y `git pull`?',
        options: {
          A: 'Son idénticos',
          B: 'fetch descarga cambios sin fusionar; pull descarga Y fusiona (fetch + merge)',
          C: 'pull solo funciona con SSH',
          D: 'fetch borra cambios locales',
        },
        answer: ['B'],
        explanation: '`git pull` = `git fetch` + `git merge` (o `rebase` si está configurado).',
        domain: 'Sincronización Remota',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué comando revierte el último commit manteniendo los cambios en el staging area?',
        options: {
          A: 'git reset --soft HEAD~1',
          B: 'git reset --hard HEAD~1',
          C: 'git revert HEAD',
          D: 'git checkout HEAD~1',
        },
        answer: ['A'],
        explanation:
          '`--soft` mueve HEAD pero mantiene cambios en staging. `--hard` los descarta. `revert` crea un commit inverso.',
        domain: 'Deshacer Cambios',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué hace `git stash`?',
        options: {
          A: 'Elimina archivos no rastreados',
          B: 'Guarda temporalmente cambios no commiteados para recuperarlos luego',
          C: 'Crea una nueva rama',
          D: 'Commitea automáticamente',
        },
        answer: ['B'],
        explanation:
          'Stash guarda cambios en una pila temporal. Recuperar con `git stash pop` o `git stash apply`.',
        domain: 'Área de Trabajo',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el flujo correcto de GitHub Flow para proponer un cambio?',
        options: {
          A: 'Commit directo a main',
          B: 'Branch → commit → push → Pull Request → review → merge',
          C: 'Branch → merge local → push a main',
          D: 'Fork → clone → commit → email al maintainer',
        },
        answer: ['B'],
        explanation:
          'GitHub Flow: rama de feature, commits, push, PR para revisión, merge a main tras aprobación.',
        domain: 'Colaboración',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Seleccione DOS afirmaciones correctas sobre `git rebase`.',
        options: {
          A: 'Reescribe el historial de commits',
          B: 'Siempre crea un merge commit',
          C: 'No debe usarse en ramas compartidas ya publicadas',
          D: 'Es lo mismo que `git merge`',
        },
        answer: ['A', 'C'],
        explanation:
          'Rebase reescribe commits y cambia sus hashes; por eso rebasear ramas públicas causa problemas a otros colaboradores.',
        domain: 'Branching',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué archivo se usa para excluir archivos del tracking de Git?',
        options: { A: '.gitignore', B: '.gitexclude', C: '.ignore', D: 'gitignore.txt' },
        answer: ['A'],
        explanation:
          '`.gitignore` en cualquier nivel del repositorio lista patrones de archivos a ignorar.',
        domain: 'Configuración',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la función principal de `git cherry-pick <commit>`?',
        options: {
          A: 'Elimina un commit específico',
          B: 'Aplica un commit específico de otra rama a la rama actual',
          C: 'Fusiona todo el historial de otra rama',
          D: 'Crea un tag',
        },
        answer: ['B'],
        explanation:
          'cherry-pick copia un commit individual desde otra rama hacia la rama actual.',
        domain: 'Comandos Avanzados',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué comando muestra el historial de commits?',
        options: { A: 'git history', B: 'git log', C: 'git show', D: 'git list' },
        answer: ['B'],
        explanation:
          '`git log` muestra el historial. Modificadores útiles: `--oneline`, `--graph`, `--all`.',
        domain: 'Comandos Básicos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué acción de GitHub permite ejecutar CI/CD declarativo en archivos YAML?',
        options: {
          A: 'GitHub Pages',
          B: 'GitHub Actions',
          C: 'GitHub Packages',
          D: 'GitHub Codespaces',
        },
        answer: ['B'],
        explanation:
          'Actions ejecuta workflows definidos en `.github/workflows/*.yml`.',
        domain: 'GitHub',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué significa HEAD en Git?',
        options: {
          A: 'El último commit del repositorio remoto',
          B: 'El primer commit del repositorio',
          C: 'Un puntero al commit actual de la rama activa',
          D: 'Una variable de entorno',
        },
        answer: ['C'],
        explanation:
          'HEAD apunta normalmente al tip de la rama activa. En "detached HEAD" apunta a un commit directo.',
        domain: 'Conceptos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué hace `git reflog`?',
        options: {
          A: 'Muestra logs de conexiones SSH',
          B: 'Lista operaciones locales sobre HEAD (permite recuperar commits "perdidos")',
          C: 'Muestra logs del servidor remoto',
          D: 'Muestra errores',
        },
        answer: ['B'],
        explanation:
          'reflog es un salvavidas: registra cada cambio de HEAD localmente, permitiendo recuperar commits tras reset/rebase.',
        domain: 'Recuperación',
        difficulty: 'hard',
      },
    ],
  },
];
