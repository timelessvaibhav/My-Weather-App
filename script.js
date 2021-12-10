const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentweatheritemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherforecastEl = document.getElementById('weather-forecast');
const currentTemperatureEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const API_KEY = '06e9795220343694f48b177ffdd71e9f';

setInterval(()=>{
const time = new Date();
const month = time.getMonth();
const day = time.getDay();
const date = time.getDate();
const hour = time.getHours();
const minutes = time.getMinutes();
const ampm = hour>=12? 'PM' : 'AM'; 
const hoursin12hrformat = hour>=13 ? hour%12 : hour;

timeEl.innerHTML = (hoursin12hrformat<10 ? '0'+hoursin12hrformat : hoursin12hrformat) + ":" + (minutes<10 ? '0'+minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
dateEl.innerHTML = days[day] + ', ' + date +' ' +  months[month];

}, 1000);

getWeatherData();

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success) =>{
        let {latitude,longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

        console.log(data);

        showWeatherdata(data);
        })
    })
}

function showWeatherdata(data){
    let {humidity,pressure,wind_speed,sunrise,sunset,temp,feels_like} = data.current; 

    
    countryEl.innerHTML = 'Your Location : ' + data.lat + 'N ' + data.lon + 'E';

    currentweatheritemsEl.innerHTML = `<div class="weather-item">
    <div>Current Temperature</div>
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

    let otherdayforecast = '';

    data.daily.forEach((day,idx) => {

        if(idx==0){
            currentTemperatureEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
            <div class="other">
                <div class="day">Today</div>
                <br>
                <div class="description-today"> ${day.weather[0].main}</div>
                <div class="temp">Max : ${day.temp.max} &#176; C</div>
                <div class="temp">Min : ${day.temp.min}&#176; C</div>
            </div>`

        }
        else{
            otherdayforecast+=`
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <br>
            <div class="description-otherdays"> ${day.weather[0].main}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather icon" class="w-icon">
            <div class="temp">Max : ${day.temp.max}&#176; C</div>
            <div class="temp">Min : ${day.temp.min}&#176; C</div>
            </div>`
        }
        
    });

    weatherforecastEl.innerHTML = otherdayforecast;



}

