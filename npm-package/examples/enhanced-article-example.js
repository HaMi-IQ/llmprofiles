/**
 * Enhanced Article Schema Examples
 * Demonstrates the enhanced Article schema implementation with Google Rich Results compliance
 */

const { ArticleBuilder } = require('../lib/builder');

console.log('=== Enhanced Article Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema');
const basicArticle = new ArticleBuilder()
  .headline('The Future of Artificial Intelligence in Web Development')
  .description('A comprehensive exploration of how AI technologies are revolutionizing web development practices and creating new opportunities for developers.')
  .author('Sarah Johnson', 'https://example.com/author/sarah-johnson')
  .datePublished('2024-01-15T10:00:00Z')
  .image('https://example.com/ai-web-dev.jpg', 1200, 630, 'AI and web development concepts')
  .publisher('Tech Insights', 'https://example.com', 'https://example.com/logo.png', 200, 60)
  .build();

console.log('Basic Article JSON-LD:');
console.log(JSON.stringify(basicArticle, null, 2));
console.log('\n');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema with All Properties');
const advancedArticle = new ArticleBuilder()
  .headline('Complete Guide to Modern JavaScript Frameworks')
  .description('An in-depth analysis of the most popular JavaScript frameworks in 2024, including React, Vue, Angular, and Svelte, with performance comparisons and best practices.')
  .author({
    '@type': 'Person',
    'name': 'Michael Chen',
    'url': 'https://example.com/author/michael-chen',
    'jobTitle': 'Senior Frontend Developer',
    'worksFor': {
      '@type': 'Organization',
      'name': 'WebDev Solutions'
    }
  })
  .datePublished('2024-01-15T10:00:00Z')
  .dateModified('2024-01-16T14:30:00Z')
  .image({
    '@type': 'ImageObject',
    'url': 'https://example.com/js-frameworks.jpg',
    'width': 1200,
    'height': 630,
    'caption': 'JavaScript frameworks comparison chart'
  })
  .publisher('WebDev Solutions', 'https://webdevsolutions.com', 'https://webdevsolutions.com/logo.png', 200, 60)
  .articleBody('This comprehensive guide explores the current landscape of JavaScript frameworks...')
  .articleSection('Web Development')
  .keywords(['JavaScript', 'React', 'Vue', 'Angular', 'Svelte', 'Frontend', 'Frameworks'])
  .wordCount(2500)
  .url('https://example.com/articles/js-frameworks-guide')
  .inLanguage('en')
  .mainEntityOfPage('https://example.com/articles/js-frameworks-guide')
  .speakable(['.article-content', '.key-points', '.summary'])
  .about({
    '@type': 'Thing',
    'name': 'JavaScript Frameworks',
    'description': 'Modern JavaScript frameworks for web development'
  })
  .addMention('React')
  .addMention('Vue.js')
  .addMention({
    '@type': 'Organization',
    'name': 'Meta',
    'url': 'https://meta.com'
  })
  .isPartOf('https://example.com/series/web-development-guides', 'Web Development Guide Series')
  .build();

console.log('Advanced Article JSON-LD:');
console.log(JSON.stringify(advancedArticle, null, 2));
console.log('\n');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized');
const seoOptimizedArticle = new ArticleBuilder('strict-seo')
  .headline('10 Essential SEO Strategies for E-commerce Websites in 2024')
  .description('Discover the most effective SEO strategies that e-commerce businesses must implement to improve search rankings and drive organic traffic in 2024.')
  .author('Emma Rodriguez', 'https://example.com/author/emma-rodriguez')
  .datePublished('2024-01-15T09:00:00Z')
  .dateModified('2024-01-15T09:00:00Z')
  .image('https://example.com/seo-ecommerce.jpg', 1200, 630, 'SEO strategies for e-commerce')
  .publisher('SEO Masters', 'https://seomasters.com', 'https://seomasters.com/logo.png', 200, 60)
  .articleBody('E-commerce SEO requires a strategic approach that combines technical optimization with content marketing...')
  .articleSection('Digital Marketing')
  .keywords(['SEO', 'E-commerce', 'Search Optimization', 'Digital Marketing', 'Online Business'])
  .wordCount(1800)
  .url('https://seomasters.com/articles/ecommerce-seo-strategies-2024')
  .inLanguage('en')
  .mainEntityOfPage('https://seomasters.com/articles/ecommerce-seo-strategies-2024')
  .speakable(['.article-content', '.key-strategies'])
  .about({
    '@type': 'Thing',
    'name': 'E-commerce SEO',
    'description': 'Search engine optimization strategies for online stores'
  })
  .mentions(['Google Search Console', 'Core Web Vitals', 'Schema Markup'])
  .build();

console.log('SEO Optimized Article JSON-LD:');
console.log(JSON.stringify(seoOptimizedArticle, null, 2));
console.log('\n');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized');
const llmOptimizedArticle = new ArticleBuilder('split-channels')
  .headline('Understanding Large Language Models: Architecture and Applications')
  .description('A detailed technical exploration of large language model architectures, training methodologies, and real-world applications across various industries.')
  .author({
    '@type': 'Person',
    'name': 'Dr. Alex Thompson',
    'url': 'https://example.com/author/alex-thompson',
    'jobTitle': 'AI Research Scientist',
    'worksFor': {
      '@type': 'Organization',
      'name': 'AI Research Institute'
    }
  })
  .datePublished('2024-01-15T11:00:00Z')
  .dateModified('2024-01-16T16:45:00Z')
  .image('https://example.com/llm-architecture.jpg', 1200, 630, 'LLM architecture diagram')
  .publisher('AI Research Institute', 'https://airesearch.org', 'https://airesearch.org/logo.png', 200, 60)
  .articleBody('Large Language Models represent a significant advancement in artificial intelligence...')
  .articleSection('Artificial Intelligence')
  .keywords(['LLM', 'GPT', 'BERT', 'Transformer', 'Neural Networks', 'Machine Learning', 'NLP'])
  .wordCount(3200)
  .url('https://airesearch.org/articles/understanding-llm-architecture')
  .inLanguage('en')
  .mainEntityOfPage('https://airesearch.org/articles/understanding-llm-architecture')
  .speakable(['.technical-content', '.key-concepts', '.applications'])
  .about({
    '@type': 'Thing',
    'name': 'Large Language Models',
    'description': 'Advanced AI models for natural language processing and generation'
  })
  .addMention('GPT-4')
  .addMention('BERT')
  .addMention('Transformer Architecture')
  .addMention({
    '@type': 'Organization',
    'name': 'OpenAI',
    'url': 'https://openai.com'
  })
  .addMention({
    '@type': 'Organization',
    'name': 'Google Research',
    'url': 'https://research.google'
  })
  .isPartOf({
    '@type': 'CreativeWorkSeries',
    'name': 'AI Research Papers',
    'url': 'https://airesearch.org/series/ai-papers'
  })
  .build();

console.log('LLM Optimized Article JSON-LD:');
console.log(JSON.stringify(llmOptimizedArticle, null, 2));
console.log('\n');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode');
const standardsArticle = new ArticleBuilder('standards-header')
  .headline('Web Accessibility Guidelines: WCAG 2.2 Implementation')
  .description('A comprehensive guide to implementing Web Content Accessibility Guidelines (WCAG) 2.2 standards in modern web applications.')
  .author('Lisa Park', 'https://example.com/author/lisa-park')
  .datePublished('2024-01-15T08:00:00Z')
  .dateModified('2024-01-16T12:00:00Z')
  .image('https://example.com/wcag-accessibility.jpg', 1200, 630, 'Web accessibility concepts')
  .publisher('Accessibility First', 'https://accessibilityfirst.org', 'https://accessibilityfirst.org/logo.png', 200, 60)
  .articleBody('Web accessibility is not just a legal requirement but a fundamental principle of inclusive design...')
  .articleSection('Web Development')
  .keywords(['Accessibility', 'WCAG', 'Web Standards', 'Inclusive Design', 'A11y'])
  .wordCount(2200)
  .url('https://accessibilityfirst.org/articles/wcag-2-2-implementation')
  .inLanguage('en')
  .mainEntityOfPage('https://accessibilityfirst.org/articles/wcag-2-2-implementation')
  .speakable(['.article-content', '.guidelines', '.implementation-tips'])
  .about({
    '@type': 'Thing',
    'name': 'Web Accessibility',
    'description': 'Standards and practices for making web content accessible to all users'
  })
  .mentions(['WCAG 2.2', 'ARIA', 'Screen Readers', 'Keyboard Navigation'])
  .build();

console.log('Standards Header Article JSON-LD:');
console.log(JSON.stringify(standardsArticle, null, 2));
console.log('\n');

// Example 6: Multiple Authors
console.log('Example 6: Multiple Authors');
const multiAuthorArticle = new ArticleBuilder()
  .headline('Collaborative Research: The Impact of Remote Work on Software Development')
  .description('A joint research study examining how remote work has transformed software development practices and team collaboration.')
  .author([
    {
      '@type': 'Person',
      'name': 'Dr. Maria Garcia',
      'url': 'https://example.com/author/maria-garcia'
    },
    {
      '@type': 'Person',
      'name': 'Prof. James Wilson',
      'url': 'https://example.com/author/james-wilson'
    }
  ])
  .datePublished('2024-01-15T13:00:00Z')
  .image('https://example.com/remote-work-research.jpg', 1200, 630, 'Remote work research study')
  .publisher('Research Journal', 'https://researchjournal.org', 'https://researchjournal.org/logo.png', 200, 60)
  .articleBody('This collaborative research study examines the transformation of software development...')
  .articleSection('Research')
  .keywords(['Remote Work', 'Software Development', 'Team Collaboration', 'Research'])
  .wordCount(2800)
  .url('https://researchjournal.org/articles/remote-work-software-development')
  .inLanguage('en')
  .about({
    '@type': 'Thing',
    'name': 'Remote Work',
    'description': 'Work practices conducted outside traditional office environments'
  })
  .build();

console.log('Multiple Authors Article JSON-LD:');
console.log(JSON.stringify(multiAuthorArticle, null, 2));
console.log('\n');

// Example 7: Organization as Author
console.log('Example 7: Organization as Author');
const orgAuthorArticle = new ArticleBuilder()
  .headline('Industry Report: Cybersecurity Trends 2024')
  .description('Comprehensive analysis of cybersecurity trends, threats, and solutions for the year 2024.')
  .author({
    '@type': 'Organization',
    'name': 'Cybersecurity Research Group',
    'url': 'https://example.com/cybersecurity-research'
  })
  .datePublished('2024-01-15T15:00:00Z')
  .image('https://example.com/cybersecurity-trends.jpg', 1200, 630, 'Cybersecurity trends visualization')
  .publisher('Security Insights', 'https://securityinsights.com', 'https://securityinsights.com/logo.png', 200, 60)
  .articleBody('The cybersecurity landscape continues to evolve rapidly...')
  .articleSection('Cybersecurity')
  .keywords(['Cybersecurity', 'Threats', 'Security Trends', 'Risk Management'])
  .wordCount(2000)
  .url('https://securityinsights.com/reports/cybersecurity-trends-2024')
  .inLanguage('en')
  .about({
    '@type': 'Thing',
    'name': 'Cybersecurity',
    'description': 'Protection of computer systems and networks from digital attacks'
  })
  .mentions(['Ransomware', 'Zero Trust', 'AI Security', 'Cloud Security'])
  .build();

console.log('Organization Author Article JSON-LD:');
console.log(JSON.stringify(orgAuthorArticle, null, 2));
console.log('\n');

console.log('=== Examples Complete ===');
console.log('These examples demonstrate:');
console.log('1. Basic enhanced schema with all required properties');
console.log('2. Advanced schema with all optional properties');
console.log('3. Google Rich Results optimized implementation');
console.log('4. LLM optimized implementation');
console.log('5. Standards header mode implementation');
console.log('6. Multiple authors handling');
console.log('7. Organization as author');
