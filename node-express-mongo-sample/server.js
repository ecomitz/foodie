var http = require('http');

var server = http.createServer(function(request, response) {
    console.log('received a request!')
    response.write('<h1>This is a simple NodeJS app</h1>')
    response.end();
}).listen(8300);

console.log('Server running on port 8300');