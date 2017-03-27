var imgurl = localStorage.getItem("background-img");
var refreshIntervalId = setInterval(function() {
  if (imgurl) {
      document.body.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), " + imgurl;
      clearInterval(refreshIntervalId);
  } else {
      document.body.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) )";
  }
}, 100);

var old;
var btn = document.getElementById("upload-btn-id")
btn.addEventListener("click", showUploadBtn);

function showUploadBtn() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    x.setAttribute("accept", "image/*");
    x.classList.toggle("upload-btn")
    x.onchange = gotImage;
    document.getElementById("settings-popup").replaceChild(x, btn);
    btn = x;
}

function removeUploadBtn() {
    var x = document.createElement("BUTTON");
    x.innerHTML = "Change Background";
    x.setAttribute("id", "upload-btn-id");
    x.classList.toggle("upload-btn")
    x.addEventListener("click", showUploadBtn);

    document.getElementById("settings-popup").replaceChild(x, btn);
    btn = x;
}

function gotImage(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var imgurl = 'url(' + event.target.result + ')'
    document.body.style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), " + imgurl;
    localStorage.setItem("background-img", imgurl);
    removeUploadBtn();
  };

  reader.readAsDataURL(file);
}
