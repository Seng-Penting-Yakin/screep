class Harvester {
    constructor(creep) {
        this.creep = creep;
    }

    run() {
        console.log("run from class")
        this.chooseTargetResource();

        if (this.creep.memory.working)
            this.work();
        else
            this.carry();
    }

    work() {
        this.creep.memory.storeTargetPath = "[]";
        this.findPathToResource();
        var parsedSpawnToResource = JSON.parse(this.creep.memory.spawnToResource);
        var targetResource = Game.getObjectById(this.creep.memory.targetResource);

        if (this.creep.harvest(targetResource) == ERR_NOT_IN_RANGE) {
            this.creep.move(parsedSpawnToResource[0].direction)
            parsedSpawnToResource.shift();
            var stringifySpawnToResource = JSON.stringify(parsedSpawnToResource);
            this.creep.memory.spawnToResource = stringifySpawnToResource;
        }
    }

    carry() {
        this.creep.memory.spawnToResource = "[]";
        this.findPathToStorage(this.creep);
        var parsedStoreTargetPath = JSON.parse(this.creep.memory.storeTargetPath)
        console.log("creepnotworking");
        this.creep.moveByPath(parsedStoreTargetPath);
        console.log(parsedStoreTargetPath);
        for (const resourceType in this.creep.carry) {
            console.log(Game.getObjectById(this.creep.memory.storeTarget));
            this.creep.transfer(Game.getObjectById(this.creep.memory.storeTarget), resourceType);
        }
    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }

    findPathToResource() {
        if (this.creep.memory.spawnToResource === undefined) this.creep.memory.spawnToResource = "[]"

        var parsed = JSON.parse(this.creep.memory.spawnToResource);
        if (parsed.length === 0) {
            const targetResource = Game.getObjectById(this.creep.memory.targetResource);
            const pathToTarget = this.creep.pos.findPathTo(targetResource);
            this.creep.memory.spawnToResource = JSON.stringify(pathToTarget);
        }
    }

    findPathToStorage() {

        // creep.memory.storeTargetPath = "[]";
        var myStructures = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: function (object) {
                console.log(object)
                if (object.store != null) {
                    console.log(object.store.getCapacity(RESOURCE_ENERGY));
                }

                return object.store != null;
            }
        });

        if (this.creep.memory.storeTarget) {
            this.creep.memory.storeTarget = myStructures[0].id;
        }
        if (this.creep.memory.storeTargetPath || JSON.parse(this.creep.memory.storeTargetPath).length == 0) {
            const targetStorage = Game.getObjectById(this.creep.memory.storeTarget);
            const pathToTarget = this.creep.pos.findPathTo(targetStorage);
            console.log(JSON.stringify(pathToTarget));
            this.creep.memory.storeTargetPath = JSON.stringify(pathToTarget);
        }

        // console.log(myStructures);    }
    }
}

module.exports = Harvester;