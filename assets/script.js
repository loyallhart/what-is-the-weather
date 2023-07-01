
// Store City 
//api- https://openweathermap.org/forecast5#cityid5

var searchInput = $('#searchInput');
var searchBtn = $('#searchBtn');
var daysForecast = $('#daysForecast'); 
let apiKey = 'a69f566d76c60b3b1c5949c3a3d79975';
var todaysDate = $('#todaysDate');
var fiveDayForecast = $('#fiveDayForecast');
var historyBtn = $('#cityHistory');
var fiveDayForecastTxt = $('.5DayForecast');
var localStorageArray = JSON.parse(localStorage.getItem('searchInput')) || [];

function init() {
    for (var i = 0; i < localStorageArray.length; i++) {
        var buttonElement = $('<button>').text(localStorageArray[i]);
        historyBtn.append(buttonElement);
        };
    }

    async function getGeoData(cityName) {
        var url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
        var response = await fetch(url);
        var data = await response.json();
        console.log(data);
        if (data.length === 0) {
            throw new Error('Location not found! Enter a valid city.');
        }
        return data;
    }

    async function get5DayForecast(lat, lon) {
        var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
        var response = await fetch(url);
        var data = await response.json();
        console.log(data);
        fiveDayForecastTxt.removeClass('invisible');
        for (var i = 7; i < data.list.length; i += 8) {
            var day = data.list[i];
            var dt_txt = day.dt_txt;
            var date = new Date(dt_txt);
            var formattedDate = dayjs(date).format('MM/DD/YYYY');
            var iconCode = day.weather[0].icon;
            var iconLink = `https://openweathermap.org/img/w/${iconCode}.png`;
            var icon = $('<img>').attr('src', iconLink);
            var wind = day.wind.speed;
            var humidity = day.main.humidity;
            var tempK = data.list[0].main.temp;
            var tempF = Math.round((tempK - 273.15) * 1.8 + 32);
            var tempElement = $('<p>').text(`Temperature: ${tempF} °F`);
            var windElement = $('<p>').text(`Wind: ${wind} mph`);
            var humidityElement = $('<p>').text(`Humidity: ${humidity}%`);
            var dayElement = $('<div>').addClass('day p-2 m-4 bg-info text-dark');
            dayElement.append($('<h5>').text(formattedDate));
            dayElement.append(icon);
            dayElement.append(tempElement);
            dayElement.append(windElement);
            dayElement.append(humidityElement);
            fiveDayForecast.append(dayElement);
        }
    }
    
    async function getCurrentWeather(lat, lon) {
        var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        var response = await fetch(apiUrl);
        var data = await response.json();
        console.log(data);
        daysForecast.addClass('border border-dark h-50');
        var currentDate = new Date();
        var formattedDate = dayjs(currentDate).format('MM/DD/YYYY');
        var iconCode = data.weather[0].icon;
        var iconLink = `https://openweathermap.org/img/w/${iconCode}.png`;
        var iconPic = $('<img>').attr('src', iconLink);
        todaysDate.append(data.name + " " + formattedDate + " ").append(iconPic);
        var wind = data.wind.speed;
        var humidity = data.main.humidity;
        var tempK = data.main.temp;
        var tempF = Math.round((tempK - 273.15) * 1.8 + 32);
        var tempElement = $('<p>').text(`Temperature: ${tempF} °F`);
        var windElement = $('<p>').text(`Wind: ${wind} mph`);
        var humidityElement = $('<p>').text(`Humidity: ${humidity}%`);
        todaysDate.append(tempElement).append(windElement).append(humidityElement);
    }
    
    function storeCity(city) {
        if (!localStorageArray.includes(city)) {
            localStorageArray.push(city);
        }
        localStorage.setItem('searchInput', JSON.stringify(localStorageArray));
    }
    
    function formatCityName(cityName) {
        // Capitalize the first letter of the city name and make the rest lowercase
        return cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
      }
    
      historyBtn.on('click', 'button', function() {
        todaysDate.empty();
        fiveDayForecast.empty();
        var cityName = $(this).text();
        cityName = formatCityName(cityName);
        getGeoData(cityName)
        .then(function(data) {
          var lat = data[0].lat;
          var lon = data[0].lon;
          return get5DayForecast(lat, lon) && getCurrentWeather(lat,lon);
        })
        .catch(function(error) {
          console.log(error);
        });
      });
    
      searchBtn.on('click', function() {
        todaysDate.empty();
        fiveDayForecast.empty();
        var cityName = searchInput.val();
        if(cityName === '') {
            alert('Please enter a City Name.')
        } else {
            cityName = formatCityName(cityName);
            getGeoData(cityName)
            .then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                var buttonExists = false;
                // check if button already exists
                historyBtn.children().each(function() {
                    if ($(this).text() === cityName) {
                        buttonExists = true;
                    }
                });
                // append button if it doesn't exist
                if (!buttonExists) {
                    var buttonElement = $('<button>').text(cityName);
                    historyBtn.append(buttonElement);
                    storeCity(cityName);
                }
                return get5DayForecast(lat, lon) && getCurrentWeather(lat,lon);
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    });
    
    
    init ();
    

