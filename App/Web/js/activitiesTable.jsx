'use strict';

var React = require('react');

var ActivitiesTable = React.createClass({
    onBlurChangeEvent: function (event) {
        var newStateValue = {};
        newStateValue[event.target.name] = event.target.value;

        // send update to activityService
        console.log(newStateValue);
        console.log(event.target.getAttribute('data-activityid'));
    },

    render: function () {
        var activitiesNodes = this.props.data.map(function (activity) {
            return (
            <tr key={ activity.Id }>
                <td>{ activity.Id }</td>
                <td><input type="text" data-activityid={ activity.Id } name="Name" defaultValue={ activity.Name } onBlur={ self.onBlurChangeEvent } /></td>
                <td><input type="text" name="Date" value={ activity.Date } /></td>
                <td><input type="text" name="Date" value={ activity.Duration } /></td>
                <td><input type="text" name="Date" value={ activity.ActivityType } /></td>
                <td><input type="checkbox" name="Date" checked={ activity.WatchedInCinema } /></td>
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