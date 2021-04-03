// Credentials
const API_URL = `https://api.openweathermap.org/data/2.5/weather`;
const API_KEY = `82d3d3fed715fa0f7c32c5846448c731`;

// Search Term
const searchTerm = document.querySelector('.search-term');
searchTerm.addEventListener('keypress', listenForEnter);

// Invalid City
const errEl = document.querySelector('.err');

function listenForEnter(event) {
  errEl.style.display = 'none';
  // when enter is pressed, fetch weather of that city
  if (event.keyCode === 13) {
    getWeather(searchTerm.value);
  }
}

// Gets the weather data
function getWeather(searchVal) {
  fetch(`${API_URL}?q=${searchVal}&units=metric&appid=${API_KEY}`)
    .then((fetchedData) => {
      return fetchedData.json();
    })
    .then(renderWeatherData)
    .catch((e) => (errEl.style.display = 'block'));

  searchTerm.value = '';
}

// Renders/Paints the weather data onto the screen
function renderWeatherData(fetchedData) {
  let cityName = document.querySelector('.city .name');
  cityName.textContent = `${fetchedData.name}, ${fetchedData.sys.country}`;

  let date = new Date();
  let dateEl = document.querySelector('.city .date');
  dateEl.textContent = getDate(date);

  let temperature = document.querySelector('.temperature .celcius');
  let temp = Math.round(fetchedData.main.temp);
  temperature.innerHTML = `${temp}<span>°c</span>`;

  let descEl = document.querySelector('.temperature .description');
  descEl.innerHTML = `${fetchedData.weather[0].main} <br><span class="feels">Feels like ${fetchedData.main.feels_like}°c</span>`;

  let iconEl = document.querySelector('.temperature .icon img');
  iconEl.src = `icons/${fetchedData.weather[0].icon}.png`;

  let minMaxEl = document.querySelector('.temperature .min-max');
  let min = Math.round(fetchedData.main.temp_min);
  let max = Math.round(fetchedData.main.temp_max);
  minMaxEl.textContent = `Min ${min}°c / Max ${max}°c`;

  let wind = document.querySelector('.others .wind');
  wind.textContent = `Wind ${fetchedData.wind.speed} m/s`;
  let humidity = document.querySelector('.others .humidity');
  humidity.textContent = `Humidity ${fetchedData.main.humidity}%`;
  let pressure = document.querySelector('.others .pressure');
  pressure.textContent = `Pressure ${fetchedData.main.pressure} hPa`;
}

// returns formatted date string
function getDate(now) {
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let day = days[now.getDay()];
  let date = now.getDate();
  let month = months[now.getMonth()];
  let year = now.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
}

// gets current weather data according to user's location
function init(lat, lng) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric
  `)
    .then(function (response) {
      return response.json();
    })
    .then(renderWeatherData);
}

// asks user access to their location
function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

// call init with coords if user clicks allow
function handleGeoSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  init(latitude, longitude);
}

function handleGeoError(e) {
  console.log(e);
}

askForCoords();
