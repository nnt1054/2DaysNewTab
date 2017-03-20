var tlist = document.getElementById("time-list");
var todayList = document.getElementById("today-list");
var tommorowList = document.getElementById("tomorrow-list");

function makeHourLabel(hour, suffix) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    div.innerHTML = hour + " " + suffix;
    li.className = "hour";
    li.appendChild(div);
    tlist.appendChild(li);
}

function setGrid() {
  var startTime = parseInt(settings.startHour.slice(0, -3));
  var endTime = parseInt(settings.endHour.slice(0, -3)) + 12;
  for (var i = startTime; i <= endTime; i++) {
    makeEventSection(todayList);
  }
  for (var i = startTime; i <= endTime; i++) {
    makeEventSection(tommorowList);
  }
  setLabels();
}

function setLabels() {
    var startTime = parseInt(settings.startHour.slice(0, -3));
    var endTime = parseInt(settings.endHour.slice(0, -3));
    var am = "AM", pm = "PM";
    //makeHourLabel(12, am);
    for (var i = startTime; i <= 12; i++) {
      makeHourLabel(i, am);
    }
    makeHourLabel(12, pm);
    for (var i = 1; i <= endTime; i++) {
      makeHourLabel(i, pm);
    }
}

function makeEventSection(list) {
  var li = document.createElement("li");
  li.className = "hour";
  list.appendChild(li);
}

function addCurrentTime() {
  var now = new Date();
  var mins = now.getMinutes();
  var slot = todayList.children[now.getHours() - 6];
  if (!slot) {
    return;
  }
  if (mins < 30) {
    slot.style.borderTop = "thin solid red";
  } else {
    slot.style.borderBottom = "thin solid red";
  }
}

addCurrentTime();
