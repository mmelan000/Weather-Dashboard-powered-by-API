# Weather Dashboard

An application that will utilize the One Call API to display weather information for the searched city.

**User Story**
```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

**Acceptance Criteria**
```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

---

## Authors

- [@Michael Melanson](https://github.com/mmelan000)

---

## Screenshots

![App Screenshot](./assets/images/wdapp1.jpg)

![App Screenshot](./assets/images/wdapp2.jpg)

---

## Optimizations

- Supports multiple search types:
    - City Name (Global)
    - City and State (US Only)
    - City, State, and Country (Global)
    - Zip Code (US Only)
- Mobile friendly.
- History Tab for cycling easily through past searches.
- Color coded UV index using intuitive colors to represent severity.

---

## Deployment

https://mmelan000.github.io/Challenge-06-Server-Side-APIs-Weather-Dashboard/

---
