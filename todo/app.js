var express = require('express'); // Adding the express library
var mustacheExpress = require('mustache-express'); // Adding mustache template system
var app = express(); // initializing application
var template_engine = mustacheExpress(); // initializing template engine
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
//var basicAuth = require('basic-auth');
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
var basicAuth = require('basic-auth');

var auth = function (req, res) {

}

app.get('/', function (req, res) {
  res.render('index.html');
});

app.post('/', function (req,res){
  console.log("authenticate");
  var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
  console.log("Authorization Header is: ", auth);
  if(!auth) { 
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.end('<html><body>Need authentication.</body></html>');
  }
  else {
    var tmp = auth.split(' '); 
    var buf = new Buffer(tmp[1], 'base64'); 
    var plain_auth = buf.toString();
    console.log("Decoded Authorization ", plain_auth);
    var creds = plain_auth.split(':'); 
    var username = creds[0];
    var password = creds[1];

    db.get("SELECT username, password FROM userlog where email = ?", username, function(err, row) {
      if(row == null){
        res.json({"status":1});
      } else if(row.password == password){
        res.json({"status":0, "username":username});
      } else {
        res.json({"status":2});
      }
    });
  }
});
app.get('/calendar', function (req, res) {
  res.render('calendar.html');
});
app.get('/login', function (req, res) {
  console.log("login");
  var status = req.query.status;
  if(!status){
    res.render('login.html');
  }else if(status == 1){
    console.log(status);
    res.render('login.html', {"notification": "Email not found!"});
  }else if(status == 2){
    res.render('login.html', {"notification": "Wrong password!"});
  }else if(status == 3){
    res.render('login.html', {"notification": "Email already signed up!"});
  }
  //res.render('login.html');
});

app.post('/signup', function (req, res) {
  console.log("signup");
  var name = req.body.name;
  console.log(name);
  var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
  console.log("Authorization Header is: ", auth);
  if(!auth) { 
    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.end('<html><body>Need authentication.</body></html>');
  }
  else {
    var tmp = auth.split(' '); 
    var buf = new Buffer(tmp[1], 'base64'); 
    var plain_auth = buf.toString();
    console.log("Decoded Authorization ", plain_auth);
    var creds = plain_auth.split(':'); 
    var username = creds[0];
    var password = creds[1];

    db.get("SELECT username, password FROM userlog where email = ?", username, function(err, row) {
      if(row != null){
        res.json({"status":3});
      } else {
      db.run("INSERT INTO userlog " +
       "(username, password, email) " +
       "VALUES (?, ?,?)",
       name,
       password,username);
      res.json({"status":0});
    } 
  });
  }
});



app.post('/addTask', function (req, res) {
  var taskname = req.body.taskname;
  var email = req.body.email;
  var status = req.body.status;
  var date = req.body.date;
  console.log("add task " + taskname);
  db.get("SELECT MAX(taskid) as count FROM tasklog", function(err, row) {
    row.count;
    db.run("INSERT INTO tasklog " +
      "(email, taskid, taskname,  date, status) " +
      "VALUES (?, ?, ?, ?, ?)",
      email,row.count+1,taskname,date,status);
    res.json({"taskid":row.count+1});

  });

});

app.post('/fetchTasks', function (req, res) {
 var email = req.body.email;
 console.log("fetch tasks " + email);
 db.all("SELECT taskid, taskname, date, status FROM tasklog WHERE email = ? "+
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
