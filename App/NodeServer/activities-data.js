'use strict';

var fs = require('fs');

var activitiesData = function(databaseName) {
    var unicorn = {};

    _init();

    unicorn.getAll = getAll;
    unicorn.byId = byId;
    unicorn.remove = remove;
    unicorn.add = add;
    unicorn.update = update;
    unicorn.seed = seed;

    function getAll(callback) {
        _readDatabase(function(error, data) {
            callback(error, data);
        });
    }

    function byId(id, callback) {
        _readDatabase(function(error, data) {
            var element = data.filter(function(element) {
                return element.id.toString() === id;
            })[0];

            callback(error, element);
        });
    }

    function remove(id, callback) {
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

    function add(activity, callback) {
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

    function update(activityToUpdate, callback) {
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

    function seed() {
        var data = [
            {
                id: 1,
                name: 'Jurassic Park',
                date: '2014-01-01',
                duration: 120,
                activityType: 'Movie',
                watchedInCinema: false
            },
            {
                id: 2,
                name: 'Jurassic Park II',
                date: '2014-01-02',
                duration: 130,
                activityType: 'Movie',
                watchedInCinema: true
            }];

        _writeDatabase(data, function(error) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('database seeded');
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

    function _init() {
        fs.exists(databaseName, function(exists) {
            if (!exists) {
                fs.writeFile(databaseName, JSON.stringify([]), function(error) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('created database');
                    }
                });
            }
        });
    }

    return unicorn;
};

module.exports = activitiesData;