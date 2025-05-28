document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const saveBtn = document.getElementById('saveBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const changePasswordBtn = document.getElementById('changePasswordBtn');
  const profilePicContainer = document.getElementById('profilePicContainer');
  const profilePic = document.getElementById('profilePic');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  // Form fields
  const nameInput = document.getElementById('nameInput');
  const professionHeaderInput = document.getElementById('professionHeaderInput');
  const bioInput = document.getElementById('bioInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const locationInput = document.getElementById('locationInput');
  const professionInput = document.getElementById('professionInput');
  const companyInput = document.getElementById('companyInput');
  const websiteInput = document.getElementById('websiteInput');

  // In a real application, you would fetch the current user data from your backend
  function fetchUserData() {
      // Simulating API call
      setTimeout(() => {
          // This data would come from your backend in a real app
          const userData = {
              name: "",
              profession: "",
              bio: "",
              email: "someone@example.com",
              phone: "+1 (555) 123-4567",
              location: "San Francisco, CA",
              company: "Tech Solutions Inc.",
              website: "https://sylvester.portfolio.com",
              profilePicture: "https://via.placeholder.com/150"
          };

          // Populate form fields
          nameInput.value = userData.name;
          professionHeaderInput.value = userData.profession;
          bioInput.value = userData.bio;
          emailInput.value = userData.email;
          phoneInput.value = userData.phone;
          locationInput.value = userData.location;
          professionInput.value = userData.profession;
          companyInput.value = userData.company;
          websiteInput.value = userData.website;
          profilePic.src = userData.profilePicture;
      }, 500);
  }

  // Initialize with user data
  fetchUserData();

  // Profile Picture Change Functionality
  profilePicContainer.addEventListener('click', function() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      
      fileInput.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file) {
              if (file.size > 2 * 1024 * 1024) { // 2MB limit
                  showError('Image size should be less than 2MB');
                  return;
              }
              
              const reader = new FileReader();
              reader.onload = function(event) {
                  profilePic.src = event.target.result;
              };
              reader.readAsDataURL(file);
          }
      });
      
      fileInput.click();
  });

  // Save Changes Functionality
  saveBtn.addEventListener('click', async function() {
      // Validate inputs
      if (!nameInput.value.trim()) {
          showError('Please enter your name');
          return;
      }

      if (!emailInput.value.trim()) {
          showError('Please enter your email');
          return;
      }

      // Simple email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
          showError('Please enter a valid email address');
          return;
      }

      // Prepare data to send to server
      const formData = new FormData();
      formData.append('name', nameInput.value.trim());
      formData.append('profession', professionInput.value.trim());
      formData.append('bio', bioInput.value.trim());
      formData.append('email', emailInput.value.trim());
      formData.append('phone', phoneInput.value.trim());
      formData.append('location', locationInput.value.trim());
      formData.append('company', companyInput.value.trim());
      formData.append('website', websiteInput.value.trim());

      // If a new profile picture was selected
      if (profilePic.src.startsWith('data:')) {
          formData.append('profile_picture', dataURLtoBlob(profilePic.src));
      }

      // Show loading state
      saveBtn.classList.add('loading');
      saveBtn.disabled = true;
      try {
          // In a real application, you would send this data to your backend
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Show success message
          showSuccess('Profile updated successfully!');
          
          // In a real app, you might redirect or refresh data here
      } catch (error) {
          showError('Failed to update profile. Please try again.');
          console.error('Update error:', error);
      } finally {
          saveBtn.classList.remove('loading');
          saveBtn.disabled = false;
      }
  });

  // Logout Functionality
  logoutBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to log out?')) {
          // In a real app, this would redirect to logout endpoint or clear session
          console.log('User logged out');
          // window.location.href = '/logout'; // Uncomment in real implementation
          showSuccess('You have been logged out successfully.');
          
          // Simulate redirect after logout
          setTimeout(() => {
              window.location.href = 'index.html';
          }, 1000);
      }
  });

  // Change Password Functionality
  changePasswordBtn.addEventListener('click', function() {
      // In a real app, this would open a change password modal or redirect
      console.log('Change password clicked');
      alert('Redirecting to password change page...');
      // window.location.href = '/change-password';
  });

  // Helper function to show error messages
  function showError(message) {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
      
      // Hide error after 5 seconds
      setTimeout(() => {
          errorMessage.style.display = 'none';
      }, 5000);
  }

  // Helper function to show success messages
  function showSuccess(message) {
      successMessage.textContent = message;
      successMessage.style.display = 'block';
      errorMessage.style.display = 'none';
      
      // Hide success after 5 seconds
      setTimeout(() => {
          successMessage.style.display = 'none';
      }, 5000);
  }

  // Helper function to convert data URL to Blob for upload
  function dataURLtoBlob(dataURL) {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      
      return new Blob([u8arr], { type: mime });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
          saveBtn.click();
      }
  });
});
