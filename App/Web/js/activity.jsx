'use strict';

var React = require('react');

var Activity = React.createClass({
    render: function() {
        return (
        	<div ref='activityRef' className='activity'>
		        <div>
		        	{ this.props.data.Id }
		        </div>
		        <div>
		        	{ this.props.data.Name }
		        </div>
		        <div>
		        	{ this.props.data.Date }
		        </div>
		        <div>
		        	{ this.props.data.Duration }
		        </div>
		        <div>
		        	{ this.props.data.ActivityType }
		        </div>
		        <div>
		        	{ this.props.data.WatchedInCinema.toString() }
		        </div>
            </div>
        );
    }
});

module.exports = Activity;