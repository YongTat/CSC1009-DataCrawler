var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());


app.all('/dishes', function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    next();
});

app.use(express.static(__dirname ));

app.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
  });

