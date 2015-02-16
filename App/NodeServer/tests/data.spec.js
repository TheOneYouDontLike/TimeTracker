'use strict';

var sinon = require('sinon');
var assert = require('node-assertthat');
var rewire = require('rewire');

describe('test', function() {
    it('should work', function() {
        assert.that(rewire, is.not.null());
    });
});