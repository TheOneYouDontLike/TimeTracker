'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var sinon = require('sinon');

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesForm = require('../js/activityRow.jsx');

describe('activity row', function () {
    it('should update activity row onBLurEvent', function () {
        
    });
});