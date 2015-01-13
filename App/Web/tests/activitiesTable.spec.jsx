'use strict';

var jsdom = require('jsdom').jsdom;
var assert = require('node-assertthat');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var sinon = require('sinon');
global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;

var ActivitiesTable = require('../js/activitiesTable.jsx');

describe('activities-table', function () {
	var activityData = [{
		Id: 1,
		Name: 'Jurassic Park',
		Date: '2014-01-01',
		Duration: 120,
		ActivityType: 'Movie',
		WatchedInCinema: false
	}];

	var renderedActivity;

	beforeEach(function () {
		renderedActivity = TestUtils.renderIntoDocument(<ActivitiesTable data={ activityData } />);
	});

	it('should render correctly with passed data', function () {
		// given

		// when
		
		// then
		var renderedId = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td')[0].innerHTML;
		var renderedSelect = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > select')[0];
		var renderedTextInputs = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > input');
		
		assert.that(renderedId, is.equalTo(activityData[0].Id.toString()));
		assert.that(renderedSelect.value, is.equalTo(activityData[0].ActivityType));

		assert.that(renderedTextInputs[0].value, is.equalTo(activityData[0].Name));
		assert.that(renderedTextInputs[1].value, is.equalTo(activityData[0].Date));
		assert.that(renderedTextInputs[2].value, is.equalTo(activityData[0].Duration.toString()));
		assert.that(renderedTextInputs[3].checked, is.equalTo(false));

		// for checking props
		//renderedActivity.props.data.id.should.equal(activityData.id);
		// for checking dom - too long
		//renderedActivity.refs.activityRef.props.children[0].props.children.should.equal(activityData.id);
	});

	describe('single row', function () {
		it('should change single activity name onBlurEvent', function () {
			// given
			var requests = [];
            global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };
			
			var nameInput = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > input[name=Name]')[0];

			// when
			TestUtils.Simulate.blur(nameInput, changeNameValueOfActivity('Terminator'));

			// then
			assert.that(requests.length, is.equalTo(1));
			var parsedRequestBody = JSON.parse(requests[0].requestBody);
			assert.that(parsedRequestBody, is.equalTo({ activityId:1, activityProperty: 1, activityValue: 'Terminator'}));
		});
	});
});

function changeNameValueOfActivity(value) {
	return {
		target: {
			value: value
		}
	};
}