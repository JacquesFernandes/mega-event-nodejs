
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;

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

    }

};

var gameState = function () {
    console.log('Starting game..');
};

gameState.prototype = {

    preload: function () {

    },
    create: function () {

    },
    update: function (){

    },
    render: function (){

    }

};

game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('gameState', gameState);

game.state.start('bootState');

