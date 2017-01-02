var express = require('express');
var app = express();
var router = express.Router();

// Variables
var viewPages = __dirname + '/viewapp/';
var apiDirectory = '/api';

app.set('port', (process.env.PORT || 5000));

var boolValue = false;

var statuses;

statuses = [
  { PressedState: boolValue },
];

router.get('/', function(req, res) {
  res.sendFile(viewPages + 'index.html');
});

app.get(apiDirectory, function(req, res) {
  res.json([ { ErrorCode: '404'}, { ErrorMessage: 'Endpoint not found or supplied.' } ]);
});

app.get(apiDirectory + '/btn/status', function(req, res) {
  res.json(statuses);
});

app.post(apiDirectory + '/btn/press', function(req, res) {
  boolValue = true;
  statuses = [
    { PressedState: boolValue },
  ];
  setTimeout(function() {
    boolValue = false;
    statuses = [
      { PressedState: boolValue },
    ];
  }, 1000);
  res.send('Button press: successful (200 OK)');
});

app.use("/",router);

app.use('*', function(req, res) {
  res.sendFile(viewPages + '404.html');
});

app.listen(app.get('port'), function() {
  console.log('Flic RESTful API is running on port ', app.get('port'), '.');
});
