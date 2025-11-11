/**
 * Health Check Endpoint
 * GET /api/health
 *
 * Returns API status and environment info
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '0.1.0',
      services: {
        api: 'operational',
        database: checkDatabaseConnection(),
        openai: checkOpenAIConfig(),
        storage: checkStorageConfig()
      }
    };

    return res.status(200).json(health);
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

/**
 * Check if database connection is configured
 */
function checkDatabaseConnection() {
  const hasPostgresUrl = !!process.env.POSTGRES_URL;
  return hasPostgresUrl ? 'configured' : 'not-configured';
}

/**
 * Check if OpenAI is configured
 */
function checkOpenAIConfig() {
  const hasApiKey = !!process.env.OPENAI_API_KEY;
  return hasApiKey ? 'configured' : 'not-configured';
}

/**
 * Check if Blob storage is configured
 */
function checkStorageConfig() {
  const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  return hasToken ? 'configured' : 'not-configured';
}
