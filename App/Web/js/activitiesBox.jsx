'use strict';

var React = require('react');
var Activity = require('./activity.jsx');

var ActivitiesBox = React.createClass({
	getInitialState: function() {
		return {
			count: 0
		};
	},

	_increment: function() {
		this.setState({count: this.state.count + 1});
	},

    render: function() {
    	var activitiesNodes = this.props.data.map(function (activity){
    		return (<Activity data={ activity } />);
    	});

        return (
        	<div className='activities-box' ref="activitiesBoxRef" onClick={this._increment}>
		        { activitiesNodes }
            </div>
        );
    }
});

module.exports = ActivitiesBox;