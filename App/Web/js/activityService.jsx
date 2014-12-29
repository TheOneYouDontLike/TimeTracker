'use strict';

var request = require('superagent');

var ActivityService =  {
    postActivity: function (newActivity, callbackFunction) {
        request
        .post('/activities')
        .set('Content-Type', 'application/json')
        .send({
                name: newActivity.Name,
                date: newActivity.Date,
                duration: parseInt(newActivity.Duration),
                activityType: newActivity.ActivityType,
                watchedInCinema: newActivity.WatchedInCinema
            })
        .end(function () {
            console.log("New activity looks like this: " + newActivity);
            callbackFunction();
        });
    },

    getAllActivities: function (callbackFunction) {
        request
        .get('/activities')
        .accept('application/json')
        .end(callbackFunction);
    }
};

module.exports = ActivityService;