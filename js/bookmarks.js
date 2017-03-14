window.onload = findExtFolder;
document.getElementById("bookmark-add").addEventListener("click", function(){});
document.getElementById("bookmark-create").addEventListener("click", addBookmark);
document.getElementById("folder-create").addEventListener("click", addFolder);

var bm;
var folders = document.getElementById("folders");
var nametoid = {};

function addFolder() {
  var form = document.getElementById("folder-form");
  if (form.name.value == "" || form.name.value == null) {
    console.log("lmaooo nice try guy");
    return;
  }
  var object = {
    parentId: bm.id,
    title: form.name.value,
  }

  chrome.bookmarks.create(object, function() {
    console.log(form.name.value);
    var blist = document.getElementById("bookmark-list");
    var li = document.createElement("li");
    var div = li.appendChild(document.createElement("div"));

    var option = document.createElement("option");
    option.innerHTML = '<option>' + form.name.value + '</option>';
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
    console.log("nice try guy");
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
        if (child.title == "test") {
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
      console.log(child)
      window.open(child.url, '_blank');
    })
    window.close();
  });
};

function display(folder) {
  var blist = document.getElementById("bookmark-list");
  console.log(blist);
  chrome.bookmarks.getChildren(folder.id, function(children){
    children.forEach(function(child){
      nametoid[child.title] = child.id;
      var li = document.createElement("li");
      var div = li.appendChild(document.createElement("div"));
      if (child.url) {
        div.innerHTML = '<button> <a href="' + child.url + '">' + child.title + '</a> </button>'
      } else {
        console.log(folders);
        var option = document.createElement("option");
        option.innerHTML = '<option>' + child.title + '</option>';
        folders.appendChild(option);
        div.innerHTML = '<button class= "folder-btn">' + child.title + '</button>'
        div.firstChild.addEventListener('click', function(){
          openFolder(div.firstChild.innerHTML);
        })
      }
      li.appendChild(div)
      blist.appendChild(li);
    })
  })
}