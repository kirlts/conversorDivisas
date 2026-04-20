# Changelog

Todos los cambios notables de este proyecto seran documentados en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
