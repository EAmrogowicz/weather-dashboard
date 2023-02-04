let pastSearches = [];
const currentDay = ` (${moment().format("DD/MM/YYYY")})`;

const currentCity = "London";

function displayForecast(city) {
  $("#today").empty();
  $("#forecast").empty();

  cityWeather(city);
  cityForecast(city);

  appendSearch(city);
}

function appendSearch(search) {
  const pastSearchesNo = 5;

  const index = pastSearches.indexOf(search);
  if (index > -1) {
    pastSearches.splice(index, 1);
  } else {
    if (pastSearches.length === pastSearchesNo) {
      pastSearches.pop();
    }
  }

  pastSearches.unshift(search);

  $("#history").empty();

  for (let i = 0; i < pastSearches.length; i++) {
    let lastSearch = $("<button>").text(pastSearches[i]);
    lastSearch.attr("class", "pastSearchBtn");

    lastSearch.on("click", function (event) {
      event.preventDefault();
      displayForecast(lastSearch.text());
    });

    $("#history").append(lastSearch);
  }
}

function cityWeather(city) {
  const APIKey = "ac05d0f083a97fd76b0305bca7bb2db8";

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
    console.log(response);

    const weather = {
      city: response.city.name,
      icon: response.list[0].weather[0].icon,
      temp: response.list[0].main.temp,
      wind: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
    };

    const weatherOverview = $("<img>").attr(
      "src",
      "http://openweathermap.org/img/wn/" + weather.icon + "@2x.png"
    );
    weatherOverview.addClass("img-icon");

    const cityLabel = $("<h2>").text(weather.city + currentDay);
    cityLabel.append(weatherOverview);
    const tempP = $("<p>").text(`Temp: ${weather.temp} °C`);
    const windP = $("<p>").text(`Wind: ${weather.wind} KPH`);
    const humidityP = $("<p>").text(`Humidity: ${weather.humidity} %`);
    $("#today").append(cityLabel, tempP, windP, humidityP);
  });
}

function cityForecast(city) {
  const APIKey = "ac05d0f083a97fd76b0305bca7bb2db8";

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
    const forecastLabel = $("<h3>").text("5-Day Forecast:");
    const forecastResults = $("<div>").addClass("forecast-container");
    $("#forecast").prepend(forecastLabel, forecastResults);

    for (let i = 1; i < 6; i++) {
      const forecast = {
        icon: response.list[i].weather[0].icon,
        temp: response.list[i].main.temp,
        wind: response.list[i].wind.speed,
        humidity: response.list[i].main.humidity,
      };

      const forecastDay1 = moment().add(i, "days").format("DD/MM/YYYY");

      const weatherOverview = $("<img>").attr(
        "src",
        "http://openweathermap.org/img/wn/" + forecast.icon + "@2x.png"
      );
      weatherOverview.addClass("img-icon");

      const forecastDiv = $("<div>").addClass("forecast-div");
      const forecastDate = $("<h3>").text(forecastDay1);

      const tempP = $("<p>").text(`Temp: ${forecast.temp} °C`);
      const windP = $("<p>").text(`Wind: ${forecast.wind} KPH`);
      const humidityP = $("<p>").text(`Humidity: ${forecast.humidity} %`);

      $(".forecast-container").append(forecastDiv);
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

cityWeather(currentCity);
cityForecast(currentCity);

$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  // retrieve user search input text
  const searchInput = $("#searchInput").val();
  $("#searchInput").val("");

  displayForecast(searchInput);
});
