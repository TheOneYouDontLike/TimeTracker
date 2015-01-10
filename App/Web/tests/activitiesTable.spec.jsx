'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesTable = require('../js/activitiesTable.jsx');

describe('activities-table', function () {
	it('should render correctly with passed data', function () {
		// given
		var activityData = [{
			Id: 1,
			Name: 'Jurassic Park',
			Date: '2014-01-01',
			Duration: 120,
			ActivityType: 'Movie',
			WatchedInCinema: false
		}];

		// when
		var renderedActivity = TestUtils.renderIntoDocument(<ActivitiesTable data={ activityData } />);
		
		// then
		var renderedId = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td')[0].innerHTML;
		var renderedNodes = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > input');
		
		assert.that(renderedId, is.equalTo(activityData[0].Id.toString()));
		assert.that(renderedNodes[0].value, is.equalTo(activityData[0].Name));
		assert.that(renderedNodes[1].value, is.equalTo(activityData[0].Date));
		assert.that(renderedNodes[2].value, is.equalTo(activityData[0].Duration.toString()));
		assert.that(renderedNodes[3].value, is.equalTo(activityData[0].ActivityType));
		assert.that(renderedNodes[4].checked, is.equalTo(false));

		// for checking props
		//renderedActivity.props.data.id.should.equal(activityData.id);
		// for checking dom - too long
		//renderedActivity.refs.activityRef.props.children[0].props.children.should.equal(activityData.id);
	});
});