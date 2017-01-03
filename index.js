// index.js, (2017, Stormersoul)
var express = require('express');
var app = express();
var router = express.Router();

// Variables
var viewPages = __dirname + '/viewapp/';
var apiDirectory = '/api';
var boolValue;
var statuses;
var buttonIdentifiers;

var statuses = [
  'null',
  'Enabled',
  'Disabled',
  'Processing'
];

buttonIdentifiers = [
  { Error: '400', ErrorMessage: 'Bad request. Button IDs must start at 1.' },
  { id: 1, Name: 'Flic', WebPointer: '3014833', ButtonState: null, PressedState: false },
  { id: 2, Name: 'Flic', WebPointer: '3277162', ButtonState: null, PressedState: false }
];

var btnStatuses = [
  { PressedState: true },
  { PressedState: false }
];

var statuses = [
  { PressedState: false },
];

// index.html (Main page)
router.get('/', function(req, res) {
  res.sendFile(viewPages + 'index.html');
});

// /api (API Base)
app.get(apiDirectory, function(req, res) {
  res.json([ { ErrorCode: '404'}, { ErrorMessage: 'Endpoint not found or supplied.' } ]);
});

// /btn/(id) (1, 2, etc.) Basically just gets data from buttonIdentifiers table.
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

app.get(apiDirectory + "/btn/:id/:property", function(req, res) {
  if (!req.params.property) {
    res.json([ { ErrorCode: '400' }, { ErrorMessage: 'Bad Request: No property was supplied.' } ]);
  } else {
    res.json([ { WebPointer: buttonIdentifiers[req.params.id][req.params.property] } ]);
  }
});

app.post(apiDirectory + '/btn/:id/press', function(req, res) {
  if (req.params.id && req.params.id > 0) {
    buttonIdentifiers[req.params.id]['PressedState'] = true;
    setTimeout(function() {
      buttonIdentifiers[req.params.id]['PressedState'] = false;
    }, 6000);
  }
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

app.use("/", router);

app.use('*', function(req, res) {
  res.sendFile(viewPages + '404.html');
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Flic RESTful API is running on port ', app.get('port'), '.');
});
