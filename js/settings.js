var settings_btn = document.getElementById("settings-btn");
var settings_menu = document.getElementById("settings-menu");
settings_btn.addEventListener("click", showSettings);

function showSettings() {
    document.getElementById("overlay-div").classList.toggle("overlay");
    document.getElementById("overlay-div").removeEventListener("click", showForms);
    document.getElementById("overlay-div").addEventListener("click", showSettings);
    settings_btn.classList.toggle("cancels");
    settings_menu.classList.toggle("showw");
};
