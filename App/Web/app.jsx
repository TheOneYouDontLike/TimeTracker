'use strict';

var React = require('react');
var request = require('superagent');
var ActivitiesBox = require('./js/activitiesBox.jsx');

var mainContainerDiv = document.getElementById('main-container');

request
	.post('/activities')
	.set('Content-Type', 'application/json')
	.send({
			name: 'Jurassic Park',
			date: '2014-01-01',
			duration: 120,
			activityType: 'Movie',
			watchedInCinema: false
		})
	.end(getDataFromApi);

function getDataFromApi() {
	request
	.get('/activities')
	.accept('application/json')
	.end(displayActivities);
}

function displayActivities(response) {
	var activities = response.body;
	
	React.render(<ActivitiesBox data={ activities } />, mainContainerDiv);
}