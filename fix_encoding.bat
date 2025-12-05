@echo off
setlocal enabledelayedexpansion

echo Fixing encoding in HTML files...
echo.

set count=0

for %%f in ("c:\Users\Claudio Urrutia V\LBDP\*.html") do (
    echo Processing %%~nxf...
    powershell -NoProfile -Command "$c = Get-Content '%%f' -Raw -Encoding UTF8; $c = $c -replace 'Ã¡','á' -replace 'Ã©','é' -replace 'Ã­','í' -replace 'Ã³','ó' -replace 'Ãº','ú' -replace 'Ã±','ñ' -replace 'Ã','Á' -replace 'Ã‰','É' -replace 'Ã','Í' -replace 'Ã"','Ó' -replace 'Ãš','Ú' -replace 'Â°','°' -replace 'Â¿','¿' -replace 'Â¡','¡'; Set-Content '%%f' $c -NoNewline -Encoding UTF8"
    set /a count+=1
)

echo.
echo Fixed %count% HTML files
pause
