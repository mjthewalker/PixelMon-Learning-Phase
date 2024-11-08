class EndScene extends Phaser.Scene {
    constructor() {
        super("endGame");
    }

    init(data) {
    
        this.finalScore = data.finalScore || 0;
        this.highestScore = data.highestScore || 0;
    }

    create() {

        let width = 960;
        let height = 850;
        this.add.text(width / 2, height / 2 - 100, "Game Over", {
            fontSize: '32px',
            fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 40, `Your Score: ${this.finalScore}`, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

       
        this.add.text(width / 2, height / 2, `Highest Score: ${this.highestScore}`, {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 + 80, "Press Space to Restart Game", {
            fontSize: '20px',
            fill: '#00ff00'
        }).setOrigin(0.5);
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start("playGame");
        });

        

    }
}
