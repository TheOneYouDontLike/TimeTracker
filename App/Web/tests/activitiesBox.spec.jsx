'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');
var sinon = require('sinon');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesBox = require('../js/activitiesBox.jsx');

describe('activities-box', function () {
	it('should render correctly with table and activity form inside', function () {
		// given
		// when
		var rendered = TestUtils.renderIntoDocument(<ActivitiesBox />);
		
		// then
		var renderedActivities = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'activities-box');
		var renderedForm = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'activity-form');
		assert.that(renderedActivities.length, is.equalTo(1));
		assert.that(renderedForm.length, is.equalTo(1));
	});
});