'use strict';

var fs = require('fs');

var jsonPersistance = function(fileName) {
    var unicorn = {};

    unicorn.init   = init;
    unicorn.add    = add;
    unicorn.getAll = getAll;
    unicorn.query  = query;
    unicorn.update = update;
    unicorn.remove = remove;

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

    function query(filteringFunction, callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            if (error) {
                callback(error, null);
            } else {
                var parsedData = JSON.parse(dataChunk.toString());

                var filteredData = [];

                parsedData.forEach(function(element, index, array) {
                    if (filteringFunction(element)) {
                        filteredData.push(element);
                    }
                });

                callback(null, filteredData);
            }
        });
    }

    function update(filteringFunction, updatingFunction, callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            if (error) {
                callback(error);
            } else {
                var parsedData = JSON.parse(dataChunk.toString());

                parsedData.forEach(function(element, index, array) {
                    if (filteringFunction(element)) {
                        updatingFunction(element);
                    }
                });

                fs.writeFile(fileName, JSON.stringify(parsedData), function(error) {
                    callback(error);
                });
            }
        });
    }

    function remove(filteringFunction, callback) {
        fs.readFile(fileName, function(error, dataChunk) {
            if (error) {
                callback(error);
            } else {
                var parsedData = JSON.parse(dataChunk.toString());

                var filteredData = [];

                parsedData.forEach(function(element, index, array) {
                    if (!filteringFunction(element)) {
                        filteredData.push(element);
                    }
                });

                fs.writeFile(fileName, JSON.stringify(filteredData), function(error) {
                    callback(error);
                });
            }
        });
    }

    return unicorn;
};

module.exports = jsonPersistance;