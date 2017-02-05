window.onload = findExtFolder;
document.getElementById("bookmark-add").addEventListener("click", findExtFolder);

function findExtFolder(event) {
  chrome.bookmarks.getChildren('2', function(children) {
      children.forEach(function(child) {
        var folder;
        if (child.title == "test") {
          folder = child;
        }
        if (folder) {
          display(folder);
        } else {
          createfolder;
        }
      })
  })
}

function display(folder) {
  var blist = document.getElementById("bookmark-list");
  chrome.bookmarks.getChildren(folder.id, function(children){
    children.forEach(function(child){
      var li = document.createElement("li");
      var div = li.appendChild(document.createElement("div"));
      div.innerHTML = '<button> <a href="' + child.url + '">' + child.title + '</a> </button>'
      li.appendChild(div)
      blist.appendChild(li);
    })
  })

}
