
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;

var tilesprite;
var cursors;

var player;
var enemy;

var player_light_bullets_group;
var player_sniper_bullets_group;
var player_heavy_bullets_group;

var weapon = 'light';
var weapon_selection_text;
var weapon_status_text;

var weapon_key_light;
var weapon_key_sniper;
var weapon_key_one_heavy;

var fire_rate_light = 500;
var fire_rate_heavy = 1500;
var fire_rate_sniepr = 3000; 

var next_fire_light = 0;
var next_fire_heavy = 0;
var next_fire_sniper = 0;

var player_username = 'mit17k';
var enemy_username = 'enemy';

PLAYER_SHIP = function (game, username, cursors) {
    
    this.game = game;
    this.username = username;
    this.cursors = cursors;
    
    this.ship = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'player_space_ship');
    this.ship.scale.setTo(0.5, 0.5);
    this.ship.anchor.setTo(0.5, 0.5);

    this.weapon_point_light_x = Math.floor(this.ship.x) + 60;
    this.weapon_point_light_y = Math.floor(this.ship.y) - 5;

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    
    this.ship.body.collideWorldBounds = true;
    this.ship.body.drag.set(100);
    this.ship.body.maxVelocity.set(400);

    this.game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

};

PLAYER_SHIP.prototype.update = function () {

    if(this.cursors.up.isDown){
        this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 400, this.ship.body.acceleration);
    }
    else{
        this.ship.body.acceleration.set(0);
    }

    if(this.cursors.left.isDown){
        
        this.ship.body.angularVelocity = -200;
        
        var new_pos_x = Math.floor(this.ship.x) + ((this.weapon_point_light_x - Math.floor(this.ship.x)) * Math.cos(this.game.math.degToRad(Math.floor(this.ship.angle)))) - ((this.weapon_point_light_y - Math.floor(this.ship.y)) * Math.sin(this.game.math.degToRad(Math.floor(this.ship.angle)))); 
        var new_pos_y = Math.floor(this.ship.y) + ((this.weapon_point_light_x - Math.floor(this.ship.x)) * Math.sin(this.game.math.degToRad(Math.floor(this.ship.angle)))) + ((this.weapon_point_light_y - Math.floor(this.ship.y)) * Math.cos(this.game.math.degToRad(Math.floor(this.ship.angle)))); 

        this.weapon_point_light_x = new_pos_x;
        this.weapon_point_light_y = new_pos_y;

    }
    else if(this.cursors.right.isDown){
        
        this.ship.body.angularVelocity = 200;
        
        var new_pos_x = Math.floor(this.ship.x) + ((this.weapon_point_light_x - Math.floor(this.ship.x)) * Math.cos(this.game.math.degToRad(Math.floor(this.ship.angle)))) - ((this.weapon_point_light_y - Math.floor(this.ship.y)) * Math.sin(this.game.math.degToRad(Math.floor(this.ship.angle)))); 
        var new_pos_y = Math.floor(this.ship.y) + ((this.weapon_point_light_x - Math.floor(this.ship.x)) * Math.sin(this.game.math.degToRad(Math.floor(this.ship.angle)))) + ((this.weapon_point_light_y - Math.floor(this.ship.y)) * Math.cos(this.game.math.degToRad(Math.floor(this.ship.angle)))); 

        this.weapon_point_light_x = new_pos_x;
        this.weapon_point_light_y = new_pos_y;

    }
    else{
        this.ship.body.angularVelocity = 0;
    }

}; 

ENEMY_SHIP = function (game, username) {

    this.game = game;
    this.username = username;
    
    this.ship = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'enemy_space_ship');
    this.ship.scale.setTo(0.5, 0.5);
    this.ship.anchor.setTo(0.5, 0.5);

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        
    this.ship.body.collideWorldBounds = true;
    this.ship.body.drag.set(100);
    this.ship.body.maxVelocity.set(400);

};

ENEMY_SHIP.prototype.update = function () {

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 400, this.ship.body.acceleration);
    }
    else{
        this.ship.body.acceleration.set(0);
    }

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.A)){
    
        this.ship.body.angularVelocity = -200;

    }
    else if(this.game.input.keyboard.isDown(Phaser.Keyboard.D)){
        
        this.ship.body.angularVelocity = 200;
    }
    else{
        this.ship.body.angularVelocity = 0;
    }

};

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

        game.load.image('space', '/assets/sprites/space.png');
        game.load.image('player_space_ship', '/assets/sprites/shipred.png');
        game.load.image('enemy_space_ship', '/assets/sprites/shipblue.png');
        game.load.image('bullet', '/assets/sprites/bullet.png');

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
        loading.kill();
    },

    create: function () {

        // game.world.resize(1920, 1920);
        // game.world.setBounds(0, 0, 1920, 1920);

        game.physics.startSystem(Phaser.Physics.ARCADE);

        tilesprite = game.add.tileSprite(0, 0, 1280, 720, 'space');
        cursors = game.input.keyboard.createCursorKeys();
        
        player = new PLAYER_SHIP(game, player_username, cursors);
        enemy = new ENEMY_SHIP(game, enemy_username);

        player_light_bullets_group = game.add.group();
        player_light_bullets_group.enableBody = true;
        player_light_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

        player_light_bullets_group.createMultiple(50, 'bullet');
        player_light_bullets_group.setAll('checkWorldBounds', true);
        player_light_bullets_group.setAll('outOfBoundsKill', true);

        player_sniper_bullets_group = game.add.group();
        player_sniper_bullets_group.enableBody = true;
        player_sniper_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

        player_sniper_bullets_group.createMultiple(50, 'bullet');
        player_sniper_bullets_group.setAll('checkWorldBounds', true);
        player_sniper_bullets_group.setAll('outOfBoundsKill', true);

        player_heavy_bullets_group = game.add.group();
        player_heavy_bullets_group.enableBody = true;
        player_heavy_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

        player_heavy_bullets_group.createMultiple(50, 'bullet');
        player_heavy_bullets_group.setAll('checkWorldBounds', true);
        player_heavy_bullets_group.setAll('outOfBoundsKill', true);

        game.input.onDown.add(fireBullet, this);

        weapon_key_light = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        weapon_key_light.onDown.add(changeWeaponToLight, this);

        weapon_key_sniper = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        weapon_key_sniper.onDown.add(changeWeaponToSniper, this);

        weapon_key_heavy = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        weapon_key_heavy.onDown.add(changeWeaponToHeavy, this);

        weapon_selection_text = game.add.text(50, 50, 'Selected Weapon: Light', {
            font: "28px Arial", fill: "#ffffff", align: "center" 
        });

        weapon_selection_text.fixedToCamera = true;
        weapon_selection_text.cameraOffset.setTo(50, 50);

        weapon_status_text = game.add.text(50, 100, 'Weapon Status: Ready', {
            font: "28px Arial", fill: "#ffffff", align: "center" 
        });

        weapon_status_text.fixedToCamera = true;
        weapon_status_text.cameraOffset.setTo(50, 100);

    },
    update: function (){

        game.physics.arcade.collide(player.ship, enemy.ship);

        player.update();
        enemy.update();

        if(weapon === 'light'){
            weapon_selection_text.setText('Selected Weapon: Light');
            if(game.time.now > next_fire_light){
                weapon_status_text.setText('Weapon Status: Ready');
            }
            else{
                weapon_status_text.setText('Weapon Status: Not Ready');
            }
        }
        else if(weapon === 'heavy'){
            weapon_selection_text.setText('Selected Weapon: Heavy');
            if(game.time.now > next_fire_heavy){
                weapon_status_text.setText('Weapon Status: Ready');
            }
            else{
                weapon_status_text.setText('Weapon Status: Not Ready');
            }
        }
        else if(weapon === 'sniper'){
            weapon_selection_text.setText('Selected Weapon: Sniper');
            if(game.time.now > next_fire_sniper){
                weapon_status_text.setText('Weapon Status: Ready');
            }
            else{
                weapon_status_text.setText('Weapon Status: Not Ready');
            }
        }

    },
    render: function (){
        game.context.fillStyle = 'rgb(255,255,0)';
        game.context.fillRect(player.weapon_point_light_x, player.weapon_point_light_y, 4, 4);
    }

};

function fireBullet() {

    if(game.time.now > next_fire_sniper && player_light_bullets_group.countDead() > 0){
        
        next_fire_sniper = game.time.now + next_fire_light;

        var bullet = player_light_bullets_group.getFirstDead();
        //bullet.reset(weapon_point_light.x, weapon_point_light.y);
        //bullet.angle = player.ship.angle;

        //game.physics.arcade.moveToAngle(player.ship.angle, 300);

    }

}

function changeWeaponToLight() {
    weapon = 'light';
}

function changeWeaponToHeavy() {
    weapon = 'heavy';
}

function changeWeaponToSniper() {
    weapon = 'sniper';
}

game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('gameState', gameState);

game.state.start('bootState');
