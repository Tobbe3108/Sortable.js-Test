const client = stitch.Stitch.initializeDefaultAppClient('basicblog-dihid');

const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'mongodb-atlas').db('Blog');



async function init() {
  console.log("Init() called");

  await cardLoad();
  await isLoggedIn();

  $('#userNameDisplay').tooltip('dispose')
  $('#userNameDisplay').tooltip()
}


/* Login functions */
async function login(){
  console.log("Login() called");

  const credential = await new stitch.UserPasswordCredential(document.getElementById("formMail").value.toLowerCase(), document.getElementById("formPassword").value)
  await client.auth.loginWithCredential(credential)
    .then(authedUser => console.log(`   successfully logged in with id: ${authedUser.id}`))
    .catch(err => console.error(`   login failed with error: ${err}`));
  
  if(await client.auth.isLoggedIn){
    console.log("   Login successful")
    init();
    showMain();
    updateUserInformation();
    hide(document.getElementById("failLogInMessage"));
  }
  else{
    console.log("   Login failed")
    show(document.getElementById("failLogInMessage"));
  }

  clearAllCards();
}

async function logout(){
  console.log("Logout() called");

  await client.auth.logout();

  if(await !client.auth.isLoggedIn){
    console.log("   Logout successful")
    isLoggedIn();
  }
}
/*---------------------------------------*/



function showLogin(){
  console.log("showLogin() called")
  hide(document.getElementById("MainView"));
  show(document.getElementById("LoginView"));
}

function showMain(){
  console.log("showMain() called")
  hide(document.getElementById("LoginView"));
  show(document.getElementById("MainView"));
}

function updateUserInformation(){
  console.log("updateUserInformation() called")
    var user = client.auth.user;
    var profile = user.profile;
    if(profile.email !== undefined){
        document.getElementById("userNameDisplay").setAttribute("title", profile.email);
    }
}

function show(element){
  console.log("show() called on element with id:" + element.id)
  element.style.display ="block";
}

function hide(element){
  console.log("hide() called on element with id:" + element.id)
  element.style.display ="none";
}

async function isLoggedIn() {
  console.log("isLoggedIn() called");
  
  console.log(`   Is there login? ${client.auth.isLoggedIn}`);
  if(client.auth.isLoggedIn) {
    hide(document.getElementById("loginDisplay"));
    show(document.getElementById("logoutDisplay"));
    show(document.getElementById("userNameDisplay"));

    show(document.getElementById("A").querySelector("#addBtn"));
    show(document.getElementById("B").querySelector("#addBtn"));
    show(document.getElementById("C").querySelector("#addBtn"));
    show(document.getElementById("D").querySelector("#addBtn"));

    updateUserInformation();
    createAllSortable();
  }
  else{
    show(document.getElementById("loginDisplay"));
    hide(document.getElementById("logoutDisplay"));
    hide(document.getElementById("userNameDisplay"));

    hide(document.getElementById("A").querySelector("#addBtn"));
    hide(document.getElementById("B").querySelector("#addBtn"));
    hide(document.getElementById("C").querySelector("#addBtn"));
    hide(document.getElementById("D").querySelector("#addBtn"));

    removeEdit();
    removeAllSortable();
  }
}