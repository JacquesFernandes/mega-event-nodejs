
var game = new Phaser.Game(1280, 720, Phaser.CANVAS);

var loading;
var sidebar;
var button = [];
var buttongroup;
var unlockdata = [];

var ajaxRequest;
var jsn = {'light-0':0,'heavy-0':1,'sniper-0':2,'light-1':3,'heavy-1':4,'sniper-1':5,'light-2':6,'heavy-2':7,'sniper-2':8,'light-3':9,'heavy-3':10,'sniper-3':11}

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
		game.load.image('sidebar', '/assets/images/shopbackground.jpg');
        game.load.spritesheet('light-0', '/assets/buttons/light_button_0.png', 140, 80);
        game.load.spritesheet('light-1', '/assets/buttons/light_button_1.png', 140, 80);
        game.load.spritesheet('light-2', '/assets/buttons/light_button_2.png', 140, 80);
        game.load.spritesheet('light-3', '/assets/buttons/light_button_3.png', 140, 80);
        
        game.load.spritesheet('heavy-0', '/assets/buttons/heavy_button_0.png', 140, 80);
        game.load.spritesheet('heavy-1', '/assets/buttons/heavy_button_1.png', 140, 80);
        game.load.spritesheet('heavy-2', '/assets/buttons/heavy_button_2.png', 140, 80);
        game.load.spritesheet('heavy-3', '/assets/buttons/heavy_button_3.png', 140, 80);
        
        game.load.spritesheet('sniper-0', '/assets/buttons/sniper_button_0.png', 140, 80);
        game.load.spritesheet('sniper-1', '/assets/buttons/sniper_button_1.png', 140, 80);
        game.load.spritesheet('sniper-2', '/assets/buttons/sniper_button_2.png', 140, 80);
        game.load.spritesheet('sniper-3', '/assets/buttons/sniper_button_3.png', 140, 80);
        
    },
    create: function () {
        game.stage.backgroundColor = '#000033';
        
		shopback = game.add.sprite(game.world.centerX,game.world.centerY,'sidebar');
        
        shopback.anchor.setTo(0.5);
        /*Global anchor point*/
        
        //Title Shop
        
        buttongroup = game.add.group();
        /*DELETE THIS*/
        $.get('shop/getUnlocked', function(data, status){
            unlockdata = data;
            initialcheck();
        });
        
        /*Buttons of Tiers*/
        //Tier 0
        button[0] = game.add.button(game.world.centerX + 211, 185, 'light-0', function(){
            console.log('Tier 0 light');
            //button[0].input.enabled = false;
            check(button[0]);
            $.post('shop/purchase/t0/light',{
                tier: 't0',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[1] = game.add.button(game.world.centerX + 333 , 185, 'heavy-0', function(){
            console.log('Tier 0 heavy');
            button[1].input.enabled = false;
            check(button[1]);
            $.post('shop/purchase/t0/heavy',{
                tier: 't0',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[2] = game.add.button(game.world.centerX + 455 , 185, 'sniper-0', function(){
            console.log('Tier 0 sniper');
            button[2].input.enabled = false;
            check(button[2]);
            $.post('shop/purchase/t0/sniper',{
                tier: 't0',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier 1
        button[3] = game.add.button(game.world.centerX + 211, 305, 'light-1', function(){
            console.log('Tier 1 light');
            //button[3].input.enabled = false;
            check(button[3]);
            $.post('shop/purchase/t1/light',{
                tier: 't1',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[4] = game.add.button(game.world.centerX+ 333, 305, 'heavy-1', function(){
            console.log('Tier 1 heavy');
            button[4].input.enabled = false;
            check(button[4]);
            $.post('shop/purchase/t1/heavy',{
                tier: 't1',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[5] = game.add.button(game.world.centerX + 455 , 305, 'sniper-1', function(){
            console.log('Tier 1 sniper');
            button[5].input.enabled = false;
            check(button[5]);
            $.post('shop/purchase/t1/sniper',{
                tier: 't1',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier 2
        button[6] = game.add.button(game.world.centerX + 211, 426, 'light-2', function(){
            console.log('Tier 2 light');
            //button[6].input.enabled = false;
            check(button[6]);
            $.post('shop/purchase/t2/light',{
                tier: 't2',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[7] = game.add.button(game.world.centerX + 333 , 426, 'heavy-2', function(){
            console.log('Tier 2 heavy');
            button[7].input.enabled = false;
            check(button[7]);
            $.post('shop/purchase/t2/heavy',{
                tier: 't2',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[8] = game.add.button(game.world.centerX + 455, 426, 'sniper-2', function(){
            console.log('Tier 2 sniper');
            button[8].input.enabled = false;
            check(button[8]);
            $.post('shop/purchase/t2/sniper',{
                tier: 't2',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        //Tier48
        button[9] = game.add.button(game.world.centerX + 211, 547, 'light-3', function(){
            console.log('Tier 3 light');
            //button[9].input.enabled = false;
            check(button[9]);
            $.post('shop/purchase/t3/light',{
                tier: 't3',
                class: 'light'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[10] = game.add.button(game.world.centerX + 333 , 547, 'heavy-3', function(){
            console.log('Tier 3 heavy');
            button[10].input.enabled = false;
            check(button[10]);
            $.post('shop/purchase/t3/heavy',{
                tier: 't3',
                class: 'heavy'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        button[11] = game.add.button(game.world.centerX + 455, 547, 'sniper-3', function(){
            console.log('Tier 3 sniper');
            button[11].input.enabled = false;
            check(button[11]);
            $.post('shop/purchase/t3/sniper',{
                tier: 't3',
                class: 'sniper'
            }, 
            function(data, status){
                //Callback function
            });
        }, this, 1, 0, 2);
        
        
        /*Ajax format*/
        /* /shop/purchase/tier(t0 --> t3)/class (light/ heavy/ sniper)*/
        
        
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
        
        //buttongroup.scale.setTo(0.5);
        
    },
    update: function (){
		
        
    },
    render: function (){
        
    }

};

function check(bObject){
    if(bObject.key == 'light-0' || bObject.key == 'light-1' || bObject.key == 'light-2' || bObject.key == 'light-3'){
        for(var x = 0; x < 12; x += 3 ){
            button[x].input.enabled = true;
            //button[x].tint = 0xFFFFFF;
            button[x].setFrames(1,0,2);
        }
    }
    else if(bObject.key == 'heavy-0' || bObject.key == 'heavy-1' || bObject.key == 'heavy-2' || bObject.key == 'heavy-3'){
        for(var x = 1; x < 12; x += 3 ){
            button[x].input.enabled = true;
            //button[x].tint = 0xFFFFFF;
            button[x].setFrames(1,0,2);
        }
    }
    else if(bObject.key == 'sniper-0' || bObject.key == 'sniper-1' || bObject.key == 'sniper-2' || bObject.key == 'sniper-3'){
        for(var x = 2; x < 12; x += 3 ){
            button[x].input.enabled = true;
            //button[x].tint = 0xFFFFFF;
            button[x].setFrames(1,0,2);
        }
    }
    $.get('shop/getUnlocked', function(data, status){
        unlockdata = data;
    });
    bObject.tint = 0xFFFFFF;
    if(checkunlock(bObject)){
        console.log('After checkunlock');
        bObject.setFrames(2);
        bObject.input.enabled = false;
    }

    
}
function initialcheck(){
    for(var x = 0; x < 12; x += 1){
        if(unlockdata[x]){
            button[x].tint = 0xFFFFFF;
        }
        else{
            button[x].tint = 0xb3d9ff;
        }
    }
}
function checkunlock(bObject){
    //console.log('Inside checkunlock');
    var x = jsn[bObject.key];
    console.log('Value of unlockdata[x] : '+unlockdata[x]);
    if(!unlockdata[x]){
        var rVal = confirm("Confirm purchase?");
        if(rVal == true){
            button[x].tint = 0xFFFFFF;
            return true;
        }
        else{
            return false;
        }
    }
    else{
        alert('Already unlocked');
        
        return true;
    }
}


game.state.add('bootState', bootState);
game.state.add('preloadState', preloadState);
game.state.add('shopState', shopState);

game.state.start('bootState');

