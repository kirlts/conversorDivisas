# Motor de Conversión de Divisas de Alta Disponibilidad

Sistema de conversión bidireccional entre divisas e indicadores financieros. Construido bajo arquitectura hexagonal en NestJS.

El diseño previene el acoplamiento directo a proveedores externos y asegura la continuidad operativa mediante una gestión de caché temporal y persistencia local de respaldo.

El sistema funciona de manera agnóstica a las divisas configuradas. En su estado actual, se entrega pre-configurado para convertir entre la **Unidad de Fomento (UF) y el Peso Chileno (CLP)**, consumiendo el valor oficial a través del proveedor comunitario `findic.cl`.

## Arquitectura & Stack Tecnológico

Proyecto construido bajo los principios de **Arquitectura Hexagonal (Puertos y Adaptadores)**, garantizando el desacoplamiento total del dominio matemático respecto a la infraestructura de red.

**Stack y Dependencias Core:**
- **Frontend:** Vue 3 (Composition API) + Vite + PrimeVue.
- **Backend:** Node.js + NestJS (TypeScript).
- **Caché:** Redis (in-memory) para latencias submilisegundo escalables, respaldado con un Time-To-Live dinámico al cierre del día.
- **Persistencia Fallback:** SQLite (base estática inmutable ante fallos sistémicos).
- **Proveedor Externo (API):** `findic.cl`. *(Nota: `mindicador.cl` o el `BCCH` fueron excluidos deliberadamente dada la caída permanente de sus servicios o la vulnerabilidad de uso de tokens en URLs).*

**Resiliencia Operativa:**
El ecosistema implementa prevención de fallos en cascada (Caché -> API con *Exponential Backoff* -> Fallback a BD), limitación asimétrica de ráfagas de tráfico (*Rate-Limiting*) y arranque protegido por esquemas (`Joi`) que prohíben instanciaciones degradadas por falta de variables.

---

## Requisitos Previos

- **Docker** y **Docker Compose** instalados en el sistema anfitrión. No es necesario instalar Node.js, Redis, ni ninguna dependencia localmente; todo está contenedorizado.

## Instalación y Ejecución

1. Abrir una terminal en el directorio raíz del proyecto.
2. Construir e inicializar los servicios:

```bash
docker compose up -d
```

Este comando levanta la orquestación completa (API, frontend web y bases de datos integradas).

### Accesos Rápidos
Una vez levantado el entorno, todo estará expuesto en tu `localhost`:
- 🖥️ **Aplicación Web (UI):** [http://localhost:5173](http://localhost:5173)
- 📋 **Documentación API (Swagger):** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- 🩺 **Estado del Sistema:** [http://localhost:3000/health](http://localhost:3000/health)

---

## Interfaz Gráfica (Frontend)
El sistema incluye una Single Page Application (SPA) en Vue 3 alojada en `http://localhost:5173`.
- **Topología Dinámica**: La UI es 100% agnóstica; consume un grafo de paridades válidas desde el backend (`/api/currencies`), deshabilitando automáticamente las opciones mutuamente excluyentes (ej. prohíbe convertir `USD` a `EUR` si el adaptador de Findic sólo conecta `USD` con `CLP`).
- **Prevención de Errores UX**: Cualquier estado inválido desencadena una auto-corrección sin emitir errores de sistema.

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
