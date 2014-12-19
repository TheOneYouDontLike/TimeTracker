'use strict';

var React = require('react');
var ReactAddons = require('react/addons').addons;
console.log(ReactAddons);

var Activity = require('./activity.jsx');

var ActivitiesBox = React.createClass({
    render: function() {
    	var activitiesNodes = this.props.data.map(function (activity){
    		return (<Activity data={ activity } />);
    	});

        return (
            <div className='activities-box' ref="ActivitiesBox">
            	<table className='table'>
    		        { activitiesNodes }
                </table>
            </div>
        );
    }
});

module.exports = ActivitiesBox;