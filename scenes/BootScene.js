export default class BootScene extends Phaser.Scene {

    constructor(){
        super("Boot");
    }

  preload(){

    this.load.spritesheet(
        "player",
        "assets/player.png",
        {
            frameWidth: 16,
            frameHeight: 16
        }
    );
    this.load.spritesheet(
        "obstacles",
        "assets/obstacles.png",
        {
            frameWidth: 16,
            frameHeight: 16
        }
    );

}


    create(){

        this.scene.start("Start");
    }
}