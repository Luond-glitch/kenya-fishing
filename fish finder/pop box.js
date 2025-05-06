document.querySelector('a[href="catchlog.html"]').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('catchLogModal').style.display = 'flex';
});

document.getElementById('closeModal').onclick = function () {
  document.getElementById('catchLogModal').style.display = 'none';
};

document.getElementById('hasLicense').addEventListener('change', function () {
  const licenseField = document.getElementById('licenseNumberLabel');
  licenseField.style.display = this.value === 'yes' ? 'block' : 'none';
});

document.getElementById('verificationForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const isFisher = this.fisher.value;
  const location = this.location.value;
  const hasLicense = this.license.value;
  const licenseNumber = this.licenseNumber.value.trim();
  const password = this.password.value;

  if (!isFisher || !location || !hasLicense || !password) {
    alert("Please fill in all the fields to access catchlog!");
    return;
  }

  if (hasLicense === "yes") {
    if (licenseNumber === "") {
      alert("Please enter your fishing license number.");
      return;
    }

    // Check if password is already set for this license
    const storedData = JSON.parse(localStorage.getItem("licensePasswords")) || {};

    if (storedData[licenseNumber]) {
      if (storedData[licenseNumber] === password) {
        // Correct password
        alert("Welcome back! You're verified. Feel free to enter your today's catches.");
        window.location.href = "catchlog.html";
      } else {
        alert("Incorrect password for this license number. Access denied.");
      }
    } else {
      // Store new license-password pair
      storedData[licenseNumber] = password;
      localStorage.setItem("licensePasswords", JSON.stringify(storedData));
      alert("Password set and verified! You can now enter your today's catches.");
      window.location.href = "catchlog.html";
    }
  } else {
    alert("Sorry, you need a valid fishing license number to access the catch log.");
  }

});

// show the licence box
document.getElementById('hasLicense').addEventListener('change', function() {
  const licenseLabel = document.getElementById('licenseNumberLabel');
  
  if(this.value === 'yes') {
      // First remove display:none
      licenseLabel.style.display = 'block';
      // Force reflow to enable animation
      void licenseLabel.offsetWidth;
      // Add visible class to trigger animation
      licenseLabel.classList.add('visible');
  } else {
      // Remove visible class to trigger fade out
      licenseLabel.classList.remove('visible');
      // After animation completes, set display:none
      setTimeout(() => {
          licenseLabel.style.display = 'none';
      }, 300); // Match transition duration
  }
});

// password Reset

document.getElementById('forgotPasswordLink').addEventListener('click', function (e) {
  e.preventDefault();

  const licenseNumber = prompt("Enter your fishing license number:");
  if (!licenseNumber) {
    alert("License number is required to reset password.");
    return;
  }

  const storedData = JSON.parse(localStorage.getItem("licensePasswords")) || {};
  const contactData = JSON.parse(localStorage.getItem("licenseContacts")) || {}; // stores user emails or phone numbers

  if (!storedData[licenseNumber]) {
    alert("License number not found.");
    return;
  }

  const method = prompt("Send reset code via:\n1. Gmail\n2. Phone number\n\nEnter '1' or '2'");
  let contact;
  if (method === "1") {
    contact = prompt("Enter your Gmail address:");
    if (!contact || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      alert("Invalid Gmail address.");
      return;
    }
  } else if (method === "2") {
    contact = prompt("Enter your phone number:");
    if (!contact || !/^\d{10,15}$/.test(contact)) {
      alert("Invalid phone number.");
      return;
    }
  } else {
    alert("Invalid option.");
    return;
  }

  // Simulate sending a reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  localStorage.setItem("resetCode_" + licenseNumber, resetCode);
  contactData[licenseNumber] = contact;
  localStorage.setItem("licenseContacts", JSON.stringify(contactData));

  alert("A reset code has been sent to: " + contact + "\n(For simulation: your code is " + resetCode + ")");

  const enteredCode = prompt("Enter the reset code you received:");
  if (enteredCode !== resetCode) {
    alert("Incorrect reset code.");
    return;
  }

  const newPassword = prompt("Enter a new password (min 4 chars):");
  if (!newPassword || newPassword.length < 4 || !/\d/.test(newPassword)) {
    alert("Invalid password. Must be at least 6 characters and include a number.");
    return;
  }

  const confirmPassword = prompt("Confirm your new password:");
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  storedData[licenseNumber] = newPassword;
  localStorage.setItem("licensePasswords", JSON.stringify(storedData));
  alert("Password successfully reset!");
});
