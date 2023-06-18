require('dotenv').config();

var http = require("http");

const PORT = process.env.PORT;

var Routes = require("./src/public/route.js");

var server = http.createServer(Routes);

server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});