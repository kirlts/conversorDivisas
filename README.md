# Motor de Conversión de Divisas de Alta Disponibilidad

Sistema de conversión bidireccional entre divisas e indicadores financieros. Construido bajo arquitectura hexagonal en NestJS.

El diseño previene el acoplamiento directo a proveedores externos y asegura la continuidad operativa mediante una gestión de caché temporal y persistencia local de respaldo.

El sistema funciona de manera agnóstica a las divisas configuradas. En su estado actual, se entrega pre-configurado para convertir entre la **Unidad de Fomento (UF) y el Peso Chileno (CLP)**, consumiendo el valor oficial a través del proveedor comunitario `findic.cl`.

## Arquitectura

La arquitectura del proyecto se estructura bajo lineamientos estrictos de **Diseño Orientado al Dominio (Domain-Driven Design / DDD)** y el patrón **Puertos y Adaptadores (Arquitectura Hexagonal)**.

1. **Agnosticismo de Divisas**: El núcleo de conversión ignora la existencia de la "UF" o el "CLP". Las operaciones operan a través de entidades genéricas y un contrato abstracto de proveedor. Agregar nuevas divisas sólo requiere inyectar un nuevo adaptador sin alterar la lógica matemática existente.
2. **Caché en Memoria (Redis)**: Para evitar consultas innecesarias sobre un valor que permanece fijo dentro de un mismo día calendario, el sistema deposita la tasa de cambio en Redis al inicio del ciclo diario. A esta entrada se le asigna un tiempo de vida (*Time-To-Live* / TTL) dinámico programado para expirar a las `00:00:01` del día siguiente (horario local).
3. **Persistencia de Respaldo (SQLite)**: Ante una interrupción simultánea del proveedor de datos de primera línea y el nodo de caché, el sistema recurre a un registro final inmutable alojado en un archivo SQLite como fallback, retornando la última tasa estable comprobada.
4. **Rate-Limiting**: En la capa del adaptador externo, los reintentos fallidos se gestionan con retrasos programados progresivamente mayores más una distorsión aleatoria (*Exponential Backoff con Jitter*). El tráfico se regula mediante rate-limiters ajustados nativamente en memoria, los cuales penalizan agresivamente la inyección sistemática de peticiones no autorizadas o lecturas anómalas.
5. **Gestión de Secretos Controlada por Esquema (*Zero-Trust*)**: Ninguna credencial de infraestructura o API token toca el repositorio en crudo explícitamente (`.gitignore`). La aplicación emplea validación de esquemas (*schema validation* vía `Joi`) en tiempo de arranque (*Fail-Fast Bootstrap*). La inyección formal asume que los contenedores provistos recibirán sus métricas por *Docker Secrets* o por integradores agnósticos externos (ej. AWS Secrets Manager u Azure Key Vault) materializados crudos variables de entorno, rompiendo en seco la ejecución general del contenedor en caso de malformaciones.

---

## Instalación y Ejecución

La totalidad de los servicios se articula a través de contendedores. No requiere instalaciones expuestas en la máquina local.

1. Abrir una terminal en el directorio raíz.
2. Inicializar los servicios:

```bash
docker compose up -d
```

Este comando levanta la orquestación completa:

- Red de exposición de puertos.
- Instancia y servicio Redis en memoria.
- Volumen contenedor del gestor SQLite persistente.
- Servidor REST principal en `localhost:3000`.

---

## Contrato API de Integración

Una vez inicializados los contenedores, los endpoints REST están directamente disponibles y documentados formalmente:

### Observabilidad (Health Check)

Verifica el estado de red de los adaptadores de caché y bases de datos locales:

```bash
curl -s http://localhost:3000/health
```

### OpenAPI (Swagger)

El proyecto cuenta con auto-generación del contrato mediante decoradores.

- Esquemas y tests visuales en: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Conversión Directa

El endpoint procesa y anexa en metadatos qué fuente técnica entregó el valor.

```bash
curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1,
    "fromCurrency": "UF",
    "toCurrency": "CLP"
  }'
```

Revisando las cabeceras HTTP de respuesta (`X-Cache`, `X-UF-Source`) es posible trazar operativamente si se sirvió desde consulta en tiempo real, latencia sub-milisegundo vía Redis, o bajo una mitigación vía memoria secundaria local.
