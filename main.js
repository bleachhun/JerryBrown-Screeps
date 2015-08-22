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

var guards = [];
var GUARD_MIN_COUNT = 2;

var claimers = [];
var CLAIMER_MIN_COUNT = 2;

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.ticksToLive != 0) {
        if (creep.memory.role == "harvester") {
            harvester(creep);
            harvesters.push(creep);
        } else if (creep.memory.role == "builder") {
            builder(creep);
            builders.push(creep);
        } else if (creep.memory.role == "contractor") {
            builder(creep);
            contractors.push(creep);
        } else if (creep.memory.role == "guard") {
            guard(creep);
            guards.push(creep);
        } else if (creep.memory.role == "claimer") {
           claimer(creep);
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

    spawn: function(body) {
        if (this.queue_.length > 0) {
            // Get the item at the top of the queue by reversing the queue,
            // popping, and reversing back to the original order
            this.queue_.reverse();
            var role = this.queue_.pop();
            this.queue_.reverse();

            var creepID = Math.floor((Math.random() * 1000000) + 1);
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
                    return Game.spawns.Spawn1.createCreep(body, "builder_"+creepID, {role: "builder", buildOnly: true, task: "idle" });
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

if (builders.length < BUILDER_MIN_COUNT) {
    spawnQueue.addSpawn("builder");
}

if (contractors.length < CONTRACTOR_MIN_COUNT) {
    spawnQueue.addSpawn("contractor");
}

if (claimers.length < CLAIMER_MIN_COUNT) {
    spawnQueue.addSpawn("claimer");
}

var result = spawnQueue.spawn([WORK, WORK, CARRY, CARRY, MOVE, MOVE]);
//console.log(result);