var http = require('http');
var https = require('https');

var url = require('url');
var config = require('./config.js');
var fs = require('fs');
var handlers = require('./lib/handlers');

const {
  StringDecoder
} = require('string_decoder');

// Istantiate the HTTP Server
var httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res)
});

//Start the HTTP Server
httpServer.listen(config.httpPort, function() {
  console.log('Server is listning to port : ' + config.httpPort + ' and ' + config.envName + ' mode')
});

// Instantiate the HTTPS Server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res)
});

//Start the HTTPS Server
httpsServer.listen(config.httpsPort, function() {
  console.log('Server is listning to port : ' + config.httpsPort + ' and ' + config.envName + ' mode')
});


//All the server logic here
var unifiedServer = function(req, res) {
  //get url and parse it

  var parsedUrl = url.parse(req.url, true);

  //get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  //get query string
  var queryStringObject = parsedUrl.query;
  // get method
  var method = req.method.toLowerCase();
  //get headers
  var headers = req.headers;
  // Get Payload
  var decoder = new StringDecoder('utf8');
  var buffer = '';

  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();

    //choose the handler
    var choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    //construct the data obj to send to Handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'Payload': buffer
    };

    // route the request to the handler specified in router
    choosenHandler(data, function(statusCode, payload) {
      //default Handler
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // /default payload

      payload = typeof(payload) == 'object' ? payload : {};
      var payloadString = JSON.stringify(payload);
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('returning : ' + statusCode, payloadString);

    });
  });
};

//Define a router

var router = {
  'ping': handlers.ping,
  'user': handlers.users
};