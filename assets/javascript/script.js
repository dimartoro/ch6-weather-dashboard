
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
    var name = forecastObject.city.name;
    for (var x = 0; x < forecastObject.list.length; x++) {
        var dt = forecastObject.list[x].dt_txt;
        if ((dt.indexOf("00:00:00") >= 0) || x == 0) {
            var li = document.createElement("div");
            li.classList.add('grid-item');
            if(x==0){
                li.classList.add('grid-col-span-5');
                li.classList.add('grid-item-work-first');
                li.classList.add('today');
                var spanName = document.createElement("span");
                spanName.textContent = name + ' (' + new Date(dt).toLocaleDateString() + ')';
                li.append(spanName); 
                var img = document.createElement("img");
                var weather = forecastObject.list[x].weather;
                img.setAttribute('src','https://openweathermap.org/img/wn/'+weather[0].icon+'@2x.png');
                img.classList.add('imgIcon');
                li.append(img);
            }
            else{
                li.classList.add('forecast');
                var spanDT = document.createElement("span");
                spanDT.textContent = new Date(dt).toLocaleDateString();
                li.append(spanDT);
                var img = document.createElement("img");
                var weather = forecastObject.list[x].weather;
                img.setAttribute('src','https://openweathermap.org/img/wn/'+weather[0].icon+'@2x.png');
                img.classList.add('imgIcon');
                li.append(img);
            }
            
            
            var temp = ktof(forecastObject.list[x].main.temp);
            var spanTemp = document.createElement("span");
            spanTemp.innerHTML = 'Temp: '+ temp + ' &deg;F';
            li.append(spanTemp);
            var speed = forecastObject.list[x].wind.speed;
            var spanSpeed = document.createElement("span");
            spanSpeed.textContent = 'Wind: '+ speed + ' MPH';
            li.append(spanSpeed);
            var tempHumidity = forecastObject.list[x].main.humidity;
            var spanHumidity = document.createElement("span");
            spanHumidity.textContent = 'Humidity: '+  tempHumidity+' %';
            li.append(spanHumidity);
            ulElements.append(li);
            document.querySelector("#txtSearch").value = '';
        }

    }
}

function ktof(k){
    return ((k-273.15)*(9/5)+32).toFixed(2);
}

//call to displayHistory() function
displayHistory();

