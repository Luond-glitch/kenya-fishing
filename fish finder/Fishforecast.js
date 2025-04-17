 // API configuration
        const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
        let currentLocation = 'auto';
        
        // DOM elements
        const locationSelect = document.getElementById('location-select');
        const currentWeatherEl = document.getElementById('current-weather');
        const timeDisplayEl = document.getElementById('time-display');
        const dateDisplayEl = document.getElementById('date-display');
        const forecastContainerEl = document.getElementById('forecast-container');
        
        // Fish types by conditions
        const FISH_TYPES = {
            sunny: ['Bass', 'Trout', 'Bluegill', 'Crappie'],
            cloudy: ['Walleye', 'Pike', 'Perch', 'Catfish'],
            rainy: ['Catfish', 'Carp', 'Sturgeon', 'Sucker'],
            windy: ['Mackerel', 'Tuna', 'Striped Bass', 'Bluefish'],
            stormy: ['No recommended fishing', 'Stay safe indoors'],
            cold: ['Steelhead', 'Salmon', 'Lake Trout', 'Burbot'],
            warm: ['Bass', 'Sunfish', 'Pike', 'Musky']
        };
        
        // Weather icon mapping
        const WEATHER_ICONS = {
            '01d': 'fas fa-sun',           // clear sky day
            '01n': 'fas fa-moon',         // clear sky night
            '02d': 'fas fa-cloud-sun',     // few clouds day
            '02n': 'fas fa-cloud-moon',    // few clouds night
            '03d': 'fas fa-cloud',        // scattered clouds
            '03n': 'fas fa-cloud',
            '04d': 'fas fa-cloud',         // broken clouds
            '04n': 'fas fa-cloud',
            '09d': 'fas fa-cloud-rain',  // shower rain
            '09n': 'fas fa-cloud-rain',
            '10d': 'fas fa-cloud-showers-heavy', // rain day
            '10n': 'fas fa-cloud-showers-heavy', // rain night
            '11d': 'fas fa-bolt',         // thunderstorm
            '11n': 'fas fa-bolt',
            '13d': 'fas fa-snowflake',    // snow
            '13n': 'fas fa-snowflake',
            '50d': 'fas fa-smog',         // mist
            '50n': 'fas fa-smog'
        };
        
        // Initialize the app
        function init() {
            updateTime();
            setInterval(updateTime, 1000);
            
            locationSelect.addEventListener('change', (e) => {
                currentLocation = e.target.value;
                fetchWeatherData();
            });
            
            fetchWeatherData();
        }
        
        // Update current time
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            const dateString = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            timeDisplayEl.textContent = timeString;
            dateDisplayEl.textContent = dateString;
        }
        
        // Fetch weather data based on location
        function fetchWeatherData() {
            if (currentLocation === 'auto') {
                // Try to get user's location automatically
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            getWeatherData(lat, lon);
                            getForecastData(lat, lon);
                        },
                        error => {
                            console.error('Error getting location:', error);
                            // Default to New York if auto-location fails
                            getWeatherData(40.7128, -74.0060);
                            getForecastData(40.7128, -74.0060);
                        }
                    );
                } else {
                    // Default to New York if geolocation not supported
                    getWeatherData(40.7128, -74.0060);
                    getForecastData(40.7128, -74.0060);
                }
            } else {
                // Use selected location
                const [lat, lon] = currentLocation.split(',');
                getWeatherData(lat, lon);
                getForecastData(lat, lon);
            }
        }
        
        // Get current weather data
        function getWeatherData(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displayCurrentWeather(data);
                })
                .catch(error => {
                    console.error('Error fetching weather data:', error);
                    currentWeatherEl.innerHTML = '<p>Failed to load weather data. Please try again later.</p>';
                });
        }
        
        // Get forecast data
        function getForecastData(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displayForecast(data);
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    forecastContainerEl.innerHTML = '<p>Failed to load forecast data. Please try again later.</p>';
                });
        }
        
        // Display current weather
        function displayCurrentWeather(data) {
            const weather = data.weather[0];
            const iconClass = WEATHER_ICONS[weather.icon] || 'fas fa-question';
            const temp = Math.round(data.main.temp);
            const feelsLike = Math.round(data.main.feels_like);
            const windSpeed = (data.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            
            currentWeatherEl.innerHTML = `
                <div class="current-weather">
                    <div class="weather-main">
                        <i class="${iconClass} weather-icon"></i>
                        <div>
                            <div class="temp">${temp}°C</div>
                            <div>${weather.description}</div>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <i class="fas fa-temperature-low"></i>
                            <span>Feels like: ${feelsLike}°C</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-wind"></i>
                            <span>Wind: ${windSpeed} km/h</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tint"></i>
                            <span>Humidity: ${humidity}%</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Pressure: ${pressure} hPa</span>
                        </div>
                    </div>
                </div>
                <div class="fishing-tip">
                    <strong>Fishing Tip:</strong> ${getFishingTip(weather.main, temp, windSpeed, data.clouds.all)}
                </div>
            `;
        }
        
        // Display forecast
        function displayForecast(data) {
            // Group forecast by day
            const dailyForecast = {};
            const today = new Date().toLocaleDateString();
            
            data.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const dateString = date.toLocaleDateString();
                
                // Skip today and only show future days
                if (dateString === today) return;
                
                if (!dailyForecast[dateString]) {
                    dailyForecast[dateString] = {
                        date: date,
                        items: []
                    };
                }
                
                dailyForecast[dateString].items.push(item);
            });
            
            // Generate forecast HTML
            let forecastHTML = '<div class="forecast-list">';
            
            Object.keys(dailyForecast).forEach(dateString => {
                const dayData = dailyForecast[dateString];
                const dayName = dayData.date.toLocaleDateString('en-US', { weekday: 'long' });
                const avgTemp = getAverage(dayData.items.map(item => item.main.temp));
                const avgWind = getAverage(dayData.items.map(item => item.wind.speed));
                const avgClouds = getAverage(dayData.items.map(item => item.clouds.all));
                const mainWeather = getMainWeather(dayData.items);
                const iconClass = WEATHER_ICONS[mainWeather.icon] || 'fas fa-question';
                
                // Determine fishing conditions
                const fishingScore = calculateFishingScore(
                    avgTemp, 
                    avgWind, 
                    avgClouds, 
                    dayData.items.some(item => item.weather[0].main === 'Rain')
                );
                
                let fishingRating, ratingClass;
                if (fishingScore >= 7) {
                    fishingRating = 'Excellent';
                    ratingClass = 'rating-good';
                } else if (fishingScore >= 4) {
                    fishingRating = 'Good';
                    ratingClass = 'rating-fair';
                } else {
                    fishingRating = 'Poor';
                    ratingClass = 'rating-poor';
                }
                
                // Get fish types for conditions
                const fishTypes = getFishTypesForConditions(mainWeather.main, avgTemp, avgWind);
                
                forecastHTML += `
                    <div class="forecast-day ${ratingClass.toLowerCase().replace('rating-', '')}">
                        <div class="day-header">
                            <div class="day-name">${dayName}</div>
                            <div class="fishing-rating ${ratingClass}">${fishingRating}</div>
                        </div>
                        <div class="day-weather">
                            <i class="${iconClass} day-icon"></i>
                            <div>
                                <div>${mainWeather.description}</div>
                                <div>Avg: ${Math.round(avgTemp)}°C, Wind: ${(avgWind * 3.6).toFixed(1)} km/h</div>
                            </div>
                        </div>
                        <div class="fish-types">
                            ${fishTypes.map(fish => `<span>${fish}</span>`).join('')}
                        </div>
                    </div>
                `;
            });
            
            forecastHTML += '</div>';
            forecastContainerEl.innerHTML = forecastHTML;
        }
        
        // Helper function to calculate average
        function getAverage(values) {
            return values.reduce((a, b) => a + b, 0) / values.length;
        }
        
        // Helper function to determine main weather for the day
        function getMainWeather(items) {
            const weatherCounts = {};
            
            items.forEach(item => {
                const weather = item.weather[0].main;
                weatherCounts[weather] = (weatherCounts[weather] || 0) + 1;
            });
            
            let mainWeather = '';
            let maxCount = 0;
            
            for (const weather in weatherCounts) {
                if (weatherCounts[weather] > maxCount) {
                    mainWeather = weather;
                    maxCount = weatherCounts[weather];
                }
            }
            
            // Find the first item with the main weather to get details
            const sampleItem = items.find(item => item.weather[0].main === mainWeather);
            return sampleItem.weather[0];
        }
        
        // Calculate fishing score (0-10)
        function calculateFishingScore(temp, wind, clouds, hasRain) {
            let score = 5; // Base score
            
            // Temperature adjustment (optimal around 15-25°C)
            if (temp >= 15 && temp <= 25) score += 2;
            else if (temp >= 10 && temp <= 30) score += 1;
            else if (temp < 5 || temp > 35) score -= 2;
            
            // Wind adjustment (calm to moderate is best)
            if (wind < 3) score += 1; // Calm
            else if (wind > 8) score -= 2; // Very windy
            else if (wind > 5) score -= 1; // Windy
            
            // Cloud cover adjustment (overcast can be good)
            if (clouds > 70) score += 1; // Overcast
            else if (clouds < 30) score -= 1; // Clear skies
            
            // Rain adjustment (light rain can be good)
            if (hasRain) score += 1;
            
            // Ensure score is within bounds
            return Math.min(10, Math.max(0, score));
        }
        
        // Get fish types for given conditions
        function getFishTypesForConditions(weather, temp, wind) {
            let fish = [];
            
            // Add fish based on weather
            if (weather === 'Clear') {
                fish = fish.concat(FISH_TYPES.sunny);
            } else if (weather === 'Clouds') {
                fish = fish.concat(FISH_TYPES.cloudy);
            } else if (weather === 'Rain') {
                fish = fish.concat(FISH_TYPES.rainy);
            } else if (weather === 'Thunderstorm') {
                fish = fish.concat(FISH_TYPES.stormy);
            }
            
            // Add fish based on temperature
            if (temp < 10) {
                fish = fish.concat(FISH_TYPES.cold);
            } else if (temp > 25) {
                fish = fish.concat(FISH_TYPES.warm);
            }
            
            // Add fish based on wind
            if (wind > 5) {
                fish = fish.concat(FISH_TYPES.windy);
            }
            
            // Remove duplicates
            fish = [...new Set(fish)];
            
            // Limit to 4 types
            return fish.slice(0, 4);
        }
        
        // Get fishing tip for current conditions
        function getFishingTip(weather, temp, wind, clouds) {
            const score = calculateFishingScore(temp, wind/3.6, clouds, weather === 'Rain');
            
            if (score >= 8) {
                return "Perfect fishing conditions! Fish are likely to be very active. Try using a variety of lures.";
            } else if (score >= 6) {
                return "Good fishing conditions. Fish should be active. Focus on areas with cover or structure.";
            } else if (score >= 4) {
                return "Fair fishing conditions. Fish may be less active. Try slower presentations and deeper water.";
            } else {
                return "Poor fishing conditions. Fish will likely be inactive. Consider waiting for better weather or fishing very deep/slow.";
            }
        }
        
        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
   