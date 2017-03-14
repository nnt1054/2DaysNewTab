var CLIENT_ID = '559223177845-pcv87vtaid3f0imeh6f3g7lc3hqtj1jv.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var apiKey = "AIzaSyCdneDaG1uHV0gxjmmw6znWcemFamIy_yA"

var today = new Date();
var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000))
var todayList = document.getElementById("today-list");
var tomorrowList = document.getElementById("tomorrow-list");
var colors;

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
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
* Load Google Calendar client library. List upcoming events
* once client library is loaded.
*/
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', getUpcomingEvents);
}

/**
* Print the summary and start datetime/date of the next 30 events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function getUpcomingEvents() {
  var crequest = gapi.client.calendar.colors.get({});
  crequest.execute(function(response) {
    colors = response;
  })

  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date(today.getFullYear(), today.getMonth(), today.getDate())).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 30,
    'orderBy': 'startTime'
  });
  request.execute(displayEvents);

}

function displayEvents(response) {
  events = response;
  todayList.numItems = 0;
  tomorrowList.numItems = 0;
  var len = events.items.length;
  var i = 0;
  var loop = 1;
  while ((i < len) && loop) {
    var loop = displaySingleEvent(events.items[i]);
    i++;
  }
}

function displaySingleEvent(event) {
  var startTime = new Date(event.start.dateTime);
  var endTime = new Date(event.end.dateTime);
  var duration = endTime.getTime() - startTime.getTime();
  duration = duration/(1000 * 60 * 60);
  var offset = (startTime.getMinutes() / 60) * 100;

  var dayList;
  if (startTime.getDate() == today.getDate()) {
    dayList = todayList;
  } else if (startTime.getDate() == tomorrow.getDate()) {
    dayList = tomorrowList;
  } else {
    return 0;
  }
  var slot = dayList.children[startTime.getHours() - 6];

  var div = document.createElement("div");
  var name = document.createElement("p");
  name.style.zIndex = "inherit";
  name.style.paddingTop = "3px";
  name.innerHTML = event.summary;
  div.appendChild(name);

  var dateStr = document.createElement("p");
  dateStr.style.zIndex = "inherit";
  dateStr.innerHTML = formatAMPM(startTime) + " - " + formatAMPM(endTime);
  div.appendChild(dateStr);

  var place = document.createElement("p");
  place.style.zIndex = "inherit";
  place.style.paddingBottom = "5px";
  if (event.location) {
    place.innerHTML = event.location;
  }
  div.appendChild(place);


  div.className = "event"
  div.draggable = true;
  div.defaultZIndex = dayList.numItems + 6;
  div.style.zIndex = div.defaultZIndex;
  div.defaultHeight = (duration * 100) + "%";
  div.style.height = div.defaultHeight;
  div.style.top = offset + "%";
  div.style.left = (dayList.numItems%3)*20 + 5 + "%";

  div.onmouseover = function(event){
    var item = event.target;
    item.style.zIndex = 9999;
    item.parentNode.style.zIndex = 9999;
    var preheight = item.offsetHeight;
    item.style.height = "auto";
    if (item.offsetHeight < preheight) {
      item.style.height = item.defaultHeight;
    }
  }

  div.onmouseout = function(event){
    var item = event.target;
    item.style.zIndex = event.target.defaultZIndex;
    item.parentNode.style.zIndex = 3;
    item.style.height = item.defaultHeight;
  }

  dayList.numItems++;
  slot.appendChild(div);
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
