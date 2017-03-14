var coords;

function getCoords() {
    if("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
        coords = position.coords.latitude + ',' + position.coords.longitude;
        loadWeather(coords);
        });
    } else {
        loadWeather("Berkeley, CA", {unit: 'f'});
    }
}

 $(document).ready(function() {
   getCoords();
   setInterval(loadWeather, 5000);
 })
 

 function loadWeather(location, woeid) {
     if (coords) {
       $.simpleWeather({
         location: coords,
         woeid: woeid,
         unit: 'f',

         success: function(weather) {
          html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
          html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
          html += '<li class="currently">'+weather.currently+'</li>';
          html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
          $("#weather").html(html);
         },

         error: function(error) {
           console.log(error);
           loadWeather("Berkeley, CA", {unit: 'f'});
           //$(".error").html('<p>' + error + '</p>');
         }
       })
     } else {
       getCoords();   
     }
 }
