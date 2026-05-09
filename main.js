import BootScene from "./scenes/BootScene.js";
import StartScene from "./scenes/StartScene.js";
import GameScene from "./scenes/GameScene.js";
import EndScene from "./scenes/EndScene.js";

const config = {

    type: Phaser.AUTO,

    width: 800,
    height: 400,

    physics:{
        default:"arcade",
        arcade:{
            gravity:{ y:900 },
            debug:false
        }
    },

    scale:{
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene:[
        BootScene,
        StartScene,
        GameScene,
        EndScene
    ]
};
new Phaser.Game(config);