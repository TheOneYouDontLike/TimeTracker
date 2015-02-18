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

    it('should throw meat at me if "id" paremeter of getById method is not an string', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');

        // when
        activitiesData.getById(0, function(error, data) {
            // then
            assert.that(error.message, is.equalTo('id parameter should be a string'));
            assert.that(data, is.null());
        });
    });

    it('should remove activity if it does exist', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackStub = sinon.stub();

        fsMock.writeFile = callbackStub;
        var expectedData = [{
                id: 2,
                name: 'Jurassic Park II',
                date: '2014-01-02',
                duration: 130,
                activityType: 'Movie',
                watchedInCinema: true
            }];

        // when
        activitiesData.remove("1", function() {});

        // then
        assert.that(callbackStub.getCall(0).args[1], is.equalTo(JSON.stringify(expectedData)));
    });
});