var mongoose = require("mongoose");

var weaponTypeSchema = mongoose.Schema({
  level: Number,
  rate: Number,
  name: String,
  dmg: Number,
  unlocked: [Boolean]
});
var weaponSchema = mongoose.Schema({
  light:{
    type: weaponTypeSchema
  },
  heavy:{
    type: weaponTypeSchema
  },
  sniper:{
    type:weaponTypeSchema
  }
});
var playerSchema = mongoose.Schema({
  username: String,
  hp: Number,
  movement_speed: Number,
  exp: Number,
  level: Number,
  weapons: {
      type: weaponSchema
  }
});

var PlayerModel = mongoose.model("players",playerSchema);

module.exports.weaponTypeSchema = weaponTypeSchema;
module.exports.weaponSchema = weaponSchema;
module.exports.playerSchema = playerSchema;
module.exports.PlayerModel = PlayerModel;