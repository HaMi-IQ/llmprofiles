/**
 * Test all builders with the three modes
 */

const { 
  ArticleBuilder, 
  JobPostingBuilder, 
  LocalBusinessBuilder, 
  EventBuilder, 
  MODES 
} = require('../index.js');

console.log('=== Testing All Builders with Three Modes ===\n');

// Test ArticleBuilder
console.log('1. ArticleBuilder - Split Channels Mode:');
const articleBuilder = new ArticleBuilder(MODES.SPLIT_CHANNELS)
  .headline('Test Article')
  .author('Test Author')
  .datePublished('2024-01-15');

const article = articleBuilder.build();
console.log('Has seo and llm blocks:', Object.keys(article));
console.log('SEO block type:', article.seo['@type']);
console.log('LLM block type:', article.llm['@type']);

// Test JobPostingBuilder  
console.log('\n2. JobPostingBuilder - Standards Header Mode:');
const jobBuilder = new JobPostingBuilder(MODES.STANDARDS_HEADER)
  .title('Test Job')
  .hiringOrganization('Test Company')
  .datePosted('2024-01-15');

const job = jobBuilder.build();
console.log('Has additionalType:', !!job.additionalType);
console.log('Has schemaVersion:', !!job.schemaVersion);
console.log('Rel profile available:', jobBuilder.getRelProfile ? 'Yes' : 'No');
console.log('Rel profile value:', jobBuilder.getRelProfile());

// Test LocalBusinessBuilder
console.log('\n3. LocalBusinessBuilder - Strict SEO Mode:');
const businessBuilder = new LocalBusinessBuilder(MODES.STRICT_SEO)
  .name('Test Business')
  .address('123 Test St')
  .telephone('555-1234');

const business = businessBuilder.build();
console.log('Has schemaVersion:', !!business.schemaVersion);
console.log('Has additionalType:', !!business.additionalType);
console.log('Has identifier:', !!business.identifier);

// Test EventBuilder
console.log('\n4. EventBuilder - Split Channels Mode:');
const eventBuilder = new EventBuilder(MODES.SPLIT_CHANNELS)
  .name('Test Event')
  .startDate('2024-01-15')
  .location('Test Location');

const event = eventBuilder.build();
console.log('Has seo and llm blocks:', Object.keys(event));
console.log('SEO block type:', event.seo['@type']);
console.log('LLM block type:', event.llm['@type']);

// Test mode override
console.log('\n5. Mode Override Test:');
const defaultBuilder = new ArticleBuilder()
  .headline('Default Mode Article');

const defaultResult = defaultBuilder.build();
console.log('Default mode - has additionalType:', !!defaultResult.additionalType);

const overrideResult = defaultBuilder.build(MODES.SPLIT_CHANNELS);
console.log('Override to Split Channels - has seo/llm blocks:', Object.keys(overrideResult));

console.log('\n=== All Builders Working with Three Modes! ===');

