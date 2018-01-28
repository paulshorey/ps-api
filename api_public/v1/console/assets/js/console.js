var sock = new SockJS('http://localhost:1102/v1/console/WS');

 sock.onopen = function() {
     console.log('open');
     sock.send('test');
 };

 sock.onmessage = function(e) {
     var log = JSON.parse(e.data);
     console.log('message', log);
    //  sock.close();

    var div = document.createElement("div");
    div.innerText = " "+log.timestamp+" "+log.message+" ";
    div.className = "log";
    document.body.prepend(div);
 };

 sock.onclose = function() {
     console.log('close');
 };