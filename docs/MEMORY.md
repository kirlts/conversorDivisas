# MEMORY: Heuristicas Transferibles

> Repositorio de patrones y lecciones que serian utiles en cualquier proyecto, independiente del dominio.
> Archivo de solo adicion. Prohibido reducir, eliminar o sintetizar contenido previo.

| Simbolo | Significado |
|---|---|
| 🧠 | Heuristica transferible aprendida |

---

## [HEU-001] Dato inmutable no justifica polling en tiempo real

**Fecha:** 2026-04-20
**Origen:** Analisis del ecosistema de APIs de UF chilena (research/api-research.md)
**Patron:** La UF se calcula por interpolacion geometrica desde el IPC y su valor es fijo para cada dia del calendario. Multiples sistemas la consultan por request como si fuera una divisa de libre flotacion.
**Leccion:** Antes de diseñar el patron de consumo de una API, verificar la naturaleza temporal del dato. Si es inmutable dentro de una ventana de tiempo, cache con TTL alineado a esa ventana es obligatorio. Polling frecuente es un anti-patron documentado.
**Source:** https://findic.cl/docs/ | Confirmado por research/api-research.md seccion "Naturaleza Matematica de la UF"

## [HEU-002] Separar cache de persistencia ante caida simultanea

**Fecha:** 2026-04-20
**Origen:** Discusion arquitectonica sobre Redis como unica capa de datos
**Patron:** Redis en modo cache puro pierde todo al reiniciarse si no tiene persistencia. Si la API externa tambien esta caida en ese momento, el sistema queda sin datos.
**Leccion:** Para datos criticos con fuente externa no confiable, mantener dos capas: cache en memoria (velocidad) + store persistente ligero (resiliencia). SQLite cumple el rol de store sin requerir un contenedor adicional.
**Source:** Confirmado por usuario - sin fuente externa

## [HEU-003] Verificar la ordenacion de arrays en respuestas de APIs externas

**Fecha:** 2026-04-20
**Origen:** Bug detectado en FindicProvider: se asumia que `serie[]` era ascendente y el elemento mas reciente era el ultimo. La API retorna descendente: `serie[0]` es el mas reciente.
**Patron:** Las APIs externas no tienen convencion uniforme sobre si sus arrays de series temporales son ascendentes o descendentes. Acceder al primer o ultimo elemento sin leer la documentacion produce datos incorrectos silenciosamente.
**Leccion:** Al integrar cualquier API con arrays de datos temporales, verificar explicitamente el orden antes de asumir que `[0]` o `[length-1]` corresponde al dato mas reciente. Documentar el orden como comentario en el adaptador.
**Source:** https://findic.cl/docs/ (seccion de respuesta JSON confirma orden descendente)
