/**
 * Created with JetBrains PhpStorm.
 * User: maciejzych
 * Date: 24.11.2012
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */

var redis = require("./lib/node_redis/index"),
    client =  redis.createClient();

redis.debug_mode = true;


client.hincrby('test', 'a', 1, redis.print);
client.hincrby('test', 'b', 2, redis.print);