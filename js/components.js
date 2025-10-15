/**
 * Component Loader - Carga componentes HTML reutilizables
 */

class ComponentLoader {
  constructor() {
    this.components = new Map();
  }

  async loadComponent(elementId, filePath) {
    try {
      // Si ya tenemos el componente en cache, lo usamos
      if (this.components.has(filePath)) {
        document.getElementById(elementId).innerHTML = this.components.get(filePath);
        return;
      }

      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      this.components.set(filePath, html);
      
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = html;
      }
    } catch (error) {
      console.error(`Error cargando componente ${filePath}:`, error);
    }
  }

  async loadAllComponents() {
    const components = [
      { id: 'topbar', path: './components/topbar.html' },
      { id: 'navbar', path: './components/navbar.html' },
      { id: 'footer', path: './components/footer.html' }
    ];

    // Cargar componentes en paralelo
    const promises = components.map(component => 
      this.loadComponent(component.id, component.path)
    );

    await Promise.all(promises);
    
    // Inicializar página después de cargar componentes
    this.initializePage();
  }

  initializePage() {
    // Año en footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Back to top functionality
    this.initializeBackToTop();
    
    // Navbar effects
    this.initializeNavbarEffects();
    
    // Reveal animations
    this.initializeRevealAnimations();
  }

  initializeBackToTop() {
    const backTop = document.getElementById('backTop');
    if (!backTop) return;

    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 240);
    });
    
    backTop.addEventListener('click', () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  initializeNavbarEffects() {
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar-liceo');
      if (navbar) {
        navbar.classList.toggle('navbar-elevated', window.scrollY > 12);
      }
    });
  }

  initializeRevealAnimations() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // Método para actualizar el link activo en la navegación
  setActiveNavLink(currentPage) {
    // Remover active de todos los links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Agregar active al link actual
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
}

// Instancia global del loader
const componentLoader = new ComponentLoader();

// Función de conveniencia para uso en las páginas
window.loadComponents = function() {
  return componentLoader.loadAllComponents();
};

// Auto-ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => componentLoader.loadAllComponents());
} else {
  componentLoader.loadAllComponents();
}