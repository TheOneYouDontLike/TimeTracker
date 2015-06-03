'use strict';

var moment          = require('moment'),
    JsonPersistence = require('./jsonPersistence.js');

var NULL_DATA                      = null,
    ID_TYPE_ERROR                  = new Error('id parameter should be a string'),
    INVALID_DATE_ERROR             = new Error('Invalid Date'),
    SERIES_WATCHED_IN_CINEMA_ERROR = new Error('Series cannot be watched in the cinema!');

var activitiesData = function(databaseName) {
    var persistence = new JsonPersistence(databaseName);

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
        persistence.init(function(error) {
            if (error) {
                console.log(error.message);
                callback(error);
            } else {
                callback(null);
            }
        });
    }

    function getAll(callback) {
        persistence.getAll(function(error, data) {
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
        } else {
            var filteringFunction = function(element) {
                return element.id.toString() === id;
            };

            persistence.query(filteringFunction, function(error, data) {
                if (error) {
                    callback(error, null);
                } else {
                    callback(null, data[0]);
                }
            });
        }
    }

    function remove(id, callback) {
        if (typeof id !== 'string') {
            callback(ID_TYPE_ERROR, NULL_DATA);
        } else {
            var filteringFunction = function(element) {
                return element.id.toString() === id;
            };

            persistence.remove(filteringFunction, function(error) {
                callback(error);
            });
        }
    }

    function add(activity, callback) {
        if (_dateIsInvalid(activity.date)) {
            callback(INVALID_DATE_ERROR, 0);
        } else if (_isSeriesWatchedInCinema(activity)) {
            callback(SERIES_WATCHED_IN_CINEMA_ERROR, 0);
        } else {
            var timestampId = new Date().getTime();

            activity.id = timestampId;

            persistence.add(activity, function(error) {
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
        } else if (_isSeriesWatchedInCinema(activityToUpdate)) {
            callback(SERIES_WATCHED_IN_CINEMA_ERROR);
        } else {
            var filteringFunction = function(element) {
                return element.id === activityToUpdate.id;
            };

            var updatingFunction = function(element) {
                element.watchedInCinema = activityToUpdate.watchedInCinema;
                element.name = activityToUpdate.name;
                element.date = activityToUpdate.date;
                element.duration = activityToUpdate.duration;
                element.activityType = activityToUpdate.activityType;
            };

            persistence.update(filteringFunction, updatingFunction, function(error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('updated in database');
                    callback(error);
                }
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
        persistence.addRange(data, function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log('database seeded');
            }
        });
    }

    function checkIfEmpty(callback) {
        persistence.checkIfEmpty(function(error, result) {
            callback(result);
        });
    }

    return unicorn;
};

module.exports = activitiesData;