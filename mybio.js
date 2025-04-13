document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileForm = document.getElementById('profile-form');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const nameInput = document.getElementById('name');
    const bioInput = document.getElementById('bio');
    const bioCounter = document.getElementById('bio-counter');
    const saveBtn = document.getElementById('save-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const logoutModal = document.getElementById('logout-modal');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');
    const closeModal = document.querySelector('.close');
  
    // Load current user data
    loadUserProfile();
  
    // Image upload handler
    imageUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          imagePreview.style.backgroundImage = `url(${event.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Bio character counter
    bioInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      bioCounter.textContent = currentLength;
      
      if (currentLength > 250) {
        this.value = this.value.substring(0, 250);
        bioCounter.textContent = 250;
      }
    });
  
    // Form submission
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProfile();
    });
  
    // Logout button click
    logoutBtn.addEventListener('click', function() {
      logoutModal.style.display = 'block';
    });
  
    // Modal close handlers
    closeModal.addEventListener('click', function() {
      logoutModal.style.display = 'none';
    });
  
    cancelLogout.addEventListener('click', function() {
      logoutModal.style.display = 'none';
    });
  
    confirmLogout.addEventListener('click', function() {
      performLogout();
    });
  
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target === logoutModal) {
        logoutModal.style.display = 'none';
      }
    });
  
    // Functions
    function loadUserProfile() {
      // In a real app, you will fetch this from your backend
      const userData = {
        name: '',
        bio: '',
        profileImage: 'default-profile.jpg'
      };
  
      nameInput.value = userData.name;
      bioInput.value = userData.bio;
      bioCounter.textContent = userData.bio.length;
      imagePreview.style.backgroundImage = `url(${userData.profileImage})`;
    }
  
    function saveProfile() {
      const formData = new FormData();
      const imageFile = imageUpload.files[0];
      
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }
      
      formData.append('name', nameInput.value);
      formData.append('bio', bioInput.value);
  
      // Show loading state
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
  
      // In a real app, you would send this to your backend
      // Example using fetch API:
      fetch('/api/profile/update', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Handle success
        showToast('Profile updated successfully!');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
        showToast('Error updating profile. Please try again.', 'error');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
      });
    }
  
    function performLogout() {
      // In a real app, you would call your logout API
      fetch('/api/auth/logout', {
        method: 'POST'
      })
      .then(response => {
        if (response.ok) {
          // Redirect to login page
          window.location.href = '/login';
        }
      })
      .catch(error => {
        console.error('Logout error:', error);
        showToast('Logout failed. Please try again.', 'error');
      });
    }
  
    function showToast(message, type = 'success') {
      // Implement your toast notification system here
      alert(message); // Simple fallback
    }
  });