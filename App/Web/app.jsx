'use strict';

var React = require('react');
var ActivitiesBox = require('./js/activitiesBox.jsx');
var Activity = require('./js/activity.jsx');

var mainContainerDiv = document.getElementById('main-container');
React.render(<ActivitiesBox name="swagger" />, mainContainerDiv);

var activityData = {
			id: 1,
			name: 'Jurassic Park',
			date: '2014-01-01',
			duration: 120,
			activityType: 'Movie',
			watchedInCinema: false
		};

React.render(<Activity data={activityData} />, mainContainerDiv);