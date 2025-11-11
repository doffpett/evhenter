# Vercel Analytics Setup - evHenter

This document explains how Vercel Analytics is configured and how to use it for tracking user behavior and performance metrics.

## What is Vercel Analytics?

Vercel Analytics provides:
- **Web Vitals**: Automatic tracking of Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- **Page Views**: Automatic tracking of all page navigations
- **Custom Events**: Track user interactions and business metrics
- **Privacy-Friendly**: GDPR compliant, no cookies required
- **Real User Monitoring**: Actual performance data from real users

## Installation

Already installed and configured in the project:

```bash
npm install @vercel/analytics
```

## Configuration

### Frontend Integration

Analytics is loaded in all HTML pages via `/js/analytics.js`:

```html
<!-- In <head> of index.html -->
<script src="/js/analytics.js"></script>
```

The analytics script:
1. Injects the Vercel Analytics library (`/_vercel/insights/script.js`)
2. Automatically tracks page views and Web Vitals
3. Provides helper functions for custom event tracking

### Custom Event Tracking

Use the global `window.evHenterAnalytics` object to track custom events:

```javascript
// Track a custom event
window.evHenterAnalytics.trackEvent('event_submitted', {
  eventType: 'concert',
  location: 'Oslo'
});

// Track page view (for SPA navigation)
window.evHenterAnalytics.trackPageView('/event/123');
```

## Tracked Metrics

### Automatic Metrics (Web Vitals)

Vercel Analytics automatically tracks:

1. **LCP (Largest Contentful Paint)**: Loading performance
   - Target: < 2.5s
   - Measures when main content is visible

2. **FID (First Input Delay)**: Interactivity
   - Target: < 100ms
   - Measures time from user interaction to browser response

3. **CLS (Cumulative Layout Shift)**: Visual stability
   - Target: < 0.1
   - Measures unexpected layout shifts

4. **FCP (First Contentful Paint)**: Perceived load speed
   - Target: < 1.8s
   - Measures when first content is painted

5. **TTFB (Time to First Byte)**: Server response time
   - Target: < 600ms
   - Measures server response speed

### Custom Events (Planned)

We'll track these custom events as features are implemented:

#### Phase 1 (Browse Events)
```javascript
// User applies filter
evHenterAnalytics.trackEvent('filter_applied', {
  filterType: 'location', // location, date, type
  value: 'Oslo'
});

// User views event details
evHenterAnalytics.trackEvent('event_viewed', {
  eventId: '123',
  eventType: 'concert'
});

// User clicks external event link
evHenterAnalytics.trackEvent('event_link_clicked', {
  eventId: '123',
  destination: 'eventbrite.com'
});
```

#### Phase 2 (Event Submission)
```javascript
// User submits event
evHenterAnalytics.trackEvent('event_submitted', {
  source: 'manual', // manual or url-parse
  eventType: 'workshop'
});

// User registers
evHenterAnalytics.trackEvent('user_registered', {
  method: 'email' // email, google, github
});
```

#### Phase 3 (AI Features)
```javascript
// URL parsing used
evHenterAnalytics.trackEvent('url_parsed', {
  success: true,
  platform: 'eventbrite'
});

// AI image generated
evHenterAnalytics.trackEvent('image_generated', {
  eventType: 'concert',
  generationTime: 2500 // ms
});
```

#### Phase 4 (Community Features)
```javascript
// Event approved/rejected
evHenterAnalytics.trackEvent('event_moderated', {
  action: 'approved', // approved or rejected
  moderatorReputation: 75
});

// Filter saved
evHenterAnalytics.trackEvent('filter_saved', {
  filterCriteria: ['location', 'date', 'type']
});
```

## Viewing Analytics

### Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `evhenter`
3. Navigate to **Analytics** tab

You'll see:
- **Overview**: Page views, unique visitors, top pages
- **Web Vitals**: Performance metrics with distribution charts
- **Audience**: Geographic distribution, devices, browsers
- **Real-time**: Live visitor tracking (on Pro plan)

### Analytics Retention

- **Hobby Plan**: 1 day of data retention
- **Pro Plan**: 30 days of data retention
- **Enterprise**: Custom retention

## Environment Configuration

Analytics works in all environments:

```javascript
// In analytics.js
const script = document.createElement('script');
script.src = '/_vercel/insights/script.js'; // Vercel manages the path
```

**Development**:
- Analytics loads but doesn't send data to avoid pollution
- See console logs: "📊 Vercel Analytics loaded"

**Production**:
- Full analytics tracking enabled
- Data sent to Vercel dashboard

**Staging/Preview**:
- Tracked separately from production
- Helps test analytics implementation

## Privacy & GDPR Compliance

Vercel Analytics is privacy-friendly:

✅ **No cookies**: Doesn't use cookies for tracking
✅ **No personal data**: Only aggregated metrics
✅ **No cross-site tracking**: Limited to your domain
✅ **GDPR compliant**: Meets EU privacy regulations
✅ **No consent required**: Doesn't require cookie banner

## Performance Impact

- **Script size**: ~1KB gzipped
- **Load time**: < 50ms (async, non-blocking)
- **Bandwidth**: Minimal (batched requests)
- **Impact on metrics**: None (loaded after page interactive)

## Custom Event Best Practices

### ✅ Good Event Names
```javascript
trackEvent('event_submitted', { ... })      // Clear, specific
trackEvent('filter_applied', { ... })       // Action-based
trackEvent('payment_completed', { ... })    // Business metric
```

### ❌ Avoid
```javascript
trackEvent('click', { ... })                // Too generic
trackEvent('button1_pressed', { ... })      // Implementation detail
trackEvent('user_did_something', { ... })   // Unclear
```

### Event Properties

Always include context:
```javascript
trackEvent('event_viewed', {
  eventId: '123',              // Identifier
  eventType: 'concert',        // Category
  source: 'search',            // User journey
  timestamp: Date.now()        // When (optional, auto-added)
});
```

## Debugging

### Check if Analytics is Loaded

Open browser console:
```javascript
// Should see:
// 📊 Vercel Analytics loaded
// 📊 Vercel Analytics: Page loaded

// Check if available:
console.log(window.va); // Should be function
console.log(window.evHenterAnalytics); // Should be object
```

### Test Event Tracking

```javascript
// Send test event
window.evHenterAnalytics.trackEvent('test_event', {
  message: 'Testing analytics'
});

// Check console for:
// 📊 Event tracked: test_event { message: 'Testing analytics' }
```

### Common Issues

**Analytics not loading**:
- Check Vercel deployment is successful
- Verify script is in `<head>` of HTML
- Check browser console for errors

**Events not appearing in dashboard**:
- Wait 1-2 minutes for processing
- Verify you're on production deployment
- Check event name spelling
- Ensure environment is production

**Script blocked by ad-blocker**:
- Vercel Analytics path (`/_vercel/insights/`) is usually allowed
- Less likely to be blocked than Google Analytics
- If blocked, user experience not affected

## Integration Examples

### Track Filter Usage
```javascript
// In filter panel component
document.getElementById('location-filter').addEventListener('change', (e) => {
  window.evHenterAnalytics.trackEvent('filter_applied', {
    filterType: 'location',
    value: e.target.value
  });
});
```

### Track Event Views
```javascript
// In event detail page
window.addEventListener('load', () => {
  const eventId = getEventIdFromUrl();
  window.evHenterAnalytics.trackEvent('event_viewed', {
    eventId: eventId
  });
});
```

### Track External Clicks
```javascript
// In event card component
document.querySelectorAll('.event-link').forEach(link => {
  link.addEventListener('click', (e) => {
    window.evHenterAnalytics.trackEvent('event_link_clicked', {
      eventId: e.target.dataset.eventId,
      destination: new URL(e.target.href).hostname
    });
  });
});
```

## Costs

Vercel Analytics pricing:
- **Hobby Plan**: Free (1 day retention)
- **Pro Plan**: Included (30 day retention)
- **Enterprise**: Custom pricing

No additional costs for:
- Page views
- Custom events
- Web Vitals tracking
- Data volume

## Future Enhancements

### Phase 5 (Analytics Dashboard)

Build internal analytics dashboard:
- Top events by views
- Filter usage heatmap
- Event submission success rate
- AI feature adoption metrics
- User engagement funnel

### Integration with PostHog or Mixpanel

For more advanced analytics:
- Cohort analysis
- Funnel visualization
- A/B testing
- Session replay

But start with Vercel Analytics - it's free and sufficient for MVP!

---

**Last Updated**: 2025-11-11
**Vercel Analytics Version**: 1.3.1
**Status**: ✅ Configured and Ready
