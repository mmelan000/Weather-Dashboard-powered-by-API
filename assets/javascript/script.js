var iterative = 0;
var btn = $('#form-button');
var clearBtn = $('#clear-history');
var historySection = $('#history');
var currentCity = document.querySelector('#city-name');
var currentTemp = document.querySelector('#current-temp');
var currentIcon = document.querySelector('#current-icon')
var currentWind = document.querySelector('#current-wind');
var currentHumidity = document.querySelector('#current-humidity');
var currentUV = document.querySelector('#current-uv');
var fiveDay = document.querySelector('#fiveday');
var formInput = document.querySelector('#form-input');
var formContent = '';
var UV = '';
// creates a history button with and id that matches the city id
function generateHistoryBtn(input) {
    var createHistoryBtn = document.createElement('button');

    createHistoryBtn.textContent = input.city.name;
    createHistoryBtn.classList.add('history-btn');
    createHistoryBtn.id = input.city.id;

    historySection.append(createHistoryBtn);
    formInput.value = '';
}
// runs log for 24 hour intervals, pulls out data, generates and appends card to page
function generateFiveDay(input) {
    var createCard = document.createElement('div');
    var createCardDate = document.createElement('h3');
    var createCardTemp = document.createElement('p');
    var createCardWind = document.createElement('p');
    var createCardHumidity = document.createElement('p');
    var createCardIMG = document.createElement('img');

    createCardIMG.src = 'http://openweathermap.org/img/w/' + input.list[(iterative * 8) - 1].weather[0].icon + '.png';
    createCardHumidity.textContent = 'Humidity: ' + input.list[(iterative * 8) - 1].main.humidity + '%';
    createCardWind.textContent = 'Wind: ' + input.list[(iterative * 8) - 1].wind.speed + ' MPH';
    createCardTemp.textContent = 'Temp: ' + input.list[(iterative * 8) - 1].main.temp + ' F';
    createCardDate.textContent = input.list[(iterative * 8) - 1].dt_txt.slice(0, -8);

    createCard.appendChild(createCardDate);
    createCard.appendChild(createCardIMG)
    createCard.appendChild(createCardTemp);
    createCard.appendChild(createCardWind);
    createCard.appendChild(createCardHumidity);
    fiveDay.appendChild(createCard);
}
// pulls out required data, sends to doc, evaluates uv index
function renderCurrentDay(input) {
    var lat = input.city.coord.lat;
    var lon = input.city.coord.lon;
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,daily,alerts&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            UV = data.current.uvi;
            currentUV.textContent = UV;
            currentUV.removeAttribute('class');
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
    currentIcon.src = 'http://openweathermap.org/img/w/' + input.list[iterative].weather[0].icon + '.png'
    currentCity.textContent = input.city.name + ' ' + input.list[iterative].dt_txt.slice(0, -8);
    currentTemp.textContent = input.list[iterative].main.temp + ' F';
    currentWind.textContent = input.list[iterative].wind.speed + ' MPH';
    currentHumidity.textContent = input.list[iterative].main.humidity + '%';
}
// empties 5day, sends data off to currentDay, then starts for loop to render 5day
function processData(input) {
    fiveDay.innerHTML = '';
    for (iterative = 0; iterative < 6; iterative++) {
        if (iterative === 0) {
            renderCurrentDay(input);
        } else {
            generateFiveDay(input);
        }
    }
}
// fetch method for history buttons (Global)
function getLocationByCityID(event) {
    event.preventDefault();
    var cityID = event.target.id;

    fetch('https://api.openweathermap.org/data/2.5/forecast?id=' + cityID + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            processData(data);
        })
}
// fetch method for City name
function getLocationByName(name) {
    var nameBreakdown = name.split(',', 3)

    if (nameBreakdown.length === 1) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                generateHistoryBtn(data);
                processData(data);
            })
    } else if (nameBreakdown.length === 2) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + ',' + nameBreakdown[1] + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.message === 'city not found') {
                    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + ',' + nameBreakdown[1] + ',us&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
                        .then(function (newresponse) {
                            return newresponse.json();
                        })
                        .then(function (newdata) {
                            generateHistoryBtn(newdata);
                            processData(newdata);
                        })
                } else {
                    generateHistoryBtn(data);
                    processData(data);
                }})
    } else if (nameBreakdown.length === 3) {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + nameBreakdown[0] + ',' + nameBreakdown[1] + ',' + nameBreakdown[2] + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                generateHistoryBtn(data);
                processData(data);
            })
    } else {
        return;
    }
}
// fetch method for zip (US only)
function getLocationByZip(zip) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?zip=' + zip + ',us&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + data.city.coord.lat + '&lon=' + data.city.coord.lon + '&appid=d37f3dc5ec1d208f1cd2ae723d8bebc8&units=imperial')
                .then(function (newresponse) {
                    return newresponse.json();
                })
                .then(function (newdata) {
                    generateHistoryBtn(newdata);
                    processData(newdata);
                })
        })
}
// identifies format and seds it to proper fetch method
function identifyLocationType(input) {
    var checker = Number(input);

    if (Number.isInteger(checker) && checker > 0) {
        getLocationByZip(input);
    } else if (Number.isInteger(checker) && checker <= 0) {
        return;
    } else {
        getLocationByName(input);
    }
}
// takes form data and sends it to be identified
function grabFormData(event) {
    event.preventDefault();
    identifyLocationType(formInput.value);
}
// clears buttons and localstorage
function clearHistoryButtons(event) {
    event.preventDefault();
    localStorage.clear();
    historySection.empty();
}
// loads last last city viewed on return to page
function loadLS() {
    if (localStorage.getItem('Last City') !== null) {
        getLocationByName(localStorage.getItem('Last City'));
    }
}

btn.on('click', grabFormData);
historySection.on('click', getLocationByCityID);
clearBtn.on('click', clearHistoryButtons);
loadLS();