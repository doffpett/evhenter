/**
 * Event Detail Page JavaScript
 * Handles fetching and displaying single event details
 */

(function() {
  'use strict';

  // State
  let currentEvent = null;

  // DOM Elements
  const elements = {
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    eventDetail: document.getElementById('event-detail'),
    heroBg: document.getElementById('hero-bg'),
    breadcrumbTitle: document.getElementById('breadcrumb-title'),
    eventBadges: document.getElementById('event-badges'),
    eventTitle: document.getElementById('event-title'),
    eventMetaHero: document.getElementById('event-meta-hero'),
    eventDescription: document.getElementById('event-description'),
    eventDetails: document.getElementById('event-details'),
    eventLocation: document.getElementById('event-location'),
    locationSection: document.getElementById('location-section'),
    eventPrice: document.getElementById('event-price'),
    eventCtaActions: document.getElementById('event-cta-actions'),
    eventOrganizer: document.getElementById('event-organizer'),
    moreEvents: document.getElementById('more-events')
  };

  /**
   * Initialize the page
   */
  function init() {
    console.log('🎉 Initializing event detail page...');

    // Get event ID from URL path
    const eventId = getEventIdFromPath();

    if (!eventId) {
      showError('Ingen event ID funnet i URL');
      return;
    }

    console.log('📋 Event ID:', eventId);

    // Set up event listeners
    elements.retryBtn?.addEventListener('click', () => loadEvent(eventId));

    // Load event
    loadEvent(eventId);
  }

  /**
   * Get event ID from URL path
   * URL format: /event/{id-or-slug}
   */
  function getEventIdFromPath() {
    const path = window.location.pathname;
    const match = path.match(/\/event\/([^\/]+)/);
    return match ? match[1] : null;
  }

  /**
   * Load event from API
   */
  async function loadEvent(eventId) {
    showLoading();

    try {
      const url = `/api/events/${eventId}`;
      console.log('📡 Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Arrangementet ble ikke funnet');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Event loaded:', data);

      currentEvent = data.data;

      // Render event
      renderEvent(currentEvent);

      // Load more events
      loadMoreEvents(currentEvent.city, currentEvent.event_type_slug);

      // Track page view
      if (window.evHenterAnalytics) {
        window.evHenterAnalytics.trackEvent('event_viewed', {
          eventId: currentEvent.id,
          eventType: currentEvent.event_type,
          city: currentEvent.city
        });
      }

    } catch (error) {
      console.error('❌ Failed to load event:', error);
      showError(error.message);
    }
  }

  /**
   * Render event details
   */
  function renderEvent(event) {
    // Update page title
    document.title = `${event.title} - evHenter`;

    // Update meta tags
    updateMetaTags(event);

    // Hero background
    if (event.image_url) {
      elements.heroBg.style.backgroundImage = `url(${event.image_url})`;
    } else if (event.event_type_color) {
      elements.heroBg.style.background = `linear-gradient(135deg, ${event.event_type_color} 0%, ${event.event_type_color}aa 100%)`;
    }

    // Breadcrumb
    elements.breadcrumbTitle.textContent = truncateText(event.title, 50);

    // Badges
    const badges = [];
    if (event.is_featured) {
      badges.push(`<span class="event-badge featured">⭐ Fremhevet</span>`);
    }
    if (event.event_type) {
      badges.push(`<span class="event-badge" style="background-color: ${event.event_type_color}20; color: ${event.event_type_color};">
        ${event.event_type_icon || '📅'} ${event.event_type}
      </span>`);
    }
    elements.eventBadges.innerHTML = badges.join('');

    // Title
    elements.eventTitle.textContent = event.title;

    // Hero meta
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;

    const heroMeta = [
      `<div class="event-meta-item">
        <span class="event-meta-icon">📅</span>
        <div>
          <div><strong>${formatDate(startDate)}</strong></div>
          ${endDate && !isSameDay(startDate, endDate) ? `<div>til ${formatDate(endDate)}</div>` : ''}
        </div>
      </div>`,
      `<div class="event-meta-item">
        <span class="event-meta-icon">🕐</span>
        <div><strong>${formatTime(startDate)}${endDate && isSameDay(startDate, endDate) ? ` - ${formatTime(endDate)}` : ''}</strong></div>
      </div>`
    ];

    if (event.city) {
      heroMeta.push(`<div class="event-meta-item">
        <span class="event-meta-icon">📍</span>
        <div><strong>${event.city}${event.venue_name ? `, ${event.venue_name}` : ''}</strong></div>
      </div>`);
    }

    elements.eventMetaHero.innerHTML = heroMeta.join('');

    // Description
    elements.eventDescription.innerHTML = event.description
      ? `<p>${escapeHtml(event.description)}</p>`
      : '<p><em>Ingen beskrivelse tilgjengelig.</em></p>';

    // Details
    const details = [];

    if (event.venue_name || event.venue_address) {
      details.push(createDetailItem('📍', 'Sted', event.venue_name || event.venue_address));
    }

    if (event.organizer_name) {
      details.push(createDetailItem('👤', 'Arrangør', event.organizer_name));
    }

    if (event.capacity) {
      details.push(createDetailItem('👥', 'Kapasitet', `${event.capacity} personer`));
    }

    const dateInfo = `${formatDate(startDate)} kl. ${formatTime(startDate)}${endDate ? ` - ${endDate && !isSameDay(startDate, endDate) ? formatDate(endDate) + ' kl. ' : ''}${formatTime(endDate)}` : ''}`;
    details.push(createDetailItem('📅', 'Dato og tid', dateInfo));

    elements.eventDetails.innerHTML = details.join('');

    // Location
    if (event.venue_name || event.venue_address) {
      elements.eventLocation.innerHTML = `
        <div class="location-address">
          ${event.venue_name ? `<strong>${escapeHtml(event.venue_name)}</strong><br>` : ''}
          ${event.venue_address ? escapeHtml(event.venue_address) : ''}
          ${event.city ? `<br>${event.city}` : ''}
        </div>
        ${event.latitude && event.longitude ? `
          <div class="location-map-placeholder">
            🗺️ Kart kommer snart (${event.latitude}, ${event.longitude})
          </div>
        ` : ''}
      `;
    } else {
      elements.locationSection.style.display = 'none';
    }

    // Price
    const priceHtml = event.is_free
      ? '<div class="price-value free">Gratis</div>'
      : event.price_min
        ? `<div class="price-value">${event.price_min}${event.price_max && event.price_max !== event.price_min ? ` - ${event.price_max}` : ''} ${event.currency || 'NOK'}</div>`
        : '<div class="price-value">Se arrangement</div>';

    elements.eventPrice.innerHTML = `
      <div class="price-label">Pris</div>
      ${priceHtml}
    `;

    // CTA Actions
    const actions = [];

    if (event.ticket_url || event.original_url) {
      actions.push(`<a href="${event.ticket_url || event.original_url}" target="_blank" rel="noopener noreferrer" class="btn-primary">
        ${event.ticket_url ? 'Kjøp billett' : 'Se arrangement'} →
      </a>`);
    }

    if (event.original_url && event.ticket_url) {
      actions.push(`<a href="${event.original_url}" target="_blank" rel="noopener noreferrer" class="btn-secondary">
        Les mer
      </a>`);
    }

    elements.eventCtaActions.innerHTML = actions.length > 0
      ? actions.join('')
      : '<p style="color: #6b7280; font-size: 0.875rem;">Ingen direktelink tilgjengelig</p>';

    // Organizer
    if (event.organizer_name) {
      elements.eventOrganizer.innerHTML = `
        <div class="organizer-label">Arrangert av</div>
        <div class="organizer-name">${escapeHtml(event.organizer_name)}</div>
        ${event.organizer_url ? `<a href="${event.organizer_url}" target="_blank" rel="noopener noreferrer" class="organizer-link">
          Besøk arrangør →
        </a>` : ''}
      `;
    }

    // Show event detail
    hideAll();
    show(elements.eventDetail);
  }

  /**
   * Create detail item HTML
   */
  function createDetailItem(icon, label, value) {
    return `
      <div class="detail-item">
        <span class="detail-icon">${icon}</span>
        <div class="detail-content">
          <div class="detail-label">${label}</div>
          <div class="detail-value">${escapeHtml(value)}</div>
        </div>
      </div>
    `;
  }

  /**
   * Load more events from same city or type
   */
  async function loadMoreEvents(city, eventType) {
    try {
      const params = new URLSearchParams({
        city: city || '',
        limit: 3
      });

      const response = await fetch(`/api/events?${params.toString()}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        // Filter out current event
        const moreEvents = data.data.filter(e => e.id !== currentEvent.id).slice(0, 3);

        if (moreEvents.length > 0) {
          elements.moreEvents.innerHTML = moreEvents.map(event => createEventCard(event)).join('');
        }
      }
    } catch (error) {
      console.error('Failed to load more events:', error);
    }
  }

  /**
   * Create event card (simplified version)
   */
  function createEventCard(event) {
    const startDate = new Date(event.start_date);
    const formattedDate = formatDate(startDate);
    const price = event.is_free ? 'Gratis' : event.price_min ? `${event.price_min} ${event.currency}` : 'Se mer';

    return `
      <a href="/event/${event.slug || event.id}" class="event-card" style="text-decoration: none; color: inherit; display: block; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;">
        <div style="width: 100%; height: 150px; background: ${event.event_type_color || '#6366f1'}; display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
          ${event.event_type_icon || '📅'}
        </div>
        <div style="padding: 1rem;">
          <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
            ${formattedDate}
          </div>
          <h3 style="font-size: 1.125rem; margin-bottom: 0.5rem; font-weight: 600;">
            ${escapeHtml(truncateText(event.title, 60))}
          </h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
            <span style="font-weight: 600; color: ${event.is_free ? '#10b981' : '#6366f1'};">${price}</span>
            <span style="color: #6366f1; font-size: 0.875rem;">Se detaljer →</span>
          </div>
        </div>
      </a>
    `;
  }

  /**
   * Share event on social media
   */
  window.shareEvent = function(platform) {
    if (!currentEvent) return;

    const url = window.location.href;
    const title = currentEvent.title;
    const text = currentEvent.description || title;

    let shareUrl;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link kopiert til utklippstavle!');
        });
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // Track share event
    if (window.evHenterAnalytics) {
      window.evHenterAnalytics.trackEvent('event_shared', {
        eventId: currentEvent.id,
        platform: platform
      });
    }
  };

  /**
   * Update meta tags for SEO and social sharing
   */
  function updateMetaTags(event) {
    const description = event.description || `${event.title} - ${event.city}`;

    // Update existing meta tags
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', event.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', window.location.href);
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }

  /**
   * Utility functions
   */
  function showLoading() {
    hideAll();
    show(elements.loading);
  }

  function showError(message) {
    hideAll();
    elements.errorMessage.textContent = message;
    show(elements.error);
  }

  function hideAll() {
    hide(elements.loading);
    hide(elements.error);
    hide(elements.eventDetail);
  }

  function show(element) {
    if (element) {
      element.classList.remove('js-hidden');
      element.style.display = '';
    }
  }

  function hide(element) {
    if (element) {
      element.classList.add('js-hidden');
    }
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat('nb-NO', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat('nb-NO', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  function isSameDay(date1, date2) {
    return date1.toDateString() === date2.toDateString();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
