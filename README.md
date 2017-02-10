Mega Event

TODO:
 - Work on Lobby (mechanics, etc.)

 USAGE NOTES:
 - To set a cookie : /users/setCookie/<name> [TO BE DISABLED DURING PRODUCTION] - does not make new player
 - To create a new player (in db as well) : /users/newPlayer/<name> [TO BE DISABLED DURING PRODUCTION] - does not require cookie
 - To fetch fight "session" (JSON object with both player's details) : /lobby/getMatch/<name> - <name> can be of a client or host