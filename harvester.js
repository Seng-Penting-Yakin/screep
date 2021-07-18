class Harvester {
    constructor(creep) {
        this.creep = creep;
    }

    run() {

        if (this.creep.memory.isCarryEmpty)
            this.harvestResource();
        else
            this.carry();
    }

    harvestResource() {
        this.creep.memory.pathToStorage = "[]";
        let resourceAndPath = this.findResourceAndPath();
        let pathToResource = resourceAndPath.path
        let targetResource = resourceAndPath.target

        if (this.creep.harvest(targetResource) === ERR_NOT_IN_RANGE) {
            this.creep.move(pathToResource[0].direction)
            pathToResource.shift()
            this.creep.memory.spawnToResource = JSON.stringify(pathToResource);
        }
    }

    carry() {
        this.creep.memory.spawnToResource = "[]";
        let storageAndPath = this.findStorageAndPath(this.creep);
        let storagePath = storageAndPath.path
        let targetStorage = storageAndPath.target

        for (const resourceType in this.creep.carry) {
            if (this.creep.transfer(targetStorage, resourceType) === ERR_NOT_IN_RANGE)
                this.creep.moveByPath(storagePath);
        }
    }


    findResourceAndPath() {
        this.chooseTargetResource();
        if (this.creep.memory.spawnToResource === undefined) this.creep.memory.spawnToResource = "[]"

        let spawnToResourcePath = JSON.parse(this.creep.memory.spawnToResource);
        const targetResource = Game.getObjectById(this.creep.memory.targetResource);

        if (spawnToResourcePath.length === 0) {
            const pathToTarget = this.creep.pos.findPathTo(targetResource);
            this.creep.memory.spawnToResource = JSON.stringify(pathToTarget);
        }
        return {
            path: JSON.parse(this.creep.memory.spawnToResource),
            target: targetResource
        }
    }

    findStorageAndPath() {
        this.findStorageStructure();
        const targetStorage = Game.getObjectById(this.creep.memory.storeTarget);

        if (!this.creep.memory.pathToStorage || JSON.parse(this.creep.memory.pathToStorage).length === 0) {
            const pathToTarget = this.creep.pos.findPathTo(targetStorage);
            this.creep.memory.pathToStorage = JSON.stringify(pathToTarget);
        }

        return {
            path: JSON.parse(this.creep.memory.pathToStorage),
            target: targetStorage
        }
    }

    findStorageStructure() {
        let myStructures = this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: function (object) {
                // if (object.store != null) {
                //     console.log(object.store.getCapacity(RESOURCE_ENERGY));
                // }

                return object.store != null;
            }
        });
        this.creep.memory.storeTarget = myStructures[0].id;

    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }
}

module.exports = Harvester;