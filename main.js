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
            var rangedGuardBody = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE];
            switch (role) {
                case "harvester":
                    return Game.spawns.Spawn1.createCreep(body, "harvester_"+creepID, {role: "harvester"});
                    break;

                case "claimer":
                    return Game.spawns.Spawn1.createCreep(body, "claimer_"+creepID, {role: "claimer"});
                    break;

                case "contractor":
                    return Game.spawns.Spawn1.createCreep(body, "contractor_"+creepID, {role: "contractor", task: "idle"});
                    break;

                case "builder":
                    return Game.spawns.Spawn1.createCreep(body, "builder_"+creepID, {role: "builder", buildOnly: true, task: "idle"});
                    break;

                case "meleeGuard":
                    return Game.spawns.Spawn1.createCreep(meleeGuardBody, "melee_"+creepID, {role: "meleeGuard"});
                    break;

                case "rangedGuard":
                    return Game.spawns.Spawn1.createCreep(rangedGuardBody, "ranged_"+creepID, {role: "rangedGuard"});
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

if (meleeGuards.length < MELEE_GUARD_MIN_COUNT) {
    spawnQueue.addSpawn("meleeGuard");
}

if (rangedGuards.length < RANGED_GUARD_MIN_COUNT) {
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