/**
 * Get Current User Endpoint
 * GET /api/auth/me
 * Requires authentication
 */

import { requireAuth } from '../../lib/middleware/auth.js';
import { query } from '../../lib/db/index.js';

// Vercel serverless functions don't support middleware chains directly
// So we need to manually call the middleware
export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  // Apply auth middleware
  return new Promise((resolve) => {
    requireAuth(req, res, async () => {
      try {
        // User is attached to req by middleware
        const userId = req.user.id;

        // Get full user profile including stats
        const result = await query(
          `SELECT
            id, email, name, avatar_url, bio, role, reputation,
            events_submitted, events_approved, is_verified,
            created_at, last_login_at
           FROM users
           WHERE id = $1`,
          [userId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            error: 'User not found',
            message: 'User profile could not be found'
          });
        }

        const user = result.rows[0];

        // Return user profile
        res.status(200).json({
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            role: user.role,
            reputation: user.reputation,
            stats: {
              eventsSubmitted: user.events_submitted,
              eventsApproved: user.events_approved
            },
            isVerified: user.is_verified,
            createdAt: user.created_at,
            lastLoginAt: user.last_login_at
          }
        });

        resolve();
      } catch (error) {
        console.error('Get user error:', error);

        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Stack trace:', error.stack);
        }

        res.status(500).json({
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch user'
        });

        resolve();
      }
    });
  });
}
