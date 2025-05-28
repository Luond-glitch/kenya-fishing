 // DOM Elements
 const userIcon = document.getElementById('userIcon');
 const dropdownMenu = document.getElementById('dropdownMenu');
 const loginBtn = document.getElementById('loginBtn');
 const createAccountBtn = document.getElementById('createAccountBtn');
 const logoutBtn = document.getElementById('logoutBtn');
 const loginModal = document.getElementById('loginModal');
 const registerModal = document.getElementById('registerModal');
 const closeLogin = document.getElementById('closeLogin');
 const closeRegister = document.getElementById('closeRegister');
 const showRegister = document.getElementById('showRegister');
 const showLogin = document.getElementById('showLogin');
 const loginForm = document.getElementById('loginForm');
 const registerForm = document.getElementById('registerForm');
 const menuBtn = document.getElementById('menuBtn');
 const mobileNav = document.getElementById('mobileNav');
 const closeMobileNav = document.getElementById('closeMobileNav');

 // Mobile Menu Toggle
 menuBtn.addEventListener('click', function() {
   mobileNav.classList.add('active');
 });

 closeMobileNav.addEventListener('click', function() {
   mobileNav.classList.remove('active');
 });

 // Close mobile menu when clicking on a link
 const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
 mobileLinks.forEach(link => {
   link.addEventListener('click', function() {
     mobileNav.classList.remove('active');
   });
 });

 // Toggle dropdown menu
 userIcon.addEventListener('click', function(e) {
   e.stopPropagation();
   dropdownMenu.classList.toggle('show');
 });

 // Show login modal
 loginBtn.addEventListener('click', function(e) {
   e.preventDefault();
   dropdownMenu.classList.remove('show');
   loginModal.style.display = 'flex';
   mobileNav.classList.remove('active');
 });

 // Show register modal
 createAccountBtn.addEventListener('click', function(e) {
   e.preventDefault();
   dropdownMenu.classList.remove('show');
   registerModal.style.display = 'flex';
   mobileNav.classList.remove('active');
 });

 // Close modals
 closeLogin.addEventListener('click', function() {
   loginModal.style.display = 'none';
 });

 closeRegister.addEventListener('click', function() {
   registerModal.style.display = 'none';
 });

 // Switch between login and register forms
 showRegister.addEventListener('click', function(e) {
   e.preventDefault();
   loginModal.style.display = 'none';
   registerModal.style.display = 'flex';
 });

 showLogin.addEventListener('click', function(e) {
   e.preventDefault();
   registerModal.style.display = 'none';
   loginModal.style.display = 'flex';
 });

 // Close dropdown when clicking outside
 document.addEventListener('click', function(e) {
   if (!dropdownMenu.contains(e.target) && e.target !== userIcon) {
     dropdownMenu.classList.remove('show');
   }
 });

 // Close modal when clicking outside content
 window.addEventListener('click', function(e) {
   if (e.target === loginModal) {
     loginModal.style.display = 'none';
   }
   if (e.target === registerModal) {
     registerModal.style.display = 'none';
   }
   if (e.target === mobileNav) {
     mobileNav.classList.remove('active');
   }
 });

 // Form submissions (placeholder - would connect to backend in real app)
 loginForm.addEventListener('submit', function(e) {
   e.preventDefault();
   //alert('Login functionality would be implemented here');
   loginModal.style.display = 'none';
 });

 registerForm.addEventListener('submit', function(e) {
   e.preventDefault();
   //alert('Registration functionality would be implemented here');
   registerModal.style.display = 'none';
 });

 // Forgot password button
 document.getElementById('forgotPasswordBtn').addEventListener('click', function() {
   //alert('Password reset functionality would be implemented here');
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
       }, 1500);
   }
 });

 // Add some interactive elements
 const ctaBtn = document.querySelector('.cta-btn');
 ctaBtn.addEventListener('mouseenter', function() {
   this.style.background = 'linear-gradient(45deg, #64ffda, #4fc3f7)';
 });
 ctaBtn.addEventListener('mouseleave', function() {
   this.style.background = 'linear-gradient(45deg, #4fc3f7, #64ffda)';
 });

 // Feature cards animation
 const featureCards = document.querySelectorAll('.feature-card');
 featureCards.forEach(card => {
   card.addEventListener('mouseenter', function() {
     this.querySelector('.feature-icon').style.transform = 'rotate(10deg) scale(1.1)';
   });
   card.addEventListener('mouseleave', function() {
     this.querySelector('.feature-icon').style.transform = 'rotate(0) scale(1)';
   });
 });
 // Check login status from localStorage on page load
 let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

 // Handle login form submission
 document.getElementById("loginForm").addEventListener("submit", function (e) {
   e.preventDefault();
   
   // Simulate login success (replace with actual validation if needed)
   isLoggedIn = true;
   localStorage.setItem("isLoggedIn", "true");
   alert("Login successful!");
   document.getElementById("loginModal").style.display = "none";
 });

 // Handle logout button
 document.getElementById("logoutBtn").addEventListener("click", function (e) {
   e.preventDefault();
   isLoggedIn = false;
   localStorage.setItem("isLoggedIn", "false");
   alert("You have been logged out.");
 });

 // Handle Get Started button
 document.querySelector(".cta-btn").addEventListener("click", function (e) {
   if (!isLoggedIn) {
     e.preventDefault(); // Prevent navigation
     alert("Please log in first to continue.");
     document.getElementById("loginModal").style.display = "flex";
   }
 });

 // Modal close
 document.getElementById("closeLogin").addEventListener("click", function () {
   document.getElementById("loginModal").style.display = "none";
 });
  /* Add to your existing JavaScript */
document.addEventListener('DOMContentLoaded', function() {
// Add password toggle functionality
const passwordInputs = document.querySelectorAll('input[type="password"]');
passwordInputs.forEach(input => {
  const toggle = document.createElement('span');
  toggle.className = 'password-toggle';
  toggle.innerHTML = '<i class="far fa-eye"></i>';
  input.parentNode.appendChild(toggle);
  
  toggle.addEventListener('click', function() {
    if (input.type === 'password') {
      input.type = 'text';
      toggle.innerHTML = '<i class="far fa-eye-slash"></i>';
    } else {
      input.type = 'password';
      toggle.innerHTML = '<i class="far fa-eye"></i>';
    }
  });
});
});
document.addEventListener('DOMContentLoaded', function() {
// Create ripple effects on click
document.body.addEventListener('click', function(e) {
 if (e.target.classList.contains('cta-btn') || 
     e.target.closest('.feature-card') || 
     e.target.classList.contains('welcome-text')) {
   const ripple = document.createElement('span');
   ripple.classList.add('ripple');
   document.body.appendChild(ripple);
   
   const x = e.pageX;
   const y = e.pageY;
   
   ripple.style.left = x + 'px';
   ripple.style.top = y + 'px';
   
   setTimeout(() => {
     ripple.remove();
   }, 6000);
 }
});
});
document.addEventListener("DOMContentLoaded", () => {
document.getElementById("year").textContent = new Date().getFullYear();
});
