'use strict';

var sinon = require('sinon');
var assert = require('node-assertthat');
var rewire = require('rewire');
var JsonPersistance = rewire('../jsonPersistance.js');

var existsStub = sinon.stub();
existsStub.withArgs('existingFileName').callsArgWith(1, true);
existsStub.withArgs('nonExistingFileName').callsArgWith(1, false);

var writeFileStub = sinon.stub();
writeFileStub.withArgs('nonExistingFileName', "[]").callsArg(2);

var fsMock = {
    exists: existsStub,
    writeFile: writeFileStub
};

JsonPersistance.__set__('fs', fsMock);

describe('jsonPersistance', function() {
    it('should not init the file if does exist', function() {
        // given
        var persistance = new JsonPersistance('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.init(callbackSpy);

        // then
        var callbackError = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(callbackError.message, is.equalTo('File already exists'));
    });

    it('should init the file if does not exist', function() {
        // given
        var persistance = new JsonPersistance('nonExistingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.init(callbackSpy);

        // then
        var callbackError = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(callbackError, is.falsy()); // maybe it should only return messages?
    });
});