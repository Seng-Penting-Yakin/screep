class Builder {
    constructor(creep) {
        this.creep = creep;
    }

    run() {
        if (this.creep.memory.working)
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
        this.findStorageStructure();
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

    findStorageStructure() {
        let nearestConstructionSite = this.creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
        this.creep.memory.constructionSiteTarget = nearestConstructionSite.id;

    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }
}

module.exports = Builder;
