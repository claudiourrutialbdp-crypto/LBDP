/**
 * Calendario de Evaluaciones con Filtro por Curso
 * Carga datos desde JSON con estructura completa de evaluaciones
 */

class EvaluacionesCalendar {
  constructor(containerId, dataFile) {
    this.container = document.getElementById(containerId);
    this.dataFile = dataFile;
    this.evaluaciones = [];
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.selectedCurso = 'all';
    
    this.monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Empezar con lunes
    this.dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    this.estrategiaColors = {
      'Prueba': 'bg-danger text-white',
      'Prueba Escrita': 'bg-danger text-white',
      'Oral': 'bg-warning text-dark',
      'Examen Oral': 'bg-warning text-dark',
      'Laboratorio': 'bg-info text-white',
      'Trabajo de Laboratorio': 'bg-info text-white',
      'Ensayo': 'bg-primary text-white',
      'Trabajo Escrito': 'bg-primary text-white',
      'Práctica': 'bg-success text-white',
      'Evaluación Práctica': 'bg-success text-white',
      'Disertación': 'bg-secondary text-white',
      'Presentación': 'bg-secondary text-white',
      'Proyecto': 'bg-dark text-white',
      'Taller': 'bg-purple text-white'
    };
    
    this.init();
  }
  
  async init() {
    await this.loadEvaluaciones();
    this.extractCursos();
    this.render();
    this.attachEventListeners();
  }
  
  extractCursos() {
    // Extraer cursos únicos del JSON
    const cursosSet = new Set();
    this.evaluaciones.forEach(evaluacion => {
      if (evaluacion.curso && evaluacion.curso.trim() !== '') {
        cursosSet.add(evaluacion.curso.trim());
      }
    });
    this.cursos = Array.from(cursosSet).sort();
  }
  
  async loadEvaluaciones() {
    try {
      const response = await fetch(this.dataFile);
      
      // Detectar si es JSON o CSV por la extensión del archivo
      if (this.dataFile.endsWith('.json')) {
        const jsonData = await response.json();
        this.evaluaciones = jsonData;
      } else if (this.dataFile.endsWith('.csv')) {
        const csvText = await response.text();
        this.evaluaciones = this.parseCSV(csvText);
      } else {
        console.error('Formato de archivo no soportado');
        this.evaluaciones = [];
      }
    } catch (error) {
      console.error('Error cargando evaluaciones:', error);
      this.evaluaciones = [];
    }
  }
  
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const evaluaciones = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const evaluacion = {};
        headers.forEach((header, index) => {
          evaluacion[header.trim()] = values[index] ? values[index].trim() : '';
        });
        evaluaciones.push(evaluacion);
      }
    }
    
    return evaluaciones;
  }
  
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="h5 mb-0">${this.monthNames[this.currentMonth]} ${this.currentYear}</h2>
            <div class="btn-group">
              <button id="prevMonth" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button id="todayBtn" class="btn btn-outline-primary btn-sm">Hoy</button>
              <button id="nextMonth" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="cursoFilter" class="form-label small">Filtrar por curso:</label>
            <select id="cursoFilter" class="form-select form-select-sm">
              <option value="all">Todos los cursos</option>
              ${this.cursos.map(curso => `<option value="${curso}">${curso}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="calendar-grid">
          ${this.renderDayHeaders()}
          ${this.renderCalendarGrid()}
        </div>
        
        <div class="mt-4">
          <h3 class="h6 mb-3">
            <i class="bi bi-list-ul me-2"></i>Evaluaciones del Mes
            ${this.selectedCurso !== 'all' ? `<span class="badge bg-primary ms-2">${this.selectedCurso}</span>` : ''}
          </h3>
          <div class="list-group">
            ${this.renderMonthList()}
          </div>
        </div>
      </div>
    `;
  }
  
  renderDayHeaders() {
    return this.dayNames.map(day => 
      `<div class="calendar-day-header">${day}</div>`
    ).join('');
  }
  
  renderCalendarGrid() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Ajustar para que la semana empiece el lunes
    const dayOfWeek = firstDay.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - diff);
    
    let html = '';
    let currentDate = new Date(startDate);
    
    // Renderizar 6 semanas para cubrir todos los casos
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
        const isToday = this.isToday(currentDate);
        const evaluaciones = this.getEvaluacionesForDate(currentDate);
        const hasEvaluaciones = evaluaciones.length > 0;
        
        let classes = 'calendar-day';
        if (!isCurrentMonth) classes += ' other-month';
        if (isToday) classes += ' today';
        if (hasEvaluaciones) classes += ' has-event';
        
        html += `
          <div class="${classes}" data-date="${currentDate.toISOString().split('T')[0]}">
            <div class="day-number">${currentDate.getDate()}</div>
            ${hasEvaluaciones ? `
              <div class="event-indicators">
                ${evaluaciones.slice(0, 3).map(ev => {
                  const colorClass = this.estrategiaColors[ev.estrategia_evaluacion] || 'bg-secondary text-white';
                  return `<span class="badge ${colorClass} badge-sm">${ev.asignatura}</span>`;
                }).join('')}
                ${evaluaciones.length > 3 ? `<small class="text-muted">+${evaluaciones.length - 3} más</small>` : ''}
              </div>
            ` : ''}
          </div>
        `;
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return html;
  }
  
  renderMonthList() {
    const evaluaciones = this.getEvaluacionesForMonth();
    
    if (evaluaciones.length === 0) {
      return `
        <div class="list-group-item text-center text-muted py-4">
          <i class="bi bi-calendar-x fs-1 d-block mb-2"></i>
          No hay evaluaciones programadas para este mes
          ${this.selectedCurso !== 'all' ? ` en ${this.selectedCurso}` : ''}
        </div>
      `;
    }
    
    return evaluaciones.map(evaluacion => {
      const colorClass = this.estrategiaColors[evaluacion.estrategia_evaluacion] || 'bg-secondary text-white';
      const fecha = new Date(evaluacion.fecha + 'T00:00:00');
      const fechaStr = fecha.toLocaleDateString('es-CL', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
      
      return `
      <div class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between align-items-start mb-2">
          <div>
            <h5 class="mb-1">
              <span class="badge ${colorClass} me-2">${evaluacion.estrategia_evaluacion}</span>
              ${evaluacion.asignatura}
            </h5>
            <p class="mb-1 text-muted small">
              <i class="bi bi-person me-1"></i>${evaluacion.profesor} 
              <span class="ms-3"><i class="bi bi-mortarboard me-1"></i>${evaluacion.curso}</span>
            </p>
          </div>
          <small class="text-primary fw-bold">
            <i class="bi bi-calendar3 me-1"></i>${fechaStr}
          </small>
        </div>
        
        <div class="mb-2">
          <strong class="small text-secondary">Contenido:</strong>
          <p class="mb-1 small">${evaluacion.contenido}</p>
        </div>
        
        ${evaluacion.indicadores_evaluacion ? `
        <div class="mb-2">
          <strong class="small text-secondary">Indicadores de Evaluación:</strong>
          <p class="mb-1 small">${evaluacion.indicadores_evaluacion}</p>
        </div>
        ` : ''}
        
        ${evaluacion.retroalimentacion ? `
        <div class="mb-0">
          <strong class="small text-secondary">Retroalimentación:</strong>
          <p class="mb-0 small">${evaluacion.retroalimentacion}</p>
        </div>
        ` : ''}
      </div>
    `;
    }).join('');
  }
  
  getEvaluacionesForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return this.evaluaciones.filter(evaluacion => {
      const evaluacionDate = evaluacion.fecha;
      const matchesDate = evaluacionDate === dateString;
      const matchesCurso = this.selectedCurso === 'all' || evaluacion.curso === this.selectedCurso;
      return matchesDate && matchesCurso;
    });
  }
  
  getEvaluacionesForMonth() {
    return this.evaluaciones.filter(evaluacion => {
      const evaluacionDate = new Date(evaluacion.fecha + 'T00:00:00');
      const matchesMonth = evaluacionDate.getMonth() === this.currentMonth && 
                          evaluacionDate.getFullYear() === this.currentYear;
      const matchesCurso = this.selectedCurso === 'all' || evaluacion.curso === this.selectedCurso;
      return matchesMonth && matchesCurso;
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }
  
  isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  attachEventListeners() {
    // Navegación de meses
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');
    const cursoFilter = document.getElementById('cursoFilter');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        this.render();
        this.attachEventListeners();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        this.render();
        this.attachEventListeners();
      });
    }
    
    // Botón "Hoy"
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        this.render();
        this.attachEventListeners();
      });
    }
    
    // Filtro de cursos
    if (cursoFilter) {
      cursoFilter.value = this.selectedCurso;
      cursoFilter.addEventListener('change', (e) => {
        this.selectedCurso = e.target.value;
        this.render();
        this.attachEventListeners();
      });
    }
  }
}

// Inicializar calendario cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (typeof EvaluacionesCalendar !== 'undefined') {
    new EvaluacionesCalendar('calendar', './data/evaluaciones.json');
  }
});

