/*
	GET: /chat
		returns websocket stream connection
			triggers websocket update with total users

	POST: /twillio/sms/in
		accepts SMS text data
		returns success header
			triggers websocket update with this data
*/
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
// TWILIO
process.twilio = require('twilio')(process.secret.twilio.sid, process.secret.twilio.token);
// WS
process.ws = require('sockjs').createServer({ sockjs_url: '' });
process.wsClients = {};
process.wsClientsLength = 0;

// WS CONNECTED
process.ws.on('connection', function(conn) {
	process.console.info('new user connected: '+conn.id);
	// new user
	process.wsClients[conn.id] = conn;
	process.wsClients[conn.id].user = {}; // we must find out!
	process.wsClientsLength++;

	/*
		WS NOTIFY USERS
		make note of existing users
	*/
	var users = {};
	var ui = 0;
	for (var c in process.wsClients){
		ui++;
		users[c] = process.wsClients[c].user || {};
	}
	// alert users
	if (ui) {
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
			// process.console.warn('user info received '+conn.id+" "+JSON.stringify(msgData.user));
		}
		if (msgData.message) {
		
			/*
				WS CALL HOME
				* text Paul the message
			*/
			process.twilio.messages
			.create({
				body: (process.wsClients[conn.id].user ? process.wsClients[conn.id].user.name+" " : "") + msgData.message,
				to: process.secret.twilio.toPhoneNumber,
				from: process.secret.twilio.fromPhoneNumber
			})
			.then(msgData => process.console.info(msgData))
			.catch(error => process.console.warn(error));
			
			/*
				WS COPY USERS
				* tell everyone what someone said
			*/
			for (var client in process.wsClients){
				process.wsClients[client].write(JSON.stringify(msgData));
			}
			
		}
	});

	// WS CLIENT DISCONNECTED
	conn.on('close', function() {
	  delete process.wsClients[conn.id];
	  process.wsClientsLength--;

	  /*
	  	WS NOTIFY USERS
		  * that someone has left
	  */
	  // make note of existing users
	  var users = {};
	  var ui = 0;
	  for (var c in process.wsClients){
		  ui++;
		  users[c] = process.wsClients[c].user || {};
	  }
	  // alert users
	  if (ui) {
		  var metaData = {
			  users
		  };
		  for (var client in process.wsClients){
			  process.wsClients[client].write(JSON.stringify(metaData));
		  }
	  }
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
// TWILIO RECEIVED
process.app.post('/twilio/sms/in', function(request, response) {
	var msgData = {
		message: request.body.Body,
		user: {
			name: "Paul"
		}
	};

	/*
		WS SAY THE WORD
		* tell users what Paul responded
	*/
	for (var client in process.wsClients){
		process.wsClients[client].write(JSON.stringify(msgData));
	}

	// success response
	response.setHeader('Content-Type', 'application/json');
	response.writeHead(200);
	response.write(JSON.stringify({data:"sms received", error:0},null,"\t"));
	response.end();
});