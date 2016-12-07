var express = require('express'); // Adding the express library 
var mustacheExpress = require('mustache-express'); // Adding mustache template system
var app = express(); // initializing application
var template_engine = mustacheExpress(); // initializing template engine
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// set the path "/static" to serve files from the static folder
app.use('/static', express.static(__dirname + '/static')); 

// Set template engine and location of templates
app.engine('html', template_engine); // set html parsing to the template engine
app.set('views', __dirname + '/views');
// An object that contains a quote that we want to display for a day of the week
app.use('/routes', express.static(__dirname + '/routes'));
// Define your routes here
app.get('/', function (req, res) {
  res.render('index.html');
});



// Start up server on port 3000 on host localhost
var server = app.listen(3000, function () {
  console.log('Server on localhost listening on port 3000');
});