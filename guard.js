module.exports = function(creep) {
    var flags = creep.room.find(FIND_FLAGS);
    var target;
    for (var index in flags) {
        var flag = flags[index];
        if (flag.name == creep.name) {
            target = flag;
        }
    }
    if (target) creep.moveTo(target);
    
    if (creep.memory.guardRole == "ranged") {
        
    } else if (creep.memory.guardRole == "melee") {
        
    }
}