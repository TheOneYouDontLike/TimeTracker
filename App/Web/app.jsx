'use strict';

var React = require('react');
var request = require('superagent');
var ActivitiesBox = require('./js/activitiesBox.jsx');
var Activity = require('./js/activity.jsx');

var mainContainerDiv = document.getElementById('main-container');
React.render(<ActivitiesBox name="swagger" />, mainContainerDiv);

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
	.end(calaReszta);

function calaReszta (){
	console.log('udalo sie');

	request
	.get('/activities')
	.accept('application/json')
	.end(displayActivities);
}

function displayActivities(response) {
	var activities = response.body;
	console.log(response.body);
	React.render(<Activity data={ activities[0] } />, mainContainerDiv);
}