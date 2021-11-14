'use strict';

/**
 * Debug output to console
 * 
 * @param {Any} value 
 * @param {String} label 
 */
 var die = (value, label) => {
    console.log('---');
    console.log(label);
    console.log(':::');
    console.dir(value);
    console.log('###');
    process.exit();
}

var debug = (value, label) => {
    console.log('---');
    console.log(label);
    console.log(':::');
    console.dir(value);
    console.log('###');
}

module.exports = {
    die: die,
    debug: debug
};