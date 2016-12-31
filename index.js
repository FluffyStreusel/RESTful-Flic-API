var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

var boolValue = false;

var statuses;

statuses = [
  { PressedState: boolValue },
];

app.get('/', function(req, res) {
  res.json([ { ErrorCode: '400'}, { ErrorMessage: 'Bad request. Cannot get status of null.' } ]);
});

app.get('/btn/status', function(req, res) {
  res.json(statuses);
});

app.post('/btn/press', function(req, res) {
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
