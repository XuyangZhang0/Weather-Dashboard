// vairables
let lat = "";
let lon = "";
let recentSearch = [];
let tempUnit = "°F";
let windUnit = "mph ";
let searchBtn = $("#searchBtn")[0];
let cityInputEl = $("#citylist")[0];

// Get Coordinates
function getGeo(cityName) {
    let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=9423c300333017676b7d7fdebf4d0575`;
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
                renderCityResults(data);
            }
        })
}

// Get Weather data from open weather API by lat, lon
function getWeather(lat, lon) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=9423c300333017676b7d7fdebf4d0575`;
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
                renderWeatherResults(data);
                $(".weathercard").show();
                renderFiveDayForecast(data);
                $("#fivedatyforcastheader").show();
            }
        })
}

// Parse geocoding API results
function renderCityResults(geoCodingJSON) {
    $("#citylistOptions").empty();
    for (let i = 0; i < geoCodingJSON.length; i++) {
        $("#citylistOptions").append(
            `<option data-lat="${geoCodingJSON[i].lat}" data-lon="${geoCodingJSON[i].lon}" value="${geoCodingJSON[i].name}, ${geoCodingJSON[i].state}, ${geoCodingJSON[i].country}">`
        )
    }
}

//Render weather results in the current weather card
function renderWeatherResults(weatherJSON) {
    $("#currentcardheader").text($('#citylist').val() + " " + moment().format("(MM/DD/YY)"));
    $("#currentcardheader").append(
        `<span id="icon"><img id="currentwicon" src="" alt=""></span>`
    )
    let iconurl = "http://openweathermap.org/img/w/" + weatherJSON.current.weather[0].icon + ".png";
    $('#currentwicon').attr('src', iconurl);
    $("#currenttemp").text(weatherJSON.current.temp + tempUnit);
    $("#currentwind").text(weatherJSON.current.wind_speed + windUnit);
    $("#currenthumidity").text(weatherJSON.current.humidity + "%");
    $("#currentuvi").text(weatherJSON.current.uvi);
    $("#currentuvi").addClass(checkUVIClass(weatherJSON.current.uvi));

}
// Event Lisener on input field selected
$("#citylist").on("input", function (event) {
    if (event.inputType == "insertReplacementText" || event.inputType == null) {
        checkExists($('#citylist').val());
    }
})

// Event Listener bound to keystroke against text field

cityInputEl.addEventListener("keyup", refreshCityList);

// Event listener for search button
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    getWeather(lat, lon);
    let search = {
        city: $('#citylist').val(),
        latitude: lat,
        longitude: lon
    };
    saveRecentSearch(search);
    loadRecentSearch();
    cityInputEl.addEventListener("keyup", refreshCityList);
})

// Utility Function to ensure a datalist item is selected, and variable set
function checkExists(inputValue) {
    var x = document.getElementById("citylistOptions");
    var i;
    var flag;
    for (i = 0; i < x.options.length; i++) {
        if (inputValue == x.options[i].value) {
            cityInputEl.removeEventListener("keyup", refreshCityList); //stops input datalist refresh
            flag = true;
            lat = x.options[i].dataset.lat;
            lon = x.options[i].dataset.lon;
        }
    }
    return flag;
}



// reresh city options
function refreshCityList() {
    if (cityInputEl.value.length > 2) {
        $("#citylistOptions").empty();
        getGeo(cityInputEl.value);
    }
}


// save recent search into array and set localstorage
function saveRecentSearch(searchInstance) {
    const exists = Boolean(recentSearch.find(x => x.city === searchInstance.city && x.latitude === searchInstance.latitude & x.longitude === searchInstance.longitude));

    if (!exists) {
        recentSearch.unshift(searchInstance);
        localStorage.setItem("recentWeatherSearch", JSON.stringify(recentSearch));
    }
}

// reload the recent search button group
function loadRecentSearch() {
    recentSearch = JSON.parse(localStorage.getItem("recentWeatherSearch")) || [];
    $("#recentSearchBtnGroup").empty();
    for (let i = 0; i < recentSearch.length; i++) {
        $("#recentSearchBtnGroup").append(
            `<button type="button" class="btn btn-secondary my-1 rounded" data-lat="${recentSearch[i].latitude}" data-lon="${recentSearch[i].longitude}">${recentSearch[i].city}</button>`
        );
    }
}

// Show Five Days
function renderFiveDayForecast(data) {
    $("#fivedayforecast").empty();
    for (let i = 1; i <= 5; i++) {
        let iconurl = "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png";
        $("#fivedayforecast").append(
            `<div class="dailycard">
            <div class="card-header">
            ${moment().add(i, 'days').format("MM/DD/YY")}
            <span id="icon"><img id="wicon${i}" src="${iconurl}" alt=""></span>
            </div>
            <p>Temp: <span>${parseInt(data.daily[i].temp.min)} - ${parseInt(data.daily[i].temp.max)}${tempUnit}</span></p>
            <p>Wind: <span>${data.daily[i].wind_speed} ${windUnit}</span></p>
            <p>Humidity: <span>${data.daily[i].humidity}%</span></p>
            <p>UV Index: <span class="${checkUVIClass(data.daily[i].uvi)}">${data.daily[i].uvi}</span></p>
          </div>`
        )
    }
}

// uvivalue clasification
function checkUVIClass(uvivalue) {
    if (uvivalue >= 0 && uvivalue < 3) {
        return "uv-favorable";
    } else if (uvivalue >= 3 && uvivalue < 8) {
        return "uv-moderate";
    } else {
        return "uv-severe";
    }
}

// recent search re-trigger
$("#recentSearchBtnGroup").on("click", function (event) {
    if (event.target.tagName == "BUTTON") {
        $('#citylist').val(event.target.textContent);
        checkExists($('#citylist').val());
        getWeather(event.target.dataset.lat, event.target.dataset.lon);
    }
})


loadRecentSearch();
$(".weathercard").hide();
// Event Listener to the recent search button, with event delegation
$("#fivedatyforcastheader").hide();