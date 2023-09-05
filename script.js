// Get references to HTML elements
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentweatheritemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherforecastEl = document.getElementById("weather-forecast");
const currentTemperatureEl = document.getElementById("current-temp");

// Arrays for days and months
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const months = [
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

// API key for OpenWeatherMap
const API_KEY = "06e9795220343694f48b177ffdd71e9f";

// Function to get the city name from coordinates
function getCityName(latitude, longitude) {
    fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
    )
        .then((res) => res.json())
        .then((data) => {
            if (data && data.length > 0) {
                const city = data[0].name;
                countryEl.innerHTML = `Your Location: ${city}, ${data[0].country}`;
            }
        });
}

// Update time and date every second
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const day = time.getDay();
    const date = time.getDate();
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";

    // Display time and date
    timeEl.innerHTML =
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes);
    dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

// Get weather data and city name
getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;

        // Call the function to get the city name
        getCityName(latitude, longitude);

        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                showWeatherdata(data);
            });
    });
}

function showWeatherdata(data) {
    let { humidity, pressure, wind_speed, sunrise, sunset, temp, feels_like } =
        data.current;

    // Display current weather information
    currentweatheritemsEl.innerHTML = `<div class="weather-item">
    <div>Temperature</div>
    <div>${temp} &#176 C</div>
    </div>
    <div class="weather-item">
        <div>Real feel</div>
        <div>${feels_like} &#176 C</div>
    </div>
    <div class="weather-item">
        <div>Humidity</div>
        <div>${humidity} %</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed} m/s</div>
    </div>`;

    let otherdayforecast = "";

    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            // Display today's weather information
            currentTemperatureEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
            <div class="other">
                <div class="day">Today</div>
                <br>
                <div class="description-today"> ${day.weather[0].main}</div>
                <div class="temp">Max : ${day.temp.max} &#176; C</div>
                <div class="temp">Min : ${day.temp.min}&#176; C</div>
            </div>`;
        } else {
            // Create HTML for other days' weather forecast
            otherdayforecast += `
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
            <br>
            <div class="description-otherdays"> ${day.weather[0].main}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon
                }@2x.png" alt="Weather icon" class="w-icon">
            <div class="temp">Max : ${day.temp.max}&#176; C</div>
            <div class="temp">Min : ${day.temp.min}&#176; C</div>
            </div>`;
        }
    });

    // Display weather forecast
    weatherforecastEl.innerHTML = otherdayforecast;
}
