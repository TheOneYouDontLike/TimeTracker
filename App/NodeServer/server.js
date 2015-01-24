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
    if (/^\/activities/.test(request.url)){
        response.writeHead(200, {"Content-Type": "application/json"});
        //response.write("Hello World");
        response.end(JSON.stringify(activityData));
    }
    else {
        response.writeHead(404);
        response.end();
    }
}).listen(8888);