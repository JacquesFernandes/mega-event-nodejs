
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var sidebar;
var ship;
var button = [];
var buttongroup;

var ajaxRequest;

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
		game.load.image('ship', '/assets/sprites/ship.png');
        game.load.image('sidebar', '/assets/images/shopback.jpeg');
        game.load.spritesheet('lightbutton', '/assets/sprites/tier_button_light.png', 300, 100);
        game.load.spritesheet('heavybutton', '/assets/sprites/tier_button_heavy.png', 300, 100);
        game.load.spritesheet('sniperbutton', '/assets/sprites/tier_button_sniper.png', 300, 100);
    },
    create: function () {
        game.stage.backgroundColor = '#000033';
        
		/*background = game.add.sprite(0,0,'background');*/
        sidebar = game.add.sprite(game.world.centerX*1.5,game.world.centerY,'sidebar')
        ship = game.add.sprite(game.world.centerX/2,game.world.centerY,'ship');
        
        sidebar.anchor.setTo(0.5);
        sidebar.angle = 90;
        sidebar.scale.setTo(1.4);
        /*Global anchor point*/
        ship.anchor.setTo(0.5);
        ship.scale.setTo(1); //Scaling images in phaser
        
        //Title Shop
        var heading = game.add.text(game.world.centerX*3/2,50, 'Customization', {font: '30px Georgia', fill: '#fff'});
        heading.anchor.setTo(0.5);
        
        game.add.text(game.world.centerX + 100,150, 'Tier 0', {font: '20px Georgia', fill: '#fff'});
        game.add.text(game.world.centerX + 100,250, 'Tier 1', {font: '20px Georgia', fill: '#fff'});
        game.add.text(game.world.centerX + 100,350, 'Tier 2', {font: '20px Georgia', fill: '#fff'});
        game.add.text(game.world.centerX + 100,450, 'Tier 3', {font: '20px Georgia', fill: '#fff'});
        
        buttongroup = game.add.group();
        /*Buttons of Tiers*/
        //Tier 0
        button[0] = game.add.button(game.world.centerX *2 + 200, 350, 'lightbutton', function(){
            console.log('Tier 0 light');
            $.post('/t0/light',{
                tier: 't0',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[1] = game.add.button(game.world.centerX *2 + 500 , 350, 'heavybutton', function(){
            console.log('Tier 0 heavy');
            $.post('/t0/heavy',{
                tier: 't0',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[2] = game.add.button(game.world.centerX *2 + 800 , 350, 'sniperbutton', function(){
            console.log('Tier 0 sniper');
            $.post('/t0/sniper',{
                tier: 't0',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier 1
        button[3] = game.add.button(game.world.centerX *2 + 200, 550, 'lightbutton', function(){
            console.log('Tier 1 light');
            $.post('/t0/light',{
                tier: 't0',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[4] = game.add.button(game.world.centerX *2 + 500 , 550, 'heavybutton', function(){
            console.log('Tier 1 heavy');
            $.post('/t0/heavy',{
                tier: 't0',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[5] = game.add.button(game.world.centerX *2 + 800 , 550, 'sniperbutton', function(){
            console.log('Tier 1 sniper');
            $.post('/t0/sniper',{
                tier: 't0',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier 2
        button[6] = game.add.button(game.world.centerX *2 + 200, 750, 'lightbutton', function(){
            console.log('Tier 2 light');
            $.post('/t0/light',{
                tier: 't0',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[7] = game.add.button(game.world.centerX *2 + 500 , 750, 'heavybutton', function(){
            console.log('Tier 2 heavy');
            $.post('/t0/heavy',{
                tier: 't0',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[8] = game.add.button(game.world.centerX *2 + 800 , 750, 'sniperbutton', function(){
            console.log('Tier 2 sniper');
            $.post('/t0/sniper',{
                tier: 't0',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier 3
        button[9] = game.add.button(game.world.centerX *2 + 200, 950, 'lightbutton', function(){
            console.log('Tier 3 light');
            $.post('/t0/light',{
                tier: 't0',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[10] = game.add.button(game.world.centerX *2 + 500 , 950, 'heavybutton', function(){
            console.log('Tier 3 heavy');
            $.post('/t0/heavy',{
                tier: 't0',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[11] = game.add.button(game.world.centerX *2 + 800 , 950, 'sniperbutton', function(){
            console.log('Tier 3 sniper');
            $.post('/t0/sniper',{
                tier: 't0',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        
        /*Ajax format*/
        /* /shop/tier(t0 --> t3)/class (light/ heavy/ sniper)*/
        
        
        /***************************/
        
        buttongroup.add(button[0]);
        buttongroup.add(button[1]);
        buttongroup.add(button[2]);
        buttongroup.add(button[3]);
        buttongroup.add(button[4]);
        buttongroup.add(button[5]);
        buttongroup.add(button[6]);
        buttongroup.add(button[7]);
        buttongroup.add(button[8]);
        buttongroup.add(button[9]);
        buttongroup.add(button[10]);
        buttongroup.add(button[11]);
        
        buttongroup.scale.setTo(0.5);
        
    },
    update: function (){
		/*ship.angle -= 0.2;*/
    },
    render: function (){

    }

};



game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('shopState', shopState);

game.state.start('bootState');

