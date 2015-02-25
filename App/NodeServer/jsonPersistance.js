'use strict';

var fs = require('fs');

var jsonPersistance = function(fileName) {
    var unicorn = {};

    unicorn.init = init;
    unicorn.add = add;

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

    function add(data, callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            var parsedData = JSON.parse(dataChunk.toString());
            parsedData.push(data);
            callback();
        });
    }

    return unicorn;
};

module.exports = jsonPersistance;