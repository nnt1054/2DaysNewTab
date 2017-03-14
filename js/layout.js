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

function setLabels() {
    var am = "AM", pm = "PM";
    //makeHourLabel(12, am);
    for (var i = 6; i < 12; i++) {
      makeHourLabel(i, am);
    }
    makeHourLabel(12, pm);
    for (var i = 1; i < 12; i++) {
      makeHourLabel(i, pm);
    }
}

function makeEventSection(list) {
  var li = document.createElement("li");
  var div = document.createElement("div");
  li.className = "hour";
  li.appendChild(div);
  list.appendChild(li);
}

function setGrid() {
  for (var i = 6; i < 24; i++) {
    makeEventSection(todayList);
  }
  for (var i = 6; i < 24; i++) {
    makeEventSection(tommorowList);
  }
}

setLabels();
setGrid();
