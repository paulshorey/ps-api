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
process.wsClientsLength = 0;
// WS CONNECTED
process.ws.on('connection', function(conn) {
	process.console.info('new user connected: '+conn.id);

	// add current user
    process.wsClients[conn.id] = conn;
	process.wsClientsLength++;

	// ws --> ws
	// alert all users
	var users = {};
	for (var c in process.wsClients){
		if (process.wsClients[c].user) {
			users[c] = process.wsClients[c].user;
		}
	}
	if (users) {
		var metaData = {
			users
		};
		for (var client in process.wsClients){
			process.wsClients[client].write(JSON.stringify(metaData));
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////
	// WS RECEIVED
    conn.on('data', function(msgData) {
		msgData = JSON.parse(msgData);
		/*
			msgData: {
				message: String,
				user: {
					ip: string
					name: string
				}
			}
		*/
		if (msgData.user) {
			process.wsClients[conn.id].user = msgData.user;
		}
		if (msgData.message) {
		
			// ws --> phone
			process.twilio.messages
			.create({
				body: (msgData.user ? msgData.user.name+" " : "") + msgData.message,
				to: process.secret.twilio.toPhoneNumber,
				from: process.secret.twilio.fromPhoneNumber
			})
			.then(msgData => process.console.info(msgData))
			.catch(error => process.console.warn(error));
			
			// ws --> ws
			for (var client in process.wsClients){
				process.wsClients[client].write(JSON.stringify(msgData));
			}
			
		}
	});
	// WS CLIENT DISCONNECTED
    conn.on('close', function() {
      delete process.wsClients[conn.id];
	  process.wsClientsLength--;
    });
});
// WS START
var ws = process.http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('chat room ready');
  res.end();
});
process.ws.installHandlers(ws, {prefix:'/chat'});
ws.listen(8888);


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// PHONE RECEIVED
process.app.post('/twilio/sms/in', function(request, response) {
	var msgData = {
		message: request.body.Body,
		user: {
			name: "Paul"
		}
	};

	// phone --> ws
	for (var client in process.wsClients){
		process.wsClients[client].write(JSON.stringify(msgData));
	}

	// success response
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