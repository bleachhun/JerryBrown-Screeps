var harvester = require('harvester');
var builder = require('builder');
var guard = require('guard');
var claimer = require('claimer');

var harvesters = [];
var HARVESTER_MIN_COUNT = 4;

var builders = [];
var BUILDER_MIN_COUNT = 2;

var contractors = [];
var CONTRACTOR_MIN_COUNT = 2;

var meleeGuards = [];
var MELEE_GUARD_MIN_COUNT = 2;

var rangedGuards = [];
var RANGED_GUARD_MIN_COUNT = 4;

var claimers = [];
var CLAIMER_MIN_COUNT = 2;

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.ticksToLive != 0) {
        if (creep.memory.role == "harvester") {
            if (!creep.memory.paused) harvester(creep);
            harvesters.push(creep);
        } else if (creep.memory.role == "builder") {
            if (!creep.memory.paused) builder(creep);
            builders.push(creep);
        } else if (creep.memory.role == "contractor") {
            if (!creep.memory.paused) builder(creep);
            contractors.push(creep);
        } else if (creep.memory.role == "meleeGuard") {
            if (!creep.memory.paused) guard(creep);
            meleeGuards.push(creep);
        } else if (creep.memory.role == "rangedGuard") {
            if (!creep.memory.paused) guard(creep);
            rangedGuards.push(creep);
        } else if (creep.memory.role == "claimer") {
           if (!creep.memory.paused) claimer(creep);
           claimers.push(creep);
        }
    }
}

var TYPE_RANGED = "ranged";
var TYPE_MELEE = "melee";
function findFlags(type) {
    var flags = [];
    if (type == TYPE_RANGED) {
        flags = Game.spawns.Spawn1.room.find(FIND_FLAGS, {filter:function(flag) {
            return flag.color == COLOR_BLUE;
        }});
    } else if (type == TYPE_MELEE) {
        flags = Game.spawns.Spawn1.room.find(FIND_FLAGS, {filter:function(flag) {
            return flag.color == COLOR_RED;
        }});
    }
    return flags;
}

function findFreeFlags(type, creeps) {
    return findFlags(type).filter(function(flag) {
        var result = true;
        for (var i in creeps) {
            var creep = creeps[i];
            if (creep.memory.flag.name == flag.name) {
                result = false;
            }
        }
        return result;
    });
}

function checkSpawnable(body, name) {
    var spawnable = Game.spawns.Spawn1.canCreateCreep(body, name);
    if (!spawnable) return true
    else return false
}

var spawnQueue = {
    queue_: [],

    addSpawn: function(role) {
        this.queue_.push(role);
    },

    checkRoleCount: function(role) {
        var types = {};
        for (var i in this.queue_) {
            var type = this.queue_[i];
            if (types[type]) {
                types[type] += 1;
            } else {
                types[type] = 1;
            }
        }

        if (types[role]) return types[role];
        else return 0;
    },

    logQueue: function() {
        console.log(this.queue_);
    },

    clearQueue: function() {
        this.queue_ = [];
    },

    spawn: function() {
        if (this.queue_.length > 0) {
            // Get the item at the top of the queue by reversing the queue,
            // popping, and reversing back to the original order
            this.queue_.reverse();
            var role = this.queue_.pop();
            this.queue_.reverse();

            var creepID = Math.floor((Math.random() * 1000000) + 1);
            var generalBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            var meleeGuardBody = [ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE];
            var rangedGuardBody = [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
            switch (role) {
                case "harvester":
                    return Game.spawns.Spawn1.createCreep(generalBody, "harvester_"+creepID, {role: "harvester"});
                    break;

                case "claimer":
                    return Game.spawns.Spawn1.createCreep(generalBody, "claimer_"+creepID, {role: "claimer"});
                    break;

                case "contractor":
                    return Game.spawns.Spawn1.createCreep(generalBody, "contractor_"+creepID, {role: "contractor", task: "idle"});
                    break;

                case "builder":
                    return Game.spawns.Spawn1.createCreep(generalBody, "builder_"+creepID, {role: "builder", buildOnly: true, task: "idle"});
                    break;

                case "meleeGuard":
                    var freeFlags = findFreeFlags(TYPE_MELEE, meleeGuards);
                    var flagName = "";
                    if (freeFlags[0]) {
                        flagName = freeFlags[0];
                    }

                    return Game.spawns.Spawn1.createCreep(meleeGuardBody, "melee_"+creepID, {role: "meleeGuard", flag: flagName});
                    break;

                case "rangedGuard":
                    var freeFlags = findFreeFlags(TYPE_RANGED, rangedGuards);
                    var flagName = "";
                    if (freeFlags[0]) {
                        flagName = freeFlags[0];
                    }

                    return Game.spawns.Spawn1.createCreep(rangedGuardBody, "ranged_"+creepID, {role: "rangedGuard", flag: flagName});
                    break;

                default:
                    console.log("Unexpected role '"+role+"' on queue");
                    break;
            }
        }
    }
};

if (harvesters.length == 0) {
    // Bad times. Gotta get a new one.
    if (builders.length > 0) builders[0].memory.role = "harvester";
    else if (contractors.length > 0) contractors[0].memory.role = "harvester";
    else if (claimers.length > 0) claimers[0].memory.role = "harvester";
}

if (harvesters.length < HARVESTER_MIN_COUNT) {
    spawnQueue.addSpawn("harvester");
}

if (findFreeFlags(TYPE_MELEE, meleeGuards).length > 0) {
    spawnQueue.addSpawn("meleeGuard");
}

if (findFreeFlags(TYPE_RANGED, rangedGuards).length > 0) {
    spawnQueue.addSpawn("rangedGuard");
}

if (builders.length < BUILDER_MIN_COUNT) {
    spawnQueue.addSpawn("builder");
}

if (contractors.length < CONTRACTOR_MIN_COUNT) {
    spawnQueue.addSpawn("contractor");
}

if (claimers.length < CLAIMER_MIN_COUNT) {
    spawnQueue.addSpawn("claimer");
}

var result = spawnQueue.spawn();
//console.log(result);