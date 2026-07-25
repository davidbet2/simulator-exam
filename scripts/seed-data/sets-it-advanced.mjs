/**
 * Advanced IT / Cloud / DevOps certification sets.
 *
 * SOURCES (public blueprints only):
 *   - AWS SAA-C03 Exam Guide (aws.amazon.com/certification)
 *   - Google Associate Cloud Engineer Exam Guide (cloud.google.com)
 *   - Kubernetes docs + CKAD curriculum (cncf.io)
 *   - Docker documentation (docs.docker.com)
 *   - Linux Foundation LFS101 public syllabus
 *   - SQL-92 / ISO/IEC 9075 public standard
 */

export const IT_ADVANCED_SETS = [
  // NOTA: el set 'aws-solutions-architect-associate' (15 preguntas) que vivía aquí
  // fue removido — reemplazado por una versión más completa (30 preguntas, con
  // pesos de dominio reales investigados) en scripts/seed-data/sets-cloud-extended.mjs
  // para evitar slugs duplicados. Ver ese archivo para el contenido vigente.

  // ═══════════════════════════════════════════════════════════════════
  // Google Associate Cloud Engineer
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'google-associate-cloud-engineer',
    title: 'Google Associate Cloud Engineer (GCP ACE)',
    description:
      'Despliegue y gestión de soluciones en GCP: Compute Engine, GKE, Cloud Storage, IAM y facturación. Basado en el exam guide público.',
    domain: 'it',
    category: 'cloud',
    level: 'intermediate',
    language: 'es',
    tags: ['gcp', 'google-cloud', 'ace', 'cloud'],
    passPercent: 70,
    timeMinutes: 30,
    source: 'Basado en Google Associate Cloud Engineer Exam Guide (cloud.google.com/certification/cloud-engineer)',
    questions: [
      {
        type: 'multiple',
        question: '¿Cuál es la jerarquía de recursos en Google Cloud?',
        options: {
          A: 'Project → Folder → Organization → Resources',
          B: 'Organization → Folder → Project → Resources',
          C: 'Resources → Project → Organization',
          D: 'Account → VPC → Resource Group',
        },
        answer: ['B'],
        explanation:
          'La jerarquía permite políticas de IAM heredadas: Organization (raíz) → Folders → Projects → Resources.',
        domain: 'Governance',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio gestionado de GCP es Kubernetes?',
        options: { A: 'Cloud Run', B: 'App Engine', C: 'Google Kubernetes Engine (GKE)', D: 'Cloud Functions' },
        answer: ['C'],
        explanation: 'GKE ofrece Kubernetes gestionado con modo Standard y Autopilot.',
        domain: 'Compute',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Quieres ejecutar contenedores HTTP serverless con auto-scaling a cero. ¿Qué servicio usas?',
        options: { A: 'Compute Engine', B: 'Cloud Run', C: 'GKE Standard', D: 'App Engine Flexible' },
        answer: ['B'],
        explanation:
          'Cloud Run escala de 0 a N automáticamente. Solo pagas por request. GKE/App Engine Flexible requieren VMs running.',
        domain: 'Compute',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Necesitas cache en memoria para reducir latencia de BD. ¿Qué servicio de GCP?',
        options: { A: 'Cloud Memorystore', B: 'Cloud Bigtable', C: 'Firestore', D: 'Cloud Spanner' },
        answer: ['A'],
        explanation: 'Memorystore ofrece Redis y Memcached gestionados.',
        domain: 'Bases de Datos',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué clase de Cloud Storage es más económica para archivos accedidos menos de una vez al año?',
        options: { A: 'Standard', B: 'Nearline', C: 'Coldline', D: 'Archive' },
        answer: ['D'],
        explanation:
          'Archive: acceso < 1 vez/año. Coldline: < 1 vez/trimestre. Nearline: < 1 vez/mes.',
        domain: 'Almacenamiento',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué comando de gcloud CLI cambia el proyecto activo?',
        options: {
          A: 'gcloud set project',
          B: 'gcloud config set project PROJECT_ID',
          C: 'gcloud project use PROJECT_ID',
          D: 'gcloud change-project',
        },
        answer: ['B'],
        explanation: 'La config se gestiona con `gcloud config set <key> <value>`.',
        domain: 'CLI',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Seleccione DOS formas válidas de dar permisos a un service account en IAM.',
        options: {
          A: 'Asignar un role predefinido a nivel de proyecto',
          B: 'Asignar un role custom a nivel de organización',
          C: 'Hardcodear claves JSON en el código fuente',
          D: 'Exportar la clave privada a internet público',
        },
        answer: ['A', 'B'],
        explanation:
          'Roles predefinidos/custom en project/org/folder/resource son el método correcto. Las llaves en el código violan seguridad.',
        domain: 'IAM',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio es data warehouse serverless en GCP?',
        options: { A: 'BigQuery', B: 'Cloud SQL', C: 'Bigtable', D: 'Dataflow' },
        answer: ['A'],
        explanation: 'BigQuery permite SQL analytics sobre petabytes con modelo serverless.',
        domain: 'Analytics',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Para gastos compartidos con múltiples proyectos, ¿cómo se consolidan facturas?',
        options: {
          A: 'Cada proyecto recibe factura separada',
          B: 'Se usa una Billing Account vinculada a todos los proyectos',
          C: 'Se migra todo a un solo proyecto',
          D: 'No se puede consolidar',
        },
        answer: ['B'],
        explanation: 'Una Billing Account puede estar vinculada a múltiples proyectos; la factura es consolidada.',
        domain: 'Facturación',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio permite mirror de tráfico de red para análisis de seguridad sin impactar performance?',
        options: {
          A: 'VPC Flow Logs',
          B: 'Packet Mirroring',
          C: 'Cloud Armor',
          D: 'Cloud IDS',
        },
        answer: ['B'],
        explanation:
          'Packet Mirroring copia tráfico L4 a un collector. VPC Flow Logs solo tiene metadatos de flujo.',
        domain: 'Networking',
        difficulty: 'hard',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Docker fundamentals
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'docker-fundamentals',
    title: 'Docker — Fundamentos',
    description:
      'Contenedores, imágenes, Dockerfile, volúmenes, redes y docker-compose. Basado en la documentación oficial pública de Docker.',
    domain: 'it',
    category: 'devops',
    level: 'beginner',
    language: 'es',
    tags: ['docker', 'containers', 'devops'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Basado en Docker Official Documentation (docs.docker.com)',
    questions: [
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia entre una imagen y un contenedor Docker?',
        options: {
          A: 'No hay diferencia, son sinónimos',
          B: 'Una imagen es una plantilla inmutable; un contenedor es una instancia en ejecución de una imagen',
          C: 'Un contenedor es más pesado que una imagen',
          D: 'Las imágenes ejecutan código; los contenedores no',
        },
        answer: ['B'],
        explanation: 'La imagen es el blueprint read-only; el contenedor es la instancia viva con su capa de escritura.',
        domain: 'Conceptos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué comando construye una imagen a partir de un Dockerfile?',
        options: { A: 'docker run', B: 'docker build', C: 'docker create', D: 'docker compile' },
        answer: ['B'],
        explanation: '`docker build -t myimg:tag .` lee el Dockerfile del contexto y construye la imagen.',
        domain: 'Build',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué instrucción de Dockerfile declara variables de entorno?',
        options: { A: 'ARG', B: 'ENV', C: 'SET', D: 'EXPORT' },
        answer: ['B'],
        explanation:
          'ENV persiste en el contenedor. ARG solo existe durante build.',
        domain: 'Dockerfile',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué comando lista contenedores en ejecución?',
        options: { A: 'docker ls', B: 'docker ps', C: 'docker containers', D: 'docker list' },
        answer: ['B'],
        explanation: '`docker ps` lista activos. `docker ps -a` incluye los parados.',
        domain: 'CLI',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Para qué sirven los volúmenes Docker?',
        options: {
          A: 'Almacenar imágenes Docker',
          B: 'Persistir datos fuera del ciclo de vida del contenedor',
          C: 'Configurar redes',
          D: 'Acelerar el build',
        },
        answer: ['B'],
        explanation: 'Los volúmenes son managed storage que sobreviven a la eliminación del contenedor.',
        domain: 'Volúmenes',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Selecciona DOS instrucciones válidas que definan qué comando ejecuta el contenedor.',
        options: { A: 'CMD', B: 'ENTRYPOINT', C: 'RUN', D: 'WORKDIR' },
        answer: ['A', 'B'],
        explanation:
          'CMD y ENTRYPOINT definen el comando de arranque. RUN ejecuta durante build. WORKDIR cambia directorio.',
        domain: 'Dockerfile',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué es un multi-stage build y su principal beneficio?',
        options: {
          A: 'Construir imágenes en paralelo',
          B: 'Usar múltiples FROM para separar build-tools de la imagen final, reduciendo su tamaño',
          C: 'Buildear para múltiples arquitecturas',
          D: 'Ejecutar múltiples contenedores',
        },
        answer: ['B'],
        explanation:
          'Multi-stage: compilas en una stage con SDKs y copias el artefacto a una imagen base mínima (ej. alpine/distroless).',
        domain: 'Optimización',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué archivo define múltiples servicios en Docker Compose?',
        options: {
          A: 'Dockerfile',
          B: 'docker-compose.yml',
          C: 'compose.json',
          D: 'services.yaml',
        },
        answer: ['B'],
        explanation: '`docker-compose.yml` (o `compose.yaml`) define services, networks y volumes.',
        domain: 'Compose',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Para mapear el puerto 80 del contenedor al 8080 del host, ¿qué flag usas en `docker run`?',
        options: { A: '-p 80:8080', B: '-p 8080:80', C: '--expose 80', D: '-P' },
        answer: ['B'],
        explanation: 'Sintaxis: `-p HOST:CONTAINER`. 8080 (host) : 80 (contenedor).',
        domain: 'Networking',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué comando muestra los logs de un contenedor?',
        options: { A: 'docker log <name>', B: 'docker logs <name>', C: 'docker show-logs', D: 'docker inspect' },
        answer: ['B'],
        explanation: '`docker logs <container>` muestra stdout/stderr. `-f` para seguir en tiempo real.',
        domain: 'CLI',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la capa MÁS óptima en un Dockerfile para invalidar menos la cache?',
        options: {
          A: 'Copiar el código fuente primero y luego instalar dependencias',
          B: 'Copiar manifest de dependencias (ej. package.json), instalarlas, y LUEGO copiar el código',
          C: 'Usar solo FROM y CMD',
          D: 'Ejecutar RUN con instalar y copiar juntos',
        },
        answer: ['B'],
        explanation:
          'Docker cachea capas por hash. Si cambias código pero no las deps, la capa de instalación se reusa.',
        domain: 'Optimización',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué comando elimina contenedores parados, imágenes sin tag y redes no usadas?',
        options: { A: 'docker clean', B: 'docker prune', C: 'docker system prune', D: 'docker gc' },
        answer: ['C'],
        explanation:
          '`docker system prune` limpia recursos no usados. Añade `-a` para también borrar imágenes sin contenedores.',
        domain: 'CLI',
        difficulty: 'medium',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // Kubernetes CKAD fundamentals
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'kubernetes-ckad-fundamentals',
    title: 'Kubernetes CKAD — Fundamentos',
    description:
      'Pods, Deployments, Services, ConfigMaps, Secrets, Probes y recursos básicos. Basado en el CKAD curriculum público del CNCF.',
    domain: 'it',
    category: 'devops',
    level: 'intermediate',
    language: 'es',
    tags: ['kubernetes', 'k8s', 'ckad', 'devops', 'containers'],
    passPercent: 66,
    timeMinutes: 30,
    source: 'Basado en CNCF CKAD Curriculum v1.28 (github.com/cncf/curriculum)',
    questions: [
      {
        type: 'multiple',
        question: '¿Cuál es la unidad ejecutable más pequeña en Kubernetes?',
        options: { A: 'Container', B: 'Pod', C: 'Node', D: 'Deployment' },
        answer: ['B'],
        explanation:
          'Un Pod contiene 1+ contenedores que comparten red y storage. Es el objeto programable más pequeño.',
        domain: 'Conceptos',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué recurso gestiona réplicas de Pods y rolling updates?',
        options: { A: 'ReplicaSet', B: 'Deployment', C: 'DaemonSet', D: 'StatefulSet' },
        answer: ['B'],
        explanation:
          'Deployment orquesta ReplicaSets con strategy Rolling/Recreate y rollback.',
        domain: 'Workloads',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué Service expone una app sin balanceador externo, accesible solo dentro del cluster?',
        options: { A: 'NodePort', B: 'LoadBalancer', C: 'ClusterIP', D: 'ExternalName' },
        answer: ['C'],
        explanation:
          'ClusterIP es el default: IP interna, no accesible desde fuera sin port-forward/proxy.',
        domain: 'Networking',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué objeto se usa para inyectar credenciales sensibles (passwords, tokens) a Pods?',
        options: { A: 'ConfigMap', B: 'Secret', C: 'Volume', D: 'ServiceAccount' },
        answer: ['B'],
        explanation:
          'Secret almacena datos sensibles base64-encoded. ConfigMap es para config no-sensible.',
        domain: 'Configuración',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia entre liveness y readiness probe?',
        options: {
          A: 'Son idénticos',
          B: 'Liveness reinicia el Pod si falla; Readiness lo saca de rotación del Service si falla',
          C: 'Readiness reinicia; Liveness saca de rotación',
          D: 'Ambos reinician el Pod',
        },
        answer: ['B'],
        explanation:
          'Liveness: ¿está vivo? Si no → restart. Readiness: ¿listo para tráfico? Si no → removido del endpoint.',
        domain: 'Probes',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS comandos `kubectl` válidos para ver los Pods.',
        options: {
          A: 'kubectl get pods',
          B: 'kubectl list pods',
          C: 'kubectl show pods',
          D: 'kubectl get po',
        },
        answer: ['A', 'D'],
        explanation: '`get pods` (plural) y abreviación `get po` son equivalentes.',
        domain: 'CLI',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué comando escala un deployment a 5 réplicas?',
        options: {
          A: 'kubectl resize deployment myapp --replicas=5',
          B: 'kubectl scale deployment myapp --replicas=5',
          C: 'kubectl set replicas myapp=5',
          D: 'kubectl expand deployment myapp 5',
        },
        answer: ['B'],
        explanation: '`kubectl scale` ajusta el spec.replicas del recurso.',
        domain: 'CLI',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué tipo de volumen permite compartir datos entre contenedores del MISMO Pod?',
        options: { A: 'hostPath', B: 'emptyDir', C: 'persistentVolumeClaim', D: 'configMap' },
        answer: ['B'],
        explanation:
          'emptyDir se crea al iniciar el Pod y existe mientras el Pod vive. Ideal para compartir datos temporales entre containers.',
        domain: 'Storage',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué objeto controla cómo ciertas aplicaciones pueden comunicarse a nivel de red?',
        options: { A: 'Service', B: 'Ingress', C: 'NetworkPolicy', D: 'EndpointSlice' },
        answer: ['C'],
        explanation:
          'NetworkPolicy aplica reglas L3/L4 tipo firewall entre Pods (requiere CNI compatible: Calico, Cilium, etc.).',
        domain: 'Networking',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question: '¿Qué hace `kubectl apply -f manifest.yaml`?',
        options: {
          A: 'Borra el recurso',
          B: 'Aplica cambios declarativos: crea si no existe, actualiza si existe',
          C: 'Solo crea recursos nuevos',
          D: 'Solo actualiza, falla si no existe',
        },
        answer: ['B'],
        explanation:
          '`apply` es declarativo (vs `create` que es imperativo). Usa three-way-merge para calcular el diff.',
        domain: 'CLI',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué recurso expone HTTP(S) externamente con routing por host o path?',
        options: { A: 'Service LoadBalancer', B: 'Ingress', C: 'NodePort', D: 'HostNetwork' },
        answer: ['B'],
        explanation:
          'Ingress define reglas L7 (host/path) hacia Services. Requiere un Ingress Controller (nginx, Traefik, etc.).',
        domain: 'Networking',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Para ejecutar un Pod en cada nodo (ej. agente de logs), ¿qué workload resource usas?',
        options: { A: 'Deployment', B: 'DaemonSet', C: 'Job', D: 'CronJob' },
        answer: ['B'],
        explanation:
          'DaemonSet asegura que cada (o un subset de) nodo tenga una copia del Pod.',
        domain: 'Workloads',
        difficulty: 'medium',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SQL Fundamentals
  // ═══════════════════════════════════════════════════════════════════
  {
    slug: 'sql-fundamentals',
    title: 'SQL — Fundamentos',
    description:
      'SELECT, JOIN, GROUP BY, subqueries, índices y normalización. Basado en el estándar SQL público ISO/IEC 9075.',
    domain: 'it',
    category: 'database',
    level: 'beginner',
    language: 'es',
    tags: ['sql', 'database', 'data'],
    passPercent: 70,
    timeMinutes: 25,
    source: 'Basado en estándar ISO/IEC 9075 (SQL:2016) y documentación pública de PostgreSQL/MySQL',
    questions: [
      {
        type: 'multiple',
        question: '¿Qué cláusula filtra filas ANTES del agrupamiento en una query con GROUP BY?',
        options: { A: 'HAVING', B: 'WHERE', C: 'FILTER', D: 'ORDER BY' },
        answer: ['B'],
        explanation:
          'WHERE filtra filas antes del GROUP BY. HAVING filtra grupos después del agregado.',
        domain: 'Queries',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué JOIN retorna TODAS las filas de la tabla izquierda, y NULL para las no-coincidencias de la derecha?',
        options: { A: 'INNER JOIN', B: 'LEFT JOIN', C: 'RIGHT JOIN', D: 'FULL OUTER JOIN' },
        answer: ['B'],
        explanation:
          'LEFT (OUTER) JOIN conserva todas las filas de la izquierda.',
        domain: 'Joins',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia principal entre DELETE y TRUNCATE?',
        options: {
          A: 'Son idénticos',
          B: 'TRUNCATE es más rápido, no dispara triggers, no puede usar WHERE y generalmente no es rollbackable',
          C: 'DELETE borra la tabla; TRUNCATE borra filas',
          D: 'TRUNCATE solo funciona con SQLite',
        },
        answer: ['B'],
        explanation:
          'TRUNCATE es DDL, hace drop/recreate de la tabla vacía. DELETE es DML transaccional con soporte de WHERE y triggers.',
        domain: 'DML/DDL',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué función agrega sin contar NULLs: cantidad total de valores NO-NULOS en una columna?',
        options: { A: 'COUNT(*)', B: 'COUNT(column)', C: 'SUM(column)', D: 'AVG(column)' },
        answer: ['B'],
        explanation: 'COUNT(column) ignora NULLs. COUNT(*) cuenta filas incluyendo NULLs.',
        domain: 'Agregados',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Para evitar tabla-scan en queries que filtran por `email`, ¿qué estructura creas?',
        options: { A: 'FOREIGN KEY', B: 'ÍNDICE (INDEX)', C: 'TRIGGER', D: 'VIEW' },
        answer: ['B'],
        explanation:
          'Los índices (B-Tree usualmente) aceleran búsquedas puntuales y rangos. Coste: ocupan espacio y enlentecen INSERT/UPDATE.',
        domain: 'Performance',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: 'Selecciona DOS propiedades ACID de una transacción.',
        options: { A: 'Atomicity', B: 'Concurrency', C: 'Isolation', D: 'Caching' },
        answer: ['A', 'C'],
        explanation: 'ACID = Atomicity, Consistency, Isolation, Durability.',
        domain: 'Transacciones',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué es una subquery correlacionada?',
        options: {
          A: 'Una subquery ejecutada una sola vez',
          B: 'Una subquery que referencia columnas de la query externa y se ejecuta por fila',
          C: 'Un JOIN tradicional',
          D: 'Una query en otra base de datos',
        },
        answer: ['B'],
        explanation:
          'Una correlacionada depende del contexto de la query externa; se re-evalúa por cada fila → puede ser costosa.',
        domain: 'Subqueries',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Tercera Forma Normal (3NF) significa:',
        options: {
          A: 'Toda columna depende de la PK, de toda la PK y nada más que la PK',
          B: 'No hay relaciones foreign key',
          C: 'Solo se permiten números',
          D: 'Una tabla por cada entidad en el dominio',
        },
        answer: ['A'],
        explanation:
          '3NF elimina dependencias transitivas: cada atributo no-clave depende directamente de la PK.',
        domain: 'Normalización',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué cláusula elimina duplicados en el resultado?',
        options: { A: 'UNIQUE', B: 'DISTINCT', C: 'SINGLE', D: 'ONLY' },
        answer: ['B'],
        explanation: '`SELECT DISTINCT col FROM ...` retorna solo valores únicos.',
        domain: 'Queries',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Para paginar resultados (skip 20, traer 10 filas), ¿qué sintaxis es estándar moderna?',
        options: {
          A: 'TOP 10 OFFSET 20',
          B: 'LIMIT 10 OFFSET 20',
          C: 'FETCH 10 SKIP 20',
          D: 'PAGE 3 OF 10',
        },
        answer: ['B'],
        explanation:
          '`LIMIT n OFFSET m` es sintaxis de PostgreSQL/MySQL/SQLite. El estándar ISO es `FETCH FIRST n ROWS ONLY OFFSET m`.',
        domain: 'Queries',
        difficulty: 'medium',
      },
    ],
  },
];
