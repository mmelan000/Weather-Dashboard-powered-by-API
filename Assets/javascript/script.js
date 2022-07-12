var btn = $('button');
var formContent = '';
var currentCity = document.querySelector('#city-name');
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumidity = document.querySelector('#current-humidity');
var currentUV = document.querySelector('#current-uv');
var fiveDay = document.querySelector('#fiveday');
var i = 0;
var UV = '';

function generateFiveDay (input) {

    var createCard = document.createElement('div');
    var createCardDate = document.createElement('h3');
    var createCardTemp = document.createElement('p');
    var createCardWind = document.createElement('p');
    var createCardHumidity = document.createElement('p');
    var createCardIMG = document.createElement('img');    

    createCardIMG.src = 'http://openweathermap.org/img/w/' + input.list[i].weather[0].icon + '.png';
    createCardHumidity.textContent = 'Humidity: ' + input.list[i].main.humidity;
    createCardWind.textContent = 'Wind: ' + input.list[i].wind.speed + ' MPH';
    createCardTemp.textContent = 'Temp: ' + input.list[i].main.temp + ' F';
    createCardDate.textContent = input.list[i].dt_txt.slice(0, -8);

    createCard.appendChild(createCardDate);
    createCard.appendChild(createCardIMG)
    createCard.appendChild(createCardTemp);
    createCard.appendChild(createCardWind);
    createCard.appendChild(createCardHumidity);
    fiveDay.appendChild(createCard); 
}

function renderCurrentDay (input) {
    var lat = input.city.coord.lat;
    var lon = input.city.coord.lon;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,daily,alerts&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8')
        .then(function(response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            UV = data.current.uvi;
            console.log(UV);
            currentUV.textContent = UV;
            if (UV >= 11) {
                currentUV.classList.add('extreme')
            } else if (UV >= 8) {
                currentUV.classList.add('very-high')
            } else if (UV >= 6) {
                currentUV.classList.add('high')
            } else if (UV >= 3) {
                currentUV.classList.add('moderate')
            } else {
                currentUV.classList.add('low')
            }
        })

    localStorage.setItem('Last City', input.city.name);
    currentCity.textContent = input.city.name + ' ' + input.list[i].dt_txt.slice(0, -8);
    currentTemp.textContent = input.list[i].main.temp + ' F';
    currentWind.textContent = input.list[i].wind.speed + ' MPH';
    currentHumidity.textContent = input.list[i].main.humidity;
}


function processData(input) {
    console.log(input);
    console.log(input.city.name);
    console.log(input.list);
    fiveDay.innerHTML = '';

    for (i = 0; i < 6; i++) {
        if (i === 0) {
        renderCurrentDay (input);
        } else {
        generateFiveDay(input);
        }
    }
}

function getLocationByName(name) {
    console.log(name);
    var nameBreakdown = name.split(',', 3)
    console.log(nameBreakdown)

    if (nameBreakdown.length === 1) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                processData(data);
            })
    } else if (nameBreakdown.length === 2) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + ',' + nameBreakdown[1] + ',us&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                processData(data);
            })
    } else if (nameBreakdown.length === 3) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + ',' + nameBreakdown[1] + ',' + nameBreakdown[2] + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                processData(data);
            })
    } else {
        return;
    }
}


function getLocationByZip(zip) {
    console.log(zip);
    fetch('https://api.openweathermap.org/data/2.5/forecast?zip=' + zip + ',us&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            processData(data);
        })
}

function identifyLocationType(input) {
    console.log(input)
    var checker = Number(input);

    if (Number.isInteger(checker) && checker > 0) {
        getLocationByZip(input);
    } else if (Number.isInteger(checker) && checker <= 0) {
        return;
    } else {
        getLocationByName(input);
    }
}

function grabFormData(event) {
    event.preventDefault();
    identifyLocationType($(this).siblings('input').val());
}

function loadLS () {
    getLocationByName(localStorage.getItem('Last City'));
}

btn.on('click', grabFormData);
loadLS();