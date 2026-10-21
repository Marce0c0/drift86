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
                z-index: 2;
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

            /* Haz de luz de largo alcance sobre la calzada (Zona 2: iluminado lo que apunta el AE86 con sus faros) */
            .ae86-headlight-beam {
                position: absolute;
                top: 50%;
                left: 42px;
                transform: translateY(-50%);
                width: 125px;
                height: 22px;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 230, 0.94) 0%,
                    rgba(255, 246, 185, 0.78) 22%,
                    rgba(255, 232, 140, 0.48) 52%,
                    rgba(255, 215, 110, 0.18) 78%,
                    transparent 100%
                );
                clip-path: polygon(0% 25%, 100% 0%, 100% 100%, 0% 75%);
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: 3;
                filter: blur(1.5px) drop-shadow(0 0 6px rgba(255, 240, 160, 0.65));
                transition: opacity 0.25s ease;
            }
            #\${CAR_ID}.paused .ae86-headlight-beam {
                opacity: 0.20;
            }
            #\${CAR_ID}.drifting .ae86-headlight-beam {
                opacity: 0.95;
            }

            /* Luz trasera carmesí tenue que proyecta hacia la oscuridad de atrás */
            .ae86-taillight-glow {
                position: absolute;
                bottom: 3.5px;
                left: -10px;
                width: 16px;
                height: 9px;
                background: radial-gradient(
                    ellipse at right center,
                    rgba(255, 30, 30, 0.75) 0%,
                    rgba(255, 0, 0, 0.3) 45%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                z-index: 4;
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
                z-index: 2;
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

            #\${IMPREZA_ID} .impreza-headlight-beam {
                position: absolute;
                top: 50%;
                left: 48px;
                transform: translateY(-50%);
                width: 135px;
                height: 22px;
                background: linear-gradient(
                    90deg,
                    rgba(210, 240, 255, 0.92) 0%,
                    rgba(145, 215, 255, 0.65) 25%,
                    rgba(85, 175, 255, 0.35) 55%,
                    rgba(40, 130, 255, 0.12) 80%,
                    transparent 100%
                );
                clip-path: polygon(0% 25%, 100% 0%, 100% 100%, 0% 75%);
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: 3;
                filter: blur(1.5px) drop-shadow(0 0 7px rgba(120, 205, 255, 0.75));
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
                left: 20.6px;
                bottom: 11.2px;
                width: 10.5px;
                height: 6.6px;
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
                left: 22.0px;
                bottom: 12.0px;
                width: 11.2px;
                height: 7.0px;
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
                left: 28.0px;
                bottom: 15.6px;
                width: 22px;
                height: 12px;
                pointer-events: none;
                z-index: 3;
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
                        rgba(225, 230, 245, 0.58) 0px,
                        rgba(225, 230, 245, 0.58) 2px,
                        transparent 2px,
                        transparent 8px
                    ),
                    linear-gradient(rgba(235, 240, 250, 0.65), rgba(235, 240, 250, 0.65)),
                    linear-gradient(rgba(235, 240, 250, 0.65), rgba(235, 240, 250, 0.65)),
                    repeating-linear-gradient(
                        50deg,
                        rgba(225, 230, 245, 0.58) 0px,
                        rgba(225, 230, 245, 0.58) 2px,
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
                border-top: 1.2px solid rgba(235, 240, 250, 0.65) !important;
                border-bottom: 1.2px solid rgba(235, 240, 250, 0.65) !important;
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

            /* Carretera recorrida detrás del AE86: sumida y difuminada en la noche profunda */
            .playback-bar .x-progressBar-fillColor,
            [data-testid="playback-progressbar"] .x-progressBar-fillColor {
                background: linear-gradient(
                    90deg,
                    rgba(6, 7, 10, 0.90) 0%,
                    rgba(8, 10, 14, 0.85) 75%,
                    rgba(14, 12, 16, 0.75) 92%,
                    rgba(40, 14, 18, 0.45) 97%,
                    rgba(255, 30, 30, 0.20) 100%
                ) !important;
                height: 100% !important;
                border-radius: 0px !important;
                border-right: none !important;
                box-shadow: none !important;
                backdrop-filter: blur(0.5px) !important;
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
                <svg viewBox="0 0 19 12" class="takumi-svg" preserveAspectRatio="none">
                    <!-- Asiento TRD deportivo -->
                    <polygon points="1.0,2.2 2.6,1.2 3.2,4.5 1.8,12 0.6,12" fill="#181a20" />
                    <polygon points="1.5,0.8 2.8,0.8 3.0,2.4 1.6,2.4" fill="#101216" />

                    <!-- Torso de Takumi: polo blanco First Stage con sombras de pliegues -->
                    <polygon points="2.6,6.8 5.8,6.6 7.8,12 1.8,12" fill="#f8f8fc" />
                    <polygon points="2.6,6.8 3.8,6.7 2.8,12 1.8,12" fill="#d7dae4" />
                    <!-- Cuello y cuello del polo -->
                    <polygon points="4.8,5.0 6.4,5.0 6.2,6.8 4.6,6.8" fill="#f4d2b8" />
                    <polygon points="4.4,6.6 6.6,6.6 6.2,7.2 4.4,7.2" fill="#e1e4ec" />

                    <!-- Cabeza y mandíbula estilizada de Takumi (proporciones anime Initial D) -->
                    <polygon points="4.2,3.2 6.8,3.0 7.8,4.4 7.8,4.8 7.2,5.8 5.2,6.0 4.2,5.0" fill="#f4d2b8" />
                    <polygon points="7.4,4.2 8.0,4.4 7.4,4.7" fill="#f4d2b8" />
                    <polygon points="5.2,5.8 7.2,5.6 6.8,6.2 5.0,6.2" fill="#d7af96" />
                    <line x1="6.6" y1="5.3" x2="7.3" y2="5.3" stroke="#b47864" stroke-width="0.35" />
                    <!-- Ojo concentrado con ceja y reflejo blanco -->
                    <line x1="6.0" y1="3.8" x2="7.4" y2="3.9" stroke="#322014" stroke-width="0.55" stroke-linecap="round" />
                    <polygon points="6.4,4.2 7.4,4.1 7.2,4.7 6.5,4.7" fill="#141418" />
                    <circle cx="7.1" cy="4.3" r="0.2" fill="#ffffff" />

                    <!-- Cabello castaño desordenado de Takumi con flequillo en capas -->
                    <polygon points="2.8,2.6 6.8,2.4 6.6,4.0 2.6,4.0" fill="#442a18" />
                    <polygon points="2.6,3.6 3.8,3.6 3.6,5.4 2.8,5.4" fill="#382214" />
                    <polygon points="3.2,2.4 4.4,1.2 6.0,1.0 7.2,1.8 7.6,2.6 4.0,2.6" fill="#4e301c" />
                    <polygon points="5.0,2.4 6.2,3.8 5.8,4.2 4.6,2.8" fill="#442a18" />
                    <polygon points="6.0,2.4 7.4,3.6 7.0,4.0 5.6,2.8" fill="#442a18" />
                    <polygon points="6.8,2.6 7.8,3.8 7.4,4.2 6.4,3.0" fill="#382214" />
                    <line x1="4.2" y1="1.6" x2="6.4" y2="1.5" stroke="#734b2d" stroke-width="0.35" stroke-linecap="round" />

                    <!-- TABLERO AE86: ubicado a distancia natural -->
                    <polygon points="11.4,9.6 13.2,7.8 19.0,6.8 19.0,12 11.0,12" fill="#16181e" />
                    <line x1="13.2" y1="7.8" x2="19.0" y2="6.8" stroke="#343844" stroke-width="0.35" />
                    <line x1="11.4" y1="9.6" x2="13.2" y2="7.8" stroke="#282c36" stroke-width="0.35" />

                    <!-- Cuadro de instrumentos (binnacle) con visera -->
                    <polygon points="12.2,7.0 14.8,6.8 15.0,8.2 12.0,8.4" fill="#0e1014" />
                    <line x1="12.2" y1="7.0" x2="14.8" y2="6.8" stroke="#464c5c" stroke-width="0.25" />
                    <!-- Agujas: tacómetro naranja TRD y velocímetro verde -->
                    <circle cx="12.8" cy="7.6" r="0.35" fill="#06080a" />
                    <circle cx="12.8" cy="7.6" r="0.15" fill="#ff9b1e" />
                    <circle cx="13.8" cy="7.6" r="0.35" fill="#06080a" />
                    <circle cx="13.8" cy="7.6" r="0.15" fill="#78e696" />

                    <!-- Consola central y palanca de cambios -->
                    <polygon points="8.4,10.6 11.4,10.6 11.4,12 8.0,12" fill="#1a1c24" />
                    <line x1="9.6" y1="12" x2="10.2" y2="10.0" stroke="#969ba8" stroke-width="0.4" stroke-linecap="round" />
                    <circle cx="10.2" cy="9.9" r="0.45" fill="#14161c" />

                    <!-- Columna de dirección y Volante deportivo Momo/Italvolanti -->
                    <line x1="12.6" y1="8.6" x2="11.2" y2="9.4" stroke="#20232d" stroke-width="0.7" stroke-linecap="round" />
                    <line x1="11.4" y1="6.2" x2="10.4" y2="10.5" stroke="#121418" stroke-width="1.1" stroke-linecap="round" />
                    <line x1="11.5" y1="6.3" x2="10.5" y2="10.4" stroke="#414654" stroke-width="0.28" />
                    <circle cx="10.9" cy="8.3" r="0.45" fill="#0c0e12" />
                    <circle cx="10.9" cy="8.3" r="0.16" fill="#f0be28" />

                    <!-- Brazo izquierdo: mano lejana en parte superior del volante -->
                    <polygon points="4.6,7.2 7.4,7.2 11.0,6.3 10.8,5.7 5.0,6.6" fill="#dcdee6" />
                    <polygon points="10.6,5.7 11.6,5.9 11.6,6.7 10.6,6.5" fill="#f4d2b8" />

                    <!-- Brazo derecho animado: codo doblado natural con mano en volante que pasa a la palanca -->
                    <g class="takumi-arm-shift">
                        <polygon points="3.8,7.2 5.8,7.2 7.2,9.6 5.4,10.2" fill="#f8f8fc" />
                        <polygon points="5.8,9.6 7.4,9.0 11.0,8.2 10.6,9.2" fill="#f8f8fc" />
                        <line x1="5.8" y1="9.6" x2="7.2" y2="9.0" stroke="#d2d6e0" stroke-width="0.35" />
                        <polygon points="10.4,7.9 11.6,7.7 11.8,8.7 10.6,8.7" fill="#f4d2b8" />
                        <line x1="11.2" y1="7.8" x2="11.2" y2="8.6" stroke="#c8a082" stroke-width="0.3" />
                    </g>
                </svg>
            </div>
            <img class="ae86-img ae86-idle" src="\${AE86_IDLE}" alt="AE86 Pausa (3/4 frontal)" draggable="false" />
            <img class="ae86-img ae86-drive" src="\${AE86_DRIVE}" alt="AE86 Corriendo (Lateral)" draggable="false" />
            <img class="ae86-img ae86-drift" src="\${AE86_DRIFT}" alt="AE86 Derrape" draggable="false" />
            <div class="ae86-headlight-glow"></div>
            <div class="ae86-headlight-beam"></div>
            <div class="ae86-taillight-glow"></div>
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
                    <svg viewBox="0 0 19 12" class="bunta-svg" preserveAspectRatio="none">
                        <!-- Asiento oscuro -->
                        <polygon points="1.0,2.2 2.6,1.2 3.2,4.5 1.8,12 0.6,12" fill="#12141a" />
                        <polygon points="1.5,0.8 2.8,0.8 3.0,2.4 1.6,2.4" fill="#0c0e12" />

                        <!-- Torso de Bunta: camisa azul marino informal sobre camiseta blanca -->
                        <polygon points="2.4,6.8 5.8,6.8 7.8,12 1.6,12" fill="#202636" />
                        <polygon points="4.4,6.4 5.6,6.4 5.4,7.2 4.2,7.2" fill="#dce0ea" />
                        <!-- Cuello -->
                        <polygon points="4.6,5.0 6.4,5.0 6.2,6.8 4.4,6.8" fill="#eec3a8" />

                        <!-- Cabeza y mandíbula madura de Bunta (pose legendaria relajada) -->
                        <polygon points="4.2,3.2 6.8,3.0 7.8,4.4 7.8,4.8 7.2,5.8 5.0,6.0 4.2,5.0" fill="#eec3a8" />
                        <polygon points="7.4,4.2 8.0,4.4 7.4,4.7" fill="#eec3a8" />
                        <polygon points="5.0,5.8 7.2,5.6 6.8,6.2 4.8,6.2" fill="#cda087" />
                        <line x1="6.6" y1="5.3" x2="7.3" y2="5.2" stroke="#a06450" stroke-width="0.35" />

                        <!-- Ojos entrecerrados legendarios de Bunta (- _ -) -->
                        <line x1="6.0" y1="3.8" x2="7.4" y2="3.8" stroke="#1e2028" stroke-width="0.55" stroke-linecap="round" />
                        <line x1="6.2" y1="4.4" x2="7.6" y2="4.3" stroke="#101216" stroke-width="0.55" stroke-linecap="round" />
                        <line x1="6.4" y1="4.8" x2="7.4" y2="4.8" stroke="#c3967d" stroke-width="0.3" />

                        <!-- Cabello negro alborotado y puntiagudo de Bunta -->
                        <polygon points="2.8,2.6 6.8,2.4 6.6,4.0 2.6,4.0" fill="#181a20" />
                        <polygon points="2.6,3.6 3.8,3.6 3.6,5.4 2.8,5.4" fill="#12141a" />
                        <polygon points="3.4,2.4 4.2,0.8 5.2,2.4" fill="#242834" />
                        <polygon points="4.8,2.4 6.0,0.6 6.8,2.4" fill="#1c1e26" />
                        <polygon points="6.4,2.4 7.6,1.4 7.4,3.0" fill="#181a20" />

                        <!-- Cigarrillo fino y discreto en los labios de Bunta -->
                        <line x1="7.2" y1="5.2" x2="9.8" y2="5.4" stroke="#f8f8fc" stroke-width="0.45" stroke-linecap="round" />
                        <rect x="9.8" y="5.1" width="0.6" height="0.6" rx="0.15" fill="#ff4b00" />
                        <rect x="10.0" y="5.3" width="0.3" height="0.3" rx="0.1" fill="#fff046" />

                        <!-- TABLERO IMPREZA GC8: envolvente y deportivo -->
                        <polygon points="11.4,9.6 13.2,7.8 19.0,6.7 19.0,12 11.0,12" fill="#12141a" />
                        <line x1="13.2" y1="7.8" x2="19.0" y2="6.7" stroke="#2e323e" stroke-width="0.35" />
                        <line x1="11.4" y1="9.6" x2="13.2" y2="7.8" stroke="#242832" stroke-width="0.35" />

                        <!-- Cuadro STI con aguja roja y dial ámbar -->
                        <polygon points="12.2,7.0 14.8,6.8 15.0,8.2 12.0,8.4" fill="#0c0e12" />
                        <line x1="12.2" y1="7.0" x2="14.8" y2="6.8" stroke="#3c4452" stroke-width="0.25" />
                        <circle cx="12.8" cy="7.6" r="0.35" fill="#06080a" />
                        <circle cx="12.8" cy="7.6" r="0.15" fill="#ff3c1e" />
                        <circle cx="13.8" cy="7.6" r="0.35" fill="#06080a" />
                        <circle cx="13.8" cy="7.6" r="0.15" fill="#ffb432" />

                        <!-- Consola central y palanca STI -->
                        <polygon points="8.4,10.6 11.4,10.6 11.4,12 8.0,12" fill="#181a22" />
                        <line x1="9.6" y1="12" x2="10.2" y2="10.0" stroke="#8c91a0" stroke-width="0.4" stroke-linecap="round" />
                        <circle cx="10.2" cy="9.9" r="0.45" fill="#12141a" />

                        <!-- Columna de dirección y Volante STI Momo -->
                        <line x1="12.6" y1="8.6" x2="11.2" y2="9.4" stroke="#1c1e28" stroke-width="0.7" stroke-linecap="round" />
                        <line x1="11.4" y1="6.2" x2="10.4" y2="10.5" stroke="#0e1014" stroke-width="1.1" stroke-linecap="round" />
                        <line x1="11.5" y1="6.3" x2="10.5" y2="10.4" stroke="#373c48" stroke-width="0.28" />
                        <circle cx="10.9" cy="8.3" r="0.45" fill="#0a0c10" />
                        <circle cx="10.9" cy="8.3" r="0.16" fill="#e02828" />

                        <!-- Brazo relajado de Bunta con codo flexionado y agarre tranquilo en el volante -->
                        <g class="bunta-arm-shift">
                            <polygon points="3.6,7.0 5.6,7.0 7.0,9.6 5.0,10.2" fill="#232a38" />
                            <polygon points="5.6,9.6 7.2,9.0 11.0,8.2 10.6,9.2" fill="#262d3c" />
                            <polygon points="10.4,7.9 11.6,7.7 11.8,8.7 10.6,8.7" fill="#eec3a8" />
                            <line x1="11.2" y1="7.8" x2="11.2" y2="8.6" stroke="#c89b7d" stroke-width="0.3" />
                        </g>
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
            <div class="impreza-headlight-beam"></div>
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
            <path id="ae86-curve-stripes"       stroke="rgba(225, 230, 245, 0.58)" stroke-width="1.6" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-top"    stroke="rgba(235, 240, 250, 0.65)" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-top"     stroke="rgba(225, 230, 245, 0.50)" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-bottom"  stroke="rgba(225, 230, 245, 0.50)" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-bottom" stroke="rgba(235, 240, 250, 0.65)" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-fill"          stroke="#07090d" stroke-width="18.5" stroke-linecap="butt" fill="none" opacity="0.84"/>
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
        let buntaCancelling = false;
        let buntaCancelStartTime = 0;
        let buntaPassedWhilePaused = false;
        let buntaX = -80;
        let buntaYOffset = -6;
        let nextBuntaTime = performance.now() + 10 * 1000;
        let surpriseStartTime = 0;
        let lastLoopTime = performance.now();

        window.__triggerBuntaOvertake = function() {
            if (buntaActive || isDragging) return;
            buntaActive = true;
            buntaCancelling = false;
            buntaPassedWhilePaused = false;
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
                buntaCancelling = false;
                buntaPassedWhilePaused = false;
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
                // Si el usuario empieza a arrastrar el seekbar, Bunta se desvanece suavemente como un fantasma
                if (isDragging && !buntaCancelling) {
                    buntaCancelling = true;
                    buntaCancelStartTime = now;
                }

                // Si Bunta alcanza o rebasa al AE86 mientras está pausado, lo marcamos para que no dé latigazo al reanudar
                if (!isPlaying && buntaX >= clampedCarX - 25) {
                    buntaPassedWhilePaused = true;
                }

                const buntaSpeed = buntaCancelling ? 380 : 260; // px / seg (acelera ligeramente al disolverse)
                buntaX += buntaSpeed * dt;

                // Overtake path: por el carril superior (-6px) y al rebasar se alinea hacia adelante
                if (buntaX > clampedCarX + 55) {
                    buntaYOffset += (-1.0 - buntaYOffset) * 0.08;
                } else {
                    buntaYOffset += (-6.0 - buntaYOffset) * 0.12;
                }

                // Sobreviraje por sorpresa: Bunta se empareja mientras el auto ya está en marcha
                if (isPlaying && !buntaPassedWhilePaused && !buntaCancelling &&
                    buntaX >= clampedCarX - 15 && buntaX <= clampedCarX + 25 &&
                    surpriseStartTime === 0) {
                    surpriseStartTime = now;
                }

                // Control de opacidad y efecto fantasma (Fade-in inverso y Fade-out dejando solo luces traseras)
                let bodyOpacity = 1.0;
                let lightsFade = 1.0;

                if (buntaCancelling) {
                    // Desvanecimiento suave en ~350ms sin cortes bruscos
                    const cancelProgress = Math.min(1.0, (now - buntaCancelStartTime) / 350);
                    const cancelFactor = Math.max(0, 1.0 - cancelProgress);
                    bodyOpacity = cancelFactor * 0.85;
                    lightsFade = cancelFactor;
                    if (cancelProgress >= 1.0) {
                        buntaActive = false;
                        buntaCancelling = false;
                        buntaPassedWhilePaused = false;
                        if (impreza) impreza.style.display = "none";
                        nextBuntaTime = now + 10 * 1000;
                    }
                } else {
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
                }

                if (impreza && buntaActive) {
                    impreza.style.left = (buntaX - 27) + "px";
                    // Durante arrastre, Bunta se mantiene en el asfalto horizontal plano (baseline) en vez de trepar la curva del arco
                    const targetBaseY = (isDragging || buntaCancelling) ? baseline : carY;
                    impreza.style.top = (targetBaseY - 10 + buntaYOffset) + "px";
                    impreza.style.display = "block";

                    const bodyEl = impreza.querySelector(".impreza-body");
                    if (bodyEl) {
                        bodyEl.style.opacity = bodyOpacity.toFixed(2);
                        bodyEl.style.filter = bodyOpacity < 0.85
                            ? "drop-shadow(0 0 6px rgba(70, 160, 255, 0.5)) blur(" + ((1 - bodyOpacity) * 1.5).toFixed(1) + "px)"
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
                if (buntaActive) {
                    emitCruisingSmoke(buntaX - 27, (isDragging || buntaCancelling ? baseline : carY) + buntaYOffset + 4, currentRoad);
                }

                if (buntaX > w + 90) {
                    buntaActive = false;
                    buntaCancelling = false;
                    buntaPassedWhilePaused = false;
                    if (impreza) impreza.style.display = "none";
                    nextBuntaTime = now + 10 * 1000;
                }
            } else {
                if (impreza && impreza.style.display !== "none") {
                    impreza.style.display = "none";
                }
            }

            // Física de reacción del AE86: sobreviraje y oscilación de volante por la sorpresa (solo en marcha)
            const surpriseElapsed = (isPlaying && surpriseStartTime > 0) ? (now - surpriseStartTime) / 1000 : 999;
            const isSurprised = isPlaying && surpriseElapsed < 1.3;
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
            nextBuntaTime = Math.max(nextBuntaTime, performance.now() + 10 * 1000);

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
