var fs = require('fs'),
    sys = require('util'),
    redis = require('redis'),
    process = require('process'),
    client =  redis.createClient();

redis.debug_mode = true;

var __die__ = (a,b) => {
    console.log(b);
    console.dir(a);
    process.exit();
}

var init = function() {
    var texts = fs.readdirSync(__dirname + '/texts');
    var s, l = texts.length;
    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/' + texts[i];
        if( filename.indexOf( '.txt' ) > -1) {
            fs.readFile(filename, 'utf-8', function(err, data) {
                var words = data.split(/\s+/);
                for(var j = 0; j < words.length - 1; j++) {
                    console.log(words[j], words[j+1]);
                    client.set(words[j], words[j+1], redis.print);
                }
            });
        }
    }
}

var init_3 = function(){
    let texts = fs.readdirSync(__dirname + '/texts/lab');
    let s, w, l = texts.length;

    client.flushdb( function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
    });

    for(let i = 0; i < l; i++) {
        let filename = __dirname + '/texts/lab/' + texts[i];
        if(filename.indexOf('.txt')>-1){
            console.log('filename: ' + filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                console.log(data, 'data');
                let words = data.split(/\s+/);
                for(var j = 0; j < words.length - 2; j++) {
                    s = words[j] + ' ' + words[j+1];
                    w = words[j+2];
                    console.log(s + '- ' + w);
                    client.set(s, w, redis.print);
                }
            });
        }
    }
}

console.dir(process.argv[2], "Mode: ");

if (process.argv[2] == 'init') {
    init();
} else {
    init_3();
}