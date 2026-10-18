@echo off
setlocal EnableDelayedExpansion
title Desinstalador Drift86 - Spicetify

echo =======================================================
echo          Desinstalando Drift86...
echo =======================================================
echo.

call spicetify config extensions drift86.js-
call spicetify apply

echo.
set /p RESTART="Desea reiniciar Spotify ahora? (S/N): "
if /i "!RESTART!"=="S" (
    call spicetify restart
)

echo.
echo Extension desinstalada y Spotify restaurado.
echo.
pause
