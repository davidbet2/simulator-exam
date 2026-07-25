// Generado por el subagente exam-content-architect (research + QA manual, sin LLM-API externo).
// Batch: cloud-extended — COMPLETO: 9 sets (terraform-associate, aws-solutions-architect-associate,
// aws-developer-associate, aws-sysops-administrator, azure-administrator-az104,
// gcp-cloud-digital-leader, azure-developer-az204, comptia-network-plus, rest-api-design).
//
// AWS Certified Developer – Associate (DVA-C02): Development with AWS Services 32%,
// Security 26%, Deployment 24%, Troubleshooting and Optimization 18%.
// AWS Certified SysOps Administrator – Associate (SOA-C02): Monitoring/Logging/Remediation 20%,
// Reliability and BC 16%, Deployment/Provisioning/Automation 18%, Security and Compliance 16%,
// Network and Content Delivery 18%, Cost and Performance Optimization 12%.
// AZ-104 (actualizado abr-2026): Identities and Governance 20-25%, Storage 15-20%,
// Compute 20-25%, Networking 15-20%, Monitoring 10-15%.
// AZ-204 (actualizado ene-2026): Develop Azure compute solutions 25-30%, Develop for
// Azure storage 15-20%, Implement Azure security 20-25%, Monitor/troubleshoot/optimize,
// Integrate APIs and event-based solutions.
// Google Cloud Digital Leader: Cloud with Google Cloud 36%, Data and AI 30%,
// Infrastructure and App Modernization 26%, Security and Operations 8%.
// CompTIA Network+ (N10-009, vigente desde jun-2024): Networking Fundamentals 24%,
// Network Implementations 19%, Network Operations 16%, Network Security, Network
// Troubleshooting 22%.
// REST API Design: sin certificación oficial única — basado en RFC 7231 (HTTP Semantics)
// y OpenAPI Specification 3.1, mejores prácticas ampliamente adoptadas en la industria.
//
// Fuente de research (vigente al generar, ene-2026): HashiCorp Certified: Terraform
// Associate (004) — reemplazó a la versión 003 el 8-ene-2026. 8 dominios oficiales,
// examen de opción múltiple, 60 min, online-proctored vía Certiverse.
// https://developer.hashicorp.com/certifications/infrastructure-automation
// La página oficial NO publica el peso porcentual por dominio ni el passing score
// exacto — la distribución de preguntas abajo es una estimación razonada basada en
// el alcance relativo de cada dominio en el temario oficial, no un dato oficial.
//
// AWS Certified Solutions Architect – Associate (SAA-C03) — versión vigente en 2026.
// 4 dominios oficiales con peso publicado en el exam guide: Design Secure Architectures
// 30%, Design Resilient Architectures 26%, Design High-Performing Architectures 24%,
// Design Cost-Optimized Architectures 20%.
// https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide_C03.pdf

export const CLOUD_EXTENDED_SETS = [
  {
    slug: 'terraform-associate',
    title: 'HashiCorp Terraform Associate (004)',
    description:
      'Examen de práctica alineado a los 8 dominios oficiales de HashiCorp Certified: Terraform Associate (004): IaC, fundamentos, core workflow, configuración, módulos, state, mantenimiento de infraestructura y HCP Terraform.',
    domain: 'it',
    category: 'iac',
    level: 'intermediate',
    language: 'es',
    tags: ['terraform', 'iac', 'hashicorp', 'hcp-terraform'],
    passPercent: 70,
    timeMinutes: 44,
    source:
      'Basado en HashiCorp Certified: Terraform Associate (004) Exam Objectives — developer.hashicorp.com/certifications/infrastructure-automation (contenido original, sin copiar preguntas oficiales)',
    questions: [
      // ── Dominio 1: IaC con Terraform (3) ──────────────────────────────
      {
        type: 'multiple',
        question:
          '¿Cuál es la ventaja principal de usar Infrastructure as Code (IaC) frente a aprovisionar infraestructura manualmente desde la consola de un proveedor cloud?',
        options: {
          A: 'Elimina por completo la necesidad de pruebas antes de desplegar a producción',
          B: 'Permite definir la infraestructura de forma versionable, repetible y revisable como código',
          C: 'Solo funciona con un único proveedor cloud a la vez',
          D: 'Garantiza que nunca ocurrirán errores de configuración',
        },
        answer: ['B'],
        explanation:
          'IaC convierte la infraestructura en artefactos de código: se puede versionar en Git, revisar en pull requests, reutilizar y reproducir de forma consistente entre entornos, a diferencia del clickops manual.',
        domain: 'IaC con Terraform',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cómo se clasifica el enfoque de Terraform para describir infraestructura: declarativo o imperativo?',
        options: {
          A: 'Imperativo: se especifican los pasos exactos para llegar al estado deseado',
          B: 'Declarativo: se describe el estado final deseado y Terraform calcula cómo alcanzarlo',
          C: 'Híbrido obligatorio entre scripts bash e imperativo',
          D: 'No aplica ninguna de las dos categorías',
        },
        answer: ['B'],
        explanation:
          'En Terraform el usuario declara el estado deseado (recursos y su configuración) en archivos .tf, y el motor de Terraform calcula el plan de ejecución necesario para llegar a ese estado.',
        domain: 'IaC con Terraform',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un equipo necesita administrar con una sola herramienta recursos en AWS y en Azure dentro del mismo proyecto. ¿Qué característica de Terraform hace esto posible?',
        options: {
          A: 'Terraform traduce automáticamente la configuración de AWS a Azure',
          B: 'Su arquitectura de providers, que son plugins independientes por cada plataforma/API',
          C: 'Solo es posible usando dos archivos de state completamente separados sin relación',
          D: 'Terraform requiere una cuenta unificada válida en ambos proveedores',
        },
        answer: ['B'],
        explanation:
          'Terraform es agnóstico de proveedor gracias a su arquitectura de plugins (providers): cada provider traduce el HCL a llamadas de la API correspondiente, permitiendo combinar múltiples providers en una misma configuración.',
        domain: 'IaC con Terraform',
        difficulty: 'medium',
      },

      // ── Dominio 2: Terraform Fundamentals (4) ─────────────────────────
      {
        type: 'multiple',
        question:
          '¿En qué bloque se declaran los providers requeridos por una configuración y sus restricciones de versión?',
        options: {
          A: 'Dentro de `provider "aws" { }`',
          B: 'Dentro de `terraform { required_providers { } }`',
          C: 'Dentro de `variable "providers" { }`',
          D: 'Dentro de `resource { }`',
        },
        answer: ['B'],
        explanation:
          'El bloque `terraform { required_providers { ... } }` declara qué providers necesita la configuración, su source (ej. hashicorp/aws) y la restricción de versión permitida.',
        domain: 'Terraform Fundamentals',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'En una restricción de versión de provider `version = "~> 5.0"`, ¿qué versiones acepta Terraform?',
        options: {
          A: 'Cualquier versión mayor o igual a 5.0, incluyendo 6.x y superiores',
          B: 'Solo exactamente la versión 5.0',
          C: 'Cualquier versión 5.x (desde 5.0 hasta, sin incluir, 6.0)',
          D: 'Solo versiones anteriores a 5.0',
        },
        answer: ['C'],
        explanation:
          'El operador `~>` ("pessimistic constraint") permite incrementos en el último componente especificado: `~> 5.0` acepta 5.0, 5.1, 5.9, etc., pero no 6.0.',
        domain: 'Terraform Fundamentals',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué hace `terraform init` en un directorio de trabajo?',
        options: {
          A: 'Aplica los cambios de infraestructura descritos en la configuración',
          B: 'Descarga los providers y módulos requeridos e inicializa el backend configurado',
          C: 'Elimina toda la infraestructura gestionada por Terraform',
          D: 'Genera automáticamente el archivo main.tf',
        },
        answer: ['B'],
        explanation:
          '`terraform init` prepara el directorio de trabajo: descarga los plugins de providers y módulos declarados, e inicializa (o migra) el backend donde se guardará el state.',
        domain: 'Terraform Fundamentals',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un desarrollador clona el repositorio de infraestructura de su equipo y ejecuta `terraform init`, pero obtiene una versión de provider distinta a la que usó el resto del equipo la semana pasada. ¿Cuál es la causa más probable?',
        options: {
          A: 'El archivo `.terraform.lock.hcl` no estaba commiteado en el repositorio',
          B: 'Terraform siempre instala la última versión disponible sin importar restricciones',
          C: 'El desarrollador necesita ejecutar `terraform apply` antes de `init`',
          D: 'Los providers no pueden fijarse a una versión específica',
        },
        answer: ['A'],
        explanation:
          'El archivo de bloqueo de dependencias `.terraform.lock.hcl` registra las versiones exactas de providers usadas; si no se commitea, cada `terraform init` puede resolver una versión distinta dentro del rango permitido por `required_providers`.',
        domain: 'Terraform Fundamentals',
        difficulty: 'medium',
      },

      // ── Dominio 3: Core Terraform Workflow (7) ────────────────────────
      {
        type: 'multiple',
        question:
          '¿Cuál es el orden típico del flujo de trabajo principal de Terraform para aplicar cambios de infraestructura?',
        options: {
          A: 'apply → plan → init',
          B: 'init → plan → apply',
          C: 'plan → init → destroy',
          D: 'apply → init → plan',
        },
        answer: ['B'],
        explanation:
          'El flujo core de Terraform es: `init` (prepara el directorio), `plan` (previsualiza los cambios) y `apply` (los ejecuta). `fmt` y `validate` son pasos complementarios de higiene y verificación.',
        domain: 'Core Terraform Workflow',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué hace el comando `terraform fmt`?',
        options: {
          A: 'Valida que las credenciales del provider sean correctas',
          B: 'Reescribe los archivos de configuración con el formato/estilo canónico de HCL',
          C: 'Formatea (borra) el contenido del state remoto',
          D: 'Convierte archivos .tf a JSON',
        },
        answer: ['B'],
        explanation:
          '`terraform fmt` aplica de forma automática las convenciones de estilo estándar de HCL (indentación, alineación) a los archivos .tf del directorio, sin modificar la lógica.',
        domain: 'Core Terraform Workflow',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question: '¿Qué verifica `terraform validate` y qué NO verifica?',
        options: {
          A: 'Verifica que la sintaxis HCL sea válida y que la configuración sea internamente consistente, pero no consulta el estado real de la infraestructura en el proveedor',
          B: 'Verifica que las credenciales cloud sean válidas contactando al proveedor',
          C: 'Verifica que el plan de cambios no vaya a eliminar recursos',
          D: 'Verifica que el código haya pasado revisión humana',
        },
        answer: ['A'],
        explanation:
          '`terraform validate` revisa sintaxis y consistencia interna (tipos, referencias, argumentos requeridos) usando los schemas de los providers ya inicializados, pero no necesita ni consulta el estado real de los recursos en la nube.',
        domain: 'Core Terraform Workflow',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'En la salida de `terraform plan` aparece el símbolo `-/+` junto a un recurso. ¿Qué significa?',
        options: {
          A: 'El recurso se actualizará in-place sin interrupción',
          B: 'El recurso se destruirá y luego se recreará (reemplazo)',
          C: 'El recurso no sufrirá ningún cambio',
          D: 'El recurso se importará al state',
        },
        answer: ['B'],
        explanation:
          'El prefijo `-/+` indica un "replace": el cambio en algún argumento no se puede aplicar in-place (requiere recrear el recurso), así que Terraform lo destruirá y creará uno nuevo.',
        domain: 'Core Terraform Workflow',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un pipeline de CI/CD necesita ejecutar `terraform apply` sin intervención humana durante el despliegue automatizado. ¿Qué flag evita el prompt interactivo de confirmación?',
        options: {
          A: '--force',
          B: '-auto-approve',
          C: '-y',
          D: '--no-confirm',
        },
        answer: ['B'],
        explanation:
          '`terraform apply -auto-approve` omite la pregunta interactiva "Do you want to perform these actions?", necesaria en pipelines automatizados donde no hay un humano para confirmar.',
        domain: 'Core Terraform Workflow',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Cambiaste un argumento de un recurso que fuerza su reemplazo (ForceNew) y el recurso NO tiene configurado `lifecycle { create_before_destroy = true }`. ¿Qué ocurre por defecto al aplicar el cambio?',
        options: {
          A: 'Terraform crea primero el recurso nuevo y luego destruye el viejo, sin downtime',
          B: 'Terraform destruye el recurso existente primero y luego crea el nuevo, lo que puede causar downtime',
          C: 'Terraform rechaza el cambio y no permite continuar',
          D: 'Terraform actualiza el recurso in-place ignorando la restricción',
        },
        answer: ['B'],
        explanation:
          'Por defecto, el orden de reemplazo es destroy-then-create, lo que puede generar downtime para recursos críticos. `create_before_destroy = true` en el bloque `lifecycle` invierte ese orden para minimizarlo.',
        domain: 'Core Terraform Workflow',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Necesitas que `terraform plan` solo evalúe el módulo `module.database` sin considerar el resto de la configuración, para revisar un cambio puntual. ¿Qué flag usas?',
        options: {
          A: '-target=module.database',
          B: '-only=module.database',
          C: '-module=database',
          D: '-limit=database',
        },
        answer: ['A'],
        explanation:
          'El flag `-target` (disponible en `plan`, `apply` y `destroy`) restringe la operación a un recurso o módulo específico y sus dependencias. HashiCorp recomienda usarlo solo en escenarios excepcionales, no como flujo habitual.',
        domain: 'Core Terraform Workflow',
        difficulty: 'hard',
      },

      // ── Dominio 4: Terraform Configuration (8) ────────────────────────
      {
        type: 'multiple',
        question: '¿Cuál es la diferencia fundamental entre un bloque `resource` y un bloque `data`?',
        options: {
          A: 'No hay diferencia, son sinónimos',
          B: '`resource` crea y gestiona un objeto nuevo; `data` solo lee información de un objeto ya existente sin gestionarlo',
          C: '`data` siempre crea infraestructura nueva más rápido que `resource`',
          D: '`resource` solo puede usarse con providers cloud, `data` con cualquier provider',
        },
        answer: ['B'],
        explanation:
          'Un bloque `resource` declara un objeto cuyo ciclo de vida (crear, actualizar, destruir) gestiona Terraform. Un bloque `data` consulta información de algo que ya existe (creado por Terraform o no) sin gestionarlo.',
        domain: 'Terraform Configuration',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Dentro de un bloque `variable "environment" { }`, ¿qué argumento restringe el tipo de dato aceptado (por ejemplo, string)?',
        options: {
          A: 'kind',
          B: 'type',
          C: 'datatype',
          D: 'class',
        },
        answer: ['B'],
        explanation:
          'El argumento `type` de un bloque `variable` define la restricción de tipo (string, number, bool, list, map, object, etc.) que Terraform valida al asignar un valor.',
        domain: 'Terraform Configuration',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Marcaste una variable con `sensitive = true`. ¿Qué efecto real tiene esto en Terraform?',
        options: {
          A: 'El valor queda encriptado también dentro del archivo de state',
          B: 'Terraform oculta el valor en la salida de CLI (plan/apply), pero igual queda almacenado en texto plano dentro del state',
          C: 'La variable deja de poder usarse en ningún output',
          D: 'Terraform la excluye automáticamente del grafo de dependencias',
        },
        answer: ['B'],
        explanation:
          '`sensitive = true` solo redacta el valor en la salida de consola (aparece como `(sensitive value)`). El valor sigue guardándose sin encriptar en el archivo de state, por lo que este debe protegerse igual (backend remoto seguro, no versionarlo en Git).',
        domain: 'Terraform Configuration',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la diferencia clave entre usar `count` y `for_each` para crear múltiples instancias de un mismo recurso?',
        options: {
          A: 'Son idénticos en comportamiento, solo cambia la sintaxis',
          B: '`for_each` identifica cada instancia por una clave de un map/set de strings; `count` la identifica por un índice numérico posicional',
          C: '`count` solo funciona con módulos, nunca con recursos',
          D: '`for_each` no permite acceder a `each.value` dentro del bloque',
        },
        answer: ['B'],
        explanation:
          '`for_each` asocia cada instancia a una clave estable (string) de un map o set, mientras que `count` usa un índice (0, 1, 2...) que depende del orden de la lista. Esto hace a `for_each` más resistente a reordenamientos.',
        domain: 'Terraform Configuration',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo usa `count = length(var.subnet_cidrs)` para crear subnets y elimina el segundo elemento (índice 1) de la lista `var.subnet_cidrs`. ¿Qué problema típico provoca esto en el siguiente `terraform plan`?',
        options: {
          A: 'Ningún problema, Terraform detecta automáticamente que solo cambió un elemento',
          B: 'Todos los recursos con índice posterior al eliminado se destruyen y recrean, porque sus índices se recorren',
          C: 'Terraform rechaza el plan y exige usar `for_each` obligatoriamente',
          D: 'Solo se elimina la subnet correspondiente al índice 1, sin afectar a las demás',
        },
        answer: ['B'],
        explanation:
          'Con `count`, cada instancia se identifica por su posición en la lista (aws_subnet.this[0], [1], [2]...). Al quitar un elemento del medio, los índices posteriores se recorren, y Terraform interpreta eso como destruir y recrear esos recursos aunque su configuración real no cambió — un problema clásico que `for_each` evita.',
        domain: 'Terraform Configuration',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Para qué se usa el meta-argumento `depends_on` en un bloque `resource` o `module`?',
        options: {
          A: 'Para declarar una dependencia explícita cuando Terraform no puede inferirla automáticamente por referencias entre atributos',
          B: 'Para definir el proveedor que debe usar el recurso',
          C: 'Para importar el recurso a un state distinto',
          D: 'Para marcar el recurso como de solo lectura',
        },
        answer: ['A'],
        explanation:
          'Terraform infiere dependencias automáticamente cuando un recurso referencia atributos de otro. `depends_on` se usa para casos donde existe una dependencia real (ej. permisos IAM que deben existir antes) pero no hay una referencia directa de atributos que Terraform pueda detectar.',
        domain: 'Terraform Configuration',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Necesitas generar un número variable de bloques anidados `ingress` dentro de un `aws_security_group`, a partir de una lista de reglas definida en una variable. ¿Qué construcción de HCL usas?',
        options: {
          A: 'Un bloque `dynamic "ingress" { for_each = var.rules content { ... } }`',
          B: 'Repetir manualmente el bloque `ingress` con `count`',
          C: 'Un bloque `data "ingress"`',
          D: 'No es posible generar bloques anidados de forma dinámica en HCL',
        },
        answer: ['A'],
        explanation:
          'Los bloques `dynamic` permiten generar de forma programática múltiples bloques anidados (como `ingress` dentro de un security group) iterando sobre una colección, usando `for_each` y un bloque `content` interno.',
        domain: 'Terraform Configuration',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Creaste 3 instancias EC2 con `resource "aws_instance" "web" { count = 3 ... }`. ¿Qué expresión obtiene la lista con los IDs de las 3 instancias?',
        options: {
          A: 'aws_instance.web.id',
          B: 'aws_instance.web[*].id',
          C: 'aws_instance.web.ids',
          D: 'list(aws_instance.web.id)',
        },
        answer: ['B'],
        explanation:
          'La splat expression `aws_instance.web[*].id` devuelve una lista con el atributo `id` de todas las instancias creadas por `count` (o `for_each`), equivalente a `[for w in aws_instance.web : w.id]`.',
        domain: 'Terraform Configuration',
        difficulty: 'medium',
      },

      // ── Dominio 5: Terraform Modules (5) ──────────────────────────────
      {
        type: 'multiple',
        question: '¿Qué es el "root module" en Terraform?',
        options: {
          A: 'El módulo publicado en el Terraform Registry con más descargas',
          B: 'El directorio de trabajo principal que contiene los archivos .tf desde donde se ejecuta Terraform',
          C: 'Un módulo obligatorio que gestiona únicamente el state remoto',
          D: 'El primer módulo creado históricamente en el proyecto',
        },
        answer: ['B'],
        explanation:
          'El root module es el módulo de nivel superior: el directorio donde se ejecutan los comandos de Terraform. Puede invocar (llamar) a otros módulos como "child modules".',
        domain: 'Terraform Modules',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Quieres referenciar un módulo local ubicado en una carpeta hermana llamada `network`. ¿Cómo debe escribirse el argumento `source`?',
        options: {
          A: 'source = "network"',
          B: 'source = "../network"',
          C: 'source = "modules:network"',
          D: 'source = "local://network"',
        },
        answer: ['B'],
        explanation:
          'Los módulos locales se referencian con una ruta relativa que DEBE empezar con `./` o `../`; sin ese prefijo, Terraform interpreta el valor como una dirección de módulo del Registry.',
        domain: 'Terraform Modules',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el formato estándar de dirección para un módulo publicado en el Terraform Registry público?',
        options: {
          A: '<PROVIDER>/<NAME>/<NAMESPACE>',
          B: '<NAMESPACE>/<NAME>/<PROVIDER>',
          C: 'registry.terraform.io/<NAME>',
          D: '<NAME>@<NAMESPACE>',
        },
        answer: ['B'],
        explanation:
          'Ejemplo real: `terraform-aws-modules/vpc/aws`, donde `terraform-aws-modules` es el namespace, `vpc` el nombre del módulo y `aws` el provider objetivo — formato `<NAMESPACE>/<NAME>/<PROVIDER>`.',
        domain: 'Terraform Modules',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Estás usando un módulo del Terraform Registry y quieres asegurarte de que el equipo siempre use versiones 3.x sin saltar a una 4.0 con cambios incompatibles. ¿Qué argumento agregas al bloque `module`?',
        options: {
          A: 'source_version = "3.x"',
          B: 'version = "~> 3.0"',
          C: 'pin = "3"',
          D: 'lock_version = true',
        },
        answer: ['B'],
        explanation:
          'El argumento `version` en un bloque `module` acepta restricciones de versión igual que en `required_providers`; `~> 3.0` permite parches y minor releases dentro de la serie 3.x, pero no 4.0. Este argumento solo aplica a módulos versionados (Registry), no a fuentes locales o de git sin tags.',
        domain: 'Terraform Modules',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un módulo hijo llamado "vpc" define `output "vpc_id" { value = aws_vpc.this.id }`. ¿Cómo se referencia ese valor desde el root module?',
        options: {
          A: 'vpc.vpc_id',
          B: 'module.vpc.vpc_id',
          C: 'output.vpc.vpc_id',
          D: 'var.vpc_id',
        },
        answer: ['B'],
        explanation:
          'Los outputs de un módulo hijo se acceden desde el llamador con la sintaxis `module.<NOMBRE_LOCAL_DEL_MODULO>.<NOMBRE_DEL_OUTPUT>`, donde `<NOMBRE_LOCAL_DEL_MODULO>` es el label usado en `module "vpc" { ... }`.',
        domain: 'Terraform Modules',
        difficulty: 'easy',
      },

      // ── Dominio 6: State Management (7) ───────────────────────────────
      {
        type: 'multiple',
        question: '¿Cuál es la función principal del archivo de state de Terraform?',
        options: {
          A: 'Almacenar el código fuente de los módulos usados',
          B: 'Mantener el mapeo entre los recursos declarados en la configuración y los objetos reales existentes, junto con sus metadatos',
          C: 'Guardar las credenciales del proveedor cloud',
          D: 'Reemplazar la necesidad de escribir archivos .tf',
        },
        answer: ['B'],
        explanation:
          'El state (terraform.tfstate) es la fuente de verdad que vincula cada recurso de la configuración con el objeto real en el proveedor, y guarda metadatos (dependencias, atributos) usados para calcular los planes.',
        domain: 'State Management',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un equipo de 5 personas trabaja sobre la misma configuración de Terraform usando state local (archivo en disco de cada uno). ¿Cuál es el riesgo principal frente a usar un backend remoto?',
        options: {
          A: 'El state local es más lento de leer que uno remoto',
          B: 'No hay locking ni una única fuente de verdad compartida, lo que puede causar conflictos y aplicar cambios sobre state desactualizado',
          C: 'El state local no permite usar variables',
          D: 'Terraform no permite ejecutar `plan` con state local',
        },
        answer: ['B'],
        explanation:
          'Un backend remoto centraliza el state para todo el equipo y habilita locking (evita ediciones concurrentes). Con state local cada persona tiene su propia copia, lo que genera desincronización y riesgo de sobrescribir cambios de otros.',
        domain: 'State Management',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Configuraste un backend `s3` con una tabla DynamoDB asociada para tu equipo. ¿Para qué se usa esa tabla DynamoDB en este contexto?',
        options: {
          A: 'Para almacenar el propio archivo de state en vez de S3',
          B: 'Para el locking del state: evita que dos ejecuciones de Terraform modifiquen el state al mismo tiempo',
          C: 'Para guardar los logs de `terraform apply`',
          D: 'Para cachear los providers descargados',
        },
        answer: ['B'],
        explanation:
          'Con el backend S3, la tabla DynamoDB se usa para el locking del state (bloqueo durante `plan`/`apply`), evitando escrituras concurrentes que podrían corromper el state. El contenido del state en sí se guarda en el bucket S3.',
        domain: 'State Management',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question: '¿Qué muestra el comando `terraform state list`?',
        options: {
          A: 'La lista de módulos disponibles en el Terraform Registry',
          B: 'La lista de direcciones de todos los recursos actualmente rastreados en el state',
          C: 'La lista de versiones históricas del state',
          D: 'La lista de variables definidas en terraform.tfvars',
        },
        answer: ['B'],
        explanation:
          '`terraform state list` imprime las direcciones (ej. `aws_instance.web`, `module.vpc.aws_subnet.public[0]`) de todos los recursos que Terraform está rastreando en el state actual.',
        domain: 'State Management',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Renombraste un recurso en tu configuración de `aws_instance.web` a `aws_instance.app_server` sin querer que Terraform lo destruya y recree. ¿Qué comando usas para reflejar el cambio en el state sin tocar la infraestructura real?',
        options: {
          A: 'terraform state rm aws_instance.web',
          B: 'terraform state mv aws_instance.web aws_instance.app_server',
          C: 'terraform import aws_instance.app_server',
          D: 'terraform refresh',
        },
        answer: ['B'],
        explanation:
          '`terraform state mv` renombra o mueve una entrada del state (por ejemplo tras un refactor de nombres o al mover un recurso dentro/fuera de un módulo) sin destruir ni recrear el recurso real.',
        domain: 'State Management',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Alguien eliminó manualmente una instancia EC2 desde la consola de AWS, sin pasar por Terraform. ¿Qué mostrará el siguiente `terraform plan`?',
        options: {
          A: 'No mostrará ningún cambio, porque Terraform no puede detectar cambios fuera de su control',
          B: 'Un plan para recrear la instancia, ya que detecta drift: el recurso existe en el state pero ya no existe en la realidad',
          C: 'Un error fatal que impide seguir usando esa configuración',
          D: 'Eliminará automáticamente la referencia del código .tf',
        },
        answer: ['B'],
        explanation:
          'Terraform actualiza su conocimiento del estado real durante `plan` (refresh); si detecta que un recurso presente en el state ya no existe realmente (drift), propondrá un plan para crearlo de nuevo y así converger al estado declarado en la configuración.',
        domain: 'State Management',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un `terraform apply` se interrumpió abruptamente (ej. corte de red) y el lock del state quedó activo, bloqueando nuevas ejecuciones aunque nadie lo está usando realmente. ¿Qué comando permite liberar ese lock manualmente?',
        options: {
          A: 'terraform unlock',
          B: 'terraform state unlock',
          C: 'terraform force-unlock <LOCK_ID>',
          D: 'terraform apply -unlock',
        },
        answer: ['C'],
        explanation:
          '`terraform force-unlock <LOCK_ID>` libera manualmente un lock huérfano del state. Debe usarse con precaución: solo cuando se confirma que ninguna otra operación está realmente en curso, para evitar corromper el state.',
        domain: 'State Management',
        difficulty: 'hard',
      },

      // ── Dominio 7: Maintain Infrastructure with Terraform (3) ─────────
      {
        type: 'multiple',
        question:
          'Tu equipo tiene una base de datos RDS creada manualmente hace tiempo (fuera de Terraform) y ahora quiere gestionarla con Terraform sin destruirla y recrearla. ¿Qué comando usan?',
        options: {
          A: 'terraform apply -replace',
          B: 'terraform import',
          C: 'terraform state mv',
          D: 'terraform refresh',
        },
        answer: ['B'],
        explanation:
          '`terraform import` incorpora un recurso existente (creado fuera de Terraform) al state, asociándolo a un bloque `resource` ya escrito en la configuración, sin recrear el objeto real.',
        domain: 'Maintain Infrastructure with Terraform',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Para ejecutar `terraform import aws_instance.web i-0abcd1234efgh5678`, ¿qué precondición debe cumplirse en la configuración?',
        options: {
          A: 'No hace falta ningún bloque `resource` previo; Terraform lo genera automáticamente',
          B: 'Debe existir ya un bloque `resource "aws_instance" "web" { ... }` en el código al que se asociará ese ID',
          C: 'Debe existir un `data` block con el mismo nombre',
          D: 'El recurso debe estar previamente destruido',
        },
        answer: ['B'],
        explanation:
          '`terraform import` solo vincula el ID real de un objeto existente a una dirección de recurso YA declarada en el código (`aws_instance.web`); el bloque `resource` debe escribirse manualmente antes (o después, ajustándolo para que coincida con los atributos reales).',
        domain: 'Maintain Infrastructure with Terraform',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Estás depurando por qué un `terraform apply` falla con un error poco claro del provider. ¿Qué variable de entorno habilita logging detallado (debug/trace) de Terraform?',
        options: {
          A: 'TF_DEBUG=1',
          B: 'TF_LOG=TRACE',
          C: 'TF_VERBOSE=true',
          D: 'TERRAFORM_DEBUG_MODE=on',
        },
        answer: ['B'],
        explanation:
          'La variable de entorno `TF_LOG` controla el nivel de logging interno de Terraform (TRACE, DEBUG, INFO, WARN, ERROR); `TF_LOG=TRACE` es el nivel más detallado, útil para depurar problemas de providers.',
        domain: 'Maintain Infrastructure with Terraform',
        difficulty: 'easy',
      },

      // ── Dominio 8: HCP Terraform (3) ──────────────────────────────────
      {
        type: 'multiple',
        question:
          '¿Cuál es la diferencia principal entre un "workspace" de HCP Terraform y un CLI workspace (`terraform workspace`)?',
        options: {
          A: 'Son exactamente lo mismo, solo cambia el nombre',
          B: 'Un workspace de HCP Terraform agrupa configuración, variables, state y el historial de runs de un despliegue; el CLI workspace solo es un mecanismo ligero para tener múltiples states con la misma configuración local',
          C: 'El CLI workspace requiere pago, HCP Terraform es siempre gratuito',
          D: 'HCP Terraform solo puede tener un workspace por organización',
        },
        answer: ['B'],
        explanation:
          'En HCP Terraform, un "workspace" es una unidad completa de gestión (config + variables + state + runs). El `terraform workspace` de la CLI es un concepto más simple para alternar entre varios states dentro del mismo directorio de configuración — no deben confundirse.',
        domain: 'HCP Terraform',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Configuraste un workspace de HCP Terraform conectado a un repositorio Git (flujo VCS-driven). ¿Cuándo se dispara automáticamente un nuevo run?',
        options: {
          A: 'Nunca de forma automática; siempre debe iniciarse manualmente desde la UI',
          B: 'Cuando se detecta un nuevo commit/merge en la rama configurada del repositorio vinculado',
          C: 'Solo una vez al día según un cron fijo',
          D: 'Solo cuando expira el token de HCP Terraform',
        },
        answer: ['B'],
        explanation:
          'En el flujo VCS-driven, HCP Terraform se suscribe a eventos del repositorio conectado (ej. push o merge a la rama configurada) y dispara automáticamente un nuevo plan/run al detectar cambios relevantes.',
        domain: 'HCP Terraform',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Varios workspaces de HCP Terraform necesitan las mismas credenciales de AWS sin que cada equipo tenga que copiarlas manualmente en cada uno. ¿Qué funcionalidad de HCP Terraform resuelve esto?',
        options: {
          A: 'Sentinel Policies',
          B: 'Variable Sets',
          C: 'State Versions',
          D: 'Run Triggers',
        },
        answer: ['B'],
        explanation:
          'Los Variable Sets permiten definir un grupo de variables (incluyendo credenciales sensibles) una sola vez y aplicarlo a múltiples workspaces, evitando duplicación y facilitando la rotación centralizada.',
        domain: 'HCP Terraform',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'aws-solutions-architect-associate',
    title: 'AWS Solutions Architect Associate (SAA-C03)',
    description:
      'Examen de práctica alineado a los 4 dominios oficiales de AWS Certified Solutions Architect – Associate: diseño de arquitecturas seguras, resilientes, de alto rendimiento y optimizadas en costo.',
    domain: 'it',
    category: 'cloud-aws',
    level: 'advanced',
    language: 'es',
    tags: ['aws', 'saa', 'solutions-architect', 'saa-c03'],
    passPercent: 72,
    timeMinutes: 33,
    source:
      'Basado en AWS Certified Solutions Architect – Associate (SAA-C03) Exam Guide — d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide_C03.pdf (contenido original)',
    questions: [
      // ── Dominio 1: Design Secure Architectures — 30% (9) ──────────────
      {
        type: 'multiple',
        question:
          'Una aplicación en EC2 necesita leer objetos de un bucket S3 sin almacenar credenciales de larga duración en la instancia. ¿Cuál es la práctica recomendada por AWS?',
        options: {
          A: 'Guardar el access key y secret key del usuario IAM directamente en un archivo de configuración de la instancia',
          B: 'Asociar un IAM Role a la instancia EC2 mediante un Instance Profile, con una policy que permita el acceso necesario a S3',
          C: 'Hacer el bucket S3 público para evitar gestionar permisos',
          D: 'Compartir las credenciales root de la cuenta AWS entre todas las instancias',
        },
        answer: ['B'],
        explanation:
          'Un IAM Role asociado vía Instance Profile entrega credenciales temporales rotadas automáticamente a la instancia, eliminando la necesidad de almacenar credenciales estáticas — la práctica de seguridad recomendada por AWS (principio de menor privilegio).',
        domain: 'Design Secure Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Qué diferencia principal existe entre un Security Group y una Network ACL en una VPC?',
        options: {
          A: 'El Security Group es stateless y opera a nivel de subnet; la NACL es stateful y opera a nivel de instancia',
          B: 'El Security Group es stateful y opera a nivel de instancia/ENI; la NACL es stateless y opera a nivel de subnet, evaluando reglas de allow y deny en orden',
          C: 'Ambos son exactamente equivalentes y se usan indistintamente',
          D: 'La NACL solo puede tener reglas de permitir, nunca de denegar',
        },
        answer: ['B'],
        explanation:
          'Los Security Groups son stateful (el tráfico de retorno se permite automáticamente) y se aplican a nivel de ENI/instancia. Las NACLs son stateless (hay que definir reglas de entrada y salida por separado), operan a nivel de subnet y evalúan reglas numeradas, incluyendo deny explícito.',
        domain: 'Design Secure Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa necesita cifrar los datos en reposo de sus buckets S3 y controlar de forma centralizada la rotación y auditoría de las claves de cifrado. ¿Qué servicio deben usar?',
        options: {
          A: 'AWS Shield',
          B: 'AWS KMS (Key Management Service) con SSE-KMS',
          C: 'Amazon Macie exclusivamente',
          D: 'AWS WAF',
        },
        answer: ['B'],
        explanation:
          'AWS KMS gestiona claves de cifrado de forma centralizada, con rotación automática opcional y registro de auditoría vía CloudTrail. SSE-KMS es la opción de cifrado de S3 que usa claves gestionadas por KMS.',
        domain: 'Design Secure Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una organización con múltiples cuentas AWS quiere aplicar guardrails preventivos (ej. prohibir crear recursos fuera de ciertas regiones) a todas las cuentas de una unidad de negocio. ¿Qué servicio usan?',
        options: {
          A: 'AWS Organizations con Service Control Policies (SCPs)',
          B: 'IAM Roles individuales en cada cuenta',
          C: 'Amazon GuardDuty',
          D: 'AWS Config Rules únicamente',
        },
        answer: ['A'],
        explanation:
          'Las Service Control Policies (SCPs) de AWS Organizations son guardrails preventivos que definen los permisos máximos disponibles para las cuentas dentro de una unidad organizativa (OU), sin importar los permisos IAM locales de cada cuenta.',
        domain: 'Design Secure Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un equipo de seguridad necesita detectar de forma continua actividad maliciosa o no autorizada (ej. escaneo de puertos, IPs comprometidas) analizando logs de VPC Flow Logs, CloudTrail y DNS. ¿Qué servicio deben habilitar?',
        options: {
          A: 'Amazon GuardDuty',
          B: 'AWS Trusted Advisor',
          C: 'Amazon Inspector',
          D: 'AWS Config',
        },
        answer: ['A'],
        explanation:
          'Amazon GuardDuty es un servicio de detección de amenazas administrado que analiza continuamente CloudTrail, VPC Flow Logs y logs de DNS para identificar comportamiento anómalo o malicioso, usando threat intelligence.',
        domain: 'Design Secure Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un sitio web en CloudFront/S3 sufre ataques de inyección SQL y XSS en los parámetros de las solicitudes HTTP. ¿Qué servicio se coloca frente a la aplicación para filtrar ese tráfico malicioso a nivel de capa de aplicación?',
        options: {
          A: 'AWS Shield Standard únicamente',
          B: 'AWS WAF (Web Application Firewall), con reglas administradas contra SQLi/XSS',
          C: 'Security Groups con reglas más estrictas',
          D: 'Amazon Route 53 con health checks',
        },
        answer: ['B'],
        explanation:
          'AWS WAF opera en la capa 7 (aplicación) y permite crear reglas (o usar reglas administradas) para bloquear patrones de ataque como SQL injection y XSS antes de que lleguen a la aplicación, integrándose con CloudFront, ALB o API Gateway.',
        domain: 'Design Secure Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una arquitectura requiere que los datos sensibles almacenados en RDS estén cifrados en reposo. Si la instancia RDS NO se creó con cifrado habilitado desde el inicio, ¿cómo se puede cifrarla?',
        options: {
          A: 'Habilitando cifrado directamente en la instancia existente con un simple toggle',
          B: 'Creando un snapshot de la instancia, copiándolo con cifrado habilitado, y restaurando una nueva instancia desde ese snapshot cifrado',
          C: 'No es posible cifrar una instancia RDS después de creada bajo ninguna circunstancia',
          D: 'Cambiando el tipo de instancia a Aurora automáticamente cifra los datos existentes',
        },
        answer: ['B'],
        explanation:
          'El cifrado de una instancia RDS se define al crearla y no puede activarse in-place. La forma de migrar una instancia sin cifrar a una cifrada es: snapshot → copiar snapshot habilitando cifrado (KMS) → restaurar una nueva instancia desde el snapshot cifrado.',
        domain: 'Design Secure Architectures',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          'Un arquitecto necesita conceder a un usuario permisos amplios de solo lectura sobre todos los servicios de la cuenta, pero sin permitir ninguna acción de escritura o eliminación. ¿Cuál es el enfoque correcto siguiendo el principio de menor privilegio?',
        options: {
          A: 'Asignar la política administrada AdministratorAccess y confiar en que el usuario no modifique nada',
          B: 'Crear/usar una policy IAM que otorgue explícitamente acciones "Describe*", "List*", "Get*" y niegue acciones de escritura',
          C: 'Dar acceso root temporal cada vez que se necesite',
          D: 'No es posible otorgar acceso de solo lectura granular en IAM',
        },
        answer: ['B'],
        explanation:
          'IAM permite construir políticas de solo lectura otorgando explícitamente las acciones de tipo lectura (Describe/List/Get) por servicio, sin incluir acciones de escritura — más seguro y alineado al principio de menor privilegio que usar políticas administradas amplias como AdministratorAccess.',
        domain: 'Design Secure Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa necesita que las aplicaciones en una VPC privada (sin acceso a internet) puedan invocar APIs de S3 y DynamoDB sin pasar por un NAT Gateway ni internet público. ¿Qué componente de VPC resuelve esto?',
        options: {
          A: 'Un Internet Gateway adicional',
          B: 'VPC Endpoints (Gateway Endpoints para S3/DynamoDB o Interface Endpoints para otros servicios)',
          C: 'Un NAT Instance en vez de NAT Gateway',
          D: 'Aumentar el tamaño de la subnet',
        },
        answer: ['B'],
        explanation:
          'Los VPC Endpoints permiten que recursos dentro de una VPC privada se comuniquen con servicios de AWS (como S3 y DynamoDB vía Gateway Endpoints) sin salir a internet ni requerir NAT Gateway, manteniendo el tráfico dentro de la red de AWS.',
        domain: 'Design Secure Architectures',
        difficulty: 'hard',
      },

      // ── Dominio 2: Design Resilient Architectures — 26% (8) ───────────
      {
        type: 'multiple',
        question:
          'Una aplicación crítica en RDS necesita alta disponibilidad con failover automático ante la caída de la instancia principal. ¿Qué característica de RDS deben habilitar?',
        options: {
          A: 'Read Replicas únicamente',
          B: 'Multi-AZ Deployment, que mantiene una réplica en standby sincrónica en otra Availability Zone con failover automático',
          C: 'Aumentar el tamaño de la instancia (vertical scaling)',
          D: 'Habilitar Auto Scaling en RDS',
        },
        answer: ['B'],
        explanation:
          'Multi-AZ crea una réplica standby sincrónica en otra AZ; ante una falla de la instancia primaria, RDS conmuta automáticamente el endpoint a la standby (failover), sin requerir cambios en la aplicación. Es para alta disponibilidad, distinto a Read Replicas (que son para escalar lecturas).',
        domain: 'Design Resilient Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Dos microservicios están acoplados directamente vía llamadas síncronas y, cuando el servicio B está caído, las solicitudes del servicio A fallan en cascada. ¿Qué patrón de AWS ayuda a desacoplarlos y absorber picos de carga?',
        options: {
          A: 'Aumentar el timeout de las llamadas HTTP entre A y B',
          B: 'Introducir una cola Amazon SQS entre A y B para procesamiento asíncrono desacoplado',
          C: 'Fusionar ambos servicios en una sola instancia EC2',
          D: 'Eliminar el servicio B por completo',
        },
        answer: ['B'],
        explanation:
          'Insertar una cola SQS entre los servicios desacopla el productor del consumidor: el servicio A puede seguir encolando mensajes aunque B esté temporalmente caído o lento, y B los procesa a su propio ritmo cuando se recupera — patrón clásico de resiliencia.',
        domain: 'Design Resilient Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué servicio de AWS distribuye automáticamente el tráfico entrante entre múltiples instancias EC2 en distintas Availability Zones y realiza health checks para dejar de enviar tráfico a instancias no saludables?',
        options: {
          A: 'Amazon Route 53 únicamente',
          B: 'Elastic Load Balancing (ALB/NLB)',
          C: 'AWS Direct Connect',
          D: 'Amazon CloudFront',
        },
        answer: ['B'],
        explanation:
          'Elastic Load Balancing distribuye el tráfico entre instancias saludables en múltiples AZs, con health checks configurables que sacan del pool a las instancias que fallan, mejorando la resiliencia de la aplicación.',
        domain: 'Design Resilient Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una aplicación en un Auto Scaling Group pierde datos de sesión cada vez que una instancia se recicla o escala hacia abajo. ¿Cuál es la solución arquitectónica recomendada?',
        options: {
          A: 'Aumentar el tiempo de vida de las instancias para que nunca se reciclen',
          B: 'Externalizar el estado de sesión a un almacén compartido como Amazon ElastiCache o DynamoDB, haciendo las instancias stateless',
          C: 'Guardar la sesión únicamente en el disco local (EBS) de cada instancia',
          D: 'Deshabilitar el Auto Scaling Group',
        },
        answer: ['B'],
        explanation:
          'Diseñar instancias stateless —externalizando sesión/estado a un almacén compartido (ElastiCache, DynamoDB)— permite que Auto Scaling agregue o retire instancias libremente sin pérdida de datos de sesión, un principio central de arquitecturas resilientes en la nube.',
        domain: 'Design Resilient Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es la diferencia entre un backup point-in-time restore (PITR) de RDS y un snapshot manual?',
        options: {
          A: 'Son exactamente lo mismo',
          B: 'PITR usa backups automáticos y transaction logs para restaurar la base de datos a cualquier segundo dentro del período de retención; el snapshot manual captura un punto fijo en el tiempo elegido explícitamente y se conserva hasta que se elimina manualmente',
          C: 'El snapshot manual nunca puede usarse para restaurar la base de datos',
          D: 'PITR solo funciona en instancias Multi-AZ',
        },
        answer: ['B'],
        explanation:
          'Los backups automáticos con PITR permiten restaurar a cualquier momento dentro del período de retención (usando snapshots diarios + transaction logs); los snapshots manuales son puntos explícitos que persisten indefinidamente hasta borrarlos, útiles antes de cambios riesgosos.',
        domain: 'Design Resilient Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una empresa quiere que su sitio web siga disponible en modo lectura ante una interrupción total de una región de AWS. ¿Qué combinación de servicios apoya mejor un diseño multi-región de alta disponibilidad?',
        options: {
          A: 'Un único bucket S3 en una sola región con versioning habilitado',
          B: 'S3 Cross-Region Replication + Route 53 con routing policy de failover entre regiones',
          C: 'Solo aumentar el tamaño de las instancias EC2 en la región principal',
          D: 'Un Security Group configurado en ambas regiones',
        },
        answer: ['B'],
        explanation:
          'S3 Cross-Region Replication mantiene copias del contenido en otra región, y Route 53 con una routing policy de failover puede redirigir el tráfico automáticamente hacia la región secundaria si la primaria falla los health checks.',
        domain: 'Design Resilient Architectures',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué mide y garantiza el SLA de durabilidad de "11 nueves" (99.999999999%) de Amazon S3?',
        options: {
          A: 'Que S3 estará disponible (accesible) el 99.999999999% del tiempo',
          B: 'Que la probabilidad de pérdida de un objeto almacenado es extremadamente baja, gracias a la replicación automática entre múltiples dispositivos y AZs dentro de la región',
          C: 'Que las solicitudes a S3 nunca tendrán latencia',
          D: 'Que S3 nunca requiere backups adicionales para ningún caso de uso',
        },
        answer: ['B'],
        explanation:
          'La durabilidad (distinta de disponibilidad) mide la probabilidad de que un objeto NO se pierda. S3 logra 11 nueves de durabilidad replicando automáticamente cada objeto entre múltiples dispositivos de almacenamiento en al menos 3 AZs.',
        domain: 'Design Resilient Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un Auto Scaling Group está configurado en una única subnet de una única Availability Zone. ¿Qué riesgo de resiliencia introduce esta configuración?',
        options: {
          A: 'Ninguno, Auto Scaling siempre garantiza alta disponibilidad sin importar la distribución de subnets',
          B: 'Si esa Availability Zone completa falla, todas las instancias del grupo quedan inaccesibles simultáneamente, sin failover posible dentro del ASG',
          C: 'El Auto Scaling Group no puede escalar si solo tiene una subnet',
          D: 'AWS bloquea la creación de Auto Scaling Groups con una sola subnet',
        },
        answer: ['B'],
        explanation:
          'Un ASG debe abarcar múltiples subnets en distintas AZs para tolerar la falla de una zona completa. Con una sola AZ, esa zona se vuelve un punto único de fallo (SPOF) para toda la aplicación.',
        domain: 'Design Resilient Architectures',
        difficulty: 'medium',
      },

      // ── Dominio 3: Design High-Performing Architectures — 24% (7) ─────
      {
        type: 'multiple',
        question:
          'Un sitio web global sirve contenido estático (imágenes, CSS, JS) desde un bucket S3 en us-east-1, pero usuarios en otras regiones reportan alta latencia. ¿Qué servicio resuelve esto sin migrar el bucket?',
        options: {
          A: 'Amazon CloudFront como CDN frente al bucket S3, cacheando contenido en edge locations globales',
          B: 'Aumentar el tamaño del bucket S3',
          C: 'Cambiar el bucket a Glacier',
          D: 'Crear más buckets S3 idénticos manualmente en cada región',
        },
        answer: ['A'],
        explanation:
          'CloudFront distribuye copias cacheadas del contenido a edge locations cercanas a los usuarios finales, reduciendo drásticamente la latencia percibida sin necesidad de replicar o mover el bucket de origen.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una aplicación con lecturas muy frecuentes sobre los mismos datos en RDS satura la base de datos. ¿Qué servicio se agrega para reducir la carga de lectura sin escalar verticalmente la base de datos?',
        options: {
          A: 'Amazon ElastiCache (Redis/Memcached) como capa de caché delante de la base de datos',
          B: 'Aumentar el número de NAT Gateways',
          C: 'Amazon SNS',
          D: 'AWS Direct Connect',
        },
        answer: ['A'],
        explanation:
          'ElastiCache actúa como capa de caché en memoria: las lecturas frecuentes de datos que cambian poco se sirven desde el caché en microsegundos, reduciendo la carga sobre la base de datos primaria y mejorando el rendimiento general.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          '¿Cuál es el caso de uso correcto de Amazon DynamoDB frente a Amazon RDS en una arquitectura de alto rendimiento?',
        options: {
          A: 'DynamoDB es ideal para joins complejos multi-tabla con transacciones ACID extensas',
          B: 'DynamoDB es una base NoSQL clave-valor/documento con latencia de milisegundos de un solo dígito a cualquier escala, ideal para patrones de acceso predecibles y alta escala horizontal; RDS es relacional, mejor para consultas complejas con joins',
          C: 'RDS y DynamoDB son intercambiables sin ninguna diferencia de diseño',
          D: 'DynamoDB requiere siempre aprovisionar servidores manualmente',
        },
        answer: ['B'],
        explanation:
          'DynamoDB es un servicio NoSQL totalmente administrado, optimizado para escala horizontal masiva y latencia consistente de un dígito de milisegundo con patrones de acceso por clave conocidos; para consultas relacionales complejas con joins, RDS (o Aurora) sigue siendo más adecuado.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Un job de procesamiento por lotes tarda horas porque procesa archivos de forma secuencial en una sola instancia EC2. ¿Qué patrón de AWS permite paralelizar el trabajo elásticamente?',
        options: {
          A: 'Encolar las tareas en Amazon SQS y procesarlas con un Auto Scaling Group de instancias (o funciones Lambda) que escalan según el largo de la cola',
          B: 'Aumentar únicamente el tamaño de la instancia EC2 (vertical scaling)',
          C: 'Ejecutar el mismo script pero con un cron más frecuente',
          D: 'Migrar el job a un bucket S3',
        },
        answer: ['A'],
        explanation:
          'Distribuir el trabajo en una cola SQS y escalar horizontalmente los workers (EC2 con Auto Scaling o Lambda) según la profundidad de la cola permite procesar en paralelo, reduciendo drásticamente el tiempo total frente a un procesamiento secuencial en una sola instancia.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué tipo de volumen EBS es más adecuado para una carga de trabajo de base de datos transaccional con IOPS altos y consistentes?',
        options: {
          A: 'Cold HDD (sc1)',
          B: 'Throughput Optimized HDD (st1)',
          C: 'Provisioned IOPS SSD (io1/io2)',
          D: 'General Purpose HDD estándar',
        },
        answer: ['C'],
        explanation:
          'Los volúmenes io1/io2 (Provisioned IOPS SSD) están diseñados para cargas de trabajo de I/O intensivas y sensibles a la latencia, como bases de datos transaccionales, permitiendo aprovisionar un nivel de IOPS específico y consistente.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una aplicación de procesamiento científico necesita el máximo rendimiento de cómputo posible por instancia, con cargas predecibles y sin necesidad de escalar horizontalmente de forma dinámica. ¿Qué modelo de Auto Scaling es más apropiado?',
        options: {
          A: 'Dynamic Scaling basado únicamente en CPU',
          B: 'Scheduled Scaling o incluso mantener un tamaño fijo con instancias optimizadas para cómputo (familia C), ya que el patrón de carga es predecible',
          C: 'Spot Instances exclusivamente sin ninguna instancia on-demand',
          D: 'No usar Auto Scaling Group en ningún caso',
        },
        answer: ['B'],
        explanation:
          'Cuando la demanda es predecible en el tiempo, Scheduled Scaling (o un tamaño fijo bien dimensionado) es más eficiente que depender de políticas reactivas; combinarlo con instancias de la familia C (compute-optimized) maximiza el rendimiento de cómputo por instancia.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'hard',
      },
      {
        type: 'multiple',
        question:
          '¿Qué estrategia de particionamiento (sharding) en DynamoDB ayuda a evitar "hot partitions" que degradan el rendimiento?',
        options: {
          A: 'Usar siempre la misma partition key para todos los ítems, para simplificar las consultas',
          B: 'Elegir una partition key con alta cardinalidad y distribución uniforme de acceso, evitando que un solo valor concentre la mayoría de las solicitudes',
          C: 'Deshabilitar el particionamiento en DynamoDB',
          D: 'Usar únicamente índices secundarios globales sin definir partition key',
        },
        answer: ['B'],
        explanation:
          'DynamoDB distribuye los datos entre particiones físicas según la partition key. Una key con baja cardinalidad o con acceso muy concentrado (ej. una fecha fija) genera "hot partitions" que limitan el throughput; una key con alta cardinalidad y acceso distribuido evita ese cuello de botella.',
        domain: 'Design High-Performing Architectures',
        difficulty: 'hard',
      },

      // ── Dominio 4: Design Cost-Optimized Architectures — 20% (6) ──────
      {
        type: 'multiple',
        question:
          'Una carga de trabajo por lotes puede tolerar interrupciones y no tiene requisitos de tiempo estricto. ¿Qué tipo de instancia EC2 ofrece el mayor ahorro de costos para este caso?',
        options: {
          A: 'On-Demand Instances',
          B: 'Spot Instances',
          C: 'Reserved Instances a 3 años',
          D: 'Dedicated Hosts',
        },
        answer: ['B'],
        explanation:
          'Las Spot Instances ofrecen hasta ~90% de descuento frente a On-Demand aprovechando capacidad no utilizada de AWS, a cambio de que puedan ser interrumpidas con poco aviso — ideales para cargas tolerantes a fallos como procesamiento batch o jobs de análisis.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Una empresa sabe que va a mantener una carga base constante de instancias EC2 durante los próximos 3 años. ¿Qué opción de compra minimiza el costo total frente a On-Demand?',
        options: {
          A: 'Spot Instances exclusivamente',
          B: 'Reserved Instances (o Savings Plans) a largo plazo, que ofrecen descuentos significativos a cambio de compromiso de uso',
          C: 'Seguir usando On-Demand porque siempre es más barato',
          D: 'Dedicated Instances sin ningún compromiso',
        },
        answer: ['B'],
        explanation:
          'Para cargas de trabajo predecibles y constantes, Reserved Instances o Savings Plans ofrecen descuentos importantes (hasta ~72% vs On-Demand) a cambio de comprometerse a un uso sostenido durante 1 o 3 años.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un bucket S3 almacena logs que se consultan frecuentemente el primer mes, rara vez entre el mes 2 y 6, y prácticamente nunca después. ¿Qué estrategia de storage minimiza el costo sin gestión manual constante?',
        options: {
          A: 'Mantener todo en S3 Standard indefinidamente',
          B: 'Configurar una S3 Lifecycle Policy que transicione automáticamente a S3 Standard-IA y luego a Glacier según la antigüedad del objeto',
          C: 'Borrar los logs después del primer mes',
          D: 'Mover manualmente cada archivo cada mes desde la consola',
        },
        answer: ['B'],
        explanation:
          'Las S3 Lifecycle Policies automatizan la transición de objetos entre clases de almacenamiento (Standard → Standard-IA → Glacier/Deep Archive) según reglas de antigüedad, optimizando costos sin intervención manual y sin perder los datos.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          '¿Qué herramienta de AWS analiza el uso histórico y recomienda el tipo/tamaño de instancia EC2 óptimo (right-sizing) para reducir costos sin afectar el rendimiento?',
        options: {
          A: 'AWS Compute Optimizer',
          B: 'Amazon Route 53',
          C: 'AWS Direct Connect',
          D: 'Amazon SNS',
        },
        answer: ['A'],
        explanation:
          'AWS Compute Optimizer analiza métricas de uso (CPU, memoria si CloudWatch Agent está instalado, red) y recomienda tipos y tamaños de instancia más eficientes en costo, identificando recursos sobreaprovisionados.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'medium',
      },
      {
        type: 'multiple',
        question:
          'Una aplicación tiene tráfico esporádico e impredecible, con largos períodos de inactividad total. ¿Qué modelo de cómputo evita pagar por capacidad ociosa?',
        options: {
          A: 'Mantener siempre 5 instancias EC2 On-Demand corriendo por si acaso',
          B: 'AWS Lambda (modelo serverless), que cobra solo por el tiempo de ejecución real de cada invocación',
          C: 'Reserved Instances a 3 años',
          D: 'Dedicated Hosts',
        },
        answer: ['B'],
        explanation:
          'Lambda cobra únicamente por el tiempo de cómputo consumido durante cada invocación (facturado por milisegundos), sin costo por capacidad ociosa — ideal para cargas esporádicas o impredecibles donde mantener servidores corriendo todo el tiempo desperdiciaría presupuesto.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'easy',
      },
      {
        type: 'multiple',
        question:
          'Un equipo detecta que tiene varios Elastic IPs asignados pero no asociados a ninguna instancia en ejecución, y varios volúmenes EBS "huérfanos" (sin instancia asociada). ¿Por qué es importante identificarlos desde una perspectiva de optimización de costos?',
        options: {
          A: 'AWS no cobra por Elastic IPs ni EBS no asociados, así que no afecta el costo',
          B: 'AWS cobra por Elastic IPs no asociados a una instancia en ejecución, y los volúmenes EBS generan costo por almacenamiento aprovisionado independientemente de si están "attached" o no',
          C: 'Solo los volúmenes EBS generan costo; los Elastic IPs siempre son gratuitos',
          D: 'Estos recursos se eliminan automáticamente a los 7 días sin costo',
        },
        answer: ['B'],
        explanation:
          'AWS cobra por hora por cada Elastic IP que NO esté asociado a una instancia en ejecución (para desincentivar acaparar IPv4 públicas escasas), y los volúmenes EBS cobran por GB-mes aprovisionado sin importar si están adjuntos a una instancia — ambos son fuentes comunes de gasto oculto que Trusted Advisor y Cost Explorer ayudan a detectar.',
        domain: 'Design Cost-Optimized Architectures',
        difficulty: 'hard',
      },
    ],
  },
  {
    slug: 'aws-developer-associate',
    title: 'AWS Developer Associate (DVA-C02)',
    description: 'Examen de práctica alineado a los 4 dominios oficiales de AWS Certified Developer – Associate: desarrollo con servicios AWS, seguridad, despliegue y troubleshooting.',
    domain: 'it', category: 'cloud-aws', level: 'advanced', language: 'es',
    tags: ['aws', 'developer', 'dva-c02'], passPercent: 72, timeMinutes: 22,
    source: 'Basado en AWS Certified Developer – Associate (DVA-C02) Exam Guide — docs.aws.amazon.com/aws-certification (contenido original)',
    questions: [
      { type: 'multiple', question: 'Una función Lambda necesita reutilizar una conexión costosa de inicializar (ej. a una base de datos) entre invocaciones sucesivas del mismo contenedor. ¿Dónde debe inicializarse esa conexión?', options: { A: 'Dentro del handler, en cada invocación', B: 'Fuera del handler, en el scope global del archivo, para aprovechar el "execution context reuse"', C: 'En una variable de entorno', D: 'No es posible reutilizar conexiones entre invocaciones' }, answer: ['B'], explanation: 'El código fuera del handler se ejecuta solo en un "cold start" y persiste en el contenedor mientras Lambda lo reutiliza en invocaciones posteriores ("execution context reuse"), evitando reinicializar conexiones costosas cada vez.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué patrón de reintento se recomienda al llamar a una API de AWS que devuelve errores transitorios (ej. throttling)?', options: { A: 'Reintentar inmediatamente en un loop infinito', B: 'Exponential backoff con jitter, incrementando el tiempo de espera entre reintentos', C: 'No reintentar nunca, fallar inmediatamente', D: 'Esperar siempre exactamente 1 segundo entre reintentos' }, answer: ['B'], explanation: 'El exponential backoff con jitter (aleatoriedad) es el patrón recomendado por AWS SDKs para manejar errores transitorios como throttling, evitando sobrecargar el servicio con reintentos sincronizados.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: 'Un desarrollador necesita invalidar el caché de una API Gateway después de desplegar una nueva versión. ¿Qué configuración de API Gateway controla el caching de respuestas?', options: { A: 'Stage cache settings, con TTL configurable por método', B: 'Lambda concurrency', C: 'DynamoDB TTL', D: 'S3 lifecycle policy' }, answer: ['A'], explanation: 'API Gateway permite habilitar caching a nivel de stage con un TTL configurable; el desarrollador puede invalidar el caché manualmente o esperar a que expire el TTL.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia entre DynamoDB Streams y un trigger normal de Lambda?', options: { A: 'DynamoDB Streams captura los cambios (insert/update/delete) de una tabla en orden, y puede invocar una Lambda para procesarlos en casi tiempo real', B: 'Son exactamente lo mismo', C: 'DynamoDB Streams solo funciona con S3', D: 'DynamoDB Streams reemplaza la necesidad de un índice secundario' }, answer: ['A'], explanation: 'DynamoDB Streams captura una secuencia ordenada de modificaciones a los ítems de una tabla; Lambda puede suscribirse al stream para procesar esos cambios casi en tiempo real (ej. sincronizar con otro sistema).', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: 'Un desarrollador quiere desacoplar productores y consumidores de eventos, permitiendo que múltiples servicios reaccionen al mismo evento sin acoplamiento directo. ¿Qué servicio es más apropiado?', options: { A: 'Amazon SQS únicamente (un solo consumidor por mensaje)', B: 'Amazon SNS (pub/sub, fan-out a múltiples suscriptores)', C: 'AWS Direct Connect', D: 'Amazon RDS' }, answer: ['B'], explanation: 'SNS implementa el patrón pub/sub: un mismo mensaje publicado puede entregarse (fan-out) a múltiples suscriptores (colas SQS, Lambdas, emails), a diferencia de SQS donde cada mensaje lo consume típicamente un solo consumidor.', domain: 'Development with AWS Services', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cómo debe una aplicación en EC2 obtener credenciales para llamar a la API de S3 de forma segura, según las mejores prácticas de AWS?', options: { A: 'Codificando el access key y secret key directamente en el código fuente', B: 'Usando un IAM Role asociado a la instancia (Instance Profile), que provee credenciales temporales automáticamente', C: 'Pidiendo las credenciales al usuario en cada ejecución', D: 'Usando las credenciales root de la cuenta' }, answer: ['B'], explanation: 'Un IAM Role vía Instance Profile entrega credenciales temporales rotadas automáticamente, evitando almacenar secretos estáticos en el código — la práctica de seguridad recomendada.', domain: 'Security', difficulty: 'easy' },
      { type: 'multiple', question: 'Una aplicación necesita almacenar y rotar automáticamente las credenciales de una base de datos RDS sin cambios manuales en el código. ¿Qué servicio usar?', options: { A: 'AWS Secrets Manager, con rotación automática configurada', B: 'Variables de entorno estáticas en Lambda', C: 'Un archivo de texto en S3 público', D: 'Parameter Store sin cifrado' }, answer: ['A'], explanation: 'AWS Secrets Manager permite almacenar secretos cifrados y configurar rotación automática (incluyendo integración nativa con RDS), sin requerir cambios manuales en el código de la aplicación.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué mecanismo de API Gateway permite validar y autorizar solicitudes usando un token JWT emitido por un proveedor de identidad externo (ej. Auth0, Okta)?', options: { A: 'Lambda Authorizer o JWT Authorizer nativo de API Gateway', B: 'Resource Policy únicamente', C: 'CORS', D: 'Usage Plans' }, answer: ['A'], explanation: 'API Gateway soporta Lambda Authorizers (código personalizado) o JWT Authorizers nativos (para HTTP APIs) que validan el token del cliente antes de permitir el acceso al backend.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: 'Un objeto en S3 debe ser accesible temporalmente por un usuario externo sin hacer el bucket público. ¿Qué mecanismo usar?', options: { A: 'Hacer público todo el bucket', B: 'Generar una Presigned URL con expiración limitada', C: 'Compartir las credenciales de la cuenta AWS', D: 'Deshabilitar el bloqueo de acceso público del bucket' }, answer: ['B'], explanation: 'Una presigned URL otorga acceso temporal y limitado a un objeto específico sin exponer el bucket completo ni credenciales, expirando automáticamente después del tiempo configurado.', domain: 'Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué política de IAM sigue el principio de menor privilegio para una Lambda que solo necesita leer de una tabla DynamoDB específica?', options: { A: 'AmazonDynamoDBFullAccess', B: 'Una policy personalizada que otorgue únicamente dynamodb:GetItem/Query sobre el ARN de esa tabla específica', C: 'AdministratorAccess', D: 'Ninguna policy, dejar el acceso público' }, answer: ['B'], explanation: 'El principio de menor privilegio requiere otorgar solo las acciones (GetItem/Query) y recursos (el ARN exacto de la tabla) necesarios, en vez de policies administradas amplias como FullAccess.', domain: 'Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de AWS automatiza el proceso de build, test y deploy de una aplicación mediante un pipeline de CI/CD nativo?', options: { A: 'AWS CodePipeline, orquestando CodeBuild y CodeDeploy', B: 'Amazon CloudWatch', C: 'AWS Config', D: 'Amazon SNS' }, answer: ['A'], explanation: 'CodePipeline orquesta las etapas de un pipeline de CI/CD (source, build con CodeBuild, deploy con CodeDeploy), automatizando el flujo desde el commit hasta el despliegue en producción.', domain: 'Deployment', difficulty: 'easy' },
      { type: 'multiple', question: 'Una aplicación en Elastic Beanstalk necesita desplegar una nueva versión sin downtime, manteniendo la versión anterior activa hasta confirmar que la nueva funciona. ¿Qué estrategia de despliegue usar?', options: { A: 'All at once', B: 'Blue/Green deployment (usando un entorno nuevo y swap de CNAME)', C: 'Eliminar el entorno actual antes de desplegar', D: 'Rolling deployment con batch del 100%' }, answer: ['B'], explanation: 'Blue/Green despliega la nueva versión en un entorno completamente separado; una vez validado, se hace swap del CNAME hacia el nuevo entorno, permitiendo rollback instantáneo si algo falla, sin downtime.', domain: 'Deployment', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de AWS empaqueta y despliega aplicaciones serverless (Lambda + API Gateway + DynamoDB) usando plantillas declarativas simplificadas?', options: { A: 'AWS SAM (Serverless Application Model)', B: 'Amazon EC2 Image Builder', C: 'AWS OpsWorks', D: 'Amazon Lightsail' }, answer: ['A'], explanation: 'AWS SAM extiende CloudFormation con una sintaxis simplificada específica para recursos serverless, facilitando definir, empaquetar y desplegar aplicaciones Lambda/API Gateway/DynamoDB.', domain: 'Deployment', difficulty: 'medium' },
      { type: 'multiple', question: 'Un pipeline de CodeDeploy hacia un Auto Scaling Group necesita desplegar gradualmente a subconjuntos de instancias, deteniéndose si se detectan errores. ¿Qué tipo de despliegue es este?', options: { A: 'Deployment "in-place" con configuración de despliegue por lotes (ej. HalfAtATime) y health checks', B: 'Un despliegue manual sin ninguna automatización', C: 'Solo es posible con Blue/Green', D: 'CodeDeploy no soporta despliegues graduales' }, answer: ['A'], explanation: 'CodeDeploy soporta configuraciones de despliegue in-place por lotes (ej. OneAtATime, HalfAtATime) que despliegan gradualmente, verificando health checks y deteniéndose automáticamente si se detectan fallos.', domain: 'Deployment', difficulty: 'hard' },
      { type: 'multiple', question: 'Una aplicación en producción presenta latencia intermitente. ¿Qué servicio de AWS permite trazar una solicitud a través de múltiples servicios (Lambda, API Gateway, DynamoDB) para identificar el cuello de botella?', options: { A: 'AWS X-Ray', B: 'AWS Trusted Advisor', C: 'Amazon Inspector', D: 'AWS Config' }, answer: ['A'], explanation: 'X-Ray provee tracing distribuido, permitiendo visualizar el recorrido de una solicitud a través de múltiples servicios y detectar en qué punto exacto ocurre la latencia o el error.', domain: 'Troubleshooting and Optimization', difficulty: 'easy' },
      { type: 'multiple', question: 'Una función Lambda falla intermitentemente con timeout. ¿Cuál es una primera acción de troubleshooting recomendada?', options: { A: 'Eliminar la función y crear una nueva sin investigar', B: 'Revisar los logs en CloudWatch Logs y aumentar el timeout/memoria configurados si el procesamiento lo justifica', C: 'Ignorar el error si ocurre pocas veces', D: 'Cambiar el lenguaje de programación de la función' }, answer: ['B'], explanation: 'El primer paso de troubleshooting es revisar CloudWatch Logs para entender la causa del timeout, y ajustar la configuración (timeout, memoria, que también afecta CPU asignada) si el procesamiento real lo requiere.', domain: 'Troubleshooting and Optimization', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué causa comúnmente el error "Rate Exceeded" al invocar repetidamente una API de AWS, y cómo se soluciona a nivel de código?', options: { A: 'Es un error de credenciales; se soluciona rotando el access key', B: 'Es throttling por exceder el límite de solicitudes por segundo del servicio; se soluciona implementando exponential backoff y, si es necesario, solicitando un aumento de límite de servicio', C: 'Es un error de red que no se puede resolver', D: 'Solo ocurre en la región us-east-1' }, answer: ['B'], explanation: '"Rate Exceeded" indica throttling por exceder el límite de solicitudes; la solución de código es implementar reintentos con exponential backoff, y si el límite es estructuralmente insuficiente, solicitar un Service Quota increase.', domain: 'Troubleshooting and Optimization', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué métrica de CloudWatch es clave para detectar si una función Lambda está alcanzando el límite de concurrencia reservada y descartando invocaciones?', options: { A: 'Throttles', B: 'Duration promedio', C: 'ColdStarts', D: 'MemoryUsed' }, answer: ['A'], explanation: 'La métrica "Throttles" de CloudWatch para Lambda indica cuántas invocaciones fueron rechazadas por exceder el límite de concurrencia disponible (reservada o de cuenta).', domain: 'Troubleshooting and Optimization', difficulty: 'medium' },
      { type: 'multiple', question: 'Una consulta a DynamoDB usando Scan en una tabla grande es muy lenta y costosa. ¿Qué optimización es más apropiada si se conoce la partition key del ítem buscado?', options: { A: 'Aumentar la capacidad aprovisionada indefinidamente', B: 'Reemplazar el Scan por un Query, que busca directamente por partition key (y opcionalmente sort key), siendo mucho más eficiente', C: 'Cambiar la tabla a modo Scan-only', D: 'No hay forma de optimizar consultas en DynamoDB' }, answer: ['B'], explanation: 'Scan recorre toda la tabla (costoso e ineficiente); Query usa la partition key para acceder directamente a la partición relevante, siendo drásticamente más rápido y económico cuando se conoce la key de búsqueda.', domain: 'Troubleshooting and Optimization', difficulty: 'medium' },
      { type: 'multiple', question: 'Un API Gateway devuelve errores 502 (Bad Gateway) intermitentes al invocar una Lambda. ¿Cuál es una causa común y su solución?', options: { A: 'La Lambda devuelve una respuesta con formato inválido (no conforme al formato de integración esperado por API Gateway); se soluciona corrigiendo el formato de salida de la función', B: 'Siempre es un problema de DNS sin solución', C: 'API Gateway nunca puede devolver 502', D: 'Solo ocurre si la Lambda no tiene VPC configurada' }, answer: ['A'], explanation: 'Un 502 en la integración Lambda-API Gateway suele deberse a que la función no devuelve el formato de respuesta esperado (ej. falta statusCode/body en integración proxy); revisar y corregir el formato de salida resuelve el problema.', domain: 'Troubleshooting and Optimization', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué servicio de AWS gestiona de forma centralizada el ciclo de vida de secretos (contraseñas, API keys) con rotación automática configurable?', options: { A: 'AWS Secrets Manager', B: 'Amazon SQS', C: 'AWS CloudFormation', D: 'Amazon CloudFront' }, answer: ['A'], explanation: 'Secrets Manager almacena secretos cifrados y permite configurar rotación automática (con integración nativa para RDS, entre otros), evitando hardcodear credenciales en el código de la aplicación.', domain: 'Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué mecanismo de DynamoDB permite ejecutar múltiples operaciones de escritura como una unidad atómica (todas exitosas o ninguna)?', options: { A: 'TransactWriteItems', B: 'Scan', C: 'BatchGetItem', D: 'Query' }, answer: ['A'], explanation: '`TransactWriteItems` permite agrupar hasta 100 operaciones de escritura en una transacción atómica, garantizando que todas se apliquen o ninguna, útil para mantener consistencia entre ítems relacionados.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "cold start" en AWS Lambda y en qué escenario es más notorio?', options: { A: 'La latencia adicional que ocurre cuando Lambda debe inicializar un nuevo contenedor de ejecución (cargar el runtime, ejecutar código fuera del handler) antes de procesar la primera invocación tras un periodo de inactividad', B: 'Un error que impide que la función se ejecute', C: 'Un sinónimo de timeout', D: 'Un fenómeno exclusivo de funciones escritas en Python' }, answer: ['A'], explanation: 'El cold start ocurre cuando Lambda debe aprovisionar un nuevo contenedor (inicializar runtime, dependencias, código fuera del handler) para atender una invocación, siendo más notorio tras periodos de inactividad o en escalados súbitos; invocaciones subsecuentes reutilizan el contenedor ("warm start"), siendo más rápidas.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de AWS permite versionar y publicar distintas versiones de una API, gestionando el ciclo de vida (dev, staging, prod) mediante "stages"?', options: { A: 'Amazon API Gateway', B: 'Amazon Route 53', C: 'AWS Direct Connect', D: 'Amazon EFS' }, answer: ['A'], explanation: 'API Gateway permite desplegar una API a múltiples "stages" (ej. dev, prod) con configuraciones independientes (throttling, caching, variables), facilitando el ciclo de vida de versionado sin duplicar la definición completa de la API.', domain: 'Deployment', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué patrón de diseño usa una cola SQS como "Dead Letter Queue" (DLQ)?', options: { A: 'Capturar mensajes que fallaron repetidamente en ser procesados (tras superar el número máximo de reintentos), permitiendo su análisis posterior sin bloquear el procesamiento de mensajes nuevos', B: 'Almacenar mensajes que se procesaron exitosamente', C: 'Un sinónimo de cola FIFO', D: 'Aumentar la velocidad de procesamiento de mensajes' }, answer: ['A'], explanation: 'Una Dead Letter Queue captura mensajes que agotaron el número máximo de intentos de procesamiento sin éxito, aislándolos para análisis posterior sin que sigan bloqueando o consumiendo recursos del procesamiento normal.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "principio de menor privilegio" aplicado a los roles de ejecución de Lambda?', options: { A: 'Asignar a la función Lambda únicamente los permisos IAM estrictamente necesarios para las acciones que realmente ejecuta (ej. leer de una tabla específica), en vez de permisos amplios', B: 'Dar siempre permisos de administrador a toda función Lambda para simplificar el desarrollo', C: 'No asignar ningún rol IAM a las funciones Lambda', D: 'Un principio que no aplica a funciones serverless' }, answer: ['A'], explanation: 'Cada función Lambda debe tener un rol de ejecución con únicamente los permisos IAM necesarios para las acciones específicas que realiza, reduciendo el impacto potencial si la función o sus credenciales se ven comprometidas.', domain: 'Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta de AWS permite definir y desplegar infraestructura serverless (Lambda, API Gateway, DynamoDB) mediante un archivo YAML/JSON declarativo con sintaxis simplificada?', options: { A: 'AWS SAM (Serverless Application Model)', B: 'Amazon Lightsail', C: 'AWS OpsWorks', D: 'Amazon Kinesis' }, answer: ['A'], explanation: 'AWS SAM extiende CloudFormation con una sintaxis simplificada específica para recursos serverless, facilitando definir, probar localmente y desplegar aplicaciones Lambda/API Gateway/DynamoDB de forma declarativa.', domain: 'Deployment', difficulty: 'medium' },
      { type: 'multiple', question: 'Un desarrollador necesita que su aplicación consuma un stream de eventos de DynamoDB para sincronizar datos con un sistema de búsqueda externo. ¿Qué componente conecta ambos?', options: { A: 'Una función Lambda suscrita a DynamoDB Streams como trigger', B: 'Amazon Route 53', C: 'AWS Direct Connect', D: 'Amazon CloudFront' }, answer: ['A'], explanation: 'Una función Lambda puede suscribirse como trigger a DynamoDB Streams, procesando cada cambio (insert/update/delete) casi en tiempo real y sincronizándolo con sistemas externos como un motor de búsqueda.', domain: 'Development with AWS Services', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué código de estado HTTP debe devolver una API cuando la solicitud es válida pero el recurso solicitado no existe?', options: { A: '404 Not Found', B: '500 Internal Server Error', C: '200 OK', D: '301 Moved Permanently' }, answer: ['A'], explanation: '404 Not Found indica que el servidor entendió la solicitud pero no encontró el recurso solicitado, distinto de un 500 (error del servidor) o un 200 (éxito) — un detalle relevante al diseñar respuestas de API consistentes.', domain: 'Development with AWS Services', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio de AWS permite ejecutar contenedores sin gestionar servidores subyacentes, integrándose con ECS o EKS mediante el modo de lanzamiento "Fargate"?', options: { A: 'AWS Fargate', B: 'Amazon Lightsail', C: 'AWS Batch exclusivamente', D: 'Amazon WorkSpaces' }, answer: ['A'], explanation: 'AWS Fargate es un modo de lanzamiento serverless para ECS/EKS que elimina la necesidad de aprovisionar y gestionar instancias EC2 subyacentes para ejecutar contenedores, cobrando por los recursos (CPU/memoria) que el contenedor realmente consume.', domain: 'Deployment', difficulty: 'medium' },
    ],
  },
  {
    slug: 'aws-sysops-administrator',
    title: 'AWS SysOps Administrator (SOA-C02)',
    description: 'Examen de práctica alineado a los 6 dominios oficiales de AWS Certified SysOps Administrator – Associate: monitoreo, confiabilidad, despliegue, seguridad, redes y optimización de costos.',
    domain: 'it', category: 'cloud-aws', level: 'advanced', language: 'es',
    tags: ['aws', 'sysops', 'operations', 'soa-c02'], passPercent: 72, timeMinutes: 22,
    source: 'Basado en AWS Certified SysOps Administrator – Associate (SOA-C02) Exam Guide — d1.awsstatic.com/training-and-certification/docs-sysops-associate (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué servicio permite crear alarmas que disparan una acción automática (ej. escalar un Auto Scaling Group) cuando una métrica supera un umbral?', options: { A: 'Amazon CloudWatch Alarms', B: 'AWS Config', C: 'AWS Trusted Advisor', D: 'Amazon Inspector' }, answer: ['A'], explanation: 'CloudWatch Alarms monitorea métricas y puede disparar acciones automáticas (notificaciones SNS, políticas de Auto Scaling) cuando una métrica cruza un umbral definido.', domain: 'Monitoring, Logging, and Remediation', difficulty: 'easy' },
      { type: 'multiple', question: 'Un administrador necesita centralizar y analizar logs de aplicación de múltiples instancias EC2 en un solo lugar consultable. ¿Qué servicio usar?', options: { A: 'CloudWatch Logs, instalando el CloudWatch Agent en las instancias', B: 'Amazon S3 exclusivamente sin agente', C: 'AWS Config', D: 'Amazon Route 53' }, answer: ['A'], explanation: 'El CloudWatch Agent instalado en las instancias envía logs de aplicación y sistema a CloudWatch Logs, donde se pueden centralizar, buscar y crear métricas/alarmas basadas en patrones de log.', domain: 'Monitoring, Logging, and Remediation', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio permite remediar automáticamente recursos no conformes (ej. un bucket S3 público) sin intervención manual?', options: { A: 'AWS Config Rules con remediación automática (SSM Automation documents)', B: 'Amazon SNS únicamente', C: 'Amazon Route 53 health checks', D: 'AWS Direct Connect' }, answer: ['A'], explanation: 'AWS Config evalúa continuamente el cumplimiento de reglas y puede disparar remediación automática vía documentos de AWS Systems Manager Automation, corrigiendo recursos no conformes sin intervención manual.', domain: 'Monitoring, Logging, and Remediation', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es el propósito de CloudTrail en un entorno de operaciones AWS?', options: { A: 'Monitorear el uso de CPU de las instancias', B: 'Registrar un historial auditable de llamadas a la API de AWS (quién hizo qué, cuándo y desde dónde)', C: 'Balancear tráfico entre instancias', D: 'Cifrar datos en reposo' }, answer: ['B'], explanation: 'CloudTrail registra un log de auditoría de todas las llamadas a la API de AWS realizadas en la cuenta, crítico para investigación de incidentes, compliance y detección de actividad no autorizada.', domain: 'Monitoring, Logging, and Remediation', difficulty: 'easy' },
      { type: 'multiple', question: 'Una aplicación crítica requiere que su base de datos RDS se recupere automáticamente ante la falla de una Availability Zone. ¿Qué configuración habilitar?', options: { A: 'Read Replicas en la misma AZ', B: 'Multi-AZ Deployment con failover automático', C: 'Aumentar el tamaño de la instancia', D: 'Snapshots manuales diarios únicamente' }, answer: ['B'], explanation: 'Multi-AZ mantiene una réplica standby sincrónica en otra AZ, con failover automático del endpoint ante fallo de la instancia primaria o de toda la AZ.', domain: 'Reliability and Business Continuity', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué estrategia de backup permite restaurar una base de datos RDS a un segundo exacto dentro del período de retención, no solo a un snapshot diario?', options: { A: 'Point-in-Time Recovery (PITR), usando backups automáticos y transaction logs', B: 'Solo snapshots manuales', C: 'AMIs de las instancias EC2 asociadas', D: 'No es posible restaurar a un momento exacto en RDS' }, answer: ['A'], explanation: 'Point-in-Time Recovery combina backups automáticos diarios con transaction logs continuos, permitiendo restaurar la base de datos a cualquier segundo dentro del período de retención configurado.', domain: 'Reliability and Business Continuity', difficulty: 'medium' },
      { type: 'multiple', question: 'Una empresa quiere una estrategia de disaster recovery de bajo costo donde la infraestructura de respaldo esté apagada la mayor parte del tiempo, activándose solo ante un desastre real. ¿Qué estrategia DR es esta?', options: { A: 'Multi-site activo-activo', B: 'Pilot Light', C: 'Backup and Restore puro sin ninguna infraestructura pre-configurada', D: 'Warm Standby con capacidad completa siempre activa' }, answer: ['B'], explanation: 'Pilot Light mantiene los componentes críticos (ej. base de datos replicada) mínimamente activos, mientras el resto de la infraestructura permanece apagada y se aprovisiona/escala solo cuando se activa el DR — balance entre costo y RTO.', domain: 'Reliability and Business Continuity', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué componente de Auto Scaling asegura que las instancias no saludables sean reemplazadas automáticamente?', options: { A: 'Health checks (EC2 o ELB) configurados en el Auto Scaling Group', B: 'Solo el administrador manualmente', C: 'Amazon Route 53', D: 'AWS Budgets' }, answer: ['A'], explanation: 'Los health checks del Auto Scaling Group (basados en el estado de la instancia EC2 o en el health check del load balancer) detectan instancias no saludables y las reemplazan automáticamente.', domain: 'Reliability and Business Continuity', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio de AWS permite definir y aplicar configuración de infraestructura de forma repetible y versionada usando plantillas declarativas (JSON/YAML)?', options: { A: 'AWS CloudFormation', B: 'Amazon Athena', C: 'AWS Glue', D: 'Amazon SES' }, answer: ['A'], explanation: 'CloudFormation permite definir infraestructura como código mediante plantillas declarativas, aplicando cambios de forma repetible, versionada y auditable a través de "stacks".', domain: 'Deployment, Provisioning, and Automation', difficulty: 'easy' },
      { type: 'multiple', question: 'Un administrador necesita ejecutar un comando en 100 instancias EC2 simultáneamente sin usar SSH manual en cada una. ¿Qué servicio usar?', options: { A: 'AWS Systems Manager Run Command', B: 'Amazon Cognito', C: 'AWS Direct Connect', D: 'Amazon WorkSpaces' }, answer: ['A'], explanation: 'Systems Manager Run Command permite ejecutar comandos o scripts en múltiples instancias EC2 de forma remota y auditable, sin necesidad de SSH manual ni credenciales expuestas.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta de AWS permite crear una imagen (AMI) preconfigurada y actualizada automáticamente con los últimos parches de seguridad, de forma repetible?', options: { A: 'EC2 Image Builder', B: 'AWS Batch', C: 'Amazon Kinesis', D: 'AWS Step Functions' }, answer: ['A'], explanation: 'EC2 Image Builder automatiza la creación, prueba y distribución de AMIs actualizadas, aplicando parches y configuraciones de forma repetible sin proceso manual.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'medium' },
      { type: 'multiple', question: 'Según el modelo de responsabilidad compartida de AWS, ¿de quién es la responsabilidad de configurar correctamente los Security Groups de una instancia EC2?', options: { A: 'Del cliente ("seguridad EN la nube")', B: 'De AWS ("seguridad DE la nube")', C: 'De un tercero certificado obligatoriamente', D: 'De nadie, se configuran automáticamente de forma segura' }, answer: ['A'], explanation: 'La configuración de Security Groups, IAM, sistema operativo y datos es responsabilidad del cliente ("seguridad EN la nube"); AWS es responsable de la infraestructura física subyacente ("seguridad DE la nube").', domain: 'Security and Compliance', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio detecta automáticamente actividad maliciosa analizando VPC Flow Logs, CloudTrail y logs de DNS con threat intelligence?', options: { A: 'Amazon GuardDuty', B: 'AWS Config', C: 'Amazon CloudWatch Logs Insights', D: 'AWS Trusted Advisor' }, answer: ['A'], explanation: 'GuardDuty analiza continuamente múltiples fuentes de logs usando threat intelligence para detectar comportamiento anómalo o malicioso, generando findings priorizados por severidad.', domain: 'Security and Compliance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cómo se implementa cifrado en tránsito para el tráfico entre un cliente y un Application Load Balancer?', options: { A: 'Configurando un listener HTTPS con un certificado SSL/TLS gestionado por AWS Certificate Manager (ACM)', B: 'No es posible cifrar el tráfico hacia un ALB', C: 'Solo mediante VPN', D: 'Usando Security Groups exclusivamente' }, answer: ['A'], explanation: 'Un listener HTTPS en el ALB, con un certificado emitido y renovado automáticamente por ACM, cifra el tráfico entre el cliente y el balanceador (TLS termination).', domain: 'Security and Compliance', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué componente de VPC permite que instancias en una subnet privada accedan a internet para actualizaciones, sin exponerlas con una IP pública?', options: { A: 'Internet Gateway directo', B: 'NAT Gateway en una subnet pública', C: 'VPC Peering', D: 'Security Group con regla allow-all' }, answer: ['B'], explanation: 'Un NAT Gateway ubicado en una subnet pública permite que instancias en subnets privadas inicien conexiones salientes a internet (ej. para actualizaciones) sin exponerlas con IP pública ni permitir conexiones entrantes.', domain: 'Network and Content Delivery', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio permite conectar de forma privada y de alto rendimiento un datacenter on-premises a AWS, sin pasar por internet público?', options: { A: 'AWS Direct Connect', B: 'Amazon CloudFront', C: 'Amazon Route 53', D: 'AWS WAF' }, answer: ['A'], explanation: 'Direct Connect provee una conexión de red dedicada entre el datacenter del cliente y AWS, con menor latencia y mayor consistencia que una conexión por internet público, sin depender de VPN sobre internet.', domain: 'Network and Content Delivery', difficulty: 'easy' },
      { type: 'multiple', question: 'Dos VPCs en la misma cuenta necesitan comunicarse de forma privada usando IPs privadas, sin pasar por internet. ¿Qué componente configura esta comunicación?', options: { A: 'VPC Peering (o AWS Transit Gateway para topologías más complejas)', B: 'Un Internet Gateway compartido', C: 'Elastic IP', D: 'Amazon S3 Transfer Acceleration' }, answer: ['A'], explanation: 'VPC Peering conecta dos VPCs permitiendo tráfico privado entre ellas usando IPs privadas, sin pasar por internet; para múltiples VPCs, Transit Gateway simplifica la topología en forma de hub-and-spoke.', domain: 'Network and Content Delivery', difficulty: 'medium' },
      { type: 'multiple', question: 'Un administrador nota que tiene varios Elastic IPs sin asociar a instancias en ejecución, generando cargos innecesarios. ¿Qué herramienta ayuda a identificar recursos infrautilizados o mal configurados como este?', options: { A: 'AWS Trusted Advisor (chequeos de optimización de costos)', B: 'Amazon Route 53', C: 'AWS Direct Connect', D: 'Amazon Cognito' }, answer: ['A'], explanation: 'Trusted Advisor incluye chequeos de optimización de costos que identifican recursos infrautilizados o mal configurados, como Elastic IPs no asociados o volúmenes EBS huérfanos.', domain: 'Cost and Performance Optimization', difficulty: 'easy' },
      { type: 'multiple', question: 'Una carga de trabajo batch tolerante a interrupciones puede reducir significativamente su costo de cómputo. ¿Qué tipo de instancia EC2 usar?', options: { A: 'On-Demand', B: 'Spot Instances', C: 'Dedicated Hosts', D: 'Reserved Instances a 3 años' }, answer: ['B'], explanation: 'Las Spot Instances ofrecen descuentos de hasta ~90% frente a On-Demand a cambio de tolerar interrupciones, ideales para cargas batch flexibles en tiempo.', domain: 'Cost and Performance Optimization', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta recomienda automáticamente el tipo/tamaño óptimo de instancia EC2 según el uso histórico real, para reducir costos sin afectar el rendimiento?', options: { A: 'AWS Compute Optimizer', B: 'Amazon Kinesis', C: 'AWS Glue', D: 'Amazon Pinpoint' }, answer: ['A'], explanation: 'Compute Optimizer analiza métricas de uso histórico (CPU, memoria, red) y recomienda configuraciones más eficientes en costo, identificando instancias sobreaprovisionadas.', domain: 'Cost and Performance Optimization', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio permite ejecutar scripts o comandos de mantenimiento en un horario programado (ej. cada domingo a las 2am) sobre un grupo de instancias EC2?', options: { A: 'AWS Systems Manager (State Manager / Maintenance Windows)', B: 'Amazon Cognito', C: 'AWS Direct Connect', D: 'Amazon WorkSpaces' }, answer: ['A'], explanation: 'Systems Manager, con funcionalidades como Maintenance Windows y State Manager, permite programar y ejecutar tareas de mantenimiento (parches, scripts) sobre grupos de instancias en horarios definidos, sin intervención manual.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué componente de AWS Config evalúa continuamente si los recursos cumplen con reglas de cumplimiento definidas (ej. "todos los buckets S3 deben tener cifrado habilitado")?', options: { A: 'AWS Config Rules', B: 'Amazon Route 53 health checks', C: 'AWS Direct Connect', D: 'Amazon SNS exclusivamente' }, answer: ['A'], explanation: 'AWS Config Rules evalúa continuamente la configuración de los recursos contra reglas definidas (predefinidas o personalizadas), marcando como "no conformes" los recursos que las incumplen y pudiendo disparar remediación automática.', domain: 'Security and Compliance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio permite centralizar y correlacionar hallazgos de seguridad de múltiples servicios de AWS (GuardDuty, Inspector, Config) en un solo dashboard?', options: { A: 'AWS Security Hub', B: 'Amazon CloudFront', C: 'AWS Direct Connect', D: 'Amazon Route 53' }, answer: ['A'], explanation: 'Security Hub agrega y prioriza automáticamente los hallazgos de seguridad de múltiples servicios (GuardDuty, Inspector, Config, entre otros) en un dashboard centralizado, simplificando la gestión de la postura de seguridad.', domain: 'Security and Compliance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Availability Zone" (AZ) en la infraestructura de AWS?', options: { A: 'Uno o más datacenters discretos con energía, red y conectividad redundante e independiente dentro de una región de AWS', B: 'Un sinónimo de región de AWS', C: 'Un tipo de instancia EC2', D: 'Un servicio exclusivo de almacenamiento' }, answer: ['A'], explanation: 'Una Availability Zone es uno o más datacenters físicamente separados dentro de una región, con energía y conectividad de red independientes, permitiendo diseñar arquitecturas resilientes ante la falla de una sola AZ.', domain: 'Reliability and Business Continuity', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué comando de la AWS CLI se usa comúnmente para copiar archivos hacia o desde un bucket S3 de forma recursiva?', options: { A: 'aws s3 cp --recursive', B: 'aws ec2 describe-instances', C: 'aws iam create-user', D: 'aws lambda invoke' }, answer: ['A'], explanation: '`aws s3 cp --recursive` copia de forma recursiva un directorio completo hacia o desde un bucket S3, siendo una operación común de administración de datos vía CLI.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es "drift" en el contexto de CloudFormation, y cómo se detecta?', options: { A: 'Una diferencia entre la configuración actual real de un recurso y la que fue definida originalmente en la plantilla de CloudFormation, detectable con la función "Detect Drift"', B: 'Un tipo de error de red', C: 'Un sinónimo de rollback automático', D: 'Un concepto exclusivo de EC2, sin relación con CloudFormation' }, answer: ['A'], explanation: '"Drift" ocurre cuando un recurso gestionado por un stack de CloudFormation es modificado manualmente fuera de la plantilla; la función "Detect Drift" compara la configuración real contra la esperada, identificando estas desviaciones.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué servicio de AWS permite definir presupuestos y recibir alertas automáticas cuando el gasto (real o proyectado) se acerca o supera un umbral definido?', options: { A: 'AWS Budgets', B: 'Amazon Route 53', C: 'AWS Direct Connect', D: 'Amazon Cognito' }, answer: ['A'], explanation: 'AWS Budgets permite definir presupuestos de costo o uso y configurar alertas automáticas (vía SNS/email) cuando el gasto real o proyectado se acerca o supera los umbrales definidos, apoyando la gobernanza financiera.', domain: 'Cost and Performance Optimization', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta de AWS analiza patrones de uso de S3 y recomienda mover automáticamente objetos entre clases de almacenamiento según su frecuencia de acceso?', options: { A: 'S3 Intelligent-Tiering', B: 'Amazon Athena', C: 'AWS Glue', D: 'Amazon Redshift' }, answer: ['A'], explanation: 'S3 Intelligent-Tiering monitorea automáticamente los patrones de acceso de cada objeto y lo mueve entre niveles de acceso frecuente/infrecuente sin intervención manual ni impacto en el rendimiento, optimizando el costo de almacenamiento.', domain: 'Cost and Performance Optimization', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "runbook" en el contexto de AWS Systems Manager Automation?', options: { A: 'Un documento (SSM Document) que define una secuencia de pasos automatizados para realizar una tarea operativa común (ej. reiniciar una instancia, rotar un secreto)', B: 'Un tipo de instancia EC2', C: 'Un sinónimo de CloudFormation stack', D: 'Un documento exclusivamente financiero' }, answer: ['A'], explanation: 'Un runbook de SSM Automation es un SSM Document que define pasos automatizados para tareas operativas repetitivas, permitiendo ejecutarlas de forma consistente y auditable sin intervención manual paso a paso.', domain: 'Deployment, Provisioning, and Automation', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué métrica de CloudWatch es clave para monitorear si una instancia EC2 está alcanzando el límite de su capacidad de cómputo, indicando la necesidad de escalar?', options: { A: 'CPUUtilization', B: 'NetworkPacketsIn exclusivamente', C: 'StatusCheckFailed exclusivamente', D: 'DiskReadOps exclusivamente' }, answer: ['A'], explanation: 'La métrica CPUUtilization de CloudWatch mide el porcentaje de uso de CPU de una instancia EC2; valores sostenidos altos son una señal común para disparar políticas de Auto Scaling o considerar un tipo de instancia más grande.', domain: 'Monitoring, Logging, and Remediation', difficulty: 'easy' },
    ],
  },
  {
    slug: 'azure-administrator-az104',
    title: 'Microsoft Azure Administrator (AZ-104)',
    description: 'Examen de práctica alineado a los 5 dominios oficiales de AZ-104: identidades y gobernanza, storage, cómputo, redes virtuales y monitoreo.',
    domain: 'it', category: 'cloud-azure', level: 'advanced', language: 'es',
    tags: ['azure', 'az-104', 'administrator'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en Microsoft AZ-104 Skills Measured Outline (actualizado abr-2026) — learn.microsoft.com/certifications/azure-administrator (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué servicio de Azure gestiona identidades de usuarios y aplicaciones, permitiendo autenticación single sign-on (SSO) en la nube?', options: { A: 'Microsoft Entra ID (antes Azure Active Directory)', B: 'Azure Policy', C: 'Azure Resource Manager', D: 'Azure Monitor' }, answer: ['A'], explanation: 'Microsoft Entra ID (renombrado de Azure AD) es el servicio de gestión de identidades y accesos de Azure, habilitando SSO, MFA y gestión de usuarios/aplicaciones.', domain: 'Identities and Governance', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué mecanismo de Azure otorga permisos granulares a usuarios/grupos sobre recursos específicos (ej. solo lectura sobre un Resource Group)?', options: { A: 'Azure RBAC (Role-Based Access Control)', B: 'Azure Bastion', C: 'Network Watcher', D: 'Azure Backup' }, answer: ['A'], explanation: 'Azure RBAC asigna roles (integrados o personalizados) a identidades sobre un scope específico (suscripción, resource group, recurso), controlando qué acciones pueden realizar.', domain: 'Identities and Governance', difficulty: 'easy' },
      { type: 'multiple', question: 'Una organización necesita garantizar que todos los recursos creados en una suscripción tengan una etiqueta (tag) de "Department" obligatoria. ¿Qué herramienta usar?', options: { A: 'Azure Policy, con una definición que exija esa etiqueta y deniegue la creación si falta', B: 'Azure Monitor', C: 'Azure Bastion', D: 'Azure Load Balancer' }, answer: ['A'], explanation: 'Azure Policy permite definir reglas de gobernanza (ej. exigir tags específicos) que se evalúan y aplican automáticamente, pudiendo denegar la creación de recursos no conformes.', domain: 'Identities and Governance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué estructura de Azure permite agrupar múltiples suscripciones bajo una jerarquía común para aplicar Azure Policy y RBAC de forma centralizada?', options: { A: 'Management Groups', B: 'Resource Groups únicamente', C: 'Availability Zones', D: 'Virtual Networks' }, answer: ['A'], explanation: 'Los Management Groups permiten organizar múltiples suscripciones en una jerarquía, aplicando políticas de gobernanza y asignaciones RBAC de forma centralizada a todas las suscripciones agrupadas.', domain: 'Identities and Governance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre Azure Blob Storage y Azure Files?', options: { A: 'Blob Storage es para almacenamiento de objetos no estructurados accedidos vía API/HTTP; Azure Files provee shares de archivos accesibles vía protocolo SMB/NFS, como un file share tradicional', B: 'Son exactamente lo mismo', C: 'Azure Files solo funciona con máquinas virtuales Linux', D: 'Blob Storage requiere siempre una VM para acceder a él' }, answer: ['A'], explanation: 'Blob Storage almacena objetos no estructurados accedidos vía REST API; Azure Files ofrece shares de archivos completamente gestionados accesibles mediante protocolos estándar SMB/NFS, útil para migrar file shares on-premises.', domain: 'Storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué nivel de acceso (access tier) de Blob Storage es más económico para datos accedidos con muy poca frecuencia pero que requieren recuperación en minutos?', options: { A: 'Hot', B: 'Cool', C: 'Archive', D: 'Premium' }, answer: ['B'], explanation: 'El tier "Cool" está optimizado para datos poco accedidos con retención de al menos 30 días, con costo de almacenamiento menor que Hot pero mayor costo por acceso; Archive es aún más económico pero requiere horas para rehidratar los datos.', domain: 'Storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta de línea de comandos se usa para copiar grandes volúmenes de datos hacia o desde Azure Storage de forma eficiente?', options: { A: 'AzCopy', B: 'Azure CLI únicamente para todo', C: 'PowerShell exclusivamente', D: 'FTP estándar' }, answer: ['A'], explanation: 'AzCopy es la herramienta optimizada de Microsoft para transferencias masivas de datos hacia/desde Azure Storage, con soporte de paralelismo y reanudación de transferencias interrumpidas.', domain: 'Storage', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio de cómputo de Azure permite ejecutar contenedores sin gestionar servidores ni clusters, pagando solo por el tiempo de ejecución?', options: { A: 'Azure Container Instances (ACI) o Azure Container Apps', B: 'Azure Virtual Machines exclusivamente', C: 'Azure ExpressRoute', D: 'Azure DNS' }, answer: ['A'], explanation: 'Azure Container Instances (y más recientemente Container Apps) permiten ejecutar contenedores de forma serverless, sin aprovisionar ni gestionar VMs o clusters de orquestación.', domain: 'Compute', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué recurso de Azure permite escalar automáticamente el número de instancias de VM según la demanda (CPU, memoria)?', options: { A: 'Virtual Machine Scale Sets (VMSS)', B: 'Azure Bastion', C: 'Azure Key Vault', D: 'Azure DNS Zone' }, answer: ['A'], explanation: 'Virtual Machine Scale Sets permiten desplegar y gestionar un grupo de VMs idénticas que escalan automáticamente hacia arriba o abajo según reglas de autoscaling basadas en métricas.', domain: 'Compute', difficulty: 'medium' },
      { type: 'multiple', question: 'Para garantizar alta disponibilidad de un conjunto de VMs ante la falla de un rack de hardware dentro del mismo datacenter, ¿qué configuración se usa?', options: { A: 'Availability Set (distribuye VMs en fault domains y update domains distintos)', B: 'Un único Availability Zone sin redundancia adicional', C: 'Reserved Instances', D: 'Azure Front Door exclusivamente' }, answer: ['A'], explanation: 'Un Availability Set distribuye las VMs en distintos fault domains (racks/hardware físico) y update domains (grupos de mantenimiento), reduciendo el riesgo de que una falla de hardware o un mantenimiento afecte a todas las VMs simultáneamente.', domain: 'Compute', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué servicio permite ejecutar aplicaciones web sin gestionar la infraestructura subyacente (PaaS), con soporte para múltiples lenguajes y despliegue continuo?', options: { A: 'Azure App Service', B: 'Azure Virtual Network', C: 'Azure Firewall', D: 'Azure Site Recovery' }, answer: ['A'], explanation: 'Azure App Service es una plataforma PaaS totalmente gestionada para alojar aplicaciones web, APIs y backends móviles, con soporte de múltiples lenguajes, escalado automático y CI/CD integrado.', domain: 'Compute', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué componente de red de Azure controla el tráfico entrante y saliente permitido hacia una subnet, actuando como firewall a nivel de red?', options: { A: 'Network Security Group (NSG)', B: 'Load Balancer', C: 'Azure DNS', D: 'ExpressRoute' }, answer: ['A'], explanation: 'Un NSG contiene reglas de seguridad que permiten o deniegan tráfico de red entrante/saliente hacia recursos dentro de una VNet, aplicándose a nivel de subnet o interfaz de red.', domain: 'Networking', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio permite conectar dos VNets de Azure de forma privada para que los recursos se comuniquen usando IPs privadas?', options: { A: 'VNet Peering', B: 'Azure Bastion', C: 'Azure CDN', D: 'Traffic Manager' }, answer: ['A'], explanation: 'VNet Peering conecta dos redes virtuales de Azure permitiendo comunicación privada entre sus recursos mediante IPs privadas, sin pasar por internet público.', domain: 'Networking', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de Azure permite el acceso RDP/SSH seguro a VMs sin exponer una IP pública en la VM ni abrir el puerto 3389/22 a internet?', options: { A: 'Azure Bastion', B: 'Azure Load Balancer', C: 'Azure DDoS Protection', D: 'Azure Firewall Manager' }, answer: ['A'], explanation: 'Azure Bastion provee conectividad RDP/SSH segura a través del portal de Azure sin necesidad de IP pública en la VM ni exponer los puertos de gestión a internet.', domain: 'Networking', difficulty: 'medium' },
      { type: 'multiple', question: 'Una organización necesita conectar su red on-premises a Azure de forma privada y con ancho de banda garantizado, sin pasar por internet público. ¿Qué servicio usar?', options: { A: 'Azure ExpressRoute', B: 'Azure CDN', C: 'Azure Traffic Manager', D: 'Azure Application Gateway' }, answer: ['A'], explanation: 'ExpressRoute provee una conexión privada dedicada entre la red on-premises y Azure, con mayor confiabilidad, velocidad y menor latencia que una VPN sobre internet público.', domain: 'Networking', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta de Azure permite diagnosticar problemas de conectividad de red entre dos recursos (ej. una VM y una base de datos), mostrando la ruta y los puntos de bloqueo?', options: { A: 'Network Watcher (con su herramienta Connection Troubleshoot/IP Flow Verify)', B: 'Azure Monitor Workbooks exclusivamente', C: 'Azure Advisor', D: 'Azure Cost Management' }, answer: ['A'], explanation: 'Network Watcher ofrece herramientas de diagnóstico como Connection Troubleshoot e IP Flow Verify, que identifican si el tráfico entre dos recursos está siendo bloqueado y por qué regla específica.', domain: 'Networking', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué servicio centraliza la recolección de métricas y logs de recursos de Azure, permitiendo crear alertas y dashboards?', options: { A: 'Azure Monitor (con Log Analytics como motor de consultas)', B: 'Azure DevOps', C: 'Azure Migrate', D: 'Azure Purview' }, answer: ['A'], explanation: 'Azure Monitor centraliza la recolección de métricas y logs de toda la plataforma, usando Log Analytics para consultas avanzadas (KQL) y permitiendo configurar alertas basadas en esos datos.', domain: 'Monitoring', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio de Azure permite realizar backups automáticos y programados de VMs, con retención configurable a largo plazo?', options: { A: 'Azure Backup', B: 'Azure Site Recovery exclusivamente', C: 'Azure Data Factory', D: 'Azure Batch' }, answer: ['A'], explanation: 'Azure Backup ofrece backups automatizados y programados de VMs, bases de datos y otros recursos, con políticas de retención configurables a corto y largo plazo, diferenciándose de Site Recovery (orientado a disaster recovery/replicación).', domain: 'Monitoring', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es una "Action Group" dentro de una alerta de Azure Monitor?', options: { A: 'Un grupo de recursos a monitorear', B: 'Un conjunto de acciones de notificación/automatización (email, SMS, webhook, runbook) que se ejecutan cuando se dispara una alerta', C: 'Un tipo de Availability Zone', D: 'Un grupo de usuarios con permisos RBAC' }, answer: ['B'], explanation: 'Un Action Group define qué acciones ejecutar cuando una alerta se dispara (notificar por email/SMS, invocar un webhook, ejecutar un runbook de Automation), desacoplando la definición de la alerta de la respuesta.', domain: 'Monitoring', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Resource Group" en Azure?', options: { A: 'Un contenedor lógico que agrupa recursos relacionados de Azure (VMs, redes, bases de datos) para gestionarlos, aplicarles permisos y facturarlos de forma conjunta', B: 'Un tipo de máquina virtual', C: 'Un sinónimo de suscripción de Azure', D: 'Un grupo de usuarios exclusivamente, sin relación con recursos' }, answer: ['A'], explanation: 'Un Resource Group agrupa lógicamente recursos relacionados de un proyecto/aplicación, facilitando su gestión conjunta (permisos RBAC, políticas, facturación, eliminación coordinada) como una unidad.', domain: 'Identities and Governance', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta de Azure permite implementar infraestructura como código de forma nativa, con una sintaxis más concisa que ARM templates JSON?', options: { A: 'Bicep', B: 'Azure DevTest Labs', C: 'Azure Automation Runbooks', D: 'Azure Migrate' }, answer: ['A'], explanation: 'Bicep es un lenguaje declarativo específico de Azure que se transpila a ARM templates, ofreciendo una sintaxis más concisa y legible que el JSON de ARM templates tradicional, para definir infraestructura como código.', domain: 'Compute', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "Azure Hybrid Benefit" y qué beneficio ofrece a organizaciones que migran cargas de trabajo existentes a Azure?', options: { A: 'Permite reutilizar licencias existentes de Windows Server/SQL Server con Software Assurance para reducir el costo de VMs en Azure', B: 'Un descuento aplicable únicamente a servicios de red', C: 'Un beneficio exclusivo para nuevas suscripciones sin cargas de trabajo previas', D: 'Un servicio de migración de datos sin relación con licenciamiento' }, answer: ['A'], explanation: 'Azure Hybrid Benefit permite a organizaciones con licencias on-premises existentes (con Software Assurance) de Windows Server o SQL Server aplicarlas a recursos en Azure, reduciendo significativamente el costo de cómputo comparado con pagar la licencia incluida.', domain: 'Compute', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué componente de Azure Storage permite compartir archivos accesibles vía protocolo SMB, funcionando como un file share tradicional en la nube?', options: { A: 'Azure Files', B: 'Azure Blob Storage exclusivamente', C: 'Azure Table Storage', D: 'Azure Queue Storage' }, answer: ['A'], explanation: 'Azure Files provee shares de archivos completamente gestionados accesibles mediante SMB (y NFS), útil para migrar file shares on-premises o compartir archivos entre múltiples VMs simultáneamente.', domain: 'Storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Service Principal" en Microsoft Entra ID, y para qué se usa comúnmente?', options: { A: 'Una identidad de aplicación (no humana) usada para que aplicaciones, scripts o servicios se autentiquen y accedan a recursos de Azure de forma programática, sin usar credenciales de un usuario', B: 'Un sinónimo de administrador global', C: 'Un tipo de máquina virtual', D: 'Un grupo de Resource Groups' }, answer: ['A'], explanation: 'Un Service Principal es la identidad que usan aplicaciones, scripts o pipelines de CI/CD para autenticarse y acceder a recursos de Azure de forma programática, con permisos RBAC asignados específicamente a esa identidad, sin depender de credenciales de un usuario humano.', domain: 'Identities and Governance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "Managed Disk" en Azure, y qué ventaja ofrece frente a los discos no gestionados (unmanaged)?', options: { A: 'Azure gestiona automáticamente el almacenamiento subyacente del disco (cuenta de storage, redundancia), simplificando la administración y mejorando la confiabilidad frente a gestionar manualmente cuentas de storage para discos', B: 'Un disco que no puede adjuntarse a ninguna VM', C: 'Un sinónimo de Azure Files', D: 'Un tipo de disco exclusivo para bases de datos' }, answer: ['A'], explanation: 'Los Managed Disks abstraen la gestión de la cuenta de almacenamiento subyacente, simplificando la administración, mejorando la confiabilidad (evitando límites de IOPS compartidos entre discos en la misma cuenta de storage) y facilitando snapshots/backups.', domain: 'Storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es "Azure Policy" y en qué se diferencia de Azure RBAC?', options: { A: 'Azure Policy define y aplica reglas sobre CÓMO deben configurarse los recursos (ej. "todas las VMs deben estar en cierta región"); Azure RBAC controla QUIÉN puede realizar QUÉ acciones sobre los recursos — ambos mecanismos son complementarios, no intercambiables', B: 'Son exactamente lo mismo', C: 'Azure Policy reemplaza completamente la necesidad de RBAC', D: 'RBAC solo aplica a Resource Groups, nunca a recursos individuales' }, answer: ['A'], explanation: 'Azure Policy gobierna la CONFIGURACIÓN permitida de los recursos (compliance), mientras Azure RBAC gobierna el ACCESO (quién puede hacer qué) — ambos mecanismos de gobernanza son complementarios y suelen usarse en conjunto.', domain: 'Identities and Governance', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué comando de Azure CLI se usa para crear un grupo de recursos?', options: { A: 'az group create', B: 'az vm create', C: 'az storage account create', D: 'az network vnet create' }, answer: ['A'], explanation: '`az group create --name <nombre> --location <región>` es el comando de Azure CLI para crear un nuevo Resource Group, el contenedor lógico necesario antes de desplegar la mayoría de los recursos.', domain: 'Identities and Governance', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es "Azure Cost Management + Billing" y para qué se usa principalmente?', options: { A: 'Analizar y visualizar el gasto en recursos de Azure, configurar presupuestos con alertas, y obtener recomendaciones de optimización de costos', B: 'Un servicio exclusivo de gestión de identidades', C: 'Una herramienta de monitoreo de rendimiento de red', D: 'Un servicio de backup de VMs' }, answer: ['A'], explanation: 'Azure Cost Management + Billing centraliza el análisis del gasto en Azure, permite configurar presupuestos con alertas automáticas, y provee recomendaciones (junto con Azure Advisor) para optimizar costos de recursos infrautilizados.', domain: 'Monitoring', difficulty: 'easy' },
    ],
  },
  {
    slug: 'gcp-cloud-digital-leader',
    title: 'Google Cloud Digital Leader',
    description: 'Examen de práctica alineado a los 4 dominios oficiales de Cloud Digital Leader: fluidez conceptual en cloud, datos e IA, modernización de infraestructura, y seguridad/operaciones — sin foco técnico profundo.',
    domain: 'it', category: 'cloud-gcp', level: 'beginner', language: 'es',
    tags: ['gcp', 'google-cloud', 'cdl'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en Google Cloud Digital Leader Certification Exam Guide — services.google.com/fh/files/misc/cloud_digital_leader_exam_guide_english.pdf (contenido original)',
    questions: [
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿cuál es un beneficio clave de migrar de infraestructura on-premises a la nube?', options: { A: 'Eliminar por completo cualquier costo operativo', B: 'Pasar de un modelo de gasto de capital (CapEx) a uno de gasto operativo (OpEx), pagando solo por lo que se usa', C: 'Garantizar automáticamente el cumplimiento de todas las regulaciones sin esfuerzo adicional', D: 'Eliminar la necesidad de cualquier estrategia de seguridad' }, answer: ['B'], explanation: 'Uno de los beneficios de negocio más citados de la nube es el cambio de CapEx (comprar hardware por adelantado) a OpEx (pagar por consumo real), mejorando la flexibilidad financiera.', domain: 'Cloud con Google Cloud', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué significa "elasticidad" en el contexto de la computación en la nube?', options: { A: 'La capacidad de los recursos de escalar automáticamente hacia arriba o abajo según la demanda real', B: 'La flexibilidad para elegir cualquier proveedor cloud sin costo de cambio', C: 'La garantía de que el servicio nunca fallará', D: 'La capacidad de un servidor físico de moverse entre datacenters' }, answer: ['A'], explanation: 'La elasticidad es la capacidad de los recursos cloud de escalar automáticamente (agregar o quitar capacidad) en respuesta a cambios reales en la demanda, evitando tanto el sobreaprovisionamiento como la falta de capacidad.', domain: 'Cloud con Google Cloud', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué diferencia principal hay entre IaaS, PaaS y SaaS en Google Cloud?', options: { A: 'Son sinónimos, no hay diferencia práctica', B: 'IaaS (ej. Compute Engine) da control sobre infraestructura virtualizada; PaaS (ej. App Engine) gestiona la infraestructura y deja al cliente enfocarse en el código; SaaS (ej. Google Workspace) entrega software listo para usar', C: 'SaaS siempre es más barato que IaaS en cualquier escenario', D: 'PaaS requiere que el cliente gestione los servidores físicos' }, answer: ['B'], explanation: 'Los modelos de servicio cloud difieren en cuánto gestiona el proveedor: IaaS deja al cliente gestionar SO y aplicaciones sobre infraestructura virtualizada, PaaS abstrae la infraestructura para que el cliente solo gestione su código, y SaaS entrega la aplicación completa lista para usar.', domain: 'Cloud con Google Cloud', difficulty: 'medium' },
      { type: 'multiple', question: 'Una empresa quiere entender el gasto en la nube por proyecto y equipo. ¿Qué herramienta de Google Cloud ayuda a esto?', options: { A: 'Cloud Billing reports y presupuestos (budgets) con alertas', B: 'BigQuery exclusivamente', C: 'Cloud DNS', D: 'Anthos' }, answer: ['A'], explanation: 'Cloud Billing ofrece reportes detallados de gasto por proyecto/servicio y permite configurar presupuestos con alertas automáticas, dando visibilidad financiera a los equipos de negocio y finanzas.', domain: 'Cloud con Google Cloud', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué característica de las regiones y zonas de Google Cloud contribuye a la alta disponibilidad de una aplicación?', options: { A: 'Desplegar recursos en múltiples zonas dentro de una región (o en múltiples regiones) para tolerar la falla de una zona/región completa', B: 'Usar siempre una sola zona para simplificar la gestión', C: 'Las zonas no afectan la disponibilidad de ninguna forma', D: 'Solo importa la velocidad de internet del usuario final' }, answer: ['A'], explanation: 'Distribuir recursos entre múltiples zonas (o regiones) permite que la aplicación siga funcionando aunque una zona/región individual falle, un principio central de diseño de alta disponibilidad en cloud.', domain: 'Cloud con Google Cloud', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de Google Cloud es un data warehouse totalmente administrado y serverless, diseñado para análisis de grandes volúmenes de datos con SQL?', options: { A: 'BigQuery', B: 'Cloud Storage', C: 'Cloud Spanner', D: 'Compute Engine' }, answer: ['A'], explanation: 'BigQuery es el data warehouse serverless de Google Cloud, permitiendo consultas analíticas SQL sobre petabytes de datos sin gestionar infraestructura, ampliamente usado en casos de uso de business intelligence.', domain: 'Datos e IA', difficulty: 'easy' },
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿qué valor aporta el machine learning gestionado (ej. Vertex AI) frente a construir modelos desde cero?', options: { A: 'Ningún valor adicional, siempre es mejor construir todo desde cero', B: 'Reduce el tiempo y la experticia técnica necesaria para entrenar, desplegar y mantener modelos, acelerando la adopción de IA en casos de uso de negocio', C: 'Elimina por completo la necesidad de datos de calidad', D: 'Solo funciona para texto, nunca para imágenes o datos tabulares' }, answer: ['B'], explanation: 'Plataformas de ML gestionado como Vertex AI reducen la barrera técnica y de tiempo para entrenar, desplegar y operar modelos de machine learning, permitiendo a más equipos de negocio adoptar IA sin un equipo de ML especializado desde cero.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tipo de base de datos gestionada de Google Cloud es más apropiada para una aplicación transaccional relacional que requiere escalabilidad global con consistencia fuerte?', options: { A: 'Cloud Spanner', B: 'Cloud Storage', C: 'Pub/Sub', D: 'Cloud Functions' }, answer: ['A'], explanation: 'Cloud Spanner combina el modelo relacional (SQL, transacciones ACID) con escalabilidad horizontal global, algo poco común entre bases de datos relacionales tradicionales — ideal para aplicaciones transaccionales de escala global.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "data lake" y en qué se diferencia conceptualmente de un "data warehouse"?', options: { A: 'Son términos idénticos sin ninguna diferencia', B: 'Un data lake almacena datos crudos en cualquier formato (estructurado, semiestructurado, no estructurado) de forma económica; un data warehouse almacena datos estructurados y modelados, optimizados para consultas analíticas', C: 'Un data lake solo puede contener imágenes', D: 'Un data warehouse siempre es más barato que un data lake' }, answer: ['B'], explanation: 'Un data lake (ej. Cloud Storage) almacena datos crudos sin estructura fija de forma flexible y económica; un data warehouse (ej. BigQuery) almacena datos ya modelados y estructurados, optimizados para consultas analíticas rápidas.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: 'Un equipo de negocio quiere obtener insights conversacionales de sus datos sin escribir consultas SQL complejas. ¿Qué tipo de herramienta de Google Cloud se alinea con esta necesidad?', options: { A: 'Herramientas de IA generativa integradas en productos de datos (ej. Gemini en BigQuery/Looker) que permiten consultas en lenguaje natural', B: 'Compute Engine', C: 'Cloud VPN', D: 'Identity and Access Management (IAM) exclusivamente' }, answer: ['A'], explanation: 'Google Cloud ha integrado capacidades de IA generativa (Gemini) en sus herramientas de datos, permitiendo a usuarios de negocio hacer preguntas en lenguaje natural sin escribir SQL directamente.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es la "modernización de aplicaciones" en el contexto de una migración a la nube?', options: { A: 'Simplemente mover una aplicación tal cual, sin cambios ("lift and shift"), sin ningún beneficio adicional', B: 'Rediseñar o adaptar aplicaciones legacy para aprovechar capacidades nativas de la nube (ej. contenedores, microservicios, servicios gestionados), mejorando escalabilidad y agilidad', C: 'Eliminar completamente las aplicaciones antiguas sin reemplazo', D: 'Un proceso que solo aplica a bases de datos' }, answer: ['B'], explanation: 'La modernización va más allá de mover aplicaciones sin cambios ("lift and shift"): implica adaptarlas para aprovechar servicios cloud-native (contenedores, serverless, microservicios), mejorando agilidad, escalabilidad y reduciendo deuda técnica.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es Google Kubernetes Engine (GKE) y por qué una empresa lo elegiría para modernizar sus aplicaciones?', options: { A: 'Un servicio de almacenamiento de objetos', B: 'Un servicio gestionado de orquestación de contenedores, que facilita desplegar, escalar y operar aplicaciones basadas en microservicios/contenedores', C: 'Una herramienta exclusiva de análisis de datos', D: 'Un servicio de correo electrónico empresarial' }, answer: ['B'], explanation: 'GKE es el servicio gestionado de Kubernetes de Google Cloud, simplificando la orquestación de contenedores para arquitecturas de microservicios, un patrón común en la modernización de aplicaciones monolíticas legacy.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué ventaja de negocio ofrece un enfoque "serverless" (ej. Cloud Run, Cloud Functions) frente a gestionar servidores tradicionales?', options: { A: 'El equipo deja de pagar completamente por el uso del servicio', B: 'El equipo de desarrollo se enfoca en el código sin gestionar servidores, con escalado automático y pago solo por el uso real, reduciendo carga operativa', C: 'Serverless solo funciona para sitios web estáticos', D: 'Serverless requiere más personal de operaciones que las VMs tradicionales' }, answer: ['B'], explanation: 'El modelo serverless elimina la gestión de servidores para el equipo de desarrollo, escalando automáticamente y cobrando solo por el uso real, lo que reduce la carga operativa y acelera el time-to-market.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es una estrategia "híbrida" o "multicloud" y por qué una empresa la adoptaría?', options: { A: 'Usar Google Cloud exclusivamente para todo, sin ninguna otra infraestructura', B: 'Combinar infraestructura on-premises con la nube (híbrida) o usar múltiples proveedores cloud (multicloud), por razones de compliance, evitar dependencia de un solo proveedor, o requisitos técnicos específicos', C: 'Un término exclusivo de marketing sin implicación técnica real', D: 'Usar solo servicios gratuitos de cualquier proveedor' }, answer: ['B'], explanation: 'Las estrategias híbridas (on-premises + cloud) o multicloud (varios proveedores) responden a necesidades reales de negocio: cumplimiento regulatorio, evitar vendor lock-in, latencia, o aprovechar fortalezas específicas de cada proveedor.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'medium' },
      { type: 'multiple', question: 'Anthos es la plataforma de Google Cloud diseñada principalmente para:', options: { A: 'Gestionar y desplegar aplicaciones de forma consistente en entornos híbridos y multicloud, basada en Kubernetes', B: 'Enviar campañas de email marketing', C: 'Gestionar exclusivamente bases de datos relacionales', D: 'Reemplazar la necesidad de IAM' }, answer: ['A'], explanation: 'Anthos permite gestionar aplicaciones de forma consistente across entornos on-premises, Google Cloud y otros proveedores cloud, basándose en Kubernetes como capa común de orquestación.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué modelo de seguridad describe el reparto de responsabilidades entre Google Cloud y el cliente?', options: { A: 'El modelo de responsabilidad compartida, donde Google asegura la infraestructura subyacente y el cliente es responsable de la configuración, datos y accesos dentro de su entorno', B: 'Google es responsable de absolutamente todo sin excepción', C: 'El cliente es responsable de la seguridad física de los datacenters', D: 'No existe ningún reparto formal de responsabilidades' }, answer: ['A'], explanation: 'Al igual que otros proveedores cloud, Google Cloud opera bajo un modelo de responsabilidad compartida: Google asegura la infraestructura física y la plataforma, mientras el cliente es responsable de configurar correctamente el acceso, los datos y las aplicaciones.', domain: 'Seguridad y operaciones', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué principio de seguridad establece que los usuarios y servicios deben tener solo los permisos mínimos necesarios para su función?', options: { A: 'Principio de menor privilegio (least privilege), implementado en Google Cloud vía IAM', B: 'Principio de máxima disponibilidad', C: 'Principio de redundancia total', D: 'Principio de elasticidad' }, answer: ['A'], explanation: 'El principio de menor privilegio, implementado a través de roles de Identity and Access Management (IAM), asegura que cada identidad tenga únicamente los permisos estrictamente necesarios, reduciendo el riesgo si una cuenta se ve comprometida.', domain: 'Seguridad y operaciones', difficulty: 'easy' },
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿por qué es importante el cumplimiento normativo (compliance) al elegir un proveedor cloud para una industria regulada (ej. salud, finanzas)?', options: { A: 'No es relevante, todos los proveedores cloud cumplen automáticamente cualquier regulación', B: 'Porque el proveedor debe ofrecer certificaciones y controles (ej. HIPAA, PCI-DSS, ISO 27001) que permitan a la empresa cumplir sus propias obligaciones regulatorias sobre los datos que procesa', C: 'El compliance solo aplica a empresas que no usan la nube', D: 'Es un tema exclusivamente técnico sin impacto en el negocio' }, answer: ['B'], explanation: 'Elegir un proveedor con certificaciones de compliance relevantes (HIPAA, PCI-DSS, ISO 27001, etc.) es una decisión de negocio crítica en industrias reguladas, ya que facilita (aunque no garantiza automáticamente) que la empresa cumpla sus propias obligaciones legales.', domain: 'Seguridad y operaciones', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es Compute Engine dentro de Google Cloud, en términos de modelo de servicio (IaaS/PaaS/SaaS)?', options: { A: 'Un servicio IaaS que provee máquinas virtuales configurables, dando al cliente control sobre el sistema operativo y las aplicaciones instaladas', B: 'Un servicio SaaS de ofimática', C: 'Un servicio exclusivo de almacenamiento de objetos', D: 'Un servicio de correo electrónico' }, answer: ['A'], explanation: 'Compute Engine es el servicio IaaS de Google Cloud que provee máquinas virtuales configurables, dando al cliente control total sobre el sistema operativo y las aplicaciones, a diferencia de servicios PaaS que abstraen la infraestructura.', domain: 'Cloud con Google Cloud', difficulty: 'easy' },
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿qué ventaja aporta la elasticidad automática (autoscaling) de recursos en la nube frente a aprovisionar capacidad fija on-premises?', options: { A: 'Permite pagar solo por la capacidad realmente utilizada en cada momento, evitando el costo de sobreaprovisionar "por si acaso" o la pérdida de ventas por falta de capacidad en picos de demanda', B: 'Elimina completamente cualquier costo asociado a la infraestructura', C: 'Solo es relevante para empresas con tráfico constante y predecible', D: 'No aporta ninguna ventaja de negocio real' }, answer: ['A'], explanation: 'La elasticidad automática ajusta la capacidad a la demanda real, evitando el costo de sobreaprovisionar infraestructura "por si acaso" (como se hacía tradicionalmente on-premises) y evitando también perder ventas/servicio por falta de capacidad durante picos inesperados.', domain: 'Cloud con Google Cloud', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es Cloud Functions en Google Cloud, y qué modelo de cómputo representa?', options: { A: 'Un servicio serverless que ejecuta código en respuesta a eventos, sin que el cliente gestione ningún servidor', B: 'Un servicio IaaS de máquinas virtuales', C: 'Un servicio exclusivo de almacenamiento', D: 'Una herramienta de diseño gráfico' }, answer: ['A'], explanation: 'Cloud Functions es el servicio serverless (Functions-as-a-Service) de Google Cloud, ejecutando código en respuesta a eventos (HTTP, Pub/Sub, cambios en Storage) sin que el cliente gestione ni aprovisione servidores.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es Vertex AI en el ecosistema de Google Cloud?', options: { A: 'Una plataforma unificada de machine learning gestionado, que permite entrenar, desplegar y monitorear modelos de IA/ML sin gestionar infraestructura desde cero', B: 'Un servicio exclusivo de almacenamiento de video', C: 'Una herramienta de diseño de interfaces', D: 'Un servicio de correo electrónico empresarial' }, answer: ['A'], explanation: 'Vertex AI unifica las herramientas de machine learning de Google Cloud (entrenamiento, despliegue, monitoreo de modelos) en una plataforma gestionada, reduciendo la complejidad técnica de adoptar IA/ML en la organización.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿qué representa el término "time to market" y cómo lo mejora la adopción de la nube?', options: { A: 'El tiempo que tarda una organización en llevar un producto/servicio nuevo al mercado; la nube lo reduce al eliminar la necesidad de comprar/aprovisionar hardware físico antes de poder desarrollar y lanzar', B: 'Un término exclusivo de manufactura física, sin relación con software', C: 'El tiempo que tarda un servidor en encender', D: 'Un concepto sin ninguna relación con la adopción de la nube' }, answer: ['A'], explanation: 'El "time to market" mide cuánto tarda una organización en lanzar un producto/servicio; la nube lo acelera al eliminar los tiempos de adquisición y aprovisionamiento de hardware físico, permitiendo aprovisionar recursos en minutos en vez de semanas/meses.', domain: 'Cloud con Google Cloud', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "data warehouse serverless" como BigQuery, y qué ventaja de negocio aporta frente a gestionar servidores de base de datos propios?', options: { A: 'Permite ejecutar análisis sobre grandes volúmenes de datos sin que el equipo de TI deba aprovisionar, parchear o escalar manualmente servidores de base de datos, reduciendo la carga operativa y el tiempo hasta obtener insights', B: 'Elimina completamente la necesidad de tener datos estructurados', C: 'Solo funciona con datos de menos de 1 GB', D: 'No ofrece ninguna ventaja real frente a servidores propios' }, answer: ['A'], explanation: 'Un data warehouse serverless como BigQuery elimina la necesidad de que el equipo de TI gestione servidores de base de datos (aprovisionamiento, parches, escalado), permitiendo que los analistas se enfoquen en obtener insights de negocio más rápidamente.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué rol cumple un "Landing Zone" en un proyecto de migración a la nube?', options: { A: 'Un entorno base preconfigurado (con red, identidad, seguridad y gobernanza) que sirve como fundación estandarizada antes de desplegar cargas de trabajo específicas', B: 'Un tipo de máquina virtual específica', C: 'Un sinónimo de Compute Engine', D: 'Un servicio exclusivo de facturación' }, answer: ['A'], explanation: 'Una Landing Zone establece la fundación de gobernanza, red, identidad y seguridad de un entorno cloud ANTES de desplegar cargas de trabajo específicas, asegurando una base consistente y bien gobernada para el crecimiento futuro.', domain: 'Infraestructura y modernización de aplicaciones', difficulty: 'hard' },
      { type: 'multiple', question: 'Desde una perspectiva de negocio, ¿qué riesgo representa el "vendor lock-in" al depender fuertemente de servicios propietarios de un único proveedor cloud?', options: { A: 'Ninguno, siempre es beneficioso maximizar el uso de servicios propietarios de un solo proveedor', B: 'Puede dificultar y encarecer significativamente una futura migración a otro proveedor, reduciendo el poder de negociación y la flexibilidad estratégica de la organización', C: 'El vendor lock-in solo afecta a proveedores pequeños, nunca a los grandes', D: 'Es un concepto exclusivamente técnico sin ninguna implicación de negocio' }, answer: ['B'], explanation: 'El vendor lock-in (dependencia fuerte de servicios propietarios de un proveedor) puede dificultar y encarecer una eventual migración futura, reduciendo el poder de negociación de la organización — una consideración estratégica de negocio, no solo técnica, al diseñar arquitecturas cloud.', domain: 'Seguridad y operaciones', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es Cloud SQL en Google Cloud?', options: { A: 'Un servicio de base de datos relacional totalmente gestionado (compatible con MySQL, PostgreSQL, SQL Server), donde Google gestiona el mantenimiento, parches y backups', B: 'Un lenguaje de consulta exclusivo de Google', C: 'Un servicio de almacenamiento de objetos', D: 'Una herramienta de visualización de datos' }, answer: ['A'], explanation: 'Cloud SQL es un servicio de base de datos relacional gestionado (soportando MySQL, PostgreSQL y SQL Server), donde Google se encarga del mantenimiento, parches, backups y alta disponibilidad, reduciendo la carga operativa del equipo de base de datos.', domain: 'Datos e IA', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué representa el concepto de "pago por uso" (pay-as-you-go) como modelo de precios de la nube?', options: { A: 'El cliente paga únicamente por los recursos que efectivamente consume (cómputo, almacenamiento, red), sin necesidad de comprometerse a un pago fijo por capacidad no utilizada', B: 'Un modelo que siempre requiere pagar un monto fijo mensual sin importar el uso', C: 'Un modelo exclusivo para grandes empresas, no disponible para startups', D: 'Un modelo que solo aplica a servicios de almacenamiento' }, answer: ['A'], explanation: 'El modelo pay-as-you-go cobra únicamente por los recursos efectivamente consumidos, eliminando la necesidad de comprometerse con capacidad fija comprada por adelantado (como ocurría tradicionalmente con hardware on-premises), alineando el costo con el uso real.', domain: 'Cloud con Google Cloud', difficulty: 'easy' },
    ],
  },
  {
    slug: 'azure-developer-az204',
    title: 'Azure Developer Associate (AZ-204)',
    description: 'Examen de práctica alineado a los 5 dominios oficiales de AZ-204: cómputo, storage, seguridad, monitoreo/optimización, e integración de APIs y eventos.',
    domain: 'it', category: 'cloud-azure', level: 'advanced', language: 'es',
    tags: ['azure', 'az-204', 'developer'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en Microsoft AZ-204 Skills Measured Outline (actualizado ene-2026) — learn.microsoft.com/certifications/azure-developer (contenido original)',
    questions: [
      { type: 'multiple', question: '¿Qué servicio de Azure permite ejecutar código en respuesta a eventos (ej. una solicitud HTTP, un mensaje en una cola) sin gestionar servidores, pagando solo por el tiempo de ejecución?', options: { A: 'Azure Functions', B: 'Azure Virtual Machines', C: 'Azure DNS', D: 'Azure ExpressRoute' }, answer: ['A'], explanation: 'Azure Functions es el servicio serverless de Azure para ejecutar código en respuesta a triggers (HTTP, colas, timers), sin gestionar infraestructura y cobrando por consumo real.', domain: 'Develop Azure compute solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué plan de hosting de Azure Functions permite que la función escale a cero (sin costo) cuando no hay tráfico?', options: { A: 'Consumption Plan', B: 'Dedicated (App Service) Plan siempre activo', C: 'Premium Plan exclusivamente', D: 'Isolated Plan' }, answer: ['A'], explanation: 'El Consumption Plan escala automáticamente, incluyendo a cero instancias cuando no hay eventos que procesar, cobrando únicamente por las ejecuciones reales — a diferencia del App Service Plan que mantiene instancias siempre activas.', domain: 'Develop Azure compute solutions', difficulty: 'medium' },
      { type: 'multiple', question: 'Un desarrollador necesita empaquetar una aplicación con todas sus dependencias para que se ejecute de forma consistente en cualquier entorno. ¿Qué tecnología usar antes de desplegar en Azure Container Apps?', options: { A: 'Contenedores Docker', B: 'Máquinas virtuales completas', C: 'Archivos ZIP simples', D: 'Azure DNS Zones' }, answer: ['A'], explanation: 'Los contenedores Docker empaquetan la aplicación junto con sus dependencias en una imagen portátil y consistente, que luego puede desplegarse en servicios como Azure Container Apps, ACI o AKS.', domain: 'Develop Azure compute solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué característica de Azure App Service permite ejecutar tareas en segundo plano de larga duración sin bloquear las solicitudes HTTP entrantes?', options: { A: 'WebJobs', B: 'App Service Plan Free tier', C: 'Deployment slots', D: 'Custom domains' }, answer: ['A'], explanation: 'WebJobs permite ejecutar código en segundo plano (scripts, tareas programadas o disparadas por eventos) dentro del contexto de una App Service, separado del procesamiento de solicitudes HTTP.', domain: 'Develop Azure compute solutions', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué SDK/API se usa típicamente para leer y escribir documentos JSON en Azure Cosmos DB desde una aplicación .NET?', options: { A: 'Azure Cosmos DB SDK, usando el modelo de datos por contenedor/ítem con partition key', B: 'ADO.NET exclusivamente sin ningún SDK específico', C: 'Solo es posible acceder vía FTP', D: 'Se requiere obligatoriamente GraphQL' }, answer: ['A'], explanation: 'El Cosmos DB SDK permite operaciones CRUD sobre documentos dentro de contenedores, requiriendo especificar la partition key para operaciones eficientes de punto (point reads/writes).', domain: 'Develop for Azure storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué nivel de consistencia de Cosmos DB ofrece el mejor equilibrio entre consistencia y rendimiento/disponibilidad para la mayoría de aplicaciones, garantizando que nunca se lean datos "fuera de orden"?', options: { A: 'Strong', B: 'Session', C: 'Eventual', D: 'Bounded Staleness' }, answer: ['B'], explanation: 'El nivel "Session" es el más usado en la práctica: garantiza consistencia dentro de la sesión de un mismo cliente (lecturas de sus propias escrituras) con mejor latencia y disponibilidad que Strong, siendo el balance recomendado por defecto para la mayoría de escenarios.', domain: 'Develop for Azure storage', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué tipo de blob de Azure Storage es más apropiado para archivos que se escriben una vez y se leen muchas veces (ej. imágenes, videos)?', options: { A: 'Block Blob', B: 'Append Blob', C: 'Page Blob', D: 'Table Blob (no existe este tipo)' }, answer: ['A'], explanation: 'Block Blob está optimizado para almacenar archivos discretos como imágenes o documentos, compuestos de bloques que se suben y luego se confirman (commit) como una unidad — el tipo más común de blob.', domain: 'Develop for Azure storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cómo se otorga acceso temporal y con permisos limitados (ej. solo lectura, por 1 hora) a un blob privado en Azure Storage, sin hacer la cuenta pública?', options: { A: 'Generando un Shared Access Signature (SAS) token con permisos y expiración configurados', B: 'Cambiando el nivel de acceso de la cuenta a público', C: 'Compartiendo la connection string completa de la cuenta', D: 'No es posible otorgar acceso temporal en Azure Storage' }, answer: ['A'], explanation: 'Un SAS token otorga acceso delegado y granular (permisos específicos, tiempo de expiración) a recursos de Storage sin compartir las claves de la cuenta completa ni hacer el recurso público.', domain: 'Develop for Azure storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de Azure se usa para almacenar y gestionar de forma centralizada secretos, claves de cifrado y certificados usados por una aplicación?', options: { A: 'Azure Key Vault', B: 'Azure Table Storage', C: 'Azure Queue Storage', D: 'Azure CDN' }, answer: ['A'], explanation: 'Azure Key Vault centraliza el almacenamiento seguro de secretos, claves criptográficas y certificados, evitando que se hardcodeen en el código o configuraciones de la aplicación.', domain: 'Implement Azure security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es una Managed Identity en Azure y qué problema resuelve?', options: { A: 'Una identidad gestionada automáticamente por Azure AD que un recurso (ej. una App Service) puede usar para autenticarse a otros servicios (ej. Key Vault) sin almacenar credenciales en el código', B: 'Un tipo de cuenta de usuario que requiere contraseña manual', C: 'Un servicio exclusivo para gestionar VMs Linux', D: 'Una función de Azure Functions' }, answer: ['A'], explanation: 'Las Managed Identities eliminan la necesidad de almacenar credenciales en el código o configuración: Azure gestiona automáticamente la identidad y las credenciales subyacentes, que el recurso usa para autenticarse a otros servicios de Azure.', domain: 'Implement Azure security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué protocolo/flujo de OAuth 2.0 es recomendado para que una aplicación de servidor a servidor (sin usuario interactivo) obtenga un token de acceso?', options: { A: 'Client Credentials flow', B: 'Authorization Code flow con interacción del navegador', C: 'Implicit flow', D: 'Resource Owner Password Credentials siempre' }, answer: ['A'], explanation: 'El flujo Client Credentials está diseñado para comunicación machine-to-machine (sin usuario final involucrado), donde la aplicación se autentica directamente con su propio client ID/secret para obtener un token.', domain: 'Implement Azure security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué componente de Microsoft Entra ID permite proteger APIs registrando "scopes" que definen los permisos que una aplicación cliente puede solicitar?', options: { A: 'App Registrations, con la definición de "Expose an API" y scopes', B: 'Azure DNS', C: 'Azure Traffic Manager', D: 'Azure Backup' }, answer: ['A'], explanation: 'Al registrar una aplicación en Entra ID, se puede exponer una API definiendo scopes específicos (permisos delegados) que las aplicaciones cliente deben solicitar y que el usuario/administrador debe consentir.', domain: 'Implement Azure security', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué servicio de Azure recolecta telemetría de una aplicación (excepciones, tiempos de respuesta, dependencias) para monitoreo de rendimiento (APM)?', options: { A: 'Application Insights (parte de Azure Monitor)', B: 'Azure Key Vault', C: 'Azure Traffic Manager', D: 'Azure Files' }, answer: ['A'], explanation: 'Application Insights es la herramienta de Application Performance Monitoring (APM) de Azure Monitor, capturando excepciones, tiempos de respuesta, dependencias externas y trazas personalizadas de la aplicación.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué servicio distribuye contenido estático (imágenes, CSS, JS) a ubicaciones edge cercanas a los usuarios, reduciendo la latencia global?', options: { A: 'Azure Content Delivery Network (CDN) o Azure Front Door', B: 'Azure Key Vault', C: 'Azure Service Bus', D: 'Azure Cosmos DB' }, answer: ['A'], explanation: 'Azure CDN (o el más moderno Azure Front Door) cachea y distribuye contenido estático en ubicaciones edge globales cercanas a los usuarios finales, mejorando drásticamente la latencia de carga.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué patrón de caché reduce la carga sobre una base de datos al servir lecturas frecuentes desde memoria, usando Azure Cache for Redis?', options: { A: 'Cache-aside (la aplicación consulta primero el caché; si no está, consulta la BD y guarda el resultado en caché)', B: 'Write-only cache sin lecturas', C: 'No es posible cachear datos de bases de datos en Azure', D: 'Direct database bypass' }, answer: ['A'], explanation: 'El patrón cache-aside es el más común: la aplicación consulta primero el caché; si hay un "miss", consulta la base de datos y almacena el resultado en caché para futuras lecturas, reduciendo la carga sobre la BD.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de Azure gestiona, publica y protege APIs (rate limiting, autenticación, versionado) como una capa unificada frente a los backends?', options: { A: 'Azure API Management', B: 'Azure Cosmos DB', C: 'Azure Backup', D: 'Azure Site Recovery' }, answer: ['A'], explanation: 'API Management actúa como gateway unificado frente a uno o más backends, gestionando autenticación, rate limiting, transformación de solicitudes, versionado y documentación de APIs.', domain: 'Integrate APIs and event-based solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la diferencia principal entre Azure Service Bus y Azure Event Grid?', options: { A: 'Son exactamente lo mismo', B: 'Service Bus es un broker de mensajería (colas/topics) para comunicación confiable entre aplicaciones; Event Grid es un servicio de enrutamiento de eventos reactivo, diseñado para notificar sobre cambios de estado a múltiples suscriptores', C: 'Event Grid solo funciona con máquinas virtuales', D: 'Service Bus no soporta ningún tipo de suscripción' }, answer: ['B'], explanation: 'Service Bus está diseñado para mensajería empresarial confiable (colas point-to-point, topics pub/sub) entre aplicaciones; Event Grid está optimizado para distribuir eventos discretos (ej. "se subió un blob") a múltiples suscriptores de forma reactiva y de baja latencia.', domain: 'Integrate APIs and event-based solutions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué servicio de Azure permite orquestar un flujo de trabajo de larga duración con múltiples pasos, reintentos y estado persistente, sin gestionar infraestructura?', options: { A: 'Durable Functions (extensión de Azure Functions)', B: 'Azure DNS', C: 'Azure Bastion', D: 'Azure Advisor' }, answer: ['A'], explanation: 'Durable Functions extiende Azure Functions para orquestar flujos de trabajo con estado (function chaining, fan-out/fan-in, patrones de aprobación humana), manejando automáticamente checkpoints y reintentos.', domain: 'Integrate APIs and event-based solutions', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué componente de Azure Event Hubs permite que múltiples aplicaciones consuman el mismo stream de eventos de forma independiente, cada una a su propio ritmo?', options: { A: 'Consumer Groups', B: 'Partition keys únicamente', C: 'Shared Access Policies', D: 'Event Grid Topics' }, answer: ['A'], explanation: 'Los Consumer Groups en Event Hubs permiten que múltiples aplicaciones consuman el mismo stream de eventos de forma independiente, cada una manteniendo su propio offset/posición de lectura, sin interferir entre sí.', domain: 'Integrate APIs and event-based solutions', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué es Azure Container Apps y en qué se diferencia de Azure Container Instances (ACI)?', options: { A: 'Container Apps es una plataforma serverless orientada a microservicios con escalado automático (incluso a cero) y balanceo de tráfico basado en Kubernetes gestionado internamente; ACI ejecuta contenedores individuales de forma más simple, sin las capacidades avanzadas de orquestación de microservicios', B: 'Son exactamente el mismo servicio con distinto nombre', C: 'ACI siempre es más avanzado que Container Apps', D: 'Container Apps no soporta escalado automático' }, answer: ['A'], explanation: 'Azure Container Apps añade capacidades de nivel de microservicios (escalado basado en eventos/HTTP, revisiones, Dapr integrado) sobre una base de Kubernetes gestionada internamente, mientras ACI ofrece una forma más simple de ejecutar contenedores individuales sin esas capacidades avanzadas.', domain: 'Develop Azure compute solutions', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué SDK/paquete se usa típicamente para interactuar programáticamente con Azure Blob Storage desde una aplicación .NET?', options: { A: 'Azure.Storage.Blobs SDK', B: 'Entity Framework exclusivamente', C: 'ASP.NET Identity', D: 'Newtonsoft.Json exclusivamente' }, answer: ['A'], explanation: 'El SDK `Azure.Storage.Blobs` provee las clases necesarias (BlobServiceClient, BlobContainerClient, BlobClient) para subir, descargar y gestionar blobs programáticamente desde una aplicación .NET.', domain: 'Develop for Azure storage', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "partition key" en Cosmos DB y por qué su elección es una decisión de diseño crítica?', options: { A: 'La propiedad que determina cómo se distribuyen lógica y físicamente los datos entre particiones; una mala elección puede generar "hot partitions" que limitan el throughput y aumentan la latencia', B: 'Un campo opcional sin ningún impacto en el rendimiento', C: 'Un sinónimo de índice secundario', D: 'Una configuración que solo afecta el costo, nunca el rendimiento' }, answer: ['A'], explanation: 'La partition key determina cómo Cosmos DB distribuye los datos entre particiones físicas; elegir una key con baja cardinalidad o acceso muy concentrado genera "hot partitions" que limitan el throughput disponible y degradan el rendimiento, por lo que es una decisión de diseño crítica desde el inicio.', domain: 'Develop for Azure storage', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué es Azure Active Directory B2C (Azure AD B2C), y para qué se usa comúnmente?', options: { A: 'Un servicio de gestión de identidades diseñado para aplicaciones orientadas al consumidor (customer-facing), permitiendo a los usuarios finales registrarse e iniciar sesión con distintos proveedores de identidad (redes sociales, email/contraseña)', B: 'Un servicio exclusivo para empleados internos de una organización', C: 'Un sinónimo de Managed Identity', D: 'Un servicio de almacenamiento de blobs' }, answer: ['A'], explanation: 'Azure AD B2C está diseñado específicamente para gestionar identidades de usuarios externos/consumidores de una aplicación (no empleados internos), permitiendo registro/login con múltiples proveedores de identidad (Google, Facebook, email/contraseña).', domain: 'Implement Azure security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es el "throttling" (limitación de solicitudes) en servicios como Cosmos DB o App Service, y cómo debe manejarlo una aplicación bien diseñada?', options: { A: 'Es una respuesta del servicio (ej. HTTP 429) indicando que se excedió la capacidad/cuota asignada; la aplicación debe implementar reintentos con exponential backoff en vez de fallar inmediatamente', B: 'Un error permanente que nunca se puede resolver', C: 'Una función que solo existe en servicios de red', D: 'Un problema que solo ocurre en aplicaciones sin usuarios' }, answer: ['A'], explanation: 'El throttling (respuesta 429 "Too Many Requests") indica que se excedió la capacidad asignada (RU/s en Cosmos DB, límites de plan en App Service); una aplicación robusta debe implementar reintentos con exponential backoff en vez de fallar inmediatamente ante esta respuesta.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "deployment slot" en Azure App Service, y qué beneficio aporta al desplegar una nueva versión?', options: { A: 'Un entorno de staging separado dentro del mismo App Service, que permite validar una nueva versión antes de intercambiarla ("swap") con producción, minimizando downtime y riesgo', B: 'Un tipo de base de datos exclusiva', C: 'Un sinónimo de Resource Group', D: 'Una configuración que solo afecta el almacenamiento' }, answer: ['A'], explanation: 'Los deployment slots permiten tener múltiples entornos (ej. staging, producción) dentro del mismo App Service, validando una nueva versión en staging antes de hacer un "swap" hacia producción, minimizando downtime y facilitando rollback rápido si algo falla.', domain: 'Develop Azure compute solutions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es Azure Event Grid Schema (o CloudEvents) en el contexto de eventos publicados?', options: { A: 'El formato estandarizado en que se estructuran los eventos publicados (origen, tipo, datos, timestamp), permitiendo que distintos suscriptores interpreten los eventos de forma consistente', B: 'Un tipo de base de datos', C: 'Un sinónimo de Consumer Group', D: 'Un servicio de almacenamiento de blobs' }, answer: ['A'], explanation: 'Event Grid estructura los eventos en un esquema estandarizado (propio o compatible con CloudEvents, un estándar abierto), incluyendo metadatos como origen, tipo de evento, datos y timestamp, facilitando la interoperabilidad entre publicadores y suscriptores.', domain: 'Integrate APIs and event-based solutions', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué mecanismo de autenticación es más apropiado para que una Azure Function acceda a Azure Key Vault sin almacenar ninguna credencial en su configuración?', options: { A: 'Managed Identity', B: 'Una connection string hardcodeada en el código', C: 'Basic Authentication con usuario/contraseña', D: 'Ninguna autenticación es necesaria' }, answer: ['A'], explanation: 'Usar una Managed Identity asignada a la Azure Function permite que se autentique a Key Vault (y otros servicios de Azure) sin almacenar ninguna credencial explícita, ya que Azure gestiona automáticamente las credenciales subyacentes.', domain: 'Implement Azure security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué código de estado HTTP debe devolver una Azure Function activada por HTTP cuando la solicitud del cliente tiene datos inválidos?', options: { A: '400 Bad Request', B: '500 Internal Server Error', C: '200 OK', D: '404 Not Found' }, answer: ['A'], explanation: '400 Bad Request indica que el error es responsabilidad del cliente (datos de entrada inválidos o mal formados), distinto de un 500 (error interno del servidor) que indicaría un fallo en el código de la función misma.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es "Application Insights Live Metrics Stream" y para qué se usa?', options: { A: 'Una vista en tiempo real (con latencia de segundos) del rendimiento y las solicitudes actuales de una aplicación en producción, útil para monitorear el impacto inmediato de un despliegue reciente', B: 'Un reporte histórico generado una vez al mes', C: 'Un sinónimo de Azure Monitor Alerts', D: 'Una función exclusiva para aplicaciones móviles' }, answer: ['A'], explanation: 'Live Metrics Stream muestra datos de rendimiento y solicitudes casi en tiempo real (segundos de latencia), siendo especialmente útil para observar el impacto inmediato de un despliegue reciente sin esperar la agregación estándar de métricas.', domain: 'Monitor, troubleshoot, and optimize solutions', difficulty: 'medium' },
    ],
  },
  {
    slug: 'comptia-network-plus',
    title: 'CompTIA Network+ (N10-009)',
    description: 'Examen de práctica alineado a los 5 dominios oficiales de CompTIA Network+ N10-009: fundamentos de redes, implementación, operaciones, seguridad y troubleshooting.',
    domain: 'it', category: 'networking', level: 'intermediate', language: 'es',
    tags: ['comptia', 'network', 'redes', 'n10-009'], passPercent: 72, timeMinutes: 22,
    source: 'Basado en CompTIA Network+ N10-009 (V9) Exam Objectives, vigente desde jun-2024 — certmaster.comptia.org (contenido original)',
    questions: [
      { type: 'multiple', question: '¿En qué capa del modelo OSI opera un switch tradicional, tomando decisiones de reenvío basadas en direcciones MAC?', options: { A: 'Capa 1 (Física)', B: 'Capa 2 (Enlace de datos)', C: 'Capa 3 (Red)', D: 'Capa 7 (Aplicación)' }, answer: ['B'], explanation: 'Un switch tradicional opera en la Capa 2 (Enlace de datos), reenviando tramas basándose en las direcciones MAC de origen y destino aprendidas en su tabla de direcciones.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué protocolo de la capa de transporte garantiza entrega confiable y ordenada de datos mediante confirmaciones y retransmisión?', options: { A: 'UDP', B: 'TCP', C: 'ICMP', D: 'ARP' }, answer: ['B'], explanation: 'TCP (Transmission Control Protocol) establece una conexión, confirma la recepción de segmentos y retransmite los perdidos, garantizando entrega confiable y ordenada — a diferencia de UDP, que no garantiza ninguna de estas cosas.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es la máscara de subred por defecto para una red de clase C (ej. 192.168.1.0)?', options: { A: '255.0.0.0', B: '255.255.0.0', C: '255.255.255.0', D: '255.255.255.255' }, answer: ['C'], explanation: 'Una red de clase C usa por defecto una máscara /24 (255.255.255.0), permitiendo 254 hosts utilizables en la subred.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué tipo de dirección IP se usa para comunicación uno-a-muchos dentro de un mismo segmento de red, alcanzando a todos los dispositivos?', options: { A: 'Unicast', B: 'Broadcast', C: 'Multicast', D: 'Anycast' }, answer: ['B'], explanation: 'Una dirección broadcast (ej. 192.168.1.255 en una red /24) envía tráfico a todos los dispositivos del segmento de red simultáneamente, a diferencia de unicast (uno-a-uno) o multicast (uno-a-un grupo específico).', domain: 'Networking Fundamentals', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué protocolo de la capa de aplicación resuelve nombres de dominio (ej. www.ejemplo.com) a direcciones IP?', options: { A: 'DHCP', B: 'DNS', C: 'SNMP', D: 'FTP' }, answer: ['B'], explanation: 'DNS (Domain Name System) traduce nombres de dominio legibles por humanos a direcciones IP que las computadoras usan para enrutar tráfico.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué categoría de cable UTP es la mínima recomendada actualmente para soportar velocidades Gigabit Ethernet (1000BASE-T) de forma confiable en distancias estándar?', options: { A: 'Cat 5', B: 'Cat 5e', C: 'Cat 3', D: 'Coaxial RG-6' }, answer: ['B'], explanation: 'Cat 5e (enhanced) mejora el rendimiento sobre Cat 5 y es el mínimo recomendado para soportar de forma confiable Gigabit Ethernet en distancias de hasta 100 metros.', domain: 'Network Implementations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué dispositivo de red divide una red en múltiples dominios de broadcast, operando en la Capa 3?', options: { A: 'Hub', B: 'Switch de Capa 2 no gestionado', C: 'Router (o switch de Capa 3)', D: 'Repetidor' }, answer: ['C'], explanation: 'Un router (o un switch de Capa 3) enruta tráfico entre distintas redes/subredes, creando dominios de broadcast separados — un switch de Capa 2 y un hub no segmentan dominios de broadcast.', domain: 'Network Implementations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tecnología permite que múltiples VLANs compartan un mismo enlace físico entre switches, etiquetando las tramas con su VLAN correspondiente?', options: { A: 'VLAN Trunking (802.1Q)', B: 'Spanning Tree Protocol', C: 'Link Aggregation', D: 'Port Mirroring' }, answer: ['A'], explanation: 'El trunking con el estándar 802.1Q etiqueta las tramas Ethernet con un VLAN ID, permitiendo que el tráfico de múltiples VLANs viaje sobre un mismo enlace físico (trunk) entre switches.', domain: 'Network Implementations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué protocolo previene loops de Capa 2 en una red con enlaces redundantes entre switches, bloqueando puertos duplicados?', options: { A: 'Spanning Tree Protocol (STP)', B: 'DHCP', C: 'NAT', D: 'BGP' }, answer: ['A'], explanation: 'STP detecta y previene loops de Capa 2 en topologías con enlaces redundantes, bloqueando lógicamente los puertos que crearían un loop mientras mantiene la redundancia disponible como respaldo.', domain: 'Network Implementations', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué frecuencia de Wi-Fi ofrece generalmente mayor alcance pero menor velocidad máxima, siendo más susceptible a interferencia de dispositivos domésticos?', options: { A: '2.4 GHz', B: '5 GHz', C: '6 GHz', D: 'Ambas frecuencias tienen exactamente el mismo comportamiento' }, answer: ['A'], explanation: 'La banda de 2.4 GHz tiene mayor alcance y mejor penetración de obstáculos, pero menor ancho de banda disponible y más interferencia (microondas, Bluetooth) comparada con 5 GHz o 6 GHz.', domain: 'Network Implementations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué herramienta/protocolo de gestión permite monitorear remotamente el estado de dispositivos de red (routers, switches) recolectando métricas como uso de CPU y ancho de banda?', options: { A: 'SNMP (Simple Network Management Protocol)', B: 'FTP', C: 'Telnet', D: 'ARP' }, answer: ['A'], explanation: 'SNMP permite a sistemas de gestión centralizados consultar y recibir alertas (traps) de dispositivos de red sobre su estado operativo, como uso de CPU, memoria y tráfico de interfaces.', domain: 'Network Operations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué documento de red describe la topología física y lógica completa, incluyendo ubicación de dispositivos, direccionamiento IP y VLANs?', options: { A: 'Network diagram / documentación de topología', B: 'Un contrato de nivel de servicio (SLA)', C: 'Una política de contraseñas', D: 'Un log de auditoría' }, answer: ['A'], explanation: 'La documentación de topología de red (diagramas físicos y lógicos) es esencial para operaciones y troubleshooting, mostrando cómo están conectados los dispositivos y cómo está organizado el direccionamiento.', domain: 'Network Operations', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué práctica de operaciones de red reduce el riesgo al aplicar cambios de configuración en producción, permitiendo revertir si algo falla?', options: { A: 'Aplicar cambios directamente en producción sin plan de rollback', B: 'Seguir un proceso formal de change management, con backup de configuración previo y plan de rollback documentado', C: 'Nunca documentar los cambios realizados', D: 'Aplicar cambios solo los viernes por la tarde sin aviso' }, answer: ['B'], explanation: 'El change management formal (aprobación, backup de configuración previo, ventana de mantenimiento, plan de rollback) reduce el riesgo de interrupciones al aplicar cambios en infraestructura de red de producción.', domain: 'Network Operations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tipo de ataque de red implica que un atacante se hace pasar por un dispositivo legítimo respondiendo falsamente a solicitudes ARP, para interceptar tráfico?', options: { A: 'ARP Spoofing / ARP Poisoning', B: 'DDoS volumétrico', C: 'Phishing', D: 'SQL Injection' }, answer: ['A'], explanation: 'ARP Spoofing envía respuestas ARP falsas asociando la dirección MAC del atacante con la IP de un dispositivo legítimo (ej. el gateway), permitiendo interceptar o alterar el tráfico de la víctima (ataque Man-in-the-Middle).', domain: 'Network Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué dispositivo de seguridad de red filtra tráfico entre segmentos de red según reglas basadas en puertos, protocolos e IPs?', options: { A: 'Firewall', B: 'Access Point', C: 'Repetidor', D: 'Hub' }, answer: ['A'], explanation: 'Un firewall inspecciona y filtra el tráfico de red según reglas configuradas (IP origen/destino, puertos, protocolos), siendo el control perimetral básico de seguridad de red.', domain: 'Network Security', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué protocolo de autenticación de red centraliza el control de acceso a la red (ej. Wi-Fi empresarial) usando un servidor RADIUS, verificando credenciales antes de otorgar acceso?', options: { A: 'IEEE 802.1X', B: 'DHCP', C: 'ICMP', D: 'NAT' }, answer: ['A'], explanation: '802.1X es el estándar de control de acceso a la red basado en puertos, típicamente usado con un servidor RADIUS para autenticar dispositivos/usuarios antes de otorgarles acceso a la red (cableada o Wi-Fi).', domain: 'Network Security', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué es una VLAN de "cuarentena" (quarantine VLAN) en el contexto de segmentación de seguridad de red?', options: { A: 'Una VLAN para dispositivos con máximo privilegio', B: 'Una VLAN aislada donde se coloca temporalmente a dispositivos que no cumplen las políticas de seguridad, con acceso restringido hasta ser remediados', C: 'Una VLAN exclusiva para tráfico de voz', D: 'Un tipo de dirección IP, no de VLAN' }, answer: ['B'], explanation: 'Una VLAN de cuarentena aísla dispositivos que fallan chequeos de cumplimiento (ej. antivirus desactualizado), limitando su acceso a la red hasta que se remedien, como parte de una estrategia de Network Access Control.', domain: 'Network Security', difficulty: 'medium' },
      { type: 'multiple', question: 'Un usuario reporta que no puede acceder a internet. Al revisar, su equipo tiene una IP 169.254.x.x. ¿Qué indica esto y cuál es la causa más probable?', options: { A: 'Es una IP APIPA (Automatic Private IP Addressing), indicando que el dispositivo no pudo obtener una IP de un servidor DHCP', B: 'Es una configuración normal y no indica ningún problema', C: 'Es una IP pública asignada correctamente', D: 'Indica que el firewall está bloqueando todo el tráfico' }, answer: ['A'], explanation: 'Una dirección 169.254.x.x es autoasignada (APIPA) cuando el dispositivo no logra contactar un servidor DHCP, indicando un problema de conectividad al servidor DHCP o al segmento de red correspondiente.', domain: 'Network Troubleshooting', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué comando de línea de comandos se usa para verificar la conectividad básica (capa 3) a un host remoto, midiendo latencia mediante paquetes ICMP?', options: { A: 'ping', B: 'ipconfig/ifconfig', C: 'netstat', D: 'nslookup' }, answer: ['A'], explanation: '"ping" envía paquetes ICMP Echo Request al host destino y mide el tiempo de respuesta (o si no hay respuesta), siendo la herramienta básica de troubleshooting de conectividad de Capa 3.', domain: 'Network Troubleshooting', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué herramienta muestra la ruta (saltos/hops) que siguen los paquetes hacia un destino, útil para identificar en qué punto de la red ocurre un problema de latencia o pérdida de paquetes?', options: { A: 'traceroute / tracert', B: 'ping únicamente', C: 'ipconfig', D: 'arp -a' }, answer: ['A'], explanation: 'traceroute (tracert en Windows) muestra cada salto (router) por el que pasan los paquetes hacia el destino, permitiendo identificar en qué punto específico de la ruta ocurre latencia alta o pérdida de paquetes.', domain: 'Network Troubleshooting', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la función principal de un router en una red, en contraste con un switch?', options: { A: 'Enrutar (reenviar) tráfico ENTRE redes distintas (Capa 3), basándose en direcciones IP; un switch reenvía tráfico DENTRO de la misma red (Capa 2), basándose en direcciones MAC', B: 'Son exactamente lo mismo, solo cambia el nombre', C: 'El router solo funciona con cables de fibra óptica', D: 'El switch siempre reemplaza la necesidad de un router' }, answer: ['A'], explanation: 'Un router opera en la Capa 3, dirigiendo tráfico entre redes/subredes distintas basándose en direcciones IP; un switch opera en la Capa 2, reenviando tráfico dentro del mismo segmento de red basándose en direcciones MAC.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué protocolo de la capa de aplicación asigna automáticamente direcciones IP a los dispositivos que se conectan a una red?', options: { A: 'DHCP (Dynamic Host Configuration Protocol)', B: 'DNS', C: 'SMTP', D: 'HTTP' }, answer: ['A'], explanation: 'DHCP asigna automáticamente direcciones IP (y otra configuración de red como gateway y DNS) a los dispositivos que se conectan, evitando la necesidad de configuración manual de IP en cada equipo.', domain: 'Networking Fundamentals', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un "default gateway" en la configuración de red de un dispositivo?', options: { A: 'La dirección IP del router al que el dispositivo envía el tráfico destinado a redes fuera de su propia subred local', B: 'Un sinónimo de dirección MAC', C: 'La dirección IP del propio dispositivo', D: 'Un servidor DNS exclusivamente' }, answer: ['A'], explanation: 'El default gateway es la dirección IP del router al que un dispositivo envía el tráfico destinado a cualquier red fuera de su propia subred local, siendo la "puerta de salida" hacia otras redes (incluyendo internet).', domain: 'Networking Fundamentals', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué tipo de cable de red usa señales de luz en lugar de señales eléctricas, permitiendo mayores distancias y velocidades sin interferencia electromagnética?', options: { A: 'Fibra óptica', B: 'Cable coaxial', C: 'Cable UTP Cat 5e', D: 'Cable telefónico RJ-11' }, answer: ['A'], explanation: 'La fibra óptica transmite datos mediante pulsos de luz en lugar de señales eléctricas, permitiendo distancias mucho mayores y velocidades más altas sin sufrir interferencia electromagnética, a diferencia del cableado de cobre.', domain: 'Network Implementations', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué protocolo de seguridad Wi-Fi es actualmente el estándar recomendado, reemplazando a WPA2 por ofrecer mejoras criptográficas?', options: { A: 'WPA3', B: 'WEP', C: 'WPA original (sin número)', D: 'Ningún protocolo de seguridad Wi-Fi es necesario' }, answer: ['A'], explanation: 'WPA3 es el estándar de seguridad Wi-Fi más reciente y recomendado, ofreciendo mejoras criptográficas (como forward secrecy y protección contra ataques de diccionario offline) frente a WPA2; WEP está completamente obsoleto y es criptográficamente inseguro.', domain: 'Network Security', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es una "subnet mask" (máscara de subred) y qué función cumple junto a una dirección IP?', options: { A: 'Define qué porción de una dirección IP corresponde a la red y cuál al host, determinando el tamaño de la subred', B: 'Un sinónimo de dirección MAC', C: 'Un servidor DNS', D: 'Una función exclusiva de IPv6, sin uso en IPv4' }, answer: ['A'], explanation: 'La máscara de subred (ej. 255.255.255.0) determina, junto a la dirección IP, qué parte identifica la red y qué parte identifica el host específico dentro de esa red, definiendo el tamaño y límites de la subred.', domain: 'Networking Fundamentals', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué documento de operaciones de red describe los pasos a seguir ante una falla específica y recurrente (ej. "el switch principal deja de responder")?', options: { A: 'Un runbook / procedimiento operativo estándar (SOP)', B: 'Un contrato de nivel de servicio (SLA) exclusivamente', C: 'Un diagrama de topología física únicamente', D: 'Una política de contraseñas' }, answer: ['A'], explanation: 'Un runbook o procedimiento operativo estándar (SOP) documenta los pasos específicos a seguir ante un escenario de falla conocido y recurrente, acelerando la respuesta y estandarizando el proceso entre distintos técnicos.', domain: 'Network Operations', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué comando de red muestra la tabla de direcciones MAC conocidas asociadas a direcciones IP en la caché local de un dispositivo?', options: { A: 'arp -a', B: 'ping', C: 'ipconfig /release', D: 'nslookup' }, answer: ['A'], explanation: '`arp -a` muestra la tabla ARP (Address Resolution Protocol) local, que mapea direcciones IP conocidas a sus direcciones MAC correspondientes en el mismo segmento de red.', domain: 'Network Troubleshooting', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué es un "SDN" (Software-Defined Networking) y qué ventaja aporta frente a la gestión tradicional de redes basada en hardware configurado individualmente?', options: { A: 'Un enfoque que separa el plano de control de la infraestructura de red física, permitiendo gestionar y programar la red de forma centralizada mediante software, en vez de configurar cada dispositivo individualmente', B: 'Un sinónimo de VPN', C: 'Un tipo de cable de red físico', D: 'Un protocolo exclusivo de seguridad' }, answer: ['A'], explanation: 'SDN centraliza el plano de control de la red en software, permitiendo gestionar y programar el comportamiento de la red de forma centralizada y automatizada, en contraste con la configuración manual dispositivo por dispositivo del enfoque tradicional — una tendencia reforzada en la actualización N10-009 del examen.', domain: 'Network Implementations', difficulty: 'hard' },
    ],
  },
  {
    slug: 'rest-api-design',
    title: 'REST API Design — Mejores Prácticas',
    description: 'Examen de práctica sobre diseño de APIs RESTful: recursos, verbos HTTP, versionado, paginación, autenticación e idempotencia.',
    domain: 'it', category: 'api-design', level: 'intermediate', language: 'es',
    tags: ['api', 'rest', 'http'], passPercent: 70, timeMinutes: 22,
    source: 'Basado en RFC 7231 (HTTP Semantics) + OpenAPI Specification 3.1 + prácticas ampliamente adoptadas en la industria (contenido original, sin certificación oficial única)',
    questions: [
      { type: 'multiple', question: 'Según las convenciones REST, ¿cuál es la forma correcta de nombrar un endpoint para obtener la lista de usuarios?', options: { A: 'GET /getUsers', B: 'GET /users', C: 'POST /users/list', D: 'GET /user_list_action' }, answer: ['B'], explanation: 'Las URLs REST deben nombrar recursos (sustantivos, en plural) en vez de acciones/verbos: "GET /users" sigue la convención correcta, dejando que el verbo HTTP (GET) exprese la acción.', domain: 'Principios REST', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué verbo HTTP se usa convencionalmente para crear un nuevo recurso?', options: { A: 'GET', B: 'POST', C: 'DELETE', D: 'HEAD' }, answer: ['B'], explanation: 'POST se usa convencionalmente para crear un nuevo recurso dentro de una colección (ej. POST /users crea un nuevo usuario), devolviendo típicamente un 201 Created con el recurso creado.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué código de estado HTTP se debe devolver cuando una solicitud es válida pero el usuario autenticado no tiene permisos para realizar la acción?', options: { A: '401 Unauthorized', B: '403 Forbidden', C: '404 Not Found', D: '400 Bad Request' }, answer: ['B'], explanation: '403 Forbidden indica que el servidor entendió la solicitud y el usuario está autenticado, pero no tiene permisos suficientes; 401 Unauthorized se usa cuando falta autenticación válida.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es la diferencia semántica entre PUT y PATCH al actualizar un recurso?', options: { A: 'Son exactamente lo mismo', B: 'PUT reemplaza el recurso completo con la representación enviada; PATCH aplica una modificación parcial, actualizando solo los campos especificados', C: 'PATCH solo funciona con archivos binarios', D: 'PUT nunca puede crear un recurso, solo PATCH puede' }, answer: ['B'], explanation: 'PUT es idempotente y reemplaza el recurso completo con el cuerpo enviado; PATCH aplica cambios parciales, modificando únicamente los campos incluidos en la solicitud.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué código de estado indica que un recurso fue eliminado exitosamente y no hay contenido adicional que devolver?', options: { A: '200 OK con cuerpo vacío únicamente', B: '204 No Content', C: '202 Accepted', D: '410 Gone en todos los casos' }, answer: ['B'], explanation: '204 No Content es la respuesta estándar tras una eliminación (DELETE) exitosa cuando no hay contenido que devolver en el cuerpo de la respuesta.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuál es una convención de naming recomendada para representar una relación jerárquica, como los pedidos de un usuario específico?', options: { A: '/getUserOrders?id=123', B: '/users/123/orders', C: '/orders_by_user_123', D: '/api?action=getOrders&user=123' }, answer: ['B'], explanation: 'La convención REST anida recursos relacionados jerárquicamente en la URL: "/users/123/orders" expresa claramente "los pedidos del usuario 123", siguiendo la estructura de recursos y subrecursos.', domain: 'Naming conventions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Cuál es una estrategia común y recomendada para versionar una API REST de forma explícita y visible para el consumidor?', options: { A: 'Incluir la versión en la URL (ej. /v1/users) o en un header personalizado (ej. Accept-Version)', B: 'Nunca versionar la API y esperar que los clientes se adapten a cualquier cambio', C: 'Cambiar el dominio completo cada vez que hay un cambio menor', D: 'Usar solo el código de estado HTTP para indicar la versión' }, answer: ['A'], explanation: 'Versionar en la URL (/v1/, /v2/) o mediante un header es una práctica estándar que permite evolucionar la API sin romper a los clientes existentes que dependen de una versión anterior.', domain: 'Versionado de APIs', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué es importante versionar una API antes de introducir un cambio incompatible (breaking change), como renombrar un campo de la respuesta?', options: { A: 'No es importante, los clientes siempre se adaptan automáticamente', B: 'Porque los clientes existentes dependen del contrato actual; un cambio incompatible sin nueva versión rompería sus integraciones sin previo aviso', C: 'Solo es relevante para APIs internas, nunca para públicas', D: 'El versionado solo afecta la documentación, no el comportamiento real' }, answer: ['B'], explanation: 'Los consumidores de una API dependen de su contrato (estructura de datos, comportamiento); introducir cambios incompatibles sin una nueva versión rompe integraciones existentes sin darles oportunidad de migrar de forma controlada.', domain: 'Versionado de APIs', difficulty: 'medium' },
      { type: 'multiple', question: 'Una API devuelve miles de registros en un solo endpoint sin ningún control, causando timeouts. ¿Qué técnica se debe implementar?', options: { A: 'Paginación, limitando el número de resultados por página con parámetros como "limit" y "offset" (o cursor-based pagination)', B: 'Eliminar el endpoint por completo', C: 'Aumentar indefinidamente el timeout del servidor', D: 'Convertir el endpoint a un solo campo de texto' }, answer: ['A'], explanation: 'La paginación (offset/limit o cursor-based) limita la cantidad de datos devueltos por solicitud, evitando timeouts y sobrecarga tanto en el servidor como en el cliente al consultar grandes colecciones.', domain: 'Paginación, filtrado y ordenamiento', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué ventaja tiene la paginación basada en cursor (cursor-based) frente a la paginación por offset (offset/limit) en colecciones que cambian frecuentemente?', options: { A: 'No hay ninguna diferencia práctica entre ambas', B: 'La paginación por cursor evita problemas de registros duplicados u omitidos cuando se insertan/eliminan ítems entre solicitudes de página, algo que sí puede ocurrir con offset', C: 'La paginación por cursor siempre es más lenta', D: 'Offset siempre es más preciso que cursor' }, answer: ['B'], explanation: 'Con offset/limit, si se insertan o eliminan registros entre solicitudes, los resultados pueden desplazarse causando duplicados u omisiones; cursor-based pagination usa un puntero estable (ej. el ID del último ítem visto), evitando ese problema.', domain: 'Paginación, filtrado y ordenamiento', difficulty: 'hard' },
      { type: 'multiple', question: '¿Cuál es una forma convencional de permitir que un cliente filtre resultados por un campo específico en un endpoint REST?', options: { A: 'GET /orders?status=pending', B: 'POST /orders/filter-by-status-pending', C: 'GET /orders_pending_only', D: 'DELETE /orders?status=pending' }, answer: ['A'], explanation: 'Usar query parameters (ej. ?status=pending) sobre una solicitud GET es la convención estándar para filtrar colecciones de recursos en una API REST.', domain: 'Paginación, filtrado y ordenamiento', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué estándar de autorización es ampliamente usado para que una aplicación de terceros acceda a recursos de un usuario sin conocer su contraseña?', options: { A: 'OAuth 2.0', B: 'Basic Authentication exclusivamente', C: 'FTP', D: 'SMTP' }, answer: ['A'], explanation: 'OAuth 2.0 permite que una aplicación de terceros obtenga acceso delegado y limitado a recursos de un usuario mediante tokens, sin que la aplicación conozca ni maneje la contraseña del usuario.', domain: 'Autenticación (OAuth 2.0, JWT)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es un JWT (JSON Web Token) y qué ventaja ofrece para autenticación en APIs REST sin estado (stateless)?', options: { A: 'Un token autocontenido y firmado que incluye claims (información del usuario/permisos), permitiendo al servidor validar la identidad sin consultar una base de datos de sesiones en cada solicitud', B: 'Un tipo de base de datos NoSQL', C: 'Un protocolo de transporte que reemplaza a HTTP', D: 'Un formato exclusivo para archivos de configuración' }, answer: ['A'], explanation: 'Un JWT contiene claims firmados digitalmente (o cifrados) que el servidor puede verificar criptográficamente sin necesitar una consulta a base de datos por solicitud, habilitando autenticación stateless escalable.', domain: 'Autenticación (OAuth 2.0, JWT)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Dónde se recomienda enviar un token de acceso (Bearer token) en una solicitud HTTP a una API REST?', options: { A: 'En el header Authorization: Bearer <token>', B: 'Siempre en la URL como query parameter visible', C: 'En una cookie no segura sin flags HttpOnly/Secure', D: 'En el body de una solicitud GET' }, answer: ['A'], explanation: 'El header "Authorization: Bearer <token>" es la convención estándar para enviar tokens de acceso; colocarlo en la URL expone el token en logs de servidor, historial del navegador y proxies intermedios.', domain: 'Autenticación (OAuth 2.0, JWT)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué documento/formato estándar permite describir de forma máquina-legible los endpoints, parámetros y respuestas de una API REST?', options: { A: 'OpenAPI Specification (antes Swagger)', B: 'Un archivo .txt sin estructura', C: 'Un README genérico sin formato definido', D: 'Un diagrama UML de clases' }, answer: ['A'], explanation: 'OpenAPI Specification (OAS) es el estándar de la industria para describir APIs REST de forma máquina-legible, permitiendo generar documentación interactiva, clientes SDK y validación automática.', domain: 'Documentación (OpenAPI/Swagger)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Por qué es valiosa la documentación interactiva generada a partir de una especificación OpenAPI (ej. Swagger UI)?', options: { A: 'No aporta ningún valor real sobre documentación estática en PDF', B: 'Permite a los consumidores de la API probar endpoints directamente desde el navegador, ver ejemplos de solicitud/respuesta y mantenerse sincronizada automáticamente con el código si se genera desde anotaciones', C: 'Reemplaza por completo la necesidad de pruebas automatizadas', D: 'Solo es útil para APIs internas, nunca públicas' }, answer: ['B'], explanation: 'La documentación interactiva generada desde OpenAPI permite probar la API directamente, reduce el desfase entre código y documentación (si se genera automáticamente), y mejora significativamente la experiencia de los consumidores de la API.', domain: 'Documentación (OpenAPI/Swagger)', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué significa que una operación HTTP sea "idempotente"?', options: { A: 'Que siempre devuelve el mismo código de estado sin importar el resultado', B: 'Que ejecutar la misma solicitud múltiples veces produce el mismo efecto/resultado final que ejecutarla una sola vez', C: 'Que la operación solo puede ejecutarse una vez en la vida del recurso', D: 'Que la operación nunca modifica ningún dato' }, answer: ['B'], explanation: 'La idempotencia significa que repetir la misma solicitud varias veces produce el mismo estado final del recurso que ejecutarla una única vez — crítico para diseñar reintentos seguros ante fallos de red.', domain: 'Idempotencia', difficulty: 'medium' },
      { type: 'multiple', question: '¿Cuáles de los siguientes verbos HTTP son idempotentes según su definición estándar?', options: { A: 'GET, PUT y DELETE', B: 'Solo POST', C: 'Ninguno de los verbos HTTP es idempotente', D: 'Solo PATCH' }, answer: ['A'], explanation: 'GET, PUT y DELETE están definidos como idempotentes: ejecutarlos repetidamente produce el mismo resultado (leer el mismo recurso, reemplazarlo con el mismo valor, o dejarlo eliminado). POST no es idempotente por definición, ya que típicamente crea un nuevo recurso en cada llamada.', domain: 'Idempotencia', difficulty: 'medium' },
      { type: 'multiple', question: 'Un cliente envía una solicitud POST para crear un pago, pero la conexión se corta antes de recibir la respuesta, y el cliente reintenta automáticamente. ¿Qué técnica evita crear un pago duplicado, dado que POST no es idempotente por naturaleza?', options: { A: 'No hay forma de evitar duplicados en este escenario', B: 'Usar una "Idempotency Key" enviada por el cliente en el header, que el servidor usa para detectar y deduplicar reintentos de la misma operación', C: 'Simplemente ignorar el problema, es responsabilidad exclusiva del cliente', D: 'Cambiar el verbo a GET para la creación del pago' }, answer: ['B'], explanation: 'Enviar una Idempotency Key (un identificador único generado por el cliente para esa operación específica) permite al servidor reconocer reintentos de la misma solicitud y devolver el resultado original sin duplicar la acción — patrón estándar en APIs de pagos (ej. Stripe).', domain: 'Idempotencia', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué significa que una API sea "stateless" (sin estado), un principio central de REST?', options: { A: 'Cada solicitud del cliente al servidor debe contener toda la información necesaria para procesarla, sin que el servidor dependa de contexto almacenado de solicitudes anteriores de ese cliente', B: 'Que la API nunca puede usar autenticación', C: 'Que la API no puede almacenar ningún dato en una base de datos', D: 'Que el cliente nunca puede enviar parámetros' }, answer: ['A'], explanation: 'El principio stateless de REST establece que cada solicitud debe ser autocontenida (incluir toda la información/autenticación necesaria), sin que el servidor mantenga estado de sesión del cliente entre solicitudes, facilitando el escalado horizontal.', domain: 'Principios REST', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué código de estado HTTP se debe devolver cuando el servidor recibió la solicitud correctamente pero rechaza procesarla por un problema de formato en el cuerpo (ej. JSON mal formado)?', options: { A: '400 Bad Request', B: '200 OK', C: '301 Moved Permanently', D: '503 Service Unavailable' }, answer: ['A'], explanation: '400 Bad Request indica que la solicitud del cliente tiene un problema (sintaxis inválida, JSON mal formado, parámetros faltantes) que impide al servidor procesarla correctamente.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué código de estado HTTP indica que el servidor está temporalmente no disponible (ej. en mantenimiento o sobrecargado), sugiriendo que el cliente puede reintentar más tarde?', options: { A: '503 Service Unavailable', B: '200 OK', C: '404 Not Found', D: '401 Unauthorized' }, answer: ['A'], explanation: '503 Service Unavailable indica que el servidor no puede procesar la solicitud temporalmente (mantenimiento, sobrecarga), a menudo acompañado de un header "Retry-After" sugiriendo cuándo reintentar.', domain: 'Verbos HTTP y códigos de estado', difficulty: 'medium' },
      { type: 'multiple', question: '¿Qué convención de naming es preferida para los nombres de recursos en URLs REST: camelCase, snake_case o kebab-case?', options: { A: 'kebab-case (ej. /user-profiles) es ampliamente recomendado por su legibilidad y compatibilidad con la naturaleza case-insensitive de los hostnames, aunque snake_case también es común en algunas APIs', B: 'No existe ninguna convención recomendada, cualquier formato es igual de válido', C: 'Solo se permite UPPERCASE en URLs REST', D: 'Los espacios en blanco sin codificar son la convención estándar' }, answer: ['A'], explanation: 'kebab-case (guiones) es una convención ampliamente recomendada para URLs por su legibilidad y porque evita ambigüedades con la naturaleza case-insensitive de los nombres de dominio, aunque distintas organizaciones pueden optar por snake_case según su estilo.', domain: 'Naming conventions', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué se recomienda evitar incluir verbos en las URLs de un API REST (ej. usar "/orders" en vez de "/getOrders" o "/createOrder")?', options: { A: 'Porque el verbo HTTP (GET, POST, PUT, DELETE) ya expresa la acción; incluir un verbo adicional en la URL es redundante y rompe la convención de que las URLs representan recursos (sustantivos), no acciones', B: 'Porque los verbos en URLs siempre generan errores de servidor', C: 'No existe ninguna razón real para evitarlos', D: 'Porque los navegadores no pueden procesar verbos en URLs' }, answer: ['A'], explanation: 'En REST, la URL identifica un recurso (sustantivo, ej. "/orders") y el verbo HTTP expresa la acción sobre ese recurso; incluir un verbo en la URL (ej. "/getOrders") es redundante y contradice el principio de diseño orientado a recursos de REST.', domain: 'Naming conventions', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es HATEOAS (Hypermedia as the Engine of Application State) como principio avanzado de REST?', options: { A: 'Que las respuestas de la API incluyan enlaces (links) a acciones/recursos relacionados disponibles, permitiendo al cliente navegar la API dinámicamente sin codificar URLs de antemano', B: 'Un sinónimo de autenticación OAuth', C: 'Un tipo de código de estado HTTP', D: 'Un principio que prohíbe el uso de JSON' }, answer: ['A'], explanation: 'HATEOAS propone que las respuestas de la API incluyan hiperenlaces a acciones y recursos relacionados disponibles desde el estado actual, permitiendo que el cliente descubra y navegue la API dinámicamente, en vez de tener todas las URLs hardcodeadas de antemano — el nivel más avanzado (nivel 3) del modelo de madurez de Richardson.', domain: 'Principios REST', difficulty: 'hard' },
      { type: 'multiple', question: '¿Qué header HTTP se usa para indicar el formato/tipo de contenido del cuerpo de una solicitud o respuesta (ej. application/json)?', options: { A: 'Content-Type', B: 'Authorization', C: 'Accept-Language', D: 'Cache-Control' }, answer: ['A'], explanation: 'El header `Content-Type` especifica el formato del cuerpo de la solicitud/respuesta (ej. `application/json`, `application/xml`), permitiendo al receptor interpretar correctamente los datos.', domain: 'Principios REST', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué header HTTP envía el cliente para indicar qué formato de respuesta prefiere recibir del servidor (ej. JSON vs XML)?', options: { A: 'Accept', B: 'Content-Type', C: 'User-Agent', D: 'Host' }, answer: ['A'], explanation: 'El header `Accept` indica al servidor qué tipo(s) de contenido puede/prefiere recibir el cliente en la respuesta (ej. `Accept: application/json`), permitiendo negociación de contenido cuando la API soporta múltiples formatos.', domain: 'Principios REST', difficulty: 'medium' },
      { type: 'multiple', question: '¿Por qué es una buena práctica de seguridad usar HTTPS (TLS) en todas las comunicaciones de una API REST, incluso para endpoints "de solo lectura"?', options: { A: 'HTTPS cifra el tráfico entre cliente y servidor, protegiendo la confidencialidad e integridad de los datos (incluyendo tokens de autenticación enviados en headers) frente a interceptación en tránsito, sin importar si el endpoint es de lectura o escritura', B: 'HTTPS solo es necesario para endpoints que modifican datos, nunca para lectura', C: 'HTTPS no aporta ninguna protección real', D: 'HTTPS solo protege la velocidad de la conexión, no la seguridad' }, answer: ['A'], explanation: 'HTTPS cifra todo el tráfico (incluyendo headers de autenticación como tokens Bearer), protegiendo la confidencialidad e integridad de la comunicación frente a interceptación (ej. en redes Wi-Fi públicas), sin importar si el endpoint específico es de lectura o escritura.', domain: 'Autenticación (OAuth 2.0, JWT)', difficulty: 'easy' },
      { type: 'multiple', question: '¿Qué es "API versioning" mediante header personalizado (ej. `Accept: application/vnd.miapi.v2+json`) en vez de versionar en la URL?', options: { A: 'Una estrategia alternativa de versionado que mantiene la URL del recurso "limpia" (sin /v1/, /v2/), delegando la negociación de versión al header Accept, aunque es menos visible/simple de usar que el versionado en URL', B: 'Un método que no permite versionar APIs en absoluto', C: 'Un sinónimo exacto de versionar en la URL, sin ninguna diferencia práctica', D: 'Una técnica exclusiva de APIs GraphQL' }, answer: ['A'], explanation: 'El versionado por header (content negotiation) mantiene URLs "limpias" sin el número de versión visible, delegando la negociación al header Accept; es una alternativa válida al versionado en URL, aunque generalmente menos descubrible/simple para los consumidores de la API que ver la versión directamente en la URL.', domain: 'Versionado de APIs', difficulty: 'hard' },
    ],
  },
];
