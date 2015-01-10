'use strict';

var React = require('react');

var ActivityRow = React.createClass({
    onBlurChangeEvent: function (event) {
        var newStateValue = {};
        newStateValue[event.target.name] = event.target.value;

        // send update to activityService
        console.log(newStateValue);
        console.log(event.target.getAttribute('data-activityid'));
    },

    render: function () {
        var activity = this.props.activity;
        
        return (
            <tr key={ activity.Id }>
                <td>{ activity.Id }</td>
                <td><input type="text" data-activityid={ activity.Id } name="Name" defaultValue={ activity.Name } onBlur={ this.onBlurChangeEvent } /></td>
                <td><input type="text" name="Date" value={ activity.Date } /></td>
                <td><input type="text" name="Date" value={ activity.Duration } /></td>
                <td><input type="text" name="Date" value={ activity.ActivityType } /></td>
                <td><input type="checkbox" name="Date" checked={ activity.WatchedInCinema } /></td>
            </tr>
    );}
});

module.exports = ActivityRow;