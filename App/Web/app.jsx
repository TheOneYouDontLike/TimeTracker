'use strict';

var React = require('react');
var request = require('superagent');
var ActivitiesBox = require('./js/activitiesBox.jsx');

var mainContainerDiv = document.getElementById('main-container');

request
.get('/activities')
.accept('application/json')
.end(displayActivities);

function displayActivities(response) {
	var activities = response.body;
	
	React.render(<ActivitiesBox activitiesTableData={ activities } />, mainContainerDiv);
}