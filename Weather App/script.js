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
                    .then(async weatherData => {
                        const hour = await getTime(lat, lon);
                        getCityImg(city, hour);
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


async function getTime(lat, lon) {
    const key = "ZV34K5I7NFBD";
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Time Zone Data:", data);
        let fullDateTime = data.formatted;

        let timeDisplay = document.getElementById("Hour");
        let timeParts = fullDateTime.split(' ')[1].split(':');
        let hours = parseInt(timeParts[0]);
        let minutes = timeParts[1];
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let formattedTime = `${hours}:${minutes} ${ampm}`;
        timeDisplay.textContent = `Time: ${formattedTime}`;
        let hour = fullDateTime.split(' ')[1].split(':')[0];
        
        let hourInt = parseInt(hour);
        console.log(hourInt);
        return hourInt;
    } catch (error) {
        console.error("Time Zone API Error:", error);
        errorMes.innerHTML = `Time Zone API Error: ${error}`;
        setTimeout(() => {
            errorMes.innerHTML = "";
        }, 3000);
        return 12; 
    }
}



function displayGeoData(data){
    let cityName = data[0].name;
    let country = data[0].country;
    
    
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



function getCityImg(city, hour) {
    const accessKey = "hn70d1OomPjMpzig1_sGhy94zTDyBHSOhXkbW-sCuko";

    let timeOfDay = "";
    //sunrise : 5
    //Day:  6 -> 17
    //night: 19-> 23 && 0 -> 5
    //sunset : 18

    if (hour >= 19 || hour <= 5) {
        timeOfDay = "night";
    }
    else if(hour === 5 ){
        timeOfDay = "sunrise";
    }
    else if(hour === 18 ){
        timeOfDay = "sunset";
    }

     else {
        timeOfDay = "day";
    }

    let timeH = document.getElementById("Time");
    timeH.textContent = `Time: ${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}`;
    
    const query = `${city} at ${timeOfDay}`;

    console.log(query);
    const url = `https://api.unsplash.com/search/photos?query=${query}&orientation=landscape&per_page=1`;
    
    fetch(url, {
        headers: {
            Authorization: `Client-ID ${accessKey}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Unsplash API response:", data);
        if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            if (mainDiv) {
                mainDiv.style.backgroundImage = `url(${imageUrl})`;
                mainDiv.style.backgroundSize = "cover";
                mainDiv.style.backgroundPosition = "center";
            }
        } else {
            console.log("No images found for this city");
        }
    })
    .catch(error => {
        console.error("Unsplash API Error:", error);
        errorMes.innerHTML = `Image API Error: ${error.message}`;
        setTimeout(() => {
            errorMes.innerHTML = "";
        }, 3000);
    });
}