'use strict';

var Router = require('../router.js');
var sinon = require('sinon');
var assert = require('node-assertthat');

describe('router', function(){
    var router = {};

    beforeEach(function() {
        router = new Router();
    });

    it('should route to defined GET path', function(){
        // given
        var request = {
            url: '/path',
            method: 'GET'
        };

        var callbackSpy = sinon.spy();

        router.httpGet('/path', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should route to defined POST path', function(){
        // given
        var request = {
            url: '/path',
            method: 'POST'
        };

        var callbackSpyGet = sinon.spy();
        var callbackSpyPost = sinon.spy();

        router.httpGet('/path', callbackSpyGet);
        router.httpPost('/path', callbackSpyPost);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpyPost.calledOnce, is.true());
        assert.that(callbackSpyGet.calledOnce, is.false());
    });

    it('should route to defined DELETE path', function() {
       // given
        var request = {
            url: '/path',
            method: 'DELETE'
        };

        var callbackSpy = sinon.spy();

        router.httpDelete('/path', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should route to defined PUT path', function() {
       // given
        var request = {
            url: '/path',
            method: 'PUT'
        };

        var callbackSpy = sinon.spy();

        router.httpPut('/path', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });    

    it('should not route if path route does not exist', function() {
       // given
        var request = {
            url: '/somefancypath',
            method: 'GET'
        };

        var callbackSpy = sinon.spy();

        router.httpGet('/', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.false());
    });
});