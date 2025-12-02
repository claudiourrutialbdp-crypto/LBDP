"""
Script para actualizar contenido de páginas HTML del LBDP con información del PEI.
Este script actualiza textos específicos manteniendo intacta la estructura HTML.
"""

# Actualizaciones para index.html
index_updates = {
    'Llegando a ser, lo que podemos ser': '"Llegando a ser, todo lo que podemos ser"',
    'Somos una institución comprometida con la formación integral de nuestros estudiantes, \r\n              brindando educación de calidad que prepara para el futuro.': 
        'Somos un liceo municipal de excelencia que forma parte de la Red de Liceos Bicentenarios desde 2019. Ofrecemos una educación integral de calidad que prepara a nuestros estudiantes para enfrentar con éxito sus desafíos académicos, laborales y personales.',
    'Excelencia Académica</h4>\n                    <p class="small text-muted mb-0">Programa académico de alta calidad':
        'Liceo Bicentenario de Excelencia</h4>\n                    <p class="small text-muted mb-0">Desde 2019 con puntajes nacionales en PAES (2022-2025)',
    'Comunidad Educativa</h4>\n                    <p class="small text-muted mb-0">Ambiente colaborativo y acogedor':
        'Crecimiento del 169%</h4>\n                    <p class="small text-muted mb-0">En matrícula en los últimos 6 años - 377 estudiantes en 2025',
    'Innovación Educativa</h4>\n                    <p class="small text-muted mb-0">Metodologías modernas de enseñanza':
        'Metodologías Activas</h4>\n                    <p class="small text-muted mb-0">Aprendizaje Basado en Problemas y Retos',
    'Formación Integral</h4>\n                    <p class="small text-muted mb-0">Desarrollo personal y académico':
        'Educación Inclusiva</h4>\n                    <p class="small text-muted mb-0">27% de estudiantes atendidos por Programa PIE'
}

# Actualizaciones para nosotros-mision.html
mision_updates = {
    'Llegando a ser todo lo que podemos ser.':  '"Llegando a ser, todo lo que podemos ser"'
}

def update_html_file(filepath, updates_dict):
    """Actualiza un archivo HTML con los reemplazos especificados."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        for old_text, new_text in updates_dict.items():
            if old_text in content:
                content = content.replace(old_text, new_text)
                replacements_made += 1
                print(f"  ✓ Reemplazado: {old_text[:50]}...")
            else:
                print(f"  ⚠ No encontrado: {old_text[:50]}...")
        
        if replacements_made > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {filepath}: {replacements_made} reemplazos realizados")
        else:
            print(f"ℹ️  {filepath}: Sin cambios")
            
        return replacements_made
    
    except Exception as e:
        print(f"❌ Error en {filepath}: {e}")
        return 0

if __name__ == "__main__":
    print("="*60)
    print("Actualización de contenido HTML - LBDP")
    print("=" *60)
    
    total_updates = 0
    
    # Actualizar index.html
    print("\n📄 Actualizando index.html...")
    total_updates += update_html_file('index.html', index_updates)
    
    # Actualizar nosotros-mision.html  
    print("\n📄 Actualizando nosotros-mision.html...")
    total_updates += update_html_file('nosotros-mision.html', mision_updates)
    
    print("\n" + "="*60)
    print(f"✅ Proceso completado. Total de actualizaciones: {total_updates}")
    print("="*60)
