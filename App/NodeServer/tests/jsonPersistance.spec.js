'use strict';

var sinon = require('sinon');
var assert = require('node-assertthat');
var rewire = require('rewire');
var JsonPersistance = rewire('../jsonPersistance.js');

describe('jsonPersistance', function() {
    it('should not init the file if does exist', function() {
        // given
        var existsStub = sinon.stub();
        existsStub.withArgs('existingFileName').callsArgWith(1, true);

        var fsMock = {
            exists: existsStub,
        };

        JsonPersistance.__set__('fs', fsMock);

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
        var existsStub = sinon.stub();
        existsStub.withArgs('nonExistingFileName').callsArgWith(1, false);

        var writeFileStub = sinon.stub();
        writeFileStub.withArgs('nonExistingFileName', "[]").callsArg(2);

        var fsMock = {
            exists: existsStub,
            writeFile: writeFileStub
        };

        JsonPersistance.__set__('fs', fsMock);

        var persistance = new JsonPersistance('nonExistingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.init(callbackSpy);

        // then
        var callbackError = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(callbackError, is.falsy()); // maybe it should only return messages?
    });

    it('should add some data', function() {
        // given
        var readFileStub = sinon.stub();
        readFileStub.withArgs('existingFileName').callsArgWith(1, null, JSON.stringify([]));

        var writeFileStub = sinon.stub();
        writeFileStub.withArgs('existingFileName', JSON.stringify([{name: 'yolo'}])).callsArg(2);

        var fsMock = {
            readFile: readFileStub,
            writeFile: writeFileStub
        };

        JsonPersistance.__set__('fs', fsMock);

        var persistance = new JsonPersistance('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.add({name: 'yolo'}, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(writeFileStub.calledOnce, is.true());
    });

    it('should get all data', function() {
        // given
        var readFileStub = sinon.stub();
        readFileStub.withArgs('existingFileName').callsArgWith(1, null, JSON.stringify([{name: 'yolo'}]));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistance.__set__('fs', fsMock);

        var persistance = new JsonPersistance('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.getAll(callbackSpy);

        // then
        var errorObject = callbackSpy.getCall(0).args[0];
        var dataObject = callbackSpy.getCall(0).args[1];

        assert.that(errorObject, is.null());
        assert.that(dataObject, is.equalTo([{name: 'yolo'}]));
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should be possible to query by object property', function() {
        // given
        var data = [{name: 'yolo'}, {name: 'swag'}, {name: 'xD'}];

        var readFileStub = sinon.stub();
        readFileStub.withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(data));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistance.__set__('fs', fsMock);

        var persistance = new JsonPersistance('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistance.query(function(element) {
            return element.name === 'swag';
        }, callbackSpy);

        // then
        var dataFromPersistance = callbackSpy.getCall(0).args[1];
        assert.that(dataFromPersistance.length, is.equalTo(1));
        assert.that(dataFromPersistance[0], is.equalTo(data[1]));
    });
});