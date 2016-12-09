//button sign

function check(){

  event.preventDefault()
  var notification = document.getElementById('notification');
  console.log("check");
  var email = document.getElementsByName('email')[0].value;
  var name = document.getElementsByName('name')[0].value;
  var password = document.getElementsByName('password')[0].value;
  var confpassword = document.getElementsByName('confpassword')[0].value;
  if(document.querySelector('.btn_sign').innerHTML == "SIGN UP"){
    if(name.length == 0){
      notification.innerHTML="Input the name."
      return false;
    }
    if(email.length == 0){
      notification.innerHTML="Input the email."
      return false;
    }

    if(password.length < 6){
      notification.innerHTML="Password should be more than 6 characters."
      return false;
    }
    if(password != confpassword){
      notification.innerHTML="Passwords are not the same."
      return false;
    }
    $.ajax
    ({
      type: "POST",
      url: "/signup",
      dataType: 'json',
      headers: {
        "Authorization": "Basic " + btoa(email + ":" + password)
      },
      data:{
        "name":name
      },
      success : function (r) {
        if(r.status == 0){
          sessionStorage.email = email;
          sessionStorage.name = name;
          //console.log(sessionStorage.email);
          window.location.assign("/");
        }else{
          window.location.assign("/login?status="+r.status);
        }
      }
    });
  }else{
    if(email.length == 0){
      notification.innerHTML="Input the email."
      return false;
    }
    if(password.length == 0){
      notification.innerHTML="Input the password."
      return false;
    }
    
    $.ajax
    ({
      type: "POST",
      url: "/",
      headers: {
        "Authorization": "Basic " + btoa(email + ":" + password)
      },
      success : function (r) {
        if(r.status == 0){
          sessionStorage.email = email;
          sessionStorage.name = r.username;
          //console.log(sessionStorage.email);
          window.location.assign("/");
        }else{
          window.location.assign("/login?status="+r.status);
        }
      }
    });

  }
}



function sign_up(){
  var inputs = document.querySelectorAll('.input_form_sign');
  document.querySelectorAll('.ul_tabs > li')[0].className="";
  document.querySelectorAll('.ul_tabs > li')[1].className="active";

  for(var i = 0; i < inputs.length ; i++  ) {
    if(i == 2  ){

    }else{
      document.querySelectorAll('.input_form_sign')[i].className = "input_form_sign d_block";
    }
  }

  setTimeout( function(){
    for(var d = 0; d < inputs.length ; d++  ) {
     document.querySelectorAll('.input_form_sign')[d].className = "input_form_sign d_block active_inp";
   }


 },100 );
  document.querySelector('.link_forgot_pass').style.opacity = "0";
  document.querySelector('.link_forgot_pass').style.top = "-5px";
  document.querySelector('.btn_sign').innerHTML = "SIGN UP";
  setTimeout(function(){

   document.querySelector('.terms_and_cons').style.opacity = "1";
   document.querySelector('.terms_and_cons').style.top = "5px";

 },500);
  setTimeout(function(){
    document.querySelector('.link_forgot_pass').className = "link_forgot_pass d_none";
    document.querySelector('.terms_and_cons').className = "terms_and_cons d_block";
  },450);

}



function sign_in(){
  var inputs = document.querySelectorAll('.input_form_sign');
  document.querySelectorAll('.ul_tabs > li')[0].className = "active";
  document.querySelectorAll('.ul_tabs > li')[1].className = "";

  for(var i = 0; i < inputs.length ; i++  ) {
    switch(i) {
      case 1:
      console.log(inputs[i].name);
      break;
      case 2:
      console.log(inputs[i].name);
      default:
      document.querySelectorAll('.input_form_sign')[i].className = "input_form_sign d_block";
    }
  }

  setTimeout( function(){
    for(var d = 0; d < inputs.length ; d++  ) {
      switch(d) {
        case 1:
        console.log(inputs[d].name);
        break;
        case 2:
        console.log(inputs[d].name);

        default:
        document.querySelectorAll('.input_form_sign')[d].className = "input_form_sign d_block";
        document.querySelectorAll('.input_form_sign')[2].className = "input_form_sign d_block active_inp";

      }
    }
  },100 );

  document.querySelector('.terms_and_cons').style.opacity = "0";
  document.querySelector('.terms_and_cons').style.top = "-5px";

  setTimeout(function(){
   document.querySelector('.terms_and_cons').className = "terms_and_cons d_none";
   document.querySelector('.link_forgot_pass').className = "link_forgot_pass d_block";

 },500);

  setTimeout(function(){

   document.querySelector('.link_forgot_pass').style.opacity = "1";
   document.querySelector('.link_forgot_pass').style.top = "5px";


   for(var d = 0; d < inputs.length ; d++  ) {

    switch(d) {
      case 1:
      console.log(inputs[d].name);
      break;
      case 2:
      console.log(inputs[d].name);

      break;
      default:
      document.querySelectorAll('.input_form_sign')[d].className = "input_form_sign";
    }
  }
},1500);
  document.querySelector('.btn_sign').innerHTML = "SIGN IN";
}


window.onload =function(){
  document.querySelector('.cont_centrar').className = "cont_centrar cent_active";

}

