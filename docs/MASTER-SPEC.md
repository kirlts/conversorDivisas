# MASTER-SPEC: Conversor UF/CLP v0.1.0

> Herramienta de conversion bidireccional entre Unidad de Fomento (UF) y Peso Chileno (CLP) con arquitectura hexagonal, cache inteligente y resiliencia ante caida de proveedores externos.

---

## §1. Identidad del Proyecto

**Proposito:** Permitir la conversion precisa y confiable entre divisas (notablemente UF y CLP) consumiendo el valor oficial desde APIs externas, con cache en Redis y persistencia de respaldo en SQLite. Diseñado para procesamiento ininterrumpido en entornos criticos aplicando rigor arquitectonico.

**Nombre:** Conversor UF/CLP

**Dominio:** FinTech / Indicadores Economicos Chilenos

**Problema que resuelve:** La obtencion del valor de la UF depende de APIs externas con disponibilidad variable. mindicador.cl (referente historico) esta caido desde 2026. Las alternativas gubernamentales requieren registro y credenciales. El sistema necesita consumir datos de forma inteligente, cacheando un valor que por ley es inmutable dentro de cada dia calendario, y manteniendo un respaldo persistente ante caida simultanea de API y cache.

**Beneficiario directo:** Sistemas B2B/B2C internos y la capa de aseguramiento (fusión USA-Chile) que consumirá el microservicio.

**Beneficiario indirecto:** Cualquier sistema que requiera conversion UF/CLP con resiliencia operacional.

**Lo que NO es:** No es un sistema de trading, no es un dashboard de multiples indicadores, no aspira a reemplazar plataformas como findic.cl o la CMF. No implementa autenticacion de usuarios ni gestion de perfiles.

---

## §2. Arquitectura

**Tipo:** Client-Server con arquitectura hexagonal en el backend

**Nota de entrega:** El backend REST API (puerto 3000) es un entregable independiente consultable directamente via curl, Postman, o cualquier cliente HTTP. El frontend Vue 3 (puerto 80 en produccion) lo consume, pero no es el unico canal de acceso.

**Diagrama de Componentes:**

```
[Vue 3 Frontend] --HTTP/REST--> [NestJS Backend]
                                      |
                                [Dominio (Puertos)]
                               /        |         \
                     [Adaptador      [Adaptador    [Adaptador
                      findic.cl]      Redis]        SQLite]
                         |               |             |
                    [API Externa]   [Redis 7.x]   [archivo.db]
```

**Flujo de Datos Principal:**

1. En startup: el backend intenta poblar Redis con el valor UF del dia (warm-up)
2. Usuario ingresa monto y direccion de conversion (UF→CLP o CLP→UF)
3. Frontend (o cliente directo) envia request al endpoint REST del backend
4. Backend consulta Redis buscando el valor UF del dia (cache hit)
5. Si cache miss: consulta findic.cl con Exponential Backoff (3 intentos, timeout 3.5s)
6. Si findic.cl falla: consulta SQLite por ultimo valor conocido (modo degradado)
7. Valor obtenido se persiste en Redis (TTL hasta 00:00:01 del dia siguiente) y en SQLite
8. Dominio ejecuta la conversion matematica
9. Respuesta incluye: resultado, valor UF usado, timestamp, fuente (cache/api/fallback)
10. Headers de respuesta: `X-Cache: HIT|MISS`, `X-UF-Source`, `X-UF-TTL`

---

## §3. Stack Tecnico

| Capa | Tecnologia | Justificacion |
|---|---|---|
| Frontend | Vue 3 + Vite (TypeScript) | Solucion de vanguardia documentada como el estandar en la organizacion. Vue 3 Composition API es sumamente eficiente y propicio al testing. |
| Backend | NestJS (TypeScript) | Framework con soporte nativo para inversion de dependencias, modulos y decoradores. Facilita patron hexagonal |
| Cache | Redis 7.x | Almacen clave-valor en memoria. La UF es inmutable por dia, cache es el patron correcto. Persistencia RDB activada |
| Seguridad | @nestjs/throttler | Limitacion asimetrica de la tasa de peticiones (Rate Limiting) con topes duros para healthchecks (via Throttler) mitigando ataques L7 y DDOS a adaptadores. |
| Persistencia | SQLite (via better-sqlite3) | Registro del ultimo valor conocido. Sin contenedor adicional. Sobrevive migraciones. Un archivo en volumen Docker |
| Contenedores | Docker Compose | Un solo comando levanta 3 servicios: backend, frontend, Redis |

---

## §4. Restricciones (Limites Intransgredibles)

> Estas restricciones anulan cualquier otra decision. Son las lineas que no se cruzan.

1. **Gestión Zero-Trust de Secretos**: La `CMF_API_KEY` u otras credenciales jamas rozan el repositorio en crudo explícitamente (`.gitignore`). La validación estricta de variables de entorno mediante Joi (Fail-Fast Bootstrap) detiene silenciosamente contenedores mal configurados previo a la primera solicitud.
2. Todo el sistema debe ser levantable con un unico `docker compose up`
3. El backend expone TypeScript estricto. No `any` implicitos
4. Exponential Backoff nativo (sin librerias externas). AbortController + setTimeout
5. El valor de la UF nunca se consulta a la API externa mas de una vez por dia si ya esta cacheado
6. El backend REST (puerto 3000) se expone al host en docker-compose. CORS configurado para permitir el origen del frontend y peticiones directas desde cliente HTTP
7. **El Core Domain es estrictamente agnostico a divisas.** Las entidades `ExchangeRate` y `ConversionResult` no contienen referencias literales a "UF" ni "CLP". El conocimiento de pares especificos reside exclusivamente en los adaptadores. Agregar un nuevo par de divisas requiere solo un nuevo adaptador, sin tocar el dominio.
8. **Rate Limiting Asimétrico**: El sistema detiene peticiones saturantes a `/health` agresivamente (5 req/10s) resguardando estabilidad via Throttler, mientras es elástico (60 req/min) para interacciones funcionales con `/api/convert`.

---

## §5. Trade-offs Acordados

> Decisiones donde una cualidad se sacrifico a favor de otra, con la razon explicita.

| Trade-off | A favor de | En contra de | Justificacion |
|---|---|---|---|
| SQLite sobre PostgreSQL | Simplicidad operacional | Capacidad relacional completa | Solo almacena un dato escalar con timestamp. Una DB relacional completa es overkill |
| findic.cl sobre BCCH/CMF como primario | Cero friccion (sin API key), JSON nativo, latencia <80ms | Respaldo institucional gubernamental | El research valida findic.cl como Tier-1 comunitaria. CMF queda documentada como fallback futuro |
| Exponential Backoff nativo sobre libreria | Transparencia del codigo in-house, cero dependencias extra | Funcionalidad avanzada de circuit breaker | Una auditoria debe poder trazar la logica de reintentos sin depender de abstracciones opacas |
| NestJS sobre Express crudo | Patron hexagonal de fabrica, DI nativa | Mayor peso de framework | El objetivo macro recae en la robustez de patrones de arquitectura, no minimalismo |
| CMF solo documentada, no implementada | Tiempos de ejecucion MVP agiles | Resiliencia completa multi-proveedor | El puerto hexagonal existe; activar CMF es cuestion de configurar la API key y proveerla el dia 2 |
| Core Domain agnostico (ExchangeRateProviderPort) sobre dominio acoplado a UF/CLP | OCP: abierto a extension, cerrado a modificacion | Ligero overhead conceptual | La naturaleza indexada de la UF aplica a multiples indicadores (UTM, IVP). Diseno que escala sin refactor del core |

---

## §6. UI y Experiencia de Usuario

**Atmosfera de referencia:** Interfaz de calculadora financiera institucional. Colores frios (azul oscuro, blanco, acentos verdes para exito). Tipografia sans-serif profesional. Sin animaciones innecesarias. El stakeholder debe abrir la app y operar instantaneamente.

**Flujo principal de usuario:**

1. Usuario ve el formulario de conversion con valor UF actual visible
2. Ingresa monto numerico
3. Selecciona direccion: UF → CLP o CLP → UF
4. Presiona "Convertir"
5. Resultado aparece con: monto convertido, valor UF utilizado, fuente del dato, timestamp

**Componentes de interfaz:**

| Componente | Funcion | Archivo |
|---|---|---|
| ConversionForm | Formulario principal de conversion | `frontend/src/components/ConversionForm.vue` |
| ResultDisplay | Muestra resultado con metadata de fuente | `frontend/src/components/ResultDisplay.vue` |
| UfStatus | Indicador del valor UF actual y estado del servicio | `frontend/src/components/UfStatus.vue` |

---

## §7. Especificaciones de Modulos

### 7.1. Dominio (Conversion)

**Proposito:** Logica pura de conversion bidireccional UF/CLP. Sin dependencias externas.

**Interfaz:**

```typescript
interface ExchangeRate {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  date: string;
  source: string;
}

interface ConversionResult {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rateApplied: number;
  result: number;
  source: 'cache' | 'api' | 'fallback';
  timestamp: string;
}
```

**Dependencias:** Ninguna (logica pura)

### 7.2. Puerto ExchangeRateProvider

**Proposito:** Interfaz abstracta para obtener tasas de cambio entre divisas.

**Interfaz:**

```typescript
interface ExchangeRateProviderPort {
  getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate>;
}
```

**Dependencias:** Ninguna (es un puerto)

### 7.3. Adaptador FindicProvider

**Proposito:** Implementacion concreta del puerto `ExchangeRateProviderPort` contra findic.cl. Sabe como resolver la peticion 'UF' a 'CLP'.

**Dependencias:** fetch nativo (Node 18+), AbortController

### 7.4. Adaptador CacheService (Redis)

**Proposito:** Cache clave-valor con TTL calculado al fin del dia

**Dependencias:** ioredis

### 7.5. Adaptador PersistenceService (SQLite)

**Proposito:** Registro durable del ultimo valor conocido de la UF. Fallback ante caida simultanea de API y cache.

**Dependencias:** better-sqlite3

### 7.6. HealthController

**Proposito:** Endpoint `GET /health` para verificar el estado operativo de los adaptadores criticos. Apto para probes de orquestadores.

**Interfaz:**

```
GET /health
→ { status: 'ok'|'degraded', adapters: { redis, sqlite }, lastKnownRate }
```

**Dependencias:** RedisCacheAdapter, SqlitePersistenceAdapter

### 7.7. Swagger / OpenAPI

**Proposito:** Contrato API auto-generado disponible en `/api/docs`. Documenta los 3 endpoints del sistema con esquemas de respuesta.

**Dependencias:** @nestjs/swagger

---

## §8. Checklist de Verificacion

> Pendiente verificacion formal; ejecutar `/derive` para poblar esta seccion.

<!--
Taxonomy: [ACTOR.CATEGORY.NN.VER]
Actors: Defined by /derive according to the project
Categories: AV (Availability), FN (Functionality), CR (Correctness), IN (Integrity), RS (Resilience)
Verifier (VER): LLM (automatable), HUM (requires human), MIX (pre-verifiable + human)

Check format:
  🧑 `[ACTOR.CAT.NN.HUM]` Action → Result. *(Validated promise)*
  🤖 `[ACTOR.CAT.NN.LLM]` Action → Result. *(Validated promise)*
  🤖🧑 `[ACTOR.CAT.NN.MIX]` Action → Result. *(Validated promise)*

Implementation format (with mandatory timestamp):
  ✅ Implemented (🤖 Verified by [tool]; YYYY-MM-DD HH:MM)
  ✅ Implemented (🧑 Confirmed by user; YYYY-MM-DD HH:MM)
  ✅ Implemented (🤖🧑 Pre-verified by [tool], confirmed by user; YYYY-MM-DD HH:MM)
-->
