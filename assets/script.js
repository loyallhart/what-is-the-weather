// Add Search Button Event.Listener
// Store City 
//api- https://openweathermap.org/forecast5#cityid5

// Form Element Variables
let searchData = document.getElementById("searchData");
let searchForm = document.getElementById("searchForm");

const apiKey = "a69f566d76c60b3b1c5949c3a3d79975"

//5 day forecast element variables
let forecast = document.getElementByID('forecast');

//today's weather element variables
let todaysConditions = document.getElementById("todaysConditions");
let city = document.getElementById("city");
let temp = document.getElementById("temp");
let wind = document.getElementById('wind');
let humidity = document.getElementById('humidity');

// event listener for search button

searchForm.addEventListener("clicked", function(event){
    event.preventDefault();
    let citySearched = Object.fromEntries(new FormData(searchForm).city);
    getForecast(citySearched);
    saveCity(citySearched);
    console.log('clicked')
})

async function getForecast(citySearched){
    let weatherApi = "api.openweathermap.org/data/2.5/forecast?units=imperial&appid=a69f566d76c60b3b1c5949c3a3d79975&q=" + citySearched; 
    console.log(weatherApi);

    let results = await fetch(weatherApi);
    let data = await results.json();
    clearWeather();
    
}
