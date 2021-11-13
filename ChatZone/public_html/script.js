/*
 /  Author:     Minghui Ke , Ruihan Zhang
 /  Assignment: Chat Zone
 /  
 /  Purpose:    The script.js file will use ajax to get or post details from server by ajax.
*/


//-------------------------------------User-----------------------------------------------//
//the login function is to login with existed username and passowrd
function login() {
    let name = $('#lusername').val();
    let pw = $('#lpassword').val();
    $.ajax({
	// call function in sever.js
        url: '/login/' + name + "/" + pw,
        method: 'GET',
        success: function (result) {
            if (result == "incorrect") {
                alert("Error: incorrect username or password!")
            } else {
		// go to home page if usename and password is correct
                window.location.href = "http://localhost:3000/home.html";
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}
//the logour function is an onclick function to go back to index page
function logout() {
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
    window.location.href = "http://localhost:3000/index.html";
}
//createaccount function to to create an account with input username and password
function createAccount() {
    let name = $('#username').val();
    let pw = $('#password').val();
    let user = { username: name, password: pw }
    let user_str = JSON.stringify(user);
    $.ajax({
        url: '/create/user/',
        data: { user: user_str },
        method: 'POST',
        success: function (result) {
            alert(result);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

//change colors of elements for home page
function changecolor() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            document.getElementById('column1').style.backgroundColor = "#" + result;
            document.getElementById("btn1").style.color = "#" + result;
            document.getElementById("btn2").style.color = "#" + result;
            document.getElementById("btn3").style.color = "#" + result;
            document.getElementById("btn4").style.color = "#" + result;
            document.getElementById("btn5").style.color = "#" + result;
	    document.getElementById("logout").style.color = "#" + result;
            document.getElementById('column3').style.backgroundColor = "#" + result;
            document.getElementById('friends').style.backgroundColor = "#" + result;
            document.getElementById("searchinput").style.color = "#" + result;
            document.getElementById("searchinput").style.borderColor = "#" + result;
            document.getElementById("searchtext").style.color = "#" + result;
            document.getElementById("textarea").style.color = "#" + result;
	 document.getElementById("emojibtn").style.color = "#" + result;},
    });
}

//change colors of elements for me page
function changecolor2() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            document.getElementById('column1').style.backgroundColor = "#" + result;
	    document.getElementById('information2').style.backgroundColor = "#" + result;
            document.getElementById("btn1").style.color = "#" + result;
            document.getElementById("btn2").style.color = "#" + result;
            document.getElementById("btn3").style.color = "#" + result;
            document.getElementById("btn4").style.color = "#" + result;
		document.getElementById("logout").style.color = "#" + result;
	    document.getElementById("img").style.borderColor = "#" + result;
            document.getElementById("birthday").style.borderColor = "#" + result;
            document.getElementById("favcolor").style.borderColor = "#" + result;
            document.getElementById("job").style.borderColor = "#" + result;
	    document.getElementById("ps").style.borderColor = "#" + result;
	    document.getElementById("gender").style.borderColor = "#" + result;
            document.getElementById("submitinfo").style.color = "#" + result;
        },
    });
}
//change colors of elements for moment page
function changecolor3() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            document.getElementById('column1').style.backgroundColor = "#" + result;
	    document.getElementById('momupload').style.backgroundColor = "#" + result;
            document.getElementById("btn1").style.color = "#" + result;
            document.getElementById("btn2").style.color = "#" + result;
            document.getElementById("btn3").style.color = "#" + result;
            document.getElementById("btn4").style.color = "#" + result;
	    document.getElementById("logout").style.color = "#" + result;
	    document.getElementById("textarea2").style.color = "#" + result;
            document.getElementById("img2").style.borderColor = "black";
            
            document.getElementById("submitmom").style.color = "#" + result;
        },
    });
}
//-------------------------------------Friend---------------------------------------------//
//search people's name with specific keyword in one of three types
function search() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    var text = $("#friends").val();
    var input = $("#searchinput").val();
    if (text == "Added friends") {
        str = '/search/friends/'+input;
    } else if (text == "New friends") {
        str = '/search/wait/'+input;
    } else if (text == "Someone you might know") {
        str = '/search/strangers/'+input;
    }
    var str1="";
    $("#friendsl").html(str1);
    $.ajax({
        url: str,
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
	    for (i in result){
		if (str=='/search/friends/'+input){
	          str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfof(\'"+result[i].name+"\')\">"+result[i].name+"  </button>"+"<br/><br/>";
		} else if (str=='/search/wait/'+input){
	          str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfow(\'"+result[i].name+"\')\">"+result[i].name+"  </button>"+"<br/><br/>";
		} else if (str=='/search/strangers/'+input){
	          str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfos(\'"+result[i].name+"\')\">"+result[i].name+"  </button>"+"<br/><br/>";
		} 
                
		$("#friendsl").html(str1);
            }
            
        }
    });
    
}

//display information on column 4
function welcome() {
    var str1="";
    $.ajax({
        url: '/get/name/',
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
	    str1+="<h2> Welcome back, "+result+" !</h2>"+"<br/><br/>";
        let today = new Date().toISOString().slice(0, 10);
        str1+="<h3> Today is "+today+", have a good day!</h3><br/><br/>"
        str1+='<img src="images/welcome.jpg" width=350 height=600>';
            $("#column4").html(str1);
        }
    });
}

//add head portrait
function touxiang() {
    $.ajax({
        url: '/get/touxiang/',
        method: 'GET',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            $("#touxiang").html("<img src=\"images/"+result+"\"width=\"150\" height=\"150\">");
        }
    });
}

//view my own info including my moment, my basic information
function info() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    var str1="";
    $.ajax({
        url: '/get/info/',
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
         str1+="<h1> My Info </h1>";     
        str1+="<h3> Name: " +result.name+"</h3>";
	    if (result.gender == undefined) str1+="<h3> gender: Secret </h3>";
	    else str1+="<h3> gender: " +result.gender+"</h3>";
        if (result.birthday == undefined) str1+="<h3> Birthday: Secret </h3>";
	    else str1+="<h3> Birthday: " +result.birthday+"</h3>";
        if (result.job == undefined) str1+="<h3> Job: Secret </h3>";
	    else str1+="<h3> Job: " +result.job+"</h3>";
        if (result.ps == undefined) str1+="<h3> Personal Signature: Secret </h3>";
	    else str1+="<h3> Personal Signature: " +result.ps+"</h3>";
	    str1+="<h3> Like: " +result.like+"</h3>";
	    str1+="<h1> My Moment </h1>"; 
            $("#information2").html(str1);
        }
    });
	$.ajax({
        url: '/get/moment/',
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        for (var i = result.length - 1; i >= 0; i--) {
				str1+="<div class=\'momdiv2\' style=\"border:4px solid black; overflow:hidden; padding-left: 110px; padding-right: 110px\">"
				str1+="<h2 style=\"text-align: left; margin-bottom:10px\">"+result[i].text+"</h2>"
				str1+="<img style=\"float: left;margin-bottom:40px\"src=\"images/"+result[i].image+"\"width=\"350\" height=\"250\">"
		        str1+="<br/><br/><br/><br/><br/><br/><h3 style=\"color:red;\"> Likes:"+result[i].like+"</h3>";
                str1+="</div> <br/>"
            }
            $("#information2").html(str1);
        }
    });
}

//add my own info
function addinfo() {
    //get values of inputs and create url
    let gender = $("#gender").val();
    let job = $("#job").val();
    let ps = $("#ps").val();
    let birth = $("#birthday").val();
    let color = document.getElementById('favcolor').value.substring(1);
    let img = document.getElementById('img').files[0];
    if (gender==undefined||job==undefined||ps==undefined||birth==undefined||color==undefined||img==undefined){
        alert("You must fill all up");
        return;
    }
    img = img.name;
  
    $('#myForm').submit();
    $.ajax({
        url: '/add/info/' + birth + '/' + color + '/' + img + '/' + gender + '/' + job + '/' + ps,
        method: 'POST',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            alert('info added');
        },
        error: function (error) {
            alert('info add fail');
        }
    });
}


// get different type of friends' when change the select
function updatefriend() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    var text = $("#friends").val();
    if (text == "Added friends") {
        str = '/get/friends/';
    } else if (text == "New friends") {
        str = '/get/wait/';
    } else if (text == "Someone you might know") {
        str = '/get/strangers/';
    } 
    var str1=""
    $("#friendsl").html(str1);
    $.ajax({
        url: str,
        method: 'GET',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            for (i in result){
                if (str=="/get/friends/"){
                    str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfof(\'"+result[i].name+"\'); viewmoment(\'"+result[i].name+"\');\">"+result[i].name+"  </button>"+"<br/><br/>";
                } else if (str=="/get/wait/"){
                    str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfow(\'"+result[i].name+"\'); viewmoment(\'"+result[i].name+"\');\">"+result[i].name+"  </button>"+"<br/><br/>";
                } else if (str=="/get/strangers/"){
                    str1+= "<button style=\"color:"+ favcolor+";\" id=result[i].name onclick=\"viewfriendinfos(\'"+result[i].name+"\'); viewmoment(\'"+result[i].name+"\');\">"+result[i].name+"  </button>"+"<br/><br/>";
                }     
                $("#friendsl").html(str1);
            }
        }
    });
}

// send a friend request to strangers
function ask(name) {
    $.ajax({
        url: '/add/friend/ask/' + name,
        method: 'POST',
        success: function (result) {
            alert("The friend request has been sent!");
        }
    });
}

// accpect the friend request
function accept(name) {
    $.ajax({
        url: '/add/friend/accept/' + name,
        method: 'POST',
        success: function (result) {
            alert("The friend request has been accepted!");
            window.location.reload();
        }
    });
}

// view the friends' info on column 4.
function viewfriendinfof(name) {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    str1="";
    $.ajax({
        url: '/view/info/'+name,
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        str1+='<img src="images/'+result.image+'" width=100 height=100>';
        str1+="<h4> Name: " +name+"</h4>";
	    if (result.gender == undefined) str1+="<h4> gender: Secret </h4>";
	    else str1+="<h4> gender: " +result.gender+"</h4>";
        if (result.birthday == undefined) str1+="<h4> Birthday: Secret </h4>";
	    else str1+="<h4> Birthday: " +result.birthday+"</h2>";
        if (result.job == undefined) str1+="<h4> Job: Secret </h4>";
	    else str1+="<h4> Job: " +result.job+"</h4>";
        if (result.ps == undefined) str1+="<h4> Personal Signature: Secret </h4>";
	    else str1+="<h4> Personal Signature: " +result.ps+"</h4>";
	 str1+="<h4 id=\"LIKE\"> Like: " +result.like+"</h4>";
        
	 str1+= "<button style=\"color:"+ favcolor+";\" onclick=\"chat(\'"+name+"\')\"> CHAT"+"  </button>"+"<br/><br/>";
	 str1+='<div id=smallMoment></div>'
        $("#column4").html(str1);
        }
    });
}

// set the name of the person who is taking with.
function chat(n){
    str1="";
    str1+="<h3  style=\'border:2px solid black; width:300px; position:absolute; left:30%;\'>" + n + '</h3>'
    document.getElementById('identify').innerHTML=str1;
    showMessage();
}

// view the waitlist people's info on column 4.
function viewfriendinfow(name) {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    str1="";
    $.ajax({
        url: '/view/info/'+name,
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        str1+='<img src="images/'+result.image+'" width=100 height=100>';
        str1+="<h4> Name: " +name+"</h4>";
	    if (result.gender == undefined) str1+="<h4> gender: Secret </h4>";
	    else str1+="<h4> gender: " +result.gender+"</h4>";
        if (result.birthday == undefined) str1+="<h4> Birthday: Secret </h4>";
	    else str1+="<h4> Birthday: " +result.birthday+"</h2>";
        if (result.job == undefined) str1+="<h4> Job: Secret </h4>";
	    else str1+="<h4> Job: " +result.job+"</h4>";
        if (result.ps == undefined) str1+="<h4> Personal Signature: Secret </h4>";
	    else str1+="<h4> Personal Signature: " +result.ps+"</h4>";
	    str1+="<h4 id=\"LIKE\"> Like: " +result.like+"</h4>";
	    str1+= "<button style=\"color:"+ favcolor+";\" onclick=\"accept(\'"+name+"\')\"> ACCEPT"+"  </button>"+"<br/><br/>";
	    str1+='<div id=smallMoment></div>'
        $("#column4").html(str1);
        }
    });
}

// view the stranger people's info on column 4.
function viewfriendinfos(name) {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    str1="";
    $.ajax({
        url: '/view/info/'+name,
        method: 'GET',
        success: function (result) {
        if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        str1+='<img src="images/'+result.image+'" width=100 height=100>';
        str1+="<h4> Name: " +name+"</h4>";
	    if (result.gender == undefined) str1+="<h4> gender: Secret </h4>";
	    else str1+="<h4> gender: " +result.gender+"</h4>";
        if (result.birthday == undefined) str1+="<h4> Birthday: Secret </h4>";
	    else str1+="<h4> Birthday: " +result.birthday+"</h2>";
        if (result.job == undefined) str1+="<h4> Job: Secret </h4>";
	    else str1+="<h4> Job: " +result.job+"</h4>";
        if (result.ps == undefined) str1+="<h4> Personal Signature: Secret </h4>";
	    else str1+="<h4> Personal Signature: " +result.ps+"</h4>";
	    str1+="<h4 id=\"LIKE\"> Like: " +result.like+"</h4>";
        str1+= "<button style=\"color:"+ favcolor+";\" onclick=\"ask(\'"+name+"\')\"> ADD"+"  </button>";
        str1+='<div id="smallMoment" ></div>'
	   
        $("#column4").html(str1);
        }
    });
}

//-------------------------------------Friend---------------------------------------------//

//-------------------------------------Chat-----------------------------------------------//

// send message and add them into mongodb
function sendMessage(){
    var n = $("#identify").text();
    var m = $("#textarea").val();
    document.getElementById("textarea").value = "";
    let message = {time: Date.now(), user_b:n, message:m}
    let message_str = JSON.stringify(message);
    $.ajax({
        url: '/post/message/',
        data:{message : message_str},
        method:'POST',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        },
        error: function(error) {
            console.log(error);
        }
    });
}

// display the message.
function showMessage(){
    setInterval( () => {
        $.ajax({
            url: '/changecolor/',
            method: 'GET',
            success: function (result) {
                favcolor="#"+result;
            },
        });
        var n = $("#identify").text();
        $.ajax({
        url: '/get/message/' + n,
        method:'GET',
        success: function(results) {
            result = '';
            for (i in results) {
                if (results[i].people=="me") result += "<div  style=\'color:"+ favcolor+";\' class='rightchat'>" + results[i].message + '</div><br>';
                else result +=  "<div  style=\'color:"+ favcolor+";\' class='leftchat'>" + results[i].message + '</div><br>';
            }
            $("#chats").html(result);
            if (flag) document.getElementById('chats').scrollTop = document.getElementById('chats').scrollHeight;
        }
        });
    }, 500)
}

//---------------------------------------Chat-------------------------------------------------------//

//---------------------------------------Moment-------------------------------------------------------//


// post moment and add them in mongodb
function addmom(){
    var img2 = document.getElementById('img2').files[0].name;
    var text=  $("#textarea2").val();
    let moment = {time: Date.now(), image:img2, text:text, like:0}
    let moment_str = JSON.stringify(moment);
    $('#myMoment').submit();
    $.ajax({
        url: '/add/moment/',
        data:{moment : moment_str},
        method:'POST',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            alert("Moment has been post");
        },
        error: function(error) {
            console.log(error);
        }
    });
    
}

//display moment in moment page.
function viewallmoment() {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    let str1="";
    $.ajax({
        url: '/get/allMoment',
        method: 'GET',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            for (i in result){
				str1+="<div class=\'momdiv\' style=\"border:4px solid "+ favcolor+";overflow:hidden; padding-left: 100px; padding-right: 100px\">"
				str1+="<h2  style=\' font-family:Comic Sans MS; color:"+ favcolor+"; position:relative; left:-500px;\'>"+result[i].user.username+"</h2>"
				str1+="<h3 style=\"color:black;text-align: left; margin-buttom: 20px;\">"+result[i].text+"</h3>"
				str1+="<img style=\"float:left; margin-buttom: 50px\"src=\"images/"+result[i].image+"\"width=\"400\" height=\"300\">"
		        str1+="<h4 id=\'likenum"+result[i]._id+"\' style=\"color:"+ favcolor+";\"> Likes:"+result[i].like+"</h4>";
		        str1+="<button class=\'like\' id=\'like"+result[i]._id+"\'; style=\"color:"+ favcolor+";\" onclick=\"addlike(\'"+result[i]._id+"\'); viewallmoment(); changebtncolor(\'"+result[i]._id+"\')\"> <i class=\'fa fa-thumbs-up\'></i><span class='icon'></span> </button>"
                str1+="<button class=\'like\' style=\"color:"+ favcolor+";\" onclick=\"loselike(\'"+result[i]._id+"\'); viewallmoment();\"> <i class=\'fa fa-thumbs-down\'></i><span class='icon'></span> </button>"
				str1+="</div>"
            }
	    $("#displaymom").html(str1);
        }
    });
}
//display specific people's moment
function viewmoment(name) {
    $.ajax({
        url: '/changecolor/',
        method: 'GET',
        success: function (result) {
            favcolor="#"+result;
        },
    });
    let str1="";
    $.ajax({
        url: '/get/moment/'+name,
        method: 'GET',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
            for (var i = result.length - 1; i >= 0; i--) {
				str1+="<div class=\'momdiv2\' style=\"border:4px solid"+ favcolor+"; overflow:hidden; padding-left: 10px; padding-right: 10px\">"
				str1+="<div style=\"text-align: left;\"><h4>"+result[i].text+"</h4></div>"
				str1+="<img style=\"float: left;margin-bottom:10px\" src=\"images/"+result[i].image+"\"width=\"150\" height=\"150\">"
                str1+="<br/><br/><h4 style=\"color:red;\"> Likes:"+result[i].like+"</h4>";
		        str1+="<button class=\'like\' id=\'liked\' style=\"color:"+ favcolor+";\" onclick=\"addlike(\'"+result[i]._id+"\'); viewmoment('"+name+"')\"> <i class=\'fa fa-thumbs-up\'></i><span class='icon'></span> </button>"
                str1+="<button class=\'like\' id=\'dislike\' style=\"color:"+ favcolor+";\" onclick=\"loselike(\'"+result[i]._id+"\'); viewmoment('"+name+"')\"> <i class=\'fa fa-thumbs-down\'></i><span class='icon'></span> </button>"
				str1+="</div> <br/>"
            }
	    $("#smallMoment").html(str1);
        }
    });
}
// give a like to a moment, need double-click the button
function addlike(id){
     
     $.ajax({
        url: '/add/like/' + id ,
        method: 'POST',
        success: function (result) {
            if (result == "logout") window.location.href = "http://localhost:3000/index.html";
        },
        error: function (error) {
            
        }
    });
}
// give a dislike to a moment, need double-click the button
function loselike(id){
    
    $.ajax({
       url: '/lose/like/' + id ,
       method: 'POST',
       success: function (result) {
           if (result == "logout") window.location.href = "http://localhost:3000/index.html";
       },
       error: function (error) {
           
       }
   });
}
//add emojis to chat
function addEmoji(emoji) {
    textarea.value += emoji;
}
//display emojis
function showemoji() {
  let drawer = document.getElementById('drawer');
  
  if (drawer.classList.contains('hidden')) {
    drawer.classList.remove('hidden');
  } else {
    drawer.classList.add('hidden');
  }
}
