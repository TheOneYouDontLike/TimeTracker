'use strict';

var React = require('react');

var ActivityStatistics = React.createClass({
    render: function() {
        return (
            <div className="activities-statistics row">
                <div className="col-xs-12">
                    <p>Total time span of statistics: <b>{ this.props.data.TotalTimeSpan }</b> days.</p>
                    <p>Total duration of activities: <b>{ this.props.data.TotalDurationOfActivities }</b> minutes.</p>
                    <p>Total number of movies: <b>{ this.props.data.TotalNumberOfMovies }</b></p>
                    <p>Total duration of movies: <b>{ this.props.data.TotalDurationOfMovies }</b> minutes.</p>
                    <p>Total number of series: <b>{ this.props.data.TotalNumberOfSeries }</b></p>
                    <p>Total duration of series: <b>{ this.props.data.TotalDurationOfSeries }</b> minutes.</p>
                    <p>Average interval between activities: <b>{ this.props.data.AverageIntervalBetweenActivities }</b> days.</p>
                    <p>Average interval between cinema visits: <b>{ this.props.data.AverageIntervalBetweenCinemaVisits }</b> days.</p>
                </div>
            </div>
        );
    }
});

module.exports = ActivityStatistics;