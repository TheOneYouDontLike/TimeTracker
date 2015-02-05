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
        var sortedActivities = _.sortBy(activities, function(activity) {
            return new Date(activity.Date);
        });

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

    return unicorn;
};

module.exports = statistics;