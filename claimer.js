module.exports = function (creep) {
    if (creep.memory.task == "claim") {
	    creep.moveTo(creep.room.controller);
        creep.upgradeController(creep.room.controller);
    } else if (creep.memory.task == "refill") {
	    creep.moveTo(Game.spawns.Spawn1);
	    Game.spawns.Spawn1.transferEnergy(creep);
    }
    
    if (creep.carry.energy == creep.carryCapacity) {
	    creep.memory.task = "claim";
    } else if (creep.carry.energy == 0) {
	    creep.memory.task = "refill";
    }
}