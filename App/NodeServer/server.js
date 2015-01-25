'use strict';

var http = require('http');
var fs = require('fs');

var activityData = [
    {
        Id: 1,
        Name: 'Jurassic Park',
        Date: '2014-01-01',
        Duration: 120,
        ActivityType: 'Movie',
        WatchedInCinema: false
    },
    {
        Id: 1,
        Name: 'Jurassic Park II',
        Date: '2014-01-02',
        Duration: 130,
        ActivityType: 'Movie',
        WatchedInCinema: true
    }];

var indexPage = fs.readFileSync('../Web/index.html');
var bundleJs = fs.readFileSync('../Web/bundle.js');
var bootstrap = fs.readFileSync('../Web/node_modules/bootstrap/dist/css/bootstrap.css');
var bootstrapMap = fs.readFileSync('../Web/node_modules/bootstrap/dist/css/bootstrap.css.map');

http.createServer(function(request, response) {
    route(request, response);
    switch(true){
        case request.url === '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(indexPage);
            break;

        case request.url === '/bundle.js':
            response.writeHead(200, {'Content-Type': 'application/javascript'});
            response.end(bundleJs);
            break;

        case request.url === '/vendor/bootstrap.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.end(bootstrap);
            break;

        case request.url === '/vendor/bootstrap.css.map':
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end(bootstrapMap);
            break;

        case /^\/activities\/[0-9]+/.test(request.url):
            logRequestToConsole(request);
            response.writeHead(200, {"Content-Type": "application/json"});
            response.end(JSON.stringify(activityData[0]));
            break;
        
        case /^\/activities/.test(request.url):
            logRequestToConsole(request);
            response.writeHead(200, {"Content-Type": "application/json"});        
            response.end(JSON.stringify(activityData));
            break;
        
        default:
            console.log('not found route: ');
            logRequestToConsole(request);
            response.writeHead(404);
            response.end();    
    }
}).listen(8888);

console.log('Starting localhost:8888');

function logRequestToConsole(request){
    console.log(request.method);
    console.log(request.url + '\n');
}