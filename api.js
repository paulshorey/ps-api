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
	response.setHeader('Access-Control-Allow-Origin', '*'); // CHANGE THIS BEFORE ADDING SENSITIVE DATA!
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
process.secret = require('../secret/all.js'); // not on GitHub!



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// CHAT APP
// GET /chat
// POST /twillio/sms/in
require('./all/chat/index.js');



////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// START API SERVER
var httpServer = process.http.createServer(process.app);
httpServer.listen(1080);
// var httpsServer = process.https.createServer({key: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/privkey.pem', 'utf8'), cert: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/fullchain.pem', 'utf8')}, process.app);
// httpsServer.listen(1443);