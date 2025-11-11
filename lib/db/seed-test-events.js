/**
 * Seed Test Events
 * Adds sample events to the database for testing
 *
 * Usage: node lib/db/seed-test-events.js
 */

import { query } from './index.js';

async function seedTestEvents() {
  console.log('🌱 Seeding test events...\n');

  try {
    // Get event types and locations
    const eventTypesResult = await query('SELECT id, slug FROM event_types');
    const locationsResult = await query('SELECT id, city FROM locations');

    const eventTypes = Object.fromEntries(
      eventTypesResult.rows.map(et => [et.slug, et.id])
    );
    const locations = Object.fromEntries(
      locationsResult.rows.map(l => [l.city, l.id])
    );

    console.log('📋 Available event types:', Object.keys(eventTypes));
    console.log('📍 Available cities:', Object.keys(locations));
    console.log('');

    // Test events to insert
    const testEvents = [
      {
        title: 'Samarbeid med startups',
        description: 'Frokostmøte om hvordan samarbeid mellom startups og etablerte bedrifter kan drive innovasjon og internasjonal vekst. Møtet samler fremtidsrettede bedriftsledere for å diskutere hvordan store, ressurssterke selskaper og smidige startups kan utnytte sine komplementære styrker.',
        event_type_id: eventTypes['nettverking'],
        location_id: locations['Bergen'],
        venue_name: 'Startuplab',
        venue_address: 'Solheimsgaten 7C, 5054 Bergen',
        start_date: '2025-11-18T09:00:00+01:00',
        end_date: '2025-11-18T10:00:00+01:00',
        original_url: 'https://www.bergen-chamber.no/arrangementer/samarbeid-med-startups/',
        organizer_name: 'Bergen Næringsråd',
        organizer_url: 'https://www.bergen-chamber.no',
        is_free: true,
        status: 'approved',
        source: 'manual'
      },
      {
        title: 'Oslo Jazz Festival 2025',
        description: 'Norges største jazzfestival med internasjonale og nasjonale artister. En uke med konserter på ulike scener rundt om i Oslo sentrum.',
        event_type_id: eventTypes['konsert'],
        location_id: locations['Oslo'],
        venue_name: 'Flere scener i Oslo',
        venue_address: 'Oslo Sentrum',
        start_date: '2025-11-20T18:00:00+01:00',
        end_date: '2025-11-27T23:00:00+01:00',
        organizer_name: 'Oslo Jazz Festival',
        price_min: 350,
        price_max: 1200,
        currency: 'NOK',
        is_free: false,
        status: 'approved',
        is_featured: true,
        source: 'manual'
      },
      {
        title: 'Workshop: Introduksjon til Machine Learning',
        description: 'Lær grunnleggende om Machine Learning og AI. Workshopen er perfekt for nybegynnere som ønsker å komme i gang med ML. Vi dekker Python, scikit-learn, og praktiske eksempler.',
        event_type_id: eventTypes['workshop'],
        location_id: locations['Oslo'],
        venue_name: 'Teknologihuset',
        venue_address: 'Pilestredet 56, 0167 Oslo',
        start_date: '2025-11-22T10:00:00+01:00',
        end_date: '2025-11-22T16:00:00+01:00',
        organizer_name: 'Data Science Norge',
        price_min: 0,
        is_free: true,
        capacity: 30,
        status: 'approved',
        source: 'manual'
      },
      {
        title: 'Trondheim Matfestival',
        description: 'Opplev det beste av trøndersk matkultur. Lokale produsenter, restauranter og kokker viser frem regionens kulinariske skatter. Smaksprøver, demonstrasjoner og salgsboder.',
        event_type_id: eventTypes['mat-drikke'],
        location_id: locations['Trondheim'],
        venue_name: 'Torvet',
        venue_address: 'Trondheim Torg',
        start_date: '2025-11-23T11:00:00+01:00',
        end_date: '2025-11-23T18:00:00+01:00',
        organizer_name: 'Trondheim Kommune',
        price_min: 0,
        is_free: true,
        status: 'approved',
        is_featured: true,
        source: 'manual'
      },
      {
        title: 'Stavanger Filmfestival',
        description: 'Internasjonal filmfestival med fokus på skandinavisk og nordisk film. Visninger av spillefilmer, dokumentarer og kortfilmer. Årets festival inkluderer samtaler med regissører og skuespillere.',
        event_type_id: eventTypes['film'],
        location_id: locations['Stavanger'],
        venue_name: 'Stavanger Konserthus',
        venue_address: 'Bjergstedparken, 4007 Stavanger',
        start_date: '2025-11-25T17:00:00+01:00',
        end_date: '2025-11-29T22:00:00+01:00',
        organizer_name: 'Stavanger Film',
        price_min: 150,
        price_max: 400,
        currency: 'NOK',
        is_free: false,
        status: 'approved',
        source: 'manual'
      },
      {
        title: 'Startup Grind Bergen',
        description: 'Månedlig meetup for gründere, investorer og tech-entusiaster. Denne måneden har vi gründeren bak Norges raskest voksende SaaS-startup som inspirerer oss med sin reise.',
        event_type_id: eventTypes['nettverking'],
        location_id: locations['Bergen'],
        venue_name: 'Vaken',
        venue_address: 'Vaskerelven 39, 5014 Bergen',
        start_date: '2025-11-26T17:30:00+01:00',
        end_date: '2025-11-26T20:00:00+01:00',
        organizer_name: 'Startup Grind Bergen',
        price_min: 0,
        is_free: true,
        status: 'approved',
        source: 'manual'
      }
    ];

    // Insert events
    let successCount = 0;
    let errorCount = 0;

    for (const event of testEvents) {
      try {
        const result = await query(`
          INSERT INTO events (
            title, description, event_type_id, location_id,
            venue_name, venue_address, start_date, end_date,
            original_url, organizer_name, organizer_url,
            price_min, price_max, currency, is_free, capacity,
            status, is_featured, source
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          RETURNING id, title, slug
        `, [
          event.title,
          event.description,
          event.event_type_id,
          event.location_id,
          event.venue_name,
          event.venue_address,
          event.start_date,
          event.end_date,
          event.original_url || null,
          event.organizer_name,
          event.organizer_url || null,
          event.price_min || null,
          event.price_max || null,
          event.currency || 'NOK',
          event.is_free,
          event.capacity || null,
          event.status,
          event.is_featured || false,
          event.source
        ]);

        console.log(`✅ Created: ${result.rows[0].title}`);
        console.log(`   ID: ${result.rows[0].id}`);
        console.log(`   Slug: ${result.rows[0].slug}`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create: ${event.title}`);
        console.error(`   Error: ${error.message}`);
        console.error('');
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('');

    // Count total events
    const countResult = await query('SELECT COUNT(*) as total FROM events');
    console.log(`🎉 Total events in database: ${countResult.rows[0].total}`);
    console.log('');
    console.log('🌐 View events at: https://evhenter.ai/events.html');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run seeding
seedTestEvents();
