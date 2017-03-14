document.body.style.backgroundPosition = "center";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "no-repeat";
var imgurl = localStorage.getItem("background-img");
if (imgurl) {
    document.body.style.backgroundImage = imgurl;
}

var old;
var btn = document.getElementById("upload-btn")
btn.addEventListener("click", showUploadBtn);

function showUploadBtn() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "file");
    x.setAttribute("accept", "image/*");
    x.onchange = gotImage;

    document.getElementById("upload").replaceChild(x, btn);
    btn = x;
}

function removeUploadBtn() {
    var x = document.createElement("BUTTON");
    x.innerHTML = "Change Background";
    x.addEventListener("click", showUploadBtn);

    document.getElementById("upload").replaceChild(x, btn);
    btn = x;
}

function gotImage(event) {
  console.log(event);
  var file = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var imgurl = 'url(' + event.target.result + ')'
    document.body.style.backgroundImage = imgurl;
    localStorage.setItem("background-img", imgurl);
    removeUploadBtn();
  };

  reader.readAsDataURL(file);
}
