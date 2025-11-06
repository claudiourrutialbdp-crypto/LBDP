/**
 * Load Components - Carga componentes HTML dinámicamente
 * Topbar, Navbar y Footer centralizados
 */

// Función para cargar un componente
async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Error loading ${componentPath}: ${response.status}`);
    }
    const html = await response.text();
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error(`Failed to load component ${componentPath}:`, error);
  }
}

// Cargar todos los componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
  // Cargar componentes en paralelo
  await Promise.all([
    loadComponent('topbar-container', './components/topbar.html'),
    loadComponent('navbar-container', './components/navbar.html'),
    loadComponent('footer-container', './components/footer.html')
  ]);
  
  // Actualizar el año en el footer después de cargarlo
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Inicializar funcionalidad del navbar y back-to-top después de cargar componentes
  // Usar setTimeout para asegurar que los elementos están completamente renderizados
  setTimeout(initScrollEffects, 50);
});

/**
 * Inicializar efectos de scroll para navbar y botón back-to-top
 */
function initScrollEffects() {
  const topbar = document.querySelector('.topbar');
  const navbar = document.querySelector('.navbar-liceo');
  const backTop = document.getElementById('backTop');
  
  // Forzar estilos fixed en el topbar
  if (topbar) {
    topbar.style.position = 'fixed';
    topbar.style.top = '0';
    topbar.style.left = '0';
    topbar.style.right = '0';
    topbar.style.zIndex = '1060';
    topbar.style.width = '100%';
  }
  
  // Calcular altura del topbar (forzar recalculo)
  let topbarHeight = 0;
  if (topbar) {
    // Forzar reflow para obtener altura correcta
    topbar.style.display = 'block';
    topbarHeight = topbar.offsetHeight;
    console.log('Topbar height:', topbarHeight);
  }
  
  // Forzar estilos fixed en el navbar (debajo del topbar)
  if (navbar) {
    navbar.style.position = 'fixed';
    navbar.style.top = topbarHeight + 'px';
    navbar.style.left = '0';
    navbar.style.right = '0';
    navbar.style.zIndex = '1050';
    navbar.style.width = '100%';
    console.log('Navbar top position:', topbarHeight + 'px');
  }
  
  // Agregar padding-top al body para compensar topbar + navbar fixed
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const totalHeight = topbarHeight + navbarHeight;
  console.log('Total height (topbar + navbar):', totalHeight);
  if (totalHeight > 0) {
    document.body.style.paddingTop = totalHeight + 'px';
  }
  
  // Manejar scroll para navbar elevado y botón back-to-top
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Agregar clase navbar-elevated cuando se hace scroll
    if (navbar) {
      navbar.classList.toggle('navbar-elevated', scrollY > 12);
    }
    
    // Mostrar botón back-to-top cuando se baja más de 240px
    if (backTop) {
      backTop.classList.toggle('show', scrollY > 240);
    }
  });
  
  // Click en botón back-to-top para volver arriba
  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
