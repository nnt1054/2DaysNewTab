function getCoords() {
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            loadWeather(position.coords.latitude + ',' + position.coords.longitude, handleWeather);
        }, function(error) {
            loadWeather("Berkeley, CA", {unit: 'f'}, handleWeather);
        });
    }
}

 $(document).ready(function() {
   getCoords();
   setInterval(loadWeather, 10000);
 })


 function loadWeather(location, woeid) {
       $.simpleWeather({
         location: location,
         woeid: woeid,
         unit: 'f',

         success: handleWeather,

         error: function(error) {
           loadWeather("Berkeley, CA", {unit: 'f'});
         }
       })
 }

function handleWeather(weather) {
    var div = document.getElementById("weather");
    var current = document.createElement("div");
    current.setAttribute("id", "current-weather");
    
    var temp = document.createElement("h1");
    temp.innerHTML = weather.temp + "&deg" + weather.units.temp
    current.appendChild(temp);
    
    var city = document.createElement("h3");
    city.innerHTML = weather.city + ", " + weather.region;
    current.appendChild(city);
    
    var wind = document.createElement("h3");
    wind.innerHTML = weather.wind.speed + " " + weather.units.speed;
    current.appendChild(wind);
    
    var cond = document.createElement("h3");
    cond.innerHTML = weather.currently;
    current.appendChild(cond);

    div.innerHTML = "";
    div.appendChild(current);
    
    displayWeekForecast(weather);
}

function displayWeekForecast(weather) {
    var weather_list = weather.forecast;
    for (var i = 0; i < 7; i++) {
        makeSingleForecast(weather_list[i], i);
    }
};

function makeSingleForecast(forecast, x) {
    var div = document.getElementById("weather");
    var day = document.createElement("div");
    day.className = "day-forecast";
    
    var name = document.createElement("h2");
    if (x == 0) {
        name.innerHTML = "Today";
    } else {
        name.innerHTML = forecast.day;   
    }
    day.appendChild(name);

    
    var high = document.createElement("h4");
    high.innerHTML = "High: " + forecast.high
    day.appendChild(high);
    
    var low = document.createElement("h4");
    low.innerHTML = "Low: " + forecast.low;
    day.appendChild(low);
    
    var desc = document.createElement("h4");
    desc.innerHTML = forecast.text;
    day.appendChild(desc);
    
        
    div.appendChild(day);
}











