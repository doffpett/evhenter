/**
 * Auth Header Component
 * Shows login/logout and user info in header
 */

(function() {
  'use strict';

  /**
   * Initialize auth header
   */
  function initAuthHeader() {
    // Get token and user from localStorage
    const token = localStorage.getItem('evhenter_token');
    const userJson = localStorage.getItem('evhenter_user');
    const user = userJson ? JSON.parse(userJson) : null;

    // Get nav element
    const nav = document.querySelector('.nav');
    if (!nav) return;

    // Clear ALL existing links (except "Arrangementer")
    const allLinks = Array.from(nav.children);
    allLinks.forEach(element => {
      // Keep the "Arrangementer" link, remove everything else
      const text = element.textContent?.trim();
      if (text !== 'Arrangementer' && !text.includes('Arrangementer')) {
        element.remove();
      }
    });

    if (token && user) {
      // User is logged in - show user name and logout
      const userSpan = document.createElement('span');
      userSpan.className = 'auth-link user-name';
      userSpan.textContent = `👤 ${user.name || user.email}`;
      userSpan.style.cssText = 'color: var(--color-text); font-weight: 500;';

      const logoutLink = document.createElement('a');
      logoutLink.href = '#';
      logoutLink.className = 'auth-link';
      logoutLink.textContent = 'Logg ut';
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });

      nav.appendChild(userSpan);
      nav.appendChild(logoutLink);
    } else {
      // User is not logged in - show login link
      const loginLink = document.createElement('a');
      loginLink.href = '/auth.html';
      loginLink.className = 'auth-link';
      loginLink.textContent = 'Logg inn';

      nav.appendChild(loginLink);
    }
  }

  /**
   * Logout user
   */
  function logout() {
    // Clear localStorage
    localStorage.removeItem('evhenter_token');
    localStorage.removeItem('evhenter_user');

    // Show confirmation
    if (confirm('Er du sikker på at du vil logge ut?')) {
      // Redirect to home page
      window.location.href = '/';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthHeader);
  } else {
    initAuthHeader();
  }

  // Export for use in other scripts
  window.evHenterAuth = {
    initAuthHeader,
    logout,
    getToken: () => localStorage.getItem('evhenter_token'),
    getUser: () => {
      const userJson = localStorage.getItem('evhenter_user');
      return userJson ? JSON.parse(userJson) : null;
    },
    isLoggedIn: () => !!localStorage.getItem('evhenter_token')
  };
})();
