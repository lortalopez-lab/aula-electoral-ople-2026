# Aula Electoral · OPLEV 2026–2027

Plataforma independiente de estudio para el examen de conocimientos de aspirantes a integrar Consejos Distritales del OPLE Veracruz.

## Fuente académica única
**Guía de Estudios del Proceso Electoral Local Ordinario 2026–2027**, elaborada por el Centro de Estudios de Opinión y Análisis de la Universidad Veracruzana, octubre de 2026.

El archivo completo, **Guia_estudio_2026.pdf** (127 páginas), está incluido en este repositorio. Los fundamentos de las respuestas se comprueban contra el texto del PDF aportado; no se utilizan leyes ni fuentes externas.

## Versión 2
- **146 reactivos didácticos verificados**: 68 de conocimiento normativo, 54 de identificación de artículos y 24 casos prácticos. Son ejercicios propios, no preguntas oficiales.
- Cuatro opciones y una explicación con artículo/ordenamiento, evidencia literal y página del PDF.
- Preguntas autónomas, sin encabezados que revelen la respuesta y sin fragmentos truncados.
- Estudio completo de los nueve apartados normativos, buscador y seguimiento de apartados estudiados.
- Prácticas configurables y simulacros de 50 preguntas con límite de 120 minutos.
- Historial de intentos, porcentajes, preguntas falladas y refuerzo.
- Pantallas adaptables a computadora, tableta y celular.
- Acceso por nombre de usuario: **Rosario** o **LuisOrta**. No se muestran las cuentas disponibles; cada perfil conserva estadísticas separadas.

## Guardado y sincronización
Por ahora, cada usuario guarda sus datos **en el navegador del dispositivo**, no entre dispositivos. La sincronización entre celular y computadora **todavía no está activada**. Es necesario habilitar un proyecto de base de datos independiente con control de acceso antes de anunciarla como funcional. El archivo `sync-config.js` contiene los parámetros públicos de configuración y permanece vacío hasta completar esa integración.

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
