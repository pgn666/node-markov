var fs = require('fs'),
    sys = require('util'),
    process = require('process'),
    client = require('./lib/redisClient'),
    helpers = require('./lib/helpers');

/**
 * Flush redis database
 */
 var flushDB = (mode) => {
    helpers.debug('Flushing DB');
    client.flushdb((err, success) => {
        success ? helpers.debug(success, 'success') : helpers.debug(error, 'error');
        if ('exit' === mode){
            console.log('process.exit');
            process.exit();
        }
    });
}

/**
 * Reads /texts dir and sets valiues for pairs fpund
 * 
 */
var init = function() {
    var texts = fs.readdirSync(__dirname + '/texts');
    var s, l = texts.length;
    for(var i = 0; i < l; i++) {
        var filename = __dirname + '/texts/' + texts[i];
        if( filename.indexOf( '.txt' ) > -1) {
            fs.readFile(filename, 'utf-8', function(err, data) {
                helpers.debug(data, 'file data');
                var words = data.split(/\s+/);
                for(var j = 0; j < words.length - 1; j++) {
                    var key = words[j] + ":" + words[j+1];
                    console.log('key', key)
                    client.INCR(key);
                }
            });
        }
    }
}

/**
 * reads '/tests/lab' folder and creats data for paris, whre first item a a pair is atullay two words
 */
var init_triplets = function(flush) {
    let texts = fs.readdirSync(__dirname + '/texts/lab');
    let s, w, l = texts.length;

    for(let i = 0; i < l; i++) {
        let filename = __dirname + '/texts/lab/' + texts[i];
        if(filename.indexOf('.txt') > -1) {
            helpers.debug('filename: ' + filename);
            fs.readFile(filename, 'utf-8', function(err, data) {
                helpers.debug(data, 'data');
                let words = data.split(/\s+/);
                for(var j = 0; j < words.length - 2; j++) {
                    var key = words[j] + ' ' + words[j+1] +  ":" + words[j+2];
                    console.log('key', key)
                    client.INCR(key);
                }
            });
        }
    }
}

const mode = process.argv[2];
const withFlush = !!process.argv[3]

helpers.debug("Mode: ", mode);
helpers.debug("With additional Flush: ", withFlush);

withFlush ? flushDB() : helpers.debug('no additinal flush DB run');

switch(mode) {
    case '2':
        init();
        break;
    case '3':
        init_triplets();
        break;
    case 'flushDB':
        flushDB('exit');
        break;
    default:
        helpers.debug('available modes "2" - init pairs, "3" - init triplets and  "flushDB"')
}