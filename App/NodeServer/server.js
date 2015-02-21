'use strict';

var http = require('http');
var fs = require('fs');
var Router = require('./router');
var router = new Router();
var ActivitiesData = require('./activities-data');
var Statistics = require('./statistics');

var activitiesData = new ActivitiesData('database.json');
activitiesData.init(function() {
    activitiesData.checkIfEmpty(function(isEmpty) {
        if(isEmpty) {
            var data = [
            {
                id: 1,
                name: 'Jurassic Park',
                date: '2014-01-01',
                duration: 120,
                activityType: 'Movie',
                watchedInCinema: false
            },
            {
                id: 2,
                name: 'Jurassic Park II',
                date: '2014-01-02',
                duration: 130,
                activityType: 'Movie',
                watchedInCinema: true
            }];
            activitiesData.seed(data);
        }
    });
});

router.httpGet('/', function(request, response) {
    fs.readFile('../Web/index.html', function(error, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
    });
});

router.httpGet('/activities', function(request, response) {
    activitiesData.getAll(function(error, activities) {
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify(activities));
    });
});

router.httpGet('/activities/{id}', function(request, response, params) {
    activitiesData.getById(params.id, function(error, activity) {
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

        activitiesData.add(newActivity, function(error, newActivityId) {
            if (error) {
                response.writeHead(400, {"Content-Type": "text/html"});
                response.end(error.message);
            }
            else {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(newActivityId.toString());
            }
        });
    });
});

router.httpPut('/activities/updateActivity/{id}', function(request, response, params) {
    request.on('data', function(chunk) {
        activitiesData.getById(params.id, function(error, activity) {
            var updatePackage = JSON.parse(chunk.toString());

            activity[updatePackage.activityProperty] = updatePackage.activityValue;

            activitiesData.update(activity, function(error) {
                if (error) {
                    response.writeHead(400, {"Content-Type": "text/html"});
                    response.end(error.message);
                }
                else {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.end();
                }
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
    fs.readFile('../Web/bundle.js', function(error, data) {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.end(data);
    });
});

router.httpGet('/vendor/bootstrap.css', function(request, response){
    fs.readFile('../Web/node_modules/bootstrap/dist/css/bootstrap.css', function(error, data) {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.end(data);
    });
});

router.httpGet('/vendor/bootstrap.css.map', function(request, response){
    fs.readFile('../Web/node_modules/bootstrap/dist/css/bootstrap.css.map', function(error, data) {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.end(data);
    });
});

var portNumber = 8888;

http.createServer(function(request, response) {
    router.route(request, response);
}).listen(portNumber);

console.log('Starting localhost:' + portNumber.toString());