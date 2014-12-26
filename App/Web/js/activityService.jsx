'use strict';

var request = require('superagent');

var ActivityService =  {
    postActivity: function (newActivity) {
        request
        .post('/activities')
        .set('Content-Type', 'application/json')
        .send({
                name: newActivity.Name,
                date: newActivity.Date,
                duration: parseInt(newActivity.Duration),
                activityType: newActivity.ActivityType,
                watchedInCinema: newActivity.WatchedInCinema === 'true' ? true : false
            })
        .end(function () {
            console.log("New activity looks like this: " + newActivity);
        });
    }
};

module.exports = ActivityService;