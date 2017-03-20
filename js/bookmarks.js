window.onload = findExtFolder;
document.getElementById("bookmark-add").addEventListener("click", showForms);
document.getElementById("bookmark-create").addEventListener("click", addBookmark);
document.getElementById("folder-create").addEventListener("click", addFolder);

var bm;
var folders = document.getElementById("folders");
var nametoid = {};

function showForms() {
  document.getElementById("overlay-div").classList.toggle("overlay");
  document.getElementById("overlay-div").removeEventListener("click", showSettings);
  document.getElementById("overlay-div").addEventListener("click", showForms);
  var add_btn = document.getElementById("bookmark-add");
  add_btn.classList.toggle("cancel");
  if (add_btn.children[0].innerHTML == "Cancel") {
    add_btn.children[0].innerHTML = "New Bookmark";
  } else {
    add_btn.children[0].innerHTML = "Cancel"
  }
  var marks = document.getElementById("add-bookmark");
  marks.classList.toggle("showh");
}

function addFolder() {
  var form = document.getElementById("folder-form");
  if (form.name.value == "" || form.name.value == null) {
    return;
  }
  var object = {
    parentId: bm.id,
    title: form.name.value,
  }

  chrome.bookmarks.create(object, function() {
    var blist = document.getElementById("bookmark-list");
    var li = document.createElement("li");
    var div = li.appendChild(document.createElement("div"));

    var option = document.createElement("option");
    option.innerHTML = form.name.value;
    folders.appendChild(option);

    div.innerHTML = '<button class= "folder-btn">' + form.name.value + '</button>'
    div.firstChild.addEventListener('click', function(){
      openFolder(div.firstChild.innerHTML);
    })
    li.appendChild(div)
    blist.appendChild(li);
    form.name.value = null;
  })
}

function addBookmark() {
  var form = document.getElementById("bookmark-form");
  if (form.name.value == "" || form.url.value == "" || form.name.value == null || form.url.value == null) {
    return;
  }
  var object = {
    parentId: bm.id,
    title: form.name.value,
    url: form.url.value
  }
  if (form.folders.value != "Default") {
    object['parentId'] = nametoid[form.folders.value];
  }
  chrome.bookmarks.create(object, function(result) {
    if (result == null) {
        alert("Invalid URL, Don't forget to include 'https://'");
        return;
    }
    if (result && object.parentId == bm.id) {
      var blist = document.getElementById("bookmark-list");
      var li = document.createElement("li");
      var div = li.appendChild(document.createElement("div"));
      div.innerHTML = '<button> <a href="' + form.url.value + '">' + form.name.value + '</a> </button>'
      li.appendChild(div)
      blist.appendChild(li);
    }
    form.name.value = null;
    form.url.value = null;
    form.folders.value = "Default";
  })
}

function findExtFolder() {
  chrome.bookmarks.getChildren('2', function(children) {
      var folder;
      children.forEach(function(child) {
        if (child.title == "2Day Bookmarks") {
          folder = child;
        }
      });
      if (folder) {
        bm = folder;
        display(folder);
      } else {
        chrome.bookmarks.create({
           title: "test"
        }, function(folder) {
          bm = folder;
        });
      }
  });
}

function openFolder(name) {
  chrome.bookmarks.getChildren(nametoid[name], function(children) {
    children.forEach(function(child) {
      window.open(child.url, '_blank');
    })
    window.close();
  });
};

function display(folder) {
  var blist = document.getElementById("bookmark-list");
  chrome.bookmarks.getChildren(folder.id, function(children){
    children.forEach(function(child){
      nametoid[child.title] = child.id;
      var li = document.createElement("li");
      var div = li.appendChild(document.createElement("div"));
      li.className = "single-bookmark";
      if (child.url) {
        var name = document.createElement("p");
        name.innerHTML = child.title;
        name.style.paddingTop = "3px";
        div.appendChild(name);

        li.addEventListener('click', function(event){
          window.open(child.url,"_self");
        })

      } else {
        var option = document.createElement("option");
        option.innerHTML = '<option>' + child.title + '</option>';
        folders.appendChild(option);

        var name = document.createElement("p");
        name.innerHTML = child.title;
        name.style.paddingTop = "3px";
        div.appendChild(name);

        li.addEventListener('click', function(){
          openFolder(div.firstChild.innerHTML);
        })
      }
      li.appendChild(div)
      blist.appendChild(li);
    })
  })
}
