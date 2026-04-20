# USER-DECISIONS: Registro de Agencia Humana

> Este documento NO ES UN CHANGELOG. Es el registro de soberania del usuario.
> Captura el "por que" estrategico y las intenciones explicitas que el usuario comunica.

| Simbolo | Significado |
|---|---|
| 💡 | Decision estrategica del usuario |
| 🔗 | Referencia cruzada trazable a checks `.HUM` |

---

## [UD-001] API primaria: findic.cl

**Fecha:** 2026-04-20
**Contexto:** Se necesita una API para obtener el valor de la UF. El research (research/api-research.md) documento que mindicador.cl esta caido, BCCH usa credenciales en URL (anti-patron de seguridad), y RapidAPI tiene limites de 15 req/mes.
**Decision:** Usar findic.cl como proveedor primario. Sin API key, JSON nativo con numeros (no strings), latencia <80ms, CDN.
**Alternativas descartadas:**
- mindicador.cl: caido desde 2026
- BCCH: credenciales en URL, riesgo de logs sensibles
- CMF: requiere API key y registro. Se deja documentada como fallback futuro
- RapidAPI: modelo freemium, 15 req/mes en plan gratuito
- Web scraping SII: fragil, 800ms+ latencia, acoplado a HTML del SII
**Consecuencias:**
- Dependencia de un servicio comunitario. Si cae, el sistema entra en modo degradado (SQLite fallback)
- El puerto hexagonal existe para activar CMF u otro proveedor sin tocar el dominio
**Condiciones de reversion:** Si findic.cl degrada su SLA de forma sostenida, activar CMF registrando una API key

## [UD-002] Cache Redis + Persistencia SQLite (separacion de responsabilidades)

**Fecha:** 2026-04-20
**Contexto:** La UF es matematicamente inmutable dentro de un dia. Consultar la API por cada conversion es un anti-patron. Pero si Redis cae y la API cae simultaneamente, se pierde el dato.
**Decision:** Redis como cache primaria (velocidad, TTL al EOD). SQLite como registro persistente del ultimo valor conocido (sobrevive caidas y migraciones).
**Alternativas descartadas:**
- Solo Redis sin persistencia: si cae, se pierde el dato
- Solo Redis con RDB: parcial, no sobrevive migración de host
- PostgreSQL/MongoDB como DB: overkill para un dato escalar con timestamp
**Consecuencias:**
- Dos adaptadores (Redis + SQLite) en lugar de uno. Mas codigo, mayor resiliencia
- SQLite es un archivo en volumen Docker, portable
**Condiciones de reversion:** Si el proyecto escala a multiples indicadores con relaciones, migrar SQLite a PostgreSQL

## [UD-003] Exponential Backoff nativo (sin librerias)

**Fecha:** 2026-04-20
**Contexto:** El research recomienda Fallback Pattern y Circuit Breaker. Para llamadas a API externa, el Exponential Backoff con Jitter evita el thundering herd problem.
**Decision:** Implementar con AbortController + setTimeout nativos de TypeScript. 3 intentos: 500ms, 1s, 2s con jitter aleatorio. Sin librerias externas.
**Alternativas descartadas:**
- axios-retry, cockatiel, etc.: obscurecen la intencion arquitectonica. El equipo o auditor de seguridad debe poder leer la logica sin abstracciones opacas
**Consecuencias:**
- Codigo ligeramente mas extenso pero 100% legible y sin dependencias extra
- Mantiene el control del patron de resiliencia in-house
**Condiciones de reversion:** Si el proyecto crece a multiples APIs con patrones complejos de circuit breaker, evaluar librerias especializadas

## [UD-004] NestJS sobre Express crudo

**Fecha:** 2026-04-20
**Contexto:** La resiliencia exige modularidad y patrones de arquitectura sobre el minimalismo. NestJS tiene DI nativa, modulos y soporte para patron hexagonal de fabrica.
**Decision:** Usar NestJS como framework backend.
**Alternativas descartadas:**
- Express crudo: requiere mas scaffolding manual para DI y modularidad
- Fastify standalone: buena performance pero sin ecosistema de DI comparable
**Consecuencias:**
- Mayor peso de framework. Mayor curva de ingreso temporal
- Patron hexagonal surge naturalmente de la estructura de NestJS
**Condiciones de reversion:** No aplica para este proyecto

## [UD-005] CMF solo documentada, no implementada

**Fecha:** 2026-04-20
**Contexto:** La restriccion de tiempo (4 horas) impide crear cuenta y registrar API key en la CMF. El adaptador hexagonal existe como interfaz.
**Decision:** No crear cuenta CMF. Documentar como fallback disponible bajo configuracion de CMF_API_KEY. El puerto ya existe.
**Alternativas descartadas:**
- Implementar CMF completo: requiere registro y gestion de API key, consume tiempo critico
**Consecuencias:**
- El fallback ante caida de findic.cl es SQLite (ultimo valor conocido), no otra API en tiempo real
**Condiciones de reversion:** Cuando haya tiempo, registrar API key CMF y activar el adaptador

## [UD-006] ConfigModule NestJS con validacion fail-fast

**Fecha:** 2026-04-20
**Contexto:** Empresa aseguradora con datos sensibles. La gestion de secretos debe ser explicita.
**Decision:** .env + ConfigModule de NestJS con validacion en startup. Si falta una variable requerida, la app falla inmediatamente con mensaje explicito.
**Alternativas descartadas:**
- Docker Secrets (Swarm): overkill para el contexto
- HashiCorp Vault: overkill
- .env sin validacion: falla silenciosamente en runtime
**Consecuencias:**
- Implementa un fail-fast design robusto para seguridad
**Condiciones de reversion:** No aplica

## [UD-007] Desacoplamiento del Core Domain de divisas especificas (Agnosticismo)

**Fecha:** 2026-04-20
**Contexto:** El proyecto exige la conversion UF/CLP, pero diseñar una arquitectura hexagonal que entienda unicamente estas dos literales ("UF_TO_CLP") viola conceptualmente la premisa del patron. El dominio se volveria rígido y cerrado al cambio.
**Decision:** Hacer la capa de Entidades y Puertos estrictamente agnostica a divisas. Usaremos la entidad abstracta `ExchangeRate` (con base y target currency) y un puerto generico `ExchangeRateProviderPort`. Los adaptadores se encargan de enrutar la instruccion "UF a CLP" hacia la API correspondiente.
**Alternativas descartadas:**
- Diseñar el MVP hardcodeando "UF" (ej. UfProvider) en todo el dominio: anti-patron tecnico que viola el Principio Abierto/Cerrado (OCP) dificultando futuras integraciones.
**Consecuencias:**
- El dominio se vuelve reutilizable instantáneamente para futuros requerimientos (ej: dolar a peso). 
- Fomenta una arquitectura predictiva y una fuerte madurez estructural (Domain Driven Design mitigando riesgos a largo plazo).
**Condiciones de reversion:** No aplica. Es una fundacion arquitectonica.

## [UD-008] Rate Limiting Asimetrico (@nestjs/throttler)

**Fecha:** 2026-04-20
**Contexto:** El backend necesita limitacion de peticiones para evitar asfixia del Event Loop y bloqueos (*bans*) de proveedores externos if se efectuan *loops* infinitos o DDOS.
**Decision:** Implementar `@nestjs/throttler` (libreria oficial) de forma nativa con topes asimetricos: limite estricto y veloz (5 req/10s) para *readiness probes* (`/health`), y una ventana mas amplia pero holgada (60 req/1m config via `.env`) para transacciones de dominio y navegacion de UI (`/api/convert`).
**Alternativas descartadas:**
- `express-rate-limit` crudo: No se integra con inyeccion de dependencias ni con ContextExecution.
- Un solo rate-limit global rigido: Penaliza interfaces mientras beneficia *healthchecks* automaticos.
**Consecuencias:**
- Observabilidad protegida contra orquestadores agresivos.
- Dominio funcional protegido, pero garantizando *bursts* aceptables B2C/B2B.
**Condiciones de reversion:** Si se migra a un API Gateway robusto (ej: AWS API Gateway) el limitador a nivel infraestructura podria sobreescribir esta configuracion de software.

## [UD-009] Estrategia Zero-Trust para Inyeccion y Validacion de Secretos

**Fecha:** 2026-04-20
**Contexto:** Regulaciones criticas B2B demandan prevencion absoluta en fuga de credenciales. La validacion de secretos no debe confiar en el administrador.
**Decision:** Uso intensivo de Patrón Fail-Fast validando esquemas rígidos via `Joi` durante el arranque de la app. Los secretos (ej: `CMF_API_KEY`) no existen en repositorio (`.gitignore` purga `.env`), y se documenta estrategicamente la exigencia de Inyección Segura (Docker Secrets o Gestores AWS/Azure Key Vault) sobrescribiendo variables de entorno en inyección cruda en memoria.
**Alternativas descartadas:**
- Confirmacion en tiempo de ejecucion: Rompe la aplicacion silenciando bugs de deployment.
- Hardcodeo provisional de variables: Riesgo de fuga.
**Consecuencias:**
- Ningun contenedor arrancará degradado por falta circunstancial de secretos críticos o malformaciones sútiles.
**Condiciones de reversion:** Ninguna aplicabe para produccion B2B/Enterprise.

## [UD-010] Adopcion de PrimeVue como Frontend Framework UI

**Fecha:** 2026-04-20
**Contexto:** El desarrollo del frontend requiere de una interfaz "institucional y profesional" sin consumir recursos en la configuracion manual de CSS o lidiar de cero con Tailwind.
**Decision:** Instalar PrimeVue v4 como framework de componentes UI.
**Alternativas descartadas:**
- Tailwind CSS crudo: prohibido por las reglas base salvo peticion expresa, requiere alto tiempo en posicionamiento estructurado.
- CSS Vanilla manual: excesivo overhead para inputs y estado (disabled, focus, etc).
**Consecuencias:**
- Los componentes UI (Cards, Inputs, Messages) se delegan a PrimeVue.
- Sistema de theming 100% basado en propiedades CSS nativas.
**Condiciones de reversion:** No aplica.

## [UD-011] Pinning Estricto de Dependencias NPM (Zero-Trust)

**Fecha:** 2026-04-20
**Contexto:** La seguridad B2B/Aseguradora Internacional requiere prevenir ataques de cadena de suministro (Supply Chain Attacks).
**Decision:** Congelar todas las dependencias en `frontend/package.json` removiendo los prefijos `^` y `~`.
**Alternativas descartadas:**
- Versiones flotantes: vulnerables a inyecciones maliciosas si el lockfile se corrompe o ignora.
**Consecuencias:**
- El build Frontend se vuelve 100% determinista e inmutable.
- Toda actualizacion requerira auditoria manual y re-pinneado.
**Condiciones de reversion:** No aplica para este estandar de seguridad.
## [UD-012] Grafo Topológico para UX Agnostica

**Fecha:** 2026-04-20
**Contexto:** Los inputs del conversor originaban errores (HTTP 400 Pair Not Supported) si el usuario seleccionaba "USD" a "EUR" al no soportarlo Findic. Hardcodear en frontend un bloqueo a las opciones "A" o "De" rompería el Agnosticismo forzando reglas de negocio estáticas en Vue.
**Decision:** El backend expone en `GET /api/currencies` una matriz estricta de topología/adyacencia basada en sus adaptadores. El Frontend se autodeshabilita consumiendo ese árbol predictivamente (Ej: seleccionas `BTC`, desactiva todas las opciones menos `USD`).
**Alternativas descartadas:**
- Bloqueo front via Hardcoding (`if(from === 'UF')` ...): Antipatrón (Leaking de Dominio al cliente).
**Consecuencias:**
- El frontend puede engullir Binance, CMF, o Findic mañana, y mutará reactivamente y sin tocar código fuente las divisas mutuamente excluyentes en la UI.
**Condiciones de reversion:** No aplica.
