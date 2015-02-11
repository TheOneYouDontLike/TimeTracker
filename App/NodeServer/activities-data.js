'use strict';

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

var activitiesData = function() {
    var unicorn = {};

    unicorn.getAll = getAll;
    unicorn.byId = byId;
    unicorn.remove = remove;
    unicorn.add = add;
    unicorn.update = update;

    function getAll() {
        return data;
    }

    function byId(id) {
        var activity = data.filter(function(element) {
            return element.id.toString() === id;
        })[0];

        return activity;
    }

    function remove(id) {
        var activity = data.filter(function(element) {
            return element.id.toString() === id;
        })[0];

        var indexOfActivity = data.indexOf(activity);
        data.splice(indexOfActivity, 1);
    }

    function add(activity) {
        activity.id = 666;

        data.push(activity);

        return activity.id;
    }

    function update(activityToUpdate) {
        var activity = data.filter(function(element) {
            return element.id === activityToUpdate.id;
        })[0];

        activity = activityToUpdate;
    }

    return unicorn;
};

module.exports = activitiesData;