
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var background;
var button = [];
var player;
var leaderboard;
var buttonback;

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
        /*game.load.spritesheet('shopbutton', '/assets/sprites/main_buttons_shop.png', 300, 100);
        game.load.spritesheet('gamebutton', '/assets/sprites/main_buttons_play.png', 300, 100);*/
        game.load.spritesheet('shopbutton', '/assets/sprites/main_button_shop.png', 345, 70);
        game.load.spritesheet('gamebutton', '/assets/sprites/main_button_play.png', 345, 70);
        
    },
    create: function () {
		background = game.add.sprite(0, 0, 'menubackground');
		
		/*Leaderboard Info*/
        
        leaderboard = game.add.graphics(0,0);
        leaderboard.beginFill(0xff0000);
        leaderboard.drawRect(game.world.centerX + 200,game.world.centerY - 50, game.world.centerX - 230,game.world.centerY + 20);
        leaderboard.alpha = 0.5;
        leaderboard.endFill();
        
        $.get("/users/getLeaderBoard")
        
        
        /**********************************************/
        /*Player Info*/
        
        player = game.add.graphics(0,0);
        player.beginFill(0x1eaac2);
        player.drawRect(0 ,0 , game.width ,80);
        player.alpha = 0.8;
        player.endFill();
        
        
        /**********************************************/
        
        buttonback = game.add.graphics(0,0);
        buttonback.beginFill(0x000000);
        buttonback.drawRect(0, 390, 455, 170);
        buttonback.alpha = 0.7;
        buttonback.endFill();
        
        buttongroup = game.add.group();
        
        button[0] = game.add.button(100 , 400, 'shopbutton', function(){
            console.log('Redirecting to shop...');
            location.href += 'shop';
        }, this, 0, 1, 2);
        button[1] = game.add.button(100 , 480, 'gamebutton', function(){
            console.log('Redirecting to game...');
            location.href += 'game';
        }, this, 0, 1, 2);
        
        
        /*button[0].scale.setTo(0.5);
        button[1].scale.setTo(0.5);*/
        
        buttongroup.add(button[0]);
        buttongroup.add(button[1]);
        
        buttongroup.scale.setTo(1);
        /*********************************************/
    },
    update: function (){

    },
    render: function (){

    }

};
function actionOnClick(){
    location.href = location.href+'game';
    /*console.log(location.href);*/
}

game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('gameState', gameState);

game.state.start('bootState');

