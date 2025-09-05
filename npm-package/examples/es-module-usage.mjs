/**
 * Example: Using ES Module imports with individual profiles
 */

// Import individual profiles
import { articleProfile } from '@llmprofiles/core/profiles/article';
import { jobpostingProfile } from '@llmprofiles/core/profiles/jobposting';
import { productofferProfile } from '@llmprofiles/core/profiles/product';

// Import builders and utilities
import { ArticleBuilder, JobPostingBuilder, ProductBuilder, MODES } from '@llmprofiles/core';

console.log('ES Module Usage Examples\n');

// Example 1: Using individual profile data
console.log('1. Individual Profile Data:');
console.log('Article profile type:', articleProfile.type);
console.log('Article required fields:', Object.keys(articleProfile.required));
console.log('Article Google Rich Results fields:', articleProfile.googleRichResults);

// Example 2: Building structured data with individual profile context
console.log('\n2. Building with Profile Context:');
const article = new ArticleBuilder(MODES.STRICT_SEO)
  .headline('How to Use ES Modules with LLM Profiles')
  .author('Jane Developer')
  .datePublished('2024-01-15T10:00:00Z')
  .articleBody('This article demonstrates how to use ES modules with individual profile imports.')
  .keywords(['ES modules', 'JavaScript', 'LLM profiles'])
  .build();

console.log('Generated article:', {
  '@type': article['@type'],
  'headline': article.headline,
  'author': article.author,
  'additionalType': article.additionalType
});

// Example 3: Using different modes
console.log('\n3. Different Output Modes:');

// Strict SEO mode
const seoArticle = new ArticleBuilder(MODES.STRICT_SEO)
  .headline('SEO Optimized Article')
  .author('SEO Expert')
  .build();

// Split Channels mode
const splitArticle = new ArticleBuilder(MODES.SPLIT_CHANNELS)
  .headline('Split Channels Article')
  .author('LLM Expert')
  .build();

console.log('Strict SEO mode output keys:', Object.keys(seoArticle));
console.log('Split Channels mode output keys:', Object.keys(splitArticle));
console.log('Split Channels has seo/llm blocks:', 'seo' in splitArticle && 'llm' in splitArticle);

// Example 4: Working with multiple profile types
console.log('\n4. Multiple Profile Types:');

const jobPosting = new JobPostingBuilder(MODES.STRICT_SEO)
  .title('Senior JavaScript Developer')
  .hiringOrganization('Tech Corp')
  .jobLocation('San Francisco, CA')
  .datePosted('2024-01-15')
  .build();

const product = new ProductBuilder(MODES.STRICT_SEO)
  .name('Wireless Headphones')
  .description('High-quality wireless headphones')
  .brand('AudioTech')
  .offers(99.99, 'USD', 'InStock')
  .build();

console.log('Job posting type:', jobPosting['@type']);
console.log('Product type:', product['@type']);
console.log('Both use profile URLs:', 
  jobPosting.additionalType?.includes('llmprofiles.org'),
  product.additionalType?.includes('llmprofiles.org')
);

console.log('\n✅ All ES Module examples completed successfully!');
