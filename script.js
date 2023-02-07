let userSearches = [];
const currentDay = moment().format("dddd, Do MMMM YYYY");
const APIKey = "ac05d0f083a97fd76b0305bca7bb2db8";

// example city when the page load, before first user search
const currentCity = "London";
// define max search number visible on screen
const pastSearchesNo = 5;

// update weather condition based on the user search
function displayWeather(city) {
  // clear current day and forecast sections
  $("#today").empty();
  $("#forecast").empty();
  // call functions to get today and forecast weather
  cityWeather(city);
  cityForecast(city);
  // display user searches on screen/ user history
  appendSearch(city);
}

// update user search history section
function appendSearch(search) {
  // check if new search is saved already in history section
  // if yes move this search to the top
  const index = userSearches.indexOf(search);
  if (index > -1) {
    userSearches.splice(index, 1);
  } else {
    if (userSearches.length === pastSearchesNo) {
      // if number of user searches is equal as defined globally, remove last element from array
      userSearches.pop();
    }
  }
  // adds new user search to the top of the list
  userSearches.unshift(search);
  // clear user search history before it can display new searches
  $("#history").empty();
  // creates search history section/ buttons
  for (let i = 0; i < userSearches.length; i++) {
    let lastSearch = $("<button>").text(userSearches[i]);
    lastSearch.attr("class", "pastSearchBtn");
    // click past search - display again current and future conditions for that city
    lastSearch.on("click", function (event) {
      event.preventDefault();
      displayWeather(lastSearch.text());
    });
    $("#history").append(lastSearch);
  }
}

// present current city weather - performs ajax request
function cityWeather(city) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=metric";

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      // get weather data for called city
      const weather = {
        city: response.city.name,
        country: response.city.country,
        icon: response.list[0].weather[0].icon,
        temp: Math.round(response.list[0].main.temp),
        wind: Math.round(response.list[0].wind.speed),
        humidity: response.list[0].main.humidity,
      };

      const weatherOverview = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + weather.icon + "@2x.png"
      );
      weatherOverview.addClass("img-icon");

      const cityLabel = $("<h2>").text(weather.city + ", " + weather.country);
      cityLabel.append(weatherOverview);
      const currentDate = $("<h3>").text(currentDay);
      const tempP = $("<p>").text(`Temp: ${weather.temp} °C`);
      const windP = $("<p>").text(`Wind: ${weather.wind} KPH`);
      const humidityP = $("<p>").text(`Humidity: ${weather.humidity} %`);

      $("#today").append(cityLabel, currentDate, tempP, windP, humidityP);
    })
    // display error massage if the search is undefined
    .catch(function (errResponse) {
      const cityLabel = $("<h3>").text("Incorrect city name. Try Again!");
      $("#today").append(cityLabel);
    });
}

// present forecast weather for the city - performs ajax request
function cityForecast(city) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=metric";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    const forecastLabel = $("<h3>").text("5-Day Forecast:");
    const forecastResults = $("<div>").addClass("row");
    $("#forecast").prepend(forecastLabel, forecastResults);

    for (let i = 1; i < 6; i++) {
      // get weather data for called city
      const forecast = {
        icon: response.list[i].weather[0].icon,
        temp: Math.round(response.list[i].main.temp),
        wind: Math.round(response.list[i].wind.speed),
        humidity: response.list[i].main.humidity,
      };
      // use moment js to retrieve dates
      const forecastDay1 = moment().add(i, "days").format("ddd, Do MMM");

      const weatherOverview = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + forecast.icon + "@2x.png"
      );
      weatherOverview.addClass("img-icon");

      const forecastDiv = $("<div>").addClass("col forecast-div");
      const forecastDate = $("<h3>").text(forecastDay1);
      const tempP = $("<p>").text(`Temp: ${forecast.temp} °C`);
      const windP = $("<p>").text(`Wind: ${forecast.wind} KPH`);
      const humidityP = $("<p>").text(`Humidity: ${forecast.humidity} %`);

      forecastResults.append(forecastDiv);
      forecastDiv.append(
        weatherOverview,
        forecastDate,
        tempP,
        windP,
        humidityP
      );
    }
  });
}

// call and get data for example city when the web load, before first user search
cityWeather(currentCity);
cityForecast(currentCity);

// search onclick handler
$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  // retrieve user search input text
  const searchInput = $("#searchInput").val();
  //clear search input box
  $("#searchInput").val("");
  // update weather condition based on the user search
  displayWeather(searchInput);
});
