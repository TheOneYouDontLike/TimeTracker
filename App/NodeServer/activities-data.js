'use strict';

var fs              = require('fs'),
    moment          = require('moment'),
    JsonPersistence = require('./jsonPersistence.js');

var NULL_DATA                      = null,
    ID_TYPE_ERROR                  = new Error('id parameter should be a string'),
    INVALID_DATE_ERROR             = new Error('Invalid Date'),
    SERIES_WATCHED_IN_CINEMA_ERROR = new Error('Series cannot be watched in the cinema!');

var activitiesData = function(databaseName) {
    var persistance = new JsonPersistence(databaseName);

    var unicorn = {};

    unicorn.init         = init;
    unicorn.getAll       = getAll;
    unicorn.getById      = getById;
    unicorn.remove       = remove;
    unicorn.add          = add;
    unicorn.update       = update;
    unicorn.seed         = seed;
    unicorn.checkIfEmpty = checkIfEmpty;

    function init(callback) {
        persistance.init(function(error) {
            if (error) {
                console.log(error.message);
                callback(error);
            } else {
                callback(null);
            }
        });
    }

    function getAll(callback) {
        persistance.getAll(function(error, data) {
            if (error) {
                var readingError = new Error('Error during reading data');
                callback(readingError, null);
            } else {
                callback(null, data);
            }
        });
    }

    function getById(id, callback) {
        if (typeof id !== 'string') {
            callback(ID_TYPE_ERROR, NULL_DATA);
        }
        else {
            var filteringFunction = function(element) {
                return element.id.toString() === id;
            };

            persistance.query(filteringFunction, function(error, data) {
                if (error) {
                    callback(error, null);
                }
                else {
                    callback(null, data[0]);
                }
            });
        }
    }

    function remove(id, callback) {
        if (typeof id !== 'string') {
            callback(ID_TYPE_ERROR, NULL_DATA);
        }
        else {
            var filteringFunction = function(element) {
                return element.id.toString() === id;
            };

            persistance.remove(filteringFunction, function(error) {
                callback(error);
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

            activity.id = timestampId;

            persistance.add(activity, function(error) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, activity.id);
                }
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
            console.log(activityToUpdate);
            var filteringFunction = function(element) {
                return element.id === activityToUpdate.id;
            };

            var updatingFunction = function(element) {
                element = activityToUpdate;
            };

            persistance.update(filteringFunction, updatingFunction, function(error) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('updated in database');
                    callback(error);
                }
            });
            // _readDatabase(function(error, data) {
            //     var activity = data.filter(function(element) {
            //         return element.id === activityToUpdate.id;
            //     })[0];

            //     var indexOfActivity = data.indexOf(activity);
            //     data.splice(indexOfActivity, 1);

            //     data.push(activityToUpdate);

            //     _writeDatabase(data, function(error) {

            //     });

            // });
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