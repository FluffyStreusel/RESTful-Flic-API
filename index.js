// index.js, (2017, Stormersoul)
var express = require('express');
var app = express();
var router = express.Router();

// Variables
var viewPages = __dirname + '/viewapp/';
var apiDirectory = '/api';
var buttonIdentifiers;

var btnStatuses = [
  'null',
  'Enabled',
  'Disabled',
  'Processing'
];

buttonIdentifiers = [
  { Error: '400', ErrorMessage: 'Bad request. Button IDs must start at 1.' },
  { id: 1, Name: 'Flic', ButtonState: 'Enabled', PressedState: false }, // Test Flic
  { id: 2, Name: 'Flic', ButtonState: null, PressedState: false }
];

// These are basically passwords, the 'Secret' keys.
var privateWebpointers = [
  { Error: '400', ErrorMessage: 'Bad request. Secret IDs cannot be less than 1.' },
  { id: 1, Secret: 'zbMvA2N50TUadTt', WebPointer: 301833 },
  { id: 2, Secret: 'TvgAnExafNXo8a6', WebPointer: 134783 }
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

function sanitizeId(id) {
  if (id < 0) {
    return 1; // ID is negative
  } else if (isNaN(id)) {
    return 2; // ID is not a number
  } else if (id >= buttonIdentifiers.length) {
    return 3; // ID is too large, entry doesn't exist
  } else {
    return 0; // ID is safe
  }
}

app.get(apiDirectory + '/btn/:id', function(req, res) {
  var checkId = sanitizeId(req.params.id);
  if (checkId === 0) {
    res.send(buttonIdentifiers[req.params.id]);
  } else {
    res.json([ { ErrorCode: '400'}, { ErrorMessage: 'An error ocurred.' } ]);
  }
});

// End ID Sanitization etc

app.get(apiDirectory + "/btn/:id/:property", function(req, res) {
  if (!req.params.property) {
    res.json([ { ErrorCode: '400' }, { ErrorMessage: 'Bad Request: No property was supplied.' } ]);
  } else if (!buttonIdentifiers[req.params.id][req.params.property]) {
    res.json([ { ErrorCode: '400' }, { ErrorMessage: 'Bad Request: Property does not exist.' } ]);
  } else {
    var prop = req.params.property;
    var name = prop;
    var variabled = {
      [name]: buttonIdentifiers[req.params.id][req.params.property]
    };
    res.json(variabled);
  }
});

app.post(apiDirectory + '/btn/:id/press', function(req, res) {
  if (req.params.id && req.params.id > 0 && buttonIdentifiers[req.params.id]['ButtonState'] === btnStatuses[1]) {
    buttonIdentifiers[req.params.id]['PressedState'] = true;
    setTimeout(function() {
      buttonIdentifiers[req.params.id]['PressedState'] = false;
    }, 3000);
    res.send('Button was pushed. Hooray!');
  } else {
    res.json([ { ErrorCode: '400' }, { ErrorMessage: 'Bad Request: Some error ocurred. Sorry for ya. (Error Code: 1)' } ]); // Err Code 1: Not enabled, bad ID, or ID not supplied
  }
});

app.use("/", router); // For webpages

// 404.html
app.use('*', function(req, res) {
  res.sendFile(viewPages + '404.html');
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function() {
  console.log('Flic RESTful API is running on port ', app.get('port'), '.');
});
