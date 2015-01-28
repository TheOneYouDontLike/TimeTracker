'use strict';
var _ = require('lodash');

var router = function() {
    var unicorn = {};
    var _routingBoard = [];

    unicorn.routingBoard = _routingBoard;
    unicorn.httpGet = httpGet;
    unicorn.httpPost = httpPost;
    unicorn.httpPut = httpPut;
    unicorn.httpDelete = httpDelete;
    unicorn.route = route;

    var _createDestination = function(method, route, callback) {
        return {
            method: method,
            path: route,
            callback: callback
        };
    };

    var _removeDuplicatesInRoutingBoard = function(method, route) {
        var thereAreSomeDuplicates = _.some(_routingBoard, { method: method, path: route });

        if(thereAreSomeDuplicates) {
            _.remove(_routingBoard, function(element) {
                return element.method === method && element.path === route;
            });
        }
    };

    var _findRoute = function(request) {
        var foundElement = _.find(_routingBoard, function(element) {
            return element.method === request.method && element.path === request.url;
        });

        if(_.isUndefined(foundElement)) {
            if(!_.endsWith(request.url, '/')) {
                var indexOfLastSlash = _.lastIndexOf(request.url, '/');
                var lastSliceOfUrlLength = _.slice(request.url, indexOfLastSlash).length;

                var url = _.dropRight(request.url, lastSliceOfUrlLength);
                var urlString = '';
                _.forEach(url, function(element) {
                    urlString += element;
                });

                var urlToSearch = urlString + '/' + '{id}';
                console.log(urlToSearch);
                foundElement = _.find(_routingBoard, function(element) {
                    return element.method === request.method && element.path === urlToSearch;
                });

            }
            // var indexOfLastSlash = _.lastIndexOf(request.url, '/');
            // var lastSliceOfUrl = _.slice(request.url, indexOfLastSlash);
            // var urlWithoutLastSlice = _.

            // if(!_.isEmpty(lastSliceOfUrl)) {

            //     foundElement = _.find(_routingBoard, function(element) {
            //         return element.method === request.method && element.path === request.url;
            //     });

            // }
        }

        return foundElement;
    };

    function httpGet(route, callback) {
        _removeDuplicatesInRoutingBoard('GET', route);

        var destination = _createDestination('GET', route, callback);
        _routingBoard.push(destination);
    }

    function httpPost(route, callback) {
        _removeDuplicatesInRoutingBoard('POST', route);

        var destination = _createDestination('POST', route, callback);

        _routingBoard.push(destination);
    }

    function httpPut(route, callback) {
        _removeDuplicatesInRoutingBoard('PUT', route);

        var destination = _createDestination('PUT', route, callback);

        _routingBoard.push(destination);
    }

    function httpDelete(route, callback) {
        _removeDuplicatesInRoutingBoard('DELETE', route);

        var destination = _createDestination('DELETE', route, callback);

        _routingBoard.push(destination);
    }

    function route(request, response) {        
        var route = _findRoute(request);

        if(_.isUndefined(route)){
            console.log('path does not exist: ' + request.url);
            response.writeHead(404);
            response.end();
            return;
        }

        console.log('routing with route: ' + request.method + ' ' + request.url);
        route.callback(request, response);
    }

    return unicorn;
};

module.exports = router;