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
                transition: none;
                display: none;
            }

            #\${IMPREZA_ID} .impreza-body {
                position: absolute;
                top: 0; left: 0;
                width: 100%;
                height: 100%;
                will-change: opacity, filter;
                filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7));
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

            /* Faros delanteros xenón/HID (Siempre encendidos durante la animación) */
            #\${IMPREZA_ID} .impreza-headlight-lamp {
                position: absolute;
                right: 2px;
                bottom: 6.8px;
                width: 3.5px;
                height: 2.6px;
                background: #e8f5ff;
                border-radius: 1px;
                box-shadow: 0 0 3px #a0d8ff, 0 0 6px rgba(120, 205, 255, 0.95);
                pointer-events: none;
                z-index: 5;
            }

            #\${IMPREZA_ID} .impreza-headlight-glow {
                position: absolute;
                bottom: 3.5px;
                right: -16px;
                width: 26px;
                height: 12px;
                background: radial-gradient(
                    ellipse at left center,
                    rgba(180, 230, 255, 0.9) 0%,
                    rgba(80, 175, 255, 0.4) 40%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                z-index: 4;
            }

            /* Luces traseras rojas estacionarias (Siempre encendidas durante la animación) */
            #\${IMPREZA_ID} .impreza-taillight-lamp {
                position: absolute;
                left: 2px;
                bottom: 7.8px;
                width: 3.8px;
                height: 2.2px;
                background: #ff1818;
                border-radius: 1px;
                box-shadow: 0 0 3px #ff0000, 0 0 7px rgba(255, 20, 20, 0.95);
                pointer-events: none;
                z-index: 5;
            }

            #\${IMPREZA_ID} .impreza-taillight-glow {
                position: absolute;
                left: -12px;
                bottom: 4.5px;
                width: 18px;
                height: 10px;
                background: radial-gradient(
                    ellipse at right center,
                    rgba(255, 25, 25, 0.8) 0%,
                    rgba(255, 0, 0, 0.3) 45%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                z-index: 4;
            }

            /* Conductor Takumi Fujiwara en el AE86 */
            .ae86-driver-takumi {
                position: absolute;
                left: 21.8px;
                bottom: 8.2px;
                width: 9.5px;
                height: 6.2px;
                pointer-events: none;
                z-index: 1;
            }
            .takumi-svg {
                width: 100%;
                height: 100%;
                display: block;
                shape-rendering: geometricPrecision;
            }
            #\${CAR_ID}.paused .ae86-driver-takumi {
                display: none;
            }
            #\${CAR_ID}.drifting .ae86-driver-takumi {
                transform: rotate(-3deg) translateY(-0.2px);
            }

            /* Animación de cambio de marchas en la caja de cambios (Takumi y Bunta) */
            .ae86-driver-takumi .takumi-arm-shift {
                animation: ae86-gear-shift 3.4s infinite ease-in-out;
                transform-origin: 5px 8px;
            }
            @keyframes ae86-gear-shift {
                0%, 65%, 100% {
                    transform: rotate(0deg);
                }
                72% {
                    transform: rotate(7deg) translate(0.1px, 0.4px);
                }
                78% {
                    transform: rotate(4deg) translate(0.3px, 0.2px);
                }
                85% {
                    transform: rotate(8deg) translate(0.1px, 0.5px);
                }
                92% {
                    transform: rotate(0deg);
                }
            }

            /* Conductor Bunta Fujiwara en el Impreza GC8 */
            .impreza-driver-bunta {
                position: absolute;
                left: 23.2px;
                bottom: 8.5px;
                width: 10px;
                height: 6.5px;
                pointer-events: none;
                z-index: 1;
            }
            .bunta-svg {
                width: 100%;
                height: 100%;
                display: block;
                shape-rendering: geometricPrecision;
            }
            .impreza-driver-bunta .bunta-arm-shift {
                animation: bunta-gear-shift 4.2s infinite ease-in-out;
                transform-origin: 5px 8px;
            }
            @keyframes bunta-gear-shift {
                0%, 70%, 100% {
                    transform: rotate(0deg);
                }
                78% {
                    transform: rotate(6deg) translate(0.1px, 0.3px);
                }
                86% {
                    transform: rotate(3deg) translate(0.2px, 0.2px);
                }
                93% {
                    transform: rotate(0deg);
                }
            }

            /* Estela viva y sutil de humo del cigarrillo de Bunta */
            .bunta-smoke-container {
                position: absolute;
                left: 29.8px;
                bottom: 11.8px;
                width: 1px;
                height: 1px;
                pointer-events: none;
                z-index: 10;
            }
            .bunta-smoke-puff {
                position: absolute;
                top: 0;
                left: 0;
                width: 2.4px;
                height: 2.4px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(225, 235, 250, 0.75) 60%, rgba(200, 215, 240, 0) 100%);
                border-radius: 50%;
                filter: blur(0.4px);
                pointer-events: none;
                animation: bunta-smoke-wisp 1.25s infinite ease-out;
            }
            .bunta-smoke-puff.p1 {
                animation-delay: 0s;
            }
            .bunta-smoke-puff.p2 {
                animation-delay: 0.42s;
            }
            .bunta-smoke-puff.p3 {
                animation-delay: 0.84s;
            }

            @keyframes bunta-smoke-wisp {
                0% {
                    transform: translate(0, 0) scale(0.6);
                    opacity: 0.9;
                }
                20% {
                    transform: translate(0.6px, -1.8px) scale(0.9);
                    opacity: 0.8;
                }
                45% {
                    transform: translate(-2.2px, -3.8px) scale(1.4);
                    opacity: 0.6;
                }
                75% {
                    transform: translate(-6.5px, -5.6px) scale(2.0);
                    opacity: 0.35;
                }
                100% {
                    transform: translate(-12px, -7.2px) scale(2.7);
                    opacity: 0;
                }
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
            <div class="ae86-driver-takumi">
                <svg viewBox="0 0 19 12" class="takumi-svg">
                    <!-- Asiento TRD oscuro -->
                    <path d="M1,2 Q1.8,1 2.8,1 L3.2,4.5 L1.8,12 L0.5,12 Z" fill="#1c1e24" />
                    <rect x="1.5" y="0.8" width="1.6" height="2.2" rx="0.5" fill="#14161a" />
                    <!-- Torso (polo blanco concentrado) -->
                    <polygon points="2.8,7 6.5,7 8.5,12 2,12" fill="#f5f5fa" />
                    <rect x="5.2" y="5.2" width="1.8" height="1.8" fill="#f0cbaf" />
                    <rect x="5.1" y="6.8" width="2" height="0.8" fill="#2d3038" />
                    <!-- Cabeza y mandíbula anime -->
                    <polygon points="4.8,3.4 8.6,3.4 9.2,5.2 8.4,6.4 5.8,6.6 4.8,5.4" fill="#f0cbaf" />
                    <polygon points="8.6,4.8 9.5,5.2 8.6,5.6" fill="#f0cbaf" />
                    <!-- Ojos concentrados -->
                    <line x1="6.8" y1="4.6" x2="8.6" y2="4.6" stroke="#18181c" stroke-width="0.7" stroke-linecap="round" />
                    <line x1="6.6" y1="4.0" x2="8.6" y2="4.0" stroke="#4a2e1c" stroke-width="0.4" stroke-linecap="round" />
                    <circle cx="8.3" cy="4.5" r="0.25" fill="#ffffff" />
                    <!-- Pelo castaño en capas -->
                    <polygon points="2.8,2.8 7.5,2.8 7.2,5 2.2,5" fill="#442c1c" />
                    <polygon points="2.2,3.8 3.8,3.8 3.4,6.2 2,6.2" fill="#442c1c" />
                    <path d="M3.2,2.8 C3.6,1.2 5.5,0.8 8.2,1.2 L8.8,2.2 L6.6,2.8 Z" fill="#583924" />
                    <polygon points="5.8,3 9.4,3.6 8.8,4.8 6.5,4.2" fill="#442c1c" />
                    <polygon points="8.4,3.8 9.4,4.4 8.2,4.8" fill="#442c1c" />
                    
                    <!-- Palanca de cambios (Gear Shifter) -->
                    <line x1="10.8" y1="12" x2="11.5" y2="9.8" stroke="#8a90a0" stroke-width="0.45" stroke-linecap="round" />
                    <circle cx="11.5" cy="9.6" r="0.55" fill="#181a20" />
                    
                    <!-- Brazo izquierdo: mano baja agarrando el volante nativo del auto en X ~15 -->
                    <polygon points="4.8,7.6 10.5,8.5 15.0,8.8 14.5,9.6 5.4,9.6" fill="#d2d5e0" />
                    <polygon points="14.4,8.5 15.6,8.5 15.6,9.5 14.4,9.5" fill="#e0b294" />
                    
                    <!-- Brazo derecho animado: mano baja que va de arriba a abajo en la caja de cambios -->
                    <g class="takumi-arm-shift">
                        <polygon points="4.0,7.2 6.0,7.2 7.6,10.2 5.6,11.0" fill="#f5f5fa" />
                        <polygon points="5.8,10.8 7.2,10.0 7.6,10.4 6.0,11.2" fill="#d0d4de" />
                        <polygon points="6.0,10.4 7.6,9.8 11.8,9.4 11.2,10.5" fill="#f5f5fa" />
                        <line x1="6.0" y1="10.4" x2="7.4" y2="9.8" stroke="#bcc2ce" stroke-width="0.35" />
                        <!-- Mano en la palanca de cambios -->
                        <polygon points="11.0,9.2 12.4,9.0 12.6,10.0 11.2,10.0" fill="#f0cbaf" />
                        <line x1="11.8" y1="9.1" x2="11.8" y2="9.9" stroke="#c89b7c" stroke-width="0.3" />
                    </g>
                </svg>
            </div>
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
            <div class="impreza-body">
                <div class="impreza-driver-bunta">
                    <svg viewBox="0 0 19 12" class="bunta-svg">
                        <!-- Asiento oscuro -->
                        <path d="M1,2 Q1.8,1 2.8,1 L3.2,4.5 L1.8,12 L0.5,12 Z" fill="#14161a" />
                        <rect x="1.5" y="0.8" width="1.6" height="2.2" rx="0.5" fill="#0e1014" />
                        <!-- Torso (chaqueta azul marino, postura reclinada relajada) -->
                        <polygon points="2.4,6.8 6.5,6.8 8.6,12 1.6,12" fill="#222836" />
                        <rect x="5.2" y="6.5" width="1.8" height="0.8" fill="#161a24" />
                        <!-- Cuello -->
                        <rect x="5.0" y="5.2" width="1.8" height="1.5" fill="#eec5a8" />
                        <!-- Cabeza y mandíbula -->
                        <polygon points="4.6,3.4 8.4,3.4 9.0,5.0 8.2,6.5 5.5,6.7 4.6,5.4" fill="#eec5a8" />
                        <polygon points="8.4,4.8 9.4,5.2 8.4,5.6" fill="#eec5a8" />
                        <line x1="6.2" y1="6.3" x2="8.0" y2="6.2" stroke="#c4997e" stroke-width="0.35" />
                        <!-- Ojos cerrados legendarios squint (- _ -) -->
                        <line x1="6.5" y1="4.6" x2="8.5" y2="4.6" stroke="#15161a" stroke-width="0.55" stroke-linecap="round" />
                        <line x1="6.3" y1="4.1" x2="8.5" y2="4.1" stroke="#282a34" stroke-width="0.35" stroke-linecap="round" />
                        <line x1="7.2" y1="5.8" x2="8.5" y2="5.8" stroke="#a06550" stroke-width="0.4" stroke-linecap="round" />
                        <!-- Pelo negro Bunta -->
                        <polygon points="2.4,2.8 8.2,2.8 7.8,4.8 2.2,4.8" fill="#1f2128" />
                        <polygon points="4.8,2.8 6.0,1.2 7.0,2.8" fill="#353844" />
                        <polygon points="6.5,2.8 7.8,1.0 8.8,2.8" fill="#262832" />
                        <polygon points="8.2,2.8 9.8,1.8 9.4,4.2" fill="#1f2128" />
                        <polygon points="8.6,4.0 10.2,4.4 9.0,5.0" fill="#1f2128" />
                        
                        <!-- Palanca de cambios GC8 (el volante es el nativo del modelo del auto) -->
                        <line x1="11.0" y1="12" x2="11.6" y2="9.8" stroke="#757c8c" stroke-width="0.45" stroke-linecap="round" />
                        <circle cx="11.6" cy="9.6" r="0.55" fill="#15171e" />
                        
                        <!-- Brazo relajado Bunta animado: mano baja que acaricia la palanca y consola -->
                        <g class="bunta-arm-shift">
                            <polygon points="3.6,7.0 5.6,7.0 7.0,10.2 4.8,11.0" fill="#262d3e" />
                            <polygon points="5.2,10.6 6.8,9.8 12.0,8.8 11.4,10.4 5.8,11.2" fill="#2a3246" />
                            <line x1="10.8" y1="9.0" x2="10.4" y2="10.2" stroke="#1a202c" stroke-width="0.35" />
                            <!-- Mano reposando baja en la consola/palanca -->
                            <polygon points="11.2,8.8 12.8,8.6 13.0,9.8 11.5,9.8" fill="#eec5a8" />
                            <line x1="12.2" y1="8.7" x2="12.2" y2="9.5" stroke="#c29476" stroke-width="0.3" />
                        </g>
                        <!-- Cigarrillo entre los labios de Bunta -->
                        <line x1="8.2" y1="5.6" x2="12.2" y2="5.8" stroke="#f8f9fc" stroke-width="0.5" stroke-linecap="round" />
                        <rect x="12.2" y="5.4" width="0.9" height="0.8" rx="0.2" fill="#ff4800" />
                        <rect x="12.5" y="5.6" width="0.5" height="0.5" rx="0.1" fill="#fff275" />
                    </svg>
                </div>
                <img class="impreza-img" src="\${BUNTA_IMPREZA}" alt="Subaru Impreza WRX STI Type R (Bunta)" draggable="false" />
                <div class="bunta-smoke-container">
                    <div class="bunta-smoke-puff p1"></div>
                    <div class="bunta-smoke-puff p2"></div>
                    <div class="bunta-smoke-puff p3"></div>
                </div>
            </div>
            <div class="impreza-headlight-lamp"></div>
            <div class="impreza-headlight-glow"></div>
            <div class="impreza-taillight-lamp"></div>
            <div class="impreza-taillight-glow"></div>
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

                // Control de opacidad y efecto fantasma (Fade-in inverso y Fade-out dejando solo luces traseras)
                let bodyOpacity = 1.0;
                let lightsFade = 1.0;

                // 1. Entrada fantasmal: surge como una sombra espectral con faros penetrantes
                if (buntaX < clampedCarX - 10) {
                    const entranceDist = (clampedCarX - 10) - buntaX;
                    // Desde lejos (opacity ~0.12) hasta sólido (opacity 1.0) al emparejarse
                    bodyOpacity = Math.max(0.12, Math.min(1.0, 1.0 - (entranceDist / 200)));
                }
                // 2. Desaparición en la noche: al rebasar, la carrocería se desvanece
                // dejando solo las luces traseras rojas brillando a la distancia
                else if (buntaX > clampedCarX + 70) {
                    const exitDist = buntaX - (clampedCarX + 70);
                    const exitRange = Math.max(80, (w + 40) - (clampedCarX + 70));
                    bodyOpacity = Math.max(0.0, 1.0 - (exitDist / (exitRange * 0.55)));
                    if (buntaX > w + 20) {
                        lightsFade = Math.max(0, 1.0 - (buntaX - (w + 20)) / 70);
                    }
                }

                if (impreza) {
                    impreza.style.left = (buntaX - 27) + "px";
                    impreza.style.top = (carY - 10 + buntaYOffset) + "px";
                    impreza.style.display = "block";

                    const bodyEl = impreza.querySelector(".impreza-body");
                    if (bodyEl) {
                        bodyEl.style.opacity = bodyOpacity.toFixed(2);
                        bodyEl.style.filter = bodyOpacity < 0.85
                            ? "drop-shadow(0 0 6px rgba(70, 160, 255, 0.5)) blur(" + ((1 - bodyOpacity) * 1.2).toFixed(1) + "px)"
                            : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7))";
                    }

                    // Luces traseras estacionarias y faros delanteros
                    const taillightGlow = impreza.querySelector(".impreza-taillight-glow");
                    const taillightLamp = impreza.querySelector(".impreza-taillight-lamp");
                    if (taillightGlow) taillightGlow.style.opacity = (lightsFade * 0.95).toFixed(2);
                    if (taillightLamp) taillightLamp.style.opacity = lightsFade.toFixed(2);

                    const headlightGlow = impreza.querySelector(".impreza-headlight-glow");
                    const headlightLamp = impreza.querySelector(".impreza-headlight-lamp");
                    const frontHeadlightOpacity = (buntaX > clampedCarX + 120 ? Math.max(0, bodyOpacity * 1.2) : 1.0) * lightsFade;
                    if (headlightGlow) headlightGlow.style.opacity = frontHeadlightOpacity.toFixed(2);
                    if (headlightLamp) headlightLamp.style.opacity = frontHeadlightOpacity.toFixed(2);
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
