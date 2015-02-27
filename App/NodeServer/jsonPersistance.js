'use strict';

var fs = require('fs');

var jsonPersistance = function(fileName) {
    var unicorn = {};

    unicorn.init = init;
    unicorn.add = add;
    unicorn.getAll = getAll;

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

    function getAll(callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            if (error) {
                callback(error, null);
            } else {
                var parsedData = JSON.parse(dataChunk.toString());
                callback(null, parsedData);
            }
        });
    }

    function add(data, callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            if (error) {
                callback(error);
            } else {
                var parsedData = JSON.parse(dataChunk.toString());
                parsedData.push(data);

                fs.writeFile(fileName, JSON.stringify(parsedData), function(error) {
                    callback(error);
                });
            }
        });
    }

    return unicorn;
};

module.exports = jsonPersistance;