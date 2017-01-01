var express = require('express');
var app = express();

var viewPages = __dirname + '/viewapp/';

app.set('port', (process.env.PORT || 5000));

var boolValue = false;

var statuses;

statuses = [
  { PressedState: boolValue },
];

app.get('/', function(req, res) {
  res.sendFile(viewPages + 'index.html');
});

app.get('/api', function(req, res) {
  res.json([ { ErrorCode: '404'}, { ErrorMessage: 'Endpoint not found.' } ]);
});

app.get('api/btn/status', function(req, res) {
  res.json(statuses);
});

app.post('api/btn/press', function(req, res) {
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


app.listen(app.get('port'), function() {
  console.log('Flic RESTful API is running on port ', app.get('port'), '.');
});
