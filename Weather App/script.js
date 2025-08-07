document.getElementById("form").addEventListener("submit" , function (event){
    event.preventDefault();
    getWeather();
});

document.getElementById("city").addEventListener("click", function(event){
    event.preventDefault();
    getWeather();
});

let errorMes = document.getElementById("error");
function getWeather(){    
    let city = document.getElementById("inp").value;
    const API = "a0d580f8b6249b82297a2b8b5021f5b2";
    
    if (!city || city.trim() === "") {
        errorMes.innerHTML = "Please enter a valid city name!";
        setTimeout(() => {
            errorMes.innerHTML = "";
        }, 3000);
        return;
    }
    
    console.log("Searching for city:", city);
    
    let geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}`;
    
    fetch(geoURL)
        .then(response => response.json())
        .then(geoData => {
            console.log(geoData);
            if(geoData.length > 0) {
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
                    .then(response => response.json())
                    .then(weatherData => {
                        getCityImg(city);
                        displayGeoData(geoData);
                        displayWeather(weatherData);
                    })
                    .catch(error => {
                        console.error("Weather API Error:", error);
                        errorMes.innerHTML = `API Error: ${error.message}`;
                        setTimeout(() => {
                            errorMes.innerHTML = "";
                            }, 3000);
                    });
            } else {
                console.log("City not found! Try a different spelling or city name.");
                
                errorMes.innerHTML = "City not found! Please check the spelling and try again.";
                setTimeout(() => {
                errorMes.innerHTML = "";
                }, 3000);
            }
        })
        .catch(error => {
            console.error("Geo API Error:", error);

                errorMes.innerHTML = `API Error: ${error.message}`;
                setTimeout(() => {
                errorMes.innerHTML = "";
                }, 3000);
            });
        }

const mainDiv = document.querySelector('.main');

function displayGeoData(data){
    let cityName = data[0].name;
    let country = data[0].country;
    let lat = data[0].lat;
    let lon = data[0].lon;
    
    
    let title = document.getElementById("city-name");
    title.textContent = `${cityName}, ${country}`;
   
    /*
    title.style.textAlign = "center";
    title.style.width = "100%";
    title.style.marginTop = "20px";
    title.style.fontSize = "2em";
    title.style.color = "#fff";
    title.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
    */
    let geo = document.getElementById("geo");
    geo.textContent = `Latitude: ${lat} , Longitude: ${lon}`
    
    /*
    geo.style.textAlign = "center";
    geo.style.width = "100%";
    geo.style.fontSize = "0.75em";
    geo.style.marginTop = "5px";
    geo.style.marginBottom = "20px";
    geo.style.color = "#fff";
    geo.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.7)";
    */



}

function displayWeather(data) {
    let Temperature = document.getElementById("Temperature");

    let Description = document.getElementById("Description");
    let FeelsLike = document.getElementById("FeelsLike");
    let Humidity = document.getElementById("Humidity");

    Temperature.textContent = data.main.temp + "°C";
    Description.textContent = data.weather[0].description;
    FeelsLike.textContent = "Feels like: " + data.main.feels_like + "°C";
    Humidity.textContent = "Humidity: " + data.main.humidity + "%";
}

function getCityImg(city){
    const api = "b06B3Ed1hzsFNT0N7na6B2ngZX5s7sFVu9w3LtkxZFRIZnuNcQAwZo5b";

    const url = `https://api.pexels.com/v1/search?query=${city}&per_page=1&orientation=landscape`;
    
    fetch(url, {
        headers: {
            Authorization: api
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.photos && data.photos.length > 0) {
            const imageUrl = data.photos[0].src.large;
            if (mainDiv) {
                mainDiv.style.backgroundImage = `url(${imageUrl})`;
                mainDiv.style.backgroundSize = "cover";
                mainDiv.style.backgroundPosition = "center";
            }
        } else {
            console.log("No images found for this city");
        }
    })
    .catch(error => console.error("Pexels API Error:", error));
}