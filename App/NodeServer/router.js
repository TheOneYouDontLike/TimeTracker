'use strict';
var _ = require('lodash');

var router = function() {
    var unicorn = {};

    var routingBoard = [];

    unicorn.get = function(route, callback) {
        var destination = {
            method: 'GET',
            path: route,
            callback: callback
        };

        routingBoard.push(destination);
    };

    unicorn.post = function(route, callback) {
        var destination = {
            method: 'POST',
            path: route,
            callback: callback
        };

        routingBoard.push(destination);
    };

    unicorn.route = function(request, response) {
        console.log(request);
        var route = _.find(routingBoard, function(element){
            return element.method === request.method && element.path === request.url;
        });

        if(_.isUndefined(route)){
            console.log('path does not exist: ' + request.url);
            return;
        }
        
        route.callback();
    };

    return unicorn;
};

module.exports = router;