/* Add Card Functions */
function cardAdd(sortpanel, caller, id) {
    console.log("cardAdd() called");

    document.getElementById(sortpanel).innerHTML += `
    <li data-id="${id}" data-sortpanel="${sortpanel}" data-index="0" class="list-group-item card">
    <div class="btn-group float-sm-right">
    <a id="editBtn" onclick="cardEdit(this)" style="display: none" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Rediger"><i class="far fa-edit"></i></a>
    <a id="saveBtn" onclick="cardSave(this)" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Gem"><i class="far fa-save"></i></a>
    <a id="removeBtn" onclick="cardRemove(this)" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Slet"><i class="far fa-trash-alt"></i></a>
    </div>
    <div class="card-body">
    <div id="view" style="display: none">
    <h5 id="title" class="card-title"></h5>
    <p id="text" class="card-text"></p>
    </div>
    <div id="edit" class="form-group">
    <input id="titleEdit" type="text" class="form-control" placeholder="Titel">
    <br>
    <textarea id="textEdit" class="form-control" rows="1" placeholder="Tekst"></textarea>
    </div>
    </div>
    </li>
    `;
    toolTip();
    sortableFalse(document.getElementById(sortpanel));
}

async function cardAddDB(sortpanel, caller){
    console.log("cardAddDB() called");   
    var id = ID();
    var error = false;
    await db.collection("Comments").insertOne({
        _id: id,
        index: "",
        sortpanel: "",
        title: "",
        text: ""
    })
    .catch(err => {console.error(err), error = true});

    if (!error) {
        console.log("   Oprettelse a kort på databasen lykkedes");
        cardAdd(sortpanel, caller, id)
        updateIndexAll(sortpanel)
    }
    else {
        console.log("   Fejl ved oprettelse af kort på databasen");
        alert("Fejl ved oprettelse a kort på databasen - Tjek din internetforbindelse");
    }
}
/*************************/



/* Edit Card Functions */
function cardEdit(caller){
    console.log("cardEdit() called");
    hide(caller.parentElement.querySelector("#editBtn"));
    show(caller.parentElement.querySelector("#saveBtn"));
    show(caller.parentElement.querySelector("#removeBtn"));
    hide(caller.parentElement.parentElement.querySelector("#view"));
    show(caller.parentElement.parentElement.querySelector("#edit"));

    caller.parentElement.parentElement.querySelector("#titleEdit").value = caller.parentElement.parentElement.querySelector("#title").innerHTML;
    caller.parentElement.parentElement.querySelector("#textEdit").innerHTML = caller.parentElement.parentElement.querySelector("#text").innerHTML;
    
    var input = caller.parentElement.parentElement.querySelector("#titleEdit");
    input.focus();
    input.select();

    sortableFalse(caller.parentElement.parentElement.parentElement);
}
/*************************/



/* Save Card Functions */
function cardSave(caller){
    console.log("cardSave() called");
    show(caller.parentElement.querySelector("#editBtn"));
    hide(caller.parentElement.querySelector("#saveBtn"));
    hide(caller.parentElement.querySelector("#removeBtn"));
    show(caller.parentElement.parentElement.querySelector("#view"));
    hide(caller.parentElement.parentElement.querySelector("#edit"));
    
    if (caller.parentElement.parentElement.querySelector("#titleEdit").value == "") {
        caller.parentElement.parentElement.querySelector("#title").innerHTML = "Titel"
    }
    else{
        caller.parentElement.parentElement.querySelector("#title").innerHTML = caller.parentElement.parentElement.querySelector("#titleEdit").value;
    }
    if (caller.parentElement.parentElement.querySelector("#textEdit").value == "") {
        caller.parentElement.parentElement.querySelector("#text").innerHTML = "Tekst"
    }
    else{
        caller.parentElement.parentElement.querySelector("#text").innerHTML = caller.parentElement.parentElement.querySelector("#textEdit").value;
    }

    cardSaveDB(caller.parentElement.parentElement.dataset.id, caller.parentElement.parentElement.dataset.index, caller.parentElement.parentElement.dataset.sortpanel, caller.parentElement.parentElement.querySelector("#title").innerHTML, caller.parentElement.parentElement.querySelector("#text").innerHTML);

    sortableTrue(caller.parentElement.parentElement.parentElement);
}

async function cardSaveDB(id, index, sortpanel, titel, text){
    console.log("cardSaveDB() called");
    
    var error = false;
    await db.collection("Comments").findOneAndUpdate( { _id: id }, {
        index: index,
        sortpanel: sortpanel,
        title: titel,
        text: text
    })
    .catch(err => {console.error(err), error = true});

    if (!error) {
        console.log("   Opdatering af kort med id: " + id + " lykkedes");
    }
    else {
        console.log("   Fejl under opdatering af kort med id: " + id);
        alert("Fejl under opdatering a kort - Tjek din internetforbindelse");
    }
}
/*************************/



/* Remove Card Functions */
function cardRemove(caller){
    console.log("cardRemove() called");

    cardRemoveDB(caller.parentElement.parentElement.dataset.id);

    $(caller.parentElement.querySelector("#editBtn")).tooltip('hide')
    $(caller.parentElement.querySelector("#saveBtn")).tooltip('hide')
    $(caller.parentElement.querySelector("#removeBtn")).tooltip('hide')

    caller.parentElement.parentElement.remove();
}

async function cardRemoveDB(id){
    console.log("cardRemoveDB() called");

    var error = false;
    await db.collection("Comments").findOneAndDelete( { _id: id } )
    .catch(err => {console.error(err), error = true});

    if (!error) {
        console.log("   Fjernelse af kort med id: " + id + " lykkedes");
    }
    else {
        console.log("   Fejl under fjernelse af kort med id: " + id);
        alert("Fejl under fjernelse a kort - Tjek din internetforbindelse");
    }
}

function clearAllCards() {
    var parrent = document.getElementById("A");
    while (parrent.childNodes.length > 2) {
       parrent.removeChild(parrent.lastChild);
    }

    var parrent = document.getElementById("B");
    while (parrent.childNodes.length > 2) {
       parrent.removeChild(parrent.lastChild);
    }

    var parrent = document.getElementById("C");
    while (parrent.childNodes.length > 2) {
       parrent.removeChild(parrent.lastChild);
    }


    var parrent = document.getElementById("D");
    while (parrent.childNodes.length > 2) {
       parrent.removeChild(parrent.lastChild);
    }
}
/*************************/



/* Load Card Functions */
async function cardLoadDB() {
    console.log("cardLoadDB() called");
    
    await db.collection("Comments")
    .find({}, {sort: {
        index: 1,
      }})
    .toArray()
    .then(items => {
        console.log(`   Found ${items.length} card(s) on the database`)
        items.forEach(function(element) {
            document.getElementById(element.sortpanel).innerHTML += `
            <li class="list-group-item card" data-id="${element._id}" data-index="${element.index}" data-sortpanel="${element.sortpanel}">
            <div class="btn-group float-sm-right">
            <a id="editBtn" onclick="cardEdit(this)" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Rediger"><i class="far fa-edit"></i></a>
            <a id="saveBtn" onclick="cardSave(this)" style="display: none" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Gem"><i class="far fa-save"></i></a>
            <a id="removeBtn" onclick="cardRemove(this)" style="display: none" class="btn" data-toggle="tooltip" data-placement="top" data-delay='{"show":"500", "hide":"10"}' title="Slet"><i class="far fa-trash-alt"></i></a>
            </div>
            <div class="card-body">
            <div id="view">
            <h5 id="title" class="card-title">${element.title}</h5>
            <p id="text" class="card-text">${element.text}</p>
            </div>
            <div id="edit" class="form-group" style="display: none">
            <input id="titleEdit" type="text" class="form-control" placeholder="Titel">
            <br>
            <textarea id="textEdit" class="form-control" rows="1" placeholder="Tekst"></textarea>
            </div>
            </div>
            </li>
            `;
          })
      })
      .catch(err => {console.error(`   Failed to find documents: ${err}`), alert("Det var ikke muligt at hente nogle kort fra databasen - Tjek din internetforbindelse")})

      toolTip();
}

async function cardLoad() {
    console.log("cardLoad() called");
    
    if(!client.auth.isLoggedIn){  
        await client.auth.loginWithCredential(new stitch.AnonymousCredential())
        .then(user => {console.log(`    Logged in as anonymous user with id: ${user.id}`);})
        .catch(err => {console.error(err)});
        await cardLoadDB();
        logout();
    }
    else {
        await cardLoadDB();
    } 
}
/*************************/



function sortableFalse(element){
    console.log("sortableFalse() called on element with id:" + element.id)
    var sortable = Sortable.get(element);
    sortable.option("disabled", true)
}

function sortableTrue(element){
    console.log("sortableTrue() called on element with id:" + element.id)
    var sortable = Sortable.get(element);
    sortable.option("disabled", false)
}

function toolTip() {
    $('[data-toggle="tooltip"]').tooltip()
}

var ID = function () {
    return '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function removeEdit() {
    console.log("removeEdit() called");
    
    var list = document.getElementById("A").querySelectorAll("#editBtn")
    list.forEach(function(element) {
        console.log(element);
        hide(element);
    });

    list = document.getElementById("B").querySelectorAll("#editBtn")
    list.forEach(function(element) {
        console.log(element);
        hide(element);
    });

    list = document.getElementById("C").querySelectorAll("#editBtn")
    list.forEach(function(element) {
        console.log(element);
        hide(element);
    });

    list = document.getElementById("D").querySelectorAll("#editBtn")
    list.forEach(function(element) {
        console.log(element);
        hide(element);
    });
}