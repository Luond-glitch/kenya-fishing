// Load user profile image and name (optional enhancement)
window.addEventListener('DOMContentLoaded', () => {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Guest mode
        currentUser = { id: 'guest', username: 'Guest', profileImage: '' };
    }

    document.getElementById('usernameDisplay').textContent = currentUser.username || 'User';
    document.getElementById('userProfileImage').src =
        currentUser.profileImage || 'https://via.placeholder.com/40?text=User';

    loadUserCatches(currentUser);
});

// Handle image preview
document.getElementById('catchImage').addEventListener('change', function () {
    const previewImage = document.querySelector('.image-preview__image');
    const previewText = document.querySelector('.image-preview__default-text');
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        previewText.style.display = 'none';
        previewImage.style.display = 'block';

        reader.addEventListener('load', function () {
            previewImage.setAttribute('src', this.result);
        });

        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
        previewText.style.display = 'block';
    }
});

// Submit catch
document.getElementById('catchLogForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        currentUser = { id: 'guest', username: 'Guest' };
    }

    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];
    const form = event.target;

    const file = form.catchImage.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const newCatch = {
            id: catchData.length > 0 ? Math.max(...catchData.map(c => c.id)) + 1 : 1,
            userId: currentUser.id,
            date: form.catchDate.value,
            time: form.catchTime.value,
            fishName: form.fishSpecies.value.trim(),
            location: form.catchLocation.value,
            weight: parseFloat(form.fishWeight.value) || null,
            length: parseFloat(form.fishLength.value) || null,
            notes: form.catchNotes.value.trim(),
            image: reader.result || 'https://via.placeholder.com/80x60?text=Catch'
        };

        catchData.push(newCatch);
        localStorage.setItem('catchData', JSON.stringify(catchData));

        loadUserCatches(currentUser);
        form.reset();

        // Reset preview
        const previewImage = document.querySelector('.image-preview__image');
        const previewText = document.querySelector('.image-preview__default-text');
        previewImage.style.display = 'none';
        previewText.style.display = 'block';

        alert('Catch logged successfully!');
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onloadend(); // use placeholder if no file selected
    }
});

// Load and display user's catch history
function loadUserCatches(currentUser = null) {
    const catchesContainer = document.getElementById('userCatches');
    catchesContainer.innerHTML = '';

    currentUser = currentUser || JSON.parse(localStorage.getItem('currentUser')) || { id: 'guest' };
    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];

    const userCatches = catchData.filter(c => c.userId === currentUser.id);

    if (userCatches.length === 0) {
        catchesContainer.innerHTML = `
            <tr><td colspan="8" style="text-align: center;">No catches found yet. Log your first catch!</td></tr>
        `;
        return;
    }

    userCatches.forEach(catchItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${catchItem.date}</td>
            <td>${catchItem.time}</td>
            <td>${catchItem.fishName}</td>
            <td>${catchItem.location}</td>
            <td>${catchItem.weight ?? '—'}</td>
            <td>${catchItem.length ?? '—'}</td>
            <td><img src="${catchItem.image}" alt="Catch" style="width: 80px; height: auto; border-radius: 6px;"></td>
            <td>${catchItem.notes || '—'}</td>
        `;
        catchesContainer.appendChild(row);
    });
}

// Load user profile image and name (optional enhancement)
/*window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('usernameDisplay').textContent = currentUser.username || 'User';
        if (currentUser.profileImage) {
            document.getElementById('userProfileImage').src = currentUser.profileImage;
        } else {
            document.getElementById('userProfileImage').src = 'https://via.placeholder.com/40?text=User';
        }
    }
    loadUserCatches();
});

// Handle image preview
document.getElementById('catchImage').addEventListener('change', function () {
    const previewImage = document.querySelector('.image-preview__image');
    const previewText = document.querySelector('.image-preview__default-text');
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        previewText.style.display = 'none';
        previewImage.style.display = 'block';

        reader.addEventListener('load', function () {
            previewImage.setAttribute('src', this.result);
        });

        reader.readAsDataURL(file);
    } else {
        previewImage.style.display = 'none';
        previewText.style.display = 'block';
    }
});

// Submit catch
document.getElementById('catchLogForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('You must be logged in to log a catch.');
        return;
    }

    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];
    const form = event.target;

    const file = form.catchImage.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const newCatch = {
            id: catchData.length > 0 ? Math.max(...catchData.map(c => c.id)) + 1 : 1,
            userId: currentUser.id,
            date: form.catchDate.value,
            time: form.catchTime.value,
            fishName: form.fishSpecies.value.trim(),
            location: form.catchLocation.value,
            weight: parseFloat(form.fishWeight.value) || null,
            length: parseFloat(form.fishLength.value) || null,
            notes: form.catchNotes.value.trim(),
            image: reader.result || 'https://via.placeholder.com/80x60?text=Catch'
        };

        catchData.push(newCatch);
        localStorage.setItem('catchData', JSON.stringify(catchData));

        loadUserCatches();
        form.reset();

        // Reset preview
        const previewImage = document.querySelector('.image-preview__image');
        const previewText = document.querySelector('.image-preview__default-text');
        previewImage.style.display = 'none';
        previewText.style.display = 'block';

        alert('Catch logged successfully!');
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onloadend(); // use placeholder if no file selected
    }
});

// Load and display user's catch history
function loadUserCatches() {
    const catchesContainer = document.getElementById('userCatches');
    catchesContainer.innerHTML = '';

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const catchData = JSON.parse(localStorage.getItem('catchData')) || [];

    if (!currentUser || catchData.length === 0) {
        catchesContainer.innerHTML = `
            <tr><td colspan="8" style="text-align: center;">No catches found yet. Log your first catch!</td></tr>
        `;
        return;
    }

    const userCatches = catchData.filter(c => c.userId === currentUser.id);
    if (userCatches.length === 0) {
        catchesContainer.innerHTML = `
            <tr><td colspan="8" style="text-align: center;">No catches found yet. Log your first catch!</td></tr>
        `;
        return;
    }

    userCatches.forEach(catchItem => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${catchItem.date}</td>
            <td>${catchItem.time}</td>
            <td>${catchItem.fishName}</td>
            <td>${catchItem.location}</td>
            <td>${catchItem.weight ?? '—'}</td>
            <td>${catchItem.length ?? '—'}</td>
            <td><img src="${catchItem.image}" alt="Catch" style="width: 80px; height: auto; border-radius: 6px;"></td>
            <td>${catchItem.notes || '—'}</td>
        `;
        catchesContainer.appendChild(row);
    });
}
*/