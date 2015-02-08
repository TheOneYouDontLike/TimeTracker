'use strict';

var React = require('react');

var ActivityStatistics = React.createClass({
    render: function() {
        return (
            <div className="activities-statistics row">
                <div className="col-xs-12">
                    <p>Total time span of statistics: <b>{ this.props.data.totalTimeSpan }</b> days.</p>
                    <p>Total duration of activities: <b>{ this.props.data.totalDurationOfActivities }</b> minutes.</p>
                    <p>Total number of movies: <b>{ this.props.data.totalNumberOfMovies }</b></p>
                    <p>Total duration of movies: <b>{ this.props.data.totalDurationOfMovies }</b> minutes.</p>
                    <p>Total number of series: <b>{ this.props.data.totalNumberOfSeries }</b></p>
                    <p>Total duration of series: <b>{ this.props.data.totalDurationOfSeries }</b> minutes.</p>
                    <p>Average interval between activities: <b>{ this.props.data.averageIntervalBetweenActivities }</b> days.</p>
                    <p>Average interval between cinema visits: <b>{ this.props.data.averageIntervalBetweenCinemaVisits }</b> days.</p>
                </div>
            </div>
        );
    }
});

module.exports = ActivityStatistics;