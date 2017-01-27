function Weapon(dmg, rate, name)
{
  this.dmg = (dmg === undefined)? 1 : dmg ; // damage per hit
  this.rate = (rate === undefined)? 1 : rate; // Rate of fire
  this.name = (name === undefined)? "Some Gun" : name; // Name of Gun
  this.fire = function()
  {
    console.log("FIRING "+this.name);
  };
};

function Player(userid, player_name)
{
  this.userid = (userid === undefined)? "LOLWUT" : userid;
  this.name = (player_name === undefined)? "N00B" : player_name;
  this.hp = 100;
  this.movement_speed = 10;

  this.weapons = {};
  this.weapons.light = new Weapon(10,10,"Light Gun");
  this.weapons.heavy = new Weapon(20,5,"Heavy Gun");
  this.weapons.sniper = new Weapon(30,1,"Sniper Guns");

  /* METHODS */
  this.getAttributeJSON = function()
  {
    ret = {"userid":this.userid, "username":this.name, "hp":this.hp, "movement":this.movement_speed};
    return(ret);
  };
};

module.exports.Player = Player;
