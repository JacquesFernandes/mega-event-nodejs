
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var background;
var button = [];
var player;
var leaderboard;

var bootState = function () {
    console.log('Booting phaser...');
};

bootState.prototype = {

    preload: function () {
        game.load.image('loading', 'assets/sprites/loading.png');
    },
    create: function () {
        
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        game.time.desiredFps = 60;
        game.stage.disableVisibilityChange = true;

        game.input.mouse.capture = true;
        
        game.state.start('preloadState');
    }

};


var preloadState = function () {
    console.log('Preloading assets...');
};

preloadState.prototype = {

    preload: function () {
        loading = game.add.sprite(700, 300, 'loading');
        loading.anchor.setTo(0.5, 0.5);
    },
    create: function () {
		game.state.start('gameState');
    }

};

var gameState = function () {
    console.log('Starting game..');
};

gameState.prototype = {

    preload: function () {
		game.load.image('menubackground', '/assets/images/menubackground.jpg');
        game.load.spritesheet('buttons', '/assets/images/button2.png', 540, 200);
    },
    create: function () {
		background = game.add.sprite(0, 0, 'menubackground');
		
		/*Leaderboard Info*/
        
        leaderboard = game.add.graphics(0,0);
        leaderboard.beginFill(0xff0000);
        leaderboard.drawRect(game.world.centerX + 200,game.world.centerY - 50, game.world.centerX - 230,game.world.centerY + 20);
        leaderboard.alpha = 0.5;
        leaderboard.endFill();
        
        
        /**********************************************/
        /*Player Info*/
        
        player = game.add.graphics(0,0);
        player.beginFill(0x1eaac2);
        player.drawRect(0 ,0 , game.width ,80);
        player.alpha = 0.8;
        player.endFill();
        
        
        /**********************************************/
        buttongroup = game.add.group();
        
        button[0] = game.add.button(200 , 600, 'buttons', actionOnClick, this, 1, 0, 2);
        button[1] = game.add.button(200 , 800, 'buttons', actionOnClick, this, 1, 0, 2);
        
        
        /*button[0].scale.setTo(0.5);
        button[1].scale.setTo(0.5);*/
        
        buttongroup.add(button[0]);
        buttongroup.add(button[1]);
        
        buttongroup.scale.setTo(0.5);
        /*********************************************/
    },
    update: function (){

    },
    render: function (){

    }

};
function actionOnClick(){
    console.log('Clicked!');
}

game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('gameState', gameState);

game.state.start('bootState');

