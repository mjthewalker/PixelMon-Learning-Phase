class Scene2 extends Phaser.Scene{
    
    constructor(){
        super("playGame");
        
    }
    
    create(){
        this.count = 0;
        this.timer = 30;
        this.highestCount = this.loadCoinCount();
        console.log(this.highestCount);
        this.scene.launch("uiScene", { highestCount: this.highestCount });
        this.scene.get("uiScene").events.emit("updateCoins", this.count, this.highestCount);
        this.time.removeAllEvents();
        this.timerText = this.add.text(10, 10, `Time: ${this.timer}`, { fontSize: '18px', fill: '#ffffff' }).setScrollFactor(0);
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        const map = this.make.tilemap({key : 'map'})
        const tileset = map.addTilesetImage('6', 'tiles');
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        const layer2 = map.createLayer('grass', tileset, 0, 0);
        const layer3 = map.createLayer('trees', tileset, 0, 0);
        const imag = this.add.image(445,325,'house');
        imag.setScale(0.5)
        const imag2 = this.add.image(445,426,'house2');
        imag2.setScale(0.5)
        const imag3 = this.add.image(110,80,'house3');
        imag3.setScale(0.5)
        layer.setScale(0.5);
        layer2.setScale(0.5);
        layer3.setScale(0.5);
        layer2.setCollisionByExclusion([-1]);
        const player = this.player = this.physics.add.sprite(280,30, 'funa','walk-down-3.png');
        this.player.setScale(0.5);
        this.player.body.setSize(this.player.width = 22,this.player.height=25);
        this.physics.add.collider(this.player, layer2, this.handleCollision, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.startFollow(this.player); 
        this.cameras.main.setZoom(3.6);
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNames('coins', {
                prefix: 'coin_',
                start: 1,
                end: 40,
                suffix: '.png',
                zeroPad: 2  
            }),
            frameRate: 15, 
            repeat: -1    
        });
        this.coins = this.physics.add.group();
        this.placeCoinsOnLayer(layer,layer2,layer3);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.anims.create({
            key : 'faune-idle-down',
            frames : [{
                key : 'funa',
                frame : 'walk-down-3.png'
            }]
        });
        this.anims.create({
            key : 'faune-idle-up',
            frames : [{
                key : 'funa',
                frame : 'walk-up-3.png'
            }]
        });
        this.anims.create({
            key : 'faune-idle-side',
            frames : [{
                key : 'funa',
                frame : 'walk-side-3.png'
            }]
        });
        this.anims.create({
            key : 'faune-run-down',
            frames : this.anims.generateFrameNames('funa',{
                start : 1,
                end : 8,
                prefix : 'run-down-',
                suffix : '.png'
            }),
            repeat : -1
        });
        this.anims.create({
            key : 'faune-run-up',
            frames : this.anims.generateFrameNames('funa',{
                start : 1,
                end : 8,
                prefix : 'run-up-',
                suffix : '.png'
            }),
            repeat : -1
        });
        this.anims.create({
            key : 'faune-run-side',
            frames : this.anims.generateFrameNames('funa',{
                start : 1,
                end : 8,
                prefix : 'run-side-',
                suffix : '.png'
            }),
            repeat : -1
        });
        player.anims.play('faune-idle-side');
    }
    placeCoinsOnLayer(layer,layer2,layer3) {
        const numCoins = 50;
        const layerBounds = layer.getBounds();
        for (let i = 0; i < numCoins; i++) {
            let randomX, randomY;
            do {
                randomX = Phaser.Math.Between(layerBounds.left, layerBounds.right);
                randomY = Phaser.Math.Between(layerBounds.top, layerBounds.bottom);
            } while (this.isBlocked(randomX, randomY, layer2, layer3));
            const coin = this.coins.create(randomX, randomY, 'coins').play('spin');
            coin.setScale(0.1);
        }
    }
    isBlocked(x, y, layer2, layer3) {
        const tileX = layer2.worldToTileX(x);
        const tileY = layer2.worldToTileY(y);
        if (tileX < 0 || tileX >= 30 || tileY < 0 || tileY >= 30) {
            return true; 
        }
        const tile2 = layer2.getTileAt(tileX, tileY);
        const tile3 = layer3.getTileAt(tileX, tileY);
        return (tile2 && tile2.collides) || (tile3 && tile3.collides);
    }
    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.count++; 
        if (this.count > this.highestCount) {
            this.highestCount = this.count;
            this.saveHighestCoinCount(); 
        } 
        if (this.scene.isActive("uiScene")) {
            this.scene.get("uiScene").events.emit("updateCoins", this.count,this.highestCount);
        }
        console.log("Coin collected");
    }
    saveHighestCoinCount() {
        localStorage.setItem('highestCoins', this.highestCount); 
    }
    loadCoinCount() {
        const savedHighestCount = localStorage.getItem('highestCoins');  
        if (savedHighestCount !== null) {
            this.highestCount = savedHighestCount; 
        }
        return this.highestCount;
        
    }
    updateTimer() {
        this.timer--;
        this.events.emit("updateTimer", this.timer);
        if (this.timer <= 0) {
            this.timeUp();
        }
    }

    timeUp() {
        if (this.count > this.highestCount) {
            this.highestCount = this.count;
            this.saveHighestCoinCount();
        }
        this.scene.get('uiScene').events.off('updateCoins');
        this.scene.stop("uiScene");
        this.scene.start("endGame", { finalScore: this.count, highestScore: this.highestCount });
    }
    update() {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.anims.play('faune-run-side','true');
            this.player.scaleX = -0.5;
            this.player.body.offset.x=25;
        } else if (this.cursors.right.isDown) {
            this.player.anims.play('faune-run-side','true');
            this.player.setVelocityX(200);
            this.player.scaleX = 0.5;
            this.player.body.offset.x=3;
        }
        else if (this.cursors.up.isDown) {
            this.player.anims.play('faune-run-up','true');
            this.player.setVelocityY(-200);   
        }
         else if (this.cursors.down.isDown) {
            this.player.anims.play('faune-run-down','true');
            this.player.setVelocityY(200);
            this.player.body.offset.y=6;  
        }
        else{
            const parts = this.player.anims.currentAnim.key.split('-');
            parts[1]='idle';
            this.player.play(parts.join('-'));
        }


    }
    handleCollision(player, tile) {
   
        console.log("Collision detected with tile:", tile);

    }
    



   
    
}