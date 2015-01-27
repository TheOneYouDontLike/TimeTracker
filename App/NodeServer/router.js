'use strict';
var _ = require('lodash');

var router = function() {
    var unicorn = {};
    var _routingBoard = [];

    var _createDestination = function(method, route, callback) {
        return {
            method: method,
            path: route,
            callback: callback
        };
    };

    var _removeDuplicatesInRoutingBoard = function(method, route) {
        var thereAreSomeDuplicates = _.some(_routingBoard, { method: method, path: route});

        if(thereAreSomeDuplicates) {
            _.remove(_routingBoard, function(element) {
                return element.method === method && element.path === route;
            });
        }
    };

    var _findRoute = function(request) {
        var foundElement = _.find(_routingBoard, function(element){
            return element.method === request.method && element.path === request.url;
        });

        return foundElement;
    };

    unicorn.httpGet = function(route, callback) {
        _removeDuplicatesInRoutingBoard('GET', route);

        var destination = _createDestination('GET', route, callback);
        _routingBoard.push(destination);
    };

    unicorn.httpPost = function(route, callback) {
        _removeDuplicatesInRoutingBoard('POST', route);

        var destination = _createDestination('POST', route, callback);

        _routingBoard.push(destination);
    };

    unicorn.httpPut = function(route, callback) {
        _removeDuplicatesInRoutingBoard('PUT', route);

        var destination = _createDestination('PUT', route, callback);

        _routingBoard.push(destination);
    };

    unicorn.httpDelete = function(route, callback) {
        _removeDuplicatesInRoutingBoard('DELETE', route);

        var destination = _createDestination('DELETE', route, callback);

        _routingBoard.push(destination);
    };

    unicorn.route = function(request, response) {        
        var route = _findRoute(request);

        if(_.isUndefined(route)){
            console.log('path does not exist: ' + request.url);
            response.writeHead(404);
            response.end();
            return;
        }

        console.log('routing with route: ' + route.method + ' ' + route.path);
        route.callback(request, response);
    };

    unicorn.routingBoard = _routingBoard;

    return unicorn;
};

module.exports = router;