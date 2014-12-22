'use strict';

var React = require('react');

var ActivityForm = React.createClass(
    {
        getInitialState: function () {
            return {
                Name: '',
                Date: '',
                Duration: 0,
                ActivityType: '',
                WatchedInCinema: false
            };
        },
        handleChange: function (event) {
            this.setState({
                Name: event.target.value
            }, console.log(this.state));
        },
        render: function () {
            return (
                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                        <form className="activity-form" role="form">
                            <div className="form-group">
                                <label htmlFor="activity-name">Name:</label>
                                <input type="text" name="Name" className="form-control" id="activity-name" onChange={this.handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-date">Date:</label>
                                <input type="date" name="Date" className="form-control" id="activity-date" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-duration">Duration:</label>
                                <input type="number" name="Duration" max-length="3" className="form-control" id="activity-duration" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="activity-type">Activity type:</label>
                                <select name="ActivityType" className="form-control" id="activity-type">
                                    <option value="Movie">Movie</option>
                                    <option value="Movie">Series</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>
                                    Watched in cinema ? <input type="checkbox" name="WatchedInCinema" />
                                </label>
                            </div>
                            <input type="button" value="Submit" className="btn btn-default"/>
                        </form>
                    </div>
                </div>
            );
        }
    });

module.exports = ActivityForm;