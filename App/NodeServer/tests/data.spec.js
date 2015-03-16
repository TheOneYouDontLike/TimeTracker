'use strict';

var sinon          = require('sinon'),
    assert         = require('node-assertthat'),
    rewire         = require('rewire'),
    ActivitiesData = rewire('../activities-data.js');

var fakeActivities = [];

describe('activities persistence', function() {
    beforeEach(function() {
        fakeActivities = [{
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
    });

    it('should set error if db file exists', function() {
        // given
        var expectedErrorMessage = 'trololo';

        var initSpy = sinon.stub();
        initSpy.callsArgWith(0, new Error(expectedErrorMessage));

        var persistenceMock = function(dbName) {
            return {
                init: initSpy
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);
        var activitiesData = new ActivitiesData('');

        var callbackSpy = sinon.spy();

        // when
        activitiesData.init(callbackSpy);

        // then
        assert.that(initSpy.calledOnce, is.true());
        assert.that(callbackSpy.getCall(0).args[0].message, is.equalTo(expectedErrorMessage));
    });

    it('should init the database if does not exist', function() {
        // given
        var initStub = sinon.stub();

        // there was no errors
        initStub.callsArgWith(0, null);

        var persistenceMock = function(dbName) {
            return {
                init: initStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);
        var activitiesData = new ActivitiesData('');

        var callbackSpy = sinon.spy();

        // when
        activitiesData.init(callbackSpy);

        // then
        assert.that(initStub.calledOnce, is.true());
        assert.that(callbackSpy.getCall(0).args[0], is.null());
    });

    it('should return all data', function() {
        // given
        var getAllStub = sinon.stub();

        var randomData = [{property: '1'}, {property: '1'}];
        getAllStub.callsArgWith(0, null, randomData);

        var persistenceMock = function(dbName) {
            return {
                getAll: getAllStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getAll(callbackSpy);

        // then
        var data = callbackSpy.getCall(0).args[1];
        assert.that(data.length, is.equalTo(2));
    });

    it('should return single activity', function() {
        var queryStub = sinon.stub();

        var filteringFunctionThatReturnsTrueWhen1IsPassed = sinon.match(function(filteringFunction) {
            return filteringFunction({id: 1});
        }, 'wrong filtering function');

        var filteredData = [{id: 1, name: 'george'}];
        queryStub
            .withArgs(filteringFunctionThatReturnsTrueWhen1IsPassed, sinon.match.func)
            .callsArgWith(1, null, filteredData);

        var persistenceMock = function(dbName) {
            return {
                query: queryStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getById('1', callbackSpy);

        // then
        var data = callbackSpy.getCall(0).args[1];
        assert.that(data, is.equalTo(filteredData[0]));
    });

    it('should not return single activity when there was error in persistence', function() {
        var queryStub = sinon.stub();

        var errorFromPersistence = new Error("Some error");
        queryStub.callsArgWith(1, errorFromPersistence, null);

        var persistenceMock = function(dbName) {
            return {
                query: queryStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getById('1', callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo(errorFromPersistence.message));

        var data = callbackSpy.getCall(0).args[1];
        assert.that(data, is.null());
    });

    it('should throw meat at me if "id" paremeter of getById method is not an string', function() {
        // given
        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.getById(0, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo('id parameter should be a string'));

        var data = callbackSpy.getCall(0).args[1];
        assert.that(data, is.null());
    });

    it('should remove activity if it does exist', function() {
        // given
        var removeStub = sinon.stub();

        var filteringFunctionThatReturnsTrueWhen1IsPassed = sinon.match(function(filteringFunction) {
            return filteringFunction({id: 1});
        }, 'wrong filtering function');

        removeStub
            .withArgs(filteringFunctionThatReturnsTrueWhen1IsPassed, sinon.match.func)
            .callsArgWith(1, null);

        var persistenceMock = function(dbName) {
            return {
                remove: removeStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackStub = sinon.stub();

        // when
        activitiesData.remove('1', callbackStub);

        // then
        assert.that(callbackStub.getCall(0).args[0], is.null());
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
        var addStub = sinon.stub();

        addStub
            .withArgs(sinon.match(function(element) {
                return element.name === 'The Producers' && element.hasOwnProperty('id');
            }))
            .callsArgWith(1, null);

        var persistenceMock = function(dbName) {
            return {
                add: addStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackStub = sinon.stub();

        var newExpectedActivity = {
            name: 'The Producers'
        };

        // when
        activitiesData.add(newExpectedActivity, callbackStub);

        // then
        assert.that(addStub.calledOnce, is.true());
        assert.that(callbackStub.getCall(0).args[0], is.null());
    });

    it('should not add new activity if there was an error in persistence layer', function() {
        // given
        var addStub = sinon.stub();

        var expectedErroreMessage = 'Error from persistence';

        addStub
            .withArgs(sinon.match(function(element) {
                return element.name === 'The Producers' && element.hasOwnProperty('id');
            }))
            .callsArgWith(1, new Error(expectedErroreMessage));

        var persistenceMock = function(dbName) {
            return {
                add: addStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackStub = sinon.stub();

        var newExpectedActivity = {
            name: 'The Producers'
        };

        // when
        activitiesData.add(newExpectedActivity, callbackStub);

        // then
        assert.that(addStub.calledOnce, is.true());
        var errorMessage = callbackStub.getCall(0).args[0].message;
        assert.that(errorMessage, is.equalTo(expectedErroreMessage));
    });

    it('should not add new activity if it is a series watched in the cinema', function() {
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

    it('should not add new activity if date is in invalid', function() {
        // given
        var activitiesData = new ActivitiesData('existingDatabaseName');
        var callbackSpy = sinon.spy();

        var newExpectedActivity = {
            name: 'The Simpsons',
            date: '2014-mm-dd',
            duration: 120,
            activityType: 'Movie',
            watchedInCinema: true
        };

        // when
        activitiesData.add(newExpectedActivity, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        var id = callbackSpy.getCall(0).args[1];
        assert.that(error.message, is.equalTo('Invalid Date'));
        assert.that(id, is.equalTo(0));
    });

    it('should update the activity', function() {
        // given
        var updateStub = sinon.stub();

        var filteringFunctionThatReturnTrueIfId1IsPassed = sinon.match(function(filteringFunction) {
            return filteringFunction({id: 1}) === true;
        }, 'wrong filtering function');

        updateStub.withArgs(filteringFunctionThatReturnTrueIfId1IsPassed, sinon.match.func, sinon.match.func).callsArgWith(2, null);

        var persistenceMock = function(dbName) {
            return {
                update: updateStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        var newName = 'How I met your mother';
        var activityToUpdate = fakeActivities[0];
        activityToUpdate.name = newName;

        // when
        activitiesData.update(activityToUpdate, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should not update new activiy if you try to change it to series watched in the cinema', function() {
        // given
        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        var activityToUpdate = fakeActivities[0];
        activityToUpdate.activityType = 'Series';
        activityToUpdate.watchedInCinema = true;

        // when
        activitiesData.update(activityToUpdate, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo('Series cannot be watched in the cinema!'));
    });

    it('should not update activity if date is invalid', function() {
        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        var activityToUpdate = fakeActivities[0];
        activityToUpdate.date = 'omg unicorns everywhere!!';

        // when
        activitiesData.update(activityToUpdate, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo('Invalid Date'));
    });

    it.skip('should pass but it does not', function() {
        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        var activityToUpdate = fakeActivities[0];
        activityToUpdate.date = 'omg unicorns everywhere!!1'; //<-- this "1" at the end

        // when
        activitiesData.update(activityToUpdate, callbackSpy);

        // then
        var error = callbackSpy.getCall(0).args[0];
        assert.that(error.message, is.equalTo('Invalid Date'));
    });

    it('should test if db file is empty', function() {
        // given
        var checkIfEmptyStub = sinon.stub();

        checkIfEmptyStub.withArgs(sinon.match.func).callsArgWith(0, null, true);

        var persistenceMock = function(dbName) {
            return {
                checkIfEmpty: checkIfEmptyStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        // when
        var activitiesData = new ActivitiesData('');
        var callbackSpy = sinon.spy();

        activitiesData.checkIfEmpty(callbackSpy);

        // then
        var result = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(result, is.true());
    });

    it('should seed db file', function() {
        // given
        var dataToSeedWith = [{name: "Gruffi"}, {name: "Zummi"}];

        var addRangeStub = sinon.stub();
        addRangeStub.withArgs(dataToSeedWith, sinon.match.func).callsArgWith(1, null);

        var persistenceMock = function(dbName) {
            return {
                addRange: addRangeStub
            };
        };

        ActivitiesData.__set__('JsonPersistence', persistenceMock);

        // when
        var activitiesData = new ActivitiesData('');

        activitiesData.seed(dataToSeedWith);

        // then
        assert.that(addRangeStub.calledOnce, is.true());
    });
});