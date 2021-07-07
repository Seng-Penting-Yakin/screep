module.exports = {
    updateWorkingStatus: function (creep) {
        var creepStorage = creep.store;
        var memory = creep.memory;

        if (creepStorage.getUsedCapacity() === 0 && !memory.working)
            memory.working = true

        else if (creepStorage.getFreeCapacity() === 0 && memory.working)
            memory.working = false;

        creep.memory.working = memory.working;
    },
    cleanCreepMemory() {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] === undefined) {
                delete Memory.creeps[name];
            }
        }
    },

    handle: function () {
        var creeps = Game.creeps;
        this.cleanCreepMemory();

        for (const creep_index in creeps) {
            var creep = creeps[creep_index];
            var role = creep.memory.role;
            var CreepClass = require(role);

            var roleCreep = new CreepClass(creep);

            this.updateWorkingStatus(creep);

            creep.memory.room = creep.room.name;

            roleCreep.run(creep);
        }
    },
}