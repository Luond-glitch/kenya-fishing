document.querySelector('a[href="catchlog.html"]').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link
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
  
    if (!isFisher || !location || !hasLicense) {
      alert("Please fill in all the fields to access catchlog!");
      return;
    }
  
    if (hasLicense === "yes") {
      if (licenseNumber === "") {
        alert("Please enter your fishing license number.");
        return;
      } else {
        alert("Congratulations dear Fisher! Feel free to enter your today's catches.");
        window.location.href = "catchlog.html";
      }
    } else {
      alert("Sorry, you need a valid fishing license number to access the catch log.");
    }
  });
  