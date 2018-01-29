
var div = document.createElement("div");
div.innerHTML = "<i>https://github.com/paulshorey/ps-api/blob/master/api/v1/console/src/console.js</i> <b>As my server generates console.log() or console.warn() messages, they will be output here, in real time! Yes, I know about `node app.js --inspector`, and am also using logfiles. But this is mobile friendly, and lets me check on my server anytime from anywhere! Yes, it would be bad for production, so if everything is running smoothly, this feature would be turned off.</b>";
div.className = "line log";
document.body.prepend(div);

var div = document.createElement("div");
div.innerHTML = "<i>Welcome!</i> <b>This is a demo - for my server-side real-time console logging experiment. It will be password-protected soon. Meanwhile, please don't hack me - that's not nice!</b>";
div.className = "line info";
document.body.prepend(div);






var sock = new SockJS(window.location.hostname+':1102/v1/console/WS');

 sock.onopen = function() {
    var div = document.createElement("div");
    div.innerHTML = "<i>Success:</i> <b>Websocket connection to server established...</b>";
    div.className = "line warn";
    document.body.prepend(div);
 };

 sock.onmessage = function(e) {
    var log = JSON.parse(e.data);
    for (var a in log.args) {
        log.args[a] = log.args[a].replace(/"/g,'');
    }
    var concise = {
        message: log.args[0],
        args: Object.values(log.args),
        timestamp: log.timestamp,
        trace_stack: log.stack,
        trace_path: log.path,
        trace_line: log.line,
        trace_lineChar: log.pos,
        trace_level: log.level
    };
    //  log.timestamp = new Date(log.timestamp);
     console[log.title]('log', concise);

    var div = document.createElement("div");
    div.innerHTML = "<i>"+log.timestamp+"</i> <b>"+log.message+"</b>";
    div.className = "line "+log.title;
    document.body.prepend(div);
 };

 sock.onclose = function() {
    var div = document.createElement("div");
    div.innerHTML = "<i>Error:</i> <b>Connection to server closed. Please refresh the page to try again.</b>";
    div.className = "line error";
    document.body.prepend(div);
 };

 sock.onerror = function() {
    var div = document.createElement("div");
    div.innerHTML = "<i>Error:</i> <b>Connection error</b>";
    div.className = "line error";
    document.body.prepend(div);
 };