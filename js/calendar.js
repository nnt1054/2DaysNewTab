var CLIENT_ID = '559223177845-pcv87vtaid3f0imeh6f3g7lc3hqtj1jv.apps.googleusercontent.com'; //chromebook
//var CLIENT_ID = '559223177845-orlvkhl9pkq9jf7f98gf7qepmp6iuqda.apps.googleusercontent.com'; //thinkpad

var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var apiKey = "AIzaSyCdneDaG1uHV0gxjmmw6znWcemFamIy_yA"

var today = new Date();
today.setHours(0,0,0,0);
var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000))
var todayList = document.getElementById("today-list");
var tomorrowList = document.getElementById("tomorrow-list");
var colors;
var settings;

var settings = {
    "displayedCals": {/*
        calId: {
            "name": event.summary
            "show": true/false
        },
    */},
    "startHour": "6 AM",
    "endHour": "11 PM",
}

function getSettings() {
    document.body.classList.toggle('loaded');
    initNote();
    chrome.storage.sync.get("settings", function(obj) {
        if (!obj.settings) {

            var starter_settings = {
                "settings": {
                    "displayedCals": {/*
                        calId: {
                            "name": event.summary
                            "show": true/false
                        },
                    */},
                    "startHour": "6 AM",
                    "endHour": "11 PM",
                }
            }

            chrome.storage.sync.set(starter_settings, function() {
                settings = starter_settings;
                setGrid();
                formSetTimeIntervals();
                handleClientLoadAuto();
            })
        } else {
            settings = obj.settings;
            setGrid();
            formSetTimeIntervals();
            handleClientLoadAuto();
        }
    });
}

document.getElementById("authorize-button").addEventListener("click", handleAuthClick);

function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
    return false;
}

var handleClientLoadAuto = function () {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuthAuto, 1);
}

var checkAuthAuto = function () {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeBtn = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeBtn.style.display = "none";
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeBtn.style.display = 'inline';
  }
}

/**
* Load Google Calendar client library. List upcoming events
* once client library is loaded.
*/
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', getColors);
}

function getColors() {
  var crequest = gapi.client.calendar.colors.get({});
  crequest.execute(function(response) {
    colors = response;
    getListOfCalendars();
  })
}

function getListOfCalendars() {
  var cListRequest = gapi.client.calendar.calendarList.list({});
  cListRequest.execute(function(response) {
    var calendarList = response.items;
    for (var i = 0; i < calendarList.length; i++) {
        var cid = calendarList[i].id;
        if (!settings.displayedCals[cid]) {
            settings.displayedCals[cid] = {
                "name": calendarList[i].summary,
                "show": true
            }
        }
        addCalendarToSettings(calendarList[i]);
        if (settings.displayedCals[cid].show) {
            getUpcomingEvents(calendarList[i]);
        }
    }
  })
}

function getUpcomingEvents(cal) {

  var request = gapi.client.calendar.events.list({
    'calendarId': cal.id,
    'timeMin': (new Date(today.getFullYear(), today.getMonth(), today.getDate())).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 30,
    'orderBy': 'startTime'
  });
  request.execute(function(response) {
    displayEvents(response, cal);
  });
}

function displayEvents(response, cal) {
  events = response;
  todayList.numItems = 0;
  tomorrowList.numItems = 0;
  todayList.numDayItems = 0;
  tomorrowList.numDayItems = 0;
  var len = events.items.length;
  var i = 0;
  var loop = 1;
  while ((i < len) && loop) {
    if (events.items[i].start.dateTime) {
        var loop = displaySingleEvent(events.items[i], cal.colorId);
    } else if (events.items[i].start.date) {
        var loop = displayAllDayEvent(events.items[i], cal.colorId);
    }
    i++;
  }
}

function displayAllDayEvent(event, calColor) {
  todayList.style.zIndex = 50;
  var str = event.start.date;
  var startDate = new Date(str.slice(0,4), parseInt(str.slice(5,7)) - 1, str.slice(8,10));
  str = event.end.date;
  var endDate = new Date(str.slice(0,4), parseInt(str.slice(5,7)) - 1, str.slice(8,10));
  var div = document.createElement("div");
  div.style.borderRadius = "2px";

  var dayList;
    //cases: starts before today ends today; starts today ends today; starts today ends tomorrow;
    //       starts today ends after tomorrow; starts tomorrow ends tomorrow; starts tomorrow ends after tomorrow;
  if (endDate.getTime() < today.getTime() || startDate.getTime() > tomorrow.getTime()) {
    return 1;
  } else if (endDate.getTime() == tomorrow.getTime()) {
    dayList = todayList;
    div.style.width = "100%";
  } else if (startDate.getTime() == tomorrow.getTime()) {
    dayList = tomorrowList;
    div.style.width = "100%";
  } else {
    dayList = todayList;
    div.style.width = "200%";
    tomorrowList.numDayItems++;
  }

  var label = document.getElementById("time-labels").children[0].children[0];
  label.style.height = "200%";
  var slot = dayList.children[0];
  slot.style.height = "200%";
  var name = document.createElement("p");
  name.style.zIndex = "inerit";
  name.style.paddingTop = "3px";
  name.innerHTML = event.summary;
  div.appendChild(name);

  var dateStr = document.createElement("p");
  var realEndDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000))
  if (startDate.getTime() == realEndDate.getTime()) {
    dateStr.innerHTML = startDate.getMonth() + "/" + startDate.getDate();
  } else {
    dateStr.innerHTML = startDate.getMonth() + "/" + startDate.getDate() + " - " +
        realEndDate.getMonth() + "/" + realEndDate.getDate()
  }
  div.appendChild(dateStr);

  var place = document.createElement("p");
  place.style.paddingBottom = "5px";
  if (event.location) {
    place.innerHTML = event.location;
  }
  div.appendChild(place);

  div.className = "event"

  if (event.colorId) {
    var RGB = colors.event[event.colorId].background;
  } else {
    var RGB = colors.calendar[calColor].background;
  }
  var A = 0.3;
  var colorStr = 'rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')';

  div.style.background = colorStr;
  div.style.minHeight = "20px";
  div.style.top = (dayList.numDayItems)*20 + "px";
  div.style.zIndex = div.defaultZIndex;
  dayList.numDayItems++;
  div.smallHeight = div.offsetHeight;
  div.style.height = "auto";
  div.autoHeight = div.offsetHeight;
  if (div.autoHeight < div.smallHeight) {
    div.autoHeight = div.smallHeight;
  }
  div.style.height = div.smallHeight + "px";

  div.onmouseover = function(event){
    var item = event.target;
    item.style.zIndex = 9999;
    item.parentNode.style.zIndex = 9999;
    item.style.height = item.autoHeight + "px";
    div.style.background = "white";
  }

  div.onmouseout = function(event){
    var item = event.target;
    item.style.zIndex = event.target.defaultZIndex;
    item.parentNode.style.zIndex = 3;
    item.style.height = item.smallHeight + "px";
    div.style.background = colorStr;
  }

  div.defaultZIndex = dayList.numItems;
  if (slot.children.length) {
    div.defaultZIndex = slot.children[slot.children.length - 1].style.zIndex;
    slot.insertBefore(div, slot.children[0]);
  } else {
    slot.appendChild(div);
  }
    
  slot.appendChild(div);
  return 1;
}

function displaySingleEvent(event, calColor) {
  var startTime = new Date(event.start.dateTime);
  var endTime = new Date(event.end.dateTime);
  var duration = endTime.getTime() - startTime.getTime();
  duration = duration/(1000 * 60 * 60);
  var offset = (startTime.getMinutes() / 60) * 100;
  var todayDate = new Date(today.getYear(), today.getMonth(), today.getDate());

  var dayList;
  if (startTime.getDate() == today.getDate() && startTime.getMonth() == today.getMonth()) {
    dayList = todayList;
  } else if (startTime.getDate() == tomorrow.getDate() && startTime.getMonth() == tomorrow.getMonth()) {
    dayList = tomorrowList;
  } else if (startTime.getTime() < today.getTime()) {
    return 1;
  } else {
    return 0;
  }

  var start_offset = parseInt(settings.startHour.slice(0, -3)) - 1;
  var slot = dayList.children[startTime.getHours() - start_offset];
  if (slot) {

  var div = document.createElement("div");
  var name = document.createElement("p");
  name.style.paddingTop = "3px";
  name.style.fontSize = "12pt";

  name.innerHTML = event.summary;
  div.appendChild(name);

  var dateStr = document.createElement("p");
  dateStr.innerHTML = formatAMPM(startTime) + " - " + formatAMPM(endTime);
  dateStr.style.fontSize = "12pt";
  div.appendChild(dateStr);

  var place = document.createElement("p");
  if (event.location) {
    place.innerHTML = event.location;
  }
  place.style.fontSize = "12pt";
  div.appendChild(place);


  div.className = "event"
  div.defaultHeight = (duration * 100) + "%";

  if (event.colorId) {
    var RGB = colors.event[event.colorId].background;
  } else {
    var RGB = colors.calendar[calColor].background;
  }
  var A = 0.3;
  var colorStr = 'rgba('+parseInt(RGB.substring(1,3),16)+','+parseInt(RGB.substring(3,5),16)+','+parseInt(RGB.substring(5,7),16)+','+A+')';

  div.style.background = colorStr;
  div.style.height = div.defaultHeight;
  div.style.top = offset + "%";
  div.style.left = (dayList.numItems%4)*13 + 5 + "%";

  div.onmouseover = function(event){
    var item = event.target;
    item.style.zIndex = 9999;
    item.parentNode.style.zIndex = 9999;
    item.style.height = item.autoHeight + "px";
    div.style.background = "white";

  }

  div.onmouseout = function(event){
    var item = event.target;
    item.style.zIndex = event.target.defaultZIndex;
    item.parentNode.style.zIndex = 3;
    item.style.height = item.smallHeight + "px";
    div.style.background = colorStr;
  }

  div.defaultZIndex = dayList.numItems + start_offset;
  if (slot.children.length) {
    div.defaultZIndex = slot.children[slot.children.length - 1].style.zIndex;
    slot.insertBefore(div, slot.children[0]);
  } else {
    slot.appendChild(div);
  }
  div.style.zIndex = div.defaultZIndex;
  dayList.numItems++;

  div.smallHeight = div.offsetHeight;
  div.style.height = "auto";
  div.autoHeight = div.offsetHeight;
  if (div.autoHeight < div.smallHeight) {
    div.autoHeight = div.smallHeight;
  }
  div.style.height = div.smallHeight + "px";
  name.style.fontSize = "";
  dateStr.style.fontSize = "";
  place.style.fontSize = "";
  }
  return 1;

}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes;
  return strTime;
}
