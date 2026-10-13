# CreditMonitor

Aplicación móvil académica desarrollada con **Ionic + Angular + Capacitor** para apoyar el seguimiento y la gestión de información financiera personal. El proyecto integra navegación por pestañas, control de deudas, almacenamiento local, consumo de servicios web, geolocalización, mapa interactivo, cámara, escaneo QR, multimedia y conectividad BLE/NFC.

> Proyecto práctico final de **Programación de Dispositivos Móviles — ISW-307**.

---

## Descripción del proyecto

**CreditMonitor** centraliza varias funciones de apoyo financiero dentro de una sola aplicación. Desde el panel principal el usuario puede consultar información de tarjetas, movimientos y estado financiero, además de acceder a módulos para gestionar deudas, revisar créditos disponibles, utilizar herramientas móviles y administrar su perfil.

El proyecto está construido como una aplicación **Angular Standalone** con interfaz Ionic y acceso a funciones nativas mediante Capacitor.

---

## Funcionalidades principales

- Inicio de sesión y registro local de usuarios.
- Dashboard financiero con tarjetas, movimientos y score crediticio.
- Indicador de conexión **Online / Offline**.
- Gestión de deudas mediante un **CRUD completo**:
  - Crear.
  - Leer.
  - Actualizar.
  - Eliminar.
- Persistencia local de deudas utilizando **`@ionic/storage-angular`**.
- Pull-to-refresh e interacción con elementos deslizables.
- Consumo de API REST con operaciones **GET y POST** mediante `HttpClient`.
- Geolocalización GPS con **`@capacitor/geolocation`**.
- Mapa interactivo con **Leaflet** y marcadores.
- Escaneo de dispositivos **Bluetooth Low Energy (BLE)**.
- Funcionalidad NFC con fallback mediante Web NFC cuando está disponible.
- Captura de fotografías mediante **`@capacitor/camera`**.
- Escaneo de códigos QR con **`@capacitor-mlkit/barcode-scanning`**.
- Reproductor de audio con controles de reproducción, pausa, detener y desplazamiento.
- Perfil de usuario con fotografía y datos editables.
- Simulador de crédito.
- Módulo de salud financiera.
- Generación de estados/documentos PDF mediante **jsPDF**.

---

## Tecnologías utilizadas

| Tecnología | Versión / uso |
|---|---|
| Ionic | `@ionic/angular ^9.0.0` |
| Angular | `22.0.1` |
| Capacitor | `8.5.2` |
| TypeScript | `~6.0.0` |
| Ionic Storage | `@ionic/storage-angular ^4.0.0` |
| Bluetooth LE | `@capacitor-community/bluetooth-le ^8.3.0` |
| Cámara | `@capacitor/camera ^8.2.5` |
| Geolocalización | `@capacitor/geolocation ^8.2.3` |
| Escáner QR | `@capacitor-mlkit/barcode-scanning ^8.2.1` |
| Leaflet | `^1.9.4` |
| jsPDF | `^4.2.1` |
| RxJS | `~7.8.0` |

---

## Estructura principal del proyecto

```text
CREDITMONITOR--app-master/
├── android/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── camara/
│   │   │   ├── centro-informacion/
│   │   │   ├── login/
│   │   │   ├── podcasts/
│   │   │   ├── salud-financiera/
│   │   │   ├── simulador-credito/
│   │   │   └── welcome/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── audio-player.service.ts
│   │   │   ├── deudas-storage.service.ts
│   │   │   └── profile-storage.ts
│   │   ├── tab1/
│   │   ├── tab2/
│   │   ├── tab3/
│   │   ├── tabs/
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   └── assets/
│       ├── audio/
│       └── CREDITOMONITOR.jpg
├── angular.json
├── capacitor.config.ts
├── ionic.config.json
├── package.json
└── README.md
```

---

## Requisitos previos

Antes de ejecutar el proyecto se recomienda tener instalado:

- **Node.js LTS**.
- **npm**.
- Git.
- Visual Studio Code o un editor equivalente.
- Ionic CLI, opcional para ejecutar `ionic serve`.
- Android Studio para compilar y probar la aplicación en Android.
- JDK compatible con la versión de Gradle utilizada por Android Studio.

Para comprobar Node y npm:

```bash
node -v
npm -v
npx -v
```

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Luego entrar a la carpeta del proyecto:

```bash
cd CREDITMONITOR--app-master
```

### 2. Instalar las dependencias

```bash
npm install
```

---

## Ejecutar en el navegador

La forma más directa es:

```bash
npm start
```

También puede ejecutarse con Ionic CLI:

```bash
npx @ionic/cli serve
```

Si `@ionic/cli` está instalado globalmente:

```bash
ionic serve
```

> El proyecto está configurado como `angular-standalone`. Evite usar `npx ionic serve`, porque ese comando puede descargar el paquete antiguo `ionic` en lugar del paquete actual `@ionic/cli`.

---

## Ejecutar en Android

Primero generar la versión web:

```bash
npm run build
```

Sincronizar los archivos con Capacitor:

```bash
npx cap sync android
```

Abrir el proyecto Android:

```bash
npx cap open android
```

Desde Android Studio se puede ejecutar la app en un emulador o en un dispositivo Android físico con la **Depuración USB** activada.

> Funciones como BLE, cámara y GPS se prueban mejor en un dispositivo físico.

---

## Módulos del proyecto

### Inicio / Dashboard

Presenta el resumen financiero del usuario, tarjetas, movimientos, score crediticio, estado de conexión y accesos a otras herramientas. También integra pruebas de servicios web mediante GET y POST.

### Deudas

Implementa el módulo de almacenamiento local con un CRUD completo utilizando `@ionic/storage-angular`.

El servicio principal se encuentra en:

```text
src/app/services/deudas-storage.service.ts
```

Operaciones principales:

```text
crear()        -> CREATE
obtenerTodas() -> READ
actualizar()   -> UPDATE
eliminar()     -> DELETE
```

### Créditos disponibles / QR

Permite consultar ofertas de crédito y escanear códigos QR mediante `@capacitor-mlkit/barcode-scanning`.

### GPS y mapa

Utiliza `@capacitor/geolocation` para obtener la ubicación actual y **Leaflet + OpenStreetMap** para mostrar el mapa y marcadores de sucursales.

### BLE / NFC

Incluye escaneo de dispositivos Bluetooth Low Energy mediante `@capacitor-community/bluetooth-le` y una demostración de transmisión NFC cuando Web NFC está disponible.

### Cámara

Permite capturar fotografías mediante `@capacitor/camera`.

### Multimedia

Incluye un reproductor de audio propio mediante la API `Audio`, con controles de reproducción, pausa, detener y posición del audio.

### Perfil

Permite consultar y modificar datos del usuario, seleccionar una fotografía de perfil y cerrar sesión.

### API REST

El servicio se encuentra en:

```text
src/app/services/api.service.ts
```

Actualmente utiliza:

```text
https://jsonplaceholder.typicode.com/posts
```

Operaciones implementadas:

- `GET` para consultar publicaciones.
- `POST` para crear una publicación de prueba.
- Timeout para controlar solicitudes que tardan demasiado.

---

## Persistencia y CRUD

El módulo de deudas almacena la información bajo una clave local de Ionic Storage. Esto permite conservar los registros incluso después de actualizar o cerrar la aplicación, según el almacenamiento disponible en el dispositivo.

Ejemplo conceptual del CRUD:

```text
CREATE -> Agregar una nueva deuda.
READ   -> Mostrar las deudas almacenadas.
UPDATE -> Modificar una deuda existente.
DELETE -> Eliminar una deuda utilizando su ID.
```

---

## Capturas de pantalla

Antes de la entrega final, agregue en el repositorio una carpeta como:

```text
docs/screenshots/
```

Y coloque evidencias de los principales módulos, por ejemplo:

```text
docs/screenshots/login.png
docs/screenshots/dashboard.png
docs/screenshots/deudas.png
docs/screenshots/deuda-nueva.png
docs/screenshots/mapa.png
docs/screenshots/ble.png
docs/screenshots/camara.png
docs/screenshots/qr.png
docs/screenshots/podcasts.png
docs/screenshots/api.png
```

Después pueden mostrarse en este README así:

```md
![Dashboard](docs/screenshots/dashboard.png)
![CRUD de Deudas](docs/screenshots/deudas.png)
```

---

## Equipo de trabajo

Complete los datos antes de entregar el repositorio.

| Integrante | Matrícula | Módulo / responsabilidad |
|---|---|---|
| Héctor Ovalles Alonzo | 100046429 | Unidad 9 — Almacenamiento / CRUD con Ionic Storage |
| Rossany Estevez Jerez | 100056457 | Unidad 7 — Multimedia |
| Randy Marte | 100065891 | Unidad 8 — Cámara / QR |
| Michel Carolina Fajardo Polanco | 100053908 | Unidad 10 — Servicios Web |
| Chrismarlyn Taveras Ramos | 100074265 | Unidades 1–6 / Interfaz-Navegación- Noticias |

---

## Scripts disponibles

```bash
npm start
```

Inicia el servidor de desarrollo de Angular.

```bash
npm run build
```

Genera el build del proyecto.

```bash
npm test
```

Ejecuta las pruebas configuradas.

```bash
npm run lint
```

Ejecuta el análisis de código con ESLint.

---

## Consideraciones de seguridad

Este proyecto fue desarrollado con fines **académicos y demostrativos**. Algunas funciones de usuario y sesión utilizan almacenamiento local del navegador/dispositivo.

Para una versión de producción se recomienda:

- No guardar contraseñas en texto plano.
- Utilizar un backend seguro para autenticación.
- Aplicar hash y salting de contraseñas.
- Utilizar tokens de sesión seguros.
- Validar toda la información recibida desde APIs.
- Proteger claves y configuraciones sensibles mediante variables de entorno.

---

## Estado del proyecto

Proyecto académico funcional en desarrollo/fase de integración final. Las funciones nativas dependen de los permisos y capacidades del dispositivo donde se ejecuta la aplicación.

---

## Licencia

Proyecto desarrollado con fines educativos para la asignatura **Programación de Dispositivos Móviles — ISW-307**.
