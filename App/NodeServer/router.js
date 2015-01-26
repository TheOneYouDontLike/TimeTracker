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

    var removeDuplicatesInRoutingBoard = function(method, route) {
        var thereAreSomeDuplicates = _.some(routingBoard, { method: method, path: route});

        if(thereAreSomeDuplicates) {
            _.remove(routingBoard, function(element) {
                return element.method === method && element.path === route;
            });
        }
    };

    unicorn.httpGet = function(route, callback) {
        removeDuplicatesInRoutingBoard('GET', route);

        var destination = createDestination('GET', route, callback);
        routingBoard.push(destination);
    };

    unicorn.httpPost = function(route, callback) {
        removeDuplicatesInRoutingBoard('POST', route);

        var destination = createDestination('POST', route, callback);

        routingBoard.push(destination);
    };

    unicorn.httpPut = function(route, callback) {
        removeDuplicatesInRoutingBoard('PUT', route);

        var destination = createDestination('PUT', route, callback);

        routingBoard.push(destination);
    };

    unicorn.httpDelete = function(route, callback) {
        removeDuplicatesInRoutingBoard('DELETE', route);

        var destination = createDestination('DELETE', route, callback);

        routingBoard.push(destination);
    };

    unicorn.route = function(request, response) {        
        var route = _.find(routingBoard, function(element){
            return element.method === request.method && element.path === request.url;
        });

        if(_.isUndefined(route)){
            console.log('path does not exist: ' + request.url);
            return;
        }

        console.log('routing with route: ' + route.method + ' ' + route.path);
        route.callback(request, response);
    };

    unicorn.routingBoard = routingBoard;

    return unicorn;
};

module.exports = router;