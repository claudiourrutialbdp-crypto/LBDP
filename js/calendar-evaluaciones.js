/**
 * Calendario de Evaluaciones con Filtro por Curso
 * Similar al calendario de actividades pero filtrado por curso
 */

class EvaluacionesCalendar {
  constructor(containerId, csvFile) {
    this.container = document.getElementById(containerId);
    this.csvFile = csvFile;
    this.evaluaciones = [];
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.selectedCurso = 'all';
    
    this.monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    this.dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    this.tipoColors = {
      'Prueba': 'bg-danger text-white',
      'Oral': 'bg-warning text-dark',
      'Laboratorio': 'bg-info text-white',
      'Ensayo': 'bg-primary text-white',
      'Práctica': 'bg-success text-white',
      'Disertación': 'bg-secondary text-white'
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
    // Extraer cursos únicos del CSV
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
      const response = await fetch(this.csvFile);
      const csvText = await response.text();
      this.evaluaciones = this.parseCSV(csvText);
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
    this.container.innerHTML = `
      <div class="calendar-container">
        <!-- Controles del Calendario -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div class="d-flex align-items-center gap-3">
            <button class="btn btn-outline-primary btn-sm" id="prevMonth">
              <i class="bi bi-chevron-left"></i>
            </button>
            <h3 class="h5 mb-0" id="monthYear">
              ${this.monthNames[this.currentMonth]} ${this.currentYear}
            </h3>
            <button class="btn btn-outline-primary btn-sm" id="nextMonth">
              <i class="bi bi-chevron-right"></i>
            </button>
          </div>
          
          <div class="d-flex align-items-center gap-3 flex-wrap">
            <button class="btn btn-outline-secondary btn-sm" id="todayBtn">Hoy</button>
            <select class="form-select form-select-sm" id="cursoFilter" style="width: auto;">
              <option value="all">Todos los cursos</option>
              <option value="1° Medio">1° Medio</option>
              <option value="2° Medio">2° Medio</option>
              <option value="3° Medio">3° Medio</option>
              <option value="4° Medio">4° Medio</option>
            </select>
          </div>
        </div>
        
        <!-- Vista del Calendario -->
        <div class="calendar-grid" id="calendarGrid">
          ${this.renderCalendarGrid()}
        </div>
        
        <!-- Lista de Evaluaciones del Mes -->
        <div class="mt-4">
          <h4 class="h6 mb-3">Evaluaciones del Mes</h4>
          <div class="activities-list" id="evaluacionesList">
            ${this.renderEvaluacionesList()}
          </div>
        </div>
      </div>
    `;
  }
  
  renderCalendarGrid() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let html = `
      <div class="calendar-header">
        ${this.dayNames.map(day => `<div class="calendar-day-name">${day}</div>`).join('')}
      </div>
      <div class="calendar-body">
    `;
    
    const currentDate = new Date(startDate);
    
    for (let week = 0; week < 6; week++) {
      html += '<div class="calendar-week">';
      
      for (let day = 0; day < 7; day++) {
        const dayEvaluaciones = this.getEvaluacionesForDate(currentDate);
        const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
        const isToday = this.isToday(currentDate);
        const hasEvaluaciones = dayEvaluaciones.length > 0;
        
        html += `
          <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${hasEvaluaciones ? 'has-evaluaciones' : ''}" 
               data-date="${currentDate.toISOString().split('T')[0]}">
            <div class="day-number">${currentDate.getDate()}</div>
            <div class="day-evaluaciones">
              ${dayEvaluaciones.slice(0, 2).map(evaluacion => `
                <div class="evaluacion-dot ${this.tipoColors[evaluacion.tipo] || 'bg-secondary'}" 
                     title="${evaluacion.asignatura} - ${evaluacion.curso}">
                  <small>${evaluacion.asignatura.substring(0, 12)}${evaluacion.asignatura.length > 12 ? '...' : ''}</small>
                </div>
              `).join('')}
              ${dayEvaluaciones.length > 2 ? `<small class="text-muted">+${dayEvaluaciones.length - 2} más</small>` : ''}
            </div>
          </div>
        `;
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      html += '</div>';
      
      // Si ya pasamos del mes actual y no hay más evaluaciones, terminamos
      if (currentDate.getMonth() !== this.currentMonth && week > 3) {
        break;
      }
    }
    
    html += '</div>';
    return html;
  }
  
  renderEvaluacionesList() {
    const monthEvaluaciones = this.getEvaluacionesForMonth();
    
    if (monthEvaluaciones.length === 0) {
      return '<p class="text-muted">No hay evaluaciones programadas para este mes' + 
             (this.selectedCurso !== 'all' ? ' en el curso seleccionado' : '') + '.</p>';
    }
    
    return monthEvaluaciones.map(evaluacion => `
      <div class="card border-0 shadow-sm mb-2">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span class="badge ${this.tipoColors[evaluacion.tipo] || 'bg-secondary'}">${evaluacion.tipo}</span>
                <span class="badge bg-primary">${evaluacion.curso}</span>
                <small class="text-muted">${new Date(evaluacion.fecha).toLocaleDateString('es-CL')}</small>
                ${evaluacion.hora ? `<small class="text-muted"><i class="bi bi-clock me-1"></i>${evaluacion.hora}</small>` : ''}
              </div>
              <h6 class="mb-1">${evaluacion.asignatura}</h6>
              ${evaluacion.sala ? `<small class="text-primary"><i class="bi bi-geo-alt me-1"></i>${evaluacion.sala}</small>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
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
      const evaluacionDate = new Date(evaluacion.fecha);
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
    document.getElementById('prevMonth').addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.render();
      this.attachEventListeners();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.render();
      this.attachEventListeners();
    });
    
    // Botón "Hoy"
    document.getElementById('todayBtn').addEventListener('click', () => {
      const today = new Date();
      this.currentMonth = today.getMonth();
      this.currentYear = today.getFullYear();
      this.render();
      this.attachEventListeners();
    });
    
    // Filtro de cursos
    const cursoFilterElement = document.getElementById('cursoFilter');
    cursoFilterElement.value = this.selectedCurso;
    cursoFilterElement.addEventListener('change', (e) => {
      this.selectedCurso = e.target.value;
      this.render();
      this.attachEventListeners();
    });
    
    // Click en días del calendario
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
      dayEl.addEventListener('click', (e) => {
        const date = e.currentTarget.getAttribute('data-date');
        this.showDayDetails(date);
      });
    });
  }
  
  showDayDetails(dateString) {
    const evaluaciones = this.evaluaciones.filter(evaluacion => {
      const matchesDate = evaluacion.fecha === dateString;
      const matchesCurso = this.selectedCurso === 'all' || evaluacion.curso === this.selectedCurso;
      return matchesDate && matchesCurso;
    });
    const date = new Date(dateString);
    
    if (evaluaciones.length === 0) {
      return;
    }
    
    // Simple modal/alert con detalles del día
    const evaluacionesList = evaluaciones.map(evaluacion => 
      `• ${evaluacion.asignatura} (${evaluacion.tipo}) - ${evaluacion.curso} ${evaluacion.hora ? `a las ${evaluacion.hora}` : ''} ${evaluacion.sala ? `en ${evaluacion.sala}` : ''}`
    ).join('\n');
    
    alert(`Evaluaciones del ${date.toLocaleDateString('es-CL')}:\n\n${evaluacionesList}`);
  }
}
