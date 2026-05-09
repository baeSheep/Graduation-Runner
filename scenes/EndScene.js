import Storage from "../utils/Storage.js";

export default class EndScene extends Phaser.Scene {
    constructor(){
        super("End");
    }

    init(data){
        this.name     = data.name;
        this.distance = data.distance;
    }

    create(){

        Storage.saveBest(this.distance);

        const best      = Storage.getBest();
        const isNewBest = this.distance >= best;

        // ===== FONT HỖ TRỢ TIẾNG VIỆT =====
        if(!document.getElementById("vn-font")){
            const link = document.createElement("link");

            link.id   = "vn-font";
            link.rel  = "stylesheet";
            link.href =
                "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap";

            document.head.appendChild(link);
        }

        // ===== STYLE =====
        if(!document.getElementById("px-end-style")){

            const style = document.createElement("style");

            style.id = "px-end-style";

            style.textContent = `

                @keyframes fadeIn {
                    from {
                        opacity:0;
                        transform:translateY(10px);
                    }
                    to {
                        opacity:1;
                        transform:translateY(0);
                    }
                }

                @keyframes blink {
                    0%,49%  { opacity:1; }
                    50%,100%{ opacity:0; }
                }

                @keyframes pixelRain {
                    0% {
                        transform:translateY(-30px);
                        opacity:1;
                    }
                    100% {
                        transform:translateY(600px);
                        opacity:0;
                    }
                }

                @keyframes starFloat {
                    0%,100% {
                        transform:translateY(0);
                    }
                    50% {
                        transform:translateY(-4px);
                    }
                }

                @keyframes hpBar {
                    from { width:0; }
                    to   { width:100%; }
                }

                body {
                    overflow:hidden;
                }

                #px-end-ui {
                    position:absolute;
                    inset:0;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    background:#080811;

                    overflow:hidden;
                    z-index:9999;
                }

                /* scanline */
                #px-end-ui::after {
                    content:'';
                    position:absolute;
                    inset:0;

                    background:repeating-linear-gradient(
                        to bottom,
                        transparent 0px,
                        transparent 3px,
                        rgba(0,0,0,.18) 3px,
                        rgba(0,0,0,.18) 4px
                    );

                    pointer-events:none;
                }

                /* stars */
                .px-stars {
                    position:absolute;
                    inset:0;
                }

                .px-star {
                    position:absolute;

                    width:2px;
                    height:2px;

                    background:white;
                    opacity:.5;

                    animation:starFloat ease-in-out infinite;
                }

                /* rain */
                .px-rain-dot {
                    position:absolute;

                    top:-30px;

                    width:4px;
                    height:4px;

                    animation:pixelRain linear infinite;
                }

                /* panel */
                #px-end-panel {

                    position:relative;

                    width:680px;
                    max-width:92vw;

                    background:#12121e;

                    padding:36px;

                    outline:4px solid #5865f2;

                    box-shadow:
                        0 0 0 8px #0a0a0f,
                        0 0 0 12px #3a3f8f,
                        0 0 50px rgba(88,101,242,.35);

                    animation:fadeIn .45s ease both;

                    z-index:2;
                }

                .px-result-tag {
                    text-align:center;

                    font-family:'Press Start 2P', monospace;

                    color:#4dd9e0;

                    font-size:10px;
                    letter-spacing:3px;

                    margin-bottom:18px;
                }

                .px-result-title {

                    text-align:center;

                    font-family:'Press Start 2P', monospace;

                    color:#ffe84a;

                    font-size:20px;

                    margin-bottom:14px;

                    text-shadow:
                        0 0 10px #ffe84a,
                        2px 2px 0 #8f7d15;
                }

                .px-result-name {

                    text-align:center;

                    font-family:'Press Start 2P', monospace;

                    color:#67ffb1;

                    font-size:10px;

                    margin-bottom:26px;
                }

                .px-stats {

                    display:grid;

                    grid-template-columns:1fr 1fr;

                    gap:16px;

                    margin-bottom:20px;
                }

                .px-stat {

                    background:#06060e;

                    border:2px solid #3a3f8f;

                    padding:14px;
                }

                .px-stat-label {

                    font-family:'Press Start 2P', monospace;

                    color:#7f7fa5;

                    font-size:8px;

                    margin-bottom:10px;
                }

                .px-stat-value {

                    color:white;

                    font-size:28px;

                    font-weight:700;

                    font-family:'Be Vietnam Pro', sans-serif;
                }

                .px-stat-unit {
                    font-size:13px;
                    color:#9d9dbd;
                }

                .px-new-record {

                    color:#ffe84a;

                    font-family:'Press Start 2P', monospace;

                    font-size:8px;

                    margin-top:8px;

                    animation:blink .8s step-end infinite;
                }

                /* progress */
                .px-bar-wrap {
                    margin-bottom:22px;
                }

                .px-bar-label {

                    display:flex;
                    justify-content:space-between;

                    margin-bottom:8px;

                    font-family:'Press Start 2P', monospace;

                    color:#7f7fa5;

                    font-size:8px;
                }

                .px-bar-track {

                    height:14px;

                    background:#06060e;

                    border:2px solid #3a3f8f;
                }

                .px-bar-fill {

                    height:100%;

                    background:linear-gradient(
                        90deg,
                        #67ffb1 0%,
                        #4dd9e0 100%
                    );

                    animation:hpBar 1s ease both;
                }

                /* invitation box */
                .px-log {

                    background:#06060e;

                    border:2px solid #3a3f8f;

                    padding:20px;

                    margin-bottom:24px;

                    border-radius:8px;

                    font-family:
                        'Be Vietnam Pro',
                        Arial,
                        sans-serif;

                    font-size:15px;

                    line-height:2;

                    color:#d8d8e8;

                    box-shadow:
                        inset 0 0 12px rgba(88,101,242,.12);
                }

                .px-log-line {
                    display:block;
                    margin-bottom:10px;
                }

                .px-log-line:last-child {
                    margin-bottom:0;
                }

                .px-log-line.hi {

                    text-align:center;

                    color:white;

                    font-size:20px;

                    font-weight:700;

                    margin-bottom:18px;
                }

                .px-log-line.ok {
                    color:#67ffb1;
                }

                .px-log-line.warn {

                    color:#ffe84a;

                    font-weight:700;
                }

                .px-log strong {
                    color:white;
                    font-weight:700;
                }

                /* button */
                #px-end-btn {

                    width:100%;

                    padding:16px 0;

                    border:none;

                    cursor:pointer;

                    background:#ffe84a;

                    color:#111;

                    font-family:'Press Start 2P', monospace;

                    font-size:11px;

                    letter-spacing:2px;

                    box-shadow:
                        0 5px 0 #8f7d15;

                    transition:.1s;
                }

                #px-end-btn:hover {
                    transform:translateY(-2px);
                }

                #px-end-btn:active {

                    transform:translateY(4px);

                    box-shadow:
                        0 1px 0 #8f7d15;
                }

                @media(max-width:768px){

                    #px-end-panel{
                        padding:22px;
                    }

                    .px-result-title{
                        font-size:16px;
                    }

                    .px-log{
                        font-size:13px;
                    }

                    .px-log-line.hi{
                        font-size:16px;
                    }
                }

            `;

            document.head.appendChild(style);
        }

        // ===== BUILD UI =====

        const wrapper = document.createElement("div");

        wrapper.id = "px-end-ui";

        // stars
        let starsHTML = `<div class="px-stars">`;

        for(let i = 0; i < 40; i++){

            const dur = 2 + Math.random() * 3;
            const del = Math.random() * 3;

            starsHTML += `
                <div
                    class="px-star"
                    style="
                        left:${Math.random()*100}%;
                        top:${Math.random()*100}%;
                        animation-duration:${dur}s;
                        animation-delay:${del}s;
                    ">
                </div>
            `;
        }

        starsHTML += `</div>`;

        // rain
        const colors = [
            "#ffe84a",
            "#4dd9e0",
            "#67ffb1",
            "#5865f2",
            "#ff4757"
        ];

        let rainHTML = "";

        for(let i = 0; i < 20; i++){

            const c   = colors[i % colors.length];
            const dur = 2 + Math.random() * 2;
            const del = Math.random() * 3;

            rainHTML += `
                <div
                    class="px-rain-dot"
                    style="
                        left:${Math.random()*100}%;
                        background:${c};
                        animation-duration:${dur}s;
                        animation-delay:${del}s;
                    ">
                </div>
            `;
        }

        // progress %
        const pct = Math.min(
            100,
            Math.round((this.distance / 250) * 100)
        );

        // medal
        let medal = "🥉";
        let tier  = "BRONZE";

        if(this.distance >= 250){
            medal = "🥇";
            tier  = "GOLD";
        }
        else if(this.distance >= 150){
            medal = "🥈";
            tier  = "SILVER";
        }

        wrapper.innerHTML = `

            ${starsHTML}
            ${rainHTML}

            <div id="px-end-panel">

                <div class="px-result-tag">
                    — STAGE CLEAR —
                </div>

                <div class="px-result-title">
                    ${medal} ${tier} RUN ${medal}
                </div>

                <div class="px-result-name">
                    PLAYER: ${escapeHtml(this.name)}
                </div>

                <div class="px-stats">

                    <div class="px-stat">
                        <div class="px-stat-label">
                            THIS RUN
                        </div>

                        <div class="px-stat-value">
                            ${this.distance}
                            <span class="px-stat-unit">m</span>
                        </div>
                    </div>

                    <div class="px-stat">
                        <div class="px-stat-label">
                            BEST
                        </div>

                        <div class="px-stat-value">
                            ${best}
                            <span class="px-stat-unit">m</span>
                        </div>

                        ${isNewBest
                            ? `<div class="px-new-record">
                                    ★ NEW RECORD!
                               </div>`
                            : ""
                        }
                    </div>

                </div>

                <div class="px-bar-wrap">

                    <div class="px-bar-label">
                        <span>PROGRESS</span>
                        <span>${pct}%</span>
                    </div>

                    <div class="px-bar-track">
                        <div
                            class="px-bar-fill"
                            style="width:${pct}%">
                        </div>
                    </div>

                </div>

                <div class="px-log">

                    <span class="px-log-line hi">
                        ✦ THƯ MỜI THAM DỰ LỄ TỐT NGHIỆP ✦
                    </span>

                    <span class="px-log-line">
                        Trân trọng kính mời
                        <strong>${escapeHtml(this.name)}</strong>
                    </span>

                    <span class="px-log-line ok">
                        đến tham dự buổi lễ tốt nghiệp
                        và ghi dấu chặng đường đáng nhớ cùng mình.
                    </span>

                    <span class="px-log-line">
                         Thành tích đạt được:
                        <strong>${this.distance}m</strong>
                    </span>

                    <span class="px-log-line ${isNewBest ? 'warn' : ''}">
                        ${
                            isNewBest
                            ? ' Thành tích xuất sắc nhất được ghi nhận!'
                            : ' Thành tích cá nhân tốt nhất: ' + best + 'm'
                        }
                    </span>

                    <span class="px-log-line">
                         Thời gian:
                        14/05/2026
                    </span>

                    <span class="px-log-line">
    📍 Địa điểm:
    <a 
        href="https://maps.app.goo.gl/sVX5gk4zmo8CPMpY6"
        target="_blank"
        style="
            color:#67ffb1;
            
            line-height:1.8;
        "
    >
        Trung tâm hội nghị The ADORA Center<br>
        431 Hoàng Văn Thụ,
        Phường Tân Sơn Nhất,
        TP.HCM
    </a>
</span>

                    <span class="px-log-line">
                         Sự hiện diện của bạn
                        là niềm vinh hạnh đối với mình.
                    </span>

                    <span class="px-log-line">
                        ✨ Hân hạnh được đón tiếp ✨
                        <span
                            style="
                                animation:blink .8s step-end infinite;
                                display:inline-block;
                            ">
                            ▌
                        </span>
                    </span>

                </div>

                <button id="px-end-btn">
                    ▶ PLAY AGAIN
                </button>

            </div>
        `;

        document.body.appendChild(wrapper);

        wrapper
            .querySelector("#px-end-btn")
            .addEventListener("click", () => {
                location.reload();
            });
    }
}

function escapeHtml(s){

    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}