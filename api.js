var pro = process;
process.inc = {};
process.inc.express = require('express');
process.inc.express_parser = require('body-parser');
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
process.fun = require("./node_custom/fun.js");
process.console = require("./node_custom/console.js").console; // uses process.app
process.response = require("./node_custom/response.js");
// secret
process.secret = require('../secret/all.js');


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// MODEL (in memory always!)
var model = {};


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// THE API (endpoints)
// GET
process.app.get('/test/', function(request, response) {
	process.console.log('get /hello');
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"world", error:0},null,"\t"));
	response.end();
});
// POST
process.app.post('/twilio/sms/in', function(request, response) {
	process.console.log('get /twilio/sms/in');
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:request.body, error:0},null,"\t"));
	response.end();
});


////////////////////////////////////////////////////////////////////////////////////////////////////
// start
var httpServer = process.http.createServer(process.app);
httpServer.listen(1080);
// var httpsServer = process.https.createServer({key: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/privkey.pem', 'utf8'), cert: process.fs.readFileSync('/etc/letsencrypt/live/api.paulshorey.com/fullchain.pem', 'utf8')}, process.app);
// httpsServer.listen(1443);