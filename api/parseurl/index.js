/**
 * Parse Event from URL Endpoint
 * POST /api/parse-url
 * Uses AI to extract event information from a URL
 */

import { requireAuth } from '../../lib/middleware/auth.js';
import { parseEventFromUrl } from '../../lib/services/ai-service.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['POST']
    });
  }

  // Require authentication
  return new Promise((resolve) => {
    requireAuth(req, res, async () => {
      try {
        const { url } = req.body;

        // Validate input
        if (!url) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'URL is required'
          });
        }

        // Validate URL format
        try {
          new URL(url);
        } catch (error) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Invalid URL format'
          });
        }

        console.log('🔍 Parsing event from URL:', url);
        console.log('   User:', req.user.email);

        // Parse event using AI
        const result = await parseEventFromUrl(url);

        // Return parsed data
        return res.status(200).json({
          success: true,
          message: 'Event parsed successfully',
          data: result.data,
          meta: {
            originalUrl: url,
            parsedBy: 'ai',
            userId: req.user.id
          }
        });

      } catch (error) {
        console.error('Parse URL error:', error);

        // Check if it's an OpenAI API error
        if (error.message.includes('API key')) {
          return res.status(503).json({
            error: 'Service unavailable',
            message: 'AI service is not configured. Please contact administrator.'
          });
        }

        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Stack trace:', error.stack);
        }

        return res.status(500).json({
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to parse event'
        });
      } finally {
        resolve();
      }
    });
  });
}
// Test deployment
