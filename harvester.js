module.exports = function (creep) {
    if(creep.carry.energy < creep.carryCapacity) {
        var droppedEnergy = creep.pos.findClosest(FIND_DROPPED_ENERGY);
        if (droppedEnergy != null) {
            creep.moveTo(droppedEnergy);
            creep.pickup(droppedEnergy);
            return;
        }

        var source = creep.pos.findClosest(FIND_SOURCES);
        if (source != null) {
            creep.moveTo(source);
            creep.harvest(source);
            return;
        }
    } else {
        var structures = creep.room.find(FIND_MY_STRUCTURES);
        for (var i in structures) {
            var structure = structures[i];
            if (structure.structureType == STRUCTURE_EXTENSION) {
                if (structure.energy < structure.energyCapacity) {
                    creep.moveTo(structure);
                    creep.transferEnergy(structure);
                    return;
                }
            } 
        }

        creep.moveTo(Game.spawns.Spawn1);
        creep.transferEnergy(Game.spawns.Spawn1)
    }
}