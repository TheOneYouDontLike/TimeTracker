'use strict';

var sinon           = require('sinon'),
    assert          = require('node-assertthat'),
    rewire          = require('rewire'),
    JsonPersistence = rewire('../jsonPersistence.js');

describe('jsonPersistence', function() {
    it('should not init the file if does exist', function() {
        // given
        var existsStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, true);

        var fsMock = {
            exists: existsStub,
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistence.init(callbackSpy);

        // then
        var callbackError = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(callbackError.message, is.equalTo('File already exists'));
    });

    it('should init the file if does not exist', function() {
        // given
        var existsStub = sinon.stub().withArgs('nonExistingFileName').callsArgWith(1, false);
        var writeFileStub = sinon.stub().withArgs('nonExistingFileName', "[]").callsArg(2);

        var fsMock = {
            exists: existsStub,
            writeFile: writeFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('nonExistingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistence.init(callbackSpy);

        // then
        var callbackError = callbackSpy.getCall(0).args[0];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(callbackError, is.falsy());
    });

    it('should add some data', function() {
        // given
        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify([]));
        var writeFileStub = sinon.stub().withArgs('existingFileName', JSON.stringify([{name: 'yolo'}])).callsArg(2);

        var fsMock = {
            readFile: readFileStub,
            writeFile: writeFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistence.add({name: 'yolo'}, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(writeFileStub.calledOnce, is.true());
    });

    it('should get all data', function() {
        // given
        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify([{name: 'yolo'}]));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistence.getAll(callbackSpy);

        // then
        var errorObject = callbackSpy.getCall(0).args[0];
        var dataObject = callbackSpy.getCall(0).args[1];

        assert.that(errorObject, is.null());
        assert.that(dataObject, is.equalTo([{name: 'yolo'}]));
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should query by filtering function when it is valid', function() {
        // given
        var data = [{ name: 'yolo', id: 1 }, { name: 'swag', id: 2 }, { name: 'xD', id: 3 }];

        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(data));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        var filteringFunction = function(element) {
            return element.name === 'swag' && element.id === 2;
        };

        // when
        persistence.query(filteringFunction, callbackSpy);

        // then
        var dataFromPersistence = callbackSpy.getCall(0).args[1];
        assert.that(dataFromPersistence.length, is.equalTo(1));
        assert.that(dataFromPersistence[0], is.equalTo(data[1]));
    });

    it('should query by filtering function when there is no data matching', function() {
        // given
        var data = [{ name: 'yolo', id: 1 }, { name: 'swag', id: 2 }, { name: 'xD', id: 3 }];

        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(data));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        var filteringFunction = function(element) {
            return element.name === 'swagrid';
        };

        // when
        persistence.query(filteringFunction, callbackSpy);

        // then
        var dataFromPersistence = callbackSpy.getCall(0).args[1];
        assert.that(dataFromPersistence.length, is.equalTo(0));
    });

    it('should update by filtering function', function() {
        // given
        var data = [{ name: 'yolo', id: 1 }, { name: 'swag', id: 2 }, { name: 'xD', id: 3 }];
        var expectedData = [{ name: 'yolo', id: 1 }, { name: 'yolo2', id: 2 }, { name: 'xD', id: 3 }];

        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(data));
        var writeFileStub = sinon.stub().withArgs('existingFileName', JSON.stringify(expectedData)).callsArg(2);

        var fsMock = {
            readFile: readFileStub,
            writeFile: writeFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        var filteringFunction = function(element) {
            return element.id === 2;
        };

        var updatingFunction = function(element) {
            element.name = 'yolo2';
        };

        // when
        persistence.update(filteringFunction, updatingFunction, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should remove data by filtering function', function() {
        // given
        var data = [{ name: 'yolo', id: 1 }, { name: 'swag', id: 2 }, { name: 'xD', id: 3 }];
        var expectedData = [{ name: 'yolo', id: 1 }, { name: 'xD', id: 3 }];

        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(data));
        var writeFileStub = sinon.stub().withArgs('existingFileName', JSON.stringify(expectedData)).callsArg(2);

        var fsMock = {
            readFile: readFileStub,
            writeFile: writeFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        var filteringFunction = function(element) {
            return element.id === 2;
        };

        // when
        persistence.remove(filteringFunction, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should check if file is empty', function() {
        // given
        var readFileStub = sinon.stub().withArgs('existingFileName', sinon.match.func).callsArgWith(1, null, JSON.stringify([]));

        var fsMock = {
            readFile: readFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        // when
        var persistance = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();
        persistance.checkIfEmpty(callbackSpy);

        // then
        var result = callbackSpy.getCall(0).args[1];
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(result, is.equalTo(true));
    });

    it('should add multiple object grouped in array', function() {
        // given
        var alreadyAddedGummiBears = [{name: 'Gruffi'}, {name: 'Zummi'}];
        var gummiBearsToAdd = [{name: 'Grammi'}, {name: 'Tummi'}];
        var expectedGummiBears = [{name: 'Gruffi'}, {name: 'Zummi'}, {name: 'Grammi'}, {name: 'Tummi'}];

        var readFileStub = sinon.stub().withArgs('existingFileName').callsArgWith(1, null, JSON.stringify(alreadyAddedGummiBears));
        var writeFileStub = sinon.stub().withArgs('existingFileName', JSON.stringify(expectedGummiBears)).callsArg(2);

        var fsMock = {
            readFile: readFileStub,
            writeFile: writeFileStub
        };

        JsonPersistence.__set__('fs', fsMock);

        var persistence = new JsonPersistence('existingFileName');
        var callbackSpy = sinon.spy();

        // when
        persistence.addRange(gummiBearsToAdd, callbackSpy);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
        assert.that(writeFileStub.calledOnce, is.true());
    });
});