// DOM Elements
const storyModal = document.getElementById('story-modal');
const shareStoryBtn = document.getElementById('share-story-btn');
const analyzeFishBtn = document.getElementById('analyze-fish-btn');
const closeModal = document.querySelector('.close');
const storyForm = document.getElementById('story-form');
const imagePreview = document.getElementById('image-preview');
const dropZone = document.getElementById('drop-zone');
const storiesGrid = document.getElementById('stories-grid');

// Open story modal
shareStoryBtn.addEventListener('click', () => {
    storyModal.style.display = 'block';
});

// Close modal
closeModal.addEventListener('click', () => {
    storyModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === storyModal) {
        storyModal.style.display = 'none';
    }
});

// Handle image preview
document.getElementById('story-images').addEventListener('change', function(e) {
    const files = e.target.files;
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
});

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    document.getElementById('story-images').files = files;
    
    // Trigger change event
    const event = new Event('change');
    document.getElementById('story-images').dispatchEvent(event);
});

// Form submission
storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('story-title').value);
    formData.append('content', document.getElementById('story-content').value);
    formData.append('location', document.getElementById('story-location').value);
    
    const imageFiles = document.getElementById('story-images').files;
    for (let i = 0; i < imageFiles.length; i++) {
        formData.append('images', imageFiles[i]);
    }
    
    try {
        // In a real app, you would send this to your backend
        const response = await fetch('/api/stories', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Story published successfully!');
            storyModal.style.display = 'none';
            storyForm.reset();
            imagePreview.innerHTML = '';
            loadStories();
        } else {
            throw new Error('Failed to publish story');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error publishing story. Please try again.');
    }
});

// Load stories
async function loadStories() {
    try {
        // In a real app, you would fetch from your backend
        const response = await fetch('/api/stories');
        const stories = await response.json();
        
        storiesGrid.innerHTML = '';
        
        stories.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            
            storyCard.innerHTML = `
                <img src="${story.images[0] || 'placeholder.jpg'}" alt="${story.title}" class="story-image">
                <div class="story-content">
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-location">${story.location || 'Unknown location'}</p>
                    <p class="story-excerpt">${story.content.substring(0, 150)}...</p>
                    <a href="/stories/${story.id}" class="btn primary">Read More</a>
                </div>
            `;
            
            storiesGrid.appendChild(storyCard);
        });
    } catch (error) {
        console.error('Error loading stories:', error);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadStories();
});