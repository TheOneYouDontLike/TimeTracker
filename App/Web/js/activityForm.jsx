'use strict';

var React = require('react');

var ActivityForm = React.createClass(
    {
        render: function () {
            return (
                <form className="activity-form">
                    <input type="text" name="Name" />
                    <input type="date" name="Date" />
                    <input type="number" name="Duration" max-length="3" />
                    <select name="ActivityType">
                        <option value="Movie">Movie</option>
                        <option value="Movie">Series</option>
                    </select>
                    <input type="checkbox" name="WatchedInCinema" />
                    <input type="button" value="Submit" />
                </form>
            );
        }
    });

module.exports = ActivityForm;