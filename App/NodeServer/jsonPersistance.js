'use strict';

var fs = require('fs');

var jsonPersistance = function(fileName) {
    var unicorn = {};

    unicorn.init = init;

    function init(callback) {
        fs.exists(fileName, function(exists) {
            if (!exists) {
                _initializeJsonFile(function(error) {
                    callback(error);
                });
            }
            else {
                var error = new Error('File already exists');
                callback(error);
            }
        });
    }

    function _initializeJsonFile(callback) {
        fs.writeFile(fileName, JSON.stringify([]), function(error) {
            callback(error);
        });
    }

    return unicorn;
};

module.exports = jsonPersistance;