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
		id: 1,
		name: 'Jurassic Park',
		date: '2014-01-01',
		duration: 120,
		activityType: 'Movie',
		watchedInCinema: false
	}];

	var renderedActivity;
	var deleteCallback;

	beforeEach(function () {
		deleteCallback = sinon.spy();
		renderedActivity = TestUtils.renderIntoDocument(<ActivitiesTable data={ activityData } deleteActivity= { deleteCallback }/>);
	});

	it('should render correctly with passed data', function () {
		// given

		// when

		// then
		var renderedId = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td')[0].innerHTML;
		var renderedSelect = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > select')[0];
		var renderedTextInputs = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > input');

		assert.that(renderedId, is.equalTo(activityData[0].id.toString()));
		assert.that(renderedSelect.value, is.equalTo(activityData[0].activityType));

		assert.that(renderedTextInputs[0].value, is.equalTo(activityData[0].name));
		assert.that(renderedTextInputs[1].value, is.equalTo(activityData[0].date));
		assert.that(renderedTextInputs[2].value, is.equalTo(activityData[0].duration.toString()));
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

			var nameInput = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > input[name=name]')[0];

			// when
			TestUtils.Simulate.blur(nameInput, changeNameValueOfActivity('Terminator'));

			// then
			assert.that(requests.length, is.equalTo(1));
			var parsedRequestBody = JSON.parse(requests[0].requestBody);
			assert.that(parsedRequestBody, is.equalTo({ activityId:1, activityProperty: 'name', activityValue: 'Terminator'}));
		});

		it('should be deleted when clicking on delete button', function() {
			// given
			var requests = [];
            global.XMLHttpRequest.onCreate = function (req) { requests.push(req); };

			var nameInput = renderedActivity.getDOMNode().querySelectorAll('tbody > tr > td > button')[0];

			// when
			TestUtils.Simulate.click(nameInput);

			// then
			assert.that(deleteCallback.calledWith(1), is.true());
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