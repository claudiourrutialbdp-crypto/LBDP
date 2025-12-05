
# Load JSON data
$horariosPath = "c:\Users\Claudio Urrutia V\LBDP\data\horarios.json"
$evaluacionesPath = "c:\Users\Claudio Urrutia V\LBDP\data\evaluaciones.json"

$horariosJson = Get-Content $horariosPath -Raw | ConvertFrom-Json
$evaluacionesJson = Get-Content $evaluacionesPath -Raw | ConvertFrom-Json

# Get last ID
$lastId = ($evaluacionesJson | Measure-Object -Property id -Maximum).Maximum
if ($null -eq $lastId) { $lastId = 0 }

# Helper function to get day name from date
function Get-DayName($date) {
    $day = $date.DayOfWeek
    switch ($day) {
        "Monday" { return "lunes" }
        "Tuesday" { return "martes" }
        "Wednesday" { return "miercoles" }
        "Thursday" { return "jueves" }
        "Friday" { return "viernes" }
        Default { return $null }
    }
}

# Helper function to get random item from array
function Get-RandomItem($array) {
    if ($null -eq $array -or $array.Count -eq 0) { return $null }
    $index = Get-Random -Minimum 0 -Maximum $array.Count
    return $array[$index]
}

# Content templates per subject
$subjectContents = @{
    "Matemática" = @{ content = "Evaluación de unidad: Álgebra y Funciones"; strategy = "Prueba Escrita"; indicators = "Resuelve problemas aplicando funciones." };
    "Lenguaje" = @{ content = "Control de Lectura: Obra dramática"; strategy = "Prueba"; indicators = "Analiza conflicto y personajes." };
    "Ciencias" = @{ content = "Laboratorio: Reacciones Químicas"; strategy = "Informe"; indicators = "Registra observaciones y concluye." };
    "Historia" = @{ content = "Ensayo: Procesos históricos del siglo XX"; strategy = "Ensayo"; indicators = "Argumenta con evidencia histórica." };
    "Inglés" = @{ content = "Listening Comprehension: Daily Routines"; strategy = "Quiz"; indicators = "Identifica información clave en audio." };
    "Ed. Física" = @{ content = "Evaluación Práctica: Resistencia Aeróbica"; strategy = "Test Físico"; indicators = "Completa circuito de resistencia." };
    "Artes" = @{ content = "Entrega de Proyecto: Técnica Mixta"; strategy = "Rúbrica"; indicators = "Aplica técnicas mixtas creativamente." };
    "Música" = @{ content = "Interpretación Instrumental"; strategy = "Audición"; indicators = "Ejecuta instrumento con precisión." };
    "Tecnología" = @{ content = "Presentación de Prototipo"; strategy = "Disertación"; indicators = "Explica funcionamiento del prototipo." };
    "Física" = @{ content = "Prueba: Leyes de Newton"; strategy = "Prueba Escrita"; indicators = "Aplica leyes de Newton en problemas." };
    "Química" = @{ content = "Control: Estequiometría"; strategy = "Prueba Corta"; indicators = "Balancea ecuaciones químicas." };
    "Biología" = @{ content = "Investigación: Sistema Inmune"; strategy = "Informe"; indicators = "Describe componentes del sistema inmune." };
    "Filosofía" = @{ content = "Debate: Ética y Moral"; strategy = "Debate"; indicators = "Argumenta posturas éticas." };
    "Diseño Gráfico" = @{ content = "Entrega: Identidad Visual"; strategy = "Portafolio"; indicators = "Crea identidad visual coherente." };
    "Gastronomía" = @{ content = "Taller: Cocina Chilena"; strategy = "Práctica"; indicators = "Prepara platos típicos." };
    "Electrónica" = @{ content = "Montaje: Circuito Digital"; strategy = "Práctica"; indicators = "Ensambla circuito funcional." };
    "Redes" = @{ content = "Configuración: Router y Switch"; strategy = "Práctica"; indicators = "Configura dispositivos de red." };
}

$newEvaluations = @()

# Date ranges: Dec 2025 and Jan 2026
$startDateDec = Get-Date -Year 2025 -Month 12 -Day 1
$endDateDec = Get-Date -Year 2025 -Month 12 -Day 31
$startDateJan = Get-Date -Year 2026 -Month 1 -Day 1
$endDateJan = Get-Date -Year 2026 -Month 1 -Day 31

# Iterate through courses
foreach ($courseKey in $horariosJson.courses.PSObject.Properties.Name) {
    $course = $horariosJson.courses.$courseKey
    $courseName = $course.name
    $schedule = $course.schedule

    Write-Host "Generating evaluations for $courseName..."

    # Generate 10 for Dec and 10 for Jan
    for ($i = 0; $i -lt 20; $i++) {
        $isValidDate = $false
        $attempts = 0
        
        while (-not $isValidDate -and $attempts -lt 50) {
            $attempts++
            
            # Pick random month (0-9 for Dec, 10-19 for Jan)
            if ($i -lt 10) {
                $daysToAdd = Get-Random -Minimum 0 -Maximum 31
                $date = $startDateDec.AddDays($daysToAdd)
            } else {
                $daysToAdd = Get-Random -Minimum 0 -Maximum 31
                $date = $startDateJan.AddDays($daysToAdd)
            }

            # Skip weekends
            if ($date.DayOfWeek -eq "Saturday" -or $date.DayOfWeek -eq "Sunday") { continue }

            $dayName = Get-DayName $date
            
            # Check if course has classes on this day
            if ($null -ne $schedule.$dayName) {
                # Pick a random subject from that day
                $subjectsOnDay = $schedule.$dayName
                $subject = Get-RandomItem $subjectsOnDay
                
                # Basic validation to avoid empty subjects
                if (-not [string]::IsNullOrWhiteSpace($subject)) {
                    $isValidDate = $true
                    $lastId++
                    
                    # Get content template or default
                    $template = $subjectContents[$subject]
                    if ($null -eq $template) {
                        $template = @{ content = "Evaluación de $subject"; strategy = "Evaluación General"; indicators = "Demuestra dominio de contenidos." }
                    }

                    $newEval = [PSCustomObject]@{
                        id = $lastId
                        fecha = $date.ToString("yyyy-MM-dd")
                        asignatura = $subject
                        profesor = "Departamento de $subject"
                        contenido = $template.content
                        estrategia_evaluacion = $template.strategy
                        indicadores_evaluacion = $template.indicators
                        retroalimentacion = "Resultados en plataforma."
                        curso = $courseName
                    }
                    
                    $newEvaluations += $newEval
                }
            }
        }
    }
}

# Add new evaluations to existing list
$finalEvaluations = $evaluacionesJson + $newEvaluations

# Convert back to JSON
$jsonOutput = $finalEvaluations | ConvertTo-Json -Depth 10

# Save to file
$jsonOutput | Set-Content $evaluacionesPath -Encoding UTF8

Write-Host "Successfully added $($newEvaluations.Count) evaluations."
