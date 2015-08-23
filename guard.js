module.exports = function(creep) {
    var flags = creep.room.find(FIND_FLAGS);
    var target;
    for (var index in flags) {
        var flag = flags[index];
        if (flag.name == creep.memory.flag.name) {
            target = flag;
            break;
        }
    }
    if (target) creep.moveTo(target);
    
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
    }
}