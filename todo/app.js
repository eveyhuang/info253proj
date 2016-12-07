var express = require('express'); // Adding the express library
var mustacheExpress = require('mustache-express'); // Adding mustache template system
var app = express(); // initializing application
var template_engine = mustacheExpress(); // initializing template engine
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.db');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// set the path "/static" to serve files from the static folder

// Set template engine and location of templates
app.engine('html', template_engine); // set html parsing to the template engine
app.set('views', __dirname + '/views');
// An object that contains a quote that we want to display for a day of the week
app.use('/routes', express.static(__dirname + '/routes'));
app.use('/public', express.static(__dirname + '/public'));
// Define your routes here
app.get('/', function (req, res) {
  res.render('index.html', {'username':'guest'});
});

app.get('/login', function (req, res) {

  res.render('login.html');
});
app.post('/signup', function (req, res) {
   var email = req.body.email;
   var password = req.body.password;

    db.run("INSERT INTO userlog " +
    	"(username, password) " +
    	"VALUES (?, ?)",
    		email,
    		password);
    res.render('index.html');

});
app.post('/login', function (req, res) {
	var email = req.body.email;
   var password = req.body.password;
	db.get("SELECT password FROM userlog where username = ?", email, function(err, row) {
		if(row.password == password){
			res.render('index.html', {'username':email});
		}

  });
});

var bourbon = require('node-bourbon');
bourbon.includePaths // Array of Bourbon paths 

// Start up server on port 3000 on host localhost
var server = app.listen(3000, function () {
  console.log('Server on localhost listening on port 3000');
});
