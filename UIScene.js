    class UIScene extends Phaser.Scene {
        constructor() {
            super({ key: 'uiScene' });
        }
        init(data) {
            this.initialHighestCount = data.highestCount || 0;
            console.log("Received highestCount in UIScene:", this.initialHighestCount); 
        }

        create() { 
            
            this.countText = this.add.text(10, 10, 'Coins: 0', {
                fontSize: '32px',
                fill: '#ff2'
            });
            this.count1Text = this.add.text(10, 40, `Highest Count: ${this.initialHighestCount}`, {
                fontSize: '32px',
                fill: '#ff2'
            });
            this.timerText = this.add.text(10, 80, 'Time: 30', {
                fontSize: '32px',
                fill: '#ff2'
            }).setScrollFactor(0);
            this.scene.get('playGame').events.on('updateTimer', (timer) => {
                this.timerText.setText(`Time: ${timer}`);
            });
         
            this.events.on('updateCoins', (count,highestCount) => {
                this.countText.setText('Coins: ' + count);
                this.count1Text.setText('Highest Count : ' + highestCount);
            });
            
        }
    }
