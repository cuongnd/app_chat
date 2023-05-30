var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http,
    {
        origins: ["https://softway.vn"],

        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "https://softway.vn",
                "Access-Control-Allow-Methods": "GET,POST",
                "Access-Control-Allow-Headers": "my-custom-header",
                "Access-Control-Allow-Credentials": true
            });
            res.end();
        }
    }
)

var mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
var Messages = mongoose.model('messages',{ name : String, message : String});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', (req, res) => {
    Messages.find({}, (err, messages) => {
        res.send(messages); // trước mắt cứ show trước dạng json đã nhé
    })
});

app.post('/messages', (req, res) => {
    var message = new Messages(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
        io.emit('message', req.body);
      res.sendStatus(200);
    });
  })


io.on('connection', () =>{
    console.log('connecting');
});

mongoose.connect("mongodb://localhost:27017/app_chat", { useNewUrlParser: true },);

var server = http.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});
