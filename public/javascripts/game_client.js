var socket = io();

socket.on('connect', function() {
    socket.emit('idupdate', { 'type': 'client', 'id': socket.io.engine.id });
});

var player_username;
var enemy_username;

var player_hp = 100;
var enemy_hp = 100;

var player_current_hp = 100;
var enemy_current_hp = 100;

$.ajax({
    url: '/game/new_game',
    type: 'POST',
    dataType: 'json',
    success: function (response){

        player_username = response.client_name;
        enemy_username = response.host_name;

        init();

    }
});

function init(){

    var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

    var loading;

    var tilesprite;
    var cursors;

    var player;
    var enemy;

    var player_spawn_x = 500;
    var player_spawn_y = 200;

    var enemy_spawn_x = 200;
    var enemy_spawn_y = 500;

    var player_currentX = player_spawn_x;
    var player_currentY = player_spawn_y;
    var player_currentAngle = 0;

    var enemy_currentX = enemy_spawn_x;
    var enemy_currentY = enemy_spawn_y;
    var enemy_currentAngle = 0;

    var input_info = { 'input_up': false, 'input_left': false, 'input_right': false };
    var enemy_input_info = { 'input_up': false, 'input_left': false, 'input_right': false };

    var player_light_bullets_group;
    var player_sniper_bullets_group;
    var player_heavy_bullets_group;

    var enemy_light_bullets_group;
    var enemy_sniper_bullets_group;
    var enemy_heavy_bullets_group;

    var weapon = 'light';

    var weapon_key_light;
    var weapon_key_sniper;
    var weapon_key_one_heavy;
    var weapon_shoot_key;

    var towersprite;

    var player_tower_health = 1000;
    var enemy_tower_health = 1000;

    var isPlayerAlive = true;
    var isEnemyAlive = true;

    var player_next_respawn_time = 0;
    var enemy_next_respawn_time = 0;
    
    var fire_rate_light = 500;
    var fire_rate_heavy = 1500;
    var fire_rate_sniper = 3000; 

    var next_fire_light = 0;
    var next_fire_heavy = 0;
    var next_fire_sniper = 0;

    var redhud;
    var bluehud;
    var player_healthbar;
    var enemy_healthbar;
    
    var loadout_sniper;
    var loadout_light;
    var loadout_heavy;

    var isSniperReady = true;
    var isHeavyReady = true;
    var isLightReady = true;

    var backgound_music;
    var sniper_shoot_music;
    var heavy_shoot_music;
    var light_shoot_music;

    var startGame = true;

    PLAYER_SHIP = function (game, username, x, y) {
        
        this.game = game;
        this.username = username;
        this.x = x;
        this.y = y;
        
        this.ship = this.game.add.sprite(this.x, this.y, 'player_space_ship');
        this.ship.scale.setTo(0.5, 0.5);
        this.ship.anchor.setTo(0.5, 0.5);

        this.input_up = false;
        this.input_left = false;
        this.input_right = false;

        this.ship.animations.add('moveforward', [3, 4, 5]);

        this.ship.animations.add('rotateright', [6, 7, 8]);
        this.ship.animations.add('rotateleft', [9, 10, 11]);

        this.ship.animations.add('moveforwardrotateleft', [12, 13, 14]);
        this.ship.animations.add('moveforwardrotateright', [15, 16, 17]);

        this.weapon_point_sniper = this.ship.addChild(this.game.make.sprite(150, -20, null));
        this.shoot_path_sniper_point = this.ship.addChild(this.game.make.sprite(200, -20, null));

        this.weapon_point_heavy_up = this.ship.addChild(this.game.make.sprite(50, 0, null));
        this.shoot_path_heavy_up_point = this.ship.addChild(this.game.make.sprite(100, 0, null));

        this.weapon_point_heavy_down = this.ship.addChild(this.game.make.sprite(50, -65, null));
        this.shoot_path_heavy_down_point = this.ship.addChild(this.game.make.sprite(100, -65, null));

        this.weapon_point_light_up = this.ship.addChild(this.game.make.sprite(50, 35, null));
        this.shoot_path_light_up_point = this.ship.addChild(this.game.make.sprite(100, 35, null));

        this.weapon_point_light_down = this.ship.addChild(this.game.make.sprite(50, -65, null));
        this.shoot_path_light_down_point = this.ship.addChild(this.game.make.sprite(100, -65, null));

        this.game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    };

    PLAYER_SHIP.prototype.update = function () {

        if(!this.input_up && this.input_left && !this.input_right){
            this.ship.animations.play('rotateleft', 30, true);
        }
        if(!this.input_up && !this.input_left && this.input_right){
            this.ship.animations.play('rotateright', 30, true);
        }
        if(this.input_up && !this.input_left && !this.input_right){
            this.ship.animations.play('moveforward', 30, true);
        }
        if(this.input_up && this.input_left && !this.input_right){
            this.ship.animations.play('moveforwardrotateleft', 30, true);
        }
        if(this.input_up && !this.input_left && this.input_right){
            this.ship.animations.play('moveforwardrotateright', 30, true);
        }
        if(!this.input_up && !this.input_left && !this.input_right){
            this.ship.frame = 0;
        }


    };

    PLAYER_SHIP.prototype.updatePositionInfo = function (x, y, angle){

        this.ship.x = x;
        this.ship.y = y;
        this.ship.angle = angle;

    };

    PLAYER_SHIP.prototype.updateInputInfo = function (input_up, input_left, input_right) {

        this.input_up = input_up;
        this.input_left = input_left;
        this.input_right = input_right;

    };

    PLAYER_SHIP.prototype.destroy = function (){

        this.explostion = this.game.add.sprite(this.ship.x, this.ship.y, 'explosion');
        this.explostion.anchor.setTo(0.5, 0.5);
        this.explostion.scale.setTo(1.2, 1.2);
        
        this.ship.kill();

        this.explostion.animations.add('explode')
        this.explostion.animations.play('explode', 30 , false, true);

    };

    ENEMY_SHIP = function (game, username, x, y) {

        this.game = game;
        this.username = username;
        this.x = x;
        this.y = y;
        
        this.ship = this.game.add.sprite(this.x, this.y, 'enemy_space_ship');
        this.ship.scale.setTo(0.5, 0.5);
        this.ship.anchor.setTo(0.5, 0.5);

        this.input_up = false;
        this.input_left = false;
        this.input_right = false;

        this.ship.animations.add('moveforward', [3, 4, 5]);

        this.ship.animations.add('rotateright', [6, 7, 8]);
        this.ship.animations.add('rotateleft', [9, 10, 11]);

        this.ship.animations.add('moveforwardrotateleft', [12, 13, 14]);
        this.ship.animations.add('moveforwardrotateright', [15, 16, 17]);
        
        this.weapon_point_sniper = this.ship.addChild(this.game.make.sprite(150, -20, null));
        this.shoot_path_sniper_point = this.ship.addChild(this.game.make.sprite(200, -20, null));

        this.weapon_point_heavy_up = this.ship.addChild(this.game.make.sprite(50, 0, null));
        this.shoot_path_heavy_up_point = this.ship.addChild(this.game.make.sprite(100, 0, null));

        this.weapon_point_heavy_down = this.ship.addChild(this.game.make.sprite(50, -65, null));
        this.shoot_path_heavy_down_point = this.ship.addChild(this.game.make.sprite(100, -65, null));

        this.weapon_point_light_up = this.ship.addChild(this.game.make.sprite(50, 35, null));
        this.shoot_path_light_up_point = this.ship.addChild(this.game.make.sprite(100, 35, null));

        this.weapon_point_light_down = this.ship.addChild(this.game.make.sprite(50, -65, null));
        this.shoot_path_light_down_point = this.ship.addChild(this.game.make.sprite(100, -65, null));

        this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
    };

    ENEMY_SHIP.prototype.update = function () {

        if(!this.input_up && this.input_left && !this.input_right){
            this.ship.animations.play('rotateleft', 30, true);
        }
        if(!this.input_up && !this.input_left && this.input_right){
            this.ship.animations.play('rotateright', 30, true);
        }
        if(this.input_up && !this.input_left && !this.input_right){
            this.ship.animations.play('moveforward', 30, true);
        }
        if(this.input_up && this.input_left && !this.input_right){
            this.ship.animations.play('moveforwardrotateleft', 30, true);
        }
        if(this.input_up && !this.input_left && this.input_right){
            this.ship.animations.play('moveforwardrotateright', 30, true);
        }
        if(!this.input_up && !this.input_left && !this.input_right){
            this.ship.frame = 0;
        }

    };

    ENEMY_SHIP.prototype.updateInputInfo = function (input_up, input_left, input_right) {

        this.input_up = input_up;
        this.input_left = input_left;
        this.input_right = input_right;

    };

    ENEMY_SHIP.prototype.updatePositionInfo = function (x, y, angle){

        this.ship.x = x;
        this.ship.y = y;
        this.ship.angle = angle;

    };

    ENEMY_SHIP.prototype.destroy = function (){

        this.explostion = this.game.add.sprite(this.ship.x, this.ship.y, 'explosion');
        this.explostion.anchor.setTo(0.5, 0.5);
        this.explostion.scale.setTo(1.2, 1.2);
        
        this.ship.kill();

        this.explostion.animations.add('explode')
        this.explostion.animations.play('explode', 30 , false, true);

    };

    var bootState = function () {
        console.log('Booting phaser...');
    };

    bootState.prototype = {

        preload: function () {
            game.load.image('loading', '/assets/sprites/loading.png');
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
            game.load.image('light_bullet', '/assets/sprites/light.png');
            game.load.image('heavy_bullet', '/assets/sprites/heavy.png');
            game.load.image('sniper_bullet', '/assets/sprites/sniper.png');
            game.load.image('bluehud', '/assets/sprites/bluehud.png');
            game.load.image('redhud', '/assets/sprites/redhud.png');
            game.load.image('healthbar', '/assets/sprites/healthbar.png');

            game.load.spritesheet('player_space_ship', '/assets/spritesheet/shipsheet_1.png', 450, 350, 18);
            game.load.spritesheet('enemy_space_ship', '/assets/spritesheet/shipsheet_2.png', 450, 350, 18);
            game.load.spritesheet('explosion', '/assets/spritesheet/explosion.png', 130, 130, 4);

            game.load.spritesheet('loadout_heavy', '/assets/spritesheet/loadout_heavy.png', 400, 500, 8);
            game.load.spritesheet('loadout_sniper', '/assets/spritesheet/loadout_sniper.png', 400, 500, 8);
            game.load.spritesheet('loadout_light', '/assets/spritesheet/loadout_light.png', 400, 500, 8);

            game.load.audio('background_music', 'assets/audio/background.mp3');
            game.load.audio('sniper_shoot_music', 'assets/audio/sniper.mp3');
            game.load.audio('heavy_shoot_music', 'assets/audio/heavy.mp3');
            game.load.audio('light_shoot_music', 'assets/audio/light.mp3');

        },
        update: function () {

            if(startGame){
                game.state.start('gameState');
            }

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

            game.world.resize(1920, 1920);
            game.world.setBounds(0, 0, 1920, 1920);

            game.physics.startSystem(Phaser.Physics.ARCADE);

            tilesprite = game.add.tileSprite(0, 0, 1920, 1920, 'space');
            
            player = new PLAYER_SHIP(game, player_username, player_spawn_x, player_spawn_y);
            enemy = new ENEMY_SHIP(game, enemy_username, enemy_spawn_x, enemy_spawn_y);

            bluehud = game.add.sprite(225, 600, 'bluehud');
            bluehud.scale.setTo(0.7, 0.7);
            bluehud.anchor.setTo(0.5, 0.5);
            bluehud.fixedToCamera = true;
            
            player_healthbar = game.add.sprite(189.75, 566.5, 'healthbar');
            player_healthbar.scale.setTo(0.7, 0.7);
            player_healthbar.fixedToCamera = true;

            redhud = game.add.sprite(1050, 100, 'redhud');
            redhud.scale.setTo(0.7, 0.7);
            redhud.anchor.setTo(0.5, 0.5);
            redhud.fixedToCamera = true;

            enemy_healthbar = game.add.sprite(1014.75, 66.5, 'healthbar');
            enemy_healthbar.scale.setTo(0.7, 0.7);
            enemy_healthbar.fixedToCamera = true;

            loadout_sniper = game.add.sprite(1100, 560, 'loadout_sniper');
            loadout_sniper.anchor.setTo(0.5, 0.5);
            loadout_sniper.scale.setTo(0.5, 0.5);
            loadout_sniper.fixedToCamera = true;
            loadout_sniper.visible = false;

            loadout_light = game.add.sprite(1100, 560, 'loadout_light');
            loadout_light.anchor.setTo(0.5, 0.5);
            loadout_light.scale.setTo(0.5, 0.5);
            loadout_light.fixedToCamera = true;
            loadout_light.visible = true;

            loadout_heavy = game.add.sprite(1100, 560, 'loadout_heavy');
            loadout_heavy.anchor.setTo(0.5, 0.5);
            loadout_heavy.scale.setTo(0.5, 0.5);
            loadout_heavy.fixedToCamera = true;
            loadout_heavy.visible = false;

            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.ONE);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.TWO);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.THREE);

            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.W);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.A);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);

            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);

            game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

            player_light_bullets_group = game.add.group();
            player_light_bullets_group.enableBody = true;
            player_light_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            player_light_bullets_group.createMultiple(50, 'light_bullet');
            player_light_bullets_group.setAll('checkWorldBounds', true);
            player_light_bullets_group.setAll('outOfBoundsKill', true);

            player_heavy_bullets_group = game.add.group();
            player_heavy_bullets_group.enableBody = true;
            player_heavy_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            player_heavy_bullets_group.createMultiple(50, 'heavy_bullet');
            player_heavy_bullets_group.setAll('checkWorldBounds', true);
            player_heavy_bullets_group.setAll('outOfBoundsKill', true);

            player_sniper_bullets_group = game.add.group();
            player_sniper_bullets_group.enableBody = true;
            player_sniper_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            player_sniper_bullets_group.createMultiple(50, 'sniper_bullet');
            player_sniper_bullets_group.setAll('checkWorldBounds', true);
            player_sniper_bullets_group.setAll('outOfBoundsKill', true);

            /* Enemy Bullets */
            enemy_light_bullets_group = game.add.group();
            enemy_light_bullets_group.enableBody = true;
            enemy_light_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            enemy_light_bullets_group.createMultiple(50, 'light_bullet');
            enemy_light_bullets_group.setAll('checkWorldBounds', true);
            enemy_light_bullets_group.setAll('outOfBoundsKill', true);

            enemy_heavy_bullets_group = game.add.group();
            enemy_heavy_bullets_group.enableBody = true;
            enemy_heavy_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            enemy_heavy_bullets_group.createMultiple(50, 'heavy_bullet');
            enemy_heavy_bullets_group.setAll('checkWorldBounds', true);
            enemy_heavy_bullets_group.setAll('outOfBoundsKill', true);

            enemy_sniper_bullets_group = game.add.group();
            enemy_sniper_bullets_group.enableBody = true;
            enemy_sniper_bullets_group.physicsBodyType = Phaser.Physics.ARCADE;

            enemy_sniper_bullets_group.createMultiple(50, 'sniper_bullet');
            enemy_sniper_bullets_group.setAll('checkWorldBounds', true);
            enemy_sniper_bullets_group.setAll('outOfBoundsKill', true);

            weapon_key_light = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
            weapon_key_light.onDown.add(changeWeaponToLight, this);

            weapon_key_sniper = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
            weapon_key_sniper.onDown.add(changeWeaponToSniper, this);

            weapon_key_heavy = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
            weapon_key_heavy.onDown.add(changeWeaponToHeavy, this);

            weapon_shoot_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            weapon_shoot_key.onDown.add(fireBullet, this);

            background_music = game.add.audio('background_music');

            sniper_shoot_music = game.add.audio('sniper_shoot_music');
            heavy_shoot_music = game.add.audio('heavy_shoot_music');
            light_shoot_music = game.add.audio('light_shoot_music');

            background_music.onStop.add(repeatBackground, this);
            background_music.play();

        },
        update: function (){
            
            player.update();
            enemy.update();

            player.updatePositionInfo(player_currentX, player_currentY, player_currentAngle);
            enemy.updatePositionInfo(enemy_currentX, enemy_currentY, enemy_currentAngle);

            enemy.updateInputInfo(enemy_input_info.input_up, enemy_input_info.input_left, enemy_input_info.input_right);

            game.physics.arcade.overlap( player_light_bullets_group, enemy.ship, function(tank, bullet){
                bullet.kill();
            });

            game.physics.arcade.overlap( player_heavy_bullets_group, enemy.ship, function(tank, bullet){
                bullet.kill();
            });

            game.physics.arcade.overlap( player_sniper_bullets_group, enemy.ship, function(tank, bullet){
                bullet.kill();
            });

            game.physics.arcade.overlap( enemy_light_bullets_group, player.ship, function(tank, bullet){
                bullet.kill();
            });

            game.physics.arcade.overlap( enemy_heavy_bullets_group, player.ship, function(tank, bullet){
                bullet.kill();
            });

            game.physics.arcade.overlap( enemy_sniper_bullets_group, player.ship, function(tank, bullet){
                bullet.kill();
            });

            if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
                input_info.input_up = true;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            }
            else{
                input_info.input_up = false;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            }

            if(game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.D)){
                input_info.input_left = true;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            }
            else{
                input_info.input_left = false;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            } 
            
            if(!game.input.keyboard.isDown(Phaser.Keyboard.A) && game.input.keyboard.isDown(Phaser.Keyboard.D)){
                input_info.input_right = true;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            }
            else{
                input_info.input_right = false;
                player.updateInputInfo(input_info.input_up, input_info.input_left, input_info.input_right);
            }

            if(game.time.now < next_fire_light){
                isLightReady = false;
            }
            else{
                isLightReady = true;
            }

            if(game.time.now < next_fire_heavy){
                isHeavyReady = false;
            }
            else{
                isHeavyReady = true;
            }
            
            if(game.time.now < next_fire_sniper){
                isSniperReady = false;
            }
            else{
                isSniperReady = true;
            }

            if(weapon === 'light'){

                loadout_light.visible = true;
                loadout_heavy.visible = false;
                loadout_sniper.visible = false;

                if(isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_light.frame = 4;
                }
                if(!isLightReady && isSniperReady && !isHeavyReady){
                    loadout_light.frame = 2;
                }
                if(!isLightReady && !isSniperReady && isHeavyReady){
                    loadout_light.frame = 3;
                }
                if(isLightReady && isSniperReady && !isHeavyReady){
                    loadout_light.frame = 6;
                }
                if(isLightReady && !isSniperReady && isHeavyReady){
                    loadout_light.frame = 5;
                }
                if(!isLightReady && isSniperReady && isHeavyReady){
                    loadout_light.frame = 7;
                }
                if(isLightReady && isSniperReady && isHeavyReady){
                    loadout_light.frame = 0;
                }
                if(!isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_light.frame = 1;
                }

            }
            else if(weapon === 'heavy'){

                loadout_light.visible = false;
                loadout_heavy.visible = true;
                loadout_sniper.visible = false;

                if(isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_heavy.frame = 4;
                }
                if(!isLightReady && isSniperReady && !isHeavyReady){
                    loadout_heavy.frame = 2;
                }
                if(!isLightReady && !isSniperReady && isHeavyReady){
                    loadout_heavy.frame = 3;
                }
                if(isLightReady && isSniperReady && !isHeavyReady){
                    loadout_heavy.frame = 6;
                }
                if(isLightReady && !isSniperReady && isHeavyReady){
                    loadout_heavy.frame = 5;
                }
                if(!isLightReady && isSniperReady && isHeavyReady){
                    loadout_heavy.frame = 7;
                }
                if(isLightReady && isSniperReady && isHeavyReady){
                    loadout_heavy.frame = 0;
                }
                if(!isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_heavy.frame = 1;
                }

            }
            else if(weapon === 'sniper'){

                loadout_light.visible = false;
                loadout_heavy.visible = false;
                loadout_sniper.visible = true;

                if(isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_sniper.frame = 4;
                }
                if(!isLightReady && isSniperReady && !isHeavyReady){
                    loadout_sniper.frame = 2;
                }
                if(!isLightReady && !isSniperReady && isHeavyReady){
                    loadout_sniper.frame = 3;
                }
                if(isLightReady && isSniperReady && !isHeavyReady){
                    loadout_sniper.frame = 6;
                }
                if(isLightReady && !isSniperReady && isHeavyReady){
                    loadout_sniper.frame = 5;
                }
                if(!isLightReady && isSniperReady && isHeavyReady){
                    loadout_sniper.frame = 7;
                }
                if(isLightReady && isSniperReady && isHeavyReady){
                    loadout_sniper.frame = 0;
                }
                if(!isLightReady && !isSniperReady && !isHeavyReady){
                    loadout_sniper.frame = 1;
                }

            }
            
            socket.emit('clientInput', input_info);

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

                light_shoot_music.play();

                game.physics.arcade.moveToXY(bullet1, player.shoot_path_light_up_point.world.x, player.shoot_path_light_up_point.world.y, 500);
                game.physics.arcade.moveToXY(bullet2, player.shoot_path_light_down_point.world.x, player.shoot_path_light_down_point.world.y, 500);

                socket.emit('newClientBullet', { 'type': 'light'});

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

                heavy_shoot_music.play();

                game.physics.arcade.moveToXY(bullet1, player.shoot_path_heavy_up_point.world.x, player.shoot_path_heavy_up_point.world.y, 550);
                game.physics.arcade.moveToXY(bullet2, player.shoot_path_heavy_down_point.world.x, player.shoot_path_heavy_down_point.world.y, 550);

                socket.emit('newClientBullet', { 'type': 'heavy'});

            }

        }
        else if(weapon === 'sniper'){

            if(game.time.now > next_fire_sniper && player_sniper_bullets_group.countDead() > 0){
            
                next_fire_sniper = game.time.now + fire_rate_sniper;

                var bullet = player_sniper_bullets_group.getFirstDead();
                bullet.reset(player.weapon_point_sniper.world.x, player.weapon_point_sniper.world.y);
                bullet.angle = player.ship.angle;

                sniper_shoot_music.play();

                game.physics.arcade.moveToXY(bullet, player.shoot_path_sniper_point.world.x, player.shoot_path_sniper_point.world.y, 600);

                socket.emit('newClientBullet', { 'type': 'sniper'});

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

    function updatePlayerHealthbar(){
        var hp_percent = player_current_hp / player_hp * 100;
        var scale_x = hp_percent * 0.7 / 100;
        player_healthbar.scale.setTo(scale_x, 0.7);
    }

    function updateEnemyHealthbar(){
        var hp_percent = enemy_current_hp / enemy_hp * 100;
        var scale_x = hp_percent * 0.7 / 100;
        enemy_healthbar.scale.setTo(scale_x, 0.7);
    }

    function repeatBackground(){
        background_music.play();
    }

    socket.on('newPlayerPositionData', function(data){

        player_currentX = data.client.x;
        player_currentY = data.client.y;
        player_currentAngle = data.client.angle;

        enemy_currentX = data.host.x;
        enemy_currentY = data.host.y;
        enemy_currentAngle = data.host.angle;

        enemy_input_info = data.input_info;
        
    });

    socket.on('spawnHostBullet', function (data){

        if(data.type === 'light'){
            
            var bullet1 = enemy_light_bullets_group.getFirstDead();
            bullet1.reset(enemy.weapon_point_light_up.world.x, enemy.weapon_point_light_up.world.y);
            bullet1.angle = enemy.ship.angle;

            var bullet2 = enemy_light_bullets_group.getFirstDead();
            bullet2.reset(enemy.weapon_point_light_down.world.x, enemy.weapon_point_light_down.world.y);
            bullet2.angle = enemy.ship.angle;

            light_shoot_music.play();

            game.physics.arcade.moveToXY(bullet1, enemy.shoot_path_light_up_point.world.x, enemy.shoot_path_light_up_point.world.y, 500);
            game.physics.arcade.moveToXY(bullet2, enemy.shoot_path_light_down_point.world.x, enemy.shoot_path_light_down_point.world.y, 500);
        
        }
        else if(data.type === 'heavy'){

            var bullet1 = enemy_heavy_bullets_group.getFirstDead();
            bullet1.reset(enemy.weapon_point_heavy_up.world.x, enemy.weapon_point_heavy_up.world.y);
            bullet1.angle = enemy.ship.angle;

            var bullet2 = enemy_heavy_bullets_group.getFirstDead();
            bullet2.reset(enemy.weapon_point_heavy_down.world.x, enemy.weapon_point_heavy_down.world.y);
            bullet2.angle = enemy.ship.angle;

            heavy_shoot_music.play();

            game.physics.arcade.moveToXY(bullet1, enemy.shoot_path_heavy_up_point.world.x, enemy.shoot_path_heavy_up_point.world.y, 550);
            game.physics.arcade.moveToXY(bullet2, enemy.shoot_path_heavy_down_point.world.x, enemy.shoot_path_heavy_down_point.world.y, 550);

        }
        else if(data.type === 'sniper'){

            var bullet = enemy_sniper_bullets_group.getFirstDead();
            bullet.reset(enemy.weapon_point_sniper.world.x, enemy.weapon_point_sniper.world.y);
            bullet.angle = enemy.ship.angle;

            sniper_shoot_music.play();

            game.physics.arcade.moveToXY(bullet, enemy.shoot_path_sniper_point.world.x, enemy.shoot_path_sniper_point.world.y, 600);

        }
    });

    socket.on('updateClientHp', function (data){
        player_current_hp = data.hp;
        if(data.hp === 0){
            player.destroy();
        }
        updatePlayerHealthbar();
    });

    socket.on('updateHostHp', function (data){
        enemy_current_hp = data.hp;
        if(data.hp === 0){
            enemy.destroy();
        }
        updateEnemyHealthbar();
    });

    game.state.add('bootState', bootState);
    game.state.add('preloadState', preloadState);
    game.state.add('gameState', gameState);

    game.state.start('bootState');

}
