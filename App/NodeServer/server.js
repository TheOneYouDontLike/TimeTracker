'use strict';

var http = require('http');
var fs = require('fs');
var Router = require('./router');
var router = new Router();
var ActivitiesData = require('./activities-data');

var activitiesData = new ActivitiesData('database.json');
activitiesData.init(function() {
    activitiesData.checkIfEmpty(function(isEmpty) {
        if(isEmpty) {
            activitiesData.seed();
        }
    });
});

var Statistics = require('./statistics');

router.httpGet('/', function(request, response) {
    var indexPage = fs.readFileSync('../Web/index.html');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(indexPage);
});

router.httpGet('/activities', function(request, response) {
    activitiesData.getAll(function(error, activities) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(activities));
    });
});

router.httpGet('/activities/{id}', function(request, response, params) {
    activitiesData.byId(params.id, function(error, activity) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(activity));
    });
});

router.httpDelete('/activities/{id}', function(request, response, params) {
    activitiesData.remove(params.id, function(error) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end();
    });
});

router.httpPost('/activities', function(request, response) {
    request.on('data', function(chunk) {
        var newActivity = JSON.parse(chunk.toString());

        if(newActivity.activityType === 'Series' && newActivity.watchedInCinema === true){
            response.writeHead(400, {"Content-Type": "text/html"});
            response.end('Series cannot be watched in the cinema!');

            return;
        }

        activitiesData.add(newActivity, function(error, newActivityId) {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.end(newActivityId.toString());
        });
    });
});

router.httpPut('/activities/updateActivity/{id}', function(request, response, params) {
    request.on('data', function(chunk) {
        activitiesData.byId(params.id, function(error, activity) {
            var updatePackage = JSON.parse(chunk.toString());

            activity[updatePackage.activityProperty] = updatePackage.activityValue;

            if(activity.activityType === 'Series' && activity.watchedInCinema === true){
                response.writeHead(400, {"Content-Type": "text/html"});
                response.end('Series cannot be watched in the cinema!');

                return;
            }

            activitiesData.update(activity, function(error) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end();
            });
        });
    });
});

router.httpGet('/activities/statistics', function(request, response) {
    activitiesData.getAll(function(error, activities) {
        var statistics = new Statistics(activities);

        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(statistics));
    });
});

router.httpGet('/bundle.js', function(request, response) {
    var bundleJs = fs.readFileSync('../Web/bundle.js');
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    response.end(bundleJs);
});

router.httpGet('/vendor/bootstrap.css', function(request, response){
    var bootstrap = fs.readFileSync('../Web/node_modules/bootstrap/dist/css/bootstrap.css');
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.end(bootstrap);
});

router.httpGet('/vendor/bootstrap.css.map', function(request, response){
    var bootstrapMap = fs.readFileSync('../Web/node_modules/bootstrap/dist/css/bootstrap.css.map');
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.end(bootstrapMap);
});

http.createServer(function(request, response) {
    router.route(request, response);
}).listen(8888);

console.log('Starting localhost:8888');