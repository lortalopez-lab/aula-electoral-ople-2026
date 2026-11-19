# Aula Electoral · OPLEV 2026–2027

Plataforma independiente de estudio para el examen de conocimientos de aspirantes a integrar Consejos Distritales del OPLE Veracruz.

## Fuente académica única
**Guía de Estudios del Proceso Electoral Local Ordinario 2026–2027**, elaborada por el Centro de Estudios de Opinión y Análisis de la Universidad Veracruzana, octubre de 2026.

El archivo completo, **Guia_estudio_2026.pdf** (127 páginas), está incluido en este repositorio. Los fundamentos de las respuestas se comprueban contra el texto del PDF aportado; no se utilizan leyes ni fuentes externas.

## Versión 2
- **455 reactivos didácticos de conocimiento, identificación normativa y aplicación, con referencias contrastadas contra la guía: 253 de conocimiento, 119 de identificación de artículos y 83 de aplicación.
- Cuatro opciones y una explicación con artículo/ordenamiento, evidencia literal y página del PDF.
- Preguntas autónomas, sin encabezados que revelen la respuesta y sin fragmentos truncados.
- Estudio completo de los nueve apartados normativos, buscador y seguimiento de apartados estudiados.
- Prácticas configurables y simulacros de 50 preguntas con límite de 120 minutos.
- Historial de intentos, porcentajes, preguntas falladas y refuerzo.
- Pantallas adaptables a computadora, tableta y celular.
- Acceso por nombre de usuario: **Rosario** o **LuisOrta**. No se muestran las cuentas disponibles; cada perfil conserva estadísticas separadas.

## Guardado y sincronización
La plataforma está conectada con el proyecto **EstudioOple** en Supabase. Las respuestas, intentos, preguntas pendientes y apartados estudiados se conservan por separado para `Rosario` y `LuisOrta` y se sincronizan al entrar, durante el estudio y al volver a abrir la pestaña. Existe copia local para fallos de conexión. **Importante:** el acceso es únicamente mediante nombre de usuario, sin contraseña; sirve para organizar perfiles, pero no ofrece autenticación ni privacidad frente a terceros. Cualquiera con acceso al sitio puede introducir el nombre de uno de los perfiles. Si se requiere protección real, debe añadirse autenticación individual.

El acceso solo por nombre de usuario **no es autenticación segura**: otra persona que conozca el nombre podría acceder al perfil. Para privacidad real se necesita un factor de autenticación adicional, como PIN o contraseña.

## Despliegue
GitHub Pages: https://lortalopez-lab.github.io/aula-electoral-ople-2026/

Configuración: **Settings → Pages → Deploy from a branch → main → /(root)**.

## Archivos
- `index.html`, `styles.css`: interfaz adaptable.
- `app.js`: inicio de sesión, prácticas, simulacros e historial.
- `questions.js`: 146 reactivos y referencias verificables.
- `guia.js`: texto de las páginas del PDF.
- `Guia_estudio_2026.pdf`: guía original.
- `sync-config.js`: configuración pendiente de la futura sincronización.
- `supabase/schema.sql`: borrador anterior de esquema; **no implementado ni habilitado**. No utilizar sin revisión de seguridad y modelo de autenticación.
