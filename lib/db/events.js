/**
 * Event Database Queries
 * Helper functions for querying events table
 */

import { query, queryOne, queryAll } from './index.js';

/**
 * Get upcoming approved events with filtering and pagination
 *
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.limit - Events per page
 * @param {string} options.city - Filter by city
 * @param {string} options.eventType - Filter by event type slug
 * @param {Date} options.startDate - Filter events after this date
 * @param {Date} options.endDate - Filter events before this date
 * @param {string} options.search - Full-text search query
 * @param {boolean} options.featuredOnly - Only featured events
 * @returns {Promise<Object>} Events and pagination info
 */
export async function getEvents(options = {}) {
  const {
    page = 1,
    limit = 24,
    city = null,
    eventType = null,
    startDate = null,
    endDate = null,
    search = null,
    featuredOnly = false
  } = options;

  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [
    'e.status = $1',
    'e.is_cancelled = $2',
    'e.start_date >= $3'
  ];

  params.push('approved', false, startDate || new Date());

  // Filter by city
  if (city) {
    conditions.push(`l.city ILIKE $${params.length + 1}`);
    params.push(city);
  }

  // Filter by event type
  if (eventType) {
    conditions.push(`et.slug = $${params.length + 1}`);
    params.push(eventType);
  }

  // Filter by end date
  if (endDate) {
    conditions.push(`e.start_date <= $${params.length + 1}`);
    params.push(endDate);
  }

  // Filter featured only
  if (featuredOnly) {
    conditions.push('e.is_featured = true');
  }

  // Full-text search
  if (search) {
    conditions.push(`e.search_vector @@ plainto_tsquery('norwegian', $${params.length + 1})`);
    params.push(search);
  }

  const whereClause = conditions.join(' AND ');

  // Get total count
  const countQuery = `
    SELECT COUNT(*) as total
    FROM events e
    LEFT JOIN event_types et ON e.event_type_id = et.id
    LEFT JOIN locations l ON e.location_id = l.id
    WHERE ${whereClause}
  `;

  const countResult = await queryOne(countQuery, params);
  const total = parseInt(countResult.total, 10);

  // Get events
  const eventsQuery = `
    SELECT
      e.id,
      e.title,
      e.slug,
      e.description,
      e.start_date,
      e.end_date,
      e.venue_name,
      e.venue_address,
      e.original_url,
      e.ticket_url,
      e.image_url,
      e.organizer_name,
      e.price_min,
      e.price_max,
      e.currency,
      e.is_free,
      e.is_featured,
      et.name as event_type,
      et.slug as event_type_slug,
      et.icon as event_type_icon,
      et.color as event_type_color,
      l.name as location_name,
      l.city as city,
      l.region as region,
      l.latitude,
      l.longitude,
      e.created_at
    FROM events e
    LEFT JOIN event_types et ON e.event_type_id = et.id
    LEFT JOIN locations l ON e.location_id = l.id
    WHERE ${whereClause}
    ORDER BY e.is_featured DESC, e.start_date ASC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  params.push(limit, offset);
  const events = await queryAll(eventsQuery, params);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}

/**
 * Get a single event by ID or slug
 *
 * @param {string} identifier - Event ID (UUID) or slug
 * @returns {Promise<Object|null>} Event or null
 */
export async function getEventById(identifier) {
  const eventQuery = `
    SELECT
      e.id,
      e.title,
      e.slug,
      e.description,
      e.start_date,
      e.end_date,
      e.venue_name,
      e.venue_address,
      e.original_url,
      e.ticket_url,
      e.image_url,
      e.organizer_name,
      e.organizer_url,
      e.price_min,
      e.price_max,
      e.currency,
      e.is_free,
      e.is_featured,
      e.capacity,
      et.name as event_type,
      et.slug as event_type_slug,
      et.icon as event_type_icon,
      et.color as event_type_color,
      l.name as location_name,
      l.city as city,
      l.region as region,
      l.latitude,
      l.longitude,
      e.created_at,
      e.published_at
    FROM events e
    LEFT JOIN event_types et ON e.event_type_id = et.id
    LEFT JOIN locations l ON e.location_id = l.id
    WHERE (e.id::text = $1 OR e.slug = $1)
      AND e.status = 'approved'
      AND e.is_cancelled = false
  `;

  return await queryOne(eventQuery, [identifier]);
}

/**
 * Get all event types
 *
 * @returns {Promise<Array>} Event types
 */
export async function getEventTypes() {
  return await queryAll(`
    SELECT id, name, slug, description, icon, color
    FROM event_types
    ORDER BY name ASC
  `);
}

/**
 * Get all unique cities with event counts
 *
 * @returns {Promise<Array>} Cities with counts
 */
export async function getCitiesWithCounts() {
  return await queryAll(`
    SELECT
      l.city,
      COUNT(e.id) as event_count
    FROM locations l
    LEFT JOIN events e ON e.location_id = l.id
      AND e.status = 'approved'
      AND e.is_cancelled = false
      AND e.start_date >= CURRENT_TIMESTAMP
    GROUP BY l.city
    HAVING COUNT(e.id) > 0
    ORDER BY event_count DESC, l.city ASC
  `);
}

/**
 * Get featured events (max 6)
 *
 * @returns {Promise<Array>} Featured events
 */
export async function getFeaturedEvents() {
  const result = await getEvents({
    featuredOnly: true,
    limit: 6
  });
  return result.events;
}

/**
 * Create a new event
 *
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export async function createEvent(eventData) {
  const {
    title,
    description,
    event_type_id,
    location_id,
    venue_name,
    venue_address,
    start_date,
    end_date,
    original_url,
    ticket_url,
    image_url,
    organizer_name,
    organizer_url,
    price_min,
    price_max,
    is_free,
    source = 'manual',
    submitted_by = null
  } = eventData;

  const insertQuery = `
    INSERT INTO events (
      title, description, event_type_id, location_id,
      venue_name, venue_address, start_date, end_date,
      original_url, ticket_url, image_url,
      organizer_name, organizer_url,
      price_min, price_max, is_free,
      source, submitted_by, status
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, 'pending'
    )
    RETURNING id, slug, created_at
  `;

  const params = [
    title, description, event_type_id, location_id,
    venue_name, venue_address, start_date, end_date,
    original_url, ticket_url, image_url,
    organizer_name, organizer_url,
    price_min, price_max, is_free,
    source, submitted_by
  ];

  return await queryOne(insertQuery, params);
}

export default {
  getEvents,
  getEventById,
  getEventTypes,
  getCitiesWithCounts,
  getFeaturedEvents,
  createEvent
};
