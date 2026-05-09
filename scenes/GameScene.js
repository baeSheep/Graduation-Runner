export default class GameScene extends Phaser.Scene {

    constructor(){
        super("Game");
    }

    init(data){
        this.playerName = data.playerName;
    }

    preload(){

        // PLAYER
        this.load.spritesheet("player","assets/player.png",{
            frameWidth: 16,
            frameHeight: 16
        });

        // OBSTACLES
        this.load.image("books",  "assets/books.png");
        this.load.image("coffee", "assets/coffee.png");
        this.load.image("laptop", "assets/laptop.png");
        this.load.image("paper",  "assets/paper.png");

        // BACKGROUND pixel 1200×750
        this.load.image("bgDay",   "assets/day.png");
        this.load.image("bgNight", "assets/night.png");
    }

    create(){

        this.gameStarted = false;
        this.isGameOver  = false;
        this.isFinished  = false;

        // ─────────────────────────────────────────────
        // FIX: ép canvas fill toàn bộ màn hình
        // ─────────────────────────────────────────────
        const fixCSS = () => {
        const canvas = document.querySelector("canvas");
        if(!canvas) return;

        document.documentElement.style.cssText =
            "margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;";
        document.body.style.cssText =
            "margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center;";

        canvas.style.cssText =
            "display:block;width:100vw;height:100vh;object-fit:contain;image-rendering:pixelated;";
    };
    fixCSS();

        // ─────────────────────────────────────────────
        // BACKGROUND FIT
        // ─────────────────────────────────────────────
        // Ảnh gốc: 1200×750, Canvas: 800×400
        // Scale theo width: 800/1200 = 0.6667
        // → scaled img height = 750 * 0.6667 = 500px
        // Canvas cao 400px → dư 100px
        //
        // Nhìn ảnh day.png:
        //   - Bầu trời: 0 → ~60% (450px)  → 0→300px scaled
        //   - Mây:      ~55%→70%           → 275→350px scaled
        //   - Horizon:  ~70% (525px gốc)   → 350px scaled
        //   - Cỏ:       ~70%→80%           → 350→400px scaled
        //   - Nước+cây: ~80%→100%          → bỏ đi
        //
        // Ta muốn horizon (350px scaled) nằm ở y=300 (G)
        // → cần shift up: 350 - 300 = 50px trong display
        // → trong texture gốc: 50 / 0.6667 = 75px
        // → tilePositionY = 75
        // ─────────────────────────────────────────────

        const IMG_W      = 1200;
        const CAM_W      = 800;
        const CAM_H      = 400;
        const tileScale  = CAM_W / IMG_W;   // 0.6667

        // Shift ảnh lên để đường horizon khớp với G=300
        // Điều chỉnh số này nếu cần: tăng = đẩy ảnh lên (thấy phần dưới hơn)
        const tileOffsetY = 75;

        // DAY — layer dưới
        this.bgDay = this.add.tileSprite(
            CAM_W / 2, CAM_H / 2,
            CAM_W, CAM_H,
            "bgDay"
        );
        this.bgDay.setTileScale(tileScale, tileScale);
        this.bgDay.tilePositionY = tileOffsetY;
        this.bgDay.setScrollFactor(0);
        this.bgDay.setDepth(-10);

        // NIGHT — layer trên, fade in
        this.bgNight = this.add.tileSprite(
            CAM_W / 2, CAM_H / 2,
            CAM_W, CAM_H,
            "bgNight"
        );
        this.bgNight.setTileScale(tileScale, tileScale);
        this.bgNight.tilePositionY = tileOffsetY;
        this.bgNight.setScrollFactor(0);
        this.bgNight.setDepth(-9);
        this.bgNight.setAlpha(0);

        // ─────────────────────────────────────────────
        // GROUND
        // G = 300 = đường horizon / mặt cỏ
        // Ground rectangle che phần dưới horizon
        // ─────────────────────────────────────────────
        const G       = 300;
        this.G        = G;
        const groundH = 100;   // đủ cao để che hết phần dưới canvas

        // Màu cỏ pixel day: #4a9e3f (lấy từ ảnh)
        // Khi night: ground sẽ được tint tối dần qua overlay
        this.ground = this.add.rectangle(
            400,
            G + groundH / 2,
            800,
            groundH,
            0x4a9e3f
        );
        this.physics.add.existing(this.ground, true);
        this.ground.body.reset(400, G + groundH / 2);

        // Ground night overlay (rectangle đen mờ đè lên để tối khi đêm)
        this.groundNightOverlay = this.add.rectangle(
            400,
            G + groundH / 2,
            800,
            groundH,
            0x0a1a2a,
            0
        ).setDepth(1);

        // ─────────────────────────────────────────────
        // PLAYER
        // ─────────────────────────────────────────────
        this.player = this.physics.add.sprite(120, G - 24, "player");
        this.player.setScale(3);
        this.player.setDepth(5);

        this.textures.get("player")
            .setFilter(Phaser.Textures.FilterMode.NEAREST);

        ["books","coffee","laptop","paper"].forEach(k =>
            this.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST)
        );

        this.player.body.setSize(10, 14);
        this.player.body.setOffset(3, 2);
        this.player.body.setCollideWorldBounds(false);
        this.player.body.setGravityY(800);

        this.physics.add.collider(this.player, this.ground);

        // ─────────────────────────────────────────────
        // ANIMATIONS
        // ─────────────────────────────────────────────
        this.anims.create({ key:"idle", frames:this.anims.generateFrameNumbers("player",{start:11,end:13}), frameRate:4,  repeat:-1 });
        this.anims.create({ key:"run",  frames:this.anims.generateFrameNumbers("player",{start:0, end:5}),  frameRate:10, repeat:-1 });
        this.anims.create({ key:"jump", frames:this.anims.generateFrameNumbers("player",{start:6, end:10}), frameRate:10, repeat:0  });
        this.anims.create({ key:"fall", frames:[{key:"player",frame:9}], frameRate:1, repeat:-1 });

        this.player.play("idle");

        // ─────────────────────────────────────────────
        // OBSTACLES / UI / INPUT
        // ─────────────────────────────────────────────
        this.obstacleList = [];
        this.hearts       = 3;
        this.distance     = 0;

        this.heartText = this.add.text(20, 20, "❤️❤️❤️", {
            fontSize:"24px"
        }).setDepth(10);

        this.distanceText = this.add.text(640, 20, "0 m", {
            fontSize:"24px"
        }).setDepth(10);

        this.canJump = true;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown-SPACE", this.handleJump, this);
        this.input.keyboard.on("keydown-UP",    this.handleJump, this);
        this.input.on("pointerdown", () => this.handleJump());

        this.createMobileButtons();

        // ─────────────────────────────────────────────
        // GAME STATE
        // ─────────────────────────────────────────────
        this.spawnCooldown     = 0;
        this.nextSpawnDistance = Phaser.Math.Between(180, 260);
        this.speed             = 4;
        this.bgScrollX         = 0;

        // ─────────────────────────────────────────────
        // START TEXT — pixel style
        // ─────────────────────────────────────────────
        this.startText = this.add.text(
            400, 160,
            "SPACE / TAP TO START",
            {
                fontFamily: "'Press Start 2P', monospace",
                fontSize: "12px",
                color: "#ffffff",
                backgroundColor: "#00000088",
                padding: { x:14, y:10 },
                align: "center"
            }
        )
        .setOrigin(0.5)
        .setDepth(10);
    }

    // ─────────────────────────────────────────────
    // MOBILE BUTTON
    // ─────────────────────────────────────────────
    createMobileButtons(){

        const btn = this.add.text(700, 355, "▲ JUMP", {
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "11px",
            backgroundColor: "#00000066",
            color: "#ffffff",
            padding: { x:14, y:10 }
        })
        .setOrigin(0.5)
        .setDepth(15)
        .setInteractive();

        btn.on("pointerdown", () => this.handleJump());
        btn.on("pointerover", () => btn.setStyle({ backgroundColor:"#000000aa" }));
        btn.on("pointerout",  () => btn.setStyle({ backgroundColor:"#00000066" }));
    }

    // ─────────────────────────────────────────────
    // JUMP
    // ─────────────────────────────────────────────
    handleJump(){

        if(this.isGameOver || this.isFinished) return;

        if(!this.gameStarted){
            this.gameStarted = true;
            if(this.startText) this.startText.destroy();
            this.player.play("run");
            return;
        }

        if(this.canJump && this.player.body.onFloor()){
            this.player.body.setVelocityY(-520);
            this.canJump = false;
        }
    }

    // ─────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────
    update(){

        if(!this.gameStarted || this.isGameOver || this.isFinished) return;

        // DISTANCE + SPEED
        this.distance += 0.1;
        this.distanceText.setText(Math.floor(this.distance) + " m");
        this.speed = 4 + this.distance * 0.01;

        // ── DAY / NIGHT CROSSFADE ──────────────────
        const TOTAL    = 250;
        const progress = Phaser.Math.Clamp(this.distance / TOTAL, 0, 1);
        const t        = progress * progress * (3 - 2 * progress); // smoothstep

        this.bgScrollX += this.speed * 0.15;
        this.bgDay.tilePositionX   = this.bgScrollX;
        this.bgNight.tilePositionX = this.bgScrollX;
        this.bgNight.setAlpha(t);

        // Ground tối dần theo đêm
        this.groundNightOverlay.setAlpha(t * 0.55);

        // ── SPAWN ──────────────────────────────────
        this.spawnCooldown++;
        if(this.spawnCooldown >= this.nextSpawnDistance){
            this.spawnCluster();
            this.spawnCooldown = 0;
            if(this.distance > 200)      this.nextSpawnDistance = Phaser.Math.Between(130, 180);
            else if(this.distance > 100) this.nextSpawnDistance = Phaser.Math.Between(150, 210);
            else                         this.nextSpawnDistance = Phaser.Math.Between(180, 260);
        }

        // ── MOVE OBSTACLES ─────────────────────────
        for(let i = this.obstacleList.length - 1; i >= 0; i--){
            const o = this.obstacleList[i];
            if(!o || !o.active){ this.obstacleList.splice(i,1); continue; }
            o.x -= this.speed;
            o.body.reset(o.x, o.y);
            if(o.x < -60){ o.destroy(); this.obstacleList.splice(i,1); }
        }

        // ── COLLISION ──────────────────────────────
        if(!this.isGameOver && !this.isFinished){
            const pb = this.player.body;
            for(let i = this.obstacleList.length - 1; i >= 0; i--){
                const o = this.obstacleList[i];
                if(!o || !o.active) continue;
                if(Phaser.Geom.Intersects.RectangleToRectangle(pb, o.body)){
                    this.handleHit(o);
                    this.obstacleList.splice(i,1);
                    break;
                }
            }
        }

        // ── JUMP RESET ─────────────────────────────
        if(this.player.body.onFloor()) this.canJump = true;

        // ── PLAYER ANIM ────────────────────────────
        if(!this.player.body.onFloor()){
            if(this.player.body.velocity.y < 0) this.player.play("jump", true);
            else                                this.player.play("fall", true);
        }else{
            if(this.player.anims.currentAnim?.key !== "run") this.player.play("run", true);
        }

        // ── FINISH ─────────────────────────────────
        if(this.distance >= 250 && !this.isFinished){
            this.isFinished = true;
            this.endGame();
        }
    }

    // ─────────────────────────────────────────────
    // SPAWN
    // ─────────────────────────────────────────────
    spawnCluster(){

        const list    = ["books","coffee","laptop","paper"];
        const count   = Phaser.Math.Between(1, 2);
        const spacing = Phaser.Math.Between(130, 180);

        for(let i = 0; i < count; i++){
            const type   = Phaser.Math.RND.pick(list);
            const spawnX = 820 + i * spacing;
            const spawnY = this.G - 16;

            const obs = this.physics.add.staticImage(spawnX, spawnY, type);
            obs.setScale(2);
            obs.refreshBody();
            obs.body.setSize(10, 12);
            obs.body.setOffset(3, 2);
            obs.refreshBody();
            obs.setDepth(4);

            this.obstacleList.push(obs);
        }
    }

    // ─────────────────────────────────────────────
    // HIT
    // ─────────────────────────────────────────────
    handleHit(obs){

        if(this.isGameOver || this.isFinished) return;

        obs.destroy();
        this.hearts--;
        this.heartText.setText("❤️".repeat(Math.max(0, this.hearts)));
        this.cameras.main.shake(150, 0.012);
        this.player.setTint(0xff4444);
        this.time.delayedCall(400, () => { if(this.player) this.player.clearTint(); });

        if(this.hearts <= 0) this.gameOver();
    }

    // ─────────────────────────────────────────────
    // GAME OVER
    // ─────────────────────────────────────────────
    gameOver(){

        this.isGameOver = true;
        this.physics.pause();

        // Panel pixel style
        this.add.rectangle(400, 200, 360, 220, 0x0a0a1a, 0.92).setDepth(20);
        this.add.rectangle(400, 200, 352, 212, 0x000000,    0).setDepth(20)
            .setStrokeStyle(2, 0x5865f2);

        this.add.text(400, 138, "GAME OVER", {
            fontFamily:"'Press Start 2P', monospace",
            fontSize:"18px",
            color:"#ff4757"
        }).setOrigin(0.5).setDepth(21);

        this.add.text(400, 178, `${Math.floor(this.distance)} m`, {
            fontFamily:"'Press Start 2P', monospace",
            fontSize:"22px",
            color:"#f7e03c"
        }).setOrigin(0.5).setDepth(21);

        this.add.text(400, 204, "DISTANCE", {
            fontFamily:"'Press Start 2P', monospace",
            fontSize:"7px",
            color:"#6a6a8a",
            letterSpacing: 2
        }).setOrigin(0.5).setDepth(21);

        const btn = this.add.text(400, 243, "▶  PLAY AGAIN", {
            fontFamily:"'Press Start 2P', monospace",
            fontSize:"10px",
            backgroundColor:"#f7e03c",
            color:"#0a0a0f",
            padding:{ x:18, y:11 }
        })
        .setOrigin(0.5).setDepth(21)
        .setInteractive({ cursor:"pointer" });

        btn.on("pointerover", () => btn.setStyle({ backgroundColor:"#ffe84a" }));
        btn.on("pointerout",  () => btn.setStyle({ backgroundColor:"#f7e03c" }));
        btn.on("pointerdown", () => this.scene.restart({ playerName:this.playerName }));
    }

    // ─────────────────────────────────────────────
    // END
    // ─────────────────────────────────────────────
    endGame(){
        this.scene.start("End",{
            name:     this.playerName,
            distance: Math.floor(this.distance)
        });
    }
}