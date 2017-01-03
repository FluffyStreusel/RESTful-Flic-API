var express = require('express');
var app = express();
var router = express.Router();

// Variables
var viewPages = __dirname + '/viewapp/';
var apiDirectory = '/api';

app.set('port', (process.env.PORT || 5000));

var boolValue = false;

var statuses;

var buttonIdentifiers;

buttonIdentifiers = [
  { Error: '400', ErrorMessage: 'Bad request. Button IDs must start at 1.' },
  { id: 1, Name: 'Flic#1', WebPointer: '3014833', PressedState: { Pressed: 'null' } },
  { id: 2, Name: 'Flic#2', WebPointer: '3277162', PressedState: { Pressed: 'null' } }
];

/*
for (var d = 1; d < buttonIdentifiers.length; d++) {
  buttonIdentifiers[d][3][1] = false;
}
*/

var btnStatuses = [
  { PressedState: true },
  { PressedState: false }
];

statuses = [
  { PressedState: boolValue },
];

router.get('/', function(req, res) {
  res.sendFile(viewPages + 'index.html');
});

app.get(apiDirectory, function(req, res) {
  res.json([ { ErrorCode: '404'}, { ErrorMessage: 'Endpoint not found or supplied.' } ]);
});

app.get(apiDirectory + "/btn/:id", function(req, res) {
  if (req.params.id >= (buttonIdentifiers.length)) {
    res.json([ { ErrorCode: '400'}, { ErrorMessage: 'Bad Request: Button does not exist.' } ]);
  } else if (req.params.id < 0) {
    res.json([ { ErrorCode: '400'}, { ErrorMessage: 'Bad Request: ID cannot be under 1.' } ]);
  } else if (isNaN(req.params.id)) {
    res.json([ { ErrorCode: '400'}, { ErrorMessage: 'Bad Request: ID must be a number.' } ]);
  } else {
    res.send(buttonIdentifiers[req.params.id]);
  }
});

app.get(apiDirectory + "/btn/:id/wpointer", function(req, res) {
  var btnA = buttonIdentifiers[req.params.id];
  res.send(btnA[3]);
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
