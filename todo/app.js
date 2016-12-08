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
  res.render('index.html', {"username": "Guest"});
});

app.get('/login', function (req, res) {

  res.render('login.html',{"notification": ""});
});

app.post('/signup', function (req, res) {
 var email = req.body.email;
 var password = req.body.password;

 db.run("INSERT INTO userlog " +
   "(username, password) " +
   "VALUES (?, ?)",
   email,
   password);
 res.render('index.html',{"username": email});

});

app.post('/login', function (req, res) {
	var email = req.body.email;
  var password = req.body.password;
  db.get("SELECT password FROM userlog where username = ?", email, function(err, row) {
    if(row == null){
      res.render('login.html', {"notification": "Username not found!"});
    } else if(row.password == password){
     res.render('index.html', {'username':email});
   } else {
    res.render('login.html', {"notification": "Wrong password!"});
  }

});
});

app.post('/addTask', function (req, res) {
  var taskname = req.body.taskname;
  var email = req.body.email;
  var status = req.body.status;
  console.log("add task " + taskname);
  db.get("SELECT MAX(taskid) as count FROM tasklog", function(err, row) {
    row.count;
    db.run("INSERT INTO tasklog " +
      "(username, taskid, taskname, location, date, status) " +
      "VALUES (?, ?, ?, ?, ?, ?)",
      email,row.count+1,taskname,"","",status);
    res.json({"taskid":row.count+1});

  });
  
});

app.post('/fetchTasks', function (req, res) {
	var email = req.body.email;
	console.log("fetch tasks " + email);
	db.all("SELECT taskid, taskname, location, date, status FROM tasklog WHERE username = ? "+
    "order by taskid ASC", email, function(err, rows) {
      res.json(rows); 
    });
});

app.post('/deleteTask', function (req, res) {
  var taskid= req.body.taskid;
  console.log("delete task " + taskid);
  db.run("delete from tasklog where taskid = ?",
    taskid);
  res.json("");

});
app.post('/changeStatus', function (req, res) {
  var taskstatus= req.body.taskstatus;
  var taskid = req.body.taskid;
  console.log("change status taskid " + taskid);
  db.run("update tasklog set status = ? where taskid = ?",taskstatus,
    taskid);
  res.json("");

});


var bourbon = require('node-bourbon');
bourbon.includePaths // Array of Bourbon paths 

// Start up server on port 3000 on host localhost
var server = app.listen(3000, function () {
  console.log('Server on localhost listening on port 3000');
});
