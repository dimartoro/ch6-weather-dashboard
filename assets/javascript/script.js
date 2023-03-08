
var APIKey = "2b1df63add6892fd5e0dddb68e308249";

function displayHistory(){
    var citiesHistory = [];
    var divCities = document.querySelector("#divCities");
    if(localStorage.getItem("cities")!= null){
        citiesHistory = JSON.parse(localStorage.getItem("cities"));
    }
    for(var x = 0; x<citiesHistory.length; x++){
        var span = document.createElement("span");
        span.textContent = citiesHistory[x];
        divCities.append(span);
    }
}

function searchCity(){
    var city = document.querySelector("#txtSearch").value;
    var citiesHistory = [];
    if(localStorage.getItem("cities")!= null){
        citiesHistory = JSON.parse(localStorage.getItem("cities"));
    }
    citiesHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(citiesHistory));
    fetchCity(city);
}



function fetchCity (city){

    var coordinates = {};
    var queryCityAPI = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryCityAPI)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        fetchForecast(data.coord.lat, data.coord.lon);
      });
     
}



function fetchForecast (lat, lon){
    var queryForecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    var fData = {};
    fetch(queryForecastAPI)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayForecast(data);       
      });
}


function displayForecast(forecastObject){
    console.log("This is the Forecast Data: ", forecastObject);
    var ulElements = document.querySelector("#ulElements");
    
    for(var x = 0; x< forecastObject.list.length; x++){
        var li = document.createElement("li");
        var dt = forecastObject.list[x].dt_txt;
        var spanDT = document.createElement("span");
        spanDT.textContent = dt;
        li.append(spanDT);
        var temp = forecastObject.list[x].main.temp;
        var spanTemp = document.createElement("span");
        spanTemp.textContent = temp;
        li.append(spanTemp);
        var tempFellsLike = forecastObject.list[x].main.feels_like;
        var spanLike = document.createElement("span");
        spanLike.textContent = tempFellsLike;
        li.append(spanLike);
        for(var y = 0; y<forecastObject.list[x].weather.length; y++){
            var description = forecastObject.list[x].weather[y].description;
            var spanDesc = document.createElement("span");
            spanDesc.textContent = description;
            li.append(spanDesc);
            var main = forecastObject.list[x].weather[y].main;
            var spanMain = document.createElement("span");
            spanMain.textContent = main;
            li.append(spanMain);
        }
        ulElements.append(li);
    }
}


displayHistory();