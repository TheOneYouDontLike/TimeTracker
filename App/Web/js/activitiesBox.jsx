'use strict';

var React = require('react');
var Activity = require('./activity.jsx');

var ActivitiesBox = React.createClass({
    render: function() {
    	var activitiesNodes = this.props.data.map(function (activity){
    		return (<Activity data={ activity } />);
    	});

        return (
        	<div className='activities-box' ref="ActivitiesBox">
		        { activitiesNodes }
            </div>
        );
    }
});

module.exports = ActivitiesBox;