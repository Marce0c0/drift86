const fs = require('fs');
const path = require('path');

const idleImgPath = path.join(__dirname, 'assets', 'ae86_lateral_drift.png');
const driveImgPath = path.join(__dirname, 'assets', 'ae86_cruising_body.png');
const driftImgPath = path.join(__dirname, 'assets', 'ae86_hard_drift.png');
const wheelRearImgPath = path.join(__dirname, 'assets', 'ae86_wheel_rear.png');
const wheelFrontImgPath = path.join(__dirname, 'assets', 'ae86_wheel_front.png');

const idleBase64 = fs.readFileSync(idleImgPath).toString('base64');
const driveBase64 = fs.readFileSync(driveImgPath).toString('base64');
const driftBase64 = fs.readFileSync(driftImgPath).toString('base64');
const wheelRearBase64 = fs.readFileSync(wheelRearImgPath).toString('base64');
const wheelFrontBase64 = fs.readFileSync(wheelFrontImgPath).toString('base64');

const imprezaImgPath = path.join(__dirname, 'assets', 'impreza_bunta_cruising.png');
const imprezaBase64 = fs.readFileSync(imprezaImgPath).toString('base64');

const jsContent = `// ==UserScript==
// @name         Drift86: Initial D Trueno Seekbar
// @description  Toyota AE86 Trueno drifting seekbar for Spicetify
// @author       Marce0c0
// @version      1.0.2
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
    const AE86_WHEEL_REAR = "data:image/png;base64,${wheelRearBase64}";
    const AE86_WHEEL_FRONT = "data:image/png;base64,${wheelFrontBase64}";
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
                z-index: 99990 !important;
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

            #\${CAR_ID}.paused:not(.drifting) img.ae86-idle {
                opacity: 1;
            }

            #\${CAR_ID}.driving:not(.drifting) img.ae86-drive {
                opacity: 1;
                bottom: 2.8px;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
            }
            @keyframes ae86-engine-rumble {
                0%   { transform: translateY(0px); }
                100% { transform: translateY(-0.4px); }
            }

            #\${CAR_ID}.drifting img.ae86-drift {
                opacity: 1;
            }

            .ae86-headlight-lamp {
                position: absolute;
                right: 1.2px;
                bottom: 11.2px;
                width: 2.2px;
                height: 1.8px;
                background: #fffef5;
                border-radius: 1px;
                border: none;
                box-shadow: 
                    0 0 1.5px #ffffff,
                    1px 0 4px rgba(255, 248, 215, 0.95),
                    2px 0 8px rgba(255, 225, 140, 0.45);
                pointer-events: none;
                z-index: 5;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
                transition: opacity 0.2s ease;
            }
            #\${CAR_ID}.paused .ae86-headlight-lamp {
                display: none;
            }
            #\${CAR_ID}.drifting .ae86-headlight-lamp {
                bottom: 10.4px;
                right: 1.2px;
            }

            .ae86-headlight-beam {
                position: absolute;
                right: -64px;
                bottom: -1px;
                width: 66px;
                height: 16px;
                background: radial-gradient(
                    ellipse 85% 65% at 0% 55%,
                    rgba(255, 252, 235, 0.55) 0%,
                    rgba(255, 248, 220, 0.30) 35%,
                    rgba(255, 242, 200, 0.10) 65%,
                    transparent 100%
                );
                border-radius: 0 50% 50% 0;
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: 3;
                filter: blur(1.5px);
                transition: opacity 0.25s ease;
            }
            #\${CAR_ID}.paused .ae86-headlight-beam {
                opacity: 0.10;
            }
            #\${CAR_ID}.drifting .ae86-headlight-beam {
                opacity: 0.40;
            }

            .ae86-taillight-lamp {
                position: absolute;
                left: 1.2px;
                bottom: 10.9px;
                width: 2.2px;
                height: 1.3px;
                background: #f02020;
                border-radius: 1px 0 0 1px;
                filter: drop-shadow(0 0 1.5px #ff1515) drop-shadow(0 0 3.2px rgba(255, 20, 20, 0.65));
                pointer-events: none;
                z-index: 5;
                display: none;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
            }
            #\${CAR_ID}.driving:not(.drifting) .ae86-taillight-lamp {
                display: block;
                opacity: 0.82;
            }
            #\${CAR_ID}.paused:not(.drifting) .ae86-taillight-lamp {
                display: block;
                left: 1.8px;
                bottom: 9.1px;
                width: 2.0px;
                height: 1.4px;
                opacity: 0.45;
                animation: none;
            }

            .ae86-taillight-glow {
                position: absolute;
                left: -5.5px;
                bottom: 8.0px;
                width: 11px;
                height: 6.5px;
                background: radial-gradient(
                    ellipse at right center,
                    rgba(255, 30, 30, 0.55) 0%,
                    rgba(255, 15, 15, 0.18) 45%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(0.9px);
                z-index: 4;
                display: none;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
            }
            #\${CAR_ID}.driving:not(.drifting) .ae86-taillight-glow {
                display: block;
                opacity: 0.52;
            }
            #\${CAR_ID}.paused:not(.drifting) .ae86-taillight-glow {
                display: block;
                left: -4.5px;
                bottom: 6.5px;
                opacity: 0.24;
                animation: none;
            }

            .ae86-wheel {
                position: absolute;
                width: 6.4px;
                height: 6.4px;
                pointer-events: none;
                z-index: 3;
                display: none;
                animation: ae86-engine-rumble 0.22s infinite ease-in-out alternate;
            }
            #\${CAR_ID}.driving:not(.drifting) .ae86-wheel {
                display: block;
            }
            .ae86-wheel-rear {
                left: 7.95px;
                bottom: 3.35px;
            }
            .ae86-wheel-front {
                left: 38.37px;
                bottom: 3.35px;
            }
            .ae86-wheel img {
                width: 100%;
                height: 100%;
                display: block;
                image-rendering: pixelated;
                animation: ae86-wheel-spin 0.25s linear infinite;
            }
            @keyframes ae86-wheel-spin {
                from { transform: rotate(0deg); }
                to   { transform: rotate(360deg); }
            }

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

            #\${IMPREZA_ID} .impreza-headlight-lamp {
                position: absolute;
                right: 2px;
                bottom: 10.5px;
                width: 3.2px;
                height: 2.2px;
                background: #fdfefe;
                border-radius: 1px;
                box-shadow: 0 0 3px rgba(240, 248, 255, 0.9), 0 0 5px rgba(200, 230, 255, 0.5);
                pointer-events: none;
                z-index: 5;
            }

            #\${IMPREZA_ID} .impreza-headlight-beam {
                position: absolute;
                right: -64px;
                bottom: 2.5px;
                width: 66px;
                height: 16px;
                background: radial-gradient(
                    ellipse 85% 65% at 0% 50%,
                    rgba(250, 252, 255, 0.55) 0%,
                    rgba(240, 248, 255, 0.30) 35%,
                    rgba(225, 240, 255, 0.10) 65%,
                    transparent 100%
                );
                border-radius: 0 50% 50% 0;
                pointer-events: none;
                mix-blend-mode: screen;
                z-index: 3;
                filter: blur(1.5px);
            }

            #\${IMPREZA_ID} .impreza-taillight-lamp {
                position: absolute;
                left: 1.56px;
                bottom: 12.14px;
                width: 2.72px;
                height: 1.10px;
                background: #b51818;
                clip-path: polygon(0% 0%, 80% 0%, 100% 100%, 36% 100%);
                filter: drop-shadow(0 0 1px rgba(255, 30, 30, 0.4));
                pointer-events: none;
                z-index: 5;
                transition: filter 0.2s ease, background 0.2s ease;
            }

            #\${IMPREZA_ID} .impreza-taillight-glow {
                position: absolute;
                left: -7px;
                bottom: 8.7px;
                width: 14px;
                height: 8px;
                background: radial-gradient(
                    ellipse at right center,
                    rgba(255, 30, 30, 0.85) 0%,
                    rgba(255, 10, 10, 0.3) 45%,
                    transparent 75%
                );
                border-radius: 50%;
                pointer-events: none;
                filter: blur(1px);
                z-index: 4;
            }

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

            .bunta-smoke-container {
                position: absolute;
                left: 27.8px;
                bottom: 15.8px;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 3;
            }
            .bunta-smoke-puff {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 2.4px;
                height: 2.4px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(225, 235, 250, 0.8) 50%, rgba(200, 215, 240, 0) 100%);
                border-radius: 50%;
                filter: blur(0.35px);
                pointer-events: none;
                animation: bunta-smoke-wisp 1.8s infinite ease-out;
            }
            .bunta-smoke-puff.p1 { animation-delay: 0s; }
            .bunta-smoke-puff.p2 { animation-delay: 0.36s; }
            .bunta-smoke-puff.p3 { animation-delay: 0.72s; }
            .bunta-smoke-puff.p4 { animation-delay: 1.08s; }
            .bunta-smoke-puff.p5 { animation-delay: 1.44s; }

            @keyframes bunta-smoke-wisp {
                0% {
                    transform: translate(0, 0) scale(0.6);
                    opacity: 0.95;
                }
                15% {
                    transform: translate(-3.0px, -0.6px) scale(0.9);
                    opacity: 0.9;
                }
                35% {
                    transform: translate(-8.5px, -1.8px) scale(1.4);
                    opacity: 0.75;
                }
                60% {
                    transform: translate(-16.0px, -3.2px) scale(2.0);
                    opacity: 0.55;
                }
                85% {
                    transform: translate(-23.5px, -4.5px) scale(2.7);
                    opacity: 0.3;
                }
                100% {
                    transform: translate(-30.0px, -5.5px) scale(3.3);
                    opacity: 0;
                }
            }

            .ae86-hazard {
                position: absolute;
                background: #ffd23f;
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
                    filter: 
                        drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95))
                        drop-shadow(0 0 3.5px rgba(255, 185, 0, 1))
                        drop-shadow(0 0 8px rgba(255, 140, 0, 0.9));
                }
                50% {
                    opacity: 0;
                    filter: none;
                }
            }

            .ae86-hazard-front-right {
                width: 2px; height: 1.5px;
                bottom: 6px; right: 1px;
            }
            .ae86-hazard-front-left {
                width: 2px; height: 1.5px;
                bottom: 6px; left: 36.5px;
            }
            .ae86-hazard-side-left {
                width: 2px; height: 1.5px;
                bottom: 7.5px; left: 33px;
            }
            .ae86-hazard-rear-left {
                width: 2.0px; height: 1.4px;
                bottom: 10.7px; left: 1.8px;
            }

            .ae86-smoke-puff {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(245, 245, 250, 0.72) 0%, rgba(225, 230, 240, 0.45) 40%, rgba(185, 190, 205, 0.15) 70%, transparent 100%);
                pointer-events: none;
                z-index: 99998 !important;
                animation: ae86-smoke-fade 0.50s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                will-change: transform, opacity;
            }
            @keyframes ae86-smoke-fade {
                0%   { opacity: 0.72; transform: translate(0, 0) scale(0.6); }
                30%  { opacity: 0.55; }
                100% { opacity: 0;    transform: translate(-22px, -10px) scale(2.0); }
            }

            .ae86-cruising-smoke {
                position: absolute;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(220, 225, 235, 0.40) 0%, rgba(185, 190, 205, 0.20) 50%, rgba(160, 165, 180, 0.05) 75%, transparent 100%) !important;
                filter: blur(0.6px);
                pointer-events: none;
                z-index: 99997 !important;
                animation: ae86-cruising-fade 0.50s ease-out forwards;
                will-change: transform, opacity;
            }
            @keyframes ae86-cruising-fade {
                0%   { opacity: 0.45; transform: translate(0, 0) scale(0.6); }
                40%  { opacity: 0.28; }
                100% { opacity: 0;    transform: translate(-12px, -3px) scale(1.3); }
            }

            .ae86-manga-shout {
                position: absolute;
                left: -8px;
                bottom: 18px;
                width: 68px;
                height: 42px;
                pointer-events: none;
                z-index: 100010 !important;
                animation: ae86-manga-shout-pop 1.35s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
                transform-origin: 18px 37px;
                will-change: transform, opacity;
            }
            .ae86-shout-svg {
                width: 100%;
                height: 100%;
                overflow: visible;
                display: block;
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.45));
            }
            @keyframes ae86-manga-shout-pop {
                0% {
                    transform: scale(0) rotate(-12deg);
                    opacity: 0;
                }
                14% {
                    transform: scale(1.22) rotate(4deg);
                    opacity: 1;
                }
                22% {
                    transform: scale(0.96) rotate(-2deg);
                    opacity: 1;
                }
                32% {
                    transform: scale(1.05) rotate(1deg);
                }
                42% {
                    transform: scale(1.0) rotate(0deg);
                }
                78% {
                    transform: scale(1.0) translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: scale(0.4) translate(14px, -18px) rotate(6deg);
                    opacity: 0;
                }
            }

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

            .playback-bar .progress-bar__slider,
            .playback-bar:hover .progress-bar__slider,
            [data-testid="playback-progressbar"] .progress-bar__slider,
            [data-testid="playback-progressbar"]:hover .progress-bar__slider,
            .playback-bar [class*="is-dragging"] .progress-bar__slider,
            [data-testid="playback-progressbar"] [class*="is-dragging"] .progress-bar__slider,
            .playback-bar .x-progressBar-fillColor,
            .playback-bar .x-progressBar-background,
            [data-testid="playback-progressbar"] .x-progressBar-fillColor,
            [data-testid="playback-progressbar"] .x-progressBar-background,
            .playback-bar .x-progressBar-progressBarBg > div:not(.x-progressBar-sliderArea),
            [data-testid="playback-progressbar"] .x-progressBar-progressBarBg > div:not(.x-progressBar-sliderArea),
            .playback-bar .x-progressBar-sliderArea > div:not(.section-marker-element),
            [data-testid="playback-progressbar"] .x-progressBar-sliderArea > div:not(.section-marker-element) {
                opacity: 0 !important;
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
                pointer-events: none !important;
                display: none !important;
            }

            .playback-bar .x-progressBar-progressBarBg,
            [data-testid="playback-progressbar"] .x-progressBar-progressBarBg {
                background: transparent !important;
                background-image: none !important;
                border: none !important;
                box-shadow: none !important;
                overflow: visible !important;
                height: 100% !important;
            }

            /* Compatibility with section-marker and external seekbar extensions */
            .playback-bar .x-progressBar-sliderArea,
            [data-testid="playback-progressbar"] .x-progressBar-sliderArea {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: transparent !important;
                overflow: visible !important;
                z-index: 99994 !important;
                pointer-events: none !important;
            }

            .playback-bar .section-marker-element,
            [data-testid="playback-progressbar"] .section-marker-element,
            .section-marker-element {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                z-index: 99994 !important;
                pointer-events: none !important;
                overflow: visible !important;
                opacity: 1 !important;
                display: block !important;
            }

            .playback-bar .section-marker-marker,
            [data-testid="playback-progressbar"] .section-marker-marker,
            .section-marker-marker {
                position: absolute !important;
                z-index: 99995 !important;
                width: 3px !important;
                height: 18px !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                background-color: #ffffff !important;
                border-radius: 1px !important;
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.9), 0 0 2px #ffffff !important;
                opacity: 0.95 !important;
                display: block !important;
                pointer-events: none !important;
            }

            .playback-bar .section-marker-sections,
            [data-testid="playback-progressbar"] .section-marker-sections,
            .section-marker-sections {
                z-index: 99991 !important;
                height: 18px !important;
                overflow: hidden !important;
                border-radius: 3px !important;
            }

            .playback-bar .section-marker-section,
            [data-testid="playback-progressbar"] .section-marker-section,
            .section-marker-section {
                height: 18px !important;
                pointer-events: none !important;
            }

            .playback-bar .section-marker-section:nth-child(2n),
            [data-testid="playback-progressbar"] .section-marker-section:nth-child(2n),
            .section-marker-section:nth-child(2n) {
                background-color: rgba(255, 255, 255, 0.07) !important;
            }

            .player-controls__buttons {
                will-change: transform;
                z-index: 1 !important;
            }

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
                    <polygon points="1.0,2.2 2.6,1.2 3.2,4.5 1.8,12 0.6,12" fill="#181a20" />
                    <polygon points="1.5,0.8 2.8,0.8 3.0,2.4 1.6,2.4" fill="#101216" />

                    <polygon points="2.6,6.8 5.8,6.6 7.8,12 1.8,12" fill="#f8f8fc" />
                    <polygon points="2.6,6.8 3.8,6.7 2.8,12 1.8,12" fill="#d7dae4" />
                    <polygon points="4.8,5.0 6.4,5.0 6.2,6.8 4.6,6.8" fill="#f4d2b8" />
                    <polygon points="4.4,6.6 6.6,6.6 6.2,7.2 4.4,7.2" fill="#e1e4ec" />

                    <polygon points="4.2,3.2 6.8,3.0 7.8,4.4 7.8,4.8 7.2,5.8 5.2,6.0 4.2,5.0" fill="#f4d2b8" />
                    <polygon points="7.4,4.2 8.0,4.4 7.4,4.7" fill="#f4d2b8" />
                    <polygon points="5.2,5.8 7.2,5.6 6.8,6.2 5.0,6.2" fill="#d7af96" />
                    <line x1="6.6" y1="5.3" x2="7.3" y2="5.3" stroke="#b47864" stroke-width="0.35" />
                    <line x1="6.0" y1="3.8" x2="7.4" y2="3.9" stroke="#322014" stroke-width="0.55" stroke-linecap="round" />
                    <polygon points="6.4,4.2 7.4,4.1 7.2,4.7 6.5,4.7" fill="#141418" />
                    <circle cx="7.1" cy="4.3" r="0.2" fill="#ffffff" />

                    <polygon points="2.8,2.6 6.8,2.4 6.6,4.0 2.6,4.0" fill="#442a18" />
                    <polygon points="2.6,3.6 3.8,3.6 3.6,5.4 2.8,5.4" fill="#382214" />
                    <polygon points="3.2,2.4 4.4,1.2 6.0,1.0 7.2,1.8 7.6,2.6 4.0,2.6" fill="#4e301c" />
                    <polygon points="5.0,2.4 6.2,3.8 5.8,4.2 4.6,2.8" fill="#442a18" />
                    <polygon points="6.0,2.4 7.4,3.6 7.0,4.0 5.6,2.8" fill="#442a18" />
                    <polygon points="6.8,2.6 7.8,3.8 7.4,4.2 6.4,3.0" fill="#382214" />
                    <line x1="4.2" y1="1.6" x2="6.4" y2="1.5" stroke="#734b2d" stroke-width="0.35" stroke-linecap="round" />

                    <polygon points="11.4,9.6 13.2,7.8 19.0,6.8 19.0,12 11.0,12" fill="#16181e" />
                    <line x1="13.2" y1="7.8" x2="19.0" y2="6.8" stroke="#343844" stroke-width="0.35" />
                    <line x1="11.4" y1="9.6" x2="13.2" y2="7.8" stroke="#282c36" stroke-width="0.35" />

                    <polygon points="12.2,7.0 14.8,6.8 15.0,8.2 12.0,8.4" fill="#0e1014" />
                    <line x1="12.2" y1="7.0" x2="14.8" y2="6.8" stroke="#464c5c" stroke-width="0.25" />
                    <circle cx="12.8" cy="7.6" r="0.35" fill="#06080a" />
                    <circle cx="12.8" cy="7.6" r="0.15" fill="#ff9b1e" />
                    <circle cx="13.8" cy="7.6" r="0.35" fill="#06080a" />
                    <circle cx="13.8" cy="7.6" r="0.15" fill="#78e696" />

                    <polygon points="8.4,10.6 11.4,10.6 11.4,12 8.0,12" fill="#1a1c24" />
                    <line x1="9.6" y1="12" x2="10.2" y2="10.0" stroke="#969ba8" stroke-width="0.4" stroke-linecap="round" />
                    <circle cx="10.2" cy="9.9" r="0.45" fill="#14161c" />

                    <line x1="12.6" y1="8.6" x2="11.2" y2="9.4" stroke="#20232d" stroke-width="0.7" stroke-linecap="round" />
                    <line x1="11.4" y1="6.2" x2="10.4" y2="10.5" stroke="#121418" stroke-width="1.1" stroke-linecap="round" />
                    <line x1="11.5" y1="6.3" x2="10.5" y2="10.4" stroke="#414654" stroke-width="0.28" />
                    <circle cx="10.9" cy="8.3" r="0.45" fill="#0c0e12" />
                    <circle cx="10.9" cy="8.3" r="0.16" fill="#f0be28" />

                    <polygon points="4.6,7.2 7.4,7.2 11.0,6.3 10.8,5.7 5.0,6.6" fill="#dcdee6" />
                    <polygon points="10.6,5.7 11.6,5.9 11.6,6.7 10.6,6.5" fill="#f4d2b8" />

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
            <div class="ae86-wheel ae86-wheel-rear"><img src="\${AE86_WHEEL_REAR}" draggable="false" /></div>
            <div class="ae86-wheel ae86-wheel-front"><img src="\${AE86_WHEEL_FRONT}" draggable="false" /></div>
            <div class="ae86-headlight-lamp"></div>
            <div class="ae86-headlight-beam"></div>
            <div class="ae86-taillight-lamp"></div>
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
                        <polygon points="1.0,2.2 2.6,1.2 3.2,4.5 1.8,12 0.6,12" fill="#12141a" />
                        <polygon points="1.5,0.8 2.8,0.8 3.0,2.4 1.6,2.4" fill="#0c0e12" />

                        <polygon points="2.4,6.8 5.8,6.8 7.8,12 1.6,12" fill="#202636" />
                        <polygon points="4.4,6.4 5.6,6.4 5.4,7.2 4.2,7.2" fill="#dce0ea" />
                        <polygon points="4.6,5.0 6.4,5.0 6.2,6.8 4.4,6.8" fill="#eec3a8" />

                        <polygon points="4.2,3.2 6.8,3.0 7.8,4.4 7.8,4.8 7.2,5.8 5.0,6.0 4.2,5.0" fill="#eec3a8" />
                        <polygon points="7.4,4.2 8.0,4.4 7.4,4.7" fill="#eec3a8" />
                        <polygon points="5.0,5.8 7.2,5.6 6.8,6.2 4.8,6.2" fill="#cda087" />
                        <line x1="6.6" y1="5.3" x2="7.3" y2="5.2" stroke="#a06450" stroke-width="0.35" />

                        <line x1="6.0" y1="3.8" x2="7.4" y2="3.8" stroke="#1e2028" stroke-width="0.55" stroke-linecap="round" />
                        <line x1="6.2" y1="4.4" x2="7.6" y2="4.3" stroke="#101216" stroke-width="0.55" stroke-linecap="round" />
                        <line x1="6.4" y1="4.8" x2="7.4" y2="4.8" stroke="#c3967d" stroke-width="0.3" />

                        <polygon points="2.8,2.6 6.8,2.4 6.6,4.0 2.6,4.0" fill="#181a20" />
                        <polygon points="2.6,3.6 3.8,3.6 3.6,5.4 2.8,5.4" fill="#12141a" />
                        <polygon points="3.4,2.4 4.2,0.8 5.2,2.4" fill="#242834" />
                        <polygon points="4.8,2.4 6.0,0.6 6.8,2.4" fill="#1c1e26" />
                        <polygon points="6.4,2.4 7.6,1.4 7.4,3.0" fill="#181a20" />

                        <line x1="7.2" y1="5.2" x2="9.8" y2="5.4" stroke="#f8f8fc" stroke-width="0.45" stroke-linecap="round" />
                        <rect x="9.8" y="5.1" width="0.6" height="0.6" rx="0.15" fill="#ff4b00" />
                        <rect x="10.0" y="5.3" width="0.3" height="0.3" rx="0.1" fill="#fff046" />

                        <polygon points="11.4,9.6 13.2,7.8 19.0,6.7 19.0,12 11.0,12" fill="#12141a" />
                        <line x1="13.2" y1="7.8" x2="19.0" y2="6.7" stroke="#2e323e" stroke-width="0.35" />
                        <line x1="11.4" y1="9.6" x2="13.2" y2="7.8" stroke="#242832" stroke-width="0.35" />

                        <polygon points="12.2,7.0 14.8,6.8 15.0,8.2 12.0,8.4" fill="#0c0e12" />
                        <line x1="12.2" y1="7.0" x2="14.8" y2="6.8" stroke="#3c4452" stroke-width="0.25" />
                        <circle cx="12.8" cy="7.6" r="0.35" fill="#06080a" />
                        <circle cx="12.8" cy="7.6" r="0.15" fill="#ff3c1e" />
                        <circle cx="13.8" cy="7.6" r="0.35" fill="#06080a" />
                        <circle cx="13.8" cy="7.6" r="0.15" fill="#ffb432" />

                        <polygon points="8.4,10.6 11.4,10.6 11.4,12 8.0,12" fill="#181a22" />
                        <line x1="9.6" y1="12" x2="10.2" y2="10.0" stroke="#8c91a0" stroke-width="0.4" stroke-linecap="round" />
                        <circle cx="10.2" cy="9.9" r="0.45" fill="#12141a" />

                        <line x1="12.6" y1="8.6" x2="11.2" y2="9.4" stroke="#1c1e28" stroke-width="0.7" stroke-linecap="round" />
                        <line x1="11.4" y1="6.2" x2="10.4" y2="10.5" stroke="#0e1014" stroke-width="1.1" stroke-linecap="round" />
                        <line x1="11.5" y1="6.3" x2="10.5" y2="10.4" stroke="#373c48" stroke-width="0.28" />
                        <circle cx="10.9" cy="8.3" r="0.45" fill="#0a0c10" />
                        <circle cx="10.9" cy="8.3" r="0.16" fill="#e02828" />

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
                    <div class="bunta-smoke-puff p4"></div>
                    <div class="bunta-smoke-puff p5"></div>
                </div>
            </div>
            <div class="impreza-headlight-lamp"></div>
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
        road.classList.add("playback-progressbar");
        if (road.parentElement) road.parentElement.classList.add("playback-progressbar");

        let svgCurve = document.getElementById(SVG_CURVE_ID);
        if (!svgCurve) {
            svgCurve = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgCurve.id = SVG_CURVE_ID;
            road.appendChild(svgCurve);
        }
        svgCurve.innerHTML = \`
            <path id="ae86-curve-asphalt"       stroke="#14161a" stroke-width="18" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-stripes"       stroke="rgba(205, 215, 230, 0.38)" stroke-width="1.6" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-top"    stroke="rgba(215, 225, 240, 0.44)" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-top"     stroke="rgba(205, 215, 230, 0.32)" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-inner-bottom"  stroke="rgba(205, 215, 230, 0.32)" stroke-width="1.0" stroke-linecap="butt" fill="none"/>
            <path id="ae86-curve-border-bottom" stroke="rgba(215, 225, 240, 0.44)" stroke-width="1.2" stroke-linecap="butt" fill="none"/>
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
        } else {
            if (car.querySelector("img.ae86-drive")) {
                car.querySelector("img.ae86-drive").src = AE86_DRIVE;
            }
            if (!car.querySelector(".ae86-taillight-lamp")) {
                const lamp = document.createElement("div");
                lamp.className = "ae86-taillight-lamp";
                const glow = document.createElement("div");
                glow.className = "ae86-taillight-glow";
                car.appendChild(lamp);
                car.appendChild(glow);
            }
            const existingWheels = car.querySelectorAll(".ae86-wheel");
            if (existingWheels.length > 0) {
                existingWheels.forEach(w => w.remove());
            }
            const wRear = document.createElement("div");
            wRear.className = "ae86-wheel ae86-wheel-rear";
            wRear.innerHTML = '<img src="' + AE86_WHEEL_REAR + '" draggable="false" />';
            const wFront = document.createElement("div");
            wFront.className = "ae86-wheel ae86-wheel-front";
            wFront.innerHTML = '<img src="' + AE86_WHEEL_FRONT + '" draggable="false" />';
            car.appendChild(wRear);
            car.appendChild(wFront);
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
        let lastRoadWidth = 0;
        let lastRoadBaseline = 0;
        let lastArchState = -1;


        let buntaActive = false;
        let buntaCancelling = false;
        let buntaCancelStartTime = 0;
        let buntaPassedWhilePaused = false;
        let buntaX = -80;
        let buntaYOffset = -6;
        let nextBuntaTime = performance.now() + (150 + Math.random() * 60) * 1000;
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


        if (!window.__ae86BuntaKeyBound) {
            window.__ae86BuntaKeyBound = true;
            window.addEventListener("keydown", (e) => {
                if ((e.key === "b" || e.key === "B") && !["INPUT", "TEXTAREA"].includes(e.target && e.target.tagName)) {
                    window.__triggerBuntaOvertake();
                }
            });
        }
        const oldBuntaBtn = document.getElementById("ae86-bunta-btn");
        if (oldBuntaBtn) oldBuntaBtn.remove();

        const CAR_WIDTH = 52;

        function parseTimeToSeconds(str) {
            if (!str || typeof str !== "string") return null;
            const clean = str.trim();
            if (!clean || clean.includes("-")) return null;
            const parts = clean.split(":").map(p => parseInt(p, 10));
            if (parts.some(isNaN)) return null;
            if (parts.length === 2) return parts[0] * 60 + parts[1];
            if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
            return null;
        }

        function getTrackDurationSec() {
            try {
                if (typeof Spicetify?.Player?.getDuration === "function") {
                    const d = Spicetify.Player.getDuration();
                    if (typeof d === "number" && d > 0) return d / 1000;
                }
                const ms = Spicetify?.Player?.data?.item?.duration?.milliseconds;
                if (typeof ms === "number" && ms > 0) return ms / 1000;
                const durEl = document.querySelector('[data-testid="playback-duration"], .playback-bar__progress-time-remaining');
                if (durEl && durEl.textContent) {
                    const parsed = parseTimeToSeconds(durEl.textContent);
                    if (parsed !== null && parsed > 0) return parsed;
                }
            } catch(e) {}
            return 180;
        }

        function getPlaybackPositionSec(currentProg) {
            try {
                if (typeof Spicetify?.Player?.getProgress === "function") {
                    const ms = Spicetify.Player.getProgress();
                    if (typeof ms === "number" && !isNaN(ms) && ms >= 0) return ms / 1000;
                }
                if (typeof Spicetify?.Player?.data?.position === "number") {
                    const ms = Spicetify.Player.data.position;
                    if (!isNaN(ms) && ms >= 0) return ms / 1000;
                }

                const timeEl = document.querySelector('[data-testid="playback-position"], .playback-bar__progress-time-elapsed');
                if (timeEl && timeEl.textContent) {
                    const parsed = parseTimeToSeconds(timeEl.textContent);
                    if (parsed !== null) return parsed;
                }

                const durSec = getTrackDurationSec();
                const prog = (typeof currentProg === "number") ? currentProg : (typeof smoothProgress === "number" ? smoothProgress : null);
                if (durSec > 0 && prog !== null) {
                    return prog * durSec;
                }
            } catch(e) {}
            return null;
        }

        function getCurrentTrackId() {
            try {
                const item = Spicetify?.Player?.data?.item || Spicetify?.Player?.data?.track;
                if (item) {
                    return item.uri || item.id || (item.name ? item.name + "-" + (item.duration?.milliseconds || "") : null);
                }
            } catch(e) {}
            return null;
        }

        function getAudioProgress(roadElem) {
            try {
                if (typeof Spicetify?.Player?.getProgressPercent === "function") {
                    const pct = Spicetify.Player.getProgressPercent();
                    if (typeof pct === "number" && !isNaN(pct) && pct >= 0 && pct <= 1) {
                        return pct;
                    }
                }
                if (typeof Spicetify?.Player?.getProgress === "function" && typeof Spicetify?.Player?.getDuration === "function") {
                    const cur = Spicetify.Player.getProgress();
                    const dur = Spicetify.Player.getDuration();
                    if (dur > 0 && typeof cur === "number" && !isNaN(cur) && cur >= 0) {
                        return Math.max(0, Math.min(cur / dur, 1));
                    }
                }
                const data = Spicetify?.Player?.data;
                if (data?.item?.duration?.milliseconds) {
                    const dur = data.item.duration.milliseconds;
                    const pos = data.position;
                    const ts = data.timestamp || data.positionTimestamp;
                    if (dur > 0 && typeof pos === "number" && !isNaN(pos)) {
                        const elapsed = (isPlayerPlaying() && ts) ? Math.max(0, Date.now() - ts) : 0;
                        return Math.max(0, Math.min((pos + elapsed) / dur, 1));
                    }
                }
            } catch(e) {}

            const targetRoad = roadElem || getPlaybackTargetCached();
            if (targetRoad) {
                try {
                    const cssTransform = targetRoad.style.getPropertyValue('--progress-bar-transform') ||
                                         targetRoad.parentElement?.style?.getPropertyValue?.('--progress-bar-transform');
                    if (cssTransform) {
                        const parsed = parseFloat(cssTransform);
                        if (!isNaN(parsed)) {
                            const val = parsed < 0 ? (1 + parsed / 100) : (parsed / 100);
                            if (val >= 0 && val <= 1) return val;
                        }
                    }
                    const input = targetRoad.querySelector?.('input[type="range"]') || 
                                  targetRoad.parentElement?.querySelector?.('input[type="range"]') ||
                                  document.querySelector('.playback-bar input[type="range"], [data-testid="playback-progressbar"] input[type="range"]');
                    if (input && input.max && parseFloat(input.max) > 0) {
                        const val = parseFloat(input.value) / parseFloat(input.max);
                        if (!isNaN(val) && val >= 0 && val <= 1) return val;
                    }
                } catch(e) {}
            }
            return null;
        }

        let lastTrackId = getCurrentTrackId();
        let shoutedForTrackId = (getPlaybackPositionSec() > 2.5) ? lastTrackId : null;
        let pendingGoShout = !shoutedForTrackId;
        let trackChangedAt = performance.now();
        let lastKnownGoProgress = null;
        let lastUserSeekTime = 0;
        let smoothProgress = null;
        let wasPlayingForGo = false;

        if (!window.__ae86SongChangeBound && window.Spicetify?.Player?.addEventListener) {
            window.__ae86SongChangeBound = true;
            try {
                Spicetify.Player.addEventListener("songchange", () => {
                    const id = getCurrentTrackId();
                    if (id && id !== lastTrackId) {
                        lastTrackId = id;
                        shoutedForTrackId = null;
                        pendingGoShout = true;
                        trackChangedAt = performance.now();
                    }
                });
            } catch(e) {}
        }

        if (!window.__ae86VisibilityBound) {
            window.__ae86VisibilityBound = true;
            const resyncOnFocus = () => {
                lastLoopTime = performance.now();
                const p = getAudioProgress();
                if (p !== null) {
                    smoothProgress = p;
                    lastKnownProgress = p;
                }
            };
            document.addEventListener("visibilitychange", () => {
                if (!document.hidden) resyncOnFocus();
            });
            window.addEventListener("focus", resyncOnFocus);
        }

        function triggerGoShout() {
            if (isDragging || (performance.now() - lastUserSeekTime < 800)) return;

            const targetCar = car || document.getElementById(CAR_ID);
            if (!targetCar) return;

            const existing = targetCar.querySelector(".ae86-manga-shout");
            if (existing) existing.remove();

            const shout = document.createElement("div");
            shout.className = "ae86-manga-shout";
            shout.innerHTML = \`
                <svg viewBox="0 0 68 42" class="ae86-shout-svg" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="ae86-go-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#fff444"/>
                            <stop offset="45%" stop-color="#ff7b00"/>
                            <stop offset="100%" stop-color="#e60000"/>
                        </linearGradient>
                        <filter id="ae86-shout-shadow" x="-20%" y="-20%" width="150%" height="150%">
                            <feDropShadow dx="1.8" dy="2.2" stdDeviation="0" flood-color="#000000" flood-opacity="1"/>
                        </filter>
                    </defs>
                    <path d="M 32.0,2.4 L 37.0,9.6 L 50.5,4.1 L 45.2,12.8 L 59.2,13.2 L 48.3,18.0 L 61.9,23.3 L 45.2,23.2 L 48.8,30.6 L 37.0,26.4 L 32.0,33.6 L 27.0,26.4 L 13.5,31.9 L 18.8,23.2 L 18.0,37.0 L 15.7,18.0 L 2.1,12.7 L 18.8,12.8 L 15.2,5.4 L 27.0,9.6 Z"
                          fill="#ffffff" stroke="#000000" stroke-width="2.2" stroke-linejoin="miter" stroke-miterlimit="4"
                          filter="url(#ae86-shout-shadow)"/>
                    <text x="34" y="21.5" text-anchor="middle"
                          font-family="'Impact', 'Hiragino Kaku Gothic Pro', 'Meiryo', 'Arial Black', sans-serif"
                          font-weight="900" font-style="italic" font-size="16" letter-spacing="-0.5px"
                          fill="url(#ae86-go-grad)" stroke="#000000" stroke-width="2.8" paint-order="stroke fill"
                          transform="rotate(-4 34 21.5)">GO!</text>
                    <text x="34.5" y="29.0" text-anchor="middle"
                          font-family="'Hiragino Kaku Gothic Pro', 'Meiryo', 'Yu Gothic', sans-serif"
                          font-weight="900" font-style="italic" font-size="6.5" letter-spacing="1px"
                          fill="#111111" stroke="#ffffff" stroke-width="0.8" paint-order="stroke fill"
                          transform="rotate(-4 34 21.5)">ゴー！</text>
                </svg>
            \`;
            car.appendChild(shout);
            setTimeout(() => {
                if (shout.parentElement) shout.remove();
            }, 1350);
        }

        let lastSmokeTime = 0;
        function emitSmoke(x, y, scale, parentElem) {
            const now = performance.now();
            if (now - lastSmokeTime < 26) return;
            lastSmokeTime = now;

            for (let i = 0; i < 2; i++) {
                const smoke = document.createElement("div");
                smoke.className = "ae86-smoke-puff";
                const size = (9 + Math.random() * 9) * scale;
                smoke.style.width = size + "px";
                smoke.style.height = size + "px";
                const jitterX = (Math.random() - 0.5) * 8;
                const jitterY = (Math.random() - 0.5) * 4;
                smoke.style.left = (x - size / 2 + jitterX) + "px";
                smoke.style.top = (y - size / 2 + jitterY) + "px";
                parentElem.appendChild(smoke);
                setTimeout(() => smoke.remove(), 500);
            }
        }

        let lastAe86CruisingSmokeTime = 0;
        let lastBuntaCruisingSmokeTime = 0;
        function emitCruisingSmoke(x, y, parentElem, isBunta = false) {
            const now = performance.now();
            if (isBunta) {
                if (now - lastBuntaCruisingSmokeTime < 140) return;
                lastBuntaCruisingSmokeTime = now;
            } else {
                if (now - lastAe86CruisingSmokeTime < 160) return;
                lastAe86CruisingSmokeTime = now;
            }

            const smoke = document.createElement("div");
            smoke.className = "ae86-cruising-smoke";
            const size = 3.5 + Math.random() * 2;
            smoke.style.width = size + "px";
            smoke.style.height = size + "px";
            const jitterY = (Math.random() - 0.5) * 1.2;
            smoke.style.left = (x - size / 2) + "px";
            smoke.style.top = (y - size / 2 + jitterY) + "px";
            parentElem.appendChild(smoke);
            setTimeout(() => {
                if (smoke.parentElement) smoke.remove();
            }, 500);
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
            const now = performance.now();
            const currentRoad = getPlaybackTargetCached();
            if (!currentRoad) {
                requestAnimationFrame(loop);
                return;
            }

            if (currentRoad.style.position !== "relative") {
                currentRoad.style.setProperty("position", "relative", "important");
            }
            if (!currentRoad.classList.contains("playback-progressbar")) {
                currentRoad.classList.add("playback-progressbar");
                if (currentRoad.parentElement) currentRoad.parentElement.classList.add("playback-progressbar");
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
            const oldBtn = document.getElementById("ae86-bunta-btn");
            if (oldBtn) oldBtn.remove();

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
                const audioProg = getAudioProgress(currentRoad);
                if (audioProg !== null) {
                    progress = audioProg;
                } else if (lastKnownProgress !== null) {
                    progress = lastKnownProgress;
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

            const currentTrackId = getCurrentTrackId();
            if (currentTrackId && currentTrackId !== lastTrackId) {
                lastTrackId = currentTrackId;
                smoothProgress = null;
                shoutedForTrackId = null;
                pendingGoShout = true;
                trackChangedAt = now;
            }

            // Loop / repeat detection (track wrapped around from end > 0.85 to start < 0.08)
            if (lastKnownGoProgress !== null && lastKnownGoProgress > 0.85 && progress < 0.08 && !isDragging && (now - lastUserSeekTime > 1500)) {
                shoutedForTrackId = null;
                pendingGoShout = true;
                trackChangedAt = now;
            }

            if (pendingGoShout && isPlaying && !isDragging && (now - lastUserSeekTime > 800)) {
                const posSec = getPlaybackPositionSec();
                const isNearStart = (posSec === null) || (posSec <= 2.5) || (progress <= 0.06) || (now - trackChangedAt < 2500);

                if (isNearStart) {
                    pendingGoShout = false;
                    shoutedForTrackId = currentTrackId;
                    triggerGoShout();
                } else if (posSec !== null && posSec > 3.5 && (now - trackChangedAt > 3000)) {
                    pendingGoShout = false;
                    shoutedForTrackId = currentTrackId;
                }
            }
            lastKnownGoProgress = progress;
            wasPlayingForGo = isPlaying;

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

            const wasInBackground = (now - lastLoopTime > 0.25);
            const dt = Math.min((now - lastLoopTime) / 1000, 0.05);
            lastLoopTime = now;

            if (isPlaying && !isDragging && !buntaActive && now >= nextBuntaTime) {
                buntaActive = true;
                buntaCancelling = false;
                buntaPassedWhilePaused = false;
                buntaX = -80;
                buntaYOffset = -6;
                surpriseStartTime = 0;
                if (impreza) impreza.style.display = "block";
            }

            if (isDragging && dragProgress !== null) {
                smoothProgress = dragProgress;
            } else if (!isPlaying) {
                if (smoothProgress === null || wasInBackground) smoothProgress = progress;
                else smoothProgress += (progress - smoothProgress) * 0.3;
            } else {
                if (smoothProgress === null || wasInBackground || Math.abs(progress - smoothProgress) > 0.02) {
                    smoothProgress = progress;
                } else {
                    const lerpFactor = Math.min(1, 1 - Math.exp(-22 * dt));
                    smoothProgress += (progress - smoothProgress) * lerpFactor;
                }
            }
            smoothProgress = Math.max(0, Math.min(smoothProgress, 1));

            const halfW = CAR_WIDTH / 2;
            const t = Math.max(0, Math.min(smoothProgress, 1));
            const availableTrackWidth = Math.max(0, w - CAR_WIDTH);
            const carLeft = t * availableTrackWidth;
            const carX = carLeft + halfW;
            const carY = baseline - 4 * t * (1 - t) * archHeight;
            const clampedCarX = carX;

            if (buntaActive) {
                if (isDragging && !buntaCancelling) {
                    buntaCancelling = true;
                    buntaCancelStartTime = now;
                }

                if (!isPlaying && buntaX >= clampedCarX - 25) {
                    buntaPassedWhilePaused = true;
                }

                const buntaSpeed = buntaCancelling ? 380 : 260; // px / seg (acelera ligeramente al disolverse)
                buntaX += buntaSpeed * dt;

                if (buntaX > clampedCarX + 55) {
                    buntaYOffset += (-1.0 - buntaYOffset) * 0.08;
                } else {
                    buntaYOffset += (-6.0 - buntaYOffset) * 0.12;
                }

                if (isPlaying && !buntaPassedWhilePaused && !buntaCancelling &&
                    buntaX >= clampedCarX - 15 && buntaX <= clampedCarX + 25 &&
                    surpriseStartTime === 0) {
                    surpriseStartTime = now;
                }

                let bodyOpacity = 1.0;
                let lightsFade = 1.0;

                if (buntaCancelling) {
                    const cancelProgress = Math.min(1.0, (now - buntaCancelStartTime) / 350);
                    const cancelFactor = Math.max(0, 1.0 - cancelProgress);
                    bodyOpacity = cancelFactor * 0.85;
                    lightsFade = cancelFactor;
                    if (cancelProgress >= 1.0) {
                        buntaActive = false;
                        buntaCancelling = false;
                        buntaPassedWhilePaused = false;
                        if (impreza) impreza.style.display = "none";
                        nextBuntaTime = now + (150 + Math.random() * 60) * 1000;
                    }
                } else {
                    if (buntaX < clampedCarX - 10) {
                        const entranceDist = (clampedCarX - 10) - buntaX;
                        bodyOpacity = Math.max(0.12, Math.min(1.0, 1.0 - (entranceDist / 200)));
                    }
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

                    const overtakeDist = buntaX - (clampedCarX - 10);
                    const overtakeFactor = Math.max(0, Math.min(1, overtakeDist / 35));

                    const taillightGlow = impreza.querySelector(".impreza-taillight-glow");
                    const taillightLamp = impreza.querySelector(".impreza-taillight-lamp");
                    if (taillightLamp) {
                        const lampOpacity = (0.35 + 0.65 * overtakeFactor) * lightsFade;
                        taillightLamp.style.opacity = lampOpacity.toFixed(2);
                        if (overtakeFactor > 0.5) {
                            taillightLamp.style.filter = "drop-shadow(0 0 2.5px #ff0000) drop-shadow(0 0 6px rgba(255, 20, 20, 0.95))";
                            taillightLamp.style.background = "#ff1e1e";
                        } else {
                            taillightLamp.style.filter = "drop-shadow(0 0 1px rgba(255, 30, 30, 0.4))";
                            taillightLamp.style.background = "#b51818";
                        }
                    }
                    if (taillightGlow) {
                        const glowOpacity = (0.12 + 0.83 * overtakeFactor) * lightsFade;
                        taillightGlow.style.opacity = glowOpacity.toFixed(2);
                    }

                    const headlightGlow = impreza.querySelector(".impreza-headlight-glow");
                    const headlightLamp = impreza.querySelector(".impreza-headlight-lamp");
                    const frontHeadlightOpacity = (buntaX > clampedCarX + 120 ? Math.max(0, bodyOpacity * 1.2) : 1.0) * lightsFade;
                    if (headlightGlow) headlightGlow.style.opacity = frontHeadlightOpacity.toFixed(2);
                    if (headlightLamp) headlightLamp.style.opacity = frontHeadlightOpacity.toFixed(2);
                }

                if (buntaActive) {
                    emitCruisingSmoke(buntaX - 25, (isDragging || buntaCancelling ? baseline : carY) + buntaYOffset + 4.5, currentRoad, true);
                }

                if (buntaX > w + 90) {
                    buntaActive = false;
                    buntaCancelling = false;
                    buntaPassedWhilePaused = false;
                    if (impreza) impreza.style.display = "none";
                    nextBuntaTime = now + (150 + Math.random() * 60) * 1000;
                }
            } else {
                if (impreza && impreza.style.display !== "none") {
                    impreza.style.display = "none";
                }
            }

            const surpriseElapsed = (isPlaying && surpriseStartTime > 0) ? (now - surpriseStartTime) / 1000 : 999;
            const isSurprised = isPlaying && surpriseElapsed < 1.3;
            const surpriseDecay = isSurprised ? Math.max(0, 1 - surpriseElapsed / 1.3) : 0;
            const surpriseWobble = isSurprised ? Math.sin(surpriseElapsed * 24) * 8.5 * Math.pow(surpriseDecay, 1.2) : 0;
            const isSurpriseDrifting = isSurprised && surpriseElapsed < 0.65;

            const isDriftingNow = isDragging || isPostDrifting || isSurpriseDrifting;
            car.classList.toggle("drifting", isDriftingNow);

            svgCurve.style.display = "block";

            if (playerButtons) {
                const lift = archHeight * 0.5;
                playerButtons.style.transform = lift > 0.4 ? "translateY(-" + lift + "px)" : "none";
            }

            const isCurveActive = archHeight > 0.05;
            const needsGeometryUpdate = isCurveActive || lastRoadWidth !== w || lastRoadBaseline !== baseline || lastArchState !== 0;

            if (needsGeometryUpdate) {
                lastRoadWidth = w;
                lastRoadBaseline = baseline;
                lastArchState = isCurveActive ? archHeight : 0;

                const controlY = baseline - (archHeight * 2);

                const pathCenterD = "M 0," + baseline.toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + controlY.toFixed(2) + " " + w.toFixed(2) + "," + baseline.toFixed(2);
                const pathTopBorderD = "M 0," + (baseline - 8.2).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 8.2).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 8.2).toFixed(2);
                const pathTopInnerD = "M 0," + (baseline - 5.0).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY - 5.0).toFixed(2) + " " + w.toFixed(2) + "," + (baseline - 5.0).toFixed(2);
                const pathBottomInnerD = "M 0," + (baseline + 5.0).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 5.0).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 5.0).toFixed(2);
                const pathBorderBottomD = "M 0," + (baseline + 8.2).toFixed(2) + " Q " + (w / 2).toFixed(2) + "," + (controlY + 8.2).toFixed(2) + " " + w.toFixed(2) + "," + (baseline + 8.2).toFixed(2);

                if (pathAsphalt) pathAsphalt.setAttribute("d", pathCenterD);
                if (pathFill) pathFill.setAttribute("d", pathCenterD);
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

            if (pathFill) {
                const curveLen = Math.sqrt(w * w + archHeight * archHeight * 2);
                pathFill.style.strokeDasharray = curveLen + "";
                pathFill.style.strokeDashoffset = (curveLen * (1 - t)).toFixed(2) + "";
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

            car.style.left = carLeft.toFixed(2) + "px";
            car.style.top = (carY - 10 + bounce).toFixed(2) + "px";
            car.style.transform = "rotate(" + (totalAngle + dynamicRoll + surpriseWobble).toFixed(2) + "deg)";

            if (isDriftingNow) {
                const smokeScale = isSurpriseDrifting
                    ? (1.3 * surpriseDecay)
                    : ((1.0 + Math.min(Math.abs(velocity), 3) * 0.25) * Math.max(0.6, driftDecay));
                emitSmoke(carLeft + 6, carY + 4, smokeScale, currentRoad);
            } else if (isPlaying) {
                emitCruisingSmoke(carLeft + 2.5, carY + 4.0, currentRoad, false);
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
            lastUserSeekTime = performance.now();
            nextBuntaTime = Math.max(nextBuntaTime, performance.now() + 60 * 1000);

            if (typeof finalProgress === "number" && !isNaN(finalProgress) && finalProgress >= 0 && finalProgress <= 1) {
                lastKnownProgress = finalProgress;
                lastKnownGoProgress = finalProgress;
                smoothProgress = finalProgress;
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
            lastUserSeekTime = performance.now();
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
