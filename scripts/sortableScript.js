function createAllSortable() {
  console.log("   createAllSortable() called");
  
  Sortable.create(A, {
    group: "shared",
    sort: true,

    onSort: function (evt) {
      console.log("onSort event called on panel 'A'");
      updateIndexAll("A")
    },
  });

  Sortable.create(B, {
    group: "shared",
    sort: true,

    onSort: function (evt) {
      console.log("onSort event called on panel 'B'");
      updateIndexAll("B")
    },
  });

  Sortable.create(C, {
    group: "shared",
    sort: true,

    onSort: function (evt) {
      console.log("onSort event called on panel 'C'");
      updateIndexAll("C")
    },
  });

  Sortable.create(D, {
    group: "shared",
    sort: true,

    onSort: function (evt) {
      console.log("onSort event called on panel 'D'");
      updateIndexAll("D")
    },
  });
}

function removeAllSortable() {
  console.log("removeAllSortable() called")
  try {
    var sortable = Sortable.get(document.getElementById("A"));
    sortable.destroy();
  
    sortable = Sortable.get(document.getElementById("B"));
    sortable.destroy();
  
    sortable = Sortable.get(document.getElementById("C"));
    sortable.destroy();
  
    sortable = Sortable.get(document.getElementById("D"));
    sortable.destroy();
  } catch (error) {
    console.log("   Not posible to remove sortable elements");
  }
}

function updateIndexAll(id) {
  var index = 0;
  var sortable = Sortable.get(document.getElementById(id));
  sortable.toArray().forEach(element => {
    var item = document.querySelector(`[data-id='${element}']`);
    item.dataset.index = index++;
    item.dataset.sortpanel = id;
    cardSaveDB(item.dataset.id, item.dataset.index, item.dataset.sortpanel, item.querySelector("#title").innerHTML, item.querySelector("#text").innerHTML)
  });
}