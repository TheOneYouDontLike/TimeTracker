'use strict';

var sinon = require('sinon');
var assert = require('node-assertthat');
var rewire = require('rewire');
var ActivitiesData = rewire('../activities-data.js');

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

        callback(error, JSON.stringify(fakeActivities));
    }
};

ActivitiesData.__set__('fs', fsMock);

describe('persistance tests', function() {
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
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getAll(callbackSpy);

        // then
        var data = callbackSpy.getCall(0).args[1];
        assert.that(data.length, is.equalTo(2));
    });

    it('should return single activity', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getById('1', callbackSpy);

        // then
        var data = callbackSpy.getCall(0).args[1];
        assert.that(data, is.not.null());
        assert.that(data.name, is.equalTo('Jurassic Park'));
    });

    it('should throw meat at me if "id" paremeter of getById method is not an string', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getById(0, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        var data = callbackSpy.getCall(0).args[1];
        assert.that(error.message, is.equalTo('id parameter should be a string'));
        assert.that(data, is.null());
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

    it('should call back with error if "id" parameter of remove method is not a string', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.remove(0, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo('id parameter should be a string'));
    });

    it('should add new activity', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackStub = sinon.stub();

        fsMock.writeFile = callbackStub;

        var newExpectedActivity = {
            name: 'The Producers',
            date: '2014-02-15',
            duration: 120,
            activityType: 'Movie',
            watchedInCinema: false
        };

        // when
        activitiesData.add(newExpectedActivity, function() {});

        // then
        assert.that(JSON.parse(callbackStub.getCall(0).args[1]).length, is.equalTo(3));
    });

    it('should not add new activiy if it is a series watched in the cinema', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        var newExpectedActivity = {
            name: 'The Simpsons',
            date: '2014-02-15',
            duration: 120,
            activityType: 'Series',
            watchedInCinema: true
        };

        // when
        activitiesData.add(newExpectedActivity, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        var id = callbackSpy.getCall(0).args[1];
        assert.that(error.message, is.equalTo('Series cannot be watched in the cinema!'));
        assert.that(id, is.equalTo(0));
    });

    it('should update the activity', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackStub = sinon.stub();

        fsMock.writeFile = callbackStub;

        var newName = 'How I met your mother';
        var activityToUpdate = fakeActivities[0];
        activityToUpdate.name = newName;

        // when
        activitiesData.update(activityToUpdate, function() {});

        // then
        var data = callbackStub.getCall(0).args[1];
        assert.that(data.indexOf('How I met your mother'), is.not.equalTo(-1));
    });
});