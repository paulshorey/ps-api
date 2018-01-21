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
// process.fun = require("./node_custom/fun.js");
process.console = require("./node_custom/console.js").console; // uses process.app
// process.response = require("./node_custom/response.js");
// secret
process.secret = require('../secret/all.js');


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// MODEL
process.twilio = require('twilio')(process.secret.twilio.sid, process.secret.twilio.token);


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// API
// GET
process.app.get('/hello', function(request, response) {
	process.console.info('get /hello');
	process.twilio.messages
	// .create({
	// 	messagingServiceSid: 'PN547894b4c6b4bfed06330b8eb5f3fa83',
	// 	to: '+13857706789',
	// 	body: 'Hello Paul',
	// })
	// .then(message => process.console.info(message))
	// .catch(error => process.console.warn(error));
	.create({
		body: "It works! Hopefully?",
		to: '+13857706789',
		from: '+13853931493',
		// mediaUrl: 'http://www.example.com/cheeseburger.png',
	})
	.then(message => process.console.info(message))
	.catch(error => process.console.warn(error));
	
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"world", error:0},null,"\t"));
	response.end();
});
// POST
process.app.post('/twilio/sms/in', function(request, response) {
	process.console.info('post /twilio/sms/in',JSON.stringify(request.body));
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"ok", error:0},null,"\t"));
	response.end();
});


////////////////////////////////////////////////////////////////////////////////////////////////////
// start
var httpServer = process.http.createServer(process.app);
httpServer.listen(1080);
// var httpsServer = process.https.createServer({key: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/privkey.pem', 'utf8'), cert: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/fullchain.pem', 'utf8')}, process.app);
// httpsServer.listen(1443);