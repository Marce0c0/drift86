@echo off
setlocal EnableDelayedExpansion
title Instalador Drift86 - Spicetify

echo =======================================================
echo          Drift86: Initial D Trueno Seekbar
echo =======================================================
echo.

where spicetify >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se encontro Spicetify en el sistema.
    echo Asegurate de tener Spicetify instalado antes de continuar.
    pause
    exit /b 1
)

for /f "delims=" %%i in ('spicetify path -e root 2^>nul') do set "EXT_DIR=%%i"
if not defined EXT_DIR set "EXT_DIR=%APPDATA%\spicetify\Extensions"

if not exist "!EXT_DIR!" (
    mkdir "!EXT_DIR!"
)

if not exist "%~dp0drift86.js" (
    echo [ERROR] No se encontro el archivo drift86.js.
    echo Asegurate de descomprimir toda la carpeta antes de instalar.
    pause
    exit /b 1
)

echo [1/3] Copiando drift86.js a !EXT_DIR!...
if exist "!EXT_DIR!\drift86.js" (
    del /F /Q "!EXT_DIR!\drift86.js" >nul 2>&1
)
copy /Y "%~dp0drift86.js" "!EXT_DIR!\drift86.js" >nul

echo [2/3] Registrando extension en Spicetify...
call spicetify config extensions drift86.js

echo [3/3] Aplicando cambios con Spicetify...
call spicetify apply

echo.
echo =======================================================
echo          INSTALACION COMPLETADA CON EXITO!
echo =======================================================
echo.
echo   * Te gusto el proyecto? Apoyalo con una estrellita:
echo   * https://github.com/Marce0c0/drift86
echo =======================================================
echo.

set /p RESTART="Desea reiniciar Spotify ahora para ver el AE86 de inmediato? (S/N): "
if /i "!RESTART!"=="S" (
    echo.
    echo Reiniciando Spotify...
    call spicetify restart
    echo Spotify reiniciado con exito! Disfruta de Drift86.
) else (
    echo.
    echo Perfecto. Los cambios se veran la proxima vez que abras Spotify.
)

echo.
pause
