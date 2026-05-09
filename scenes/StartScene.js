export default class StartScene extends Phaser.Scene {
    constructor(){
        super("Start");
    }

    create(){
        this.ready = false;

        // ── Google Font: Press Start 2P (pixel font) ─────────────────────
        if(!document.getElementById("pixel-font")){
            const link  = document.createElement("link");
            link.id     = "pixel-font";
            link.rel    = "stylesheet";
            link.href   = "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
            document.head.appendChild(link);
        }

        // ── Shared pixel CSS ─────────────────────────────────────────────
        if(!document.getElementById("pixel-style")){
            const style = document.createElement("style");
            style.id    = "pixel-style";
            style.textContent = `
                * { box-sizing: border-box; }

                :root {
                    --px-bg:       #0a0a0f;
                    --px-panel:    #12121e;
                    --px-border:   #5865f2;
                    --px-border2:  #3a3f8f;
                    --px-yellow:   #f7e03c;
                    --px-green:    #3ddc84;
                    --px-cyan:     #4dd9e0;
                    --px-red:      #ff4757;
                    --px-white:    #e8e8f0;
                    --px-dim:      #6a6a8a;
                    --px-font:     'Press Start 2P', monospace;
                }

                /* ── scanline overlay ── */
                @keyframes scanline {
                    0%   { background-position: 0 0;   }
                    100% { background-position: 0 4px; }
                }
                @keyframes blink {
                    0%,49%  { opacity:1; }
                    50%,100%{ opacity:0; }
                }
                @keyframes fadeIn {
                    from { opacity:0; transform:translateY(6px); }
                    to   { opacity:1; transform:translateY(0);   }
                }
                @keyframes glowPulse {
                    0%,100% { text-shadow: 0 0 6px var(--px-yellow), 0 0 18px var(--px-yellow); }
                    50%     { text-shadow: 0 0 2px var(--px-yellow); }
                }
                @keyframes marchBorder {
                    0%   { background-position: 0 0, 100% 0, 100% 100%, 0 100%; }
                    100% { background-position: 40px 0, 100% 40px, calc(100% - 40px) 100%, 0 calc(100% - 40px); }
                }
                @keyframes starFloat {
                    0%,100% { transform:translateY(0);    }
                    50%     { transform:translateY(-4px); }
                }

                /* ── full-screen wrapper ── */
                #px-ui {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--px-bg);
                    z-index: 100;
                    font-family: var(--px-font);
                    image-rendering: pixelated;
                    overflow: hidden;
                }

                /* scanline effect */
                #px-ui::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        to bottom,
                        transparent 0px,
                        transparent 3px,
                        rgba(0,0,0,.18) 3px,
                        rgba(0,0,0,.18) 4px
                    );
                    pointer-events: none;
                    z-index: 999;
                    animation: scanline .12s linear infinite;
                }

                /* floating pixel stars bg */
                .px-stars {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .px-star {
                    position: absolute;
                    width: 2px; height: 2px;
                    background: var(--px-white);
                    opacity: .35;
                    animation: starFloat ease-in-out infinite;
                }

                /* ── main panel ── */
                #px-panel {
                    position: relative;
                    width: 420px;
                    background: var(--px-panel);
                    padding: 32px 36px 28px;
                    /* 8-bit double border: outer blue, inner dark */
                    outline: 4px solid var(--px-border);
                    outline-offset: 0;
                    box-shadow:
                        0 0 0 8px var(--px-bg),
                        0 0 0 12px var(--px-border2),
                        0 0 40px rgba(88,101,242,.35),
                        inset 0 0 0 2px var(--px-border2);
                    animation: fadeIn .4s ease both;
                    /* marching ants border effect */
                    image-rendering: pixelated;
                }

                /* pixel corner decorations */
                #px-panel::before,
                #px-panel::after {
                    content: '';
                    position: absolute;
                    width: 8px; height: 8px;
                    background: var(--px-yellow);
                }
                #px-panel::before { top:-4px; left:-4px; }
                #px-panel::after  { bottom:-4px; right:-4px; }

                .px-corner-tr,
                .px-corner-bl {
                    position: absolute;
                    width: 8px; height: 8px;
                    background: var(--px-yellow);
                }
                .px-corner-tr { top:-4px; right:-4px; }
                .px-corner-bl { bottom:-4px; left:-4px; }

                /* ── header ── */
                .px-cap {
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 10px;
                    animation: starFloat 2s ease-in-out infinite;
                }
                .px-title {
                    font-size: 9px;
                    color: var(--px-yellow);
                    text-align: center;
                    letter-spacing: 1px;
                    line-height: 1.8;
                    animation: glowPulse 2s ease-in-out infinite;
                    margin-bottom: 4px;
                }
                .px-subtitle {
                    font-size: 6px;
                    color: var(--px-cyan);
                    text-align: center;
                    letter-spacing: 2px;
                    margin-bottom: 24px;
                }

                /* pixel divider */
                .px-divider {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                .px-divider-line {
                    flex: 1;
                    height: 2px;
                    background: repeating-linear-gradient(
                        to right,
                        var(--px-border) 0px, var(--px-border) 4px,
                        transparent 4px, transparent 8px
                    );
                }
                .px-divider-icon { font-size: 12px; }

                /* label */
                .px-label {
                    font-size: 7px;
                    color: var(--px-dim);
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }

                /* ── input ── */
                #px-input {
                    width: 100%;
                    background: #06060e;
                    border: 2px solid var(--px-border2);
                    outline: none;
                    padding: 10px 12px;
                    font-family: var(--px-font);
                    font-size: 9px;
                    color: var(--px-green);
                    letter-spacing: 1px;
                    transition: border-color .15s;
                    /* pixel caret */
                    caret-color: var(--px-green);
                }
                #px-input::placeholder {
                    color: #2a2a4a;
                }
                #px-input:focus {
                    border-color: var(--px-border);
                    box-shadow: 0 0 0 2px rgba(88,101,242,.3),
                                inset 0 0 12px rgba(61,220,132,.05);
                }

                /* hint text */
                #px-hint {
                    font-size: 6px;
                    color: var(--px-dim);
                    margin-top: 8px;
                    min-height: 14px;
                    letter-spacing: 1px;
                }
                #px-hint .blink {
                    display: inline-block;
                    animation: blink .8s step-end infinite;
                }

                /* ── pixel button ── */
                #px-btn {
                    display: none;
                    width: 100%;
                    margin-top: 18px;
                    padding: 13px 0;
                    font-family: var(--px-font);
                    font-size: 8px;
                    letter-spacing: 2px;
                    color: #0a0a0f;
                    background: var(--px-yellow);
                    border: none;
                    cursor: pointer;
                    /* 8-bit raised button */
                    box-shadow:
                        0 4px 0 #a89020,
                        0 6px 0 #5a4e10;
                    transition: transform .08s, box-shadow .08s;
                    image-rendering: pixelated;
                    position: relative;
                }
                #px-btn::before {
                    content: '▶ ';
                }
                #px-btn:hover {
                    background: #ffe84a;
                }
                #px-btn:active {
                    transform: translateY(4px);
                    box-shadow: 0 0 0 #a89020, 0 2px 0 #5a4e10;
                }

                /* press-any-key blink */
                .px-press {
                    font-size: 6px;
                    color: var(--px-white);
                    text-align: center;
                    margin-top: 14px;
                    letter-spacing: 1px;
                    animation: blink 1s step-end infinite;
                }
            `;
            document.head.appendChild(style);
        }

        // ── build DOM ────────────────────────────────────────────────────
        const wrapper = document.createElement("div");
        wrapper.id = "px-ui";

        // pixel star background
        let starsHTML = '<div class="px-stars">';
        for(let i = 0; i < 40; i++){
            const x   = Math.random() * 100;
            const y   = Math.random() * 100;
            const dur = 1.5 + Math.random() * 3;
            const del = Math.random() * 3;
            starsHTML += `<div class="px-star" style="left:${x}%;top:${y}%;animation-duration:${dur}s;animation-delay:${del}s"></div>`;
        }
        starsHTML += '</div>';

        wrapper.innerHTML = `
            ${starsHTML}
            <div id="px-panel">
                <div class="px-corner-tr"></div>
                <div class="px-corner-bl"></div>

                <div class="px-cap">🎓</div>
                <div class="px-title">GRADUATION RUNNER</div>
               

                <div class="px-divider">
                    <div class="px-divider-line"></div>
                    <div class="px-divider-icon">⭐</div>
                    <div class="px-divider-line"></div>
                </div>

                <div class="px-label">PLAYER NAME</div>
                <input id="px-input" type="text" placeholder="ENTER NAME..." maxlength="16" autocomplete="off" spellcheck="false" />
                <div id="px-hint">PRESS ENTER TO CONFIRM<span class="blink">_</span></div>

                <button id="px-btn">START GAME</button>
                <div class="px-press" id="px-press" style="display:none">PRESS SPACE OR TAP TO BEGIN</div>
            </div>
        `;

        document.body.appendChild(wrapper);

        const input    = wrapper.querySelector("#px-input");
        const hint     = wrapper.querySelector("#px-hint");
        const btn      = wrapper.querySelector("#px-btn");
        const pressMsg = wrapper.querySelector("#px-press");

        input.focus();

        const confirm = () => {
            const val = input.value.trim().toUpperCase();
            if(!val){ input.focus(); return; }
            this.playerName  = val;
            input.disabled   = true;
            hint.innerHTML   = `<span style="color:var(--px-green)">✔ HELLO, ${escapeHtml(val)}!</span>`;
            btn.style.display = "block";
            pressMsg.style.display = "block";
            this.ready = true;
        };

        input.addEventListener("keydown", e => {
            if(e.key === "Enter") confirm();
        });

        const startGame = () => {
            if(!this.ready) return;
            wrapper.remove();
            this.scene.start("Game", { playerName: this.playerName });
        };

        btn.addEventListener("click", startGame);
        this.input.keyboard.on("keydown-SPACE", startGame);
        this.input.on("pointerdown", startGame);
    }
}

function escapeHtml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}