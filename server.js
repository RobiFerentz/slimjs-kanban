var express = require('express');
var app = express()
var dbClient = require('./dbclient');

// dbClient.getColumn('5848138eb0d1ce1f56c3024f').then((result) => {console.log(result)})

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    console.log('got a hit!');
    res.sendFile(__dirname + '/src/index.html');
})

app.listen(3000, function () {
  console.log('SlimJS app now listening on port 3000!')
})