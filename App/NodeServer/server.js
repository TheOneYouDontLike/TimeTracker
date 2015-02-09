'use strict';

var http = require('http');
var fs = require('fs');
var Router = require('./router');
var router = new Router();

var Statistics = require('./statistics');

var activityData = [
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

router.httpGet('/', function(request, response) {
    var indexPage = fs.readFileSync('../Web/index.html');
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(indexPage);
});

router.httpGet('/activities', function(request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(activityData));
});

router.httpGet('/activities/{id}', function(request, response, params) {
    var activity = activityData.filter(function(element) {
        return element.id.toString() === params.id;
    })[0];

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(activity));
});

router.httpDelete('/activities/{id}', function(request, response, params) {
    var activity = activityData.filter(function(element) {
        return element.id.toString() === params.id;
    })[0];

    var indexOfActivity = activityData.indexOf(activity);
    activityData.splice(indexOfActivity, 1);

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end();
});

router.httpPost('/activities', function(request, response) {
    request.on('data', function(chunk) {
        var newActivity = JSON.parse(chunk.toString());
        newActivity.id = 666;

        activityData.push(newActivity);
    });

    request.on('end', function(){
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end("666");
    });
});

router.httpPut('/activities/updateActivity/{id}', function(request, response, params) {
    request.on('data', function(chunk) {
        var activity = activityData.filter(function(element) {
            return element.id.toString() === params.id;
        })[0];

        var updatePackage = JSON.parse(chunk.toString());
        activity[updatePackage.activityProperty] = updatePackage.activityValue;
        console.log(activity);
    });

    request.on('end', function(){
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end();
    });
});

router.httpGet('/activities/statistics', function(request, response) {
    var statistics = new Statistics(activityData);

    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify(statistics));
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