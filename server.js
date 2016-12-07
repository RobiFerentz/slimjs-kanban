var express = require('express');
var app = express()

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    console.log('got a hit!');
    res.sendFile(__dirname + '/src/omer.html');
})

app.listen(3000, function () {
  console.log('SlimJS app now listening on port 3000!')
})