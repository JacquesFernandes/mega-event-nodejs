var request = require("request");
var Schemas = require("./Schemas");
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
  this.t0_unlocked = true;
  this.t1_unlocked = false;
  this.t2_unlocked = false;
  this.t3_unlocked = false;
};

function Player(player_name) // NOTE: any changes to be reflected in .toJson() as well
{
  //this.userid = (userid === undefined)? "LOLWUT" : userid;
  this.name = (player_name === undefined)? "N00B" : player_name;
  this.hp = 100;
  this.movement_speed = 10;
  this.exp = 0;
  this.level = 0;
  this.wins = 0;
  this.losses = 0;

  this.weapons = {};
  this.weapons.light = new Weapon(10,10,"Light Gun");
  this.weapons.heavy = new Weapon(20,5,"Heavy Gun");
  this.weapons.sniper = new Weapon(30,1,"Sniper Guns");

  this.schema = Schemas.playerSchema;/*{
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
        t0_unlocked: Boolean,
        t1_unlocked: Boolean,
        t2_unlocked: Boolean,
        t3_unlocked: Boolean
      },
      heavy: {
        level: Number,
        rate: Number,
        name: String,
        dmg: Number,
        t0_unlocked: Boolean,
        t1_unlocked: Boolean,
        t2_unlocked: Boolean,
        t3_unlocked: Boolean
      },
      sniper: {
        level: Number,
        rate: Number,
        name: String,
        dmg: Number,
        t0_unlocked: Boolean,
        t1_unlocked: Boolean,
        t2_unlocked: Boolean,
        t3_unlocked: Boolean
      }
    }
  };*/
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
      wins: this.wins,
      losses: this.losses,
      weapons: {
        light: {
          level: this.weapons.light.level,
          rate: this.weapons.light.rate,
          name: this.weapons.light.name,
          dmg: this.weapons.light.dmg,
          t0_unlocked: this.weapons.light.t0_unlocked,
          t1_unlocked: this.weapons.light.t1_unlocked,
          t2_unlocked: this.weapons.light.t2_unlocked,
          t3_unlocked: this.weapons.light.t3_unlocked
        },
        heavy: {
          level: this.weapons.heavy.level,
          rate: this.weapons.heavy.rate,
          name: this.weapons.heavy.name,
          dmg: this.weapons.heavy.dmg,
          t0_unlocked: this.weapons.heavy.t0_unlocked,
          t1_unlocked: this.weapons.heavy.t1_unlocked,
          t2_unlocked: this.weapons.heavy.t2_unlocked,
          t3_unlocked: this.weapons.heavy.t3_unlocked
        },
        sniper: {
          level: this.weapons.sniper.level,
          rate: this.weapons.sniper.rate,
          name: this.weapons.sniper.name,
          dmg: this.weapons.sniper.dmg,
          t0_unlocked: this.weapons.sniper.t0_unlocked,
          t1_unlocked: this.weapons.sniper.t1_unlocked,
          t2_unlocked: this.weapons.sniper.t2_unlocked,
          t3_unlocked: this.weapons.sniper.t3_unlocked
        }
      }
    };
    return(ret);
  };
};

module.exports.Player = Player;
