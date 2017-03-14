var CLIENT_ID = '559223177845-tlcomk97jck9d9tjdr27hgs3eu95b5qi.apps.googleusercontent.com';
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
    'timeMin': (new Date()).toISOString(),
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
  var span = document.createElement("p");
  span.style.zIndex = "inherit";
  span.innerHTML = event.summary;
  div.appendChild(span);
  div.className = "event"
  div.defaultZIndex = dayList.numItems + 6;
  div.style.zIndex = div.defaultZIndex;
  div.style.height = (duration * 100) + "%";
  div.style.top = offset + "%";
  div.style.left = dayList.numItems*10 + 5 + "%";
  div.onmouseover = function(event){
    event.target.style.zIndex = 9999;
    event.target.parentNode.style.zIndex = 9999;
  }
  div.onmouseout = function(event){
    event.target.style.zIndex = event.target.defaultZIndex;
    event.target.parentNode.style.zIndex = 3;
  }

  dayList.numItems++;
  slot.appendChild(div);
  return 1;

}
