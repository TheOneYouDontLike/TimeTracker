'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'ActivitiesClass',
    render: function() {
        return (
            React.createElement(
                'div', {
                    className: 'activities-box' 
                },
                'Hello Activities!'
            )
        );
    }
});