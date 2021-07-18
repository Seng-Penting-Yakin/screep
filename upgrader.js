class Upgrader {
    constructor(creep) {
        this.creep = creep;
    }

    run() {
        if (this.creep.memory.isCarryEmpty)
            this.fetchResources();
        else
            this.Upgrade();
    }

    fetchResources() {
        this.creep.memory.pathToController = "[]";
        let resourceAndPath = this.findResourceAndPath();
        let pathToResource = resourceAndPath.path
        let targetResource = resourceAndPath.target

        if (this.creep.harvest(targetResource) === ERR_NOT_IN_RANGE) {
            this.creep.move(pathToResource[0].direction)
            pathToResource.shift()
            this.creep.memory.pathToResource = JSON.stringify(pathToResource);
        }
    }

    Upgrade() {
        this.creep.memory.pathToResource = "[]";
        let controllerAndPath = this.findControllerAndPath(this.creep);
        let controllerPath = controllerAndPath.path
        let targetController = controllerAndPath.target

        if (this.creep.upgradeController(targetController) === ERR_NOT_IN_RANGE)
            this.creep.moveByPath(controllerPath);
    }


    findResourceAndPath() {
        this.chooseTargetResource();
        if (this.creep.memory.pathToResource === undefined) this.creep.memory.pathToResource = "[]"

        let pathToResource = JSON.parse(this.creep.memory.pathToResource);
        const targetResource = Game.getObjectById(this.creep.memory.targetResource);

        if (pathToResource.length === 0) {
            const pathToTarget = this.creep.pos.findPathTo(targetResource);
            this.creep.memory.pathToResource = JSON.stringify(pathToTarget);
        }
        return {
            path: JSON.parse(this.creep.memory.pathToResource),
            target: targetResource
        }
    }

    findControllerAndPath() {
        const targetController = this.creep.room.controller
        this.creep.memory.controllerTarget = targetController.id

        if (!this.creep.memory.pathToController || JSON.parse(this.creep.memory.pathToController).length === 0) {
            const pathToTarget = this.creep.pos.findPathTo(targetController);
            this.creep.memory.pathToController = JSON.stringify(pathToTarget);
        }

        return {
            path: JSON.parse(this.creep.memory.pathToController),
            target: targetController
        }
    }

    chooseTargetResource() {
        if (!this.creep.memory.targetResource) {
            this.creep.memory.targetResource = this.creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE).id;
        }
    }
}

module.exports = Upgrader