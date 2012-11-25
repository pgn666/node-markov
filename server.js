

var fs = require('fs'),
    sys = require('sys'),
    redis = require("./lib/node_redis/index"),
    client =  redis.createClient();

//client.send_command('select', ['markov'], redis.print); ;

var init = function() {
    //client.send_command('FLUSHALL', [], redis.print);

    var texts = fs.readdirSync(__dirname + '/texts');
    var a, s, l = texts.length;
    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/' + texts[i];
        if(filename.indexOf('.txt')>-1){
            console.log(filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                var words = data.split(/\s+/);
                for(var j = 0; j < words.length - 1; j++) {
                    a = client.hincrby(words[j], words[j+1], 1);
                    console.log(a);
                    client.hgetall(words[j], function(result, data){
                        console.log('result ' + result);
                        console.log('data: ' + data);
                    });
                }
            });
        }
    }
    client.end();
}

var init_3 = function() {
    //client.send_command('FLUSHALL', [], redis.print);
    var texts = fs.readdirSync(__dirname + '/texts');
    var a, l = texts.length;
    var pair = '';
    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/' + texts[i];
        if(filename.indexOf('.txt')>-1){
            console.log(filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                var words = data.split(/\s+/);
                for(var j = 0; j < words.length - 2; j++) {
                    a = client.hincrby(words[j] + ' ' + words[j+1], words[j+2], 1);
                    console.log(a);
                    a = client.hgetall(words[j] + ' ' + words[j+1], function(result, data){
                        console.log(result);
                        console.log(data);
                    });
                    console.log(a);
                }
            });
        }
    }
    client.end();
}

var randomWord = function(callback) {
    client.randomkey(function(result, key) {
        callback(key);
    });
}

var nextWord = function(word, callback) {
    console.log(word);
    client.exists(word, function(err, data) {
        if (data == null) { callback(null); }
        else {
            client.hgetall(word, function(result, data) {
                var sum = 0;
                for (var i in data) {
                    sum += data[i];
                }
                var rand = Math.floor(Math.random()*sum+1);
                var partial_sum = 0;
                var next = null;
                for (var i in data) {
                    partial_sum += data[i];
                    if (partial_sum >= rand) { next = i; }
                }
                callback(next);
            });
        }
    });
}

var randomSentence = function(callback) {
    var sentence = '';
    randomWord( function(word) {
        function build(next) {
            sentence += ' ' + next;
            if (/(\.|!|\?)/.exec(sentence)) {
                sys.puts(sentence);
                client.end();
            } else
            { nextWord(next, build); }
        }
        build(word);
    });
}


if (process.argv[2] == 'init') {
    init();
} if (process.argv[2] == 'init_3') {
    init_3();
} else {
    randomSentence();
}

return;