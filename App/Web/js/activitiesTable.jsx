'use strict';

var React               = require('react'),
    ActivityService     = require('./activityService.js'),
    actvityProperties   = require('./activityConstants.js');

var ActivitiesTable = React.createClass({
    changeEvent: function (activityId, propertyEnumValue, event) {
        var newValue =
            propertyEnumValue !== actvityProperties.watchedInCinema ? event.target.value : event.target.checked;

        ActivityService.updateActivity(
        {
            activityId: activityId,
            activityProperty: propertyEnumValue,
            activityValue: newValue
        });
    },

    deleteActivity: function (activityId, event) {
        this.props.deleteActivity(activityId);
    },

    render: function () {
        var activitiesNodes = this.props.data.map(function (activity) {
            return (
            <tr key={ activity.id }>
                <td>{ activity.id }</td>
                <td><input type="text" className="form-control" name="name" defaultValue={ activity.name } onBlur={ this.changeEvent.bind(this, activity.id, actvityProperties.name) } /></td>
                <td><input type="date" className="form-control" name="date" defaultValue={ activity.date.substring(0, 10) } onBlur={ this.changeEvent.bind(this, activity.id, actvityProperties.date) } /></td>
                <td><input type="number" className="form-control" name="duration" defaultValue={ activity.duration } onBlur={ this.changeEvent.bind(this, activity.id, actvityProperties.duration) } /></td>
                <td>
                    <select className="form-control" name="activityType" defaultValue={ activity.activityType } onChange={ this.changeEvent.bind(this, activity.id, actvityProperties.activityType) }>
                        <option value="Movie">Movie</option>
                        <option value="Series">Series</option>
                    </select>
                </td>

                <td><input type="checkbox" className="form-control" name="watchedInCinema" defaultChecked={ activity.watchedInCinema } onChange={ this.changeEvent.bind(this, activity.id, actvityProperties.watchedInCinema) } /></td>
                <td><button className="delete-button btn btn-danger" onClick={this.deleteActivity.bind(this, activity.id)}>Delete</button></td>
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
                                <th>Actions</th>
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