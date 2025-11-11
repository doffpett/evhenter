/**
 * Authentication Page JavaScript
 * Handles login and registration forms
 */

(function() {
  'use strict';

  // DOM Elements
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const alertSuccess = document.getElementById('alert-success');
  const alertError = document.getElementById('alert-error');

  // Password requirements elements
  const passwordInput = document.getElementById('register-password');
  const reqLength = document.getElementById('req-length');
  const reqLowercase = document.getElementById('req-lowercase');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqNumber = document.getElementById('req-number');

  /**
   * Initialize the page
   */
  function init() {
    console.log('🔐 Initializing auth page...');

    // Check if already logged in
    const token = localStorage.getItem('evhenter_token');
    if (token) {
      // Redirect to events page if already logged in
      window.location.href = '/events.html';
      return;
    }

    // Set up tab switching
    loginTab.addEventListener('click', () => switchTab('login'));
    registerTab.addEventListener('click', () => switchTab('register'));

    // Set up form submissions
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Password validation on input
    passwordInput.addEventListener('input', validatePasswordStrength);

    console.log('✅ Auth page initialized');
  }

  /**
   * Switch between login and register tabs
   */
  function switchTab(tab) {
    // Update tab styles
    const tabs = document.querySelectorAll('.auth-tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
      loginTab.classList.add('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
    } else {
      registerTab.classList.add('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
    }

    // Clear alerts
    hideAlerts();
  }

  /**
   * Handle login form submission
   */
  async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = document.getElementById('login-submit');

    // Clear previous errors
    hideAlerts();
    clearFormErrors('login');

    // Validate
    if (!email || !password) {
      showError('Vennligst fyll ut alle feltene');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Logger inn';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Innlogging feilet');
      }

      // Store token in localStorage
      localStorage.setItem('evhenter_token', data.data.token);
      localStorage.setItem('evhenter_user', JSON.stringify(data.data.user));

      // Show success message
      showSuccess('Innlogget! Omdirigerer...');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/events.html';
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      showError(error.message);
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Logg inn';
    }
  }

  /**
   * Handle register form submission
   */
  async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const submitBtn = document.getElementById('register-submit');

    // Clear previous errors
    hideAlerts();
    clearFormErrors('register');

    // Validate
    if (!email || !password) {
      showError('E-post og passord er påkrevd');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('Ugyldig e-postformat');
      return;
    }

    // Validate password strength
    const passwordValidation = checkPasswordStrength(password);
    if (!passwordValidation.valid) {
      showError('Passordet oppfyller ikke kravene');
      return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Oppretter konto';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name: name || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registrering feilet');
      }

      // Store token in localStorage
      localStorage.setItem('evhenter_token', data.data.token);
      localStorage.setItem('evhenter_user', JSON.stringify(data.data.user));

      // Show success message
      showSuccess('Konto opprettet! Omdirigerer...');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/events.html';
      }, 1000);

    } catch (error) {
      console.error('Register error:', error);
      showError(error.message);
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Opprett konto';
    }
  }

  /**
   * Validate password strength and update UI
   */
  function validatePasswordStrength() {
    const password = passwordInput.value;

    // Check each requirement
    const hasLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Update UI
    updateRequirement(reqLength, hasLength);
    updateRequirement(reqLowercase, hasLowercase);
    updateRequirement(reqUppercase, hasUppercase);
    updateRequirement(reqNumber, hasNumber);
  }

  /**
   * Update requirement indicator
   */
  function updateRequirement(element, isValid) {
    element.classList.remove('valid', 'invalid');
    element.classList.add(isValid ? 'valid' : 'invalid');
  }

  /**
   * Check password strength programmatically
   */
  function checkPasswordStrength(password) {
    const errors = [];

    if (password.length < 8) errors.push('Passord må være minst 8 tegn');
    if (!/[a-z]/.test(password)) errors.push('Passord må inneholde små bokstaver');
    if (!/[A-Z]/.test(password)) errors.push('Passord må inneholde store bokstaver');
    if (!/[0-9]/.test(password)) errors.push('Passord må inneholde tall');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Show success alert
   */
  function showSuccess(message) {
    alertSuccess.textContent = message;
    alertSuccess.classList.add('show');
    alertError.classList.remove('show');
  }

  /**
   * Show error alert
   */
  function showError(message) {
    alertError.textContent = message;
    alertError.classList.add('show');
    alertSuccess.classList.remove('show');
  }

  /**
   * Hide all alerts
   */
  function hideAlerts() {
    alertSuccess.classList.remove('show');
    alertError.classList.remove('show');
  }

  /**
   * Clear form-specific errors
   */
  function clearFormErrors(form) {
    const errors = document.querySelectorAll(`#${form}-form .form-error`);
    errors.forEach(error => {
      error.classList.remove('show');
      error.textContent = '';
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
