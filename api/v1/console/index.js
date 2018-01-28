exports.module = process.console = require('./src/console.js').module;

process.app.get('/v1/console', function(request, response) {

    var ip = request.header('x-forwarded-for') || request.connection.remoteAddress;

    response.writeHead(200);
    response.write("Hello API console. My IP is: "+ip);
    response.end();

});