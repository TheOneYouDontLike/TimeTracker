'use strict';

var Router = require('../router.js');
var sinon = require('sinon');
var assert = require('node-assertthat');

describe('router', function(){
    it('should route to defined path', function(){
        // given
        var router = new Router();
        var request = {
            url: '/'
        };
        var response = {

        };

        var callbackSpy = sinon.spy();

        router.get('/', callbackSpy);

        // when
        router.route(request, response);

        // then
        assert.that(callbackSpy.calledOnce, is.true());
    });
});