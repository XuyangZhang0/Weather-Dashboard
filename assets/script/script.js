// Search for cities
//Sample API call
// https://api.openweathermap.org/data/2.5/forecast?q=Atlanta&appid=9423c300333017676b7d7fdebf4d0575
// One call API
// https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}
//http://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units={units}
//For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
//For temperature in Celsius and wind speed in meter/sec, use units=metric
// Geocoding API http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Example: http://api.openweathermap.org/geo/1.0/direct?q=Atlanta&limit=1&appid=9423c300333017676b7d7fdebf4d0575
// Callback, which can control the flow 
// Syntax
// function myDisplayer(some) {
//     document.getElementById("demo").innerHTML = some;
//   }

//   function myCalculator(num1, num2, myCallback) {
//     let sum = num1 + num2;
//     myCallback(sum);
//   }

//Datalist
/* <label for="exampleDataList" class="form-label">Datalist example</label>
<input class="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search...">
<datalist id="datalistOptions">
  <option value="San Francisco">
  <option value="New York">
  <option value="Seattle">
  <option value="Los Angeles">
  <option value="Chicago">
</datalist> */

//   myCalculator(5, 5, myDisplayer);
//Recent Search

//Get Search keyword

//Load Results for Today

//Load Results for 5 days


//Search
//read the keyword, construct url for fetch

// vairables
let lat = "";
let lon = "";


// Get Coordinates
function getGeo(cityName) {
    let requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=9423c300333017676b7d7fdebf4d0575`;
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return;
            }
        })
        .then(function (data) {
            if (!data) {
                alert("We ran into some issues, please contact the developer at zhangxuyang.chn@gmail.com");
            } else {
                // console.log(data);
                renderCityResults(data);
            }
        })
}

// getGeo("Atlanta");

// Parse geocoding API results
{/* <option value="New York"> */ }
function renderCityResults(geoCodingJSON) {
    for (let i = 0; i < geoCodingJSON.length; i++) {

        $("#citylistOptions").append(
            `<option data-lat="${geoCodingJSON[i].lat}" data-lon="${geoCodingJSON[i].lon}" value="${geoCodingJSON[i].name}, ${geoCodingJSON[i].state}, ${geoCodingJSON[i].country}">`
        )
    }

}
// Event Lisener on input field selected
$("#citylist").on("input", function (event) {
    if (event.inputType == "insertReplacementText" || event.inputType == null) {
        checkExists($('#citylist').val());
    }
})

// Utility Function to ensure a datalist item is selected, and variable set
function checkExists(inputValue) {
    var x = document.getElementById("citylistOptions");
    var i;
    var flag;
    for (i = 0; i < x.options.length; i++) {
        if (inputValue == x.options[i].value) {
            flag = true;
            lat = x.options[i].dataset.lat;
            lon = x.options[i].dataset.lon;
        }
    }
    return flag;
}

// Event Listener bound to keystroke against text field
let cityInputEl = $("#citylist")[0];
cityInputEl.addEventListener("keyup", function () {
    if (cityInputEl.value.length > 2) {
        $("#citylistOptions").empty();
        getGeo(cityInputEl.value);
    }
})

let searchBtn = $("#searchBtn")[0];
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    getWeather(lat, lon);
})

// Get Weather
function getWeather(lat, lon) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=9423c300333017676b7d7fdebf4d0575`;
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return;
            }
        })
        .then(function (data) {
            if (!data) {
                alert("We ran into some issues, please contact the developer at zhangxuyang.chn@gmail.com");
            } else {
                console.log(data);

            }
        })
}

