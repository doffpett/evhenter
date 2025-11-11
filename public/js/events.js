/**
 * Events Page JavaScript
 * Handles fetching, filtering, and displaying events
 */

(function() {
  'use strict';

  // State
  const state = {
    currentPage: 1,
    filters: {
      city: null,
      type: null,
      search: null
    },
    metadata: null,
    isLoading: false
  };

  // DOM Elements
  const elements = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    emptyState: document.getElementById('empty-state'),
    eventsGrid: document.getElementById('events-grid'),
    pagination: document.getElementById('pagination'),
    prevBtn: document.getElementById('prev-page'),
    nextBtn: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),
    cityFilter: document.getElementById('city-filter'),
    typeFilter: document.getElementById('type-filter'),
    searchInput: document.getElementById('search-input'),
    clearFilters: document.getElementById('clear-filters')
  };

  /**
   * Initialize the page
   */
  function init() {
    console.log('🎉 Initializing events page...');

    // Set up event listeners
    elements.retryBtn?.addEventListener('click', () => loadEvents());
    elements.prevBtn?.addEventListener('click', () => goToPage(state.currentPage - 1));
    elements.nextBtn?.addEventListener('click', () => goToPage(state.currentPage + 1));
    elements.cityFilter?.addEventListener('change', handleFilterChange);
    elements.typeFilter?.addEventListener('change', handleFilterChange);
    elements.searchInput?.addEventListener('input', debounce(handleSearchChange, 500));
    elements.clearFilters?.addEventListener('click', clearFilters);

    // Load events
    loadEvents();
  }

  /**
   * Load events from API
   */
  async function loadEvents() {
    if (state.isLoading) return;

    state.isLoading = true;
    showLoading();

    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: state.currentPage,
        limit: 24
      });

      if (state.filters.city) params.append('city', state.filters.city);
      if (state.filters.type) params.append('type', state.filters.type);
      if (state.filters.search) params.append('search', state.filters.search);

      // Fetch events
      const url = `/api/events?${params.toString()}`;
      console.log('📡 Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Events loaded:', data);

      // Store metadata (event types and cities) from first page
      if (data.metadata) {
        state.metadata = data.metadata;
        populateFilters();
      }

      // Render events
      renderEvents(data.data, data.pagination);

      // Track page view
      if (window.evHenterAnalytics) {
        window.evHenterAnalytics.trackEvent('events_loaded', {
          page: state.currentPage,
          count: data.data.length,
          filters: state.filters
        });
      }

    } catch (error) {
      console.error('❌ Failed to load events:', error);
      showError(error.message);
    } finally {
      state.isLoading = false;
    }
  }

  /**
   * Render events grid
   */
  function renderEvents(events, pagination) {
    hideAll();

    if (events.length === 0) {
      show(elements.emptyState);
      return;
    }

    // Render event cards
    elements.eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');

    // Update pagination
    updatePagination(pagination);

    // Show grid and pagination
    show(elements.eventsGrid);
    show(elements.pagination);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Create event card HTML
   */
  function createEventCard(event) {
    const startDate = new Date(event.start_date);
    const formattedDate = formatDate(startDate);
    const formattedTime = formatTime(startDate);

    const price = event.is_free
      ? '<span class="event-card-price free">Gratis</span>'
      : event.price_min
        ? `<span class="event-card-price">${event.price_min} ${event.currency || 'NOK'}</span>`
        : '<span class="event-card-price">Se arrangement</span>';

    const imageHtml = event.image_url
      ? `<img src="${event.image_url}" alt="${event.title}" loading="lazy">`
      : `<div style="background: ${event.event_type_color || '#6366f1'}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">${event.event_type_icon || '📅'}</div>`;

    const featured = event.is_featured
      ? '<span class="event-card-badge">Fremhevet</span>'
      : '';

    return `
      <article class="event-card" onclick="viewEvent('${event.id}', '${event.slug}')">
        <div class="event-card-image">
          ${imageHtml}
          ${featured}
        </div>
        <div class="event-card-content">
          <div class="event-card-header">
            <div class="event-card-type" style="background-color: ${event.event_type_color}20; color: ${event.event_type_color};">
              <span>${event.event_type_icon || '📅'}</span>
              <span>${event.event_type || 'Arrangement'}</span>
            </div>
            <h2 class="event-card-title">${escapeHtml(event.title)}</h2>
          </div>

          <div class="event-card-meta">
            <div class="event-card-meta-item">
              <span>📅</span>
              <span>${formattedDate}</span>
            </div>
            <div class="event-card-meta-item">
              <span>🕐</span>
              <span>${formattedTime}</span>
            </div>
            ${event.city ? `
              <div class="event-card-meta-item">
                <span>📍</span>
                <span>${event.city}${event.venue_name ? `, ${event.venue_name}` : ''}</span>
              </div>
            ` : ''}
          </div>

          ${event.description ? `
            <p class="event-card-description">${escapeHtml(event.description)}</p>
          ` : ''}

          <div class="event-card-footer">
            ${price}
            <a href="/event/${event.slug || event.id}" class="event-card-link" onclick="event.stopPropagation();">
              Se detaljer →
            </a>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Navigate to event detail page
   */
  window.viewEvent = function(id, slug) {
    const identifier = slug || id;
    window.location.href = `/event/${identifier}`;
  };

  /**
   * Update pagination controls
   */
  function updatePagination(pagination) {
    elements.prevBtn.disabled = pagination.page === 1;
    elements.nextBtn.disabled = !pagination.hasMore;
    elements.pageInfo.textContent = `Side ${pagination.page} av ${pagination.totalPages}`;
  }

  /**
   * Go to specific page
   */
  function goToPage(page) {
    state.currentPage = page;
    loadEvents();
  }

  /**
   * Handle filter change
   */
  function handleFilterChange() {
    state.filters.city = elements.cityFilter.value || null;
    state.filters.type = elements.typeFilter.value || null;
    state.currentPage = 1; // Reset to first page
    loadEvents();

    // Show clear button if any filter is active
    if (state.filters.city || state.filters.type || state.filters.search) {
      show(elements.clearFilters);
    }
  }

  /**
   * Handle search input change
   */
  function handleSearchChange() {
    state.filters.search = elements.searchInput.value.trim() || null;
    state.currentPage = 1; // Reset to first page
    loadEvents();

    if (state.filters.search) {
      show(elements.clearFilters);
    }
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    state.filters = {
      city: null,
      type: null,
      search: null
    };
    state.currentPage = 1;

    elements.cityFilter.value = '';
    elements.typeFilter.value = '';
    elements.searchInput.value = '';

    hide(elements.clearFilters);
    loadEvents();
  }

  /**
   * Populate filter dropdowns with metadata
   */
  function populateFilters() {
    if (!state.metadata) return;

    // Populate city filter
    if (state.metadata.cities && state.metadata.cities.length > 0) {
      elements.cityFilter.innerHTML = '<option value="">Alle byer</option>' +
        state.metadata.cities.map(city =>
          `<option value="${city.city}">${city.city} (${city.event_count})</option>`
        ).join('');
    }

    // Populate type filter
    if (state.metadata.eventTypes && state.metadata.eventTypes.length > 0) {
      elements.typeFilter.innerHTML = '<option value="">Alle typer</option>' +
        state.metadata.eventTypes.map(type =>
          `<option value="${type.slug}">${type.icon} ${type.name}</option>`
        ).join('');
    }
  }

  /**
   * Show loading state
   */
  function showLoading() {
    hideAll();
    show(elements.loading);
  }

  /**
   * Show error state
   */
  function showError(message) {
    hideAll();
    elements.errorMessage.textContent = message;
    show(elements.error);
  }

  /**
   * Hide all states
   */
  function hideAll() {
    hide(elements.loading);
    hide(elements.error);
    hide(elements.emptyState);
    hide(elements.eventsGrid);
    hide(elements.pagination);
  }

  /**
   * Show element
   */
  function show(element) {
    if (element) {
      element.classList.remove('js-hidden');
      element.style.display = '';
    }
  }

  /**
   * Hide element
   */
  function hide(element) {
    if (element) {
      element.classList.add('js-hidden');
    }
  }

  /**
   * Format date (Norwegian format)
   */
  function formatDate(date) {
    return new Intl.DateTimeFormat('nb-NO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  /**
   * Format time (Norwegian format)
   */
  function formatTime(date) {
    return new Intl.DateTimeFormat('nb-NO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
