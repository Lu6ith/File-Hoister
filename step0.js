// Load a built-in node library
// var HTTP = require('http');
var HTTPS = require('https');
var FS = require('fs');
// Load a couple third-party node modules
var Stack = require('stack');
var Creationix = require('creationix');

// Serve files relative to the current working directory
var root = process.cwd();
// Listen on the alt-http port
var port = process.env.PORT || 8433;

// Load our self-signed cert for HTTPS support
var options = {
  key: FS.readFileSync(__dirname + '/keys/lubicz-key.pem'),
  cert: FS.readFileSync(__dirname + '/keys/lubicz-cert.pem')
};

var users = {
  creationix: "sup3rS3cr3t",
  guest: "guest"
};

var access = {
  GET: {creationix: true, guest: true},
  PUT: {creationix: true},
  DELETE: {creationix: true}
};

function checker(req, username, password) {
  var allowed = access[req.method];
  if (allowed[username] && users[username] === password) {
    return username;
  }
}

// Stack up a server and start listening
HTTPS.createServer(options, Stack(
  Creationix.log(),
  Creationix.auth(checker, "Moje pliczki... "),
  Creationix.uploader("/",root),
  Creationix.deleter("/",root),
  Creationix.indexer("/", root),
  Creationix.static("/", root)
)).listen(port);

// Give the user a nice message on the standard output
console.log("Serving %s at https://localhost:%s/", root, port);
