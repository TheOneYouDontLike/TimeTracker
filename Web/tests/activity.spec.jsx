'use strict';

var jsdom = require('js'+'dom').jsdom; // some sick magic
var should = require('should');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var Activity = require('../js/activity.jsx');

describe('activity', function () {
	it('should render correctly with passed data', function () {
		// given
		var activityData = {
			id: 1,
			name: 'Jurassic Park',
			date: '2014-01-01',
			duration: 120,
			activityType: 'Movie',
			watchedInCinema: false
		};

		// when
		var renderedActivity = TestUtils.renderIntoDocument(<Activity data={activityData} />);
		
		// then
		var renderedNodes = renderedActivity.getDOMNode().querySelectorAll('div');
		renderedNodes[0].innerHTML.should.equal(activityData.id.toString());
		renderedNodes[1].innerHTML.should.equal(activityData.name);
		renderedNodes[2].innerHTML.should.equal(activityData.date);
		renderedNodes[3].innerHTML.should.equal(activityData.duration.toString());
		renderedNodes[4].innerHTML.should.equal(activityData.activityType);
		renderedNodes[5].innerHTML.should.equal(activityData.watchedInCinema.toString());

		// for checking props
		//renderedActivity.props.data.id.should.equal(activityData.id);
		// for checking dom - too long
		//renderedActivity.refs.activityRef.props.children[0].props.children.should.equal(activityData.id);
	});
});