var request = require("request");

/* MISCELLANEOUS FUNCTIONS */

function MiscFunctions()
{
  this.getCookie = function()
  {
    console.log(request("/users/getCookie"));
  };
}

module.exports.MiscFunctions = MiscFunctions;
/* PLAYER RELATED STUFF */

function Weapon(dmg, rate, name, level)
{
  this.level = (level === undefined)? 0 : level ; //level of the gun
  this.dmg = (dmg === undefined)? 1 : dmg ; // damage per hit
  this.rate = (rate === undefined)? 1 : rate; // Rate of fire
  this.name = (name === undefined)? "Some Gun" : name; // Name of Gun
  this.unlocked = [true,false,false,false]; // according to tiers : [t0, t1, t2, t3]
};

function Player(player_name)
{
  //this.userid = (userid === undefined)? "LOLWUT" : userid;
  this.name = (player_name === undefined)? "N00B" : player_name;
  this.hp = 100;
  this.movement_speed = 10;
  this.exp = 0;
  this.level = 0;

  this.weapons = {};
  this.weapons.light = new Weapon(10,10,"Light Gun");
  this.weapons.heavy = new Weapon(20,5,"Heavy Gun");
  this.weapons.sniper = new Weapon(30,1,"Sniper Guns");

  this.schema = {
    //userid: String,
    username: String,
    hp: Number,
    movement_speed: Number,
    exp: Number,
    level: Number,
    weapons: {
      light: {
        level: Number,
        rate: Number,
        name: String,
        dmg: Number,
        unlocked: [Boolean]
      },
      heavy: {
        level: Number,
        rate: Number,
        name: String,
        dmg: Number,
        unlocked: [Boolean]
      },
      sniper: {
        level: Number,
        rate: Number,
        name: String,
        dmg: Number,
        unlocked: [Boolean]
      }
    }
  };
  /* METHODS */
  this.toJSON = function()
  {
    ret = {
      //userid: this.userid,
      username: this.name,
      hp: this.hp,
      movement_speed: this.movement_speed,
      exp: this.exp,
      level: this.level,
      weapons: {
        light: {
          level: this.weapons.light.level,
          rate: this.weapons.light.rate,
          name: this.weapons.light.name,
          dmg: this.weapons.light.dmg,
          unlocked: this.weapons.light.unlocked
        },
        heavy: {
          level: this.weapons.heavy.level,
          rate: this.weapons.heavy.rate,
          name: this.weapons.heavy.name,
          dmg: this.weapons.heavy.dmg,
          unlocked: this.weapons.heavy.unlocked
        },
        sniper: {
          level: this.weapons.sniper.level,
          rate: this.weapons.sniper.rate,
          name: this.weapons.sniper.name,
          dmg: this.weapons.sniper.dmg,
          unlocked: this.weapons.sniper.unlocked
        }
      }
    };
    return(ret);
  };
};

module.exports.Player = Player;
