document.body.style.backgroundPosition = "center";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundRepeat = "no-repeat";
var imgurl = localStorage.getItem("background-img");
if (imgurl) {
    //document.body.style.backgroundImage = imgurl;
    document.body.style.background = "linear-gradient( rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1) ), " + imgurl;
    document.body.style.backgroundSize = "cover";
    //linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),
}

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
