# TODO: Conversor de Divisas v0.1.0

> Trazabilidad directa: cada tarea referencia checks de `VERIFICATION.md`.

## Leyenda de Simbolos Kairos

| Simbolo | Significado |
|---|---|
| 🤖 | Check verificable por AI/herramienta automatizada |
| 🧑 | Check que requiere verificacion humana |
| 🤖🧑 | Check pre-verificable por AI, validacion final humana |
| ⏳ | En progreso |
| 🔲 | Pendiente |
| 🚨 | Bloqueo critico |

---

## [EPIC-001] Infraestructura y Configuracion Base

> Ref: MASTER-SPEC §2, §3, §4

### [TASK-001] Scaffold del proyecto NestJS con estructura hexagonal

> Ref: MASTER-SPEC §2

**Covered checks:** Transversal governance

- [x] Inicializar proyecto NestJS con TypeScript estricto; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Crear estructura de carpetas: domain/, application/, infrastructure/, presentation/; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Configurar ConfigModule con validacion de variables de entorno (fail-fast); 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Crear `.env.example` con variables documentadas; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Configurar `.gitignore` para excluir `.env`; 2026-04-20 10:33 [🤖 Verified by tool]

### [TASK-002] Docker Compose con 3 servicios

> Ref: MASTER-SPEC §2, §4

**Covered checks:** Transversal governance

- [x] Dockerfile para backend NestJS; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Dockerfile para frontend Vue 3; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] docker-compose.yml con servicios: backend, frontend, redis; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Puerto 3000 del backend mapeado al host (`3000:3000`) de forma independiente; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] CORS configurado en NestJS para origen del frontend y clientes HTTP directos; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Volumen persistente para SQLite; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Redis con persistencia RDB activada; 2026-04-20 10:33 [🤖 Verified by tool]
- [x] Verificar que `docker compose up` levanta todo sin intervencion manual; 2026-04-20 10:33 [🤖 Verified by tool]

---

## [EPIC-002] Backend: Dominio y Logica de Negocio

> Ref: MASTER-SPEC §7

### [TASK-003] Entidades y puertos del dominio

> Ref: MASTER-SPEC §7.1, §7.2

**Covered checks:** Transversal governance

- [x] Implementar interfaz `ExchangeRateProviderPort` (puerto); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Implementar interfaz `CachePort`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Implementar interfaz `PersistencePort`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Implementar entidad `ExchangeRate` (base, target, rate, date, source); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Implementar entidad `ConversionResult` (agnostica a divisas); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Implementar servicio de dominio `CurrencyConverterService` (logica pura); 2026-04-20 10:45 [🤖 Verified by tool]

### [TASK-004] Adaptador findic.cl con Exponential Backoff

> Ref: MASTER-SPEC §7.3, §4

**Covered checks:** Transversal governance

- [x] Implementar `FindicProvider` que implementa `ExchangeRateProviderPort`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Mapeo interno: solicitud de 'UF' utiliza el endpoint especifico de la API; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] fetch nativo con AbortController (timeout 3.5s); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Exponential Backoff: 500ms → 1s → 2s, 3 intentos max; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Jitter aleatorio en cada reintento; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Parseo de respuesta JSON de findic.cl (campo `serie`); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Logging estructurado de intentos/fallos; 2026-04-20 10:45 [🤖 Verified by tool]

### [TASK-005] Adaptador Redis (CacheService)

> Ref: MASTER-SPEC §7.4

**Covered checks:** Transversal governance

- [x] Implementar `RedisCacheAdapter` que implementa `CachePort`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] TTL calculado dinamicamente: expira a las 00:00:01 del dia siguiente; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Headers de respuesta: `X-Cache: HIT|MISS`, `X-UF-Source`, `X-UF-TTL`; 2026-04-20 10:45 [🤖 Verified by tool]

### [TASK-006] Adaptador SQLite (PersistenceService)

> Ref: MASTER-SPEC §7.5

**Covered checks:** Transversal governance

- [x] Implementar `SqlitePersistenceAdapter` que implementa `PersistencePort`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Tabla: `uf_values(date TEXT PRIMARY KEY, value REAL, source TEXT, fetched_at TEXT)`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Metodo: guardar valor actual; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Metodo: obtener ultimo valor conocido (para modo degradado); 2026-04-20 10:45 [🤖 Verified by tool]

### [TASK-007] Caso de uso: ConvertCurrencyUseCase

> Ref: MASTER-SPEC §2 (flujo de datos)

**Covered checks:** Transversal governance

- [x] Cache warm-up configurable via `WARMUP_PAIRS` (agnostico); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Orquestar flujo: Redis → findic.cl (con backoff) → SQLite fallback; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Persistir en Redis + SQLite tras obtencion exitosa de API; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Retornar metadata de fuente (cache/api/fallback); 2026-04-20 10:45 [🤖 Verified by tool]

### [TASK-008] Controlador REST

> Ref: MASTER-SPEC §2

**Covered checks:** Transversal governance

- [x] `GET /api/uf/current` - Obtener valor UF actual; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] `POST /api/convert` - Ejecutar conversion con body `{ amount, direction }`; 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Respuesta estandarizada con metadata (source, ufValue, timestamp); 2026-04-20 10:45 [🤖 Verified by tool]
- [x] Manejo de errores con codigos HTTP apropiados; 2026-04-20 10:45 [🤖 Verified by tool]

---

## [EPIC-003] Frontend Vue 3

> Ref: MASTER-SPEC §6

### [TASK-009] Scaffold Vue 3 + Vite con TypeScript

> Ref: MASTER-SPEC §3

**Covered checks:** Transversal governance

- [x] Inicializar proyecto con Vite + Vue 3 + TypeScript; 2026-04-20 11:50 [🤖 Verified by tool]
- [x] Configurar proxy de desarrollo hacia backend (puerto 3000); 2026-04-20 12:05 [🤖 Verified by tool]

### [TASK-017] Hardening y Setup de Interfaz Institucional (PrimeVue)

**Covered checks:** Transversal governance

- [x] Aplicar Strict Pinning de dependencias actuales (remover `^` y `~`); 2026-04-20 11:52 [🤖 Verified by tool]
- [x] Instalar PrimeVue y @primevue/themes con versiones exactas; 2026-04-20 12:05 [🤖 Verified by tool]
- [x] Aislar variables de color y tipografia (Inter/Roboto) en archivo CSS principal; 2026-04-20 12:05 [🤖 Verified by tool]
- [x] Configurar PrimeVue en main.ts; 2026-04-20 12:05 [🤖 Verified by tool]


### [TASK-010] Componentes de interfaz

> Ref: MASTER-SPEC §6

**Covered checks:** [USR.AV.01.MIX], [USR.AV.02.HUM], [USR.FN.01.MIX], [USR.FN.02.MIX], [USR.FN.03.HUM], [USR.CR.02.HUM], [USR.RS.01.MIX], [USR.RS.02.MIX] 
> [Requires human validation]

- [x] ConversionForm: adaptado a selector agnóstico /api/currencies; 2026-04-20 13:00 [🤖🧑 Verified by MIX]
- [x] ResultDisplay: sin leaking de metadata técnica; 2026-04-20 13:00 [🤖🧑 Verified by MIX]
- [x] RateStatus (ex-UfStatus): inyección de salud semántica; 2026-04-20 13:00 [🤖🧑 Verified by MIX]
- [x] Estilos: paleta institucional (Zero-CSS, blue tokens); 2026-04-20 13:00 [🤖🧑 Verified by MIX]

---

## [EPIC-004] Documentacion y Entrega

> Ref: Requisitos de Entrega Core

### [TASK-011] README con instrucciones de instalacion y ejecucion

> Ref: Requisitos de Entrega Core

**Covered checks:** Transversal governance

- [x] Descripcion del proyecto; 2026-04-20 13:30 [🤖🧑 Verified by MIX]
- [x] Prerrequisitos (Docker, Docker Compose); 2026-04-20 13:30 [🤖🧑 Verified by MIX]
- [x] Instrucciones de ejecucion (`docker compose up`); 2026-04-20 13:30 [🤖🧑 Verified by MIX]
- [x] Seccion de Decisiones de Arquitectura (ADR minimo); 2026-04-20 13:30 [🤖🧑 Verified by MIX]
- [x] Exclusiones documentadas (mindicador.cl, BCCH, RapidAPI, scraping); 2026-04-20 13:30 [🤖🧑 Verified by MIX]
- [x] Documentar endpoints REST disponibles (curl examples); 2026-04-20 13:30 [🤖🧑 Verified by MIX]

---

## [EPIC-005] Solidificacion del Backend (Prioridad Alta)

> Elevada de Opcional a prioritaria. Ejecutar antes de EPIC-003.
> Cubre: diagnostico de datos, observabilidad, contrato API y validacion de dominio.

### [TASK-016] Diagnostico y Validacion del Flujo de Datos

**Covered checks:** Transversal governance

- [x] Verificar conectividad Docker -> findic.cl (node fetch desde contenedor: Date 2026-04-20 Rate 39987.35); 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Confirmar que warm-up inyecta tasa del dia actual (no fallback SQLite); 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Validar que X-Cache: MISS en primera consulta y HIT en segunda; 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Confirmar fecha del valor retornado = fecha de hoy (2026-04-20); 2026-04-20 11:00 [🤖 Verified by tool]

### [TASK-012] Swagger / OpenAPI (NestJS @nestjs/swagger)

**Covered checks:** Transversal governance

- [x] Instalar @nestjs/swagger; 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Decorar controladores con @ApiOperation, @ApiResponse; 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Swagger UI disponible en `/api/docs` (paths: /api/uf/current, /api/convert, /health); 2026-04-20 11:00 [🤖 Verified by tool]

### [TASK-013] Endpoint /health

**Covered checks:** Transversal governance

- [x] `GET /health` retorna estado de Redis (ok, latencyMs) y SQLite (ok); 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Campo `lastKnownRate` con ultima tasa conocida (tasa del dia, fuente fallback SQLite); 2026-04-20 11:00 [🤖 Verified by tool]

### [TASK-014] Tests unitarios del dominio

**Covered checks:** Transversal governance

- [x] Test: conversion UF→CLP correcta con valor conocido (39987.35); 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Test: conversion CLP→UF correcta con valor conocido; 2026-04-20 11:00 [🤖 Verified by tool]
- [x] Test: calculo de TTL es correcto (expira a medianoche); 2026-04-20 11:00 [🤖 Verified by tool]
- [x] 10/10 tests pasando (npm test); 2026-04-20 11:00 [🤖 Verified by tool]

### [TASK-015] Rate Limiting

**Covered checks:** Transversal governance

- [x] Instalar @nestjs/throttler; 2026-04-20 11:35 [🤖 Verified by tool]
- [x] Limite asimétrico (5 req/10s para health, 60 req/1m global) configurable por variable de entorno; 2026-04-20 11:35 [🤖 Verified by tool]
- [x] Prueba de caos documentada (Fail-Fast en adaptador Redis para evitar estrangulamiento de Loop); 2026-04-20 11:35 [🤖 Verified by tool]

---

## Resumen de Cobertura

| Epic | Tareas | Estado | 🤖 .LLM | 🧑 .HUM | 🤖🧑 .MIX | Total Checks |
|---|---|---|---|---|---|---|
| EPIC-001 | TASK-001, TASK-002 | ✅ Completado | 7 | 0 | 0 | 7 |
| EPIC-002 | TASK-003 a TASK-008 | ✅ Completado | 18 | 0 | 0 | 18 |
| EPIC-005 | TASK-012 a TASK-016 | ✅ Completado | 5 | 0 | 0 | 5 |
| EPIC-003 | TASK-009, TASK-010, TASK-017 | ✅ Completado | 2 | 3 | 5 | 10 |
| EPIC-004 | TASK-011 | ✅ Completado | 0 | 0 | 6 | 6 |
