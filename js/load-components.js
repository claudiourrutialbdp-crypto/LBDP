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
});
