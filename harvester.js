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
            let transferStatus = this.creep.transfer(targetStorage, resourceType)
            console.log(transferStatus)
            switch (transferStatus) {
                case ERR_NOT_IN_RANGE :
                    this.creep.moveByPath(storagePath);
                    break;
                case ERR_FULL :
                    this.creep.memory.pathToStorage = "[]";
            }

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
        let structure_id = this.findStorageStructure();
        this.creep.memory.storeTarget = structure_id;
        const targetStorage = Game.getObjectById(structure_id);

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
        let myStructures = this.findMyStructures()
        if (myStructures.length > 0) return myStructures[0].id;

        myStructures = this.findNeutralStorageStructures()
        if (myStructures.length > 0) return myStructures[0].id;
    }

    findMyStructures() {
        return this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                let type = structure.structureType
                if (type === STRUCTURE_CONTROLLER) return;

                return structure.store.getFreeCapacity[RESOURCE_ENERGY] > 0
            }
        });
    }

    findNeutralStorageStructures() {
        return this.creep.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                let type = structure.structureType

                if (!(type === STRUCTURE_CONTAINER)) return;

                return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        });
    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }
}

module.exports = Harvester;