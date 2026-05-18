# Colorfly Studio - Generador de Paletas 🎨

Bienvenido al repositorio de **Colorfly Studio**, una herramienta interactiva para generar paletas de colores de forma rápida e intuitiva. 
Este proyecto fue desarrollado como Proyecto Integrador para el Módulo 1 (Full Stack) por **Enzo Villalba**.

## 🚀 Características y Funcionalidades

- **Generación Aleatoria:** Crea esquemas de colores presionando un solo botón.
- **Renderizado Dinámico:** Elige visualizar entre 6, 8 o 9 colores simultáneamente.
- **Bloqueo de Colores:** Mantén los colores que te gusten haciendo clic en el ícono del candado 🔒 y genera nuevos colores para el resto.
- **Formatos Múltiples:** Visualiza el valor de cada color en formato **HEX** y **HSL**.
- **Copiar al Portapapeles:** Haz clic sobre el código HEX de cualquier color para copiarlo al instante. Aparecerá un microfeedback visual (Toast).
- **Persistencia de Datos:** La última paleta generada se guarda automáticamente en `localStorage`, de manera que no pierdas tu trabajo si recargas la página.
- **Diseño Moderno:** Interfaz con "Glassmorphism", animaciones de entrada, Dark Mode por defecto y responsive design con CSS Grid.

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico y estructura accesible (roles, aria-labels).
- **CSS3:** Flexbox, CSS Grid, Variables Nativas, Transformaciones y Transiciones.
- **JavaScript (Vanilla):** Manipulación del DOM, control de estado (Arrays/Objetos), `localStorage` y API de Portapapeles.
- **Phosphor Icons:** Biblioteca de iconos ligeros.

## 💻 Instrucciones de Instalación y Uso Local

Para correr este proyecto en tu entorno local, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/EnzoVillalba/ProyectoM1_EnzoVillalba.git
   ```
2. **Acceder a la carpeta:**
   ```bash
   cd ProyectoM1_EnzoVillalba
   ```
3. **Ejecutar la aplicación:**
   Como es una aplicación web estática, no necesitas instalar dependencias (node_modules ni paquetes). Simplemente abre el archivo `index.html` en tu navegador web de preferencia (doble clic) o utiliza una extensión como **Live Server** en VSCode.

## 🏗️ Decisiones Técnicas

1. **Arquitectura HTML:** Se usaron etiquetas como `<header>` y `<main>` para segmentar lógicamente la app. Las notificaciones utilizan `aria-live="polite"` y `role="alert"` para cumplir con los estándares básicos de accesibilidad de lectores de pantalla.
2. **Estrategia CSS:** Se decidió no utilizar frameworks como Tailwind o Bootstrap. En su lugar, se crearon variables globales de CSS (`:root`) para mantener la coherencia del esquema de colores "Slate". Se utilizó **CSS Grid** en el `.palette-container` con `grid-template-columns` dinámico desde JavaScript, para repartir el ancho equitativamente (ej: `repeat(6, 1fr)`).
3. **Manejo de Estado (JS):** Todo se controla desde la variable `currentPalette`, que es un arreglo de objetos. Al centralizar la "fuente de verdad" en este array, las funciones como "Bloquear", "Generar" o "Cambiar tamaño" simplemente mutan el estado y luego llaman a `saveAndRender()`, manteniendo la UI sincronizada de forma eficiente.

## 🌐 Despliegue

La aplicación se encuentra desplegada y pública a través de **GitHub Pages**. 
Puedes probarla en vivo aquí: **[Demo de Colorfly Studio](https://Enzo20011.github.io/ProyectoM1_EnzoVillalba/)**

---
*Hecho por Enzo Villalba.*
