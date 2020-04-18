var dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var monthList = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (settings.format == 12) {
    hours = hours % 12;
  }
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0'+ hours : hours;
  minutes = minutes < 10 ? '0'+ minutes : minutes;
  var strTime = hours + ':' + minutes;
  return strTime;
}

function startTime() {
    var time_div = document.getElementById("hour-minute");
    var today = new Date();
    var timeStr = formatAMPM(today);
    time_div.innerHTML = timeStr;

    var date_div = document.getElementById("day-month-date-year");
    var day = dayList[today.getDay()];
    var month = monthList[today.getMonth()];
    var date = today.getDate();
    var year = today.getFullYear();
    var dateStr = day + ", " + month + " " + date + ", " + year;
    date_div.innerHTML = dateStr;

    setTimeout(startTime, 1000);
}
