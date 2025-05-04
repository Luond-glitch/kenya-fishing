function loadUserData() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        
        // Display user info
        document.getElementById('usernameDisplay').textContent = currentUser.username;
        
        const userImage = document.getElementById('userProfileImage');
        if (currentUser.image) {
            userImage.src = currentUser.image;
        } else {
            userImage.src = 'https://via.placeholder.com/150?text=User';
        }
    } else {
        // No user logged in, redirect to login
        window.location.href = 'index.html';
    }
}

function loadWeatherData() {
    // In a real app, you would fetch this from a weather API
    // For demo purposes, we'll use mock data
    
    const locations = {
        "Mombasa": { temp: 28, conditions: "Sunny", icon: "☀️" },
        "Malindi": { temp: 29, conditions: "Partly Cloudy", icon: "⛅" },
        "Lamu": { temp: 30, conditions: "Sunny", icon: "☀️" },
        "Watamu": { temp: 27, conditions: "Partly Cloudy", icon: "⛅" },
        "Diani": { temp: 28, conditions: "Sunny", icon: "☀️" },
        "Lake Victoria": { temp: 24, conditions: "Cloudy", icon: "☁️" },
        "Lake Naivasha": { temp: 22, conditions: "Rainy", icon: "🌧️" }
    };
    
    // For demo, we'll pick a random location
    const locationNames = Object.keys(locations);
    const randomLocation = locationNames[Math.floor(Math.random() * locationNames.length)];
    const weather = locations[randomLocation];
    
    document.getElementById('currentLocation').textContent = randomLocation;
    document.getElementById('currentTemp').textContent = weather.temp;
    document.getElementById('weatherConditions').textContent = weather.conditions;
    document.getElementById('weatherIcon').textContent = weather.icon;
}

 // Login form submission
 loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const imageFile = document.getElementById('userImage').files[0];
    
    // Simple validation
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    // In a real app, you would validate credentials with a server
    // For this demo, we'll just store the user data
    currentUser = {
        username: username,
        image: imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/150?text=User'
    };
    
    // Save to localStorage for demo purposes
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});


// Dashboard Functions
function initDashboard() {
// Load user data
loadUserData();

// Setup logout button
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

// Load weather data
loadWeatherData();

}

function loadUserData() {
const storedUser = localStorage.getItem('currentUser');
if (storedUser) {
    currentUser = JSON.parse(storedUser);
    
    // Display user info
    document.getElementById('usernameDisplay').textContent = currentUser.username;
    
    const userImage = document.getElementById('userProfileImage');
    if (currentUser.image) {
        userImage.src = currentUser.image;
    } else {
        userImage.src = 'https://via.placeholder.com/150?text=User';
    }
} else {
    // No user logged in, redirect to login
    window.location.href = 'index.html';
}
}

function loadWeatherData() {
// In a real app, you would fetch this from a weather API
// For demo purposes, we'll use mock data

const locations = {
    "Mombasa": { temp: 28, conditions: "Sunny", icon: "☀️" },
    "Malindi": { temp: 29, conditions: "Partly Cloudy", icon: "⛅" },
    "Lamu": { temp: 30, conditions: "Sunny", icon: "☀️" },
    "Watamu": { temp: 27, conditions: "Partly Cloudy", icon: "⛅" },
    "Diani": { temp: 28, conditions: "Sunny", icon: "☀️" },
    "Lake Victoria": { temp: 24, conditions: "Cloudy", icon: "☁️" },
    "Lake Naivasha": { temp: 22, conditions: "Rainy", icon: "🌧️" }
};

// For demo, we'll pick a random location
const locationNames = Object.keys(locations);
const randomLocation = locationNames[Math.floor(Math.random() * locationNames.length)];
const weather = locations[randomLocation];

document.getElementById('currentLocation').textContent = randomLocation;
document.getElementById('currentTemp').textContent = weather.temp;
document.getElementById('weatherConditions').textContent = weather.conditions;
document.getElementById('weatherIcon').textContent = weather.icon;
}

// Fish Database Functions
function initFishDatabase() {
    // Load user data
    loadUserData();
    
    // Populate fish list
    populateFishList();
    
    // Setup search and filter
    document.getElementById('fishSearch').addEventListener('input', filterFish);
    document.getElementById('locationFilter').addEventListener('change', filterFish);
    }
    
    function populateFishList(filteredFish = null) {
    const fishListContainer = document.getElementById('fishList');
    fishListContainer.innerHTML = '';
    
    const fishToDisplay = filteredFish || fishData;
    }
    
    function filterFish() {
    const searchTerm = document.getElementById('fishSearch').value.toLowerCase();
    const locationFilter = document.getElementById('locationFilter').value;
    
    let filteredFish = fishData;
    
    // Apply search filter
    if (searchTerm) {
        filteredFish = filteredFish.filter(fish => 
            fish.name.toLowerCase().includes(searchTerm) || 
            fish.scientificName.toLowerCase().includes(searchTerm) ||
            fish.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply location filter
    if (locationFilter) {
        filteredFish = filteredFish.filter(fish => 
            fish.locations.includes(locationFilter)
        );
    }
    
    populateFishList(filteredFish);
    }

// Catch Log Functions
function initCatchLog() {
// Load user data
loadUserData();

// Setup logout button
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

// Populate fish species dropdown
populateFishSpecies();

// Set default date to today
document.getElementById('catchDate').valueAsDate = new Date();

// Setup image preview
const catchImageUpload = document.getElementById('catchImage');
const catchImagePreview = document.getElementById('catchImagePreview');
const catchPreviewImage = catchImagePreview.querySelector('.image-preview__image');
const catchPreviewDefaultText = catchImagePreview.querySelector('.image-preview__default-text');

catchImageUpload.addEventListener('change', function() {
    const file = this.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        catchPreviewDefaultText.style.display = "none";
        catchPreviewImage.style.display = "block";
        
        reader.addEventListener('load', function() {
            catchPreviewImage.setAttribute('src', this.result);
        });
        
        reader.readAsDataURL(file);
    } else {
        catchPreviewDefaultText.style.display = null;
        catchPreviewImage.style.display = null;
        catchPreviewImage.setAttribute('src', "");
    }
});

// Setup form submission
document.getElementById('catchLogForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitCatch();
});

// Load user's catch history
loadUserCatches();
}

function populateFishSpecies() {
const fishSpeciesSelect = document.getElementById('fishSpecies');

fishData.forEach(fish => {
    const option = document.createElement('option');
    option.value = fish.id;
    option.textContent = fish.name;
    fishSpeciesSelect.appendChild(option);
});
}

function submitCatch() {
const form = document.getElementById('catchLogForm');
const formData = {
    userId: 1, // In real app, use actual user ID
    fishId: parseInt(form.fishSpecies.value),
    date: form.catchDate.value,
    time: form.catchTime.value,
    location: form.catchLocation.value,
    weight: parseFloat(form.fishWeight.value) || null,
    length: parseFloat(form.fishLength.value) || null,
    notes: form.catchNotes.value,
    image: ''
};
}

// Handle image upload
const imageFile = form.catchImage.files[0];
if (imageFile) {
    // In a real app, you would upload this to a server
    // For demo, we'll just create a URL
    formData.image = URL.createObjectURL(imageFile);
} else {
    formData.image = 'https://via.placeholder.com/300x200?text=Catch';
}
function validateLogin() {
    // Simple validation example
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userImage = document.getElementById('userImage').value;
    
    if(username && password && userImage) {
      window.location.href = 'dashboard.html';
    } else {
      alert('Please enter both username and password');
    }
  }
  