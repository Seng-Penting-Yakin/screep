module.exports = {
    updateCarryStatus: function (creep) {
        var creepStorage = creep.store;
        var memory = creep.memory;

        if (creepStorage.getUsedCapacity() === 0 && !memory.isCarryEmpty)
            memory.isCarryEmpty = true

        else if (creepStorage.getFreeCapacity() === 0 && memory.isCarryEmpty)
            memory.isCarryEmpty = false;

        creep.memory.isCarryEmpty = memory.isCarryEmpty;
    },
    cleanCreepMemory() {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] === undefined) {
                let memory = Memory.creeps[name]

                let roleCountMemory = Game.rooms[memory.room].memory.roleCount

                if (roleCountMemory)
                    roleCountMemory[memory.role] -= 1;

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

            this.updateCarryStatus(creep);

            creep.memory.room = creep.room.name;

            roleCreep.run(creep);
        }
    },
}