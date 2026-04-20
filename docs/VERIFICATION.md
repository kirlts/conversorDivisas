# VERIFICATION: Conversor de Divisas v0.1.0

> Canonical truth for all formal promise verifications and testing boundaries.
> Generated and maintained exclusively by the `/derive` algorithm.

## Kairós Symbol Legend

| Symbol | Meaning |
|---|---|
| 🤖 `.LLM` | Verifiable by AI/automated tool |
| 🧑 `.HUM` | Requires human verification |
| 🤖🧑 `.MIX` | Pre-verifiable by AI, final human validation |
| ✅ | Implemented and verified |
| 🔲 | Pending |

---

<!--
Taxonomy: [ACTOR.CATEGORY.NN.VER]
Actors: APP, EXT, OPS, USR
Categories: AV (Availability), FN (Functionality), CR (Correctness), IN (Integrity), RS (Resilience)
Verifier (VER): LLM (automatable), HUM (requires human), MIX (pre-verifiable + human)
-->

### Cliente de Integración (APP)
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.AV.01.LLM]` Consultar endpoint /api/convert desde puerto exterior → Se obtiene respuesta JSON sin timeout ni caída de socket.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.AV.02.LLM]` Disparar HTTP OPTIONS pre-flight desde origen web simulado → Retorna CORS Headers aceptados.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.FN.01.LLM]` Inspeccionar atributo source en body de respuesta → El valor es estrictamente 'cache', 'api' o 'fallback'.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.FN.02.LLM]` Enviar payload POST sin direction → Retorna HTTP 400 Bad Request por validación de DTO.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.FN.03.LLM]` Leer header HTTP de la respuesta de conversión → Existe llave X-Cache con valor HIT o MISS.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.CR.01.LLM]` Multiplicar monto por tasa entregada manualmente → El resultado coincide exactamente con campo result retornado.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.CR.02.LLM]` Analizar tipado de rateApplied en JSON crudo → Es numérico, sin comillas envolventes.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.IN.01.LLM]` Repetir conversión 3 veces consecutivas → El rateApplied es idéntico a nivel decimal flotante en las tres.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.RS.01.LLM]` Disparar 61 peticiones /api/convert iterativas en bajo 1 minuto → La petición 61 arroja HTTP 429 explícito.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[APP.RS.02.LLM]` Aislar red externa y apagar contenedor Redis temporalmente, consultar API → Retorna data pre-existente sin arrojar HTTP 500 Interno.

### Proveedor Externo de Tasas (EXT)
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.AV.01.LLM]` Ejecutar petición post-warmup habiendo caché → Log interno de http fetch no se dispara hacia la URL root de findic.cl.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.AV.02.LLM]` Aislar contadores de inicio de app → Fetch de datos es asíncrono y no bloquea el startup HTTP base del modulo principal.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.FN.01.LLM]` Consultar adaptador simulando body array descendente → El valor parseado es inequívocamente serie[0].
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.FN.02.LLM]` Enrutar salida de fetch a un proxy dilatorio de 5 segundos → El proceso lanza AbortError local a los 3.5 segundos.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.FN.03.LLM]` Trazar timeline de reintentos a proxy muerto → Peticiones marcadas a +500ms, +1s, +2s aproximadamente.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.CR.01.LLM]` Simular respuesta de API findic con valor string malformado "UF_NULA" → Caché Redis no graba la llave y modo fallback domina.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.IN.01.LLM]` Revisar entidad Core ExchangeRate → No existe hardcodeo a variables UF u otras literales explícitas.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.RS.01.LLM]` Bloquear ruta findic a nivel SO, ver salida → Tras tercer intento terminal, adaptador delega flujo limpiamente en vez de loop.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.RS.02.LLM]` Trazar milisegundos de intervalos de fallo en test suite unitario mock → Ningún intervalo es matemáticamente exacto, presentan deriva aleatoria.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[EXT.RS.03.LLM]` Disparar HTTP request regular cuando findic está en error 504 → El string trace original de findic se sanitiza, usuario solo ve origen fallback.

### Sonda de Monitoreo de Salud (OPS)
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.AV.01.LLM]` Visitar endpoint /health directamente → JSON contiene campos de validación para adaptador Redis y SQLite.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.AV.02.LLM]` Medir Response Time de /health → Retorna en un máximo admisible comercial (ej. 50ms) en ambiente local.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.FN.01.LLM]` Iniciar sistema limpio y golpear health → Muestra flag maestro status: "ok" explícito.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.FN.02.LLM]` Inspeccionar nodo Redis en payload health → Campo pingMs existe y es > 0.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.FN.03.LLM]` Inspeccionar clave raiz en payload health → Atributo lastKnownRate está presente reportando última tasa obtenida.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.CR.01.LLM]` Cursar detención temporal de Docker Redis → Visitar health reporta global status: "degraded".
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.CR.02.LLM]` Remover archivo sqlite y apagar redis simuladamente → El endpoint status cambia a error o similar y registra ambos caídos.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.IN.01.LLM]` Visitar health 20 veces, luego revisar llaves de cache Redis → No existen nuevas llaves basura en Redis generadas por la acción.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.RS.01.LLM]` Disparar curl loop rápido 6 veces en 2 segundos a /health → El sexto arroja HTTP 429 Too Many Requests (Asimetría Throttler).
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[OPS.RS.02.LLM]` Analizar formato de rechazo por sobrecarga a probe OPS → Es un rechazo JSON explícito con cabeceras Retry-After.

### Cliente Humano (USR)
- [ ] Pendiente 🤖🧑 `[USR.AV.01.MIX]` Desplegar servidor estático front, cargar index.html → DOM inyecta componentes base PrimeVue sin arrojar White-Screen.
- [ ] Pendiente 🧑 `[USR.AV.02.HUM]` Acceder a la ruta local Swagger /api/docs vía navegador visual → La interfaz de API se renderiza limpia y permite ejecuciones de prueba manuales.
- [ ] Pendiente 🤖🧑 `[USR.FN.01.MIX]` Convertir un monto → El sistema de output web muestra en texto enriquecido que el origen es (Caché, API o Histórico).
- [ ] Pendiente 🤖🧑 `[USR.FN.02.MIX]` Interceptar API front para forzar 500 error → El botón de conversión se deshabilita temporalmente, bloqueando furia de clicks.
- [ ] Pendiente 🧑 `[USR.FN.03.HUM]` Leer la página de resultados visualmente como cliente → Se comprende inmediatamente si el valor procesado estaba cacheadó o no gracias a UX/Toltip de PrimeVue.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[USR.CR.01.LLM]` Forzar inicialización de backend renombrando fichero .env para ocultarlo → El framework backend arroja excepción de consola de Joi y detiene inicio inmediatamente.
- [ ] Pendiente 🧑 `[USR.CR.02.HUM]` Navegar interfaz renderizada visual → La paleta respeta estrictamente azul/verde institucional sin grises caóticos default, y tipografía es San-Serif.
- ✅ Implemented (🤖 Verified by AI; 2026-04-20 12:00) `[USR.IN.01.LLM]` Analizar package.json de frontend (Regex) → No existen dependencias precedidas con tildes ~ o carets ^ exponiendo ataques third-party para UI.
- [ ] Pendiente 🤖🧑 `[USR.RS.01.MIX]` Aplicar macro auto-clicker de alta frecuencia sobre botón Convertir en frontend web → Solo el primer trigger procesa mutación reactiva y evita stack de peticiones repetidas.
- [ ] Pendiente 🤖🧑 `[USR.RS.02.MIX]` Emular condición severa local donde internet cae justo al submitir UI → El bloque frontend libera el spinner nativo luego de expirar el timeout abort controller asíncrono, mostrando toast error PrimeVue.
