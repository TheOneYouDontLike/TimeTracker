'use strict';
var _ = require('lodash');

var statistics = function(activities) {
    var unicorn = {};

    unicorn.totalDurationOfActivities = totalDuration();

    function totalDuration() { 
        return _.reduce(activities, function(totalDuration, n) {
            return totalDuration + n.Duration;
        }, 0);
    }

    return unicorn;
};

module.exports = statistics;