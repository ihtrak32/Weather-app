const cityInput = document.querySelector(".city");
const searchbtn = document.getElementById("search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-info");
const humidityTxt = document.querySelector(".humidity-value");
const windTxt = document.querySelector(".wind-speed-value");

const weatherIcon = document.querySelector(".weather-img");
const currentDateTxt = document.querySelector(".current-date-txt");

const forecastItemsContainer = document.querySelector(".forecast-detail");

const apikey = 'e8782c764464a797512395b81159bda8'

showDisplaySection(searchCitySection);

searchbtn.addEventListener('click', () => {
    if(cityInput.value.trim() != ""){
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
    
})

cityInput.addEventListener('keydown', (e) => {
    if(e.key === "Enter" && cityInput.value.trim() != ""){
        updateWeatherInfo(cityInput.value)
        cityInput.value = "";
        cityInput.blur();
    }
})

 async function getfetchData(endpoint,city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apikey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}

async function updateWeatherInfo(city){
    const weatherData = await getfetchData('weather',city);

    if(weatherData.cod != 200){
        return showDisplaySection(notFoundSection);
    }

    const {
        name: country,
        main: {temp, humidity},
        weather: [{id,main}],
        wind: {speed}
    } = weatherData;

    countryTxt.innerText = country;
    tempTxt.innerText = `${Math.round(temp)}°C`;
    conditionTxt.innerText = main;
    humidityTxt.innerText = `${humidity}%`;
    windTxt.innerText = `${speed}km/h`;

    weatherIcon.src = `../weather/${getWeatherIcon(id)}`;

    await updateforecastInfo(city);
    currentDateTxt.innerText = getcurrentDate();
    showDisplaySection(weatherInfoSection);
}

function showDisplaySection(section){
    [notFoundSection, searchCitySection, weatherInfoSection].forEach(section => section.style.display="none");

    section.style.display = "flex";
}

function getcurrentDate(){
    const currentDate = new Date();

    const options = {weekday: "short", month: "short", day: "2-digit"};
    return currentDate.toLocaleDateString("en-US", options);
}

function getWeatherIcon(id){
    if(id<=232) return "thunderstorm.svg";
    if(id<=321) return "drizzle.svg";
    if(id<=531) return "rainny.svg";
    if(id<=622) return "snow.svg";
    if(id<=781) return "haze.svg";
    if(id<=800) return "sunny.svg";
    else return "cloudy.svg";
}

async function updateforecastInfo(city){
    const forecastData = await getfetchData('forecast',city);

    const timetaken = '12:00:00';
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemsContainer.innerHTML = "";
    forecastData.list.forEach(forecastWeather=>{
        if(forecastWeather.dt_txt.includes(timetaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateforecastItems(forecastWeather)
        }
    })
    console.log(forecastData);
}

function updateforecastItems(weatherInfo){
   
    const {
        dt_txt:date,
        weather:[{id}],
        main:{temp},
    } = weatherInfo;
    
    const datetaken = new Date(date)
    const options = {month: "short", day: "2-digit"};
    const forecastDate = datetaken.toLocaleDateString("en-US", options);

    const forcastItem = `
                    <div class="forecast-item">
                    <h5 class="forecast-item-data">${forecastDate}</h5>
                    <img src="../weather/${getWeatherIcon(id)}"  class="forecast-item-img">
                    <h5 class="forecast-item-temperature">${Math.round(temp)}°C</h5>
                </div>
                `;
    forecastItemsContainer.insertAdjacentHTML("beforeend",forcastItem);
}