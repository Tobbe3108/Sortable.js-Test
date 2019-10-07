function addCard(value) {
    console.log("addCard() called")
    document.getElementById(value).innerHTML += '<li class="list-group-item card"><div class="card-body"><h5 class="card-title">Temp</h5><p class="card-text">Temp</p></div></li>';
}