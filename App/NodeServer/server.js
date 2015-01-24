var http = require("http");

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

http.createServer(function(request, response) {
    switch(true){
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

function logRequestToConsole(request){
    console.log(request.method);
    console.log(request.url);
}