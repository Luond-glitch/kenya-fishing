// Function to load user's catch history
function loadUserCatches() {
    const catchesContainer = document.getElementById('userCatches');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Get logged-in user
    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];

    if (currentUser && catchData.length > 0) {
        const userCatches = catchData.filter(c => c.userId === currentUser.id);

        if (userCatches.length > 0) {
            catchesContainer.innerHTML = '';

            userCatches.forEach(catchItem => {
                const fish = fishData.find(f => f.id === catchItem.fishId);

                const catchElement = document.createElement('div');
                catchElement.className = 'catch-item';
                catchElement.innerHTML = `
                    <img src="${catchItem.image}" alt="Catch" class="catch-item-image">
                    <div class="catch-item-info">
                        <h4>${fish ? fish.name : 'Unknown Fish'}</h4>
                        <p>${catchItem.location} • ${catchItem.date}</p>
                        <p>${catchItem.notes}</p>
                    </div>
                    <div class="catch-item-meta">
                        <div class="weight">${catchItem.weight ?? '—'} kg</div>
                        <div class="length">${catchItem.length ?? '—'} cm</div>
                        <div class="date">${catchItem.time}</div>
                    </div>
                `;

                catchesContainer.appendChild(catchElement);
            });
        } else {
            catchesContainer.innerHTML = '<p>No catches found yet. Log your first catch!</p>';
        }
    } else {
        catchesContainer.innerHTML = '<p>No catches found yet. Log your first catch!</p>';
    }
}
// Submit a new catch
function submitCatch() {
    const form = document.getElementById('catchLogForm');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('You must be logged in to submit a catch.');
        return;
    }

    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];

    const formData = {
        id: catchData.length > 0 ? Math.max(...catchData.map(c => c.id)) + 1 : 1,
        userId: currentUser.id,
        fishId: parseInt(form.fishSpecies.value),
        date: form.catchDate.value,
        time: form.catchTime.value,
        location: form.catchLocation.value,
        weight: parseFloat(form.fishWeight.value) || null,
        length: parseFloat(form.fishLength.value) || null,
        notes: form.catchNotes.value,
        image: ''
    };

    const imageFile = form.catchImage.files[0];
    if (imageFile) {
        formData.image = URL.createObjectURL(imageFile);
    } else {
        formData.image = 'https://via.placeholder.com/300x200?text=Catch';
    }

    catchData.push(formData);
    localStorage.setItem('catchData', JSON.stringify(catchData));

    loadUserCatches();
    form.reset();

    // Reset image preview
    const previewImg = document.querySelector('.image-preview__image');
    const previewText = document.querySelector('.image-preview__default-text');
    if (previewImg && previewText) {
        previewImg.style.display = 'none';
        previewText.style.display = 'block';
    }

    alert('Catch logged successfully!');
}
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the appropriate page
    if (document.getElementById('loginForm')) {
        initLoginPage();
    } else if (document.getElementById('weatherIcon')) {
        initDashboard();
    } else if (document.getElementById('fishList')) {
        initFishDatabase();
    } else if (document.getElementById('catchLogForm')) {
        initCatchLog();
    }
    
});

    
    // Image preview functionality
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            previewDefaultText.style.display = "none";
            previewImage.style.display = "block";
            
            reader.addEventListener('load', function() {
                previewImage.setAttribute('src', this.result);
            });
            
            reader.readAsDataURL(file);
        } else {
            previewDefaultText.style.display = null;
            previewImage.style.display = null;
            previewImage.setAttribute('src', "");
        }
    }); 
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    ;
    
// Dashboard Functions
function initDashboard() {
    // Load user data
    loadUserData();
    // Load weather data
    loadWeatherData();
    
    // Load recent catches
    loadRecentCatches();
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

// Load recent catches
loadRecentCatches();
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

function loadRecentCatches() {
const catchesContainer = document.getElementById('recentCatches');
if (currentUser && catchData.length > 0) {
    const userCatches = catchData.filter(catchItem => catchItem.userId === 1); // Replace 1 with currentUser.id if needed
  
    if (userCatches.length > 0) {
      catchesContainer.innerHTML = '';
  
      userCatches.slice(0, 3).forEach(userCatch => {
        const fish = fishData.find(f => f.id === userCatch.fishId);
  
        const catchElement = document.createElement('div');
        catchElement.className = 'catch-item';
        catchElement.innerHTML = `
          <div class="catch-item-info">
            <img src="${userCatch.image}" alt="Catch" class="catch-item-image" />
            <h4>${fish?.fish?.name ?? 'Unknown Fish'}</h4>
            <p>${userCatch.location} - ${userCatch.date}</p>
          </div>
          <div class="catch-item-meta">
            <div class="weight">${userCatch.weight} kg</div>
            <div class="date">${userCatch.time}</div>
          </div>
       `;
  
        catchesContainer.appendChild(catchElement);
      });
    }
  
}
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
  