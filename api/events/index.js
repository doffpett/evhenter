/**
 * Events API Endpoint
 * GET /api/events - List events with filtering and pagination
 *
 * Query parameters:
 *   - page: Page number (default: 1)
 *   - limit: Events per page (default: 24, max: 100)
 *   - city: Filter by city (e.g. "Oslo")
 *   - type: Filter by event type slug (e.g. "konsert")
 *   - startDate: Filter events after date (ISO 8601)
 *   - endDate: Filter events before date (ISO 8601)
 *   - search: Full-text search query
 *   - featured: Only featured events (true/false)
 */

import { getEvents, getEventTypes, getCitiesWithCounts } from '../../lib/db/events.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    // Parse query parameters
    const {
      page = '1',
      limit = '24',
      city = null,
      type = null,
      startDate = null,
      endDate = null,
      search = null,
      featured = null
    } = req.query;

    // Validate and parse pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));

    // Parse dates
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    // Validate dates
    if (startDate && isNaN(startDateObj.getTime())) {
      return res.status(400).json({
        error: 'Invalid startDate format',
        message: 'Use ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ'
      });
    }

    if (endDate && isNaN(endDateObj.getTime())) {
      return res.status(400).json({
        error: 'Invalid endDate format',
        message: 'Use ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ'
      });
    }

    // Build query options
    const options = {
      page: pageNum,
      limit: limitNum,
      city: city || null,
      eventType: type || null,
      startDate: startDateObj,
      endDate: endDateObj,
      search: search || null,
      featuredOnly: featured === 'true'
    };

    // Get events
    const result = await getEvents(options);

    // Get metadata (event types and cities) on first page only
    let metadata = null;
    if (pageNum === 1) {
      const [eventTypes, cities] = await Promise.all([
        getEventTypes(),
        getCitiesWithCounts()
      ]);

      metadata = {
        eventTypes,
        cities
      };
    }

    // Build response
    const response = {
      success: true,
      data: result.events,
      pagination: result.pagination,
      filters: {
        city: city || null,
        eventType: type || null,
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        featured: featured === 'true'
      },
      metadata
    };

    // Set cache headers
    // Cache for 5 minutes (300 seconds)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Events API error:', error);

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch events'
    });
  }
}
