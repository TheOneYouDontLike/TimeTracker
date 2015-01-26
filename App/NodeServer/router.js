'use strict';
var _ = require('lodash');

var router = function() {
    var unicorn = {};
    var routingBoard = [];

    var createDestination = function(method, route, callback) {
        return {
            method: method,
            path: route,
            callback: callback
        };
    };

    unicorn.httpGet = function(route, callback) {
        var destination = createDestination('GET', route, callback);

        routingBoard.push(destination);
    };

    unicorn.httpPost = function(route, callback) {
        var destination = createDestination('POST', route, callback);

        routingBoard.push(destination);
    };

    unicorn.httpDelete = function(route, callback) {
        var destination = createDestination('DELETE', route, callback);

        routingBoard.push(destination);
    };

    unicorn.httpPut = function(route, callback) {
        var destination = createDestination('PUT', route, callback);

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