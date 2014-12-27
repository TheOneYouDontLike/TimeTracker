'use strict';

var React = require('react');
var request = require('superagent');
var ActivitiesBox = require('./js/activitiesBox.jsx');

var mainContainerDiv = document.getElementById('main-container');

React.render(<ActivitiesBox />, mainContainerDiv);