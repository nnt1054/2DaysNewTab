window.onload = findExtFolder;
document.getElementById("bookmark-add").addEventListener("click", showForms);
document.getElementById("bookmark-create").addEventListener("click", addBookmark);
document.getElementById("folder-create").addEventListener("click", addFolder);
var add_btn = document.getElementById("bookmark-add");
add_btn.addEventListener("dragleave", deleteDragLeave);
add_btn.addEventListener("dragover", deleteDragOver);
add_btn.addEventListener("drop", deleteDrop);


var bm;
var folders = document.getElementById("folders");
var nametoid = {};

function dragStart(e) {
  var add_btn = document.getElementById("bookmark-add");
  add_btn.classList.toggle("cancel");
  add_btn.children[0].innerHTML = "Delete";
  this.style.opacity = "0.4";

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.children[0].children[0].innerHTML);
}

function dragEnd(e) {
  var add_btn = document.getElementById("bookmark-add");
  add_btn.classList.toggle("cancel");
  add_btn.children[0].innerHTML = "New Bookmark";
  this.style.opacity = "";
}

function deleteDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  this.style.backgroundColor = "white";
  this.style.color = "red";
}

function deleteDragLeave(e) {
  this.style.backgroundColor = "";
  this.style.color = "";
}

function deleteDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  var bmid = nametoid[e.dataTransfer.getData('text/html')];
  chrome.bookmarks.removeTree(bmid, function(x) {
    console.log(x);
  })
  location.reload();
  return false;
}

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
           title: "2Day Bookmarks"
        }, function(folder) {
          bm = folder;
        });
      }
      var blist = document.getElementById("bookmark-list");
  });
}

function openFolder(name) {
  chrome.bookmarks.getChildren(nametoid[name], function(children) {
    if (children.length == 0) {
        return;
    }
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
      li.setAttribute("draggable", true);
      var div = li.appendChild(document.createElement("div"));
      li.className = "single-bookmark";
      if (child.url) {
        var name = document.createElement("p");
        name.innerHTML = child.title;
        div.appendChild(name);

        li.addEventListener('click', function(event){
          window.open(child.url,"_self");
        })

      } else {
        var title = "";
        var option = document.createElement("option");
        option.innerHTML = '<option>' + child.title + '</option>';
        folders.appendChild(option);

        var name = document.createElement("p");
        name.innerHTML = child.title;
        div.appendChild(name);

        li.addEventListener('click', function(){
          openFolder(div.firstChild.innerHTML);
        })


        chrome.bookmarks.getChildren(nametoid[div.firstChild.innerHTML], function(children) {
            if (children.length == 0) {
                title = "Empty Folder";
            }
            children.forEach(function(child) {
                title += child.title + "\n";
            })
            li.setAttribute("title", title);
        });
      }
      li.appendChild(div);
      li.addEventListener('dragstart', dragStart);
      li.addEventListener('dragend', dragEnd);
      blist.appendChild(li);
    })
  })
}
