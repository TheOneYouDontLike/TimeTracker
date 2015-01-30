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

    function _removeDuplicatesInRoutingBoard(method, route) {
        var thereAreSomeDuplicates = _.some(_routingBoard, { method: method, path: route });

        if(thereAreSomeDuplicates) {
            _.remove(_routingBoard, function(element) {
                return element.method === method && element.path === route;
            });
        }
    }

    function _createDestination(method, route, callback) {
        return {
            method: method,
            path: route,
            callback: callback
        };
    }

    function route(request, response) {        
        var routeFromRoutingBoard = _findRoute(request);

        if(_.isUndefined(routeFromRoutingBoard)){
            console.log('path does not exist: ' + request.url);
            response.writeHead(404);
            response.end();
            return;
        }

        console.log('routing with route: ' + request.method + ' ' + request.url);
        
        var params = _.isUndefined(routeFromRoutingBoard.params) ? {} : routeFromRoutingBoard.params;
        
        routeFromRoutingBoard.callback(request, response, params);
    }

    function _findRoute(request) {
        var foundElement = _findRegularRoute(request.method, request.url);

        if(_.isUndefined(foundElement)) {
            foundElement = _findWildcardRoute(request.method, request.url);
        }

        return foundElement;
    }

    function _findRegularRoute(requestMethod, requestUrl) {
        return _.find(_routingBoard, function(element) {
            return element.method === requestMethod && element.path === requestUrl;
        });
    }

    function _findWildcardRoute(requestMethod, requestUrl) {
        if(!_.endsWith(requestUrl, '/')) {
            var indexOfLastSlash = _.lastIndexOf(requestUrl, '/');
            var lastSliceOfUrlLengthStartingAtLastSlash = _.slice(requestUrl, indexOfLastSlash).length;

            var urlWithoutLastSlice = _.dropRight(requestUrl, lastSliceOfUrlLengthStartingAtLastSlash).join('');
            var urlToSearch = new RegExp('^' + urlWithoutLastSlice + '\/{[a-zA-Z]+}');
            
            var wildcardRoute = _.find(_routingBoard, function(element) {
                return element.method === requestMethod && urlToSearch.test(element.path);
            });

            if(_.isUndefined(wildcardRoute)){
                return wildcardRoute;
            }

            _assignWildcardToParams(wildcardRoute, indexOfLastSlash, requestUrl);

            return wildcardRoute;
        }
    }

    function _assignWildcardToParams(wildcardRoute, indexOfLastSlash, requestUrl) {
        var wildcard = _getWildcard(wildcardRoute, indexOfLastSlash);
        
        var params = {};
        params[wildcard] = _.slice(requestUrl, indexOfLastSlash + 1).join('');
        wildcardRoute.params = params;
    }

    function _getWildcard(wildcardRoute, indexOfLastSlash) {
        var lastSliceOfWildcardRoutePathStartingAtLastSlash = _.slice(wildcardRoute.path, indexOfLastSlash + 1).join('');
        var wildcard = _.trim(lastSliceOfWildcardRoutePathStartingAtLastSlash, '{}');

        return wildcard;
    }

    return unicorn;
};

module.exports = router;