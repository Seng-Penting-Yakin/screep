function createCreep() {
    Game.spawns['Spawn1'].createCreep([MOVE, WORK, CARRY], 'harvester', {role: 'harvester', isCarryEmpty: true});
}

var creepHandler = require('creepHandler');
var spawnHandler = require('spawnHandler');

module.exports.loop = function () {
    //handle creep works
    spawnHandler.handle();
    creepHandler.handle();

}

