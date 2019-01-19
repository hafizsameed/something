if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js')
        .then(() => {
            console.log('service worker registered')
        })

}
var loader=document.getElementById("loader");
function signup()
{   
var maindiv=document.getElementById("maindiv");
loader.style.display="inline-block";
var name=document.getElementById("name").value;
var phoneno=document.getElementById("number").value;
var email=document.getElementById("email").value;
var pass=document.getElementById("password").value;
var file=document.getElementById("file").files[0];
    firebase.auth().createUserWithEmailAndPassword(email,pass)
    .then((result)=>{
        let userobj={
            name,
            phoneno,
            email,
        }
        firebase.storage().ref().child(`profile/${file.name}`)
        .put(file)
        .then((url)=>{
            url.ref.getDownloadURL()
            .then((image)=>{
                userobj.profile=image;
                userid=firebase.auth().currentUser.uid;
                console.log(userid);
                firebase.database().ref("users/"+userid).set(userobj).then(()=>{
                    loader.style.display="none";
                    swal({
                        title: "Sign up sucessful",
                        text: "your account has been created",
                        icon: "success",
                        button: "Ok",
                      }).then(()=>{
                          window.location="signin.html";
                      })
                })
            })
        })
        
    })
    .catch((err)=>{
        loader.style.display="none";
        swal({
            title: "Sign up unsucessful",
            text: err.message,
            icon: "warning",
            button: "Ok",
          });
        var msgerror=err.message;
        console.log(msgerror);
    })
}
function signin()
{
    var loader=document.getElementById("loader");
    loader.style.display="inline-block"
    var email=document.getElementById("email").value
    var pass=document.getElementById("password").value
    // var userobj={
    //     email,
    //     pass
    // }
    firebase.auth().signInWithEmailAndPassword(email,pass)
    .then((succ)=>{
        loader.style.display="none"
        swal({
            title: "Sign in sucessful",
            text: "you are logged in",
            icon: "success",
            button: "Ok",
          }).then(()=>{
              window.location="home.html"

              window.localStorage.setItem("user", JSON.stringify(succ))
          })
    
        }
)
    .catch((err)=>{
        loader.style.display="none"
        swal({
            title: "Sign in unsucessful",
            text: err.message,
            icon: "warning",
            button: "Ok",
          });
        console.log(err.message)
    })
    var usser=firebase.auth().currentUser.uid;
    console.log(usser);
    pro(usser);
}
function logout() {
	firebase.auth().signOut().then(() => {
		localStorage.clear();
        swal({
            title: "Logged out",
            icon: "success",
            button: "Ok"
        })

            window.location.href = "signin.html";
      
        }).catch(err => {
        swal({
            title: "Failed",
            text: err.message,
            icon: "warning",
            button: "Ok",
          })
		console.log(err.message);
	});
}
function post()
{  
   
    loader.style.display="inline-block"
    var name=document.getElementById("name").value;
    var ph=document.getElementById("phoneno").value;
    var group=document.getElementById("type").value
    var current=firebase.auth().currentUser.uid;
    console.log(current);
    // var type=document.getElementsByName("optradio")
    var acceptor=document.getElementById("acceptor");
    var donor=document.getElementById("donor");
    var done= document.getElementById("done");
    
    if(name!="" && name!=" " && ph!="" && ph!=" " && group!="" && group!=" ")
    {
    if(acceptor.checked==true)
    {
        var userobj={
            name,ph,group,type:"acceptor"
        }
        firebase.database().ref("acceptor/"+ current).push(userobj)
        .then((succ)=>{
            loader.style.display="none"
            swal({
                title: "POSTED",
                text: "Your AD has been posted",
                icon: "success",
                button: "Ok",
              });
        })
        .catch((e)=>{
            loader.style.display="none"
            swal({
                title: "Failed",
                text: e.message,
                icon: "warning",
                button: "Ok",
              });
        })
    }
    else if( donor.checked==true)
    {
        var userobj={
            name,ph,group,type:"donor"
        }
        firebase.database().ref("donor/"+current).push(userobj)
        .then((succ)=>{
            loader.style.display="none"
            swal({
                title: "POSTED",
                text: "Your AD has been posted",
                icon: "success",
                button: "Ok",
              });
        })
        .catch((e)=>{
            loader.style.display="none"
            swal({
                title: "Failed",
                text: e.message,
                icon: "warning",
                button: "Ok",
              });
        })
    }
}
else{
    loader.style.display="none";
    swal({
        title: "you missed something",
        icon: "warning",
        button: "Ok",
      });
}
// addEventListener("load",()=>{
//     var data=window.localStorage.getItem("user");
//     var converteddata=JSON.parse(data);
//     if(converteddata==null)
//     {
//         swal({
//             title: "Failed",
//             text: "Login session expired",
//             icon: "warning",
//             button: "Ok",
//           });
//     }
//     else{
//         console.log("welcome")
//     }
// })
  
    
    
}

function showacceptors()
{   
    var header=document.getElementById("header");
    header.innerHTML="Acceptors"
    var arr=[];
    var div=document.getElementById("homediv");
    firebase.database().ref("acceptor/").once('value', function(succ) {
        succ.forEach(function(key) {
          var keyVal = key.val();
          div.innerHTML="";
          for(var key2 in keyVal )
          {
             keyVal[key2].id=key2;
              arr.push(keyVal[key2]);
          }
         arr.map((e)=>{
            div.innerHTML+=`<div class="acceptoritems">
            <div class="name"><label> Name :</label>  ${e.name}</div>
            <div class="group"><label> Blood Group : </label> ${e.group}</div>
            <div class="text-right">
            <button onClick="contact(${e.ph})" data-toggle="modal" data-target="#myModal" class="btn btn-primary buttons">contact</button>
            </div>
            </div>
            <br/>`
         })
        })
    })
}
addEventListener("load",()=>{
    showacceptors();
})
function showdonors()
{
    var header=document.getElementById("header");
    header.innerHTML="Donor"
    var arr=[];
    var div=document.getElementById("homediv");
    firebase.database().ref("donor/").once('value', function(succ) {
        succ.forEach(function(key) {
          var keyVal = key.val();
          div.innerHTML="";
          for(var key2 in keyVal )
          {
             keyVal[key2].id=key2;
              arr.push(keyVal[key2]);
          }
         arr.map((e)=>{
            div.innerHTML+=`<div class="donoritems">
            <div class="image><img href="${e.profile}" height="100px" width="100px" /> </div>
            <div class="name"><label> Name :</label>  ${e.name}</div>
            <div class="group"><label> Blood Group : </label> ${e.group}</div>
            <div class="text-right">
            <button onClick="contact(${e.ph})" data-toggle="modal" data-target="#myModal" class="btn btn-primary buttons">contact</button>
            </div>
            </div>
            <br/>`
         })
        })
    })

}
function contact(id)
{
    var contactNo=document.getElementById("contact");
    var currentuser=firebase.auth().currentUser.uid;
    contactNo.innerHTML=` Contact Number : ${id} `;
}
// var probtn=document.getElementById("probtn");
// probtn.addEventListener("click",);
// window.location.href="profile.html"
// window.onload=pro;


    // var fbuid= firebase.auth.currentUser.uid
    // console.log(fbuid);
window.onload=pro;
function pro()
{
    var loader2=document.getElementById("loader2");
    loader2.style.display="block";
    console.log("pro");
   var data= localStorage.getItem("user");
    var convodata=JSON.parse(data);
    var fr=convodata.user.uid;
    var pf=document.getElementById("pro"); 
    var tar= firebase.database().ref("users/"+fr)
    tar.on('value', function(succ) {
        var e= succ.val()
        pf.innerHTML=`
        <img id="profile-img" src="${e.profile}" width=200px" height="200px" />
        <h1 id="profile-name">${e.name}</h1>
        <p><label>Phone No :</label> ${e.phoneno} </p>
        `
    })
}


       
