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
	it('should render correctly with table and activity form inside', function () {
		// given
		var activitiesData = [{
			Id: 1,
			Name: 'Jurassic Park',
			Date: '2014-01-01',
			Duration: 120,
			ActivityType: 'Movie',
			WatchedInCinema: false
		}];

		// when
		var rendered = TestUtils.renderIntoDocument(<ActivitiesBox activitiesTableData={ activitiesData } />);
		
		// then
		var renderedActivities = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'activities-box');
		var renderedForm = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'activity-form');
		assert.that(renderedActivities.length, is.equalTo(1));
		assert.that(renderedForm.length, is.equalTo(1));
	});
});