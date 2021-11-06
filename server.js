

var fs = require('fs'),
    sys = require('util'),
    redis = require('redis'),
    client =  redis.createClient();

//redis.debug_mode = true;

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
    client.end(true);
}

var init_3 = function(){
    var texts = fs.readdirSync(__dirname + '/texts');
    var s, w, l= texts.length;

    //client.send_command('FLUSHDB', [], redis.print);

    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/lab' + texts[i];
        if(filename.indexOf('.txt')>-1){
            console.log('filename: ' + filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                words = data.split(/\s+/);
                console.log(words);
                for(var j = 0; j < words.length - 2; j++) {
                    s = words[j] + ' ' + words[j+1];
                    w = words[j+2];
                    console.log(s + '- ' + w);
                    client.hincrby(s, w, 1, redis.print);

                }
            });
        }
    }
    client.send_command('info',[],console.log);
    // client.end(true);
}

var randomPair = function(callback) {
    client.randomkey(function(result, key) {
        callback(key.split(' '));
    });
}

var nextWords = function(words, callback) {
    var key = words.join(' ');
    console.log('next key: ' + key);
    if (key == null) { return; }
    client.exists(key, function(err, data) {
        if (data == null) { callback(null); }
        else {
            client.hgetall(key, function(result, data) {
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
                callback([words[1], next]);
            });
        }
    });
}

var randomSentence = function(callback) {
    var sentence = '';
    randomPair( function(words) {
        sentence += ' ' + words[0];
        function build(words) {
            sentence += ' ' + words[1];
            if (/(\.|!|\?)/.exec(sentence)) {
                sys.puts(' = = = ');
                sys.puts(sentence);
                client.end(true);
            } else
            { nextWords(words, build); }
        }
        build(words);
    });
}


if (process.argv[2] == 'init') {
    init();
} else if (process.argv[2] == 'init_3') {
    init_3();
} else if (process.argv[2] == 'rs') {
    randomSentence(function(k){
        console.log(k)
    });
} else {
    randomSentence();
}