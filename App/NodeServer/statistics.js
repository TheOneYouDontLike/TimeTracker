'use strict';
var _ = require('lodash');
var moment = require('moment');

var statistics = function(activities) {
    var unicorn = {};

    unicorn.totalDurationOfActivities = totalDuration();
    unicorn.totalTimeSpan = totalTimeSpan();
    unicorn.moviesTotalDuration = moviesTotalDuration();
    unicorn.seriesTotalDuration = seriesTotalDuration();
    unicorn.averageIntervalBetweenActivities = averageIntervalBetweenActivities();
    unicorn.averageIntervalBetweenCinemaVisits = averageIntervalBetweenCinemaVisits();
    unicorn.totalNumberOfMovies = totalNumberOfMovies();
    unicorn.totalNumberOfSeries = totalNumberOfSeries();

    function totalDuration() { 
        return _.reduce(activities, function(totalDuration, n) {
            return totalDuration + n.Duration;
        }, 0);
    }

    function totalTimeSpan() {
        var activityWithMinDate = _.min(activities, function(activity) {
            return new Date(activity.Date);
        });

        var minDate = moment(activityWithMinDate.Date);
        var now = moment();

        var differenceInDays = now.diff(minDate, 'days');

        return differenceInDays;
    }

    function moviesTotalDuration() {
        return _.reduce(activities, function(totalDuration, n) {
            return (n.ActivityType === 'Movie') ? totalDuration + n.Duration : totalDuration;
        }, 0);
    }

    function seriesTotalDuration() {
        return _.reduce(activities, function(totalDuration, n) {
            return (n.ActivityType === 'Series') ? totalDuration + n.Duration : totalDuration;
        }, 0);
    }

    function averageIntervalBetweenActivities() {
        if (activities.length <= 1) {
            return 0;
        }

        var sortedActivities = _.chain(activities)
            .uniq(function(activity) { return activity.Date })
            .sortBy(function(activity) { return new Date(activity.Date); })
            .value();

        return _calculateInterval(sortedActivities);
    }

    function averageIntervalBetweenCinemaVisits() {
        if (activities.length <= 1) {
            return 0;
        }

        var sortedActivities = _.chain(activities)
            .uniq(function(activity) { return activity.Date })
            .sortBy(function(activity) { return new Date(activity.Date); })
            .filter(function(activity) { return activity.WatchedInCinema === true })
            .value();

        return _calculateInterval(sortedActivities);
    }

    function _calculateInterval(sortedActivities) {
        var totalDays = 0;
        var numberOfIntervals = sortedActivities.length - 1;

        for (var i = 0; i < numberOfIntervals; i++)
        {
            var nextActivityDate = moment(sortedActivities[i + 1].Date);
            var previousActivityDate = moment(sortedActivities[i].Date);

            totalDays += nextActivityDate.diff(previousActivityDate, 'days');
        }

        return totalDays / numberOfIntervals;
    }

    function totalNumberOfMovies() {
        return _calculateTotalNumberOfActities('movie');
    }

    function totalNumberOfSeries() {
        return _calculateTotalNumberOfActities('series');
    }

    function _calculateTotalNumberOfActities(type) {
        var activitiesCount = _.filter(activities, function(activity) {
            return activity.ActivityType.toLowerCase() === type;
        }).length;

        return activitiesCount;
    }

    return unicorn;
};

module.exports = statistics;