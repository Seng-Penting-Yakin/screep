module.exports = {

    assignRoomRoleCap: function (room) {
        if (room.memory.roleCap === undefined)
            room.memory.roleCap = {
                harvester: 2,
                builder: 2,
                upgrader: 2,
            }
    },

    assignRoomRoleCount(room) {
        if (room.memory.roleCount === undefined)
            room.memory.roleCount = {
                harvester: 0,
                builder: 0,
                upgrader: 0
            }
    },

    handle: function () {
        let spawns = Game.spawns

        for (let spawn_index in spawns) {
            let spawn = spawns[spawn_index]

            if (spawn.spawning) continue

            let room = spawn.room
            this.assignRoomRoleCap(room)
            this.assignRoomRoleCount(room)

            this.spawnByRole(spawn, 'harvester')
            this.spawnByRole(spawn, 'builder')
            this.spawnByRole(spawn, 'upgrader')

        }
    },

    spawnByRole: function (spawn, role) {
        let room = spawn.room
        let roomMemory = room.memory


        if (roomMemory.roleCap[role] > roomMemory.roleCount[role]) {
            let spawnCreep = spawn.spawnCreep([MOVE, WORK, CARRY],
                role + room.name + Game.time,
                {
                    memory: {
                        role: role,
                        isCarryEmpty: true
                    },
                }
            )

            if (spawnCreep === 0) {
                roomMemory.roleCount[role] += 1
                console.log("successfully create a new " + role + "!")
            }
        }
    }
}
