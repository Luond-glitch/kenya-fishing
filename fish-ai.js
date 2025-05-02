document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const storyModal = document.getElementById('story-modal');
    const shareStoryBtn = document.getElementById('share-story-btn');
    const closeModal = document.querySelector('.close');
    const storyForm = document.getElementById('story-form');
    const imagePreview = document.getElementById('image-preview');
    const dropZone = document.getElementById('drop-zone');
    const storiesGrid = document.getElementById('stories-grid');
    const analyzeFishInput = document.getElementById('fish-upload');
    const analysisResults = document.getElementById('analysis-results');

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

    // Image preview
    document.getElementById('story-images').addEventListener('change', function (e) {
        const files = e.target.files;
        imagePreview.innerHTML = '';

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Drag-and-drop
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

        const event = new Event('change');
        document.getElementById('story-images').dispatchEvent(event);
    });

    // Submit story
    // Submit story
storyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('story-title').value;
    const content = document.getElementById('story-content').value;
    const location = document.getElementById('story-location').value;
    const imageFiles = document.getElementById('story-images').files;

    const storyCard = document.createElement('div');
    storyCard.className = 'story-card';

    let imgTag = '';
    if (imageFiles.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
            imgTag = `<img src="${event.target.result}" alt="${title}" class="story-image">`;
            storyCard.innerHTML = `
                ${imgTag}
                <div class="story-content">
                    <h3 class="story-title">${title}</h3>
                    <p class="story-location">${location || 'Unknown location'}</p>
                    <p class="story-excerpt">${content.substring(0, 150)}...</p>
                    <a href="#" class="btn primary">Read More</a>
                </div>
            `;
            storiesGrid.prepend(storyCard);
        };
        reader.readAsDataURL(imageFiles[0]);
    } else {
        storyCard.innerHTML = `
            <div class="story-content">
                <h3 class="story-title">${title}</h3>
                <p class="story-location">${location || 'Unknown location'}</p>
                <p class="story-excerpt">${content.substring(0, 150)}...</p>
                <a href="#" class="btn primary">Read More</a>
            </div>
        `;
        storiesGrid.prepend(storyCard);
    }

    alert('Story published successfully!');
    storyModal.style.display = 'none';
    storyForm.reset();
    imagePreview.innerHTML = '';

    // Refresh search after adding a story
    filterStories();
});

// Analyze Fish Upload
analyzeFishInput.addEventListener('change', () => {
    const files = analyzeFishInput.files;
    analysisResults.innerHTML = '';

    if (files.length === 0) {
        analysisResults.innerHTML = '<p>No image uploaded</p>';
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '200px';
            img.style.marginBottom = '10px';

            const meta = document.createElement('div');
            meta.innerHTML = `
                <p><strong>Name:</strong> ${file.name}</p>
                <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                <p><strong>Type:</strong> ${file.type}</p>
            `;

            const wrapper = document.createElement('div');
            wrapper.appendChild(img);
            wrapper.appendChild(meta);

            analysisResults.appendChild(wrapper);
        };

        reader.readAsDataURL(file);
    }
});

// Search functionality
const searchInput = document.getElementById('story-search');
const searchBtn = document.getElementById('search-btn');
const noResultsMsg = document.createElement('p');

noResultsMsg.textContent = 'No matching stories found.';
noResultsMsg.style.textAlign = 'center';
noResultsMsg.style.color = '#666';
noResultsMsg.style.marginTop = '1rem';
noResultsMsg.style.display = 'none';
storiesGrid.parentNode.insertBefore(noResultsMsg, storiesGrid.nextSibling);

function filterStories() {
    const query = searchInput.value.toLowerCase().trim();
    const stories = storiesGrid.getElementsByClassName('story-card');

    let anyVisible = false;

    Array.from(stories).forEach(story => {
        const title = story.querySelector('.story-title')?.textContent.toLowerCase() || '';
        const location = story.querySelector('.story-location')?.textContent.toLowerCase() || '';
        const excerpt = story.querySelector('.story-excerpt')?.textContent.toLowerCase() || '';

        if (title.includes(query) || location.includes(query) || excerpt.includes(query)) {
            story.style.display = 'block';
            anyVisible = true;
        } else {
            story.style.display = 'none';
        }
    });

    noResultsMsg.style.display = anyVisible ? 'none' : 'block';
}

searchBtn.addEventListener('click', filterStories);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterStories();
});
});