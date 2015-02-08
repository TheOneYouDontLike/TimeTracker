'use strict';
var _ = require('lodash');
var moment = require('moment');

var statistics = function(activities) {
    var unicorn = {};

    unicorn.totalDurationOfActivities = totalDuration();
    unicorn.totalTimeSpan = totalTimeSpan();
    unicorn.totalDurationOfMovies = totalDurationOfMovies();
    unicorn.totalDurationOfSeries = totalDurationOfSeries();
    unicorn.averageIntervalBetweenActivities = averageIntervalBetweenActivities();
    unicorn.averageIntervalBetweenCinemaVisits = averageIntervalBetweenCinemaVisits();
    unicorn.totalNumberOfMovies = totalNumberOfMovies();
    unicorn.totalNumberOfSeries = totalNumberOfSeries();

    function totalDuration() {
        return _.reduce(activities, function(totalDuration, n) {
            return totalDuration + n.duration;
        }, 0);
    }

    function totalTimeSpan() {
        var activityWithMinDate = _.min(activities, function(activity) {
            return new Date(activity.date);
        });

        var minDate = moment(activityWithMinDate.date);
        var now = moment();
        var differenceInDays = now.diff(minDate, 'days');

        return differenceInDays;
    }

    function totalDurationOfMovies() {
        return _.reduce(activities, function(totalDuration, n) {
            return (n.activityType === 'Movie') ? totalDuration + n.duration : totalDuration;
        }, 0);
    }

    function totalDurationOfSeries() {
        return _.reduce(activities, function(totalDuration, n) {
            return (n.activityType === 'Series') ? totalDuration + n.duration : totalDuration;
        }, 0);
    }

    function averageIntervalBetweenActivities() {
        if (activities.length <= 1) {
            return 0;
        }

        var sortedActivities = _.chain(activities)
            .uniq(function(activity) { return activity.date })
            .sortBy(function(activity) { return new Date(activity.date); })
            .value();

        return _calculateInterval(sortedActivities);
    }

    function averageIntervalBetweenCinemaVisits() {
        var sortedActivities = _.chain(activities)
            .uniq(function(activity) { return activity.date })
            .sortBy(function(activity) { return new Date(activity.date); })
            .filter(function(activity) { return activity.watchedInCinema === true })
            .value();

        if (sortedActivities.length <= 1) {
            return 0;
        }

        return _calculateInterval(sortedActivities);
    }

    function _calculateInterval(sortedActivities) {
        var totalDays = 0;
        var numberOfIntervals = sortedActivities.length - 1;

        for (var i = 0; i < numberOfIntervals; i++)
        {
            var nextActivityDate = moment(sortedActivities[i + 1].date);
            var previousActivityDate = moment(sortedActivities[i].date);

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
            return activity.activityType.toLowerCase() === type;
        }).length;

        return activitiesCount;
    }

    return unicorn;
};

module.exports = statistics;