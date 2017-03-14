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
    html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
    html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
    html += '<li class="currently">'+weather.currently+'</li>';
    html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
    $("#weather").html(html);   
}
