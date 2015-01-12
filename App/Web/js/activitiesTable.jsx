'use strict';

var React = require('react');

var ActivityService = require('./activityService.jsx');
var actvityProperties = require('./activityConstants.js');

var ActivitiesTable = React.createClass({
    changeEvent: function (activityId, propertyEnumValue, event) {
        console.log(event.target.value);
        console.log(propertyEnumValue);
        ActivityService.updateActivity(
        {
            activityId: activityId,
            activityProperty: propertyEnumValue,
            activityName: event.target.value
        });
    },

    render: function () {
        var activitiesNodes = this.props.data.map(function (activity) {
            return (
            <tr key={ activity.Id }>
                <td>{ activity.Id }</td>
                <td><input type="text" name="Name" defaultValue={ activity.Name } onBlur={ this.changeEvent.bind(this, activity.Id, actvityProperties.Name) } /></td>
                <td><input type="Date" name="Date" defaultValue={ activity.Date.substring(0, 10) } onBlur={ this.changeEvent.bind(this, activity.Id, actvityProperties.Date) } /></td>
                <td><input type="Number" name="Duration" defaultValue={ activity.Duration } onBlur={ this.changeEvent.bind(this, activity.Id, actvityProperties.Duration) } /></td>
                <td>
                    <select name="ActivityType" defaultValue={ activity.ActivityType } onChange={ this.changeEvent.bind(this, activity.Id, actvityProperties.ActivityType) }>
                        <option value="Movie">Movie</option>
                        <option value="Series">Series</option>
                    </select>
                </td>

                <td><input type="checkbox" name="WatchedInCinema" defaultValue={ activity.WatchedInCinema } onChange={ this.changeEvent.bind(this, activity.Id, actvityProperties.WatchedInCinema) } /></td>
            </tr>
            );
        }.bind(this));

        return (
            <div ref="activityRef" className="activities-table row">
                <div className="col-xs-12">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Activity Type</th>
                                <th>Watched In Cinema?</th>
                            </tr>
                        </thead>
                        <tbody>
                        { activitiesNodes }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = ActivitiesTable;