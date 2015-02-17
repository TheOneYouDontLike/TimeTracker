'use strict';

var sinon = require('sinon');
var assert = require('node-assertthat');
var rewire = require('rewire');
var ActivitiesData = rewire('../activities-data.js');

var fsMock = {
    exists: function(databaseName, callback) {
        if (databaseName === 'existingDatabaseName') {
            callback(true);
        } else {
            callback(false);
        }

    },
    writeFile: function(databaseName, data, callback) {
        var error = null;
        callback(error);
    },
    readFile: function(databaseName, callback) {
        var error = null;
        var fakeActivities = [
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

        callback(error, JSON.stringify(fakeActivities));
    }
};

ActivitiesData.__set__('fs', fsMock);

describe('test', function() {
    it('should not init the database if does exist', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.init(callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.false());
    });

    it('should init the database if does not exist', function() {
        // given
        var activitiesData = new ActivitiesData('nonExistingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.init(callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should return all data', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');

        // when
        activitiesData.getAll(function(error, data) {
            // then
            assert.that(data.length, is.equalTo(2));
        });
    });

    it('should return single activity', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');

        // when
        activitiesData.getById('1', function(error, data) {
            // then
            assert.that(data, is.not.null());
            assert.that(data.name, is.equalTo('Jurassic Park'));
        });
    });
});