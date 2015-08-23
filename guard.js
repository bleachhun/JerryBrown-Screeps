module.exports = function(creep) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    if (creep.memory.role != "patrolGuard") {
        creep.moveTo(creep.memory.flag.pos.x, creep.memory.flag.pos.y);
    }
    
    if (creep.memory.role == "rangedGuard") {
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (targets.length > 0) {
            creep.rangedMassAttack();
        }
    } else if (creep.memory.role == "meleeGuard") {
        var target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        if (target.length > 0) {
            creep.moveTo(target);
            creep.attack(target);
        }
    } else if (creep.memory.role == "patrolGuard") {
        if (creep.memory.targetPos.x == undefined) {
            creep.memory.targetPos = creep.memory.flag.pos;
        } else {
            if (creep.pos.x == creep.memory.targetPos.x
                && creep.pos.y == creep.memory.targetPos.y
                && creep.pos.roomName == creep.memory.targetPos.roomName) {
                
                creep.memory.targetPos.x = creep.memory.flag.pos.x + getRandomInt(-2, 2);
                creep.memory.targetPos.y = creep.memory.flag.pos.y + getRandomInt(-2, 2);
            }
        }

        var target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (target.length > 0) {
            creep.moveTo(target);
            creep.attack(target);
        } else {
            creep.moveTo(creep.memory.targetPos.x, creep.memory.targetPos.y);
        }
    }
}