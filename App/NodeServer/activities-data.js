'use strict';

var fs = require('fs');
var moment = require('moment');

var NULL_DATA = null;
var ID_TYPE_ERROR = new Error('id parameter should be a string');
var INVALID_DATE_ERROR = new Error('Invalid Date');
var SERIES_WATCHED_IN_CINEMA_ERROR = new Error('Series cannot be watched in the cinema!');

var activitiesData = function(databaseName) {
    var unicorn = {};

    unicorn.init = init;
    unicorn.getAll = getAll;
    unicorn.getById = getById;
    unicorn.remove = remove;
    unicorn.add = add;
    unicorn.update = update;
    unicorn.seed = seed;
    unicorn.checkIfEmpty = checkIfEmpty;

    function init(callback) {
        fs.exists(databaseName, function(exists) {
            if (!exists) {
                _createDatabase(callback);
            }
        });
    }

    function _createDatabase(callback) {
        fs.writeFile(databaseName, JSON.stringify([]), function(error) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('created database');
                callback();
            }
        });
    }

    function getAll(callback) {
        _readDatabase(function(error, data) {
            callback(error, data);
        });
    }

    function getById(id, callback) {
        if (typeof id !== 'string') {
            callback(ID_TYPE_ERROR, NULL_DATA);
        }
        else {
            _readDatabase(function(error, data) {
                var element = data.filter(function(element) {
                    return element.id.toString() === id;
                })[0];

                callback(error, element);
            });
        }
    }

    function remove(id, callback) {
        if (typeof id !== 'string') {
            callback(ID_TYPE_ERROR, NULL_DATA);
        }
        else {
            _readDatabase(function(error, data) {
                var activity = data.filter(function(element) {
                    return element.id.toString() === id;
                })[0];

                var indexOfActivity = data.indexOf(activity);
                data.splice(indexOfActivity, 1);

                _writeDatabase(data, function(error) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('removed from database');
                        callback(error);
                    }
                });
            });
        }
    }

    function add(activity, callback) {
        if (_dateIsInvalid(activity.date)) {
            callback(INVALID_DATE_ERROR, 0);
        }
        else if (_isSeriesWatchedInCinema(activity)) {
            callback(SERIES_WATCHED_IN_CINEMA_ERROR, 0);
        }
        else {
            var timestampId = new Date().getTime();

            _readDatabase(function(error, data) {
                activity.id = timestampId;
                data.push(activity);

                _writeDatabase(data, function(error) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('added to database');
                        callback(error, activity.id);
                    }
                });
            });
        }
    }

    function update(activityToUpdate, callback) {
        if (_dateIsInvalid(activityToUpdate.date)) {
            callback(INVALID_DATE_ERROR);
        }
        else if (_isSeriesWatchedInCinema(activityToUpdate)) {
            callback(SERIES_WATCHED_IN_CINEMA_ERROR);
        }
        else {
            _readDatabase(function(error, data) {
                var activity = data.filter(function(element) {
                    return element.id === activityToUpdate.id;
                })[0];

                var indexOfActivity = data.indexOf(activity);
                data.splice(indexOfActivity, 1);

                data.push(activityToUpdate);

                _writeDatabase(data, function(error) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('updated in database');
                        callback(error);
                    }
                });

            });
        }
    }

    function _dateIsInvalid(date) {
        var parsedDate = moment(date);

        if (!parsedDate.isValid()) {
            return true;
        }

        return false;
    }

    function _isSeriesWatchedInCinema(activity) {
        return activity.activityType === 'Series' && activity.watchedInCinema === true;
    }

    function seed(data) {
        _writeDatabase(data, function(error) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('database seeded');
            }
        });
    }

    function checkIfEmpty(callback) {
        _readDatabase(function(error, data) {
            if(data.length === 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        });
    }

    function _readDatabase(callback) {
        fs.readFile(databaseName, function(error, data) {
            var parsedData = JSON.parse(data.toString());
            callback(error, parsedData);
        });
    }

    function _writeDatabase(data, callback) {
        fs.writeFile(databaseName, JSON.stringify(data), function(error) {
            callback(error);
        });
    }

    return unicorn;
};

module.exports = activitiesData;