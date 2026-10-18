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
    const SVG_CURVE_ID = "ae86-initial-d-curve";

    const AE86_IDLE = "data:image/png;base64,${idleBase64}";
    const AE86_DRIVE = "data:image/png;base64,${driveBase64}";
    const AE86_DRIFT = "data:image/png;base64,${driftBase64}";

    // ─── Estilos CSS ──────────────────────────────────────────────────────────
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = \`
            .player-controls, .main-nowPlayingBar-center,
            .main-nowPlayingBar-container, .Root__now-playing-bar, footer {
                overflow: visible !important;
            }

            .playback-progressbar,
            [data-testid="playback-progressbar"],
            .playback-bar,
            .playback-progressbar [data-testid="progress-bar"],
            [data-testid="playback-progressbar"] [data-testid="progress-bar"],
            .playback-bar [data-testid="progress-bar"],
            .playback-progressbar .progress-bar,
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
                width: 66px;
                height: 26px;
                pointer-events: none;
                z-index: 100000 !important;
                transform-origin: 50% 90%;
                will-change: transform, left, top;
                filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.6));
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
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
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
                bottom: 3px;
                right: -16px;
                width: 26px;
                height: 14px;
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
                right: -10px;
            }
            #\${CAR_ID}.drifting .ae86-headlight-glow {
                opacity: 0.35;
                right: -12px;
            }

            /* Intermitentes en pausa (píxeles planos sin sombras) */
            .ae86-hazard {
                position: absolute;
                background: #ffaa00;
                box-shadow: none !important;
                border-radius: 0px !important;
                pointer-events: none;
                opacity: 0;
                z-index: 5;
            }
            #\${CAR_ID}.paused:not(.drifting) .ae86-hazard {
                animation: ae86-hazard-blink 0.5s step-end infinite;
            }
            @keyframes ae86-hazard-blink {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0; }
            }

            /* Luces delanteras intermitentes del morro 3/4 */
            .ae86-hazard-front-right {
                width: 3px; height: 2px;
                bottom: 6px; right: 2px;
            }
            .ae86-hazard-front-left {
                width: 3px; height: 2px;
                bottom: 6px; left: 47px;
            }
            .ae86-hazard-rear {
                width: 3px; height: 3px;
                bottom: 8px; left: 2px;
                background: #ff7700;
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

            /* Humo de escape sutil en crucero normal */
            .ae86-exhaust-puff {
                opacity: 0.9;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(220, 220, 225, 0.7) 45%, rgba(180, 180, 190, 0.25) 75%, rgba(150, 150, 150, 0) 100%) !important;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25)) !important;
                animation: ae86-exhaust-fade 0.5s ease-out forwards !important;
            }
            @keyframes ae86-exhaust-fade {
                0%   { opacity: 0.9; transform: translate(0, 0) scale(0.65); }
                40%  { opacity: 0.75; }
                100% { opacity: 0;   transform: translate(-22px, -6px) scale(1.9); }
            }

            /* ─── Calzada de Tokio SOLO en la barra de reproducción (Seekbar) ─── */
            .playback-progressbar,
            [data-testid="playback-progressbar"],
            .playback-bar {
                padding-top: 6px !important;
                padding-bottom: 6px !important;
            }

            .playback-progressbar .progress-bar,
            [data-testid="playback-progressbar"] .progress-bar,
            .playback-bar .progress-bar,
            .playback-progressbar [data-testid="progress-bar"],
            [data-testid="playback-progressbar"] [data-testid="progress-bar"],
            .playback-bar [data-testid="progress-bar"] {
                height: 16px !important;
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                overflow: visible !important;
            }

            /* Calzada de asfalto japonés de Tokio con arcenes de franjas diagonales blancas (Shutoko / C1) */
            .playback-progressbar .x-progressBar-background,
            [data-testid="playback-progressbar"] .x-progressBar-background,
            .playback-bar .x-progressBar-background,
            .playback-progressbar [data-testid="progress-bar"] > div:first-child,
            [data-testid="playback-progressbar"] [data-testid="progress-bar"] > div:first-child,
            .playback-bar [data-testid="progress-bar"] > div:first-child {
                background-color: #202228 !important;
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
                    100% 3.5px,
                    100% 1.5px,
                    100% 1.5px,
                    100% 3.5px !important;
                background-position: 
                    left top 0px,
                    left top 3.5px,
                    left bottom 3.5px,
                    left bottom 0px !important;
                background-repeat: repeat-x !important;
                height: 16px !important;
                border-radius: 2px !important;
                border-top: 1.5px solid #ffffff !important;
                border-bottom: 1.5px solid #ffffff !important;
                box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.7) !important;
                overflow: hidden !important;
                transition: none !important;
            }

            .playback-progressbar:hover .x-progressBar-background,
            .playback-progressbar:active .x-progressBar-background,
            [data-testid="playback-progressbar"]:hover .x-progressBar-background,
            [data-testid="playback-progressbar"]:active .x-progressBar-background,
            .playback-bar:hover .x-progressBar-background,
            .playback-bar:active .x-progressBar-background,
            .playback-progressbar [class*="is-dragging"] .x-progressBar-background,
            [data-testid="playback-progressbar"] [class*="is-dragging"] .x-progressBar-background {
                height: 16px !important;
                background-color: #202228 !important;
            }

            /* Progreso iluminado SOLO en la barra de reproducción */
            .playback-progressbar .x-progressBar-fillColor,
            [data-testid="playback-progressbar"] .x-progressBar-fillColor,
            .playback-bar .x-progressBar-fillColor {
                background: linear-gradient(90deg, rgba(29, 185, 84, 0.25) 0%, rgba(29, 185, 84, 0.55) 100%) !important;
                height: 100% !important;
                border-radius: 0px !important;
                border-right: 2px solid #2ecc71 !important;
                box-shadow: 0 0 10px rgba(46, 204, 113, 0.6) !important;
            }

            /* Ocultar el cursor/thumb circular de Spotify SOLO en la barra de reproducción */
            .playback-progressbar .progress-bar__slider,
            .playback-progressbar:hover .progress-bar__slider,
            [data-testid="playback-progressbar"] .progress-bar__slider,
            [data-testid="playback-progressbar"]:hover .progress-bar__slider,
            .playback-bar .progress-bar__slider,
            .playback-bar:hover .progress-bar__slider,
            .playback-progressbar [class*="is-dragging"] .progress-bar__slider {
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                pointer-events: none !important;
                display: none !important;
            }

            /* Ocultar lineas planas nativas durante la curva */
            .ae86-hide-native .progress-bar__slider,
            .ae86-hide-native .x-progressBar-fillColor,
            .ae86-hide-native .x-progressBar-background,
            .ae86-hide-native [data-testid="progress-bar"] > div:not(#\${CAR_ID}):not(#\${SVG_CURVE_ID}) {
                opacity: 0 !important;
            }

            .player-controls__buttons {
                will-change: transform;
                z-index: 1 !important;
            }

            /* ─── Proteccion estricta del slider de volumen de Spotify ─── */
            .volume-bar,
            [data-testid="volume-bar"],
            .main-nowPlayingBar-right .volume-bar,
            .volume-bar [data-testid="progress-bar"],
            .volume-bar .progress-bar,
            .main-nowPlayingBar-right [data-testid="progress-bar"],
            .main-nowPlayingBar-right .progress-bar {
                height: auto !important;
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
            }
            .volume-bar .x-progressBar-background,
            .main-nowPlayingBar-right .volume-bar .x-progressBar-background {
                height: 4px !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
                border-radius: 2px !important;
            }
            .volume-bar .x-progressBar-fillColor,
            .main-nowPlayingBar-right .volume-bar .x-progressBar-fillColor {
                border-right: none !important;
                box-shadow: none !important;
                border-radius: 2px !important;
            }
            .volume-bar .progress-bar__slider,
            .main-nowPlayingBar-right .volume-bar .progress-bar__slider {
                display: block !important;
                pointer-events: auto !important;
            }
        \`;
        document.head.appendChild(style);
    }

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
            <div class="ae86-hazard ae86-hazard-rear"></div>
        \`;
        return wrapper;
    }

    function getPlaybackTarget() {
        return document.querySelector('.playback-progressbar [data-testid="progress-bar"]') ||
               document.querySelector('[data-testid="playback-progressbar"] [data-testid="progress-bar"]') ||
               document.querySelector('.playback-bar [data-testid="progress-bar"]') ||
               document.querySelector('.playback-progressbar .progress-bar') ||
               document.querySelector('.playback-progressbar') ||
               document.querySelector('[data-testid="playback-progressbar"]') ||
               document.querySelector('.playback-bar');
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
            <path id="ae86-curve-asphalt"       stroke="#202228" stroke-width="16" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-fill"          stroke="#1db954" stroke-width="16" stroke-linecap="butt" fill="none" opacity="0.45"/>
            <path id="ae86-curve-stripes"       stroke="#ffffff" stroke-width="1.8" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-top"    stroke="#ffffff" stroke-width="1.5" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-top"     stroke="#ffffff" stroke-width="1.5" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-bottom"  stroke="#ffffff" stroke-width="1.5" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-bottom" stroke="#ffffff" stroke-width="1.5" stroke-linecap="butt" fill="none"/>
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

        const CAR_WIDTH = 66;

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
            if (now - lastCruisingSmokeTime < 90) return;
            lastCruisingSmokeTime = now;

            const smoke = document.createElement("div");
            smoke.className = "ae86-smoke-puff ae86-exhaust-puff";
            const size = 8 + Math.random() * 5;
            smoke.style.width = size + "px";
            smoke.style.height = size + "px";
            smoke.style.left = (x - size / 2) + "px";
            smoke.style.top = (y - size / 2) + "px";
            parentElem.appendChild(smoke);
            setTimeout(() => smoke.remove(), 500);
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
            if (svgCurve.parentElement !== currentRoad) {
                currentRoad.appendChild(svgCurve);
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
                                  document.querySelector('.playback-progressbar input[type="range"], [data-testid="playback-progressbar"] input[type="range"]');
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

            const isDriftingNow = isDragging || isPostDrifting;
            car.classList.toggle("drifting", isDriftingNow);

            const showCurve = isDragging || isPostDrifting || archHeight > 0.4;
            const containerElem = currentRoad.closest('.playback-progressbar, [data-testid="playback-progressbar"], .playback-bar') || currentRoad;
            containerElem.classList.toggle("ae86-hide-native", showCurve);
            svgCurve.style.display = showCurve ? "block" : "none";

            if (playerButtons) {
                const lift = showCurve ? archHeight * 0.5 : 0;
                playerButtons.style.transform = lift > 0.4 ? "translateY(-" + lift + "px)" : "none";
            }

            if (showCurve) {
                const controlY = baseline - (archHeight * 2);

                const pathCenterD = "M 0," + baseline.toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + controlY.toFixed(2) + " " + w.toFixed(2) + "," + baseline.toFixed(2);
                const pathTopBorderD = "M 0," + (baseline - 7.25).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 7.25).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 7.25).toFixed(2);
                const pathTopInnerD = "M 0," + (baseline - 4.25).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 4.25).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 4.25).toFixed(2);
                const pathBottomInnerD = "M 0," + (baseline + 4.25).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 4.25).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 4.25).toFixed(2);
                const pathBorderBottomD = "M 0," + (baseline + 7.25).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 7.25).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 7.25).toFixed(2);

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

                    const xTop1 = x + nx * 7.2 - 2;
                    const yTop1 = curY + ny * 7.2;
                    const xTop2 = x + nx * 4.3 + 2;
                    const yTop2 = curY + ny * 4.3;
                    stripesD += "M " + xTop1.toFixed(1) + "," + yTop1.toFixed(1) + " L " + xTop2.toFixed(1) + "," + yTop2.toFixed(1) + " ";

                    const xBot1 = x - nx * 4.3 - 2;
                    const yBot1 = curY - ny * 4.3;
                    const xBot2 = x - nx * 7.2 + 2;
                    const yBot2 = curY - ny * 7.2;
                    stripesD += "M " + xBot1.toFixed(1) + "," + yBot1.toFixed(1) + " L " + xBot2.toFixed(1) + "," + yBot2.toFixed(1) + " ";
                }
                if (pathStripes) pathStripes.setAttribute("d", stripesD);
            }

            const t = Math.max(0, Math.min(progress, 1));
            const carX = t * w;
            const carY = baseline - 4 * t * (1 - t) * archHeight;

            const halfW = CAR_WIDTH / 2;
            const clampedCarX = Math.max(halfW, Math.min(carX, w - halfW));

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
            car.style.top = (carY - 24 + bounce) + "px";
            car.style.transform = "rotate(" + (totalAngle + dynamicRoll).toFixed(2) + "deg)";

            if (isDriftingNow) {
                const smokeScale = (1.1 + Math.min(Math.abs(velocity), 3) * 0.3) * Math.max(0.6, driftDecay);
                emitSmoke(clampedCarX - halfW + 10, carY + 8, smokeScale, currentRoad);
            } else if (isPlaying) {
                emitCruisingSmoke(clampedCarX - halfW + 2, carY + 6, currentRoad);
            }

            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);

        function isProgressBarElement(elem) {
            if (!elem) return false;
            if (elem.closest?.('.volume-bar, [data-testid="volume-bar"], .main-nowPlayingBar-right')) return false;
            return !!(
                elem.closest?.('.playback-progressbar, .playback-bar, [data-testid="playback-progressbar"], [data-testid="progress-bar"]')
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
            isDragging = false;
            dragProgress = null;
            velocity = 0;
            driftEndTime = performance.now() + 1500;

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

const extPath = path.join(process.env.APPDATA, 'spicetify', 'Extensions', 'drift86.js');
try {
    fs.copyFileSync(path.join(__dirname, 'drift86.js'), extPath);
    console.log('Copied directly to Spicetify Extensions:', extPath);
} catch (e) {
    console.log('Could not copy to Spicetify Extensions:', e.message);
}
