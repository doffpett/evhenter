# MCP Server Setup - Context7

This document explains how to set up the Context7 MCP server for accessing up-to-date library documentation.

## What is Context7?

Context7 is an MCP (Model Context Protocol) server that provides access to up-to-date documentation for popular libraries and frameworks. It's especially useful for:
- OpenAI API documentation
- Vercel platform docs
- PostgreSQL documentation
- Node.js libraries

## Setup Instructions

### Option 1: Claude Desktop Configuration (Recommended)

1. **Locate your Claude Desktop config file**:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. **Add Context7 MCP server** to the config:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "apiKey": "ctx7sk-564144a7-b07e-4fc7-b5ae-258222f88a1d",
      "transport": "sse"
    }
  }
}
```

3. **Restart Claude Desktop** to load the MCP server

### Option 2: Project-Level Configuration

For this project, we've created `.claude/mcp.json` with the Context7 configuration. This allows Claude Code to access documentation when working in this repository.

## Usage

Once configured, you can ask Claude to fetch documentation for libraries:

```
Can you get the latest OpenAI API docs for DALL-E 3?
Show me Vercel Postgres documentation
```

Claude will use the Context7 MCP server to retrieve up-to-date documentation.

## Useful Libraries for evHenter

Here are libraries we'll frequently need docs for:

### Backend
- `openai` - OpenAI API for GPT-4 and DALL-E 3
- `pg` - PostgreSQL client for Node.js
- `jose` - JWT token handling
- `bcryptjs` - Password hashing

### Vercel Platform
- Vercel Serverless Functions
- Vercel Postgres
- Vercel Blob Storage
- Vercel KV (Redis) - for Phase 5

### Frontend
- Native Web APIs (Fetch, FormData, etc.)
- Service Worker API (PWA)
- Intersection Observer (lazy loading)

## Testing Context7

To verify Context7 is working, try:

1. Ask Claude: "Get OpenAI documentation for DALL-E 3 image generation"
2. Claude should fetch and display current API documentation
3. You'll see references to the Context7 source

## Troubleshooting

### Error: "Unauthorized. Please check your API key"
- Verify API key in config matches: `ctx7sk-564144a7-b07e-4fc7-b5ae-258222f88a1d`
- Restart Claude Desktop after config changes

### MCP server not loading
- Check JSON syntax in config file (no trailing commas)
- Verify file location is correct for your OS
- Check Claude Desktop logs for errors

### Documentation outdated
- Context7 updates regularly, but may have slight delays
- Cross-reference with official docs for critical implementations

## API Key Security

**Note**: The Context7 API key is included in this project for development convenience. For production projects:
- Use environment variables for API keys
- Add `.claude/mcp.json` to `.gitignore` if keys are sensitive
- Rotate keys periodically

For this project, the Context7 key is safe to commit as it only provides read-only access to public documentation.

## Alternative: Manual Documentation

If Context7 is unavailable, refer to official documentation:
- OpenAI: https://platform.openai.com/docs
- Vercel: https://vercel.com/docs
- PostgreSQL: https://www.postgresql.org/docs/
- Node.js: https://nodejs.org/docs/

---

**Last Updated**: 2025-11-11
**Context7 MCP URL**: https://mcp.context7.com/mcp
