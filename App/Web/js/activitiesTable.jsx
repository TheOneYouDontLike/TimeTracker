'use strict';

var React = require('react');

var ActivitiesTable = React.createClass({
    render: function () {
        var activitiesNodes = this.props.data.map(function (activity) {
            return (
            <tr>
                <td>{ activity.Id }</td>
                <td>{ activity.Name }</td>
                <td>{ activity.Date }</td>
                <td>{ activity.Duration }</td>
                <td>{ activity.ActivityType }</td>
                <td>{ activity.WatchedInCinema === true ? 'yes' : 'no' }</td>
            </tr>
            );
        });

        return (
            <div ref='activityRef' className='activities-table'>
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
        );
    }
});

module.exports = ActivitiesTable;