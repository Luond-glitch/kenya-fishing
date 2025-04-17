// Catch Log Modal Logic
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
    const licenseNumber = this.licenseNumber.value;

    if (isFisher && location && hasLicense && (hasLicense === "yes" || licenseNumber)) {
      alert("Congratulation dear Fisher! feel free to enter your today's catches")
        // All good – redirect to actual catch log
      window.location.href = "catchlog.html";
    } else {
      alert("Please fill in all the fields correctly to access catchlog!");
    }
  });

