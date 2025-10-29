#!/usr/bin/env python3
"""
Script para actualizar todas las páginas HTML para que usen componentes centralizados
Reemplaza topbar, navbar y footer con contenedores que cargan los componentes dinámicamente
"""

import re
import glob
import os

def replace_component(content, start_marker, end_marker, container_id):
    """Reemplaza un componente HTML con un contenedor simple"""
    # Buscar el inicio del componente
    start_pattern = re.escape(start_marker)
    
    # Patrones para encontrar el final de cada componente
    if 'Topbar' in start_marker:
        # Para topbar, buscar el cierre </div> después del topbar
        pattern = f'({start_pattern}.*?</div>\s*</div>)'
        replacement = f'{start_marker}\n  <div id="{container_id}"></div>'
    elif 'Navbar' in start_marker:
        # Para navbar, buscar el cierre </nav>
        pattern = f'({start_pattern}.*?</nav>)'
        replacement = f'{start_marker}\n  <div id="{container_id}"></div>'
    elif 'Footer' in start_marker:
        # Para footer, buscar el cierre </footer>
        pattern = f'({start_marker}.*?</footer>)'
        replacement = f'{start_marker}\n  <div id="{container_id}"></div>'
    else:
        return content
    
    # Reemplazar usando regex con DOTALL para que . coincida con \n
    content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)
    return content

def add_load_components_script(content):
    """Agrega el script de carga de componentes antes de </body>"""
    # Verificar si ya tiene el script
    if 'load-components.js' in content:
        return content
    
    # Buscar el tag </body> y agregar el script antes
    script_tag = '  <script src="./js/load-components.js"></script>\n</body>'
    content = content.replace('</body>', script_tag)
    return content

def process_html_file(filepath):
    """Procesa un archivo HTML individual"""
    print(f"Procesando: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Reemplazar cada componente
    content = replace_component(content, '  <!-- Topbar -->', None, 'topbar-container')
    content = replace_component(content, '  <!-- Navbar -->', None, 'navbar-container')
    content = replace_component(content, '  <!-- Footer -->', None, 'footer-container')
    
    # Agregar el script de carga de componentes
    content = add_load_components_script(content)
    
    # Solo escribir si hubo cambios
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Actualizado: {filepath}")
        return True
    else:
        print(f"  - Sin cambios: {filepath}")
        return False

def main():
    """Función principal"""
    # Encontrar todos los archivos HTML en el directorio raíz
    html_files = glob.glob('*.html')
    
    print(f"Encontrados {len(html_files)} archivos HTML\n")
    
    updated_count = 0
    for filepath in sorted(html_files):
        if process_html_file(filepath):
            updated_count += 1
    
    print(f"\n✓ Proceso completado: {updated_count}/{len(html_files)} archivos actualizados")

if __name__ == '__main__':
    main()
