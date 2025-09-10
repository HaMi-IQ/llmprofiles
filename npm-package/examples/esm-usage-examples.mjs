/**
 * ESM (ES Module) Usage Examples for Enhanced @llmprofiles/core
 * 
 * This file demonstrates all the different ways to use the enhanced features
 * with ES Module imports and exports.
 */

// ===== BASIC IMPORTS =====

// Import specific builders
import { ArticleBuilder, JobPostingBuilder, EventBuilder } from '@llmprofiles/core';

// Import field metadata utilities
import { 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints,
  FIELD_IMPORTANCE,
  FIELD_CATEGORY 
} from '@llmprofiles/core';

// Import validation and utilities
import { ProfileValidator, MODES, ModeConfig } from '@llmprofiles/core';

// Import helper functions
import { createBuilder, createMinimalExample } from '@llmprofiles/core';

// ===== ALTERNATIVE IMPORT PATTERNS =====

// Import everything (not recommended for tree-shaking)
// import * as LLMProfiles from '@llmprofiles/core';

// Import with aliases
import { 
  ArticleBuilder as Article, 
  JobPostingBuilder as JobPosting,
  ProfileValidator as Validator 
} from '@llmprofiles/core';

// ===== EXAMPLE 1: BASIC ARTICLE BUILDER =====

console.log('📰 Example 1: Basic Article Builder');
console.log('=====================================');

const article = new ArticleBuilder();

// Use enhanced field discovery
const headlineMetadata = article.getFieldMetadata('headline');
console.log('Headline field metadata:', headlineMetadata);

// Get all available fields
const allFields = article.getAllFieldsMetadata();
console.log(`Available fields: ${allFields.required.length} required, ${allFields.recommended.length} recommended, ${allFields.optional.length} optional`);

// Build article with enhanced guidance
article
  .headline('The Future of Web Development')
  .author('Jane Smith', 'https://example.com/author')
  .datePublished('2024-01-15T10:00:00Z')
  .description('Exploring the latest trends in web development')
  .articleBody('Web development is evolving rapidly...')
  .publisher('Tech Blog', 'https://example.com', 'https://example.com/logo.png')
  .image('https://example.com/article-image.jpg')
  .keywords(['web development', 'technology', 'future']);

// Get completion status
const status = article.getCompletionStatus();
console.log(`Completion: ${status.overall.score}% (${status.overall.status})`);

// Validate inline
const validation = article.validateInline();
console.log(`Valid: ${validation.valid}, Errors: ${validation.errors.length}, Warnings: ${validation.warnings.length}`);

// Build final structured data
const structuredData = article.build();
console.log('✅ Article built successfully');

// ===== EXAMPLE 2: JOB POSTING WITH SUGGESTIONS =====

console.log('\n💼 Example 2: Job Posting with Smart Suggestions');
console.log('================================================');

const jobPosting = new JobPostingBuilder();

// Get field suggestions before building
const suggestions = jobPosting.getSuggestions();
console.log(`Missing required fields: ${suggestions.critical.length}`);
console.log(`Google Rich Results fields: ${suggestions.important.length}`);

// Get autocomplete hints
const hints = jobPosting.getCompletionHints('title');
console.log('Autocomplete hints for "title":', hints);

// Build job posting
jobPosting
  .title('Senior Frontend Developer')
  .description('Join our team as a senior frontend developer...')
  .hiringOrganization('Tech Company Inc.', 'https://example.com/company')
  .jobLocation('San Francisco, CA')
  .datePosted('2024-01-15')
  .employmentType('FULL_TIME')
  .baseSalary(135000, 'USD', 'YEAR', 120000, 150000);

// Get next steps
const nextSteps = jobPosting.getNextSteps();
console.log('Next steps:');
nextSteps.forEach(step => {
  console.log(`  ${step.priority}. ${step.message}`);
});

// ===== EXAMPLE 3: EVENT WITH FIELD METADATA =====

console.log('\n🎉 Example 3: Event with Field Metadata');
console.log('======================================');

const event = new EventBuilder();

// Get specific field metadata
const nameMetadata = event.getFieldMetadata('name');
const startDateMetadata = event.getFieldMetadata('startDate');
const locationMetadata = event.getFieldMetadata('location');

console.log('Name field:', nameMetadata?.description);
console.log('Start date field:', startDateMetadata?.examples);
console.log('Location field:', locationMetadata?.guidance?.message);

// Build event
event
  .name('Web Development Conference 2024')
  .description('Annual conference for web developers')
  .startDate('2024-06-15T09:00:00Z')
  .endDate('2024-06-15T17:00:00Z')
  .location('San Francisco Convention Center')
  .organizer('Web Dev Events', 'https://example.com/events')
  .offers({
    '@type': 'Offer',
    'price': '299',
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock'
  });

// Get Google Rich Results fields
const googleFields = event.getGoogleRichResultsFields();
console.log('Google Rich Results fields:', googleFields.map(f => f.name));

// ===== EXAMPLE 4: USING FIELD METADATA UTILITIES DIRECTLY =====

console.log('\n🔍 Example 4: Direct Field Metadata Usage');
console.log('=========================================');

// Get metadata for any profile type
const articleFields = getAllFieldsMetadata('Article');
const jobFields = getAllFieldsMetadata('JobPosting');

console.log('Article fields:', {
  required: articleFields.required.length,
  recommended: articleFields.recommended.length,
  optional: articleFields.optional.length
});

console.log('Job posting fields:', {
  required: jobFields.required.length,
  recommended: jobFields.recommended.length,
  optional: jobFields.optional.length
});

// Get field suggestions for any profile type
const articleSuggestions = getFieldSuggestions('Article', {
  '@type': 'Article',
  'headline': 'Test Article'
});

console.log('Article suggestions:', {
  critical: articleSuggestions.critical.length,
  important: articleSuggestions.important.length,
  helpful: articleSuggestions.helpful.length,
  optional: articleSuggestions.optional.length
});

// Get completion hints
const completionHints = getCompletionHints('Article', 'auth');
console.log('Completion hints for "auth":', completionHints);

// ===== EXAMPLE 5: VALIDATION WITH ENHANCED FEATURES =====

console.log('\n✅ Example 5: Enhanced Validation');
console.log('================================');

const validator = new ProfileValidator();

// Validate with enhanced error messages
const testData = {
  '@type': 'Article',
  'headline': 'Test Article'
  // Missing required fields
};

const result = validator.validate(testData, 'Article');
console.log('Validation result:', {
  valid: result.valid,
  errors: result.errors.length,
  warnings: result.warnings.length
});

// Show enhanced error messages
result.errors.forEach(error => {
  console.log(`Error: ${error.enhancedMessage || error.message}`);
  if (error.suggestions) {
    error.suggestions.forEach(suggestion => {
      console.log(`  ${suggestion.title}: ${suggestion.items.join(', ')}`);
    });
  }
});

// Show enhanced warnings
result.warnings.forEach(warning => {
  console.log(`Warning: ${warning.enhancedMessage || warning.message}`);
  if (warning.priority) {
    console.log(`  Priority: ${warning.priority} - ${warning.reason}`);
  }
});

// ===== EXAMPLE 6: MODE CONFIGURATION =====

console.log('\n⚙️ Example 6: Mode Configuration');
console.log('===============================');

// Create builder with specific mode
const seoArticle = new ArticleBuilder(MODES.STRICT_SEO);
const llmArticle = new ArticleBuilder(MODES.SPLIT_CHANNELS);
const standardsArticle = new ArticleBuilder(MODES.STANDARDS_HEADER);

console.log('SEO mode:', seoArticle.getRelProfile());
console.log('LLM mode:', llmArticle.getRelProfile());
console.log('Standards mode:', standardsArticle.getRelProfile());

// ===== EXAMPLE 7: CREATING MINIMAL EXAMPLES =====

console.log('\n📝 Example 7: Minimal Examples');
console.log('==============================');

// Create minimal examples for different profiles
const articleExample = createMinimalExample('Article');
const jobExample = createMinimalExample('JobPosting');
const eventExample = createMinimalExample('Event');

console.log('Article example:', Object.keys(articleExample || {}));
console.log('Job posting example:', Object.keys(jobExample || {}));
console.log('Event example:', Object.keys(eventExample || {}));

// ===== EXAMPLE 8: FIELD IMPORTANCE AND CATEGORIES =====

console.log('\n🏷️ Example 8: Field Importance and Categories');
console.log('============================================');

console.log('Field importance levels:', FIELD_IMPORTANCE);
console.log('Field categories:', FIELD_CATEGORY);

// Get fields by category
const articleMetadata = getAllFieldsMetadata('Article');
const contentFields = articleMetadata.required.filter(f => f.category === FIELD_CATEGORY.CONTENT);
const metadataFields = articleMetadata.recommended.filter(f => f.category === FIELD_CATEGORY.METADATA);

console.log('Content fields:', contentFields.map(f => f.name));
console.log('Metadata fields:', metadataFields.map(f => f.name));

// ===== EXAMPLE 9: COMPREHENSIVE BUILDER STATE =====

console.log('\n📊 Example 9: Comprehensive Builder State');
console.log('========================================');

const comprehensiveBuilder = new ArticleBuilder();

// Build a comprehensive article
comprehensiveBuilder
  .headline('Complete Guide to Modern Web Development')
  .author('John Doe', 'https://example.com/author/john-doe')
  .datePublished('2024-01-15T10:00:00Z')
  .dateModified('2024-01-16T14:30:00Z')
  .description('A comprehensive guide covering all aspects of modern web development')
  .articleBody('Modern web development encompasses...')
  .publisher('Web Dev Blog', 'https://example.com/blog', 'https://example.com/logo.png')
  .image('https://example.com/guide-image.jpg')
  .keywords(['web development', 'javascript', 'react', 'node.js'])
  .articleSection('Technology')
  .wordCount(2500)
  .inLanguage('en-US')
  .mainEntityOfPage('https://example.com/guide')
  .about('Web Development')
  .mentions(['React', 'Vue.js', 'Angular']);

// Get comprehensive state summary
const stateSummary = comprehensiveBuilder.getStateSummary();
console.log('Builder state summary:', {
  profileType: stateSummary.profileType,
  category: stateSummary.category,
  mode: stateSummary.mode,
  completion: stateSummary.completion.overall,
  fieldCounts: stateSummary.fieldCounts,
  currentFields: stateSummary.currentFields.length,
  nextSteps: stateSummary.nextSteps.length
});

// Get LLM optimized fields
const llmFields = comprehensiveBuilder.getLLMOptimizedFields();
console.log('LLM optimized fields:', llmFields.map(f => f.name));

// ===== EXAMPLE 10: TYPESCRIPT USAGE (COMMENTED) =====

/*
// TypeScript usage examples (uncomment for TypeScript projects)

import type { 
  FieldMetadata, 
  FieldSuggestions, 
  CompletionStatus, 
  InlineValidationResult,
  BuilderStateSummary 
} from '@llmprofiles/core';

const article: ArticleBuilder = new ArticleBuilder();
const metadata: FieldMetadata | null = article.getFieldMetadata('headline');
const suggestions: FieldSuggestions = article.getSuggestions();
const status: CompletionStatus = article.getCompletionStatus();
const validation: InlineValidationResult = article.validateInline();
const summary: BuilderStateSummary = article.getStateSummary();
*/

console.log('\n🎉 All ESM examples completed successfully!');
console.log('\nKey ESM usage patterns:');
console.log('1. Import specific builders: import { ArticleBuilder } from "@llmprofiles/core"');
console.log('2. Import field metadata: import { getFieldMetadata, getAllFieldsMetadata } from "@llmprofiles/core"');
console.log('3. Import validation: import { ProfileValidator } from "@llmprofiles/core"');
console.log('4. Import utilities: import { createBuilder, MODES } from "@llmprofiles/core"');
console.log('5. Use enhanced methods: builder.getSuggestions(), builder.validateInline()');
console.log('6. Get field metadata: getFieldMetadata("Article", "headline")');
console.log('7. Get completion hints: getCompletionHints("Article", "partial")');
