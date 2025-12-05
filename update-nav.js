const fs = require('fs');
const path = require('path');

const navOld = `          <!-- Institución (mega) -->
          <li class="nav-item dropdown position-static">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Institución</a>
            <div class="dropdown-menu dropdown-mega shadow-lg border-0 p-4">
              <div class="row">
                <div class="col-lg-3 mb-3">
                  <div class="col-title">Nuestra Historia</div>
                  <a href="./nosotros-historia.html">Historia del Liceo</a>
                  <a href="./nosotros-mision.html">Misión, Visión y Sellos</a>
                </div>
                <div class="col-lg-3 mb-3">
                  <div class="col-title">Comunidad</div>
                  <a href="./nosotros-comunidad.html">Comunidad Educativa</a>
                  <a href="./nosotros-pme.html">Plan de Mejoramiento</a>
                </div>
              </div>
            </div>
          </li>

          <!-- Vida Escolar -->
          <li class="nav-item dropdown position-static">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Vida
              Escolar</a>
            <div class="dropdown-menu dropdown-mega shadow-lg border-0 p-4">
              <div class="row">
                <div class="col-lg-3 mb-3">
                  <div class="col-title">Académico</div>
                  <a href="./oferta.html">Oferta Educativa</a>
                  <a href="./calendario-evaluaciones.html">Calendario Evaluaciones</a>
                </div>
                <div class="col-lg-3 mb-3">
                  <div class="col-title">Actividades</div>
                  <a href="./calendario-actividades.html">Calendario de Actividades</a>
                  <a href="./talleres.html">Talleres Extraescolares</a>
                </div>
              </div>
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="./noticias.html">Noticias</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="./uniforme.html">Uniforme</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="./documentos.html">Documentos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="./contacto.html">Contacto</a>
          </li>`;

const navNew = `          <!-- Institución (mega) -->
          <li class="nav-item dropdown position-static">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Institución</a>
            <div class="dropdown-menu dropdown-mega shadow-lg border-0 p-4">
              <div class="row">
                <div class="col-lg-6 col-md-6 mb-3">
                  <a href="./nosotros-historia.html"><i class="bi bi-clock-history me-2"></i>Historia del Liceo</a>
                  <a href="./nosotros-mision.html"><i class="bi bi-bullseye me-2"></i>Misión, Visión y Sellos</a>
                  <a href="./nosotros-comunidad.html"><i class="bi bi-people me-2"></i>Comunidad Educativa</a>
                </div>
                <div class="col-lg-6 col-md-6 mb-3">
                  <a href="./nosotros-pme.html"><i class="bi bi-graph-up me-2"></i>Plan de Mejoramiento</a>
                  <a href="./documentos.html"><i class="bi bi-file-earmark-text me-2"></i>Documentos</a>
                  <a href="./noticias.html"><i class="bi bi-newspaper me-2"></i>Noticias</a>
                </div>
              </div>
            </div>
          </li>

          <!-- Académico -->
          <li class="nav-item dropdown position-static">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">Académico</a>
            <div class="dropdown-menu dropdown-mega shadow-lg border-0 p-4">
              <div class="row">
                <div class="col-lg-6 col-md-6 mb-3">
                  <a href="./horarios.html"><i class="bi bi-calendar3 me-2"></i>Horario de Clases</a>
                  <a href="./docentes.html"><i class="bi bi-person-badge me-2"></i>Nuestros Docentes</a>
                  <a href="./calendario-evaluaciones.html"><i class="bi bi-calendar-check me-2"></i>Calendario Evaluaciones</a>
                </div>
                <div class="col-lg-6 col-md-6 mb-3">
                  <a href="./talleres.html"><i class="bi bi-palette me-2"></i>Talleres Extraescolares</a>
                  <a href="./uniforme.html"><i class="bi bi-person-standing me-2"></i>Uniforme Escolar</a>
                  <a href="./calendario-actividades.html"><i class="bi bi-calendar-event me-2"></i>Actividades</a>
                </div>
              </div>
            </div>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="./oferta.html">Oferta</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="./contacto.html">Contacto</a>
          </li>`;

// Files to update (excluding index.html which is already done)
const files = fs.readdirSync('.').filter(f => 
  f.endsWith('.html') && 
  f !== 'index.html' && 
  f !== 'test-news.html'
);

let updated = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Normalize line endings
  const normalizedOld = navOld.replace(/\r\n/g, '\n');
  const normalizedContent = content.replace(/\r\n/g, '\n');
  
  if (normalizedContent.includes(normalizedOld)) {
    const newContent = normalizedContent.replace(normalizedOld, navNew);
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated:', file);
    updated++;
  } else if (content.includes('Vida Escolar') || content.includes('Vida\n              Escolar')) {
    console.log('Has old nav but pattern mismatch:', file);
  }
});

console.log(`\nTotal updated: ${updated}`);
