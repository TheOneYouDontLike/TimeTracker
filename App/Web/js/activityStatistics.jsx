'use strict';

var React = require('react');

var ActivityStatistics = React.createClass({
    render: function() {
        return (
            <div className="activities-statistics row">
                <div className="col-xs-12">
                    <p>Total time span of statistics: { this.props.data.TotalTimeSpan }</p>
                    <p>Total duration of activities: { this.props.data.TotalDurationOfActivities }</p>
                    <p>Total number of movies: { this.props.data.TotalNumberOfMovies }</p>
                    <p>Total duration of movies: { this.props.data.TotalDurationOfMovies }</p>
                    <p>Total number of series: { this.props.data.TotalNumberOfSeries }</p>
                    <p>Total duration of series: { this.props.data.TotalDurationOfSeries }</p>
                    <p>Average interval between activities: { this.props.data.AverageIntervalBetweenActivities }</p>
                    <p>Average interval between cinema visits: { this.props.data.AverageIntervalBetweenCinemaVisits }</p>
                </div>
            </div>
        );
    }
});

module.exports = ActivityStatistics;