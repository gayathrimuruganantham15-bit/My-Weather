// ======================================================
// WEATHER DASHBOARD SCRIPT.JS
// ======================================================


// OpenWeather API Key
const apiKey = window.YOUR_API_KEY;


// ===============================
// DOM ELEMENTS
// ===============================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const country = document.getElementById("country");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastContainer =
document.getElementById("forecastContainer");

const recentSearches =
document.getElementById("recentSearches");

const loader =
document.getElementById("loader");

const errorMessage =
document.getElementById("errorMessage");

const themeToggle =
document.getElementById("themeToggle");

const unitToggle =
document.getElementById("unitToggle");


// ===============================
// VARIABLES
// ===============================

let currentUnit = "metric";

let recentCities = [];



// ===============================
// SEARCH BUTTON
// ===============================


searchBtn.addEventListener("click",()=>{

    let city = cityInput.value.trim();


    if(city===""){

        showError("Please enter city name");

        return;

    }


    getWeather(city);

});



// Enter key search

cityInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        searchBtn.click();

    }

});



// ===============================
// GET WEATHER
// ===============================


async function getWeather(city){


    showLoader();


    try{


        const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;



        const response =
        await fetch(url);



        if(!response.ok){

            throw new Error("City not found");

        }


        const data =
        await response.json();



        displayWeather(data);


        getForecast(city);


        addRecent(city);



        hideLoader();


    }


    catch(error){


        hideLoader();


        showError(error.message);


    }


}



// ===============================
// DISPLAY WEATHER
// ===============================


function displayWeather(data){



    weatherCard.classList.remove("hidden");


    errorMessage.innerHTML="";



    cityName.innerHTML =
    `${data.name}`;



    country.innerHTML =
    `Country : ${data.sys.country}`;



    temperature.innerHTML =
    `${Math.round(data.main.temp)}°${currentUnit==="metric"?"C":"F"}`;



    description.innerHTML =
    data.weather[0].description;



    weatherIcon.src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;



    feelsLike.innerHTML =
    `Feels Like : ${Math.round(data.main.feels_like)}°`;



    humidity.innerHTML =
    `Humidity : ${data.main.humidity}%`;



    wind.innerHTML =
    `Wind : ${data.wind.speed} m/s`;



    pressure.innerHTML =
    `Pressure : ${data.main.pressure} hPa`;



    visibility.innerHTML =
    `Visibility : ${data.visibility/1000} km`;



    sunrise.innerHTML =
    `Sunrise : ${convertTime(data.sys.sunrise)}`;



    sunset.innerHTML =
    `Sunset : ${convertTime(data.sys.sunset)}`;



    changeBackground(data.weather[0].main);



}



// ===============================
// FORECAST
// ===============================


async function getForecast(city){


try{


const url =
`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;



const response =
await fetch(url);



const data =
await response.json();



forecastContainer.innerHTML="";



let days =
data.list.filter(item=>

item.dt_txt.includes("12:00:00")

);



days.forEach(day=>{


let date =
new Date(day.dt_txt);



let card =
document.createElement("div");


card.className="forecast-card";



card.innerHTML=`

<h3>
${date.toLocaleDateString("en-US",
{weekday:"short"})}
</h3>


<img src=
"https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">


<h2>
${Math.round(day.main.temp)}°
</h2>


<p>
${day.weather[0].description}
</p>

`;



forecastContainer.appendChild(card);



});



}

catch(error){

console.log(error);

}


}



// ===============================
// LOCATION BUTTON
// ===============================


locationBtn.addEventListener("click",()=>{


navigator.geolocation.getCurrentPosition(
(position)=>{


let lat =
position.coords.latitude;


let lon =
position.coords.longitude;



getWeatherByLocation(lat,lon);


});



});



async function getWeatherByLocation(lat,lon){


const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;


const response =
await fetch(url);


const data =
await response.json();


displayWeather(data);


getForecast(data.name);


}



// ===============================
// DARK MODE
// ===============================


themeToggle.addEventListener("click",()=>{


document.body.classList.toggle("dark");



});




// ===============================
// UNIT CHANGE
// ===============================


unitToggle.addEventListener("click",()=>{


if(currentUnit==="metric"){

currentUnit="imperial";

}
else{

currentUnit="metric";

}



if(cityName.innerHTML!=="City"){

getWeather(cityName.innerHTML);

}



});



// ===============================
// RECENT SEARCH
// ===============================


function addRecent(city){


if(!recentCities.includes(city)){


recentCities.push(city);


}



recentSearches.innerHTML="";



recentCities.forEach(item=>{


let btn =
document.createElement("button");


btn.className="search-chip";


btn.innerHTML=item;



btn.onclick=()=>{

getWeather(item);

};



recentSearches.appendChild(btn);



});


}




// ===============================
// UTILITIES
// ===============================


function convertTime(time){


let date =
new Date(time*1000);


return date.toLocaleTimeString();


}



function showLoader(){

loader.classList.remove("hidden");

}


function hideLoader(){

loader.classList.add("hidden");

}


function showError(msg){

errorMessage.innerHTML=msg;

}


function changeBackground(weather){


    // remove only weather classes
    document.body.classList.remove(
        "sunny",
        "cloudy",
        "rainy",
        "snow",
        "night"
    );


    if(weather.includes("Clear")){

        document.body.classList.add("sunny");

    }

    else if(weather.includes("Cloud")){

        document.body.classList.add("cloudy");

    }

    else if(weather.includes("Rain") || weather.includes("Drizzle")){

        document.body.classList.add("rainy");

    }

    else if(weather.includes("Snow")){

        document.body.classList.add("snow");

    }

    else{

        // keep default animated gradient
        document.body.classList.remove(
            "sunny",
            "cloudy",
            "rainy",
            "snow"
        );

    }

}




// ===============================
// DEFAULT WEATHER
// ===============================


window.onload=()=>{


getWeather("Chennai");


};