'use strict';

var request = require('superagent');

var ActivityService =  {
    postActivity: function (newActivity, callbackFunction) {
        request
        .post('/activities')
        .set('Content-Type', 'application/json')
        .send({
                Name: newActivity.Name,
                Date: newActivity.Date,
                Duration: parseInt(newActivity.Duration),
                ActivityType: newActivity.ActivityType,
                WatchedInCinema: newActivity.WatchedInCinema
            })
        .end(function (response) {
            if(response.badRequest) {
                alert(response.text);
                return;
            }
            console.log("New activity looks like this: " + newActivity);
            callbackFunction();
        });
    },

    getAllActivities: function (callbackFunction) {
        request
        .get('/activities')
        .accept('application/json')
        .end(callbackFunction);
    },

    updateActivity: function (updatedProperties) {
        request
        .put('/activity/updateActivity/' + updatedProperties.activityId.toString())
        .set('Content-Type', 'application/json')
        .send(updatedProperties)
        .end(function (response) {
            if(response.badRequest) {
                alert(response.text);
                return;
            }
            console.log(response);
        });
    }
};

module.exports = ActivityService;