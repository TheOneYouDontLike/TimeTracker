'use strict';

var React = require('react');

var Activity = React.createClass({
    render: function() {
        return (
        	<tr ref='activityRef' className='activity'>
		        <td>
		        	{ this.props.data.Id }
		        </td>
		        <td>
		        	{ this.props.data.Name }
		        </td>
		        <td>
		        	{ this.props.data.Date }
		        </td>
		        <td>
		        	{ this.props.data.Duration }
		        </td>
		        <td>
		        	{ this.props.data.ActivityType }
		        </td>
		        <td>
		        	{ this.props.data.WatchedInCinema.toString() }
		        </td>
            </tr>
        );
    }
});

module.exports = Activity;