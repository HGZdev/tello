/*

	Rzye Tello
	
	Scratch Ext 1.0.0.0

	http://www.ryzerobotics.com

	1/1/2018
*/

var dataToTrack_keys = ["battery", "x", "y", "z", "speed"];
var lastDataReceived = null;

var http = require("http");
var fs = require("fs");
var url = require("url");

var PORT = 8889;
var HOST = "192.168.10.1";

var dgram = require("dgram");
var client = dgram.createSocket("udp4");

const setCommand = (cmd) => {
  console.log(cmd);
  const message = new Buffer(cmd);
  client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
    if (err) throw err;
  });
};

function respondToPoll(response) {
  var noDataReceived = false;

  var resp = "";
  var i;
  for (i = 0; i < dataToTrack_keys.length; i++) {
    resp += dataToTrack_keys[i] + " ";
    resp += i + 10;
    resp += "\n";
  }
  response.end(resp);
}

// TODO: case camera on/off!

http
  .createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    var url_params = request.url.split("/");
    if (url_params.length < 2) return;

    const [
      cmd_name,
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      p7,
      p8,
      p9,
      p10,
    ] = url_params.slice(1);

    switch (cmd_name) {
      case "poll":
        respondToPoll(response);
        break;

      case "takeoff":
        setCommand("command");
        setCommand(cmd_name);
        break;

      case "land":
        setCommand(cmd_name);
        break;

      case "go":
        // go x y z
        const cmd_go = [cmd_name, p1 || 0, p2 || 0, p3 || 0].join(" ");
        setCommand(cmd_go);
        break;

      case "curve":
        // curve x1 y1 z1 x2 y2 z2 speed
        const cmd_curve = [
          cmd_name,
          p1 || 20,
          p2 || 20,
          p3 || 20,
          p4 || 20,
          p5 || 20,
          p6 || 20,
          p7 || 10,
        ].join(" ");
        setCommand(cmd_curve);
        break;

        var message = new Buffer(cmd_ccw);
        client.send(message, 0, message.length, PORT, HOST, function (
          err,
          bytes
        ) {
          if (err) throw err;
        });

        client.on("message", function (msg, info) {
          console.log("Data received from server : " + msg.toString());
          console.log(
            "Received %d bytes from %s:%d\n",
            msg.length,
            info.address,
            info.port
          );
        });
        break;

      default:
        setCommand([cmd_name, p1].join(" "));
        break;
    }
    response.end("Hello Tello.\n");
  })
  .listen(8001);

console.log("---------------------------------------");
console.log("Tello Scratch Ext running at http://127.0.0.1:8001/");
console.log("---------------------------------------");
