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
        callback(null);
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

    it.skip('should init the database if does not exist', function() {
        // given
        var activitiesData = new ActivitiesData('nonExistingDatabaseName');
        var callbackSpy = sinon.spy();

        // when
        activitiesData.init(callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });
});