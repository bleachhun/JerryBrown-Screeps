module.exports = function(creep) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    if (creep.role != "patrolGuard") {
        creep.moveTo(creep.memory.flag);
    }
    
    if (creep.role == "rangedGuard") {
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 0) {
            creep.rangedMassAttack();
        }
    } else if (creep.role == "meleeGuard") {
        var target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        if(target) {
            creep.moveTo(target);
            creep.attack(target);
        }
    } else if (creep.role = "patrolGuard") {
        if (!creep.memory.targetPos) {
            creep.memory.targetPos = RoomPosition(creep.memory.flag.pos.x,
                                                    creep.memory.flag.pos.y,
                                                    creep.memory.flag.pos.roomName);
        } else {
            if (creep.pos == creep.memory.targetPos) {
                creep.memory.targetPos.x += getRandomInt(-3, 3);
                creep.memory.targetPos.x += getRandomInt(-3, 3);
            }
        }
        creep.moveTo(creep.memory.targetPos);
    }
}