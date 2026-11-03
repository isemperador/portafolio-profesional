# Portafolio Profesional - Ismael Jhostin Braco Ruiz

Este proyecto es una plataforma web de portafolio profesional de alto impacto visual y técnico, desarrollada especialmente con una estética **Cyber-Executive (Rojo Rubí & Negro Profundo)** y funcionalidad completa de acuerdo a tus requerimientos.

---

## 🚀 Características Implementadas

1. **Paleta de Colores & Diseño:**
   - **Rojo (#ff2b4c / #dc2626) y Negro Carbón (#070709 / #0f0f14)** con efectos de neón, glassmorphism y bordes iluminados.
   - Tipografía moderna: `Space Grotesk` y `JetBrains Mono`.

2. **Modo Claro & Modo Oscuro:**
   - Selector en la barra de navegación (☀️ / 🌙) con guardado persistente en `localStorage`.
   - Modo Oscuro: Estilo cyberpunk ejecutivo con acentos en rojo neón.
   - Modo Claro: Estilo minimalista corporativo con acentos rubí y alto contraste.

3. **Efectos Interactivos de Cursor (2 Modos):**
   - **⚡ Modo Rayos Eléctricos:** Arcos de plasma y chispas eléctricas rojas que siguen la trayectoria del cursor y se descargan en tiempo real.
   - **💻 Modo Códigos de Programación:** Glyphs y fragmentos de código (`<?php`, `$db->query()`, `SQL`, `fn()`, `0101`, `SENATI`, `Workers`) que flotan y se desvanecen con resplandor.
   - **Botón en la barra superior:** Permite alternar entre Rayos, Códigos o desactivar los efectos.

4. **Generador Dinámico de Códigos QR (Offline / Online):**
   - Librería integrada localmente (`qrcode.min.js`).
   - 4 Modos rápidos:
     - 🌐 **URL de Portafolio** (detecta la URL actual o permite ingresar la que desees).
     - 👤 **Tarjeta de Contacto vCard Completa** (al escanear con la cámara del celular, guarda tus datos: Nombre, Teléfono, Correo, SENATI, Ubicación).
     - 💬 **WhatsApp Directo** (+51 952 388 325 con mensaje predefinido).
     - 📧 **Correo Electrónico**.
   - Botón **"Descargar QR (PNG)"** para imprimirlo o llevarlo en el teléfono.
   - Botón **"Modo Pantalla Completa"** para presentarlo en ferias laborales o entrevistas.

5. **Showcase de los 8 Proyectos Solicitados:**
   - Cada proyecto incluye tarjeta interactiva, URL visible, etiquetas de stack y botón de detalles:
     1. **Neurolee** (`https://neurolee.netlify.app/`)
     2. **Invoice Platform** (`https://chimerical-valkyrie-fa5cbb.netlify.app/`)
     3. **FirmaDoc / Firma Digital** (`https://pcomedicalperu.com/firma-digital/panel_admin.php`)
     4. **Sistema de Reservas Docentes** (`https://reservas.isemperadorbr.workers.dev/`)
     5. **NEXO Digital Cards** (`https://nexo-tarjetas-digitales.isemperadorbr.workers.dev/`)
     6. **NEXO SST - Plataforma IPERC** (`https://31b001d9.nexo-sst-plataforma.pages.dev/`) - *En desarrollo*
     7. **Mensajes Masivos por Correo** (`https://mensajesmasivosporcorreo.netlify.app/`)
     8. **Separador Inteligente de Camas** (`https://separadorinteligente.netlify.app/`)

6. **Curriculum Vitae Integrado:**
   - Botón flotante y en el menú **"Ver CV"**.
   - Modal con todo el contenido de tu CV de SENATI formateado.
   - Botón **"Imprimir / Guardar como PDF"** con hoja de estilos optimizada para que salga limpio en una hoja sin encabezados de la web.
   - Botón **"Descargar HTML"**.

---

## 📂 Estructura de Archivos

```
ismael-braco-portfolio/
├── index.html        # Estructura principal y secciones
├── styles.css        # Estilos, temas (dark/light), animaciones y print
├── script.js         # Canvas de rayos, código QR, modales y lógica
├── qrcode.min.js     # Motor offline de generación de códigos QR
└── README.md         # Documentación de uso y despliegue
```

---

## 🌐 Cómo Ver el Portafolio en tu Navegador

Simplemente abre el archivo `index.html` haciendo doble clic desde el Explorador de Windows o con tu navegador preferido (Chrome, Edge, Firefox).

Ubicación del archivo:
`C:\Users\evolu\.gemini\antigravity\scratch\ismael-braco-portfolio\index.html`

---

## 🚀 Despliegue Gratuito en la Web (Netlify o Cloudflare Pages)

Para tener tu portafolio online con un enlace como `https://ismael-braco.netlify.app`:
1. Ingresa a [Netlify Drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `ismael-braco-portfolio`.
3. ¡Listo! En 10 segundos tendrás tu enlace público para colocarlo en tu QR y en tu CV.
