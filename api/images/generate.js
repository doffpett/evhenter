/**
 * Generate Event Image Endpoint
 * POST /api/images/generate
 * Uses DALL-E to generate event cover images
 */

import { requireAuth } from '../../lib/middleware/auth.js';
import { generateEventImage } from '../../lib/services/ai-service.js';

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
        const { title, eventType, city, description } = req.body;

        // Validate input
        if (!title || !eventType) {
          return res.status(400).json({
            error: 'Validation error',
            message: 'Title and eventType are required'
          });
        }

        console.log('🎨 Generating image for event:', title);
        console.log('   Type:', eventType);
        console.log('   City:', city);
        console.log('   User:', req.user.email);

        // Generate image using DALL-E
        const imageUrl = await generateEventImage({
          title,
          eventType,
          city,
          description
        });

        // Return image URL
        return res.status(200).json({
          success: true,
          message: 'Image generated successfully',
          data: {
            imageUrl,
            generatedBy: 'dall-e-3'
          },
          meta: {
            title,
            eventType,
            userId: req.user.id
          }
        });

      } catch (error) {
        console.error('Image generation error:', error);

        // Check if it's an OpenAI API error
        if (error.message.includes('API key')) {
          return res.status(503).json({
            error: 'Service unavailable',
            message: 'AI image service is not configured. Please contact administrator.'
          });
        }

        if (error.message.includes('content_policy')) {
          return res.status(400).json({
            error: 'Content policy violation',
            message: 'The requested image violates content policy. Please try different event details.'
          });
        }

        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Stack trace:', error.stack);
        }

        return res.status(500).json({
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to generate image'
        });
      } finally {
        resolve();
      }
    });
  });
}
