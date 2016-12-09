//show login button or not
var guest = "";
var email = document.getElementById('email').innerHTML.trim();
var loginSpan = document.getElementById('login');
if(email != guest){
  loginSpan.innerHTML = "<a href=\"/\">Sign off</a>";
  //list tasks
  $.post("/fetchTasks", {email: email},function(json){
    for (var i = 0; i < json.length; i++){
      createTask(json[i]);
    }
  });
}
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
  li.appendChild(t);
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
  document.getElementById("myUL").appendChild(li);
  deleteTask();
}
// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementById("myInput").textContent;
  var email= document.getElementById('email').innerHTML.trim()
  //add task if login

  if (inputValue === '') {
    alert("You must write something!");
  } else {
    var task = {};
        task["taskname"] = inputValue;
        task["status"] = 0;
    createTask(task);
    if(email != guest){
      $.post("/addTask",{email:email, taskname:inputValue, status: '0'},function(json){
        task["taskid"] = json.taskid;
      });
    }

  }
  document.getElementById("myInput").value = "";
}