'use strict';

var request = require('superagent');

function handleErrors(response) {
    if(response.badRequest) {
        alert(response.text);
        return;
    }
    else if(response.serverError) {
        alert("Server error");
    }
}

var ActivityService =  {
    postActivity: function(newActivity, callbackFunction) {
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
        .end(function(response) {
            handleErrors(response);
            
            var newActivityId = response.text;
            callbackFunction(newActivityId);
        });
    },

    getAllActivities: function(callbackFunction) {
        request
            .get('/activities')
            .accept('application/json')
            .end(function(response) {
                if(response.ok){
                    callbackFunction(response);
                }
                else{
                    handleErrors(response);
                }
            });
    },

    getActivity: function(activityId, callbackFunction) {
        request
            .get('/activities/' + activityId.toString())
            .accept('application/json')
            .end(function(response) {
                if(response.ok){
                    callbackFunction(response.body);
                }
                else{
                    handleErrors(response);
                }
            });
    },

    updateActivity: function(updatedProperties) {
        request
            .put('/activities/updateActivity/' + updatedProperties.activityId.toString())
            .set('Content-Type', 'application/json')
            .send(updatedProperties)
            .end(function(response) {
                handleErrors(response);
        });
    },

    deleteActivity: function(activityId, callbackFunction) {
        request
            .delete('/activities/' + activityId)
            .end(function(response) {
                handleErrors(response);
                callbackFunction();
        });
    },

    getStatistics: function(callbackFunction) {
        request
            .get('/activities/statistics')
            .accept('application/json')
            .end(function(response) {
                if(response.ok){
                    callbackFunction(response);
                }
                else{
                    handleErrors(response);
                }
            });
    }

};

module.exports = ActivityService;