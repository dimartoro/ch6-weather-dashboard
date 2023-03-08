
// var APIKey = "2b1df63add6892fd5e0dddb68e308249";
var APIKey = "82cd293ab88811ccdd319b8413cdedd0";


//function in charge of setting up the local storage for the permanency of the data
function displayHistory() {
    var citiesHistory = [];
    var divCities = document.querySelector("#divCities");
    divCities.innerHTML = '';
    if (localStorage.getItem("cities") != null) {
        citiesHistory = JSON.parse(localStorage.getItem("cities"));
    }
    for (var x = 0; x < citiesHistory.length; x++) {
        var span = document.createElement("span");
        span.addEventListener('click', function() {
            searchCity(this); //alert("Hola");
        });
        span.textContent = citiesHistory[x];
        divCities.append(span);
    }

}

//function in charge of seach the city, is call with the click of the button, 
//Is the first function called by the click of the search buttun, after the city name is entered
//in the txtfield.
function searchCity(caller) {
    var city = '';
    if (caller != null && caller != undefined) {
        city = caller.textContent;
    } else {
        city = (document.querySelector("#txtSearch").value).toUpperCase();
    }

    if (city != '') {
        var citiesHistory = [];
        if (localStorage.getItem("cities") != null) {
            citiesHistory = JSON.parse(localStorage.getItem("cities"));
        }
        if (!citiesHistory.includes(city)) {
            citiesHistory.push(city);
            localStorage.setItem("cities", JSON.stringify(citiesHistory));

        }
        fetchCity(city);
        displayHistory();
    }

}


//function called inside searchCity(). The function is in charge of pass the coordenates of
//latitude and longitude of the weather API url by city to the function fetchForecastAPI().

function fetchCity(city) {

    var coordinates = {};
    var queryCityAPI = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryCityAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            fetchForecast(data.coord.lat, data.coord.lon);
        });

}

//this function is called inside functionFetchCity(). This function receives the
//latitude and longitude to build the url in charge of providing the forcast data.

function fetchForecast(lat, lon) {
    var queryForecastAPI = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    var fData = {};
    fetch(queryForecastAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            displayForecast(data);
        });
}

//this function is called insde of displayForcast() function.
//this function is in charge of display the weather forcast creating the html text content elements on the fly
function displayForecast(forecastObject) {
    console.log("This is the Forecast Data: ", forecastObject);
    var ulElements = document.querySelector("#ulElements");
    ulElements.innerHTML = '';
    for (var x = 0; x < forecastObject.list.length; x++) {
        var dt = forecastObject.list[x].dt_txt;
        if ((dt.indexOf("00:00:00") >= 0) || x == 0) {
            var li = document.createElement("li");
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
            var weather = forecastObject.list[x].weather;
            for (var y = 0; y < weather.length; y++) {
                var description = weather[y].description;
                var spanDesc = document.createElement("span");
                spanDesc.textContent = description;
                li.append(spanDesc);
                var main = weather[y].main;
                var spanMain = document.createElement("span");
                spanMain.textContent = main;
                li.append(spanMain);
            }
            ulElements.append(li);
            document.querySelector("#txtSearch").value = '';
        }

    }
}


displayHistory();