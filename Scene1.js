class Scene1 extends Phaser.Scene{
    constructor(){
        super("bootGame");
    }
    preload(){
       
        this.load.image('tiles','assets/tileset.png');
        this.load.image('house','assets/house.png');
        this.load.image('house2','assets/house2.png');
        this.load.image('house3','assets/house3.png');
        this.load.tilemapTiledJSON("map","assets/map1..tmj");
        this.load.image('player', 'assets/ship.png');
        this.load.atlas('funa','assets/fauna.png','assets/fauna.json');
        this.load.atlasXML('coins', 'assets/COINS/Spritesheet/spritesheet_coins.png', 'assets/COINS/Spritesheet/spritesheet_coins.xml');




    
    }
    create(){
        this.add.text(450, 400, "Collect Coins Game", { fontSize: '32px', fill: '#ff2' }).setOrigin(0.5);
        this.add.text(450, 500, "Press Space to Start", { fontSize: '24px', fill: '#ff0000' }).setOrigin(0.5);
        this.add.text(450, 600, "You have 30s to collect all the coins!!!", { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("playGame"); 
        });
        
    }
}