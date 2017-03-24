var tlist = document.getElementById("time-list");
var todayList = document.getElementById("today-list");
var tommorowList = document.getElementById("tomorrow-list");

function makeHourLabel(hour, suffix) {
    var li = document.createElement("li");
    var div = document.createElement("div");
    if (hour != -1) {
        div.innerHTML = hour + " " + suffix;
        li.style.flex = 1;
    } else {
        li.style.height = "0px";
    }
    li.className = "hour";
    li.appendChild(div);
    tlist.appendChild(li);
}

function setGrid() {
  var startTime = parseInt(settings.startHour.slice(0, -3));
  var endTime = parseInt(settings.endHour.slice(0, -3)) + 13;
  makeEventSection(todayList, -1);
  for (var i = startTime; i < endTime; i++) {
    makeEventSection(todayList, 1);
  }
  makeEventSection(tomorrowList);
  for (var i = startTime; i < endTime; i++) {
    makeEventSection(tommorowList, 1);
  }
  setLabels();
}

function setLabels() {
    var startTime = parseInt(settings.startHour.slice(0, -3));
    var endTime = parseInt(settings.endHour.slice(0, -3));
    var am = "AM", pm = "PM";
    makeHourLabel(-1, "");
    for (var i = startTime; i < 12; i++) {
      makeHourLabel(i, am);
    }
    makeHourLabel(12, pm);
    for (var i = 1; i <= endTime; i++) {
      makeHourLabel(i, pm);
    }
}

function makeEventSection(list, i) {
  var li = document.createElement("li");
  li.className = "hour";
  if (i == -1) {
    li.style.height = "0px";
    li.style.display = "flex";
    li.style.flexDirection = "column";
  } else {
    li.style.flex = 1;
    li.takenIndexes = [];
    li.numItems = 0;
  }
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
