
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;

var tilesprite;
var cursors;

var player;
var enemy;

//var astroid_group = [];

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
var fire_rate_sniper = 3000; 

var next_fire_light = 0;
var next_fire_heavy = 0;
var next_fire_sniper = 0;

var player_username = 'mit17k';
var enemy_username = 'enemy';

// var positions = [
//     {
//         'x': 300,
//         'y': 100
//     },
//     {
//         'x': 800,
//         'y': 400
//     },
//     {
//         'x': 50,
//         'y': 400
//     }
// ];

PLAYER_SHIP = function (game, username, cursors) {
    
    this.game = game;
    this.username = username;
    this.cursors = cursors;
    
    this.ship = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'space_ship');
    this.ship.scale.setTo(0.5, 0.5);
    this.ship.anchor.setTo(0.5, 0.5);

    this.ship.animations.add('moveforward', [1, 2]);;

    this.weapon_point_sniper = this.ship.addChild(this.game.make.sprite(150, -2, null));
    this.shoot_path_sniper_point = this.ship.addChild(this.game.make.sprite(200, -2, null));

    this.weapon_point_heavy_up = this.ship.addChild(this.game.make.sprite(50, 25, null));
    this.shoot_path_heavy_up_point = this.ship.addChild(this.game.make.sprite(100, 25, null));

    this.weapon_point_heavy_down = this.ship.addChild(this.game.make.sprite(50, -25, null));
    this.shoot_path_heavy_down_point = this.ship.addChild(this.game.make.sprite(100, -25, null));

    this.weapon_point_light_up = this.ship.addChild(this.game.make.sprite(50, 45, null));
    this.shoot_path_light_up_point = this.ship.addChild(this.game.make.sprite(100, 45, null));

    this.weapon_point_light_down = this.ship.addChild(this.game.make.sprite(50, -45, null));
    this.shoot_path_light_down_point = this.ship.addChild(this.game.make.sprite(100, -45, null));

    this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);

    this.ship.body.collideWorldBounds = true;
    this.ship.body.drag.set(100);
    this.ship.body.maxVelocity.set(400);

    this.game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

};

PLAYER_SHIP.prototype.update = function () {

    if(this.game.input.keyboard.isDown(Phaser.Keyboard.W)){
        this.game.physics.arcade.accelerationFromRotation(this.ship.rotation, 400, this.ship.body.acceleration);
        this.ship.frame = 2;
    }
    else{
        this.ship.body.acceleration.set(0);
        this.ship.frame = 1;
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

    if(this.ship.body.velocity.x === 0 && this.ship.body.velocity.y === 0){
        this.ship.frame = 0;
    }

};

PLAYER_SHIP.prototype.destroy = function (){

    this.explostion = this.game.add.sprite(this.ship.x, this.ship.y, 'explosion');
    this.explostion.anchor.setTo(0.5, 0.5);
    this.explostion.scale.setTo(1.2, 1.2);
    
    this.ship.kill();

    this.explostion.animations.add('explode')
    this.explostion.animations.play('explode', 30 , false);
    this.explostion.events.onAnimationComplete.add(function (){
        //
    });

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
        game.load.image('astroid', '/assets/sprites/astroid.png');

        game.load.spritesheet('space_ship', '/assets/spritesheet/shipsheet.png', 450, 350, 14);
        game.load.spritesheet('explosion', 'assets/spritesheet/explosion.png', 64, 64);

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
        
        //enemy = new ENEMY_SHIP(game, enemy_username);
        
        // for(var i = 0 ; i < 3 ; i++){
        //     var astroid = game.add.sprite(positions[i].x, positions[i].y, 'astroid');
            
        //     astroid.anchor.setTo(0.5, 0.5);
        //     astroid.scale.setTo(0.5, 0.5);
            
        //     game.physics.enable(astroid, Phaser.Physics.ARCADE);
            
        //     astroid.body.immovable = true;
        //     astroid.body.moves = false;
            
        //     astroid_group.push(astroid);
        // }

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

        //game.physics.arcade.collide(player.ship, enemy.ship);
        // for(var i = 0 ; i < 3 ; i++){
        //     game.physics.arcade.collide(player.ship, astroid_group[i], function () {
        //         player.destroy();
        //     });
        // }

        player.update();
        //enemy.update();

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
        //
    }

};

function fireBullet() {

    if(weapon === 'light'){
        
        if(game.time.now > next_fire_light && player_light_bullets_group.countDead() > 0){
        
            next_fire_light = game.time.now + fire_rate_light;
            
            var bullet1 = player_light_bullets_group.getFirstDead();
            bullet1.reset(player.weapon_point_light_up.world.x, player.weapon_point_light_up.world.y);
            bullet1.angle = player.ship.angle;

            var bullet2 = player_light_bullets_group.getFirstDead();
            bullet2.reset(player.weapon_point_light_down.world.x, player.weapon_point_light_down.world.y);
            bullet2.angle = player.ship.angle;

            game.physics.arcade.moveToXY(bullet1, player.shoot_path_light_up_point.world.x, player.shoot_path_light_up_point.world.y, 500);
            game.physics.arcade.moveToXY(bullet2, player.shoot_path_light_down_point.world.x, player.shoot_path_light_down_point.world.y, 500);

        }

    }
    else if(weapon === 'heavy'){

        if(game.time.now > next_fire_heavy && player_heavy_bullets_group.countDead() > 0){
        
            next_fire_heavy = game.time.now + fire_rate_heavy;

            var bullet1 = player_heavy_bullets_group.getFirstDead();
            bullet1.reset(player.weapon_point_heavy_up.world.x, player.weapon_point_heavy_up.world.y);
            bullet1.angle = player.ship.angle;

            var bullet2 = player_heavy_bullets_group.getFirstDead();
            bullet2.reset(player.weapon_point_heavy_down.world.x, player.weapon_point_heavy_down.world.y);
            bullet2.angle = player.ship.angle;

            game.physics.arcade.moveToXY(bullet1, player.shoot_path_heavy_up_point.world.x, player.shoot_path_heavy_up_point.world.y, 550);
            game.physics.arcade.moveToXY(bullet2, player.shoot_path_heavy_down_point.world.x, player.shoot_path_heavy_down_point.world.y, 550);

        }

    }
    else if(weapon === 'sniper'){

        if(game.time.now > next_fire_sniper && player_sniper_bullets_group.countDead() > 0){
        
            next_fire_sniper = game.time.now + fire_rate_sniper;

            var bullet = player_sniper_bullets_group.getFirstDead();
            bullet.reset(player.weapon_point_sniper.world.x, player.weapon_point_sniper.world.y);
            bullet.angle = player.ship.angle;

            game.physics.arcade.moveToXY(bullet, player.shoot_path_sniper_point.world.x, player.shoot_path_sniper_point.world.y, 600);

        }

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
