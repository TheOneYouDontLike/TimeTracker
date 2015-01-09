'use strict';

var React = require('react');

var ActivitiesTable = React.createClass({
    render: function () {
        var activitiesNodes = this.props.data.map(function (activity) {
            return (
            <tr key={ activity.Id }>
                <td><input type="text" value={ activity.Id } /></td>
                <td><input type="text" value={ activity.Name } /></td>
                <td><input type="text" value={ activity.Date } /></td>
                <td><input type="text" value={ activity.Duration } /></td>
                <td><input type="text" value={ activity.ActivityType } /></td>
                <td><input type="text" value={ activity.WatchedInCinema === true ? 'yes' : 'no' } /></td>
            </tr>
            );
        });

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