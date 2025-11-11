/**
 * Single Event API Endpoint
 * GET /api/events/[id] - Get event by ID or slug
 *
 * Path parameters:
 *   - id: Event UUID or slug
 */

import { getEventById } from '../../lib/db/events.js';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: 'Missing event ID or slug'
      });
    }

    // Get event
    const event = await getEventById(id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found',
        message: `No event found with ID or slug: ${id}`
      });
    }

    // Build response
    const response = {
      success: true,
      data: event
    };

    // Set cache headers
    // Cache for 10 minutes (600 seconds)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Event detail API error:', error);

    // Log error details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch event'
    });
  }
}
