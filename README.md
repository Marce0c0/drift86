<div align="center">

# Drift86: Initial D Trueno Seekbar
### Custom Toyota AE86 Trueno Drifting Seekbar for Spicetify & Spotify

[![GitHub Stars](https://img.shields.io/github/stars/Marce0c0/drift86?style=for-the-badge&logo=github&color=ffb703)](https://github.com/Marce0c0/drift86)
[![Spicetify Extension](https://img.shields.io/badge/Spicetify-Extension-1db954?style=for-the-badge&logo=spotify&logoColor=white)](https://spicetify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

<p align="center">
  <a href="https://github.com/Marce0c0/drift86/archive/refs/heads/main.zip">
    <img src="https://img.shields.io/badge/⬇️_DOWNLOAD_DRIFT86-ZIP-1db954?style=for-the-badge&logo=download&logoColor=white" alt="Download Extension" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/Marce0c0/drift86">
    <img src="https://img.shields.io/badge/⭐_STAR_ON_GITHUB-GOLD-ffb703?style=for-the-badge&logo=github&logoColor=black" alt="Star on GitHub" />
  </a>
</p>

> **⭐ If you like this project, please consider giving it a star on GitHub! It helps more Initial D and Spicetify fans discover it.**

<br/>

![Drift86 - AE86 Tokyo Highway](assets/tokyo_road_ae86.gif?v=6)

<br/>

[**English**](#english) &nbsp;•&nbsp; [**Español**](#español)

</div>

---

<a name="english"></a>
## English

### Features

- **3 Dynamic Pixel-Art States:**
  1. **Paused (3/4 Frontal Perspective):** Idling on the road with authentic amber hazard flashers and gentle rear parking taillight illumination.
  2. **Playing (Lateral Cruising):** Driving smoothly along the road with bright pop-up halogen headlights, authentic rotating RS Watanabe wheels, illuminated taillights, subtle engine rumble, and trailing exhaust smoke.
  3. **Drifting (Initial D Countersteer):** Scrubbing or dragging the seekbar dynamically arches the road into a mountain hairpin curve while the AE86 throws its tail out in a heavy countersteering drift with dense tire smoke clouds.
- **Manga Action Shout:** Comic balloon ("GO!" / ゴー！) pops up on track start.
- **Tokyo Highway Road (Shutoko C1):** Dark textured asphalt with double white curb borders and diagonal hazard chevron markings, applied exclusively to the seekbar.
- **Volume Bar Protection:** The volume slider remains completely untouched with its clean original Spotify styling.
- **100% Standalone & Lightweight:** Everything is packed into a single self-contained bundle with embedded base64 sprites. Zero external network calls, zero bloat, and 0% CPU consumption when Spotify is minimized.

---

### Bunta Fujiwara Easter Egg (Impreza GC8)

Bunta's Subaru Impreza WRX STI Type R (GC8) overtakes on the outside lane every ~3 minutes, trailing cigarette smoke and boxer exhaust. You can also press **B** to summon him immediately.

<p align="center">
  <img src="assets/bunta_overtake.gif" alt="Bunta Fujiwara GC8 Overtake" width="100%" />
</p>

---

### Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| **B** | Trigger Bunta Fujiwara's Impreza GC8 overtake |

---

### Quick Install (No manual download required)

#### Windows (PowerShell):
```powershell
iwr -useb "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -OutFile "$((spicetify path -e root 2>$null) -replace '[\r\n]','')\drift86.js"; spicetify config extensions drift86.js; spicetify apply; if ((Read-Host "Restart Spotify now? (Y/N)") -match "^[yYsS]") { spicetify restart }
```

#### Linux & macOS (Bash):
```bash
curl -fsSL "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -o "$(spicetify path -e root)/drift86.js" && spicetify config extensions drift86.js && spicetify apply && read -p "Restart Spotify now? (y/n): " r && [[ $r =~ ^[yYsS] ]] && spicetify restart
```

---

### Local Installation (From ZIP or cloned repo)

#### Windows:
1. Download this repository as a ZIP using the button above and extract it.
2. Double-click **`install.bat`**.
3. Type **Y** when prompted to restart Spotify immediately.

#### Linux & macOS:
1. Open a terminal in the extracted folder.
2. Run:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Type **y** to restart Spotify when the installation finishes.

---

### Spicetify Marketplace

With the included `manifest.json`, you can search for **"Drift86"** in Spicetify Marketplace inside Spotify and click **"Install"** with one single click.

---

### Uninstallation

- **Windows:** Double-click `uninstall.bat`.
- **Linux & macOS:** Run `./uninstall.sh`.
- Or manually run in any terminal:
  ```bash
  spicetify config extensions drift86.js- && spicetify apply && spicetify restart
  ```

---

### Developer Build

To rebuild `drift86.js` after tweaking sprites or code in `build.js`:
```bash
node build.js
```
*(Requires only standard Node.js, zero external dependencies).*

<br/>

---

<a name="español"></a>
## Español

### Características

- **3 Estados Dinámicos en Pixel Art:**
  1. **Pausa (Ángulo 3/4 frontal):** Detenido en la carretera con faros pop-up, intermitentes ámbar parpadeando y luz de posición trasera suave.
  2. **Reproducción (Cruising lateral):** Vista lateral en carrera con faros pop-up halógenos, llantas RS Watanabe del modelo girando en tiempo real, luces de freno encendidas, vibración de motor y estela tenue de escape.
  3. **Derrape (Initial D Drift):** Al arrastrar la barra de progreso, la calzada se curva dinámicamente y el AE86 entra en derrape cruzado con contravolante y nubes densas de humo de neumáticos.
- **Grito Manga:** Bocadillo de impacto estilo cómic ("GO!" / ゴー！) al iniciar una canción.
- **Calzada de Tokio (Shutoko C1):** Asfalto oscuro con bordillos dobles y franjas diagonales blancas (chevron) aplicadas únicamente a la seekbar.
- **Protección del Slider de Volumen:** La barra de volumen permanece con su diseño limpio original de Spotify, sin alteraciones.
- **100% Autónomo (Standalone):** Archivo único autónomo con sprites base64 integrados. Sin dependencias externas ni consumo en segundo plano cuando la ventana está minimizada (0% CPU).

---

### Easter Egg de Bunta Fujiwara (Impreza GC8)

El Subaru Impreza WRX STI Type R (GC8) de Bunta aparece espontáneamente cada ~3 minutos para rebasar al AE86 por el carril superior con humo de cigarrillo y escape boxer. También puedes pulsar la tecla **B** para invocarlo cuando quieras.

<p align="center">
  <img src="assets/bunta_overtake.gif" alt="Adelantamiento de Bunta Fujiwara GC8" width="100%" />
</p>

---

### Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| **B** | Invocar el adelantamiento de Bunta Fujiwara (Impreza GC8) |

---

### Instalación Rápida en 1 sola línea (Sin descargar archivos)

#### Windows (PowerShell):
```powershell
iwr -useb "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -OutFile "$((spicetify path -e root 2>$null) -replace '[\r\n]','')\drift86.js"; spicetify config extensions drift86.js; spicetify apply; if ((Read-Host "¿Reiniciar Spotify ahora? (S/N)") -match "^[sSyY]") { spicetify restart }
```

#### Linux & macOS (Bash):
```bash
curl -fsSL "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -o "$(spicetify path -e root)/drift86.js" && spicetify config extensions drift86.js && spicetify apply && read -p "¿Reiniciar Spotify ahora? (s/n): " r && [[ $r =~ ^[sSyY] ]] && spicetify restart
```

---

### Instalación Local (Desde ZIP o carpeta descargada)

#### Windows:
1. Descarga el archivo ZIP desde el botón de arriba y descomprímelo.
2. Haz doble clic en **`install.bat`**.
3. Pulsa **S** cuando te pregunte si deseas reiniciar Spotify de inmediato.

#### Linux y macOS:
1. Abre tu terminal en la carpeta descargada.
2. Ejecuta:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Pulsa **s** para reiniciar Spotify cuando termine el instalador.

---

### Spicetify Marketplace

Con el archivo `manifest.json` incluido, puedes buscar **"Drift86"** directamente en la tienda Spicetify Marketplace dentro de Spotify e instalarlo con un solo clic.

---

### Desinstalación

- **Windows:** Doble clic en `uninstall.bat`.
- **Linux / macOS:** Ejecuta `./uninstall.sh`.
- O manualmente en cualquier terminal:
  ```bash
  spicetify config extensions drift86.js- && spicetify apply && spicetify restart
  ```

---

### Compilación para Desarrolladores

Para recompilar `drift86.js` tras modificar sprites o código en `build.js`:
```bash
node build.js
```

<br/>

---

<div align="center">
  <sub>Made with ❤️ for the Initial D & Spicetify community by <a href="https://github.com/Marce0c0">Marce0c0</a>. Don't forget to star ⭐ the repo!</sub>
</div>
