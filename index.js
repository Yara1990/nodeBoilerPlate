var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var server = http.createServer(function(req,res){

    //get url and parse it

    var parsedUrl = url.parse(req.url,true);

    //get path
    var path =parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    //get query string
    var queryStringObject = parsedUrl.query;
    var method = req.method.toLowerCase();
    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
      buffer+= decoder.write(data);
    });
    req.on('end',function(){
      buffer += decoder.end();

      res.end('Hello World\n');
      console.log('path: '+ trimmedPath);
      console.log(queryStringObject);

    })


    //send the response

});

server.listen(3000,function(){
  console.log('Server is listning')
})
