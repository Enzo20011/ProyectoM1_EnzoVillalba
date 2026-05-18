# Documentación de Uso de Inteligencia Artificial

Durante el desarrollo de este Proyecto Integrador (Generador de Paletas para Colorfly Studio), utilicé Inteligencia Artificial como una herramienta de apoyo y consulta externa para resolver dudas puntuales de maquetación, entender mejor CSS Grid y generar las fórmulas matemáticas necesarias en JavaScript.

A continuación, detallo los prompts principales que utilicé y cómo me ayudaron a avanzar en el proyecto.

---

## 1. Estructura y Semántica HTML

**Objetivo:** Asegurarme de utilizar las etiquetas HTML5 correctas para el header, los controles y el contenedor principal, cumpliendo con buenas prácticas de accesibilidad.

**Prompt Utilizado:**
> "Estoy armando un proyecto web de un generador de paletas de colores. Necesito una estructura HTML5 semántica que incluya un header con un logo, un select para elegir la cantidad de colores (6, 8 o 9) y un botón principal. También necesito un contenedor principal (main) donde inyectaré tarjetas de color después."

**Resultado y Aplicación:**
La IA me sugirió usar `<header>`, `<main>` y agrupar los controles dentro de un `<div class="controls">`. También me recordó usar el atributo `aria-label` en el select y en el botón principal de "Generar Paleta" para mejorar la accesibilidad, lo cual integré directamente en mi `index.html`.

---

## 2. Layout con CSS Grid y Diseño Moderno

**Objetivo:** Distribuir las tarjetas de colores en una cuadrícula que se adapte automáticamente al espacio según si se eligen 6, 8 o 9 colores, y lograr un diseño moderno.

**Prompt Utilizado:**
> "¿Cómo puedo usar CSS Grid para que un contenedor muestre 6, 8 o 9 columnas del mismo tamaño que ocupen todo el alto de la pantalla restante? Además, ¿qué propiedades de CSS me recomiendas para hacer un efecto 'glassmorphism' (vidrio) en la UI?"

**Resultado y Aplicación:**
Me explicó cómo usar `grid-template-columns: repeat(X, 1fr)` dinámicamente desde JavaScript para dividir la pantalla en partes iguales. Además, me dio la propiedad `backdrop-filter: blur(12px)` para crear el efecto de vidrio esmerilado que apliqué en el header y en los contenedores de texto de las tarjetas de color.

---

## 3. Lógica de Generación de Colores y Conversión a HSL

**Objetivo:** Crear una función en JavaScript que genere códigos HEX aleatorios válidos y otra función que convierta esos códigos HEX a formato HSL, como pide la consigna.

**Prompt Utilizado:**
> "Necesito crear una función en JavaScript Vanilla que genere un código de color HEX aleatorio. Luego, necesito otra función que tome ese código HEX exacto y lo convierta a formato HSL (Hue, Saturation, Lightness) para poder renderizar ambos valores en pantalla."

**Resultado y Aplicación:**
Me proporcionó la función para generar el HEX usando `Math.random()`. También me resolvió el algoritmo matemático para transformar de HEX a HSL. Analicé el código, lo adapté a mi manejo de estado (donde guardo objetos con `{hex, hsl, locked}`) y lo incorporé en `app.js`.

---

## 4. Funcionalidad Extra: Copiar al Portapapeles y Notificaciones

**Objetivo:** Implementar los puntos extra de la consigna que permiten copiar el código del color al portapapeles y mostrar una pequeña notificación visual (Toast).

**Prompt Utilizado:**
> "¿Cuál es la mejor forma en JavaScript de copiar un texto al portapapeles al hacer clic? Además, quiero mostrar un pequeño mensaje flotante tipo 'Toast' que diga 'Copiado' y desaparezca automáticamente a los 2 segundos."

**Resultado y Aplicación:**
La IA me recomendó usar la API moderna `navigator.clipboard.writeText()` para la copia. Para el Toast, me sugirió usar `setTimeout` para agregar y remover una clase CSS de visibilidad después de 2000 milisegundos. Implementé esta lógica y armé yo mismo las transiciones en el archivo CSS.

---

*Hecho por Enzo Villalba.*
