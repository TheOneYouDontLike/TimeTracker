'use strict';

var React = require('react');

var Activity = React.createClass({
    render: function() {
        return (
        	<div ref='activityRef' className='activity'>
		        <div>
		        	{ this.props.data.id }
		        </div>
		        <div>
		        	{ this.props.data.name }
		        </div>
		        <div>
		        	{ this.props.data.date }
		        </div>
		        <div>
		        	{ this.props.data.duration }
		        </div>
		        <div>
		        	{ this.props.data.activityType }
		        </div>
		        <div>
		        	{ this.props.data.watchedInCinema.toString() }
		        </div>
            </div>
        );
    }
});

module.exports = Activity;