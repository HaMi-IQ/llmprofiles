/**
 * Enhanced FAQ Schema Example
 * Demonstrates the new Google Rich Results compliant FAQ implementation
 */

const { FAQPageBuilder } = require('../lib/builders/faqpage-builder');
const { MODES } = require('../lib/modes');

// Example 1: Basic FAQ with all new required properties
console.log('=== Example 1: Basic Enhanced FAQ ===');
const basicFAQ = new FAQPageBuilder(MODES.STRICT_SEO)
  .name('Frequently Asked Questions - Product Support')
  .description('Common questions and answers about our product features and support')
  .url('https://example.com/faq')
  .dateCreated('2024-01-15T10:00:00Z')
  .dateModified('2024-01-20T15:30:00Z')
  .author('John Doe', 'https://example.com/author/john-doe')
  .publisher('Example Corp', 'https://example.com', 'https://example.com/logo.png')
  .inLanguage('en')
  .addQuestion('How do I reset my password?', 'You can reset your password by clicking the "Forgot Password" link on the login page.')
  .addQuestion('What are your business hours?', 'We are open Monday through Friday, 9 AM to 6 PM EST.')
  .addQuestion('Do you offer refunds?', 'Yes, we offer a 30-day money-back guarantee for all purchases.')
  .build();

console.log(JSON.stringify(basicFAQ, null, 2));

// Example 2: Advanced FAQ with all optional properties
console.log('\n=== Example 2: Advanced FAQ with Optional Properties ===');
const advancedFAQ = new FAQPageBuilder(MODES.SPLIT_CHANNELS)
  .name('Advanced Product FAQ')
  .description('Comprehensive FAQ with advanced features and metadata')
  .url('https://example.com/advanced-faq')
  .dateCreated('2024-01-15T10:00:00Z')
  .dateModified('2024-01-20T15:30:00Z')
  .author({
    '@type': 'Organization',
    'name': 'Support Team',
    'url': 'https://example.com/support-team'
  })
  .publisher({
    '@type': 'Organization',
    'name': 'Example Corp',
    'url': 'https://example.com',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://example.com/logo.png'
    }
  })
  .keywords(['support', 'help', 'faq', 'product', 'troubleshooting'])
  .addSpeakableContent(['.faq-question', '.faq-answer'])
  .addInteractionStat('ReadAction', 1250)
  .addInteractionStat('LikeAction', 89)
  .mainContentOfPage({
    '@type': 'WebPageElement',
    'cssSelector': '#main-faq-content'
  })
  .breadcrumb({
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://example.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Support',
        'item': 'https://example.com/support'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': 'FAQ',
        'item': 'https://example.com/faq'
      }
    ]
  })
  .isAccessibleForFree(true)
  .license('https://creativecommons.org/licenses/by/4.0/')
  .contentRating({
    '@type': 'Rating',
    'ratingValue': 'G',
    'author': {
      '@type': 'Organization',
      'name': 'Content Rating Board'
    }
  })
  .addQuestionWithAuthor(
    'How do I contact support?',
    'You can contact our support team via email at support@example.com or through our live chat feature.',
    'Support Team',
    '2024-01-15T10:00:00Z',
    'Contact Support',
    'https://example.com/faq/contact-support'
  )
  .addQuestionWithMetadata(
    'What payment methods do you accept?',
    'We accept all major credit cards, PayPal, and bank transfers.',
    {
      name: 'Payment Methods',
      url: 'https://example.com/faq/payment-methods',
      dateCreated: '2024-01-15T10:00:00Z',
      author: {
        '@type': 'Person',
        'name': 'Finance Team'
      },
      upvoteCount: 45,
      downvoteCount: 2
    }
  )
  .addQuestionWithKeywords(
    'How do I cancel my subscription?',
    'You can cancel your subscription at any time from your account settings page.',
    ['subscription', 'cancel', 'billing', 'account'],
    'Cancel Subscription',
    'https://example.com/faq/cancel-subscription'
  )
  .build();

console.log(JSON.stringify(advancedFAQ, null, 2));

// Example 3: Google Rich Results Optimized FAQ
console.log('\n=== Example 3: Google Rich Results Optimized FAQ ===');
const googleOptimizedFAQ = new FAQPageBuilder(MODES.STRICT_SEO)
  .name('Product FAQ - Google Rich Results Optimized')
  .description('SEO-optimized FAQ page designed for Google Rich Results')
  .url('https://example.com/product-faq')
  .dateCreated('2024-01-15T10:00:00Z')
  .dateModified('2024-01-20T15:30:00Z')
  .author('Product Team', 'https://example.com/team/product')
  .publisher('Example Corp', 'https://example.com', 'https://example.com/logo.png')
  .keywords(['product', 'faq', 'help', 'support', 'questions', 'answers'])
  .addQuestion('What is your product?', 'Our product is a comprehensive solution for managing digital workflows and team collaboration.')
  .addQuestion('How much does it cost?', 'Our pricing starts at $29/month for the basic plan, with enterprise options available.')
  .addQuestion('Do you offer a free trial?', 'Yes, we offer a 14-day free trial with full access to all features.')
  .addQuestion('What integrations do you support?', 'We support over 50 integrations including Slack, Microsoft Teams, Google Workspace, and more.')
  .addQuestion('Is my data secure?', 'Yes, we use enterprise-grade security with SOC 2 compliance and end-to-end encryption.')
  .build();

console.log(JSON.stringify(googleOptimizedFAQ, null, 2));

// Example 4: LLM Optimized FAQ with Split Channels
console.log('\n=== Example 4: LLM Optimized FAQ (Split Channels Mode) ===');
const llmOptimizedFAQ = new FAQPageBuilder(MODES.SPLIT_CHANNELS)
  .name('AI-Optimized FAQ')
  .description('FAQ optimized for both search engines and AI language models')
  .url('https://example.com/ai-faq')
  .dateCreated('2024-01-15T10:00:00Z')
  .dateModified('2024-01-20T15:30:00Z')
  .author('AI Content Team', 'https://example.com/team/ai')
  .publisher('Example Corp', 'https://example.com', 'https://example.com/logo.png')
  .keywords(['ai', 'machine learning', 'automation', 'intelligence', 'technology'])
  .speakable({
    '@type': 'SpeakableSpecification',
    'cssSelector': ['.question', '.answer'],
    'xpath': ['//h3[@class="question"]', '//p[@class="answer"]']
  })
  .addInteractionStat('ReadAction', 5000)
  .addInteractionStat('ShareAction', 250)
  .addQuestion('What is artificial intelligence?', 'Artificial intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence.')
  .addQuestion('How does machine learning work?', 'Machine learning uses algorithms to analyze data, identify patterns, and make predictions or decisions.')
  .addQuestion('What are the benefits of AI automation?', 'AI automation can increase efficiency, reduce errors, and free up human workers for more creative tasks.')
  .build();

console.log(JSON.stringify(llmOptimizedFAQ, null, 2));

// Example 5: Standards Header Mode FAQ
console.log('\n=== Example 5: Standards Header Mode FAQ ===');
const standardsHeaderBuilder = new FAQPageBuilder(MODES.STANDARDS_HEADER)
  .name('Standards Compliant FAQ')
  .description('FAQ following web standards and best practices')
  .url('https://example.com/standards-faq')
  .dateCreated('2024-01-15T10:00:00Z')
  .dateModified('2024-01-20T15:30:00Z')
  .author('Standards Team', 'https://example.com/team/standards')
  .publisher('Example Corp', 'https://example.com', 'https://example.com/logo.png')
  .addQuestion('What web standards do you follow?', 'We follow W3C standards, WCAG accessibility guidelines, and modern web development best practices.')
  .addQuestion('Is your site accessible?', 'Yes, our site meets WCAG 2.1 AA accessibility standards and is compatible with screen readers.');

const standardsHeaderFAQ = standardsHeaderBuilder.build();
console.log(JSON.stringify(standardsHeaderFAQ, null, 2));

// Get HTML rel profile and HTTP Link header for Standards Header mode
console.log('\n=== Standards Header Values ===');
console.log('HTML rel profile:', standardsHeaderBuilder.getRelProfile());
console.log('HTTP Link header:', standardsHeaderBuilder.getLinkHeader());
