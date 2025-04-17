// DOM Elements
const cameraBtn = document.getElementById('camera-btn');
const cameraFeed = document.getElementById('camera-feed');
const captureBtn = document.getElementById('capture-btn');
const fishUpload = document.getElementById('fish-upload');
const analysisResults = document.getElementById('analysis-results');

// Camera functionality
cameraBtn.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        cameraFeed.srcObject = stream;
        cameraFeed.style.display = 'block';
        cameraBtn.style.display = 'none';
        captureBtn.style.display = 'block';
        fishUpload.style.display = 'none';
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please check permissions.');
    }
});

// Capture photo
captureBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);
    
    // Stop camera stream
    cameraFeed.srcObject.getTracks().forEach(track => track.stop());
    
    // Convert to blob and analyze
    canvas.toBlob(blob => {
        analyzeFish(blob);
    }, 'image/jpeg');
    
    // Reset UI
    cameraFeed.style.display = 'none';
    captureBtn.style.display = 'none';
    cameraBtn.style.display = 'block';
    fishUpload.style.display = 'block';
});

// File upload analysis
fishUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        analyzeFish(file);
    }
});

// Analyze fish function
async function analyzeFish(imageFile) {
    analysisResults.innerHTML = `
        <div class="loading">
            <p>Analyzing fish...</p>
            <div class="spinner"></div>
        </div>
    `;
    
    try {
        // In a real app, you would send this to your backend/ML API
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await fetch('/api/analyze-fish', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Display results
        displayAnalysisResults(result);
    } catch (error) {
        console.error('Analysis error:', error);
        analysisResults.innerHTML = `
            <div class="error">
                <p>Error analyzing fish. Please try again.</p>
            </div>
        `;
    }
}

// Display analysis results
function displayAnalysisResults(data) {
    analysisResults.innerHTML = `
        <h3>Analysis Results</h3>
        <div class="fish-info">
            <div class="fish-image">
                <img src="${URL.createObjectURL(data.image)}" alt="Analyzed fish">
            </div>
            <div class="fish-details">
                <h4>${data.species || 'Unknown Species'}</h4>
                <p><strong>Scientific Name:</strong> ${data.scientificName || 'Unknown'}</p>
                <p><strong>Confidence:</strong> ${data.confidence ? `${(data.confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                <p><strong>Habitat:</strong> ${data.habitat || 'Unknown'}</p>
                <p><strong>Diet:</strong> ${data.diet || 'Unknown'}</p>
                <p><strong>Size:</strong> ${data.size || 'Unknown'}</p>
                <p><strong>Conservation Status:</strong> ${data.conservationStatus || 'Unknown'}</p>
            </div>
        </div>
        <div class="additional-info">
            <h4>Interesting Facts</h4>
            <p>${data.facts || 'No additional information available.'}</p>
        </div>
    `;
}