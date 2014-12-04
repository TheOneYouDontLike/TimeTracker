'use strict';

var jsdom = require('js'+'dom').jsdom; // some sick magic
var should = require('should');

global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = window.navigator;

var React = require('react');
var TestUtils = require('react/addons').addons.TestUtils;


describe('activity', function () {
	it('should render correctly with passed data', function () {
		var activityData = {
			id: 1,
			name: 'Jurassic Park',
			date: '2014-01-01',
			duration: 120,
			activityType: 'Movie',
			watchedInCinema: false
		};

		var Activity = React.createClass({
		    render: function() {
		        return (
		        	<div className='activity'>
				        <div>
				        	{ this.props.data.id }
				        </div>
		            </div>
		        );
		    }
		});

		var renderedActivity = TestUtils.renderIntoDocument(<Activity data={activityData} />);

		renderedActivity.props.data.id.should.equal(activityData.id);
		renderedActivity.props.data.name.should.equal(activityData.name);
		renderedActivity.props.data.date.should.equal(activityData.date);
		renderedActivity.props.data.duration.should.equal(activityData.duration);
		renderedActivity.props.data.activityType.should.equal(activityData.activityType);
		renderedActivity.props.data.watchedInCinema.should.equal(activityData.watchedInCinema);
	});
});