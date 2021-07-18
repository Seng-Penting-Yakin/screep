class Builder {
    constructor(creep) {
        this.creep = creep;
    }

    run() {
        if (this.creep.memory.isCarryEmpty)
            this.fetchResources();
        else
            this.buildOrRepair();
    }

    fetchResources() {
        this.creep.memory.pathToConstructionSite = "[]";
        let resourceAndPath = this.findResourceAndPath();
        let pathToResource = resourceAndPath.path
        let targetResource = resourceAndPath.target

        if (this.creep.harvest(targetResource) === ERR_NOT_IN_RANGE) {
            this.creep.move(pathToResource[0].direction)
            pathToResource.shift()
            this.creep.memory.spawnToResource = JSON.stringify(pathToResource);
        }
    }

    buildOrRepair() {
        this.creep.memory.spawnToResource = "[]";
        let constructionAndPath = this.findConstructionAndPath(this.creep);
        let constructionPath = constructionAndPath.path
        let targetConstruction = constructionAndPath.target

        if (this.creep.build(targetConstruction) === ERR_NOT_IN_RANGE)
            this.creep.moveByPath(constructionPath);

        if (this.creep.repair(targetConstruction) === ERR_NOT_IN_RANGE)
            this.creep.moveByPath(constructionPath);
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

    findConstructionAndPath() {
        this.findConstructionStructure();
        const targetStorage = Game.getObjectById(this.creep.memory.constructionSiteTarget);

        if (!this.creep.memory.pathToConstructionSite || JSON.parse(this.creep.memory.pathToConstructionSite).length === 0) {
            const pathToTarget = this.creep.pos.findPathTo(targetStorage);
            this.creep.memory.pathToConstructionSite = JSON.stringify(pathToTarget);
        }

        return {
            path: JSON.parse(this.creep.memory.pathToConstructionSite),
            target: targetStorage
        }
    }

    findConstructionStructure() {
        let nearestConstructionSite = this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
        if (nearestConstructionSite) {
            this.creep.memory.constructionSiteTarget = nearestConstructionSite.id;
            return;
        }

        nearestConstructionSite = this.findMyBrokenStructure()
        if (nearestConstructionSite.length > 0) {
            this.creep.memory.constructionSiteTarget = nearestConstructionSite[0].id
            return;
        }

        nearestConstructionSite = this.findBrokenRoadAndContainer()
        if (nearestConstructionSite.length > 0) {
            this.creep.memory.constructionSiteTarget = nearestConstructionSite[0].id
        }

    }

    findMyBrokenStructure() {
        return this.creep.room.find(FIND_MY_STRUCTURES, {
            filter: function (structure) {
                if (structure.structureType === STRUCTURE_CONTROLLER) return;
                return structure.hits < structure.hitsMax
            }
        });
    }

    findBrokenRoadAndContainer() {
        return this.creep.room.find(FIND_STRUCTURES, {
            filter: function (structure) {
                let type = structure.structureType

                if (!(type === STRUCTURE_ROAD || type === STRUCTURE_CONTAINER)) return;

                return structure.hits < structure.hitsMax
            }
        });
    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }
}

module.exports = Builder;
