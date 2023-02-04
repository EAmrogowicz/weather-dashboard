let userSearches = [];
const currentDay = ` (${moment().format("DD/MM/YYYY")})`;
const APIKey = "ac05d0f083a97fd76b0305bca7bb2db8";

// example city when the web load, before first user search
const currentCity = "London";

function displayWeather(city) {
  // clear html sections
  $("#today").empty();
  $("#forecast").empty();
  // call functions to get today and forecast weather
  cityWeather(city);
  cityForecast(city);
  // print user searches on screen/ user history
  appendSearch(city);
}

function appendSearch(search) {
  // define max search number visible on screen
  const pastSearchesNo = 5;
  // check if new search saved in history and move to the top
  const index = userSearches.indexOf(search);
  if (index > -1) {
    userSearches.splice(index, 1);
  } else {
    if (userSearches.length === pastSearchesNo) {
      userSearches.pop();
    }
  }
  // add value to the start of an userSearch array
  userSearches.unshift(search);
  // clear user search history before re-print loop/creates new buttons
  $("#history").empty();
  // creates button
  for (let i = 0; i < userSearches.length; i++) {
    let lastSearch = $("<button>").text(userSearches[i]);
    lastSearch.attr("class", "pastSearchBtn");
    // on click event - user click button of one of the past searches
    lastSearch.on("click", function (event) {
      event.preventDefault();
      displayWeather(lastSearch.text());
    });
    // append button to html
    $("#history").append(lastSearch);
  }
}

function cityWeather(city) {
  const queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=metric";

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      // object with all weather data for called city
      const weather = {
        city: response.city.name,
        icon: response.list[0].weather[0].icon,
        temp: response.list[0].main.temp,
        wind: response.list[0].wind.speed,
        humidity: response.list[0].main.humidity,
      };
      // creates img with weather icon
      const weatherOverview = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + weather.icon + "@2x.png"
      );
      weatherOverview.addClass("img-icon");
      // creates new el with weather data
      const cityLabel = $("<h2>").text(weather.city + currentDay);
      cityLabel.append(weatherOverview);
      const tempP = $("<p>").text(`Temp: ${weather.temp} °C`);
      const windP = $("<p>").text(`Wind: ${weather.wind} KPH`);
      const humidityP = $("<p>").text(`Humidity: ${weather.humidity} %`);
      // append all elements to html
      $("#today").append(cityLabel, tempP, windP, humidityP);
    })
    // if the city name is incorrect, display error massage
    .catch(function (errResponse) {
      const cityLabel = $("<h3>").text("Incorrect city name. Try Again!");
      $("#today").append(cityLabel);
    });
}

function cityForecast(city) {
  const queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=metric";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // prepend title and section box to html
    const forecastLabel = $("<h3>").text("5-Day Forecast:");
    const forecastResults = $("<div>").addClass("row");
    $("#forecast").prepend(forecastLabel, forecastResults);

    for (let i = 1; i < 6; i++) {
      // object with all weather data for called city
      const forecast = {
        icon: response.list[i].weather[0].icon,
        temp: response.list[i].main.temp,
        wind: response.list[i].wind.speed,
        humidity: response.list[i].main.humidity,
      };
      // list days based on the moment js
      const forecastDay1 = moment().add(i, "days").format("DD/MM/YYYY");
      // creates img with weather icon
      const weatherOverview = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + forecast.icon + "@2x.png"
      );
      weatherOverview.addClass("img-icon");
      // creates new el with weather data
      const forecastDiv = $("<div>").addClass("col forecast-div");
      const forecastDate = $("<h3>").text(forecastDay1);
      const tempP = $("<p>").text(`Temp: ${forecast.temp} °C`);
      const windP = $("<p>").text(`Wind: ${forecast.wind} KPH`);
      const humidityP = $("<p>").text(`Humidity: ${forecast.humidity} %`);
      // append all elements to html
      forecastResults.append(forecastDiv);
      forecastDiv.append(
        forecastDate,
        weatherOverview,
        tempP,
        windP,
        humidityP
      );
    }
  });
}

// call and get data for London when the web load, before first user search
cityWeather(currentCity);
cityForecast(currentCity);

// search button on click function
$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  // retrieve user search input text
  const searchInput = $("#searchInput").val();
  //clear search input box
  $("#searchInput").val("");

  displayWeather(searchInput);
});
