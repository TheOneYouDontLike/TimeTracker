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
            url: '/',
            method: 'GET'
        };

        var callbackSpy = sinon.spy();

        router.get('/', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });

    it('should route to defined POST path', function(){
        // given
        var request = {
            url: '/',
            method: 'POST'
        };

        var callbackSpyGet = sinon.spy();
        var callbackSpyPost = sinon.spy();

        router.get('/', callbackSpyGet);
        router.post('/', callbackSpyPost);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpyPost.calledOnce, is.true());
        assert.that(callbackSpyGet.calledOnce, is.false());
    });

    it('should not route if path route does not exist', function() {
       // given
        var request = {
            url: '/somefancypath',
            method: 'GET'
        };

        var callbackSpy = sinon.spy();

        router.get('/', callbackSpy);

        // when
        router.route(request, {});

        // then
        assert.that(callbackSpy.calledOnce, is.false());
    });
});