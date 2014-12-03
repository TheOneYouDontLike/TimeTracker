'use strict';

var React = require('react');

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
        return (
        	<div className='activities-box' ref="activitiesBoxRef" onClick={this._increment}>
		        <div>
		            Hello { this.props.name }, do you know that js autocompletion sucks?
		        </div>
		        <div>
		        	{this.state.count}
		        </div>
            </div>
        );
    }
});

module.exports = ActivitiesBox;