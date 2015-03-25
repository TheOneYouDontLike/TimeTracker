'use strict';
var _ = require('lodash');

var router = function(options) {
    var unicorn = {};
    var _routingBoard = [];

    unicorn.routingBoard = _routingBoard;
    unicorn.httpGet      = httpGet;
    unicorn.httpPost     = httpPost;
    unicorn.httpPut      = httpPut;
    unicorn.httpDelete   = httpDelete;
    unicorn.route        = route;

    function httpGet(route, callback) {
        if (Array.isArray(route)) {
            _.forEach(route, function(singleRoute) {
                _createRoute(singleRoute, callback, 'GET');
            });

            return;
        }

        _createRoute(route, callback, 'GET');
    }

    function httpPost(route, callback) {
        if (Array.isArray(route)) {
            _.forEach(route, function(singleRoute) {
                _createRoute(singleRoute, callback, 'POST');
            });

            return;
        }

        _createRoute(route, callback, 'POST');
    }

    function httpPut(route, callback) {
        if (Array.isArray(route)) {
            _.forEach(route, function(singleRoute) {
                _createRoute(singleRoute, callback, 'PUT');
            });

            return;
        }

        _createRoute(route, callback, 'PUT');
    }

    function httpDelete(route, callback) {
        if (Array.isArray(route)) {
            _.forEach(route, function(singleRoute) {
                _createRoute(singleRoute, callback, 'DELETE');
            });

            return;
        }

        _createRoute(route, callback, 'DELETE');
    }

    function _createRoute(route, callback, method) {
        _removeDuplicatesInRoutingBoard(method, route);

        var destination = _createDestination(method, route, callback);
        _routingBoard.push(destination);
    }

    function _removeDuplicatesInRoutingBoard(method, route) {
        var thereAreSomeDuplicates = _.some(_routingBoard, { method: method, path: route });

        if (thereAreSomeDuplicates) {
            _.remove(_routingBoard, function(element) {
                return element.method === method && element.path === route;
            });
        }
    }

    function _createDestination(method, route, callback) {
        return {
            method: method,
            path: route,
            callback: callback,
            params: {}
        };
    }

    function route(request, response) {
        var routeFromRoutingBoard = _findRoute(request);

        if (_.isNull(routeFromRoutingBoard)){
            _log('path does not exist: ' + request.url);
            response.writeHead(404);
            response.end();
            return;
        }

        _log('routing with route: ' + request.method + ' ' + request.url);

        var params = routeFromRoutingBoard.params;

        routeFromRoutingBoard.callback(request, response, params);
    }

    function _findRoute(request) {
        var foundElement = _findRegularRoute(request.method, request.url);

        if (_.isNull(foundElement)) {
            foundElement = _findWildcardRoute(request.method, request.url);
        }

        return foundElement;
    }

    function _findRegularRoute(requestMethod, requestUrl) {
        var trimmedUrl = '';

        if(!_isRoot(requestUrl)) {
            trimmedUrl = _.trimRight(requestUrl, '/');
        }

        var regularRoute = _.find(_routingBoard, function(element) {
            return element.method === requestMethod &&
                (element.path === requestUrl || element.path === trimmedUrl);
        });

        if (_.isUndefined(regularRoute)) {
            return null;
        }

        return regularRoute;
    }

    function _isRoot(url) {
        return _.endsWith(url, '/') && url.length === 1;
    }

    function _findWildcardRoute(requestMethod, requestUrl) {
        var indexOfLastSlash = _.lastIndexOf(requestUrl, '/');

        var wildcardRoutes = _getAllMatchingWildcardRoutes(requestMethod, requestUrl, indexOfLastSlash);

        return _getWildcardRoute(wildcardRoutes, requestUrl, indexOfLastSlash);
    }

    function _getAllMatchingWildcardRoutes(requestMethod, requestUrl, indexOfLastSlash) {
        var lastSliceOfUrlStartingAtLastSlash = _.slice(requestUrl, indexOfLastSlash);

        var urlWithoutLastSlice = _.dropRight(requestUrl, lastSliceOfUrlStartingAtLastSlash.length).join('');
        var urlToSearch = new RegExp('^' + urlWithoutLastSlice + '\/{[a-zA-Z:]+}');

        var allMatchingWildcardRoutes = _.filter(_routingBoard, function(element) {
            return element.method === requestMethod && urlToSearch.test(element.path);
        });

        return allMatchingWildcardRoutes;
    }

    function _getWildcardRoute(wildcardRoutes, requestUrl, indexOfLastSlash) {
        if (wildcardRoutes.length === 0) {
            return null;
        }

        var wildcardRoute = {};

        if (wildcardRoutes.length === 1) {
            wildcardRoute = wildcardRoutes[0];

            var wildcard = _getWildcard(wildcardRoute, indexOfLastSlash);
            var wildcardName = _getWildcardName(wildcard);

            var matchedWildcardValue = _.slice(requestUrl, indexOfLastSlash + 1).join('');
            _assignWildcardToParams(wildcardRoute, wildcardName, matchedWildcardValue);

            return wildcardRoute;
        }

        var alreadyFound = false;

        _.forEach(wildcardRoutes, function(element) {
            if (alreadyFound) {
                return;
            }

            var wildcard = _getWildcard(element, indexOfLastSlash);
            var wildcardName = _getWildcardName(wildcard);

            var wildcardType = _getWildcardType(wildcard);
            var matchedWildcardValue = _.slice(requestUrl, indexOfLastSlash + 1).join('');

            if (wildcardType === 'number') {
                var isMatchedValueNaN = isNaN(parseInt(matchedWildcardValue));

                if (!isMatchedValueNaN) {
                    wildcardRoute = element;
                    _assignWildcardToParams(wildcardRoute, wildcardName, matchedWildcardValue);

                    alreadyFound = true;
                    return;
                }
            }

            if (wildcardType === 'string') {
                if (_.isString(matchedWildcardValue)) {
                    wildcardRoute = element;
                    _assignWildcardToParams(wildcardRoute, wildcardName, matchedWildcardValue);

                    alreadyFound = true;
                    return;
                }
            }
        });

        return wildcardRoute;
    }

    function _getWildcard(wildcardRoute, indexOfLastSlash) {
        var wildcard = _.slice(wildcardRoute.path, indexOfLastSlash + 1).join('');

        return wildcard;
    }

    function _getWildcardName(wildcard) {
        var wildcardName = _.trim(wildcard, '{}');

        if(wildcardName.indexOf(':') > -1){
            return wildcardName.split(':')[0];
        }

        return wildcardName;
    }

    function _getWildcardType(wildcard) {
        var wildcardName = _.trim(wildcard, '{}');

        return wildcardName.split(':')[1];
    }

    function _assignWildcardToParams(wildcardRoute, wildcardName, matchedWildcardValue) {
        wildcardRoute.params[wildcardName] = matchedWildcardValue;
    }

    function _log(message) {
        if (options) {
            if (options.showLog) {
                console.log(message);
            }
        }
        else {
            console.log(message);
        }
    }

    return unicorn;
};

module.exports = router;