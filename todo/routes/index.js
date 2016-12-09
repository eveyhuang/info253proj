//date
var date = document.getElementById('date');
date.valueAsDate = new Date();
date.setAttribute("min", new Date());

//show login button or not
var nameSpan = document.getElementById('username');
var loginSpan = document.getElementById('login');
if(sessionStorage.email && sessionStorage.name){
  nameSpan.innerHTML = sessionStorage.name
  loginSpan.innerHTML = "<a href=\"/\" onclick = \"sessionStorage.clear();\">Sign off</a>";
  //list tasks
  $.post("/fetchTasks", {email: sessionStorage.email},function(json){
    for (var i = 0; i < json.length; i++){
      createTask(json[i]);
    }
  });
}
//calendar


var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
//deleteTask();
function deleteTask(){
  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
      //delete task
      $.post("/deleteTask",{taskid:div.id});
    }
  }

}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName == 'LI') {
    ev.target.classList.toggle('checked');
    if(ev.target.className == 'checked'){
      $.post("/changeStatus",{taskid:ev.target.id, taskstatus:"1"});
    }else{
      $.post("/changeStatus",{taskid:ev.target.id, taskstatus:"0"})
    }
  }
}, false);

function createTask(task) {

  var li = document.createElement("li");
  var t = document.createTextNode(task["taskname"]);
  if(task["status"] == 1){
    li.className = "checked";
  }

  li.setAttribute("id", task["taskid"]);
  li.appendChild(document.createTextNode(task["taskname"]));
  var span = document.createElement("SPAN");
  span.appendChild(document.createTextNode(task["date"]));
  li.appendChild(span);
  span.setAttribute("id","taskdate");
  span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  document.getElementById("myUL").appendChild(li);
  deleteTask();
}
// Create a new list item when clicking on the "Add" button
function newElement() {
  var taskname = document.getElementById("taskname").textContent;
  var date = document.getElementById('date').value;
  //add task if login

  if (taskname === '') {
    alert("You must write something!");
  } else {
    var task = {};
    task["taskname"] = taskname;
    task["status"] = 0;
    task["date"] = date;
    if(sessionStorage.email){
      $.post("/addTask",{email:sessionStorage.email, taskname:taskname, status: '0',date:date},function(json){
        task["taskid"] = json.taskid;
        createTask(task);
      });
    }else{
      createTask(task);
    }

  }
  document.getElementById('date').valueAsDate=new Date();
  document.getElementById("taskname").textContent = "";
}