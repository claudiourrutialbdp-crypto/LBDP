# Liceo - Sitio Web Institucional

## Descripción
Sitio web institucional del Liceo con información académica, noticias, calendarios y diario mural digital.

## Estructura del Proyecto

### Páginas HTML (15 archivos)
- `index.html` - Página principal con noticias y diario mural
- `admision.html` - Proceso de admisión
- `calendario-actividades.html` - Calendario de actividades escolares
- `calendario-evaluaciones.html` - Calendario de evaluaciones
- `contacto.html` - Información de contacto
- `documentos.html` - Documentos institucionales
- `nosotros-*.html` - Páginas sobre el liceo (historia, misión, comunidad, PME, visión)
- `noticias.html` - Listado de noticias
- `oferta.html` - Oferta educativa
- `talleres.html` - Talleres extraescolares
- `uniforme.html` - Información sobre uniforme escolar

### Recursos CSS
- `assets/css/liceo.css` - Estilos principales (usado por todas las páginas)
- `assets/css/calendar.css` - Estilos específicos para calendarios
- `assets/img/` - Imágenes del sitio

### JavaScript
- `js/news-loader.js` - Carga noticias desde JSON (usado por index.html y noticias.html)
- `js/calendar.js` - Funcionalidad del calendario de actividades
- `js/calendar-evaluaciones.js` - Funcionalidad del calendario de evaluaciones

### Datos
- `data/news.json` - Noticias del sitio
- `data/mural.json` - **Entradas del diario mural (SOLO LECTURA)**
- `data/activities.csv` - Actividades del calendario
- `data/evaluaciones.csv` - Evaluaciones del calendario

### Componentes Dinámicos
- `components/topbar.html` - Barra superior
- `components/navbar.html` - Navegación principal  
- `components/footer.html` - Pie de página

**Nota:** Solo 4 páginas usan componentes dinámicos: `calendario-actividades.html`, `calendario-evaluaciones.html`, `nosotros-comunidad.html`, y `oferta.html`. Las demás páginas tienen el HTML completo.

## Diario Mural Digital

### Características
- **Solo lectura**: No permite crear, editar o eliminar entradas
- **Fuente de datos**: Carga exclusivamente desde `data/mural.json`
- **Filtrado**: Por categorías (Comunicados, Eventos, Académico, Recordatorio)
- **Ordenamiento**: Entradas destacadas primero, luego por fecha (más recientes primero)
- **Responsive**: Adaptado para dispositivos móviles

### Estructura de datos (mural.json)
```json
{
  "id": "identificador_único",
  "title": "Título de la entrada",
  "body": "Contenido de la entrada",
  "cat": "Categoría (Comunicados|Eventos|Académico|Recordatorio)",
  "pinned": true/false,
  "createdAt": "2025-07-01T10:00:00Z"
}
```

### Para agregar nuevas entradas
1. Editar el archivo `data/mural.json`
2. Agregar la nueva entrada siguiendo la estructura JSON
3. La página se actualizará automáticamente

## Tecnologías Utilizadas
- HTML5 semántico
- CSS3 con Bootstrap 5.3.3
- JavaScript vanilla (ES6+)
- Bootstrap Icons
- Arquitectura estática (sin framework)

## Limpieza Realizada
Se eliminaron los siguientes archivos no utilizados:
- `js/components.js` - Funciones duplicadas de carga de componentes
- `frontend/` - Proyecto React/Vue abandonado

## Mantenimiento
Para mantener el sitio actualizado:
1. **Noticias**: Editar `data/news.json`
2. **Mural**: Editar `data/mural.json`
3. **Calendarios**: Editar `data/activities.csv` y `data/evaluaciones.csv`
4. **Contenido**: Editar directamente los archivos HTML correspondientes

