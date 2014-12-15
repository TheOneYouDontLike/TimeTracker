'use strict';

var jsdom = require('jsdom').jsdom;
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
			Id: 1,
			Name: 'Jurassic Park',
			Date: '2014-01-01',
			Duration: 120,
			ActivityType: 'Movie',
			WatchedInCinema: false
		};

		// when
		var renderedActivity = TestUtils.renderIntoDocument(<Activity data={ activityData } />);
		
		// then
		var renderedNodes = renderedActivity.getDOMNode().querySelectorAll('div');
		renderedNodes[0].innerHTML.should.equal(activityData.Id.toString());
		renderedNodes[1].innerHTML.should.equal(activityData.Name);
		renderedNodes[2].innerHTML.should.equal(activityData.Date);
		renderedNodes[3].innerHTML.should.equal(activityData.Duration.toString());
		renderedNodes[4].innerHTML.should.equal(activityData.ActivityType);
		renderedNodes[5].innerHTML.should.equal(activityData.WatchedInCinema.toString());

		// for checking props
		//renderedActivity.props.data.id.should.equal(activityData.id);
		// for checking dom - too long
		//renderedActivity.refs.activityRef.props.children[0].props.children.should.equal(activityData.id);
	});
});