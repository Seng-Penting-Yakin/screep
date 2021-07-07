
function createCreep(){
    Game.spawns['Spawn1'].createCreep([MOVE,WORK,CARRY], 'harvester', {role: 'harvester', working: false});
}

var creepHandler = require('creepHandler');

module.exports.loop = function () {
    //handle creep works
    creepHandler.handle();
}
