<div align="center">

# 🏎️ Drift86: Initial D Trueno Seekbar
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

![Drift86 - AE86 Tokyo Highway](assets/tokyo_road_ae86.gif?v=3)

<br/>

[**English**](#-english) &nbsp;•&nbsp; [**Español**](#-español)

</div>

---

<a name="english"></a>
## 🇬🇧 English

### ✨ Features

- **3 Dynamic Pixel-Art Views:**
  1. **Paused (3/4 Frontal Perspective):** Idling on the road with authentic amber hazard flashers.
  2. **Playing (Lateral Cruising):** Driving smoothly along the road with bright pop-up headlights, subtle engine rumble, and trailing exhaust smoke.
  3. **Drifting (Initial D Countersteer):** When dragging the seekbar or jumping through tracks, the road dynamically arches into a mountain hairpin curve while the AE86 throws its tail out in a heavy countersteering drift with dense tire smoke clouds and suspension bounces.
- **Tokyo Highway Road (Shutoko C1):** Dark textured asphalt with double white curb borders and diagonal hazard chevron markings, applied exclusively to the seekbar.
- **JDM Tachometer HUD Tooltip & Timestamps:** Monochromatic Initial D-styled digital font with 100% solid, opaque background that never bleeds behind the play/pause button or controls.
- **Volume Bar Protection:** The volume slider remains completely untouched with its clean original Spotify styling.
- **100% Standalone & Lightweight:** Everything is packed into a single `drift86.js` file with embedded base64 sprites. Zero external network calls, zero bloat, and 0% CPU consumption when Spotify is minimized.

---

### 🚀 Instant One-Line Install (No manual download required)

#### Windows (PowerShell):
```powershell
iwr -useb "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -OutFile "$((spicetify path -e root 2>$null) -replace '[\r\n]','')\drift86.js"; spicetify config extensions drift86.js; spicetify apply; if ((Read-Host "Restart Spotify now? (Y/N)") -match "^[yYsS]") { spicetify restart }
```

#### Linux & macOS (Bash):
```bash
curl -fsSL "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -o "$(spicetify path -e root)/drift86.js" && spicetify config extensions drift86.js && spicetify apply && read -p "Restart Spotify now? (y/n): " r && [[ $r =~ ^[yYsS] ]] && spicetify restart
```

---

### 📦 Local Installation (From ZIP or cloned repo)

#### 🪟 Windows:
1. Download this repository as a ZIP using the green button above, and extract it.
2. Double-click **`install.bat`**.
3. Type **Y** when prompted to restart Spotify immediately.

#### 🐧 Linux & 🍎 macOS:
1. Open a terminal in the extracted folder.
2. Run:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Type **y** to restart Spotify when the installation finishes.

---

### 🛍️ Spicetify Marketplace
With the included `marketplace.json`, you can search for **"Drift86"** in Spicetify Marketplace inside Spotify and click **"Install"** with one single click.

---

### 🗑️ Uninstallation

- **Windows:** Double-click `uninstall.bat`.
- **Linux & macOS:** Run `./uninstall.sh`.
- Or manually run in any terminal:
  ```bash
  spicetify config extensions drift86.js- && spicetify apply && spicetify restart
  ```

---

### 🛠️ Developer Build

To rebuild `drift86.js` after tweaking sprites or code in `build.js`:
```bash
node build.js
```
*(Requires only standard Node.js, zero dependencies).*

<br/>

---

<a name="español"></a>
## 🇪🇸 Español

### ✨ Características

- **3 Vistas Dinámicas en Pixel Art:**
  1. **Pausa (Ángulo 3/4 frontal):** Detenido en la carretera con faros pop-up e intermitentes ámbar parpadeando.
  2. **Reproduciendo (Cruising lateral):** Vista lateral en carrera con faros iluminados, sutil vibración de motor y humo de escape suave.
  3. **Derrape (Initial D Drift):** Al arrastrar el cursor o hacer saltos de tiempo, la carretera se curva dinámicamente y el AE86 entra en derrape cruzado con contravolante, humo denso y mini-rebotes de suspensión.
- **Calzada de Tokio (Shutoko C1):** Asfalto oscuro con bordillos dobles y franjas diagonales blancas (chevron) solo en la barra de reproducción.
- **Tacómetro Digital JDM y Tooltip Opaco:** Tipografía técnica japonesa en blanco y negro, con fondo 100% sólido y opaco que no se transparenta al pasar por el botón de pausa o controles centrales.
- **Protección del Slider de Volumen:** La barra de volumen permanece con su diseño limpio original de Spotify, sin alteraciones.
- **100% Autónomo (Standalone):** Todo está empaquetado en un único archivo `drift86.js` con sprites base64 integrados. Sin dependencias externas ni consumo en segundo plano cuando la ventana está minimizada (0% CPU).

---

### 🚀 Instalación Remota en 1 sola línea (Sin descargar archivos)

#### Windows (PowerShell):
```powershell
iwr -useb "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -OutFile "$((spicetify path -e root 2>$null) -replace '[\r\n]','')\drift86.js"; spicetify config extensions drift86.js; spicetify apply; if ((Read-Host "¿Reiniciar Spotify ahora? (S/N)") -match "^[sSyY]") { spicetify restart }
```

#### Linux & macOS (Bash):
```bash
curl -fsSL "https://raw.githubusercontent.com/Marce0c0/drift86/main/drift86.js" -o "$(spicetify path -e root)/drift86.js" && spicetify config extensions drift86.js && spicetify apply && read -p "¿Reiniciar Spotify ahora? (s/n): " r && [[ $r =~ ^[sSyY] ]] && spicetify restart
```

---

### 📦 Instalación Local (Desde ZIP o carpeta descargada)

#### 🪟 Windows:
1. Descarga el archivo ZIP desde el botón verde de arriba y descomprímelo.
2. Haz doble clic en **`install.bat`**.
3. Pulsa **S** cuando te pregunte si deseas reiniciar Spotify de inmediato.

#### 🐧 Linux y 🍎 macOS:
1. Abre tu terminal en la carpeta descargada.
2. Ejecuta:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
3. Pulsa **s** para reiniciar Spotify cuando termine el instalador.

---

### 🗑️ Desinstalación

- **Windows:** Doble clic en `uninstall.bat`.
- **Linux / macOS:** Ejecuta `./uninstall.sh`.
- O manualmente en cualquier terminal:
  ```bash
  spicetify config extensions drift86.js- && spicetify apply && spicetify restart
  ```

---

<div align="center">
  <sub>Made with ❤️ for the Initial D & Spicetify community by <a href="https://github.com/Marce0c0">Marce0c0</a>. Don't forget to star ⭐ the repo!</sub>
</div>
