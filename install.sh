#!/usr/bin/env bash
set -e

echo "======================================================="
echo "        Drift86: Initial D Trueno (Linux / macOS)"
echo "======================================================="
echo ""

if ! command -v spicetify &> /dev/null; then
    echo "[ERROR] No se encontró el comando 'spicetify' en tu PATH."
    echo "Asegúrate de tener Spicetify instalado antes de continuar."
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ ! -f "$SCRIPT_DIR/drift86.js" ]; then
    echo "[ERROR] No se encontró drift86.js en $SCRIPT_DIR."
    exit 1
fi

EXT_DIR=$(spicetify path -e root 2>/dev/null || true)
if [ -z "$EXT_DIR" ]; then
    EXT_DIR="$HOME/.config/spicetify/Extensions"
fi

mkdir -p "$EXT_DIR"

echo "[1/3] Copiando drift86.js a $EXT_DIR..."
cp -f "$SCRIPT_DIR/drift86.js" "$EXT_DIR/drift86.js"

echo "[2/3] Registrando extensión en Spicetify..."
spicetify config extensions drift86.js

echo "[3/3] Aplicando cambios..."
spicetify apply

echo ""
echo "======================================================="
echo "        ¡INSTALACIÓN COMPLETADA CON ÉXITO!"
echo "======================================================="
echo ""
echo "  ⭐ ¿Te gustó el proyecto? Apóyalo con una estrellita:"
echo "  👉 https://github.com/Marce0c0/drift86"
echo "======================================================="
echo ""

read -r -p "¿Deseas reiniciar Spotify ahora para ver el AE86 de inmediato? (s/n): " RESTART
if [[ "$RESTART" =~ ^([sS][iI]?|[yY][eE]?[sS]?)$ ]]; then
    echo ""
    echo "Reiniciando Spotify..."
    spicetify restart || true
    echo "¡Spotify reiniciado! Disfruta de Drift86."
else
    echo ""
    echo "Perfecto. Los cambios se aplicarán la próxima vez que inicies Spotify."
fi
