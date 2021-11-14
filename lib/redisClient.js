'use strict';

var redis = require('redis');
var client =  redis.createClient();

//redis.debug_mode = true;
var logme = console;

client.on("error", function(err) {
    logme.error("Bonk. The worker framework cannot connect to redis, which might be ok on a dev server!");
    logme.error("Resque error : "+err);
    client.quit();
});

client.on("idle", function(err) {
    logme.error("Redis queue is idle. Shutting down...");
});

client.on("end", function(err) {
    logme.error("Redis is shutting down. This might be ok if you chose not to run it in your dev environment");
});

client.on("ready", function(err) {
    logme.info("Redis up! Now connecting the worker queue client...");
});

client.print = redis.print;

module.exports = client;