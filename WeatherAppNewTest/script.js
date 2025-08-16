const loadingDiv = document.getElementById("loading");

const citySearchCounts = {};
const imageSearch = {};

function showLoading() {
  loadingDiv.classList.add("visible");
}

function hideLoading() {
  loadingDiv.classList.remove("visible");
}

let errorMes = document.getElementById("error");
function showError(message){
  console.log("Showing error:", message);

  if (errorMes.hideTimeout) {
    clearTimeout(errorMes.hideTimeout);
  }
  
  errorMes.innerHTML = message;
  errorMes.textContent = message;
  
  errorMes.style.display = "block";
  errorMes.style.visibility = "visible";
  errorMes.style.opacity = "1";
  
  errorMes.classList.add("show");
  
  errorMes.hideTimeout = setTimeout(() => {
    errorMes.classList.remove("show");
    errorMes.style.display = "none";
    errorMes.textContent = "";
  }, 4000);
}

const searchOverlay = document.getElementById("search-overlay");
const searchToggle = document.getElementById("search-toggle");
const searchClose = document.getElementById("search-close");
const footer = document.querySelector("footer");
let hasSearched = false;

function showSearchOverlay() {
  searchOverlay.classList.remove("hidden");
  searchToggle.classList.add("hidden");
  footer.classList.remove("visible");
  
  if (hasSearched) {
    searchClose.classList.add("visible");
  } else {
    searchClose.classList.remove("visible");
  }
  
  document.getElementById("inp").value = "";
}

function hideSearchOverlay() {
  searchOverlay.classList.add("hidden");
  searchToggle.classList.remove("hidden");
  footer.classList.add("visible");
  searchClose.classList.remove("visible");
  hasSearched = true;
}

searchToggle.addEventListener("click", function() {
  showSearchOverlay();
  document.getElementById("inp").focus();
});

searchClose.addEventListener("click", function() {
  hideSearchOverlay();
});

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  getWeather();
});

document.getElementById("search-btn").addEventListener("click", function (event) {
  event.preventDefault();
  getWeather();
});


function getWeather() {
  let city = document.getElementById("inp").value;
  const API = "a0d580f8b6249b82297a2b8b5021f5b2";

  if (!city || city.trim() === "") {
    showError("Please enter a valid city name!");
    return;
  }
  const cityKey = city.toLowerCase();

  console.log("Searching for city:", city);
  clearWeatherData();
  showLoading();
  mainDiv.classList.remove("visible");

  setTimeout(() => {
    let geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}`;

    fetch(geoURL)
      .then((response) => response.json())
      .then((geoData) => {
        console.log(geoData);
        if (geoData.length > 0) {
          let lat = geoData[0].lat;
          let lon = geoData[0].lon;
          let cityName = geoData[0].name;
          let country = geoData[0].country;

          console.log("Latitude:", lat);
          console.log("Longitude:", lon);
          console.log("City:", cityName);
          console.log("Country:", country);

          let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`;

          fetch(weatherURL)
            .then((response) => response.json())
            .then(async (weatherData) => {
              if (!citySearchCounts[cityKey]) citySearchCounts[cityKey] = 0;
              citySearchCounts[cityKey]++;

              console.log("City Search Count:", citySearchCounts[cityKey]);
              const { hour, formattedTime } = await getTime(lat, lon);

              let timeOfDay = "";
              if (hour >= 19 || hour <= 5) {
                timeOfDay = "night";
              } else if (hour === 5) {
                timeOfDay = "sunrise";
              } else if (hour === 18) {
                timeOfDay = "sunset";
              } else {
                timeOfDay = "day";
              }

              await getCityImg(
                cityName,
                timeOfDay,
                citySearchCounts[cityKey]
              );
              displayGeoData(geoData);
              displayWeather(weatherData);

              let timeH = document.getElementById("Time");
              timeH.textContent = `${
                timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)
              }`;

              let timeDisplay = document.getElementById("Hour");
              timeDisplay.textContent = `Time: ${formattedTime}`;
              mainDiv.classList.add("visible");
              hideLoading();
              hideSearchOverlay();
            })
            .catch((error) => {
              console.error("Weather API Error:", error);
              showError(`API Error: ${error.message}`);
              console.error("Error fetching weather data:", error);
              hideLoading();
            });
        } else {
          showError("City not found! Please check the spelling and try again.");
          hideLoading();
        }
      })
      .catch((error) => {
        console.error("Geo API Error:", error);
        showError(`API Error: ${error.message}`);
        hideLoading();
      });
  }, 1000);
}

const mainDiv = document.querySelector(".main");

async function getTime(lat, lon) {
  const key = "ZV34K5I7NFBD";
  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lon}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Time Zone Data:", data);
    let fullDateTime = data.formatted;

    let timeParts = fullDateTime.split(" ")[1].split(":");
    let hours = parseInt(timeParts[0]);
    let minutes = timeParts[1];
    let ampm = hours >= 12 ? "PM" : "AM";
    let displayHour = hours % 12 || 12;
    let formattedTime = `${displayHour}:${minutes} ${ampm}`;

    let hourInt = parseInt(timeParts[0]);
    return { hour: hourInt, formattedTime };
  } catch (error) {
    console.error("Time Zone API Error:", error);
    showError(`Time Zone API Error: ${error.message}`);
    return { hour: 12, formattedTime: "12:00 PM" };
  }
}

function displayGeoData(data) {
  let cityName = data[0].name;
  let country = data[0].country;
  let title = document.getElementById("city-name");
  title.textContent = `${cityName}, ${country}`;
}

function getWeatherIcon(iconCode) {
  const url = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  console.log("getWeatherIcon called with iconCode:", iconCode, "URL:", url);
  return url;
}

function displayWeather(data) {
  let Temperature = document.getElementById("Temperature");
  let Description = document.getElementById("Description");
  let FeelsLike = document.getElementById("FeelsLike");
  let Humidity = document.getElementById("Humidity");
  let Icon = document.getElementById("Icon");

  Temperature.textContent = data.main.temp + "°C";
  Description.textContent = data.weather[0].description;
  FeelsLike.textContent = "Feels like: " + data.main.feels_like + "°C";
  Humidity.textContent = "Humidity: " + data.main.humidity + "%";
  if (Icon && data.weather[0].icon) {
    const iconCode = data.weather[0].icon;
    const iconUrl = getWeatherIcon(iconCode);
    console.log("Setting Icon.src to:", iconUrl);
    Icon.src = iconUrl;
    Icon.alt = data.weather[0].description;
    Icon.style.display = "inline-block";
    Icon.style.width = "80px";
    Icon.style.height = "80px";
  } else {
    console.log(
      "Icon element or icon code missing",
      Icon,
      data.weather[0].icon
    );
  }
}

function getCityImg(city, timeOfDay, count = 1) {
  const accessKey = "hn70d1OomPjMpzig1_sGhy94zTDyBHSOhXkbW-sCuko";
  const query = `${city} at ${timeOfDay}`;
  const cacheKey = `${city.toLowerCase()}_${timeOfDay}`;

  console.log("getCityImg called with:", { city, timeOfDay, count, query });

  if (imageSearch[cacheKey]) {
    const images = imageSearch[cacheKey];
    const index = (count - 1) % images.length;
    console.log("Using cached image:", images[index]);
    setMainDivBackground(images[index]);
    return Promise.resolve();
  }

  console.log("Fetching new images from Unsplash API...");
  const url = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=3`;
  return fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Unsplash API response:", data);
      if (data.results && data.results.length > 0) {
        const images = data.results.slice(0, 3).map((img) => img.urls.regular);
        imageSearch[cacheKey] = images;
        const index = (count - 1) % images.length;
        console.log("Setting background to:", images[index]);
        setMainDivBackground(images[index]);
      } else {
        console.log("No images found for this city");
      }
    })
    .catch((error) => {
      console.error("Unsplash API Error:", error);
      showError(`Image API Error: ${error.message}`);
    });
}

function setMainDivBackground(imageUrl) {
  console.log("Setting background image:", imageUrl);
  if (mainDiv) {
    mainDiv.style.backgroundImage = `url(${imageUrl})`;
    mainDiv.style.backgroundSize = "cover";
    mainDiv.style.backgroundPosition = "center";
    mainDiv.style.backgroundRepeat = "no-repeat";
    console.log("Background image applied to main div");
  } else {
    console.error("mainDiv not found");
  }
}

function clearWeatherData() {
  document.getElementById("city-name").textContent = "";
  document.getElementById("Temperature").textContent = "";
  document.getElementById("Description").textContent = "";
  document.getElementById("FeelsLike").textContent = "";
  document.getElementById("Humidity").textContent = "";
  document.getElementById("Hour").textContent = "";

  document.getElementById("Icon").src = "";
  document.getElementById("Icon").alt = "";
  document.getElementById("Icon").style.display = "none";

  document.getElementById("Time").textContent = "";
  mainDiv.style.backgroundImage = "";
}
