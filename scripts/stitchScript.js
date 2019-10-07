const client = stitch.Stitch.initializeDefaultAppClient('basicblog-dihid');

const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('Blog');



async function init(){
  console.log("Init() called")
  console.log(`   Is there login? ${client.auth.isLoggedIn}`)
  if(await client.auth.isLoggedIn){
    document.getElementById("loginDisplay").style.display ="none";
    document.getElementById("logoutDisplay").style.display ="block";
    document.getElementById("userNameDisplay").style.display ="block";
    updateUserInformation()
  }
  else{
    document.getElementById("loginDisplay").style.display ="block";
    document.getElementById("logoutDisplay").style.display ="none";
    document.getElementById("userNameDisplay").style.display ="none";
  }
}



async function login(){
  console.log("Login() called")
  const credential = await new stitch.UserPasswordCredential(document.getElementById("formMail").value.toLowerCase(), document.getElementById("formPassword").value)
  await client.auth.loginWithCredential(credential)
    .then(authedUser => console.log(`   successfully logged in with id: ${authedUser.id}`))
    .catch(err => console.error(`   login failed with error: ${err}`));
  
  if(await client.auth.isLoggedIn){
    console.log("   Login successful")
    init();
    showMain();
    updateUserInformation();
    document.getElementById("failLogInMessage").style.display ="none";
  }
  else{
    console.log("   Login failed")
    document.getElementById("failLogInMessage").style.display ="block";
  }
}

async function logout(){
  console.log("Logout() called")
  await client.auth.logout();

  if(await !client.auth.isLoggedIn){
    console.log("   Logout successful")
    init();
  }
}



function showLogin(){
  console.log("showLogin() called")
  document.getElementById("MainView").style.display ="none";
  document.getElementById("LoginView").style.display ="block";
}

function showMain(){
  console.log("showMain() called")
  document.getElementById("LoginView").style.display ="none";
  document.getElementById("MainView").style.display ="block";
}

function updateUserInformation(){
  console.log("updateUserInformation() called")
    var user = client.auth.user;
    var profile = user.profile;
    if(profile.email !== undefined){
        document.getElementById("userNameDisplay").innerHTML = profile.email;
    }
}