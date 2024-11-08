var config = {
    width : 960,
    height : 850,
    backgroundColor :  0x000000,
    physics : {
        default : 'arcade',
        arcade :{
            gravity : {y:0},
            //debug : true
        }
    },
    scene : [Scene1,Scene2,UIScene,EndScene]

}
window.onload = function(){
    var game = new Phaser.Game(config);
    
}