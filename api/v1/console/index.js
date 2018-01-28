exports.module = process.console = require('./src/console.js').module;

process.app.get('/v1/console', function(request, response) {

    var domain = request.protocol + '://' + request.get('host');

    response.writeHead(200);
    response.write("Hello API console. My IP is: "+domain);
    response.end();

});