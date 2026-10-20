const fs = require('fs');
const path = require('path');

// Vista 1 (Pausa): Viendo al frente en ángulo 3/4
const idleImgPath = path.join(__dirname, 'assets', 'ae86_lateral_drift.png');
// Vista 2 (Corriendo/Reproduciendo): De lateral horizontal avanzando por la calzada
const driveImgPath = path.join(__dirname, 'assets', 'ae86_cruising_clean.png');
// Vista 3 (Derrape): Initial D cruzado con contravolante y humo al arrastrar
const driftImgPath = path.join(__dirname, 'assets', 'ae86_hard_drift.png');

const idleBase64 = fs.readFileSync(idleImgPath).toString('base64');
const driveBase64 = fs.readFileSync(driveImgPath).toString('base64');
const driftBase64 = fs.readFileSync(driftImgPath).toString('base64');

// Vista 4 (Easter Egg): Subaru Impreza WRX STI Type R GC8 de Bunta Fujiwara
const imprezaImgPath = path.join(__dirname, 'assets', 'impreza_bunta_cruising.png');
const imprezaBase64 = fs.readFileSync(imprezaImgPath).toString('base64');

const jsContent = `// ==UserScript==
// @name         Drift86: Initial D Trueno Seekbar
// @description  Toyota AE86 Trueno drifting seekbar for Spicetify. Pausa (3/4 frontal quieto), Cruising (lateral corriendo), Derrape (Initial D con humo y contravolante). Calzada de Tokio.
// @author       Marce0c0
// @version      1.0.0
// ==/UserScript==

(function AE86InitialDSeekbar() {
    if (!window.Spicetify || !Spicetify.Player || !Spicetify.Platform) {
        setTimeout(AE86InitialDSeekbar, 250);
        return;
    }

    const STYLE_ID = "ae86-initial-d-styles";
    const CAR_ID = "ae86-initial-d-car";
    const IMPREZA_ID = "ae86-bunta-impreza";
    const SVG_CURVE_ID = "ae86-initial-d-curve";

    const AE86_IDLE = "data:image/png;base64,${idleBase64}";
    const AE86_DRIVE = "data:image/png;base64,${driveBase64}";
    const AE86_DRIFT = "data:image/png;base64,${driftBase64}";
    const BUNTA_IMPREZA = "data:image/png;base64,${imprezaBase64}";

    // ─── Estilos CSS ──────────────────────────────────────────────────────────
    let style = document.getElementById(STYLE_ID);
    if (!style) {
        style = document.createElement("style");
        style.id = STYLE_ID;
        document.head.appendChild(style);
    }
    style.textContent = \`
            .player-controls, .main-nowPlayingBar-center,
            .main-nowPlayingBar-container, .Root__now-playing-bar, footer {
                overflow: visible !important;
            }

            .playback-bar,
            [data-testid="playback-progressbar"],
            .playback-bar [data-testid="progress-bar"],
            [data-testid="playback-progressbar"] [data-testid="progress-bar"],
            .playback-bar .progress-bar,
            [data-testid="playback-progressbar"] .progress-bar {
                position: relative !important;
                overflow: visible !important;
            }

            #\${SVG_CURVE_ID} {
                position: absolute;
                top: 0; left: 0;
                width: 100%; height: 100%;
                pointer-events: none;
                overflow: visible !important;
                z-index: 99999 !important;
                filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.7));
            }

            #\${CAR_ID} {
                position: absolute;
                width: 52px;
                height: 18px;
                pointer-events: none;
                z-index: 100000 !important;
                transform-origin: 50% 90%;
                will-change: transform, left, top;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
                transition: none;
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
            }

            #\${CAR_ID} img.ae86-img {
                position: absolute;
                bottom: 0; left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: 50% 100%;
                image-rendering: pixelated;
                display: block !important;
                visibility: visible !important;
                user-select: none;
                opacity: 0;
                transition: opacity 0.12s ease;
            }

            /* Vista 1: Pausa / Detenido (viendo hacia adelante en ángulo 3/4 con intermitentes ámbar activos) */
            #\${CAR_ID}.paused:not(.drifting) img.ae86-idle {
                opacity: 1;
            }

            /* Vista 2: Reproduciendo / Corriendo (de lateral horizontal corriendo con faros encendidos y vibración de motor) */
            #\${CAR_ID}.driving:not(.drifting) img.ae86-drive {
                opacity: 1;
                bottom: 2.8px;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
            }
            #\${CAR_ID}.driving:not(.drifting) .ae86-headlight-glow {
                bottom: 4.8px;
            }
            @keyframes ae86-engine-rumble {
                0%   { transform: translateY(0px); }
                100% { transform: translateY(-0.4px); }
            }

            /* Vista 3: Derrape total Initial D (coche cruzado con contravolante, rueda humeante y luz trasera roja) */
            #\${CAR_ID}.drifting img.ae86-drift {
                opacity: 1;
            }

            /* Haz de luz de faros escamoteables del AE86 (cálido, atmosférico, no exagerado) */
            .ae86-headlight-glow {
                position: absolute;
                bottom: 2px;
                right: -13px;
                width: 22px;
                height: 11px;
                background: radial-gradient(
                    ellipse at 0% 50%,
                    rgba(255, 252, 215, 0.42) 0%,
                    rgba(255, 235, 140, 0.18) 50%,
                    transparent 85%
                );
                pointer-events: none;
                z-index: 4;
                filter: drop-shadow(0 0 3px rgba(255, 240, 160, 0.45));
                transition: opacity 0.2s ease;
            }
            #\${CAR_ID}.paused .ae86-headlight-glow {
                opacity: 0.2;
                right: -8px;
            }
            #\${CAR_ID}.drifting .ae86-headlight-glow {
                opacity: 0.35;
                right: -10px;
            }

            /* Subaru Impreza WRX STI Type R (Bunta Fujiwara Easter Egg) */
            #\${IMPREZA_ID} {
                position: absolute;
                width: 54px;
                height: 18px;
                pointer-events: none;
                z-index: 99998 !important;
                transform-origin: 50% 90%;
                will-change: transform, left, top;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7));
                transition: none;
                display: none;
            }

            #\${IMPREZA_ID} img.impreza-img {
                position: absolute;
                bottom: 2.8px; left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: 50% 100%;
                image-rendering: pixelated;
                display: block !important;
                visibility: visible !important;
                user-select: none;
                animation: ae86-engine-rumble 0.16s infinite ease-in-out alternate;
            }

            #\${IMPREZA_ID} .impreza-headlight-glow {
                position: absolute;
                bottom: 4.8px;
                right: -14px;
                width: 24px;
                height: 11px;
                background: radial-gradient(
                    ellipse at left center,
                    rgba(170, 225, 255, 0.8) 0%,
                    rgba(90, 180, 255, 0.35) 45%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
            }

            /* Intermitentes en pausa (4 luces auténticas: 2 delanteras + 2 traseras, alumbrando en sincronía) */
            .ae86-hazard {
                position: absolute;
                background: #ffb000;
                border-radius: 1px;
                pointer-events: none;
                opacity: 0;
                z-index: 6;
                transition: none;
            }
            #\${CAR_ID}.paused:not(.drifting) .ae86-hazard {
                animation: ae86-hazard-blink 0.55s step-end infinite;
            }
            @keyframes ae86-hazard-blink {
                0%, 100% {
                    opacity: 1;
                    filter: drop-shadow(0 0 2px rgba(255, 180, 0, 1)) drop-shadow(0 0 5px rgba(255, 140, 0, 0.85));
                }
                50% {
                    opacity: 0;
                    filter: none;
                }
            }

            /* 1. Delantero derecho */
            .ae86-hazard-front-right {
                width: 2px; height: 1.5px;
                bottom: 6px; right: 1px;
            }
            /* 2. Delantero izquierdo */
            .ae86-hazard-front-left {
                width: 2px; height: 1.5px;
                bottom: 6px; left: 36.5px;
            }
            /* 3. Lateral aleta izquierda */
            .ae86-hazard-side-left {
                width: 2px; height: 1.5px;
                bottom: 7.5px; left: 33px;
            }
            /* 4. Trasero izquierdo */
            .ae86-hazard-rear-left {
                width: 2px; height: 2px;
                bottom: 9.5px; left: 1.5px;
            }

            /* Humo dinámico denso y abundante estilo Initial D durante derrape */
            .ae86-smoke-puff {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(235, 235, 240, 0.8) 35%, rgba(190, 190, 205, 0.3) 70%, rgba(150, 150, 150, 0) 100%);
                pointer-events: none;
                z-index: 99998 !important;
                animation: ae86-smoke-fade 0.55s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
                filter: drop-shadow(0 1px 3px rgba(0,0,0,0.3));
                will-change: transform, opacity;
            }
            @keyframes ae86-smoke-fade {
                0%   { opacity: 0.98; transform: translate(0, 0) scale(0.6); }
                30%  { opacity: 0.85; }
                100% { opacity: 0;    transform: translate(-32px, -15px) scale(2.8); }
            }

            /* Humo de escape sutil y continuo en crucero */
            .ae86-cruising-smoke {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(230, 232, 238, 0.55) 0%, rgba(190, 195, 205, 0.3) 45%, rgba(160, 165, 175, 0.08) 75%, transparent 100%);
                pointer-events: none;
                z-index: 99998 !important;
                animation: ae86-cruising-fade 0.55s ease-out forwards;
                will-change: transform, opacity;
            }
            @keyframes ae86-cruising-fade {
                0%   { opacity: 0.55; transform: translate(0, 0) scale(0.5); }
                50%  { opacity: 0.3; }
                100% { opacity: 0;    transform: translate(-15px, -3px) scale(1.6); }
            }


            /* ─── Calzada de Tokio SOLO en la barra de reproducción (Seekbar) ─── */
            .playback-bar,
            [data-testid="playback-progressbar"] {
                display: flex !important;
                align-items: center !important;
                position: relative !important;
                z-index: 10 !important;
                overflow: visible !important;
            }

            .playback-bar .progress-bar,
            [data-testid="playback-progressbar"] .progress-bar,
            .playback-bar [data-testid="progress-bar"],
            [data-testid="playback-progressbar"] [data-testid="progress-bar"] {
                height: 18px !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                overflow: visible !important;
                display: flex !important;
                align-items: center !important;
                align-self: center !important;
                margin: 0 !important;
            }

            /* Calzada de asfalto japonés de Tokio con arcenes de franjas diagonales blancas (Shutoko / C1) */
            .playback-bar .x-progressBar-background,
            .playback-bar .x-progressBar-progressBarBg,
            .playback-bar [data-testid="progress-bar"] > div:first-child,
            [data-testid="playback-progressbar"] .x-progressBar-background,
            [data-testid="playback-progressbar"] .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"] [data-testid="progress-bar"] > div:first-child {
                position: relative !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                box-sizing: border-box !important;
                background-color: #1e2025 !important;
                background-image: 
                    repeating-linear-gradient(
                        -50deg,
                        #ffffff 0px,
                        #ffffff 2px,
                        transparent 2px,
                        transparent 8px
                    ),
                    linear-gradient(#ffffff, #ffffff),
                    linear-gradient(#ffffff, #ffffff),
                    repeating-linear-gradient(
                        50deg,
                        #ffffff 0px,
                        #ffffff 2px,
                        transparent 2px,
                        transparent 8px
                    ) !important;
                background-size: 
                    100% 3px,
                    100% 1px,
                    100% 1px,
                    100% 3px !important;
                background-position: 
                    left top 0px,
                    left top 3px,
                    left bottom 3px,
                    left bottom 0px !important;
                background-repeat: repeat-x !important;
                height: 18px !important;
                border-radius: 3px !important;
                border-top: 1.2px solid #ffffff !important;
                border-bottom: 1.2px solid #ffffff !important;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.7) !important;
                overflow: hidden !important;
                transition: none !important;
            }

            .playback-bar:hover .x-progressBar-background,
            .playback-bar:active .x-progressBar-background,
            .playback-bar:hover .x-progressBar-progressBarBg,
            .playback-bar:active .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"]:hover .x-progressBar-background,
            [data-testid="playback-progressbar"]:active .x-progressBar-background,
            [data-testid="playback-progressbar"]:hover .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"]:active .x-progressBar-progressBarBg,
            .playback-bar [class*="is-dragging"] .x-progressBar-background,
            .playback-bar [class*="is-dragging"] .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"] [class*="is-dragging"] .x-progressBar-background,
            [data-testid="playback-progressbar"] [class*="is-dragging"] .x-progressBar-progressBarBg {
                height: 18px !important;
                background-color: #1e2025 !important;
            }

            /* Progreso iluminado SOLO en la barra de reproducción */
            .playback-bar .x-progressBar-fillColor,
            [data-testid="playback-progressbar"] .x-progressBar-fillColor {
                background: linear-gradient(90deg, rgba(29, 185, 84, 0.25) 0%, rgba(29, 185, 84, 0.55) 100%) !important;
                height: 100% !important;
                border-radius: 0px !important;
                border-right: 2px solid #2ecc71 !important;
                box-shadow: 0 0 10px rgba(46, 204, 113, 0.6) !important;
            }

            /* Ocultar el cursor/thumb circular de Spotify SOLO en la barra de reproducción */
            .playback-bar .progress-bar__slider,
            .playback-bar:hover .progress-bar__slider,
            [data-testid="playback-progressbar"] .progress-bar__slider,
            [data-testid="playback-progressbar"]:hover .progress-bar__slider,
            .playback-bar [class*="is-dragging"] .progress-bar__slider,
            [data-testid="playback-progressbar"] [class*="is-dragging"] .progress-bar__slider {
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
                display: none !important;
            }

            /* Ocultar lineas planas nativas durante la curva */
            .playback-bar.ae86-hide-native .progress-bar__slider,
            .playback-bar.ae86-hide-native .x-progressBar-fillColor,
            .playback-bar.ae86-hide-native .x-progressBar-background,
            .playback-bar.ae86-hide-native .x-progressBar-progressBarBg,
            .playback-bar.ae86-hide-native [data-testid="progress-bar"] > div:not(#\${CAR_ID}):not(#\${SVG_CURVE_ID}),
            [data-testid="playback-progressbar"].ae86-hide-native .progress-bar__slider,
            [data-testid="playback-progressbar"].ae86-hide-native .x-progressBar-fillColor,
            [data-testid="playback-progressbar"].ae86-hide-native .x-progressBar-background,
            [data-testid="playback-progressbar"].ae86-hide-native .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"].ae86-hide-native [data-testid="progress-bar"] > div:not(#\${CAR_ID}):not(#\${SVG_CURVE_ID}) {
                opacity: 0 !important;
            }

            .player-controls__buttons {
                will-change: transform;
                z-index: 1 !important;
            }

            /* ─── Protección estricta del slider de volumen de Spotify ─── */
            .main-nowPlayingBar-volumeBar,
            [data-testid="volume-bar"],
            .volume-bar,
            .main-nowPlayingBar-right [data-testid="progress-bar"],
            .main-nowPlayingBar-volumeBar [data-testid="progress-bar"],
            [data-testid="volume-bar"] [data-testid="progress-bar"],
            .volume-bar [data-testid="progress-bar"],
            .main-nowPlayingBar-right .progress-bar,
            .main-nowPlayingBar-volumeBar .progress-bar,
            [data-testid="volume-bar"] .progress-bar,
            .volume-bar .progress-bar {
                height: auto !important;
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
            }
            .main-nowPlayingBar-right .x-progressBar-progressBarBg,
            .main-nowPlayingBar-right .x-progressBar-background,
            .main-nowPlayingBar-right [data-testid="progress-bar"] > div:first-child,
            .main-nowPlayingBar-volumeBar .x-progressBar-progressBarBg,
            .main-nowPlayingBar-volumeBar .x-progressBar-background,
            .main-nowPlayingBar-volumeBar [data-testid="progress-bar"] > div:first-child,
            [data-testid="volume-bar"] .x-progressBar-progressBarBg,
            [data-testid="volume-bar"] .x-progressBar-background,
            [data-testid="volume-bar"] [data-testid="progress-bar"] > div:first-child,
            .volume-bar .x-progressBar-progressBarBg,
            .volume-bar .x-progressBar-background,
            .volume-bar [data-testid="progress-bar"] > div:first-child {
                height: var(--progress-bar-height, 4px) !important;
                background-image: none !important;
                background-color: var(--bg-color, var(--spice-subtext, rgba(255, 255, 255, 0.3))) !important;
                border: none !important;
                box-shadow: none !important;
                border-radius: var(--progress-bar-radius, 2px) !important;
            }
            .main-nowPlayingBar-right .x-progressBar-fillColor,
            .main-nowPlayingBar-volumeBar .x-progressBar-fillColor,
            [data-testid="volume-bar"] .x-progressBar-fillColor,
            .volume-bar .x-progressBar-fillColor {
                border-right: none !important;
                box-shadow: none !important;
                border-radius: var(--progress-bar-radius, 2px) !important;
            }
            .main-nowPlayingBar-right .progress-bar__slider,
            .main-nowPlayingBar-volumeBar .progress-bar__slider,
            [data-testid="volume-bar"] .progress-bar__slider,
            .volume-bar .progress-bar__slider {
                display: block !important;
                pointer-events: auto !important;
                width: 12px !important;
                height: 12px !important;
            }
        \`;

    function createCarElement() {
        const wrapper = document.createElement("div");
        wrapper.id = CAR_ID;
        wrapper.className = "driving";
        wrapper.innerHTML = \`
            <img class="ae86-img ae86-idle" src="\${AE86_IDLE}" alt="AE86 Pausa (3/4 frontal)" draggable="false" />
            <img class="ae86-img ae86-drive" src="\${AE86_DRIVE}" alt="AE86 Corriendo (Lateral)" draggable="false" />
            <img class="ae86-img ae86-drift" src="\${AE86_DRIFT}" alt="AE86 Derrape" draggable="false" />
            <div class="ae86-headlight-glow"></div>
            <div class="ae86-hazard ae86-hazard-front-right"></div>
            <div class="ae86-hazard ae86-hazard-front-left"></div>
            <div class="ae86-hazard ae86-hazard-side-left"></div>
            <div class="ae86-hazard ae86-hazard-rear-left"></div>
        \`;
        return wrapper;
    }

    function createImprezaElement() {
        const wrapper = document.createElement("div");
        wrapper.id = IMPREZA_ID;
        wrapper.innerHTML = \`
            <img class="impreza-img" src="\${BUNTA_IMPREZA}" alt="Subaru Impreza WRX STI Type R (Bunta)" draggable="false" />
            <div class="impreza-headlight-glow"></div>
        \`;
        return wrapper;
    }

    function getPlaybackTarget() {
        return document.querySelector('.playback-bar [data-testid="progress-bar"]') ||
               document.querySelector('[data-testid="playback-progressbar"] [data-testid="progress-bar"]') ||
               document.querySelector('.playback-bar .progress-bar') ||
               document.querySelector('[data-testid="playback-progressbar"] .progress-bar') ||
               document.querySelector('.playback-bar') ||
               document.querySelector('[data-testid="playback-progressbar"]');
    }

    function isPlayerPlaying() {
        const playBtn = document.querySelector('[data-testid="control-button-playpause"]');
        if (playBtn) {
            const label = (playBtn.getAttribute("aria-label") || playBtn.title || "").toLowerCase();
            if (label.includes("paus")) return true;
            if (label.includes("play") || label.includes("reproduc")) return false;
        }

        if (typeof Spicetify?.Player?.isPlaying === "function") {
            try { return !!Spicetify.Player.isPlaying(); } catch(e) {}
        }

        if (typeof Spicetify?.Player?.data?.isPaused === "boolean") {
            return !Spicetify.Player.data.isPaused;
        }

        return false;
    }

    function init() {
        const road = getPlaybackTarget();
        if (!road) {
            setTimeout(init, 300);
            return;
        }

        road.style.setProperty("position", "relative", "important");
        road.style.setProperty("overflow", "visible", "important");

        let svgCurve = document.getElementById(SVG_CURVE_ID);
        if (!svgCurve) {
            svgCurve = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgCurve.id = SVG_CURVE_ID;
            road.appendChild(svgCurve);
        }
        svgCurve.innerHTML = \`
            <path id="ae86-curve-asphalt"       stroke="#1e2025" stroke-width="18" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-fill"          stroke="#1db954" stroke-width="18" stroke-linecap="butt" fill="none" opacity="0.45"/>
            <path id="ae86-curve-stripes"       stroke="#ffffff" stroke-width="1.6" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-top"    stroke="#ffffff" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-top"     stroke="#ffffff" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-bottom"  stroke="#ffffff" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-bottom" stroke="#ffffff" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
        \`;

        const pathAsphalt = svgCurve.querySelector("#ae86-curve-asphalt");
        const pathFill = svgCurve.querySelector("#ae86-curve-fill");
        const pathStripes = svgCurve.querySelector("#ae86-curve-stripes");
        const pathBorderTop = svgCurve.querySelector("#ae86-curve-border-top");
        const pathInnerTop = svgCurve.querySelector("#ae86-curve-inner-top");
        const pathInnerBottom = svgCurve.querySelector("#ae86-curve-inner-bottom");
        const pathBorderBottom = svgCurve.querySelector("#ae86-curve-border-bottom");

        let car = document.getElementById(CAR_ID);
        if (!car) {
            car = createCarElement();
            road.appendChild(car);
        }

        let impreza = document.getElementById(IMPREZA_ID);
        if (!impreza) {
            impreza = createImprezaElement();
            road.appendChild(impreza);
        }

        const playerButtons = document.querySelector(".player-controls__buttons");

        let isDragging = false;
        let dragProgress = null;
        let lastX = 0;
        let lastTime = performance.now();
        let velocity = 0;
        let archHeight = 0;
        let archVelocity = 0;
        let lastKnownProgress = null;
        let driftEndTime = 0;

        // Bunta Fujiwara Impreza Overtake state
        let buntaActive = false;
        let buntaX = -80;
        let buntaYOffset = -6;
        let nextBuntaTime = performance.now() + 10 * 1000;
        let surpriseStartTime = 0;
        let lastLoopTime = performance.now();

        window.__triggerBuntaOvertake = function() {
            if (buntaActive) return;
            buntaActive = true;
            buntaX = -80;
            buntaYOffset = -6;
            surpriseStartTime = 0;
            if (impreza) impreza.style.display = "block";
        };

        // Atajo de teclado: Tecla 'B' para llamar a Bunta inmediatamente
        if (!window.__ae86BuntaKeyBound) {
            window.__ae86BuntaKeyBound = true;
            window.addEventListener("keydown", (e) => {
                if ((e.key === "b" || e.key === "B") && !["INPUT", "TEXTAREA"].includes(e.target && e.target.tagName)) {
                    window.__triggerBuntaOvertake();
                }
            });
        }

        // Click directo en el AE86
        car.style.cursor = "pointer";
        car.title = "AE86 (Click o tecla 'B' para llamar a Bunta)";
        car.onclick = (e) => {
            e.stopPropagation();
            window.__triggerBuntaOvertake();
        };

        let buntaBtn = document.getElementById("ae86-bunta-btn");

        const CAR_WIDTH = 52;

        let lastSmokeTime = 0;
        function emitSmoke(x, y, scale, parentElem) {
            const now = performance.now();
            if (now - lastSmokeTime < 18) return;
            lastSmokeTime = now;

            for (let i = 0; i < 3; i++) {
                const smoke = document.createElement("div");
                smoke.className = "ae86-smoke-puff";
                const size = (12 + Math.random() * 12) * scale;
                smoke.style.width = size + "px";
                smoke.style.height = size + "px";
                const jitterX = (Math.random() - 0.5) * 12;
                const jitterY = (Math.random() - 0.5) * 6;
                smoke.style.left = (x - size / 2 + jitterX) + "px";
                smoke.style.top = (y - size / 2 + jitterY) + "px";
                parentElem.appendChild(smoke);
                setTimeout(() => smoke.remove(), 550);
            }
        }

        let lastCruisingSmokeTime = 0;
        function emitCruisingSmoke(x, y, parentElem) {
            const now = performance.now();
            if (now - lastCruisingSmokeTime < 120) return;
            lastCruisingSmokeTime = now;

            const smoke = document.createElement("div");
            smoke.className = "ae86-cruising-smoke";
            const size = 6 + Math.random() * 3;
            smoke.style.width = size + "px";
            smoke.style.height = size + "px";
            smoke.style.left = (x - size / 2) + "px";
            smoke.style.top = (y - size / 2) + "px";
            parentElem.appendChild(smoke);
            setTimeout(() => smoke.remove(), 550);
        }


        let cachedRoad = null;
        let lastTargetCheck = 0;
        function getPlaybackTargetCached() {
            const now = performance.now();
            if (cachedRoad && cachedRoad.isConnected && now - lastTargetCheck < 1000) {
                return cachedRoad;
            }
            lastTargetCheck = now;
            cachedRoad = getPlaybackTarget();
            return cachedRoad;
        }

        function loop() {
            const currentRoad = getPlaybackTargetCached();
            if (!currentRoad) {
                requestAnimationFrame(loop);
                return;
            }

            if (currentRoad.style.position !== "relative") {
                currentRoad.style.setProperty("position", "relative", "important");
            }

            if (car.parentElement !== currentRoad) {
                currentRoad.appendChild(car);
            }
            if (impreza && impreza.parentElement !== currentRoad) {
                currentRoad.appendChild(impreza);
            }
            if (svgCurve.parentElement !== currentRoad) {
                currentRoad.appendChild(svgCurve);
            }

            const pControls = document.querySelector(".player-controls__right") || document.querySelector(".player-controls__buttons");
            if (pControls && (!buntaBtn || buntaBtn.parentElement !== pControls)) {
                if (!buntaBtn) {
                    buntaBtn = document.createElement("button");
                    buntaBtn.id = "ae86-bunta-btn";
                    buntaBtn.className = "main-actionButtons-button";
                    buntaBtn.title = "Adelantamiento Bunta GC8 (Hotkey: B)";
                    buntaBtn.innerHTML = '<span style="font-size: 11px; font-weight: 800; color: #4da6ff; background: rgba(0, 102, 255, 0.15); border: 1px solid rgba(77, 166, 255, 0.4); border-radius: 4px; padding: 2px 5px; font-family: monospace;">GC8</span>';
                    buntaBtn.style.cssText = "background: none; border: none; cursor: pointer; padding: 0 4px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.1s;";
                    buntaBtn.onclick = (e) => {
                        e.stopPropagation();
                        window.__triggerBuntaOvertake();
                    };
                }
                pControls.appendChild(buntaBtn);
            }

            const rect = currentRoad.getBoundingClientRect();
            const w = Math.max(rect.width, 200);
            const baseline = rect.height / 2;

            const isPlaying = isPlayerPlaying();

            if (isPlaying) {
                car.classList.remove("paused");
                car.classList.add("driving");
            } else {
                car.classList.add("paused");
                car.classList.remove("driving");
            }

            let progress = 0;
            if (isDragging && dragProgress !== null) {
                progress = dragProgress;
            } else {
                let foundProgress = false;

                const cssTransform = currentRoad.style.getPropertyValue('--progress-bar-transform') ||
                                     currentRoad.parentElement?.style?.getPropertyValue?.('--progress-bar-transform');
                if (cssTransform) {
                    const parsed = parseFloat(cssTransform) / 100;
                    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
                        progress = parsed;
                        foundProgress = true;
                    }
                }

                if (!foundProgress) {
                    const input = currentRoad.querySelector?.('input[type="range"]') || 
                                  currentRoad.parentElement?.querySelector?.('input[type="range"]') ||
                                  document.querySelector('.playback-bar input[type="range"], [data-testid="playback-progressbar"] input[type="range"]');
                    if (input && input.max && parseFloat(input.max) > 0) {
                        const val = parseFloat(input.value) / parseFloat(input.max);
                        if (!isNaN(val) && val >= 0 && val <= 1) {
                            progress = val;
                            foundProgress = true;
                        }
                    }
                }

                if (!foundProgress && typeof Spicetify.Player.getProgress === "function" && typeof Spicetify.Player.getDuration === "function") {
                    const dur = Spicetify.Player.getDuration();
                    const cur = Spicetify.Player.getProgress();
                    if (dur > 0 && typeof cur === "number" && !isNaN(cur)) {
                        progress = Math.max(0, Math.min(cur / dur, 1));
                        foundProgress = true;
                    }
                }

                if (!foundProgress && typeof Spicetify.Player.getProgressPercent === "function") {
                    const pct = Spicetify.Player.getProgressPercent();
                    if (typeof pct === "number" && !isNaN(pct) && pct >= 0 && pct <= 1) {
                        progress = pct;
                        foundProgress = true;
                    }
                }

                if (!foundProgress && Spicetify.Player.data?.item?.duration?.milliseconds) {
                    const dur = Spicetify.Player.data.item.duration.milliseconds;
                    const pos = Spicetify.Player.data.position;
                    if (dur > 0 && typeof pos === "number" && !isNaN(pos)) {
                        progress = Math.max(0, Math.min(pos / dur, 1));
                        foundProgress = true;
                    }
                }

                if (lastKnownProgress !== null) {
                    const diff = progress - lastKnownProgress;
                    if (Math.abs(diff) > 0.015 && Math.abs(diff) < 0.95) {
                        velocity = Math.sign(diff) * Math.min(2.5, Math.abs(diff) * 18);
                        archVelocity = Math.min(12, Math.abs(diff) * 40);
                    }
                }
            }
            lastKnownProgress = progress;

            const now = performance.now();
            const isPostDrifting = now < driftEndTime;
            const driftDecay = isDragging ? 1 : (isPostDrifting ? Math.max(0, (driftEndTime - now) / 1500) : 0);

            if (isDragging) {
                const absV = Math.min(Math.abs(velocity), 4);
                const targetArch = Math.min(13, 2 + absV * 5);
                archHeight += (targetArch - archHeight) * 0.45;
            } else if (isPostDrifting) {
                const targetArch = 10 * Math.pow(driftDecay, 1.4);
                archHeight += (targetArch - archHeight) * 0.16;
            } else {
                const springK = 0.16;
                const damping = 0.72;
                archVelocity += (0 - archHeight) * springK;
                archVelocity *= damping;
                archHeight += archVelocity;
                if (Math.abs(archHeight) < 0.2 && Math.abs(archVelocity) < 0.2) {
                    archHeight = 0;
                    archVelocity = 0;
                }
                velocity *= 0.75;
                if (Math.abs(velocity) < 0.05) velocity = 0;
            }

            const dt = Math.min((now - lastLoopTime) / 1000, 0.1);
            lastLoopTime = now;

            // ─── Lógica del adelantamiento de Bunta (Subaru Impreza GC8) ───
            if (isPlaying && !isDragging && !buntaActive && now >= nextBuntaTime) {
                buntaActive = true;
                buntaX = -80;
                buntaYOffset = -6;
                surpriseStartTime = 0;
                if (impreza) impreza.style.display = "block";
            }

            const halfW = CAR_WIDTH / 2;
            const t = Math.max(0, Math.min(progress, 1));
            const carX = t * w;
            const carY = baseline - 4 * t * (1 - t) * archHeight;
            const clampedCarX = Math.max(halfW, Math.min(carX, w - halfW));

            if (buntaActive) {
                const buntaSpeed = 260; // px / seg
                buntaX += buntaSpeed * dt;

                // Overtake path: por el carril superior (-6px) y al rebasar se alinea hacia adelante
                if (buntaX > clampedCarX + 55) {
                    buntaYOffset += (-1.0 - buntaYOffset) * 0.08;
                } else {
                    buntaYOffset += (-6.0 - buntaYOffset) * 0.12;
                }

                // Sobreviraje por sorpresa en el instante que Bunta se pone al lado del AE86
                if (buntaX >= clampedCarX - 15 && surpriseStartTime === 0) {
                    surpriseStartTime = now;
                }

                if (impreza) {
                    impreza.style.left = (buntaX - 27) + "px";
                    impreza.style.top = (carY - 10 + buntaYOffset) + "px";
                    impreza.style.display = "block";
                }

                // Humo de escape bóxer del Subaru
                emitCruisingSmoke(buntaX - 27, carY + buntaYOffset + 4, currentRoad);

                if (buntaX > w + 90) {
                    buntaActive = false;
                    if (impreza) impreza.style.display = "none";
                    nextBuntaTime = now + 10 * 1000;
                }
            } else {
                if (impreza && impreza.style.display !== "none") {
                    impreza.style.display = "none";
                }
            }

            // Física de reacción del AE86: sobreviraje y oscilación de volante por la sorpresa
            const surpriseElapsed = surpriseStartTime > 0 ? (now - surpriseStartTime) / 1000 : 999;
            const isSurprised = surpriseElapsed < 1.3;
            const surpriseDecay = isSurprised ? Math.max(0, 1 - surpriseElapsed / 1.3) : 0;
            const surpriseWobble = isSurprised ? Math.sin(surpriseElapsed * 24) * 8.5 * Math.pow(surpriseDecay, 1.2) : 0;
            const isSurpriseDrifting = isSurprised && surpriseElapsed < 0.65;

            const isDriftingNow = isDragging || isPostDrifting || isSurpriseDrifting;
            car.classList.toggle("drifting", isDriftingNow);

            const showCurve = isDragging || isPostDrifting || archHeight > 0.4;
            const containerElem = currentRoad.closest('.playback-bar, [data-testid="playback-progressbar"]') || currentRoad;
            containerElem.classList.toggle("ae86-hide-native", showCurve);
            svgCurve.style.display = showCurve ? "block" : "none";

            if (playerButtons) {
                const lift = showCurve ? archHeight * 0.5 : 0;
                playerButtons.style.transform = lift > 0.4 ? "translateY(-" + lift + "px)" : "none";
            }

            if (showCurve) {
                const controlY = baseline - (archHeight * 2);

                const pathCenterD = "M 0," + baseline.toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + controlY.toFixed(2) + " " + w.toFixed(2) + "," + baseline.toFixed(2);
                const pathTopBorderD = "M 0," + (baseline - 8.2).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 8.2).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 8.2).toFixed(2);
                const pathTopInnerD = "M 0," + (baseline - 5.0).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 5.0).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 5.0).toFixed(2);
                const pathBottomInnerD = "M 0," + (baseline + 5.0).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 5.0).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 5.0).toFixed(2);
                const pathBorderBottomD = "M 0," + (baseline + 8.2).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 8.2).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 8.2).toFixed(2);

                if (pathAsphalt) pathAsphalt.setAttribute("d", pathCenterD);
                if (pathFill) {
                    pathFill.setAttribute("d", pathCenterD);
                    const curveLen = Math.sqrt(w * w + archHeight * archHeight * 2);
                    pathFill.style.strokeDasharray = curveLen + "";
                    pathFill.style.strokeDashoffset = (curveLen * (1 - progress)) + "";
                }
                if (pathBorderTop) pathBorderTop.setAttribute("d", pathTopBorderD);
                if (pathInnerTop) pathInnerTop.setAttribute("d", pathTopInnerD);
                if (pathInnerBottom) pathInnerBottom.setAttribute("d", pathBottomInnerD);
                if (pathBorderBottom) pathBorderBottom.setAttribute("d", pathBorderBottomD);

                let stripesD = "";
                const step = 8;
                for (let x = 3; x < w - 3; x += step) {
                    const curT = x / w;
                    const curY = baseline - 4 * curT * (1 - curT) * archHeight;
                    const curDy = -4 * (1 - 2 * curT) * archHeight;
                    const len = Math.sqrt(step * step + curDy * curDy);
                    const nx = -curDy / len;
                    const ny = step / len;

                    const xTop1 = x + nx * 8.2 - 2;
                    const yTop1 = curY + ny * 8.2;
                    const xTop2 = x + nx * 5.0 + 2;
                    const yTop2 = curY + ny * 5.0;
                    stripesD += "M " + xTop1.toFixed(1) + "," + yTop1.toFixed(1) + " L " + xTop2.toFixed(1) + "," + yTop2.toFixed(1) + " ";

                    const xBot1 = x - nx * 5.0 - 2;
                    const yBot1 = curY - ny * 5.0;
                    const xBot2 = x - nx * 8.2 + 2;
                    const yBot2 = curY - ny * 8.2;
                    stripesD += "M " + xBot1.toFixed(1) + "," + yBot1.toFixed(1) + " L " + xBot2.toFixed(1) + "," + yBot2.toFixed(1) + " ";
                }
                if (pathStripes) pathStripes.setAttribute("d", stripesD);
            }

            const tangentDy = -4 * (1 - 2 * t) * archHeight;
            const curveAngle = Math.atan2(tangentDy, w) * (180 / Math.PI);
            const totalAngle = isDriftingNow ? (curveAngle * Math.min(1, driftDecay * 1.3)) : 0;

            const bounce = isDriftingNow 
                ? (Math.sin(now * 0.045) * 1.5 + Math.sin(now * 0.11) * 0.8) * Math.min(1, driftDecay * 1.3)
                : 0;
            const dynamicRoll = isDriftingNow
                ? (Math.sin(now * 0.038) * 1.2) * Math.min(1, driftDecay)
                : 0;

            car.style.left = (clampedCarX - halfW) + "px";
            car.style.top = (carY - 10 + bounce) + "px";
            car.style.transform = "rotate(" + (totalAngle + dynamicRoll + surpriseWobble).toFixed(2) + "deg)";

            if (isDriftingNow) {
                const smokeScale = isSurpriseDrifting
                    ? (1.3 * surpriseDecay)
                    : ((1.0 + Math.min(Math.abs(velocity), 3) * 0.25) * Math.max(0.6, driftDecay));
                emitSmoke(clampedCarX - halfW + 6, carY + 4, smokeScale, currentRoad);
            } else if (isPlaying) {
                emitCruisingSmoke(clampedCarX - halfW + 1, carY + 3, currentRoad);
            }

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        function isProgressBarElement(elem) {
            if (!elem) return false;
            if (elem.closest?.('.volume-bar, [data-testid="volume-bar"], .main-nowPlayingBar-right, .main-nowPlayingBar-volumeBar')) return false;
            return !!(
                elem.closest?.('.playback-bar, [data-testid="playback-progressbar"]')
            );
        }

        function onGlobalPointerMove(e) {
            if (!isDragging) return;

            const currentRoad = getPlaybackTargetCached();
            if (!currentRoad) return;

            const now = performance.now();
            const dt = Math.max(now - lastTime, 8);
            const dx = e.clientX - lastX;
            velocity = velocity * 0.2 + (dx / dt) * 0.8;

            const rect = currentRoad.getBoundingClientRect();
            const clampedX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            dragProgress = clampedX / rect.width;

            lastX = e.clientX;
            lastTime = now;
        }

        function onGlobalPointerUp() {
            if (!isDragging) return;
            const finalProgress = dragProgress;
            isDragging = false;
            dragProgress = null;
            velocity = 0;
            driftEndTime = performance.now() + 1500;

            if (typeof finalProgress === "number" && !isNaN(finalProgress) && finalProgress >= 0 && finalProgress <= 1) {
                lastKnownProgress = finalProgress;
                try {
                    if (typeof Spicetify.Player.seek === "function") {
                        Spicetify.Player.seek(finalProgress);
                    } else if (Spicetify.Platform?.PlayerAPI?.seekTo) {
                        const dur = typeof Spicetify.Player.getDuration === "function" ? Spicetify.Player.getDuration() : 0;
                        if (dur > 0) {
                            Spicetify.Platform.PlayerAPI.seekTo(Math.round(finalProgress * dur));
                        }
                    }
                } catch (err) {
                    console.warn("[Drift86] Seek error:", err);
                }
            }

            window.removeEventListener("pointermove", onGlobalPointerMove, true);
            window.removeEventListener("pointerup", onGlobalPointerUp, true);
        }

        function onGlobalPointerDown(e) {
            if (isDragging) return;
            if (!isProgressBarElement(e.target)) return;

            const currentRoad = getPlaybackTargetCached();
            if (!currentRoad) return;

            isDragging = true;
            driftEndTime = 0;
            lastX = e.clientX;
            lastTime = performance.now();
            velocity = 0;

            const rect = currentRoad.getBoundingClientRect();
            const clampedX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            dragProgress = clampedX / rect.width;

            window.addEventListener("pointermove", onGlobalPointerMove, true);
            window.addEventListener("pointerup", onGlobalPointerUp, true);
        }

        window.addEventListener("pointerdown", onGlobalPointerDown, true);
    }

    init();
})();
`;

fs.writeFileSync(path.join(__dirname, 'drift86.js'), jsContent, 'utf8');
console.log('Build OK. File written to drift86.js, size:', fs.statSync(path.join(__dirname, 'drift86.js')).size);

const appData = process.env.APPDATA || (process.env.HOME ? path.join(process.env.HOME, '.config') : null);
if (appData) {
    const extPath = path.join(appData, 'spicetify', 'Extensions', 'drift86.js');
    try {
        fs.copyFileSync(path.join(__dirname, 'drift86.js'), extPath);
        console.log('Copied directly to Spicetify Extensions:', extPath);
    } catch (e) {
        // Ignored if Spicetify directory is not present
    }
}
