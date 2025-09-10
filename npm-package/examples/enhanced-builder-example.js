/**
 * Enhanced Builder Example - Demonstrating new field discovery and autocomplete features
 * 
 * This example shows how to use the enhanced builder functionality including:
 * - Field metadata and suggestions
 * - Autocomplete and completion hints
 * - Inline validation with guidance
 * - Completion status tracking
 */

const { createBuilder, getFieldMetadata, getAllFieldsMetadata, getFieldSuggestions } = require('../index.js');

console.log('🚀 Enhanced Builder Example\n');

// Create an Article builder
const articleBuilder = createBuilder('Article');

console.log('📋 Article Builder - Initial State:');
console.log('=====================================');

// Get initial state summary
const initialState = articleBuilder.getStateSummary();
console.log(`Profile Type: ${initialState.profileType}`);
console.log(`Category: ${initialState.category}`);
console.log(`Mode: ${initialState.mode}`);
console.log(`Completion Score: ${initialState.completion.overall.score}% (${initialState.completion.overall.status})`);
console.log(`Field Counts: ${initialState.fieldCounts.required} required, ${initialState.fieldCounts.recommended} recommended, ${initialState.fieldCounts.optional} optional`);
console.log(`Current Fields: [${initialState.currentFields.join(', ')}]`);

console.log('\n🎯 Next Steps:');
initialState.nextSteps.forEach(step => {
  console.log(`  ${step.priority}. ${step.message}`);
  console.log(`     Fields: ${step.fields.join(', ')}`);
  console.log(`     Action: ${step.action}\n`);
});

// Get field suggestions
console.log('💡 Field Suggestions:');
const suggestions = articleBuilder.getSuggestions();
console.log(`Critical (Required): ${suggestions.critical.length} fields`);
suggestions.critical.forEach(field => {
  console.log(`  - ${field.name}: ${field.description}`);
  console.log(`    Examples: ${field.examples.join(', ')}`);
});

console.log(`\nImportant (Google Rich Results): ${suggestions.important.length} fields`);
suggestions.important.forEach(field => {
  console.log(`  - ${field.name}: ${field.description}`);
  console.log(`    Examples: ${field.examples.join(', ')}`);
});

// Get completion hints for autocomplete
console.log('\n🔍 Autocomplete Hints (first 5):');
const hints = articleBuilder.getCompletionHints();
hints.slice(0, 5).forEach(hint => {
  console.log(`  ${hint.label} (${hint.detail}) - ${hint.documentation}`);
});

// Get specific field metadata
console.log('\n📖 Field Metadata Examples:');
const headlineMetadata = getFieldMetadata('Article', 'headline');
if (headlineMetadata) {
  console.log(`Headline Field:`);
  console.log(`  Type: ${headlineMetadata.type}`);
  console.log(`  Importance: ${headlineMetadata.importance}`);
  console.log(`  Category: ${headlineMetadata.category}`);
  console.log(`  Description: ${headlineMetadata.description}`);
  console.log(`  Examples: ${headlineMetadata.examples.join(', ')}`);
  console.log(`  Google Rich Results: ${headlineMetadata.googleRichResults}`);
  console.log(`  LLM Optimized: ${headlineMetadata.llmOptimized}`);
}

// Build a partial article
console.log('\n✍️  Building Partial Article:');
articleBuilder
  .headline('The Future of AI in Web Development')
  .author('Jane Smith', 'https://example.com/author/jane-smith')
  .datePublished('2024-01-15T10:00:00Z');

// Check completion status after adding some fields
console.log('\n📊 Completion Status After Adding Fields:');
const completionStatus = articleBuilder.getCompletionStatus();
console.log(`Overall Score: ${completionStatus.overall.score}% (${completionStatus.overall.status})`);
console.log(`Required: ${completionStatus.required.completed}/${completionStatus.required.total} (${completionStatus.required.score}%)`);
console.log(`Recommended: ${completionStatus.recommended.completed}/${completionStatus.recommended.total} (${completionStatus.recommended.score}%)`);

// Get missing fields
console.log('\n❌ Missing Required Fields:');
const missingRequired = articleBuilder.getMissingRequired();
missingRequired.forEach(field => {
  console.log(`  - ${field.name}: ${field.description}`);
  console.log(`    Examples: ${field.examples.join(', ')}`);
});

// Inline validation
console.log('\n🔍 Inline Validation:');
const validation = articleBuilder.validateInline();
console.log(`Valid: ${validation.valid}`);
console.log(`Score: ${validation.score}%`);
console.log(`Status: ${validation.status}`);

if (validation.errors.length > 0) {
  console.log('\nErrors:');
  validation.errors.forEach(error => {
    console.log(`  - ${error.field}: ${error.enhancedMessage || error.message}`);
    if (error.suggestions) {
      error.suggestions.forEach(suggestion => {
        console.log(`    ${suggestion.title}: ${suggestion.items.join(', ')}`);
      });
    }
  });
}

if (validation.warnings.length > 0) {
  console.log('\nWarnings:');
  validation.warnings.forEach(warning => {
    console.log(`  - ${warning.field}: ${warning.enhancedMessage || warning.message}`);
    if (warning.priority) {
      console.log(`    Priority: ${warning.priority} - ${warning.reason}`);
    }
  });
}

// Get Google Rich Results fields
console.log('\n🎯 Google Rich Results Fields:');
const googleFields = articleBuilder.getGoogleRichResultsFields();
googleFields.forEach(field => {
  console.log(`  - ${field.name}: ${field.description}`);
});

// Get LLM Optimized fields
console.log('\n🤖 LLM Optimized Fields:');
const llmFields = articleBuilder.getLLMOptimizedFields();
llmFields.forEach(field => {
  console.log(`  - ${field.name}: ${field.description}`);
});

// Complete the article with all required fields
console.log('\n✅ Completing Article with All Required Fields:');
articleBuilder
  .description('An in-depth look at how artificial intelligence is transforming web development practices and tools.')
  .articleBody('Artificial intelligence is revolutionizing web development...')
  .publisher('Tech Blog', 'https://example.com', 'https://example.com/logo.png')
  .image('https://example.com/article-image.jpg')
  .keywords(['AI', 'Web Development', 'Technology', 'Future']);

// Final validation
console.log('\n🎉 Final Validation:');
const finalValidation = articleBuilder.validateInline();
console.log(`Valid: ${finalValidation.valid}`);
console.log(`Score: ${finalValidation.score}%`);
console.log(`Status: ${finalValidation.status}`);

// Build the final structured data
const structuredData = articleBuilder.build();
console.log('\n📄 Final Structured Data:');
console.log(JSON.stringify(structuredData, null, 2));

console.log('\n✨ Example completed! The enhanced builder provides:');
console.log('  - Field discovery and metadata');
console.log('  - Intelligent suggestions and autocomplete');
console.log('  - Real-time validation with guidance');
console.log('  - Completion status tracking');
console.log('  - Google Rich Results optimization');
console.log('  - LLM processing optimization');
