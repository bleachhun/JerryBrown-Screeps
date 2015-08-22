module.exports = function (creep) {
    function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
    
    function repairFilter(object) {
        var type = object.structureType;
        return type != "spawn" && type != STRUCTURE_CONTROLLER && (object.hits != object.hitsMax && object.hits < 50000);
    }
    
    function build(creep) {
        var site = creep.pos.findClosest(FIND_CONSTRUCTION_SITES);
        if (site != null) {
            creep.moveTo(site);
            creep.build(site);
            return true;
        } else {
            return false;
        }
    }
    
    function repair(creep) {
        var structure = Game.getObjectById(creep.memory.structureId, {filter:repairFilter});
        if (structure != null) {
            creep.moveTo(structure);
            creep.repair(structure);
            return true;
        } else {
            return false;
        }
    }
    
    function repairNear(creep) {
        var structure = creep.pos.findClosest(FIND_STRUCTURES, {filter:repairFilter});
        if (structure != null) {
            creep.moveTo(structure);
            creep.repair(structure);
            return true;
        } else {
            return false;
        }
    }
    
    function refill(creep) {
        creep.moveTo(Game.spawns.Spawn1);
        Game.spawns.Spawn1.transferEnergy(creep);
    }
    
    var buildOnly = creep.carry.energy == 0 ? false : creep.memory.buildOnly;
    
    if (creep.memory.task == "build"
        || buildOnly) {
        if (!build(creep)) repairNear(creep);
    } else if (creep.memory.task == "repair") {
        repair(creep);
    } else if (creep.memory.task == "refill") {
        refill(creep);
    }
    
    if (creep.carry.energy == 0) {
        creep.memory.task = "refill";
    } else {
        var myStructures = creep.room.find(FIND_STRUCTURES);
        var structureToRepair = null;
        for (var index in myStructures) {
            var structure = myStructures[index];
            var max = 100;
            
            switch (structure.structureType) {
                case STRUCTURE_RAMPART:
                    max = 10000;
                    break;
                case STRUCTURE_ROAD:
                    max = 2500;
                    break;
                case STRUCTURE_WALL:
                    max = 25000;
                    break;
                default:
                    max = 1000;
                    break;
            }
            
            if (structure.hits < clamp(structure.hitsMax, 0, max)) {
                structureToRepair = structure;
                break;
            }
        }
        
        if (structureToRepair != null) {
            creep.memory.task = "repair";
            creep.memory.structureId = structureToRepair.id;
        } else {
            creep.memory.task = "build";
        }
    }
}