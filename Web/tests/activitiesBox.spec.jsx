'use strict';

var jsdom = require('js'+'dom').jsdom; // some sick magic
var should = require('should');

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
		rendered.props.name.should.equal('heheszko');
	});

	it('should increment state.count after clicking', function () {
		// given
		var rendered = TestUtils.renderIntoDocument(<ActivitiesBox name="heheszko" />);
		rendered.state.count.should.equal(0);		

		// when
		TestUtils.Simulate.click(rendered.refs.activitiesBoxRef);
		TestUtils.Simulate.click(rendered.refs.activitiesBoxRef);

		// then
		rendered.state.count.should.equal(2);
	});
});