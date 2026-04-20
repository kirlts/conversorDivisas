# Changelog

Todos los cambios notables de este proyecto seran documentados en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Verificación exhaustiva de Resiliencia y Base Documental:
  - Ejecución integral del algoritmo `/derive` generando la Taxonomy MECE de 40 comportamientos.
  - Sincronización oficial del `MASTER-SPEC.md §8` validando y trazando resiliencia para actores APP, EXT, OPS, USR.
  - Actualización de cobertura y mapeo .HUM/.MIX en `TODO.md` preparando una base validada para el Frontend (EPIC-003).
- EPIC-003: Frontend Institucional Vue 3 (Completado)
  - Dependencias NPM congeladas (Strict Pinning) removiendo `^` y `~` en frontend previniendo ataques de cadena de suministro.
  - PrimeVue v4 instalado junto con @primevue/themes bajo tema Aura.
  - Interfaz implementada siguiendo Protocolo de Excelencia Visual institucional (OKLCH, Gestalt spacing).
  - Proxy dev configurado en Vite enrutando `/api` y `/health` a backend interno.
  - Componentes creados y orquestados: `ConversionForm`, `ResultDisplay`, `UfStatus`, `App`.
- Implementación topológica dinámica mediante Grafos en `/api/currencies` proveyendo de reglas mutuamente excluyentes a la UI evitando hardcoding de lógica de presentación.
- Refinamiento semántico visual de origen de datos (Cambio de `OPTIMIZADO` a `Valor vigente del día`).
- Actualización final del `README.md` (EPIC-004 completado).
- Eje documental inicializado: MASTER-SPEC, TODO, USER-DECISIONS, MEMORY, CHANGELOG
- Research de APIs de UF chilena documentado en research/api-research.md
- 7 decisiones arquitectonicas registradas en USER-DECISIONS.md (UD-001 a UD-007)
- EPIC-001: Scaffolding e infraestructura base
  - NestJS inicializado con arquitectura hexagonal (domain, application, infrastructure, presentation)
  - ConfigModule con validacion Joi (fail-fast en startip)
  - Docker Compose con servicios backend, frontend, redis
  - Persistencia: Redis RDB + SQLite en volumen Docker
  - CORS habilitado; backend expuesto en puerto 3000
- EPIC-002: Backend: Dominio y Logica de Negocio
  - Entidades de dominio agnosticas: ExchangeRate, ConversionResult
  - Puertos hexagonales: ExchangeRateProviderPort, CachePort, PersistencePort
  - Servicio de dominio puro: CurrencyConverterService (logica bidireccional)
  - Adaptador API: FindicProvider (findic.cl/api/uf) con Exponential Backoff nativo + Jitter
  - Adaptador cache: RedisCacheAdapter (TTL dinamico a medianoche)
  - Adaptador persistencia: SqlitePersistenceAdapter (WAL mode, UPSERT)
  - Caso de uso: ConvertCurrencyUseCase con cascada Cache->API->SQLite
  - Warm-up configurable via WARMUP_PAIRS (agnostico a divisas)
  - Controlador REST: GET /api/uf/current, POST /api/convert
  - Headers de respuesta: X-Cache, X-UF-Source, X-UF-TTL
- EPIC-005: Solidificacion del Backend (elevada de Opcional a prioritaria)
  - TASK-016: Diagnostico de flujo de datos verificado (MISS->API->HIT, fecha 2026-04-20, tasa 39987.35)
  - TASK-012: Swagger/OpenAPI en /api/docs (3 paths: /api/uf/current, /api/convert, /health)
  - TASK-013: Endpoint GET /health (Redis ping con latencia, SQLite probe, lastKnownRate)
  - TASK-014: 10 tests unitarios del dominio (10/10 PASS, CurrencyConverterService + TTL)
  - TASK-015: Rate Limiting asimétrico añadido (@nestjs/throttler) con límites 5 req/10s (/health) y 60 req/min (global).
  - Chaos Engineering: Test de caída de Redis solucionó colapso en el event loop. Implementado `enableOfflineQueue: false` y `maxRetriesPerRequest: 1` en `ioredis`. 
  - Bug corregido: serie[0] en FindicProvider (array descendente de findic.cl)
<!--
INPUT FORMAT:

## [X.Y.Z] - YYYY-MM-DD

### Added
- Description of the added functionality.

### Changed
- Description of what changed.

### Fixed
- Description of the fixed bug.

### Removed
- Description of what was removed.

RULES:
- The AI adds entries to [Unreleased] upon completing work.
- When performing a release, [Unreleased] is moved to a numbered version.
- Each entry describes WHAT changed, not HOW.
-->
