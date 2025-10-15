/**
 * Calendario Avanzado con Vista Mensual y Filtros
 * Carga datos desde CSV y permite navegación por meses
 */

class AdvancedCalendar {
  constructor(containerId, csvFile) {
    this.container = document.getElementById(containerId);
    this.csvFile = csvFile;
    this.activities = [];
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.selectedCategory = 'all';
    
    this.monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    this.dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    this.categoryColors = {
      'Ceremonia': 'bg-primary text-white',
      'Reunión': 'bg-info text-white', 
      'Académico': 'bg-success text-white',
      'Cultural': 'bg-warning text-dark',
      'Celebración': 'bg-danger text-white',
      'Deportivo': 'bg-secondary text-white',
      'Feriado': 'bg-dark text-white',
      'Vacaciones': 'bg-light text-dark'
    };
    
    this.init();
  }
  
  async init() {
    await this.loadActivities();
    this.render();
    this.attachEventListeners();
  }
  
  async loadActivities() {
    try {
      const response = await fetch(this.csvFile);
      const csvText = await response.text();
      this.activities = this.parseCSV(csvText);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      this.activities = [];
    }
  }
  
  parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const activities = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const activity = {};
        headers.forEach((header, index) => {
          activity[header.trim()] = values[index] ? values[index].trim() : '';
        });
        activities.push(activity);
      }
    }
    
    return activities;
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
            <select class="form-select form-select-sm" id="categoryFilter" style="width: auto;">
              <option value="all">Todas las categorías</option>
              <option value="Ceremonia">Ceremonia</option>
              <option value="Reunión">Reunión</option>
              <option value="Académico">Académico</option>
              <option value="Cultural">Cultural</option>
              <option value="Celebración">Celebración</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Feriado">Feriado</option>
              <option value="Vacaciones">Vacaciones</option>
            </select>
          </div>
        </div>
        
        <!-- Vista del Calendario -->
        <div class="calendar-grid" id="calendarGrid">
          ${this.renderCalendarGrid()}
        </div>
        
        <!-- Lista de Actividades del Día -->
        <div class="mt-4">
          <h4 class="h6 mb-3">Actividades del Mes</h4>
          <div class="activities-list" id="activitiesList">
            ${this.renderActivitiesList()}
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
        const dayActivities = this.getActivitiesForDate(currentDate);
        const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
        const isToday = this.isToday(currentDate);
        const hasActivities = dayActivities.length > 0;
        
        html += `
          <div class="calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${hasActivities ? 'has-activities' : ''}" 
               data-date="${currentDate.toISOString().split('T')[0]}">
            <div class="day-number">${currentDate.getDate()}</div>
            <div class="day-activities">
              ${dayActivities.slice(0, 2).map(activity => `
                <div class="activity-dot ${this.categoryColors[activity.categoria] || 'bg-secondary'}" 
                     title="${activity.titulo}">
                  <small>${activity.titulo.substring(0, 15)}${activity.titulo.length > 15 ? '...' : ''}</small>
                </div>
              `).join('')}
              ${dayActivities.length > 2 ? `<small class="text-muted">+${dayActivities.length - 2} más</small>` : ''}
            </div>
          </div>
        `;
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      html += '</div>';
      
      // Si ya pasamos del mes actual y no hay más actividades, terminamos
      if (currentDate.getMonth() !== this.currentMonth && week > 3) {
        break;
      }
    }
    
    html += '</div>';
    return html;
  }
  
  renderActivitiesList() {
    const monthActivities = this.getActivitiesForMonth();
    
    if (monthActivities.length === 0) {
      return '<p class="text-muted">No hay actividades programadas para este mes.</p>';
    }
    
    return monthActivities.map(activity => `
      <div class="activity-item card mb-2">
        <div class="card-body p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge ${this.categoryColors[activity.categoria] || 'bg-secondary'}">${activity.categoria}</span>
                <small class="text-muted">${new Date(activity.fecha).toLocaleDateString('es-CL')}</small>
                ${activity.hora ? `<small class="text-muted">${activity.hora}</small>` : ''}
              </div>
              <h6 class="mb-1">${activity.titulo}</h6>
              <p class="small text-muted mb-0">${activity.descripcion}</p>
              ${activity.lugar ? `<small class="text-primary"><i class="bi bi-geo-alt me-1"></i>${activity.lugar}</small>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  getActivitiesForDate(date) {
    const dateString = date.toISOString().split('T')[0];
    return this.activities.filter(activity => {
      const activityDate = activity.fecha;
      const matchesDate = activityDate === dateString;
      const matchesCategory = this.selectedCategory === 'all' || activity.categoria === this.selectedCategory;
      return matchesDate && matchesCategory;
    });
  }
  
  getActivitiesForMonth() {
    return this.activities.filter(activity => {
      const activityDate = new Date(activity.fecha);
      const matchesMonth = activityDate.getMonth() === this.currentMonth && activityDate.getFullYear() === this.currentYear;
      const matchesCategory = this.selectedCategory === 'all' || activity.categoria === this.selectedCategory;
      return matchesMonth && matchesCategory;
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
    
    // Filtro de categorías
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.selectedCategory = e.target.value;
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
    const activities = this.activities.filter(activity => activity.fecha === dateString);
    const date = new Date(dateString);
    
    if (activities.length === 0) {
      return;
    }
    
    // Simple modal/alert con detalles del día
    const activitiesList = activities.map(activity => 
      `• ${activity.titulo} ${activity.hora ? `(${activity.hora})` : ''}`
    ).join('\n');
    
    alert(`Actividades del ${date.toLocaleDateString('es-CL')}:\n\n${activitiesList}`);
  }
}