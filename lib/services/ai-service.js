/**
 * AI Service using Vercel AI SDK
 * Handles OpenAI interactions for URL parsing and image generation
 */

import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

// Event schema for structured output
const eventSchema = z.object({
  title: z.string().describe('Event title in Norwegian'),
  description: z.string().describe('Event description in Norwegian'),
  eventType: z.string().describe('Event type (konsert, workshop, festival, etc)'),
  venueName: z.string().optional().describe('Venue name'),
  venueAddress: z.string().optional().describe('Full address'),
  city: z.string().describe('City name'),
  startDate: z.string().describe('Start date and time (ISO 8601 format)'),
  endDate: z.string().optional().describe('End date and time (ISO 8601 format)'),
  isFree: z.boolean().describe('Is the event free?'),
  priceMin: z.number().optional().describe('Minimum price in NOK'),
  priceMax: z.number().optional().describe('Maximum price in NOK'),
  organizerName: z.string().optional().describe('Organizer name'),
  organizerUrl: z.string().optional().describe('Organizer website URL'),
  ticketUrl: z.string().optional().describe('Ticket purchase URL'),
  capacity: z.number().optional().describe('Maximum capacity'),
});

/**
 * Parse event information from a URL using OpenAI
 * @param {string} url - URL to parse
 * @param {string} htmlContent - Optional HTML content (if already fetched)
 * @returns {Promise<Object>} Parsed event data
 */
export async function parseEventFromUrl(url, htmlContent = null) {
  try {
    // If no HTML content provided, fetch it
    let content = htmlContent;
    if (!content) {
      const response = await fetch(url);
      content = await response.text();

      // Strip HTML tags for cleaner parsing (keep only text)
      content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      content = content.replace(/<[^>]+>/g, ' ');
      content = content.replace(/\s+/g, ' ').trim();

      // Limit to first 8000 characters to avoid token limits
      content = content.substring(0, 8000);
    }

    console.log('📡 Parsing event from URL with Vercel AI SDK...');
    console.log('   URL:', url);
    console.log('   Content length:', content.length);

    // Use Vercel AI SDK's generateObject with structured output
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: eventSchema,
      prompt: `
You are an expert at extracting event information from web pages.

Parse the following event page content and extract structured information in Norwegian.

URL: ${url}

Content:
${content}

Extract all relevant event details. If information is not available, omit the field.
Dates should be in ISO 8601 format with timezone (Europe/Oslo).
Event types should be one of: konsert, workshop, festival, teater, sport, mat-drikke, kunst, nettverking, marked, konferanse.
All text should be in Norwegian.
`,
    });

    console.log('✅ Event parsed successfully');
    console.log('   Title:', result.object.title);
    console.log('   City:', result.object.city);
    console.log('   Date:', result.object.startDate);

    return {
      success: true,
      data: result.object,
      originalUrl: url
    };

  } catch (error) {
    console.error('❌ Failed to parse event:', error);
    throw new Error(`AI parsing failed: ${error.message}`);
  }
}

/**
 * Generate an event image using DALL-E
 * @param {Object} eventData - Event information
 * @returns {Promise<string>} Image URL
 */
export async function generateEventImage(eventData) {
  try {
    const { title, eventType, city, description } = eventData;

    console.log('🎨 Generating event image with DALL-E...');
    console.log('   Title:', title);
    console.log('   Type:', eventType);

    // Create a descriptive prompt for DALL-E
    const prompt = `
Create a vibrant, modern illustration for an event poster.

Event: ${title}
Type: ${eventType}
Location: ${city}

Style: Flat design, colorful, friendly, modern
Mood: Inviting and exciting
Elements: Abstract shapes representing ${eventType} theme
No text, no people, just abstract artistic representation.
    `.trim();

    console.log('   Prompt:', prompt.substring(0, 100) + '...');

    // Use OpenAI's native client for DALL-E (not in Vercel AI SDK yet)
    const OpenAI = (await import('openai')).default;
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openaiClient.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    });

    const imageUrl = response.data[0].url;
    console.log('✅ Image generated successfully');
    console.log('   URL:', imageUrl.substring(0, 50) + '...');

    return imageUrl;

  } catch (error) {
    console.error('❌ Failed to generate image:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Generate a simple text summary using AI
 * @param {string} text - Text to summarize
 * @param {number} maxLength - Maximum length in words
 * @returns {Promise<string>} Summary
 */
export async function generateSummary(text, maxLength = 50) {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Summarize this text in Norwegian in max ${maxLength} words:\n\n${text}`,
    });

    return result.text;
  } catch (error) {
    console.error('Failed to generate summary:', error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
}
