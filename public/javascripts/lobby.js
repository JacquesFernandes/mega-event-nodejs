
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var background;
var readybutton;

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
		game.state.start('lobbyState');
    }

};

var lobbyState = function () {
    console.log('Starting game..');
};

lobbyState.prototype = {

    preload: function () {
        game.stage.backgroundColor = '#000033';
        game.load.spritesheet('gamebutton', '/assets/sprites/main_button_play.png', 345, 70);
    },
    create: function () {
		readybutton = game.add.button(0, 0, 'gamebutton', function(){
            console.log('Readying up ...');
            $.post('lobby/ready/',{
                
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 2);
    },
    update: function (){

    },
    render: function (){

    }

};


game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('lobbyState', lobbyState);

game.state.start('bootState');

