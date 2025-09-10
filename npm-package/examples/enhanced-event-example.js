/**
 * Enhanced Event Schema Examples
 * Demonstrates comprehensive Event schema implementation with all features
 */

const { EventBuilder } = require('../lib/builders/event-builder');
const { MODES } = require('../lib/builders/base-builder');

console.log('=== Enhanced Event Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('1. Basic Enhanced Event Schema');
const basicEvent = new EventBuilder(MODES.STRICT_SEO, true)
  .name('Tech Conference 2024')
  .description('Annual technology conference featuring the latest innovations in AI, web development, and cloud computing.')
  .startDate('2024-06-15T09:00:00Z')
  .endDate('2024-06-15T17:00:00Z')
  .location('Convention Center', '123 Tech Street, San Francisco, CA 94105', 37.7749, -122.4194)
  .organizer('Tech Events Inc', 'https://techevents.com', 'info@techevents.com')
  .performer('Dr. Jane Smith', 'https://janesmith.com', 'Person')
  .offers('299.99', 'USD', 'InStock', 'https://techevents.com/tickets')
  .eventStatus('EventScheduled')
  .eventAttendanceMode('OfflineEventAttendanceMode')
  .maximumAttendeeCapacity(500)
  .image('https://techevents.com/images/conference-2024.jpg', 1200, 630, 'Tech Conference 2024')
  .url('https://techevents.com/conference-2024')
  .build();

console.log('Basic Event Schema:');
console.log(JSON.stringify(basicEvent, null, 2));
console.log('\n---\n');

// Example 2: Advanced Schema - All optional properties
console.log('2. Advanced Event Schema with Optional Properties');
const advancedEvent = new EventBuilder(MODES.STRICT_SEO, true)
  .name('Music Festival 2024')
  .description('Annual music festival featuring top artists and emerging talent from around the world')
  .startDate('2024-07-20T18:00:00Z')
  .endDate('2024-07-22T23:00:00Z')
  .location('Central Park', 'Central Park, New York, NY 10024', 40.7829, -73.9654)
  .organizer('Music Events LLC', 'https://musicevents.com', 'info@musicevents.com')
  .performers([
    { '@type': 'Person', 'name': 'The Rock Band', 'url': 'https://therockband.com' },
    { '@type': 'PerformingGroup', 'name': 'Jazz Ensemble', 'url': 'https://jazzensemble.com' },
    { '@type': 'Person', 'name': 'Electronic Duo', 'url': 'https://electronicduo.com' }
  ])
  .offers({
    '@type': 'Offer',
    'price': '149.99',
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock',
    'url': 'https://musicevents.com/tickets',
    'validFrom': '2024-01-01T00:00:00Z',
    'validThrough': '2024-07-19T23:59:59Z'
  })
  .eventStatus('EventScheduled')
  .eventAttendanceMode('OfflineEventAttendanceMode')
  .maximumAttendeeCapacity(10000)
  .image('https://musicevents.com/images/festival-2024.jpg', 1200, 630, 'Music Festival 2024')
  .url('https://musicevents.com/festival-2024')
  .duration('PT53H')
  .keywords(['music', 'festival', 'live performance', 'entertainment', 'concerts'])
  .id('https://musicevents.com/festival-2024')
  .build();

console.log('Advanced Event Schema:');
console.log(JSON.stringify(advancedEvent, null, 2));
console.log('\n---\n');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('3. Google Rich Results Optimized Event');
const seoOptimizedEvent = new EventBuilder(MODES.STRICT_SEO, true)
  .name('Web Development Workshop')
  .description('Learn modern web development techniques including React, Node.js, and cloud deployment. Perfect for beginners and intermediate developers.')
  .startDate('2024-03-15T10:00:00Z')
  .endDate('2024-03-15T16:00:00Z')
  .location('Tech Hub', '456 Innovation Drive, Austin, TX 78701', 30.2672, -97.7431)
  .organizer('Web Dev Academy', 'https://webdevacademy.com', 'workshops@webdevacademy.com')
  .performer('Sarah Johnson', 'https://sarahjohnson.dev', 'Person')
  .offers('199.99', 'USD', 'InStock', 'https://webdevacademy.com/workshop-registration')
  .eventStatus('EventScheduled')
  .eventAttendanceMode('OfflineEventAttendanceMode')
  .maximumAttendeeCapacity(50)
  .image('https://webdevacademy.com/images/workshop-2024.jpg', 1200, 630, 'Web Development Workshop 2024')
  .url('https://webdevacademy.com/workshops/web-dev-2024')
  .duration('PT6H')
  .keywords(['web development', 'React', 'Node.js', 'workshop', 'programming', 'coding'])
  .build();

console.log('SEO Optimized Event Schema:');
console.log(JSON.stringify(seoOptimizedEvent, null, 2));
console.log('\n---\n');

// Example 4: LLM Optimized - AI-focused implementation
console.log('4. LLM Optimized Event');
const llmOptimizedEvent = new EventBuilder(MODES.SPLIT_CHANNELS, true)
  .name('AI and Machine Learning Summit')
  .description('Comprehensive summit covering the latest developments in artificial intelligence, machine learning, and their practical applications across industries.')
  .startDate('2024-09-20T08:00:00Z')
  .endDate('2024-09-22T18:00:00Z')
  .location('AI Research Center', '789 Future Street, Boston, MA 02108', 42.3601, -71.0589)
  .organizer('AI Research Institute', 'https://airesearch.org', 'summit@airesearch.org')
  .performers([
    { '@type': 'Person', 'name': 'Dr. Michael Chen', 'url': 'https://michaelchen.ai', 'jobTitle': 'Chief AI Scientist' },
    { '@type': 'Person', 'name': 'Dr. Lisa Wang', 'url': 'https://lisawang.ml', 'jobTitle': 'ML Research Director' },
    { '@type': 'Organization', 'name': 'Deep Learning Labs', 'url': 'https://deeplearninglabs.com' }
  ])
  .offers({
    '@type': 'Offer',
    'price': '899.99',
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock',
    'url': 'https://airesearch.org/summit-registration',
    'validFrom': '2024-01-01T00:00:00Z',
    'validThrough': '2024-09-19T23:59:59Z',
    'priceValidUntil': '2024-09-19'
  })
  .eventStatus('EventScheduled')
  .eventAttendanceMode('MixedEventAttendanceMode')
  .maximumAttendeeCapacity(1000)
  .image('https://airesearch.org/images/ai-summit-2024.jpg', 1200, 630, 'AI and Machine Learning Summit 2024')
  .url('https://airesearch.org/summit-2024')
  .duration('PT58H')
  .keywords(['artificial intelligence', 'machine learning', 'AI', 'ML', 'deep learning', 'neural networks', 'data science'])
  .id('https://airesearch.org/summit-2024')
  .build();

console.log('LLM Optimized Event Schema:');
console.log(JSON.stringify(llmOptimizedEvent, null, 2));
console.log('\n---\n');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('5. Standards Header Mode Event');
const standardsEvent = new EventBuilder(MODES.STANDARDS_HEADER, true)
  .name('Open Source Conference')
  .description('Annual conference celebrating open source software, featuring talks from maintainers, contributors, and users of popular open source projects.')
  .startDate('2024-11-10T09:00:00Z')
  .endDate('2024-11-12T17:00:00Z')
  .location('Open Source Center', '321 Community Way, Portland, OR 97201', 45.5152, -122.6784)
  .organizer('Open Source Foundation', 'https://opensourcefoundation.org', 'conference@opensourcefoundation.org')
  .performers([
    { '@type': 'Person', 'name': 'Linus Torvalds', 'url': 'https://linustorvalds.com' },
    { '@type': 'Person', 'name': 'Guido van Rossum', 'url': 'https://guido.python.org' },
    { '@type': 'Organization', 'name': 'Mozilla Foundation', 'url': 'https://mozilla.org' }
  ])
  .offers('0', 'USD', 'InStock', 'https://opensourcefoundation.org/conference-registration')
  .eventStatus('EventScheduled')
  .eventAttendanceMode('MixedEventAttendanceMode')
  .maximumAttendeeCapacity(2000)
  .image('https://opensourcefoundation.org/images/conference-2024.jpg', 1200, 630, 'Open Source Conference 2024')
  .url('https://opensourcefoundation.org/conference-2024')
  .duration('PT56H')
  .keywords(['open source', 'software', 'development', 'community', 'collaboration', 'free software'])
  .id('https://opensourcefoundation.org/conference-2024')
  .build();

console.log('Standards Header Mode Event Schema:');
console.log(JSON.stringify(standardsEvent, null, 2));
console.log('\n---\n');

// Example 6: Virtual Event
console.log('6. Virtual Event Example');
const virtualEvent = new EventBuilder(MODES.STRICT_SEO, true)
  .name('Online Webinar: AI Trends 2024')
  .description('Join us for an insightful webinar about the latest trends in artificial intelligence, featuring industry experts and practical insights.')
  .startDate('2024-02-15T14:00:00Z')
  .endDate('2024-02-15T15:30:00Z')
  .virtualLocation('https://webinar.example.com/ai-trends-2024', 'Online Webinar Platform')
  .organizer('AI Research Institute', 'https://airesearch.org', 'webinars@airesearch.org')
  .performer('Dr. Sarah Johnson', 'https://sarahjohnson.ai', 'Person')
  .offers('0', 'USD', 'InStock', 'https://webinar.example.com/register')
  .eventStatus('EventScheduled')
  .eventAttendanceMode('OnlineEventAttendanceMode')
  .maximumAttendeeCapacity(1000)
  .image('https://airesearch.org/images/webinar-ai-trends.jpg', 1200, 630, 'AI Trends 2024 Webinar')
  .url('https://airesearch.org/webinars/ai-trends-2024')
  .duration('PT1H30M')
  .keywords(['AI', 'webinar', 'education', 'technology trends', 'artificial intelligence'])
  .id('https://airesearch.org/webinars/ai-trends-2024')
  .build();

console.log('Virtual Event Schema:');
console.log(JSON.stringify(virtualEvent, null, 2));
console.log('\n---\n');

// Example 7: Cancelled Event
console.log('7. Cancelled Event Example');
const cancelledEvent = new EventBuilder(MODES.STRICT_SEO, true)
  .name('Postponed: Data Science Meetup')
  .description('Monthly data science meetup featuring presentations on machine learning, data visualization, and statistical analysis.')
  .startDate('2024-01-20T18:00:00Z')
  .endDate('2024-01-20T20:00:00Z')
  .location('Data Science Hub', '555 Analytics Avenue, Seattle, WA 98101', 47.6062, -122.3321)
  .organizer('Data Science Community', 'https://datasciencecommunity.org', 'meetups@datasciencecommunity.org')
  .performer('Dr. Alex Rodriguez', 'https://alexrodriguez.ds', 'Person')
  .offers('0', 'USD', 'OutOfStock', 'https://datasciencecommunity.org/meetup-registration')
  .eventStatus('EventCancelled')
  .eventAttendanceMode('OfflineEventAttendanceMode')
  .maximumAttendeeCapacity(100)
  .image('https://datasciencecommunity.org/images/meetup-2024.jpg', 1200, 630, 'Data Science Meetup 2024')
  .url('https://datasciencecommunity.org/meetups/data-science-2024')
  .duration('PT2H')
  .keywords(['data science', 'machine learning', 'statistics', 'meetup', 'networking'])
  .id('https://datasciencecommunity.org/meetups/data-science-2024')
  .build();

console.log('Cancelled Event Schema:');
console.log(JSON.stringify(cancelledEvent, null, 2));
console.log('\n---\n');

console.log('=== Event Schema Examples Complete ===');
console.log('All examples demonstrate:');
console.log('- Required properties: name, startDate, location');
console.log('- Recommended properties: description, endDate, organizer, performer, offers, eventStatus, eventAttendanceMode, maximumAttendeeCapacity, image, url');
console.log('- Optional properties: duration, keywords, id');
console.log('- Google Rich Results compliance');
console.log('- LLM optimization features');
console.log('- Multiple attendance modes (Offline, Online, Mixed)');
console.log('- Various event statuses (Scheduled, Cancelled)');
console.log('- Comprehensive location support (Physical and Virtual)');
console.log('- Enhanced performer support (Single and Multiple)');
console.log('- Detailed offer structures with pricing and availability');
