
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var sidebar;
var ship;
var tier = [];

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
		game.state.start('shopState');
    }

};

var shopState = function () {
    console.log('Starting game..');
};

shopState.prototype = {

    preload: function () {
		game.load.image('ship', '/assets/images/ship.png');
        game.load.image('sidebar', '/assets/images/background.png')
    },
    create: function () {
		/*background = game.add.sprite(0,0,'background');*/
        sidebar = game.add.sprite(game.world.centerX,0,'sidebar')
        ship = game.add.sprite(game.world.centerX/2,game.world.centerY,'ship');
        
        /*Global anchor point*/
        ship.anchor.setTo(0.5);
        ship.scale.setTo(0.5,0.5); //Scaling images in phaser
        
        //Title Shop
        var heading = game.add.text(game.world.centerX*3/2,50, 'Customization', {font: '30px Georgia', fill: '#fff'});
        heading.anchor.setTo(0.5);
        
        tier[0] = game.add.text(game.world.centerX + 100,150, 'Tier 0', {font: '20px Georgia', fill: '#fff'});
        tier[1] = game.add.text(game.world.centerX + 100,250, 'Tier 1', {font: '20px Georgia', fill: '#fff'});
        tier[2] = game.add.text(game.world.centerX + 100,350, 'Tier 2', {font: '20px Georgia', fill: '#fff'});
        tier[3] = game.add.text(game.world.centerX + 100,450, 'Tier 3', {font: '20px Georgia', fill: '#fff'});
    },
    update: function (){
		ship.angle -= 0.2;
    },
    render: function (){

    }

};

game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('shopState', shopState);

game.state.start('bootState');

