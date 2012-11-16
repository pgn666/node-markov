

var fs = require('fs'),
    sys = require('sys'),
    redis = require("./lib/node_redis/index"),
    client =  redis.createClient();

var init = function() {
    client.send_command('info',[],console.log);
    var texts = fs.readdirSync(__dirname + '/texts');
    var s, l = texts.length;
    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/' + texts[i];
        if(filename.indexOf('.txt')>-1){
            console.log(filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                var words = data.split(/\s+/);
                for(var j = 0; j < words.length - 1; j++) {
                    client.hincrby(words[j], words[j+1], 1);
                }
            });
        }
    }
    client.send_command('info',[],console.log);
    client.end();
}

var randomWord = function(callback) {
    client.randomkey(function(result, key) {
        callback(key);
    });
}

var nextWord = function(word, callback) {
    client.exists(word, function(err, data) {
        if (data == null) { callback(null); }
        else {
            client.hgetall(word, function(result, data) {
                var sum = 0;
                console.log(word);
                for (var i in data) {
                    sum += data[i];
                    if (data[i] > 1){
                        console.log(data[i]);
                    }
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
} else {
    randomSentence();
}