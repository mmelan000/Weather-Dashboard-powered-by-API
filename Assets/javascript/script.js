var btn = $('button')
var formContent = ''
var currentCity = document.querySelector('#city-name')
var currentTemp = document.querySelector('#current-temp')
var currentWind = document.querySelector('#current-wind')
var currentHumidity = document.querySelector('#current-humidity')
var currentUV = document.querySelector('#current-uv')
var histroy = document.querySelector('#history')
var i = 0
// http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8
// api.openweathermap.org/data/2.5/forecast?lat=51.5073219&lon=-0.1276474&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8





function renderCurrentDay (input) {
    currentCity.textContent = input.city.name + ' ' + input.list[i].dt_txt.slice(0, -8);
    currentTemp.textContent = 'Temp: ' + input.list[i].main.temp + ' F"';
    currentWind.textContent = 'Wind: ' + input.list[i].wind.speed + ' MPH';
    currentHumidity.textContent = 'Humidity: ' + input.list[i].main.humidity;
    currentUV.textContent = '---';
}


function processData(input) {
    console.log(input);
    console.log(input.city.name);
    console.log(input.list);

    for (i = 0; i < 6; i++) {
        if (i === 0) {
        renderCurrentDay (input);
        } else {
            console.log('Date: ' + input.list[(i * 8) - 1].dt_txt.slice(0, -8));
            console.log('Temp: ' + input.list[(i * 8) - 1].main.temp);
            console.log('Wind: ' + input.list[(i * 8) - 1].wind.speed);
            console.log('Humidity: ' + input.list[(i * 8) - 1].main.humidity);
            console.log('---');
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

btn.on('click', grabFormData);

