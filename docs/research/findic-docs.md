# Indicadores económicos Chile | Documentación | Indicadores económicos Chile
*   1: Consumir la API en tus proyectos

*   1.1: PHP
*   1.2: JavaScript
*   1.3: Python

*   2: Endpoints

*   2.1: Obtener resumen
*   2.2: Obtener datos por indicador
*   2.3: Obtener datos por fechas

*   3: Históricos

*   4: Changelog

*   5: Actualizaciones y mantenimiento

*   5.1: Actualizaciones
*   5.2: Mantenimientos

*   6: SLA y Buenas Prácticas

Bienvenido, este es un servicio gratuito que entrega los principales indicadores económicos de Chile mediante una API abierta que entrega los resultados en formato JSON.

Los indicadores son actualizados a diario, teniendo almacenados datos para uso histórico o para obtener un resumen todos los días con los últimos indicadores obtenidos, estos datos son de libre uso para que cualquiera pueda integrarlos en su aplicación o página web según lo estime.

Los datos son obtenidos desde el **Banco Central de Chile** para los indicadores económicos de Chile, y **CoinMarketCap** para CryptoMonedas como Bitcoin.

¿Qué indicadores tenemos actualmente?[](#qu%c3%a9-indicadores-tenemos-actualmente)
----------------------------------------------------------------------------------

Actualmente poseemos 17 indicadores en nuestras bases de datos. Cada una de ellas puede ser consultada mediante su propia llamada a la API o se puede obtener un resumen de todas.



* Nombre: Unidad de fomento (UF)
  * Fecha inicio valores: Valores desde el 1 de Agosto de 1977 hasta hoy.
* Nombre: Libra de Cobre
  * Fecha inicio valores: Valores desde el 5 de Octubre de 2012 hasta hoy.
* Nombre: Tasa de desempleo
  * Fecha inicio valores: Valores desde el 1 de Marzo de 2010 hasta hoy.
* Nombre: Euro
  * Fecha inicio valores: Valores desde el 4 de Enero de 1999 hasta hoy.
* Nombre: Imacec
  * Fecha inicio valores: Valores desde el 1 de Enero de 1997 hasta hoy.
* Nombre: Dólar observado
  * Fecha inicio valores: Valores desde el 9 de Agosto de 1982 hasta hoy.
* Nombre: Tasa Política Monetaria (TPM)
  * Fecha inicio valores: Valores desde el 7 de Febrero de 1998 hasta hoy.
* Nombre: Indice de valor promedio (IVP)
  * Fecha inicio valores: Valores desde el 1 de Enero de 1990 hasta hoy.
* Nombre: Indice de Precios al Consumidor (IPC)
  * Fecha inicio valores: Valores desde el 3 de Marzo de 1928 hasta hoy.
* Nombre: Dólar acuerdo
  * Fecha inicio valores: Valores desde el 29 de Septiembre de 1982 hasta hoy.
* Nombre: Unidad Tributaria Mensual (UTM)
  * Fecha inicio valores: Valores desde el 1 de Enero de 1990 hasta hoy.
* Nombre: IPSA (Índice de Precios Selectivo de Acciones)
  * Fecha inicio valores: Valores desde el 2 de Enero de 1989 hasta hoy.
* Nombre: Yen (Pesos por Yen)
  * Fecha inicio valores: Valores desde el 3 de Enero de 1994 hasta hoy.
* Nombre: Bitcoin
  * Fecha inicio valores: Valores desde el 14 de Julio de 2010 hasta hoy.
* Nombre: Ethereum
  * Fecha inicio valores: Valores desde el 08 de Agosto de 2015 hasta hoy.
* Nombre: Monero
  * Fecha inicio valores: Valores desde el 22 de Mayo de 2014 hasta hoy.
* Nombre: Solana
  * Fecha inicio valores: Valores desde el 11 de Abril de 2020 hasta hoy.


Sabiendo esto, es momento que conozcamos como interactuar con la API y sus rutas.

1 - Consumir la API en tus proyectos
------------------------------------

¿Qué es JSON?, ¿Cómo consumir la API en mis proyectos?, ¿Qué lenguajes puedo usar? y otras preguntas sobre findic.cl.

¿Qué es JSON?[](#qu%c3%a9-es-json)
----------------------------------

JSON o JavaScript Object Notation, es un formato de texto sencillo utilizado en el intercambio de información a travéz de internet, especialmente utilizada en aplicaciones móviles y WEB gracias a su facilidad de lectura y su formato estructurado.

Un objeto JSON, se compone principalmente de atributos “clave”: “valor”, un **valor** puede ser de tipo numérico, texto, listas e incluso otros objetos complejos.

¿Cómo consumir la API en mis proyectos?[](#c%c3%b3mo-consumir-la-api-en-mis-proyectos)
--------------------------------------------------------------------------------------

Puedes consumir esta API desde cualquier aplicación o componente de software; desde una Aplicación móvil, solicitándolo desde el backend en un servidor o puedes consultar directamente desde tu página web utilizando JavaScript.

¿Tiene un costo?[](#tiene-un-costo)
-----------------------------------

**NO** necesitas pagar por utilizar esta API; su uso es completamente gratuito.

¿Necesito un usuario o llave para hacer consultas la API?[](#necesito-un-usuario-o-llave-para-hacer-consultas-la-api)
---------------------------------------------------------------------------------------------------------------------

**NO** necesitas tener un usuario, ni utilizar llaves para realizar las consultas. La API es completamente pública y transparente.

¿Qué lenguajes puedo usar?[](#qu%c3%a9-lenguajes-puedo-usar)
------------------------------------------------------------

Puedes utilizar cualquier lenguaje que te permita realizar consultas http (HTTPS) a nuestra API, luego depende de cada lenguaje elegir un mecanismo para transformar/decodificar el JSON a un objeto utilizable (parse, deserialize, etc).

1.1 - PHP
---------

Uso de PHP (Personal Home Page) para obtener datos desde la API de indicadores.

A continuación se muestra el código de ejemplo para consultar a nuestra API desde el Lenguaje PHP:

```
<?php

// Especificamos en una variable que contenga la URL
$apiUrl = 'https://findic.cl/api/';

// Si tenemos habilitadd allow_url_fopen, consultamos con file_get_contents
if ( ini_get('allow_url_fopen') ) {
    $json = file_get_contents($apiUrl);
} else {
    // De otra forma utilizamos cURL
    $curl = curl_init($apiUrl);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $json = curl_exec($curl);
    curl_close($curl);
}

// Decodificamos el JSON y lo transfoemamos en objeto
$dailyIndicators = json_decode($json);

// Imprimimos el dato de la UF
echo 'El valor actual de la UF es

Más información del objeto JSON entregado en el resumen aquí.

1.2 - JavaScript
----------------

Uso de JavaScript para obtener datos desde la API de indicadores.

A continuación se muestra el código de ejemplo para consultar a nuestra API desde el Lenguaje JavaScript, este ejemplo te puede ser útil si lo quieres utilizar en tu página web y quieres actualizar el HTML directamente.

```
// Con fetch realizamos la consulta a la URL especificada
fetch("https://findic.cl/api/",{
  // Content-Type para especificar que recibiremos un objeto JSON
  // Access-Control-Allow-Origin para habilitar CORS (Habilitar el origen cruzado de consultas)
  headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
  },
  // El método de solicitur que realizaremos (un GET)
  method: "GET"})
// Obtenemos el json de la respuesta
.then((response) => response.json())
// y lo utilizamos acá (el json)
.then((data) => {
  // Obtenemos el elemento de nuestro HTML que contenga el ID "UF" (por ejemplo <div id="UF"></div>)
  // y le asignamos el valor del UF
  document.getElementById("UF").innerHTML = data.uf.valor;
})
.catch((err) => console.log(err));

```


Más información del objeto JSON entregado en el resumen aquí.

1.3 - Python
------------

Uso de Python para obtener datos desde la API de indicadores.

A continuación se muestra el código de ejemplo para consultar a nuestra API desde el Lenguaje Python:

```
import requests

# Endpoint de la API para obtener el resumen diario
url = "https://findic.cl/api/"

response = requests.get(url)

if response.status_code == 200:
    data = response.json()

    # Obtenemos el valor de UF
    uf = data['uf']

    print(f"Fecha: {uf['fecha']}")
    print(f"Valor UF: $ {uf['valor']}")
else:
    print(f"Error en la solicitud: {response.status_code}")

```


Más información del objeto JSON entregado en el resumen aquí.

2 - Endpoints
-------------

Aprende como utilizar y realizar consultas a las distintas rutas que provee la API de findic.cl.

Como mencionamos anteriormente y antes de continuar con la visita a nuestra nuestra API, primero debemos proveer de los códigos necesarios para cada uno de los diecisiete indicadores.

Puedes volver a esta página para consultar por estos y nuevos indicadores.

Códigos de Indicadores[](#c%c3%b3digos-de-indicadores)
------------------------------------------------------

El código de cada indicador, debe escribirse en **minúsculas**, respetando los **guiones bajos** (en caso de necesitarlos), ya que es sensible a mayúsculas y minúsculas, siendo elementos distintos **uf** de **UF** o **Uf**.


|Nombre                                        |Código           |
|----------------------------------------------|-----------------|
|Unidad de fomento (UF)                        |uf               |
|Libra de Cobre                                |libra_cobre      |
|Tasa de desempleo                             |tasa_desempleo   |
|Euro                                          |euro             |
|Imacec                                        |imacec           |
|Dólar observado                               |dolar            |
|Tasa Política Monetaria (TPM)                 |tpm              |
|Indice de valor promedio (IVP)                |ivp              |
|Indice de Precios al Consumidor (IPC)         |ipc              |
|Dólar acuerdo                                 |dolar_intercambio|
|Unidad Tributaria Mensual (UTM)               |utm              |
|IPSA (Índice de Precios Selectivo de Acciones)|ipsa             |
|Yen (Pesos por Yen)                           |yen              |
|Bitcoin                                       |bitcoin          |
|Ethereum                                      |ethereum         |
|Monero                                        |monero           |
|Solana                                        |solana           |


2.1 - Obtener resumen
---------------------

Ruta para obtener el resumen diario de los indicadores

La ruta base de la API retorna el resumen de los indicadores diarios, mostrando los indicadores del día en curso o en caso de criptomonedas, el valor de cierre de el día anterior.

Algunos indicadores son mensuales o se entregan con meses de atraso, por lo que puede variar la fecha del último registro.

Ruta a consultar[](#ruta-a-consultar)
-------------------------------------

La siguiente ruta entrega el resumen diario, el método de consulta es **GET**:

El resultado entregado será similar al siguiente objeto JSON:

```
{
    "version": "1.3.0",
    "autor": "findic.cl",
    "fecha": "2025-11-04",
    "uf": {
        "codigo": "uf",
        "nombre": "Unidad de fomento (UF)",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-04",
        "valor": 39618.08
    },
    "ivp": {
        "codigo": "ivp",
        "nombre": "Indice de valor promedio (IVP)",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-04",
        "valor": 41163.96
    },
    "dolar": {
        "codigo": "dolar",
        "nombre": "Dólar observado",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-04",
        "valor": 940.53
    },
    "dolar_intercambio": {
        "codigo": "dolar_intercambio",
        "nombre": "Dólar acuerdo",
        "unidad_medida": "Pesos",
        "fecha": "2018-01-09",
        "valor": 837.59
    },
    "euro": {
        "codigo": "euro",
        "nombre": "Euro (pesos por euro)",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-04",
        "valor": 1084.68
    },
    "ipc": {
        "codigo": "ipc",
        "nombre": "Indice de Precios al Consumidor (IPC)",
        "unidad_medida": "Porcentaje",
        "fecha": "2025-09-01",
        "valor": 0.4
    },
    "utm": {
        "codigo": "utm",
        "nombre": "Unidad Tributaria Mensual (UTM)",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-01",
        "valor": 69542.0
    },
    "imacec": {
        "codigo": "imacec",
        "nombre": "Imacec",
        "unidad_medida": "Porcentaje",
        "fecha": "2025-09-01",
        "valor": 3.2
    },
    "tpm": {
        "codigo": "tpm",
        "nombre": "Tasa Política Monetaria (TPM)",
        "unidad_medida": "Porcentaje",
        "fecha": "2025-11-04",
        "valor": 4.75
    },
    "libra_cobre": {
        "codigo": "libra_cobre",
        "nombre": "Libra de Cobre",
        "unidad_medida": "Dólar",
        "fecha": "2025-11-04",
        "valor": 4.93
    },
    "tasa_desempleo": {
        "codigo": "tasa_desempleo",
        "nombre": "Tasa de desempleo Mensual",
        "unidad_medida": "Porcentaje",
        "fecha": "2025-09-01",
        "valor": 8.53
    },
    "ipsa": {
        "codigo": "ipsa",
        "nombre": "IPSA (Índice de Precios Selectivo de Acciones)",
        "unidad_medida": "Puntos",
        "fecha": "2025-10-29",
        "valor": 9326.5
    },
    "yen": {
        "codigo": "yen",
        "nombre": "Yen (pesos por yen)",
        "unidad_medida": "Pesos",
        "fecha": "2025-11-04",
        "valor": 6.1
    },
    "bitcoin": {
        "codigo": "bitcoin",
        "nombre": "Bitcoin",
        "unidad_medida": "Dólar",
        "fecha": "2025-11-03",
        "valor": 106547.52
    },
    "ethereum": {
        "codigo": "ethereum",
        "nombre": "Ethereum",
        "unidad_medida": "Dólar",
        "fecha": "2025-11-03",
        "valor": 3602.31
    },
    "monero": {
        "codigo": "monero",
        "nombre": "Monero",
        "unidad_medida": "Dólar",
        "fecha": "2025-11-03",
        "valor": 345.42
    },
    "solana": {
        "codigo": "solana",
        "nombre": "Solana",
        "unidad_medida": "Dólar",
        "fecha": "2025-11-03",
        "valor": 166.09
    }
}

```


2.2 - Obtener datos por indicador
---------------------------------

Ruta para obtener datos del último mes por indicador

A la ruta base de la API se le suma el código del indicador, así podemos obtener los últimos 31 registros en una lista de serie, otorgándonos una vista más amplia.

Ruta a consultar[](#ruta-a-consultar)
-------------------------------------

La siguiente ruta entrega los últimos 31 registros de nuestro indicador consultado, es necesario especificar el código del indicador, el método de consulta es **GET**:

```
https://findic.cl/api/{indicador}

```


ejemplo:

El resultado entregado será similar al siguiente objeto JSON:

```
{
    "version": "1.3.0",
    "autor": "findic.cl",
    "codigo": "uf",
    "nombre": "Unidad de fomento (UF)",
    "unidad_medida": "Pesos",
    "serie": [
        {
            "fecha": "2025-11-04",
            "valor": 39618.08
        },
        {
            "fecha": "2025-11-03",
            "valor": 39612.97
        },
        {
            "fecha": "2025-11-02",
            "valor": 39607.87
        },
        {
            "fecha": "2025-11-01",
            "valor": 39602.77
        },
        {
            "fecha": "2025-10-31",
            "valor": 39597.67
        },
        ...
    ]
}

```


2.3 - Obtener datos por fechas
------------------------------

Ruta para obtener datos del indicador por año o fecha

A la ruta por indicador, se le puede agregar otro parámetro especificando una fecha (**dd-mm-yyyy**) o agregar un año (**yyyy**), de este modo podemos obtener **un día en específico** o los datos de **un año completo** según necesitemos.

Rutas a consultar[](#rutas-a-consultar)
---------------------------------------

La siguientes rutas entrega los datos de un día o un año en específico de nuestro indicador consultado, es necesario especificar el código del indicador, el método de consulta es **GET**:

### Obtener datos del indicador en un día en específico[](#obtener-datos-del-indicador-en-un-d%c3%ada-en-espec%c3%adfico)

Puedes consultar por un registro en un día en específico, pero debes saber que existen algunos indicadores económicos que **no se actualizan todos los días** (ej: el dolar) y también existen indicadores que son **mensuales**, por lo que si consultas por alguna fecha que no exista, la serie se devolverá **vacía**.

En el caso de los que son mensuales, es recomendable que busques esos indicadores siempre con la fecha **01-mm-yyyy**, por lo que si deseas consultar el **UTM** de Septiembre de 1998, el formato sería el siguiente: **01-09-1998**.

Los indicadores mensuales son:

*   IMACEC
*   IPC
*   TASA DESEMPLEO
*   UTM

La ruta es la siguiente:

```
https://findic.cl/api/{indicador}/{dd-mm-yyyy}

```


ejemplo:

```
https://findic.cl/api/uf/23-09-2020

```


el resultado sería el siguiente:

```
{
    "version": "1.3.0",
    "autor": "findic.cl",
    "codigo": "uf",
    "nombre": "Unidad de fomento (UF)",
    "unidad_medida": "Pesos",
    "serie": [
        {
            "fecha": "2020-09-23",
            "valor": 28701.15
        }
    ]
}

```


en caso que **no existan** registros en la fecha buscada, el resultado sería el siguiente:

```
{
    "version": "1.3.0",
    "autor": "findic.cl",
    "codigo": "uf",
    "nombre": "Unidad de fomento (UF)",
    "unidad_medida": "Pesos",
    "serie": []
}

```


### Obtener datos del indicador en un año en específico[](#obtener-datos-del-indicador-en-un-a%c3%b1o-en-espec%c3%adfico)

La ruta es la siguiente:

```
https://findic.cl/api/{indicador}/{yyyy}

```


ejemplo:

```
https://findic.cl/api/uf/2024

```


el resultado sería el siguiente:

```
{
    "version": "1.3.0",
    "autor": "findic.cl",
    "codigo": "uf",
    "nombre": "Unidad de fomento (UF)",
    "unidad_medida": "Pesos",
    "serie": [
        {
            "fecha": "2024-12-31",
            "valor": 38416.69
        },
        {
            "fecha": "2024-12-30",
            "valor": 38414.22
        },
        {
            "fecha": "2024-12-29",
            "valor": 38411.74
        },
        {
            "fecha": "2024-12-28",
            "valor": 38409.27
        },
        {
            "fecha": "2024-12-27",
            "valor": 38406.79
        },
        {
            "fecha": "2024-12-26",
            "valor": 38404.32
        },
        ...
    ]
}

```


3 - Históricos
--------------

Findic proporciona archivos históricos de todos los indicadores para descarga.

Proporcionamos dos tipos de archivo para descarga, archivos **CSV** y archivos **JSON**. Estos archivos son generados todos los días a las 07:30 A.M. Hora de Santiago Continental. Estos archivos son pre-comprimidos para una consulta rápida (Ya que son archivos relativamente grandes y sería costoso volver a parsearlos y comprimirlos en cada consulta).

Entregamos tódo el histórico de cada serie (puedes consultar la fecha del inicio de los registros de cada serie en la página principal de la documentación), así tendrás una fuente de datos para realizar análisis o mostrar un rango más amplio de gráficas en tus aplicaciones con una única consulta de serie.

¿Cómo consumir u obtener los históricos?[](#c%c3%b3mo-consumir-u-obtener-los-hist%c3%b3ricos)
---------------------------------------------------------------------------------------------

Existen actualmente dos rutas para poder acceder a los históricos, el primero entrega el archivo **CSV** comprimido dentro de un archivo **ZIP** y el otro es la ruta directa al archivo **JSON**.

Al ser archivos estáticos, las consultas se comportarán de manera distinta; por ejemplo el **CSV** comenzará la descarga de este y por otro lado, el archivo **JSON** se mostrará como si fuera una consulta a la API.

### Rutas de los históricos en formato CSV[](#rutas-de-los-hist%c3%b3ricos-en-formato-csv)

Los archivos **CSV** están sólo en formato **ZIP** para descarga, y están en la siguiente ruta:

```
https://findic.cl/csv/{codigo_indicador}.zip

```


los códigos son los siguientes:


|Nombre                                        |Código           |Descargar    |
|----------------------------------------------|-----------------|-------------|
|Unidad de fomento (UF)                        |uf               |Descargar zip|
|Libra de Cobre                                |libra_cobre      |Descargar zip|
|Tasa de desempleo                             |tasa_desempleo   |Descargar zip|
|Euro                                          |euro             |Descargar zip|
|Imacec                                        |imacec           |Descargar zip|
|Dólar observado                               |dolar            |Descargar zip|
|Tasa Política Monetaria (TPM)                 |tpm              |Descargar zip|
|Indice de valor promedio (IVP)                |ivp              |Descargar zip|
|Indice de Precios al Consumidor (IPC)         |ipc              |Descargar zip|
|Dólar acuerdo                                 |dolar_intercambio|Descargar zip|
|Unidad Tributaria Mensual (UTM)               |utm              |Descargar zip|
|IPSA (Índice de Precios Selectivo de Acciones)|ipsa             |Descargar zip|
|Yen (Pesos por Yen)                           |yen              |Descargar zip|
|Bitcoin                                       |bitcoin          |Descargar zip|
|Ethereum                                      |ethereum         |Descargar zip|
|Monero                                        |monero           |Descargar zip|
|Solana                                        |solana           |Descargar zip|


### Rutas de los históricos en formato JSON[](#rutas-de-los-hist%c3%b3ricos-en-formato-json)

Los archivos **JSON** se pueden ver y descargar, gracias a que proveemos del archivo JSON para consulta directa y un archivo **ZIP** para descarga.

Para consultar puedes recurrir a la siguiente ruta:

```
https://findic.cl/bjf/{codigo_indicador}.json

```


Y si los quieres descargar, puedes hacerlo con la siguiente:

```
https://findic.cl/bjf/{codigo_indicador}.zip

```


los códigos son los siguientes:


|Nombre                                        |Código           |Ver|Descargar|
|----------------------------------------------|-----------------|---|---------|
|Unidad de fomento (UF)                        |uf               |Ver|Descargar|
|Libra de Cobre                                |libra_cobre      |Ver|Descargar|
|Tasa de desempleo                             |tasa_desempleo   |Ver|Descargar|
|Euro                                          |euro             |Ver|Descargar|
|Imacec                                        |imacec           |Ver|Descargar|
|Dólar observado                               |dolar            |Ver|Descargar|
|Tasa Política Monetaria (TPM)                 |tpm              |Ver|Descargar|
|Indice de valor promedio (IVP)                |ivp              |Ver|Descargar|
|Indice de Precios al Consumidor (IPC)         |ipc              |Ver|Descargar|
|Dólar acuerdo                                 |dolar_intercambio|Ver|Descargar|
|Unidad Tributaria Mensual (UTM)               |utm              |Ver|Descargar|
|IPSA (Índice de Precios Selectivo de Acciones)|ipsa             |Ver|Descargar|
|Yen (Pesos por Yen)                           |yen              |Ver|Descargar|
|Bitcoin                                       |bitcoin          |Ver|Descargar|
|Ethereum                                      |ethereum         |Ver|Descargar|
|Monero                                        |monero           |Ver|Descargar|
|Solana                                        |solana           |Ver|Descargar|


4 - Changelog
-------------

Cambios en la WEB y API de findic.cl

2026-03-21 | Versión 1.3.0[](#2026-03-21--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web)

Se crea página de estado para mantener seguimiento del servicio, utilizando la herramienta Upptime para tener métricas de latencia, el porcentaje de uptime y tener las caidas documentadas.

*   Estado: status.findic.cl
*   Repositorio: Github

Podran ver los las caidas en los issues del repositorio.

### Infraestructura[](#infraestructura)

*   Se mejora el stack http

2026-03-14 | Versión 1.3.0[](#2026-03-14--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-1)

Se agrega barra de estado en la pantalla principal (home) de la web, con indicadores de latencia de consulta a la API, el total de consultas del Día anterior y el record de consultas alcanzados en un dia.

La latencia se calcula desde el navegador, por lo que puede variar dependiendo de tu conexión a internet, o si la página carga por primera vez.

**En el indicador de estado los colores serán**:

*   Verde: latencia menor a 200 ms.
*   Amarillo: Latencia desde los 200 ms.
*   Rojo: Latencia mayor a 1000 ms o hubo un error al cargar los indicadores.

2025-11-11 | Versión 1.3.0[](#2025-11-11--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-2)

*   Se agrega ejemplo de cómo consumir desde la API desde Python.

2025-11-06 | Versión 1.3.0[](#2025-11-06--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-3)

*   Se agrega sección de planificación de actualizaciones, mantenimiento y registro de incidencias. De este modo podremos avisar sobre futuros cambios con antelación y registrar todos los movimientos del servicio.

2025-11-04 | Versión 1.3.0[](#2025-11-04--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-4)

*   Se actualizó la documentación de la consulta de indicador por fecha.
*   Se agrega el apartado de SLA.

2025-11-02 | Versión 1.3.0[](#2025-11-02--versi%c3%b3n-130)
-----------------------------------------------------------

### Infraestructura[](#infraestructura-1)

*   Se migró el servidor a Chile, esto mejora notablemente la latencia en las consultas desde el territorio nacional.

2025-05-31 | Versión 1.3.0[](#2025-05-31--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-5)

*   Agregado indicador Libra cobre en la página principal
*   Correcciones menores
*   Actualización de documentación con los nuevos indicadores de cryptomonedas: Ethereum, Monero y Solana.

### API[](#api)

*   Se agregan nuevos indicadores a la API: Ethereum, Monero y Solana
*   Integramos en la API las cryptomonedas mencionadas anteriormente al resumen.
*   Mejora en obtención de indicadores de cryptomonedas.
*   Se incluyen las cryptomonedas Ethereum, Monero y Solana a la generación automática de archivos JSON y CSV.

Para resumir, la nueva tabla de indicadores es la siguiente:



* Nombre: Unidad de fomento (UF)
  * Fecha inicio valores: Valores desde el 1 de Agosto de 1977 hasta hoy.
* Nombre: Libra de Cobre
  * Fecha inicio valores: Valores desde el 5 de Octubre de 2012 hasta hoy.
* Nombre: Tasa de desempleo
  * Fecha inicio valores: Valores desde el 1 de Marzo de 2010 hasta hoy.
* Nombre: Euro
  * Fecha inicio valores: Valores desde el 4 de Enero de 1999 hasta hoy.
* Nombre: Imacec
  * Fecha inicio valores: Valores desde el 1 de Enero de 1997 hasta hoy.
* Nombre: Dólar observado
  * Fecha inicio valores: Valores desde el 9 de Agosto de 1982 hasta hoy.
* Nombre: Tasa Política Monetaria (TPM)
  * Fecha inicio valores: Valores desde el 7 de Febrero de 1998 hasta hoy.
* Nombre: Indice de valor promedio (IVP)
  * Fecha inicio valores: Valores desde el 1 de Enero de 1990 hasta hoy.
* Nombre: Indice de Precios al Consumidor (IPC)
  * Fecha inicio valores: Valores desde el 3 de Marzo de 1928 hasta hoy.
* Nombre: Dólar acuerdo
  * Fecha inicio valores: Valores desde el 29 de Septiembre de 1982 hasta hoy.
* Nombre: Unidad Tributaria Mensual (UTM)
  * Fecha inicio valores: Valores desde el 1 de Enero de 1990 hasta hoy.
* Nombre: IPSA (Índice de Precios Selectivo de Acciones)
  * Fecha inicio valores: Valores desde el 2 de Enero de 1989 hasta hoy.
* Nombre: Yen (Pesos por Yen)
  * Fecha inicio valores: Valores desde el 3 de Enero de 1994 hasta hoy.
* Nombre: Bitcoin
  * Fecha inicio valores: Valores desde el 14 de Julio de 2010 hasta hoy.
* Nombre: Ethereum
  * Fecha inicio valores: Valores desde el 08 de Agosto de 2015 hasta hoy.
* Nombre: Monero
  * Fecha inicio valores: Valores desde el 22 de Mayo de 2014 hasta hoy.
* Nombre: Solana
  * Fecha inicio valores: Valores desde el 11 de Abril de 2020 hasta hoy.


2025-05-10 | Versión 1.2.2[](#2025-05-10--versi%c3%b3n-122)
-----------------------------------------------------------

### Web[](#web-6)

*   Agregado indicador YEN en la página principal
*   Correcciones menores

### API[](#api-1)

*   Cambio definición currency IPSA
*   Grandes optimización en endpoint resumen de indicadores.
*   Optimizaciones menores en obtención de indicadores (por fecha, año o últimos registros).

2025-05-11 | Versión 1.2.1[](#2025-05-11--versi%c3%b3n-121)
-----------------------------------------------------------

*   Mejoras en la codificación de JSON

*   Mejoras en los controladores y modelos


2025-05-11 | Versión 1.2.0[](#2025-05-11--versi%c3%b3n-120)
-----------------------------------------------------------

Se agregan varias mejoras tanto en WEB como en la API, veremos algunas de ellas comenzando por Web.

### Web[](#web-7)

*   Se agregó el indicador del IPSA y del YEN en la pantalla de inicio (reútilizando la consulta de resumen), se planean seguir agregando más.

*   Los ejemplos de código fueron mejorados con el resaltado de syntaxis de código, ya no se muestran como texto plano.

*   Se creó una sección nueva en la documentación para mostrar y explicar cómo funcionan los archivos estáticos generados por la API.

*   Se mejoraron las fuentes.


### API[](#api-2)

*   Obtención de datos mejorada, ahora existen menos probabilidades que se caiga el servicio de obtención de datos (distinto al servicio que se los entrega a ustedes).

*   Se implementaron tareas para generar archivos CSV comprimidos con tódo el historial de cada serie de indicadores.

*   Se implementaron tareas para generar recursos JSON estáticos, dando la posibilidad de descargarlos o acceder directamente a toda la colección de datos de cada indicador (Util para APPS y Backend).


2025-05-03 | Versión 1.1.0[](#2025-05-03--versi%c3%b3n-110)
-----------------------------------------------------------

Se agregaron los indicadores de **IPSA** y del **YEN Japonés** (pesos por yen) a los registros, están incluidos en el resumen y en su respectivas consultas de históricos.


|Nombre                                        |Fecha inicio valores                          |
|----------------------------------------------|----------------------------------------------|
|IPSA (Índice de Precios Selectivo de Acciones)|Valores desde el 2 de Enero de 1989 hasta hoy.|
|Yen (Pesos por Yen)                           |Valores desde el 3 de Enero de 1994 hasta hoy.|


La documentación se actualizó con los últimos cambios y también se agregó este changelog para mantener trazabilidad de los cambios.

2025-04-30 | Versión 1.0.0[](#2025-04-30--versi%c3%b3n-100)
-----------------------------------------------------------

Se solicitó el dominio findic.cl; se cargó la WEB en el servidor y se levantó la API con doce indicadores económicos.


|Nombre                               |Fecha inicio valores                                |
|-------------------------------------|----------------------------------------------------|
|Unidad de fomento (UF)               |Valores desde el 1 de Agosto de 1977 hasta hoy.     |
|Libra de Cobre                       |Valores desde el 5 de Octubre de 2012 hasta hoy.    |
|Tasa de desempleo                    |Valores desde el 1 de Marzo de 2010 hasta hoy.      |
|Euro                                 |Valores desde el 4 de Enero de 1999 hasta hoy.      |
|Imacec                               |Valores desde el 1 de Enero de 1997 hasta hoy.      |
|Dólar observado                      |Valores desde el 9 de Agosto de 1982 hasta hoy.     |
|Tasa Política Monetaria (TPM)        |Valores desde el 7 de Febrero de 1998 hasta hoy.    |
|Indice de valor promedio (IVP)       |Valores desde el 1 de Enero de 1990 hasta hoy.      |
|Indice de Precios al Consumidor (IPC)|Valores desde el 3 de Marzo de 1928 hasta hoy.      |
|Dólar acuerdo                        |Valores desde el 29 de Septiembre de 1982 hasta hoy.|
|Unidad Tributaria Mensual (UTM)      |Valores desde el 1 de Enero de 1990 hasta hoy.      |
|Bitcoin                              |Valores desde el 14 de Julio de 2010 hasta hoy.     |


Las rutas básicas de la api contienen los endpoints para obtener el **resumen diario**, **último mes** e **histórico por fecha** o **histórico por año**.

5 - Actualizaciones y mantenimiento
-----------------------------------

En esta sección se mostrará información de planeación de actualizaciones, mantenimiento e incidentes respecto al servicio de **findic.cl** en modo resumido y claro, esto para anunciarlo a los desarrolladores y que estén pendientes de la continuidad del servicio.

Podrás ver todas las actualizaciones, mantenciones e incidentes de forma más detallada en sus respectivas entradas de la documentación.

Futuras actualizaciones[](#futuras-actualizaciones)
---------------------------------------------------

**No** hay planificación de futuras actualizaciones.

Programación de mantenimiento[](#programaci%c3%b3n-de-mantenimiento)
--------------------------------------------------------------------

**No** hay mantenciones programadas.

Incidencias[](#incidencias)
---------------------------

Las incidencias y el estado del servicio está siendo mantenido en su página status.findic.cl, desde acá podrás ver métricas como el tiempo de respuesta (desde EE.UU.), el histórico de uptime (porcentaje), también las incidencias o caídas del servicio.

En esta página también encontrarás el enlace al repositorio de Github donde se mantiene el histórico de incidencias del servicio.

Si quieres reportar una incidencia, puedes escribirme al correo [](mailto:hectoralvarez.dev@gmail.com)
hectoralvarez.dev@gmail.com.

5.1 - Actualizaciones
---------------------

Registro de todas las actualizaciones planificadas

Hasta el momento no se han efectuado actualizaciones.

5.2 - Mantenimientos
--------------------

Registro de todas las planificaciones de mantenimiento

### 2025-11-16 21:00 hrs - Eliminación servidor Nueva Jersey[](#2025-11-16-2100-hrs---eliminaci%c3%b3n-servidor-nueva-jersey)

Se eliminó el servidor ubicado en Nueva Jersey, Estados Unidos. Se eliminó ya que el servidor de **Nueva Jersey** estaba en desuso y se migró findic al servidor actual, ubicado en **Santiago de Chile**, de este modo se liberaron recursos para mantener sólo el servidor nuevo.

**Estado**: Realizado.
**Duración estimada**: 1 minuto.
**Servicios comprometidos**: Ninguno.
**Incidencias durante la mantención**: Ninguna.

6 - SLA y Buenas Prácticas
--------------------------

Acuerdo de Nivel de Servicio (SLA) y uso responsable de la API

**Findic.cl** ofrece acceso público y gratuito a su API bajo un modelo de uso compartido (**best effort**). El servicio está diseñado para ser estable y accesible para toda la comunidad, por lo que su uso responsable es fundamental.

### Objetivos de servicio[](#objetivos-de-servicio)

*   **Disponibilidad:** 99.0% mensual.
*   **Latencia promedio:** ≤ 150 ms en condiciones normales de operación en territorio nacional.
*   **Capacidad recomendada:** ~60 solicitudes por minuto (promedio) por usuario (Un usuario es una IP distinta).

    > Se permiten picos ocasionales por encima de este nivel, pero no se recomienda mantener un uso continuo mayor a este valor para no degradar la experiencia de otros usuarios.


### Uso responsable[](#uso-responsable)

*   Evita consultas masivas o repetitivas que puedan **degradar el servicio**.
*   Implementa **caché local** siempre que sea posible.
*   No intentes sobrepasar de forma sostenida los límites recomendados.

### Limitaciones[](#limitaciones)

El servicio gratuito se entrega **“tal cual” (as is)**, sin garantías formales ni compensaciones por interrupciones. Findic.cl puede suspender o modificar temporalmente la API por mantenimiento (previamente notificado por medio de esta web), o por razones técnicas mayores.

### Revisión[](#revisi%c3%b3n)

Este SLA puede actualizarse en cualquier momento. . $dailyIndicators->uf->valor;

?>

```


Más información del objeto JSON entregado en el resumen aquí.

1.2 - JavaScript
----------------

Uso de JavaScript para obtener datos desde la API de indicadores.

A continuación se muestra el código de ejemplo para consultar a nuestra API desde el Lenguaje JavaScript, este ejemplo te puede ser útil si lo quieres utilizar en tu página web y quieres actualizar el HTML directamente.

urltomarkdowncodeblockplaceholder10.6695670481745948

Más información del objeto JSON entregado en el resumen aquí.

1.3 - Python
------------

Uso de Python para obtener datos desde la API de indicadores.

A continuación se muestra el código de ejemplo para consultar a nuestra API desde el Lenguaje Python:

urltomarkdowncodeblockplaceholder20.24630583958717644

Más información del objeto JSON entregado en el resumen aquí.

2 - Endpoints
-------------

Aprende como utilizar y realizar consultas a las distintas rutas que provee la API de findic.cl.

Como mencionamos anteriormente y antes de continuar con la visita a nuestra nuestra API, primero debemos proveer de los códigos necesarios para cada uno de los diecisiete indicadores.

Puedes volver a esta página para consultar por estos y nuevos indicadores.

Códigos de Indicadores[](#c%c3%b3digos-de-indicadores)
------------------------------------------------------

El código de cada indicador, debe escribirse en **minúsculas**, respetando los **guiones bajos** (en caso de necesitarlos), ya que es sensible a mayúsculas y minúsculas, siendo elementos distintos **uf** de **UF** o **Uf**.

urltomarkdowntableplaceholder10.4697815152881344

2.1 - Obtener resumen
---------------------

Ruta para obtener el resumen diario de los indicadores

La ruta base de la API retorna el resumen de los indicadores diarios, mostrando los indicadores del día en curso o en caso de criptomonedas, el valor de cierre de el día anterior.

Algunos indicadores son mensuales o se entregan con meses de atraso, por lo que puede variar la fecha del último registro.

Ruta a consultar[](#ruta-a-consultar)
-------------------------------------

La siguiente ruta entrega el resumen diario, el método de consulta es **GET**:

El resultado entregado será similar al siguiente objeto JSON:

urltomarkdowncodeblockplaceholder30.10472661939695338

2.2 - Obtener datos por indicador
---------------------------------

Ruta para obtener datos del último mes por indicador

A la ruta base de la API se le suma el código del indicador, así podemos obtener los últimos 31 registros en una lista de serie, otorgándonos una vista más amplia.

Ruta a consultar[](#ruta-a-consultar)
-------------------------------------

La siguiente ruta entrega los últimos 31 registros de nuestro indicador consultado, es necesario especificar el código del indicador, el método de consulta es **GET**:

urltomarkdowncodeblockplaceholder40.8027381786425167

ejemplo:

El resultado entregado será similar al siguiente objeto JSON:

urltomarkdowncodeblockplaceholder50.3529358567121239

2.3 - Obtener datos por fechas
------------------------------

Ruta para obtener datos del indicador por año o fecha

A la ruta por indicador, se le puede agregar otro parámetro especificando una fecha (**dd-mm-yyyy**) o agregar un año (**yyyy**), de este modo podemos obtener **un día en específico** o los datos de **un año completo** según necesitemos.

Rutas a consultar[](#rutas-a-consultar)
---------------------------------------

La siguientes rutas entrega los datos de un día o un año en específico de nuestro indicador consultado, es necesario especificar el código del indicador, el método de consulta es **GET**:

### Obtener datos del indicador en un día en específico[](#obtener-datos-del-indicador-en-un-d%c3%ada-en-espec%c3%adfico)

Puedes consultar por un registro en un día en específico, pero debes saber que existen algunos indicadores económicos que **no se actualizan todos los días** (ej: el dolar) y también existen indicadores que son **mensuales**, por lo que si consultas por alguna fecha que no exista, la serie se devolverá **vacía**.

En el caso de los que son mensuales, es recomendable que busques esos indicadores siempre con la fecha **01-mm-yyyy**, por lo que si deseas consultar el **UTM** de Septiembre de 1998, el formato sería el siguiente: **01-09-1998**.

Los indicadores mensuales son:

*   IMACEC
*   IPC
*   TASA DESEMPLEO
*   UTM

La ruta es la siguiente:

urltomarkdowncodeblockplaceholder60.15970846974382114

ejemplo:

urltomarkdowncodeblockplaceholder70.8747499796281943

el resultado sería el siguiente:

urltomarkdowncodeblockplaceholder80.29315611534007435

en caso que **no existan** registros en la fecha buscada, el resultado sería el siguiente:

urltomarkdowncodeblockplaceholder90.7102821027922062

### Obtener datos del indicador en un año en específico[](#obtener-datos-del-indicador-en-un-a%c3%b1o-en-espec%c3%adfico)

La ruta es la siguiente:

urltomarkdowncodeblockplaceholder100.0002566570363278231

ejemplo:

urltomarkdowncodeblockplaceholder110.37991259457422855

el resultado sería el siguiente:

urltomarkdowncodeblockplaceholder120.0964968772115502

3 - Históricos
--------------

Findic proporciona archivos históricos de todos los indicadores para descarga.

Proporcionamos dos tipos de archivo para descarga, archivos **CSV** y archivos **JSON**. Estos archivos son generados todos los días a las 07:30 A.M. Hora de Santiago Continental. Estos archivos son pre-comprimidos para una consulta rápida (Ya que son archivos relativamente grandes y sería costoso volver a parsearlos y comprimirlos en cada consulta).

Entregamos tódo el histórico de cada serie (puedes consultar la fecha del inicio de los registros de cada serie en la página principal de la documentación), así tendrás una fuente de datos para realizar análisis o mostrar un rango más amplio de gráficas en tus aplicaciones con una única consulta de serie.

¿Cómo consumir u obtener los históricos?[](#c%c3%b3mo-consumir-u-obtener-los-hist%c3%b3ricos)
---------------------------------------------------------------------------------------------

Existen actualmente dos rutas para poder acceder a los históricos, el primero entrega el archivo **CSV** comprimido dentro de un archivo **ZIP** y el otro es la ruta directa al archivo **JSON**.

Al ser archivos estáticos, las consultas se comportarán de manera distinta; por ejemplo el **CSV** comenzará la descarga de este y por otro lado, el archivo **JSON** se mostrará como si fuera una consulta a la API.

### Rutas de los históricos en formato CSV[](#rutas-de-los-hist%c3%b3ricos-en-formato-csv)

Los archivos **CSV** están sólo en formato **ZIP** para descarga, y están en la siguiente ruta:

urltomarkdowncodeblockplaceholder130.33328630619425303

los códigos son los siguientes:

urltomarkdowntableplaceholder20.9530477122037593

### Rutas de los históricos en formato JSON[](#rutas-de-los-hist%c3%b3ricos-en-formato-json)

Los archivos **JSON** se pueden ver y descargar, gracias a que proveemos del archivo JSON para consulta directa y un archivo **ZIP** para descarga.

Para consultar puedes recurrir a la siguiente ruta:

urltomarkdowncodeblockplaceholder140.025236403372267402

Y si los quieres descargar, puedes hacerlo con la siguiente:

urltomarkdowncodeblockplaceholder150.6267840803255262

los códigos son los siguientes:

urltomarkdowntableplaceholder30.43040226660358294

4 - Changelog
-------------

Cambios en la WEB y API de findic.cl

2026-03-21 | Versión 1.3.0[](#2026-03-21--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web)

Se crea página de estado para mantener seguimiento del servicio, utilizando la herramienta Upptime para tener métricas de latencia, el porcentaje de uptime y tener las caidas documentadas.

*   Estado: status.findic.cl
*   Repositorio: Github

Podran ver los las caidas en los issues del repositorio.

### Infraestructura[](#infraestructura)

*   Se mejora el stack http

2026-03-14 | Versión 1.3.0[](#2026-03-14--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-1)

Se agrega barra de estado en la pantalla principal (home) de la web, con indicadores de latencia de consulta a la API, el total de consultas del Día anterior y el record de consultas alcanzados en un dia.

La latencia se calcula desde el navegador, por lo que puede variar dependiendo de tu conexión a internet, o si la página carga por primera vez.

**En el indicador de estado los colores serán**:

*   Verde: latencia menor a 200 ms.
*   Amarillo: Latencia desde los 200 ms.
*   Rojo: Latencia mayor a 1000 ms o hubo un error al cargar los indicadores.

2025-11-11 | Versión 1.3.0[](#2025-11-11--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-2)

*   Se agrega ejemplo de cómo consumir desde la API desde Python.

2025-11-06 | Versión 1.3.0[](#2025-11-06--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-3)

*   Se agrega sección de planificación de actualizaciones, mantenimiento y registro de incidencias. De este modo podremos avisar sobre futuros cambios con antelación y registrar todos los movimientos del servicio.

2025-11-04 | Versión 1.3.0[](#2025-11-04--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-4)

*   Se actualizó la documentación de la consulta de indicador por fecha.
*   Se agrega el apartado de SLA.

2025-11-02 | Versión 1.3.0[](#2025-11-02--versi%c3%b3n-130)
-----------------------------------------------------------

### Infraestructura[](#infraestructura-1)

*   Se migró el servidor a Chile, esto mejora notablemente la latencia en las consultas desde el territorio nacional.

2025-05-31 | Versión 1.3.0[](#2025-05-31--versi%c3%b3n-130)
-----------------------------------------------------------

### Web[](#web-5)

*   Agregado indicador Libra cobre en la página principal
*   Correcciones menores
*   Actualización de documentación con los nuevos indicadores de cryptomonedas: Ethereum, Monero y Solana.

### API[](#api)

*   Se agregan nuevos indicadores a la API: Ethereum, Monero y Solana
*   Integramos en la API las cryptomonedas mencionadas anteriormente al resumen.
*   Mejora en obtención de indicadores de cryptomonedas.
*   Se incluyen las cryptomonedas Ethereum, Monero y Solana a la generación automática de archivos JSON y CSV.

Para resumir, la nueva tabla de indicadores es la siguiente:

urltomarkdowntableplaceholder40.9001464227831704

2025-05-10 | Versión 1.2.2[](#2025-05-10--versi%c3%b3n-122)
-----------------------------------------------------------

### Web[](#web-6)

*   Agregado indicador YEN en la página principal
*   Correcciones menores

### API[](#api-1)

*   Cambio definición currency IPSA
*   Grandes optimización en endpoint resumen de indicadores.
*   Optimizaciones menores en obtención de indicadores (por fecha, año o últimos registros).

2025-05-11 | Versión 1.2.1[](#2025-05-11--versi%c3%b3n-121)
-----------------------------------------------------------

*   Mejoras en la codificación de JSON

*   Mejoras en los controladores y modelos


2025-05-11 | Versión 1.2.0[](#2025-05-11--versi%c3%b3n-120)
-----------------------------------------------------------

Se agregan varias mejoras tanto en WEB como en la API, veremos algunas de ellas comenzando por Web.

### Web[](#web-7)

*   Se agregó el indicador del IPSA y del YEN en la pantalla de inicio (reútilizando la consulta de resumen), se planean seguir agregando más.

*   Los ejemplos de código fueron mejorados con el resaltado de syntaxis de código, ya no se muestran como texto plano.

*   Se creó una sección nueva en la documentación para mostrar y explicar cómo funcionan los archivos estáticos generados por la API.

*   Se mejoraron las fuentes.


### API[](#api-2)

*   Obtención de datos mejorada, ahora existen menos probabilidades que se caiga el servicio de obtención de datos (distinto al servicio que se los entrega a ustedes).

*   Se implementaron tareas para generar archivos CSV comprimidos con tódo el historial de cada serie de indicadores.

*   Se implementaron tareas para generar recursos JSON estáticos, dando la posibilidad de descargarlos o acceder directamente a toda la colección de datos de cada indicador (Util para APPS y Backend).


2025-05-03 | Versión 1.1.0[](#2025-05-03--versi%c3%b3n-110)
-----------------------------------------------------------

Se agregaron los indicadores de **IPSA** y del **YEN Japonés** (pesos por yen) a los registros, están incluidos en el resumen y en su respectivas consultas de históricos.

urltomarkdowntableplaceholder50.3217310729043743

La documentación se actualizó con los últimos cambios y también se agregó este changelog para mantener trazabilidad de los cambios.

2025-04-30 | Versión 1.0.0[](#2025-04-30--versi%c3%b3n-100)
-----------------------------------------------------------

Se solicitó el dominio findic.cl; se cargó la WEB en el servidor y se levantó la API con doce indicadores económicos.

urltomarkdowntableplaceholder60.6326530081112152

Las rutas básicas de la api contienen los endpoints para obtener el **resumen diario**, **último mes** e **histórico por fecha** o **histórico por año**.

5 - Actualizaciones y mantenimiento
-----------------------------------

En esta sección se mostrará información de planeación de actualizaciones, mantenimiento e incidentes respecto al servicio de **findic.cl** en modo resumido y claro, esto para anunciarlo a los desarrolladores y que estén pendientes de la continuidad del servicio.

Podrás ver todas las actualizaciones, mantenciones e incidentes de forma más detallada en sus respectivas entradas de la documentación.

Futuras actualizaciones[](#futuras-actualizaciones)
---------------------------------------------------

**No** hay planificación de futuras actualizaciones.

Programación de mantenimiento[](#programaci%c3%b3n-de-mantenimiento)
--------------------------------------------------------------------

**No** hay mantenciones programadas.

Incidencias[](#incidencias)
---------------------------

Las incidencias y el estado del servicio está siendo mantenido en su página status.findic.cl, desde acá podrás ver métricas como el tiempo de respuesta (desde EE.UU.), el histórico de uptime (porcentaje), también las incidencias o caídas del servicio.

En esta página también encontrarás el enlace al repositorio de Github donde se mantiene el histórico de incidencias del servicio.

Si quieres reportar una incidencia, puedes escribirme al correo [](mailto:hectoralvarez.dev@gmail.com)
hectoralvarez.dev@gmail.com.

5.1 - Actualizaciones
---------------------

Registro de todas las actualizaciones planificadas

Hasta el momento no se han efectuado actualizaciones.

5.2 - Mantenimientos
--------------------

Registro de todas las planificaciones de mantenimiento

### 2025-11-16 21:00 hrs - Eliminación servidor Nueva Jersey[](#2025-11-16-2100-hrs---eliminaci%c3%b3n-servidor-nueva-jersey)

Se eliminó el servidor ubicado en Nueva Jersey, Estados Unidos. Se eliminó ya que el servidor de **Nueva Jersey** estaba en desuso y se migró findic al servidor actual, ubicado en **Santiago de Chile**, de este modo se liberaron recursos para mantener sólo el servidor nuevo.

**Estado**: Realizado.
**Duración estimada**: 1 minuto.
**Servicios comprometidos**: Ninguno.
**Incidencias durante la mantención**: Ninguna.

6 - SLA y Buenas Prácticas
--------------------------

Acuerdo de Nivel de Servicio (SLA) y uso responsable de la API

**Findic.cl** ofrece acceso público y gratuito a su API bajo un modelo de uso compartido (**best effort**). El servicio está diseñado para ser estable y accesible para toda la comunidad, por lo que su uso responsable es fundamental.

### Objetivos de servicio[](#objetivos-de-servicio)

*   **Disponibilidad:** 99.0% mensual.
*   **Latencia promedio:** ≤ 150 ms en condiciones normales de operación en territorio nacional.
*   **Capacidad recomendada:** ~60 solicitudes por minuto (promedio) por usuario (Un usuario es una IP distinta).

    > Se permiten picos ocasionales por encima de este nivel, pero no se recomienda mantener un uso continuo mayor a este valor para no degradar la experiencia de otros usuarios.


### Uso responsable[](#uso-responsable)

*   Evita consultas masivas o repetitivas que puedan **degradar el servicio**.
*   Implementa **caché local** siempre que sea posible.
*   No intentes sobrepasar de forma sostenida los límites recomendados.

### Limitaciones[](#limitaciones)

El servicio gratuito se entrega **“tal cual” (as is)**, sin garantías formales ni compensaciones por interrupciones. Findic.cl puede suspender o modificar temporalmente la API por mantenimiento (previamente notificado por medio de esta web), o por razones técnicas mayores.

### Revisión[](#revisi%c3%b3n)

Este SLA puede actualizarse en cualquier momento.
