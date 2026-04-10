//Weather API Configuration
const weatherApi = {
  key: "4eb3703790b356562054106543b748b2",
  baseUrl: "https://api.openweathermap.org/data/2.5/weather",
};

// Event listener for Enter key press
let searchInputBox = document.getElementById("input-box");
searchInputBox.addEventListener("keypress", (event) => {
  if (event.keyCode == 13) {
    getWeatherReport(searchInputBox.value);
  }
});

// Get weather report from API
function getWeatherReport(city) {
  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then((weather) => {
      return weather.json();
    })
    .then(showWeatherReport)
    .catch((error) => {
      swal("Error", "Failed to fetch weather data. Please try again.", "error");
      reset();
    });
}

// Display weather report
function showWeatherReport(weather) {
  let city_code = weather.cod;
  if (city_code === "400") {
    swal("Empty Input", "Please enter a city name", "error");
    reset();
  } else if (city_code === "404") {
    swal("City Not Found", "The city you entered couldn't be found", "warning");
    reset();
  } else {
    let weatherBody = document.getElementById("weather-body");
    let todayDate = new Date();

    // Build weather content HTML
    let weatherHTML = `
            <div class="location-details">
                <h2>${weather.name}, ${weather.sys.country}</h2>
                <p>${dateManage(todayDate)}</p>
            </div>
            <div class="weather-status">
                <div class="weather-main">
                    <div class="temp">${Math.round(
                      weather.main.temp
                    )}<span>°C</span></div>
                    <div class="weather">${weather.weather[0].main}</div>
                </div>
                <div>
                    <div style="text-align: center;">
                        <i class="fas ${getIconClass(
                          weather.weather[0].main
                        )}" id="weather-icon"></i>
                    </div>
                </div>
            </div>
            <div class="min-max">
                <div>
                    <label>Min Temp</label>
                    <span>${Math.floor(weather.main.temp_min)}°C</span>
                </div>
                <div>
                    <label>Max Temp</label>
                    <span>${Math.ceil(weather.main.temp_max)}°C</span>
                </div>
            </div>
            <div class="day_details">
                <div class="basic">
                    <label>Feels Like</label>
                    <span>${Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div class="basic">
                    <label>Humidity</label>
                    <span>${weather.main.humidity}%</span>
                </div>
                <div class="basic">
                    <label>Pressure</label>
                    <span>${weather.main.pressure} mb</span>
                </div>
                <div class="basic">
                    <label>Wind Speed</label>
                    <span>${weather.wind.speed} km/h</span>
                </div>
                <div class="basic">
                    <label>Visibility</label>
                    <span>${(weather.visibility / 1000).toFixed(1)} km</span>
                </div>
                <div class="basic">
                    <label>Updated</label>
                    <span>${getTime(todayDate)}</span>
                </div>
            </div>
        `;

    weatherBody.innerHTML = weatherHTML;
    changeBg(weather.weather[0].main);
    reset();
  }
}

// Format current time
function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

// Format date
function dateManage(dateArg) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];

  return `${date} ${month} (${day}), ${year}`;
}

// Change background based on weather condition
function changeBg(status) {
  const weatherBgs = {
    Clouds: 'url("img/clouds.jpg")',
    Rain: 'url("img/rainy.jpg")',
    Clear: 'url("img/clear.jpg")',
    Snow: 'url("img/snow.jpg")',
    Sunny: 'url("img/sunny.jpg")',
    Thunderstorm: 'url("img/thunderstrom.jpg")',
    Drizzle: 'url("img/drizzle.jpg")',
    Mist: 'url("img/mist.jpg")',
    Haze: 'url("img/mist.jpg")',
    Fog: 'url("img/mist.jpg")',
  };

  const bgImage = weatherBgs[status] || 'url("img/bg.jpg")';
  document.body.style.backgroundImage = bgImage;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
}

// Get Font Awesome icon class for weather condition
function getIconClass(classArg) {
  const iconMap = {
    Rain: "fa-cloud-showers-heavy",
    Clouds: "fa-cloud",
    Clear: "fa-sun",
    Snow: "fa-snowflake",
    Sunny: "fa-sun",
    Mist: "fa-smog",
    Haze: "fa-smog",
    Fog: "fa-smog",
    Thunderstorm: "fa-bolt",
    Drizzle: "fa-cloud-rain",
  };

  return iconMap[classArg] ? iconMap[classArg] : "fa-cloud-sun";
}

// Clear search input
function reset() {
  let input = document.getElementById("input-box");
  input.value = "";
}

// Add leading zero for single digit numbers
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
