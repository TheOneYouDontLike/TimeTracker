'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesBox = require('../js/activitiesBox.jsx');

describe('activities-box', function () {
	it('should render correctly with proper prop.name', function () {
		// when
		var rendered = TestUtils.renderIntoDocument(<ActivitiesBox name="heheszko" />);
		
		// then
		assert.that(rendered.props.name, is.equalTo('heheszko'));
	});

	it('should increment state.count after clicking', function () {
		// given
		var rendered = TestUtils.renderIntoDocument(<ActivitiesBox name="heheszko" />);
		assert.that(rendered.state.count, is.equalTo(0));

		// when
		TestUtils.Simulate.click(rendered.refs.activitiesBoxRef);
		TestUtils.Simulate.click(rendered.refs.activitiesBoxRef);

		// then
		assert.that(rendered.state.count, is.equalTo(2));
	});
});