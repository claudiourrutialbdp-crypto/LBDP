# Fix encoding issues in all HTML files
$htmlFiles = Get-ChildItem "c:\Users\Claudio Urrutia V\LBDP" -Filter "*.html"

# Define replacements as array of objects
$replacements = @(
    @{From = 'Ã¡'; To = 'á' },
    @{From = 'Ã©'; To = 'é' },
    @{From = 'Ã­'; To = 'í' },
    @{From = 'Ã³'; To = 'ó' },
    @{From = 'Ãº'; To = 'ú' },
    @{From = 'Ã±'; To = 'ñ' },
    @{From = 'Ã'; To = 'Á' },
    @{From = 'Ã‰'; To = 'É' },
    @{From = 'Ã'; To = 'Í' },
    @{From = 'Ã"'; To = 'Ó' },
    @{From = 'Ãš'; To = 'Ú' },
    @{From = 'Â°'; To = '°' },
    @{From = 'Â¿'; To = '¿' },
    @{From = 'Â¡'; To = '¡' }
)

$filesModified = 0

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..." -ForegroundColor Cyan
    
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $hasChanges = $false
        
        foreach ($replacement in $replacements) {
            $from = [regex]::Escape($replacement.From)
            if ($content -match $from) {
                $content = $content -replace $from, $replacement.To
                $hasChanges = $true
            }
        }
        
        if ($hasChanges) {
            Set-Content $file.FullName $content -NoNewline -Encoding UTF8
            Write-Host "  Fixed encoding in $($file.Name)" -ForegroundColor Green
            $filesModified++
        }
        else {
            Write-Host "  No issues found" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "  Error: $_" -ForegroundColor Red
    }
}

Write-Host "`nFixed $filesModified HTML files" -ForegroundColor Yellow
