#!/usr/bin/env bash
set -e

echo "======================================================="
echo "        Desinstalador Drift86 (Linux / macOS)"
echo "======================================================="
echo ""

spicetify config extensions drift86.js-
spicetify apply

read -r -p "¿Deseas reiniciar Spotify ahora? (s/n): " RESTART
if [[ "$RESTART" =~ ^([sS][iI]?|[yY][eE]?[sS]?)$ ]]; then
    spicetify restart || true
fi

echo "Extensión desinstalada con éxito."
