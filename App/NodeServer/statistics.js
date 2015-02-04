'use strict';
var _ = require('lodash');
var moment = require('moment');

var statistics = function(activities) {
    var unicorn = {};

    unicorn.totalDurationOfActivities = totalDuration();
    unicorn.totalTimeSpan = totalTimeSpan();
    unicorn.moviesTotalDuration = moviesTotalDuration();
    unicorn.seriesTotalDuration = seriesTotalDuration();

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

    return unicorn;
};

module.exports = statistics;