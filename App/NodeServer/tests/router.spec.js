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
        router.httpGet('/path', callbackSpyGet);

        var callbackSpyPost = sinon.spy();
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

    it('should override existing GET route if specified again', function() {
        // given
        var callbackSpyMrBond = sinon.spy();
        router.httpGet('/', callbackSpyMrBond);
        router.httpPost('/', callbackSpyMrBond);
        router.httpPut('/', callbackSpyMrBond);
        router.httpDelete('/', callbackSpyMrBond);

        var callbackSpyMrBean = sinon.spy();
        router.httpGet('/', callbackSpyMrBean);
        router.httpPost('/', callbackSpyMrBean);
        router.httpPut('/', callbackSpyMrBean);
        router.httpDelete('/', callbackSpyMrBean);

        var requestGet = {
            url: '/',
            method: 'GET'
        };
        var requestPost = {
            url: '/',
            method: 'POST'
        };
        var requestPut = {
            url: '/',
            method: 'PUT'
        };
        var requestDelete = {
            url: '/',
            method: 'DELETE'
        };

        // when
        router.route(requestGet, {});
        router.route(requestPost, {});
        router.route(requestPut, {});
        router.route(requestDelete, {});

        // then
        assert.that(callbackSpyMrBean.callCount, is.equalTo(4));
        assert.that(callbackSpyMrBean.calledWith(requestGet, {}), is.true());
        assert.that(callbackSpyMrBean.calledWith(requestPost, {}), is.true());  
        assert.that(callbackSpyMrBean.calledWith(requestPut, {}), is.true());
        assert.that(callbackSpyMrBean.calledWith(requestDelete, {}), is.true());
    });

    it('should invoke callback with response when routing', function() {
        // given
        var callbackSpy = sinon.spy();
        router.httpGet('/highwayToHell', callbackSpy);

        var requestGet = {
            url: '/highwayToHell',
            method: 'GET'
        };

        var response = {
            helloIAmResponseObject: {}
        };

        // when
        router.route(requestGet, response);

        // then
        assert.that(callbackSpy.calledWith(requestGet, response), is.true());
    });
});