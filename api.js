var pro = process;
process.inc = {};
process.inc.express = require('express');
process.inc.express_parser = require('body-parser');
process.fs = require('fs');
process.http = require('http');
process.url = require('url');
// env (settings)
process.env.PATH = __dirname;
// app (express)
process.app = process.inc.express();
process.app.use(process.inc.express_parser.json({
	limit: '50mb',
	parameterLimit: 10000,
	extended: true
}));
process.app.use(process.inc.express_parser.urlencoded({
	limit: '50mb',
	parameterLimit: 10000,
	extended: true
}));
process.app.use(process.inc.express.static('public'));
process.app.disable('trust proxy');
process.app.use(function(request, response, next){
	var referrer = process.url.parse(request.headers.referer||'', true, true).hostname;
	response.setHeader('Access-Control-Allow-Origin', '*'); // header contains the invalid value 'app.allevents.nyc'. Origin 'http://app.allevents.nyc' is therefore not allowed access <-- don't know if browser will include http:// or not
	response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma, Authorization, Content-Length, X-Requested-With, X-Host');
	if ('OPTIONS' == request.method) {
		response.writeHead(200);
		response.end();
		return;
	} else {
		next();
		return;
	}
});
// custom
process.console = require("./node_custom/console.js").console; // wip: uses {process.app}, requires npm 'colors' and 'tracer' packages to be installed
// secret
process.secret = require('../secret/all.js');


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// phone
process.twilio = require('twilio')(process.secret.twilio.sid, process.secret.twilio.token);
// ws
process.ws = require('sockjs').createServer({ sockjs_url: '' });
process.wsClients = {};
// in <--
process.ws.on('connection', function(conn) {
    process.wsClients[conn.id] = conn;
	console.log('new client connected: '+conn.id);
    conn.on('data', function(message, id) {
		console.log("new message: ",message);
		console.log("mid?: ",id);
		
		////////////////////////////////////////////////////////////////////////////////////////////////////
		////////////////////////////////////////////////////////////////////////////////////////////////////
		// WS --> phone
		process.twilio.messages
		.create({
			body: message,
			to: process.secret.twilio.toPhoneNumber,
			from: process.secret.twilio.fromPhoneNumber
		})
		.then(message => process.console.info(message))
		.catch(error => process.console.warn(error));
		// broadcast this message to all (except the typist):
        var ci = 0;
		for (var client in process.wsClients){
			ci++;
			process.wsClients[client].write(message);
		}

		
    });
    conn.on('close', function() {
      console.log("disconnect: " + conn.id);
	  console.log('number of clients connected: '+ci);
      delete process.wsClients[conn.id];
    });
});
// serve!
var ws = process.http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();
});
process.ws.installHandlers(ws, {prefix:'/chat'});
ws.listen(8888);


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// phone --> WS
process.app.post('/twilio/sms/in', function(request, response) {
	process.console.log('post /twilio/sms/in');
	process.console.info(request.body.Body);
	var message = request.body.Body;

	// someone typed something:
	console.log("replied:         ",message);
	// broadcast this new thing to all (except the typist):
	var ci = 0;
	for (var client in process.wsClients){
		ci++;
		process.wsClients[client].write(message);
	}

	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"sms received", error:0},null,"\t"));
	response.end();
});


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
var httpServer = process.http.createServer(process.app);
httpServer.listen(1080);
// var httpsServer = process.https.createServer({key: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/privkey.pem', 'utf8'), cert: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/fullchain.pem', 'utf8')}, process.app);
// httpsServer.listen(1443);