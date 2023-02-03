$("#searchBtn").on("click", function (event) {
  event.preventDefault();

  const APIKey = "ac05d0f083a97fd76b0305bca7bb2db8";

  // retrieve search input text
  const searchInput = $("#searchInput").val();

  const queryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    searchInput +
    "&appid=" +
    APIKey +
    "&units=metric";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    //
    //
  });
});
