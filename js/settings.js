var settings_btn = document.getElementById("settings-btn");
var settings_menu = document.getElementById("settings-menu");
var cancel_settings_btn = document.getElementById("cancelSetBtn");
var submit_settings_btn = document.getElementById("submitSetBtn");
var calendar_list = document.getElementById("calendar-list");
var form = document.getElementById("settings-form");

settings_btn.addEventListener("click", showSettings);
cancel_settings_btn.addEventListener("click", showSettings);
submit_settings_btn.addEventListener("click", saveSettings);

function showSettings() {
    document.getElementById("overlay-div").classList.toggle("overlay");
    document.getElementById("overlay-div").removeEventListener("click", showForms);
    document.getElementById("overlay-div").addEventListener("click", showSettings);
    settings_btn.classList.toggle("cancels");
    settings_menu.classList.toggle("showw");
};

function saveSettings() {
    var items = calendar_list.getElementsByTagName("li");
    settings.startHour = form["start-hour"].value;
    settings.endHour = form["end-hour"].value;
    console.log(settings);
    for (var i = 0; i < items.length; i++) {
        var cal = items[i].children[0]
        settings.displayedCals[cal.name].show = cal.checked;
    }
    
    chrome.storage.sync.set({"settings": settings}, function() {
        showSettings();
        location.reload();
    });
}

function addCalendarToSettings(cal) {
    var li = document.createElement("li");
    var input = document.createElement("input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", cal.id);
    input.checked = settings.displayedCals[cal.id].show;
    input.classList.toggle("cal-checkbox");

    var p = document.createElement("p");
    p.innerHTML = cal.summary;

    li.appendChild(input);
    li.appendChild(p);
    
    calendar_list.appendChild(li);
}

function formSetTimeIntervals() {
    form["start-hour"].value = settings.startHour;
    form["end-hour"].value = settings.endHour;
}                   
                           
                           
//<li> <input type="checkbox" name="bike1" class="cal-checkbox"/> <p> Primary </p> </li>
