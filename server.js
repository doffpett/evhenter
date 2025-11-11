/**
 * Simple Node.js dev server for local testing
 * Alternative to Vercel CLI for development
 */

import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Simple routing
const routes = {
  '/': 'public/index.html',
  '/index.html': 'public/index.html',
};

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle API routes
  if (req.url.startsWith('/api/')) {
    return handleAPI(req, res);
  }

  // Handle static files
  let filePath = routes[req.url] || req.url.slice(1);

  if (!filePath.startsWith('public/')) {
    filePath = 'public/' + filePath;
  }

  try {
    const fullPath = join(__dirname, filePath);
    const content = await readFile(fullPath);
    const ext = filePath.substring(filePath.lastIndexOf('.'));
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
  } catch (error) {
    // If file not found and no extension, try .html
    if (error.code === 'ENOENT' && !req.url.includes('.')) {
      try {
        const htmlPath = join(__dirname, 'public', req.url + '.html');
        const content = await readFile(htmlPath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
        return;
      } catch {}
    }

    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Not Found</h1>');
  }
});

// Simple API handler
async function handleAPI(req, res) {
  const url = req.url;

  // Health check
  if (url === '/api/health') {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '0.1.0',
      services: {
        api: 'operational',
        database: process.env.POSTGRES_URL ? 'configured' : 'not-configured',
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not-configured',
        storage: process.env.BLOB_READ_WRITE_TOKEN ? 'configured' : 'not-configured'
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health, null, 2));
    return;
  }

  // Default API response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'API endpoint not found' }));
}

server.listen(PORT, () => {
  console.log('');
  console.log('🚀 evHenter Development Server');
  console.log('');
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://localhost:${PORT}`);
  console.log('');
  console.log('📝 Endpoints:');
  console.log(`   Homepage:    http://localhost:${PORT}`);
  console.log(`   API Health:  http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('⚡ Server ready! Press Ctrl+C to stop.');
  console.log('');
});
