/**
 * Enhanced Book Schema Examples
 * Demonstrates the enhanced Book schema implementation with Google Rich Results compliance
 */

const { BookBuilder, MODES } = require('../lib/builders/book-builder');

console.log('=== Enhanced Book Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema - All new required properties');
const basicBook = new BookBuilder(MODES.STRICT_SEO, true)
  .id('https://example.com/book/basic-enhanced')
  .name('Basic Enhanced Book')
  .author('Jane Smith', 'https://example.com/author/jane-smith')
  .url('https://example.com/book/basic-enhanced')
  .addWorkExample({
    id: 'https://example.com/book/basic-enhanced/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5678-9',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/basic-enhanced/hardcover'
      }
    }
  })
  .build();

console.log(JSON.stringify(basicBook, null, 2));
console.log('');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema - All optional properties');
const advancedBook = new BookBuilder(MODES.STRICT_SEO, true)
  .id('https://example.com/book/advanced-enhanced')
  .name('Advanced Enhanced Book')
  .author({
    '@type': 'Person',
    name: 'John Doe',
    url: 'https://example.com/author/john-doe',
    sameAs: 'https://en.wikipedia.org/wiki/John_Doe'
  })
  .url('https://example.com/book/advanced-enhanced')
  .description('A comprehensive book with all enhanced features and optional properties')
  .publisher({
    '@type': 'Organization',
    name: 'Advanced Publishing House',
    url: 'https://example.com/publisher/advanced-publishing'
  })
  .datePublished('2024-01-15')
  .inLanguage('en')
  .numberOfPages(450)
  .genre('Science Fiction')
  .keywords(['science fiction', 'technology', 'future', 'adventure'])
  .image('https://example.com/images/advanced-book.jpg', 400, 600)
  .sameAs('https://en.wikipedia.org/wiki/Advanced_Enhanced_Book')
  .bookEdition('2nd Edition')
  .illustrator({
    '@type': 'Person',
    name: 'Sarah Johnson',
    url: 'https://example.com/illustrator/sarah-johnson'
  })
  .translator({
    '@type': 'Person',
    name: 'Michael Chen',
    url: 'https://example.com/translator/michael-chen'
  })
  .copyrightYear(2024)
  .copyrightHolder({
    '@type': 'Organization',
    name: 'Advanced Publishing House',
    url: 'https://example.com/publisher/advanced-publishing'
  })
  .awards('Hugo Award for Best Novel 2024')
  .citation('Doe, J. (2024). Advanced Enhanced Book. Advanced Publishing House.')
  .aggregateRating(4.8, 150)
  .review([
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Book Reviewer'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'An outstanding work of science fiction that pushes the boundaries of imagination.'
    }
  ])
  .addWorkExample({
    id: 'https://example.com/book/advanced-enhanced/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5678-9',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/advanced-enhanced/hardcover'
      }
    },
    name: 'Advanced Enhanced Book - Hardcover Edition',
    datePublished: '2024-01-15',
    url: 'https://example.com/book/advanced-enhanced/hardcover'
  })
  .addWorkExample({
    id: 'https://example.com/book/advanced-enhanced/ebook',
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'en',
    isbn: '978-0-1234-5679-6',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/advanced-enhanced/ebook'
      }
    },
    name: 'Advanced Enhanced Book - E-Book Edition',
    datePublished: '2024-01-15',
    url: 'https://example.com/book/advanced-enhanced/ebook'
  })
  .build();

console.log(JSON.stringify(advancedBook, null, 2));
console.log('');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized - SEO-focused implementation');
const seoOptimizedBook = new BookBuilder(MODES.STRICT_SEO, true)
  .id('https://example.com/book/seo-optimized')
  .name('SEO Optimized Book: A Complete Guide')
  .author({
    '@type': 'Person',
    name: 'SEO Expert',
    url: 'https://example.com/author/seo-expert',
    sameAs: 'https://en.wikipedia.org/wiki/SEO_Expert'
  })
  .url('https://example.com/book/seo-optimized')
  .description('The ultimate guide to search engine optimization, covering all aspects from technical SEO to content marketing strategies.')
  .publisher({
    '@type': 'Organization',
    name: 'SEO Publishing Co.',
    url: 'https://example.com/publisher/seo-publishing'
  })
  .datePublished('2024-02-01')
  .inLanguage('en')
  .numberOfPages(320)
  .genre('Business & Economics')
  .keywords(['SEO', 'search engine optimization', 'digital marketing', 'content strategy'])
  .image('https://example.com/images/seo-book.jpg', 400, 600)
  .sameAs('https://en.wikipedia.org/wiki/SEO_Optimized_Book')
  .bookEdition('3rd Edition')
  .aggregateRating(4.6, 89)
  .review([
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Digital Marketer'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'Comprehensive and practical guide to SEO. Highly recommended for both beginners and experts.'
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Content Creator'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 4,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'Great resource for understanding SEO fundamentals and advanced techniques.'
    }
  ])
  .addWorkExample({
    id: 'https://example.com/book/seo-optimized/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5680-2',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/seo-optimized/hardcover'
      }
    },
    name: 'SEO Optimized Book - Hardcover Edition',
    datePublished: '2024-02-01',
    url: 'https://example.com/book/seo-optimized/hardcover'
  })
  .addWorkExample({
    id: 'https://example.com/book/seo-optimized/ebook',
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'en',
    isbn: '978-0-1234-5681-9',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/seo-optimized/ebook'
      }
    },
    name: 'SEO Optimized Book - E-Book Edition',
    datePublished: '2024-02-01',
    url: 'https://example.com/book/seo-optimized/ebook'
  })
  .build();

console.log(JSON.stringify(seoOptimizedBook, null, 2));
console.log('');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized - AI-focused implementation');
const llmOptimizedBook = new BookBuilder(MODES.LLM_OPTIMIZED, true)
  .id('https://example.com/book/llm-optimized')
  .name('AI and Machine Learning: A Comprehensive Guide')
  .author({
    '@type': 'Person',
    name: 'Dr. AI Researcher',
    url: 'https://example.com/author/ai-researcher',
    sameAs: 'https://en.wikipedia.org/wiki/Dr_AI_Researcher'
  })
  .url('https://example.com/book/llm-optimized')
  .description('An in-depth exploration of artificial intelligence and machine learning concepts, algorithms, and applications in modern technology.')
  .publisher({
    '@type': 'Organization',
    name: 'AI Publishing House',
    url: 'https://example.com/publisher/ai-publishing'
  })
  .datePublished('2024-03-01')
  .inLanguage('en')
  .numberOfPages(580)
  .genre('Technology & Engineering')
  .keywords(['artificial intelligence', 'machine learning', 'deep learning', 'neural networks', 'AI algorithms'])
  .image('https://example.com/images/ai-book.jpg', 400, 600)
  .sameAs('https://en.wikipedia.org/wiki/AI_and_Machine_Learning_Guide')
  .bookEdition('1st Edition')
  .illustrator({
    '@type': 'Person',
    name: 'Tech Illustrator'
  })
  .copyrightYear(2024)
  .copyrightHolder({
    '@type': 'Organization',
    name: 'AI Publishing House'
  })
  .awards('Best AI Book Award 2024, Technology Innovation Award')
  .citation('Researcher, D. A. (2024). AI and Machine Learning: A Comprehensive Guide. AI Publishing House.')
  .aggregateRating(4.9, 203)
  .review([
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'ML Engineer'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'Exceptional coverage of AI and ML topics. Perfect for both students and professionals.'
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Data Scientist'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'Comprehensive and well-structured. The best AI book I have read this year.'
    }
  ])
  .addWorkExample({
    id: 'https://example.com/book/llm-optimized/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5682-6',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/llm-optimized/hardcover'
      }
    },
    name: 'AI and Machine Learning - Hardcover Edition',
    datePublished: '2024-03-01',
    url: 'https://example.com/book/llm-optimized/hardcover'
  })
  .addWorkExample({
    id: 'https://example.com/book/llm-optimized/ebook',
    bookFormat: 'https://schema.org/EBook',
    inLanguage: 'en',
    isbn: '978-0-1234-5683-3',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/llm-optimized/ebook'
      }
    },
    name: 'AI and Machine Learning - E-Book Edition',
    datePublished: '2024-03-01',
    url: 'https://example.com/book/llm-optimized/ebook'
  })
  .addWorkExample({
    id: 'https://example.com/book/llm-optimized/audiobook',
    bookFormat: 'https://schema.org/AudiobookFormat',
    inLanguage: 'en',
    isbn: '978-0-1234-5684-0',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/llm-optimized/audiobook'
      }
    },
    name: 'AI and Machine Learning - Audiobook Edition',
    datePublished: '2024-03-01',
    url: 'https://example.com/book/llm-optimized/audiobook'
  })
  .build();

console.log(JSON.stringify(llmOptimizedBook, null, 2));
console.log('');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode - Standards-compliant implementation');
const standardsCompliantBook = new BookBuilder(MODES.STANDARDS_HEADER, true)
  .id('https://example.com/book/standards-compliant')
  .name('Standards Compliant Book')
  .author('Standards Author', 'https://example.com/author/standards-author')
  .url('https://example.com/book/standards-compliant')
  .description('A book that follows all standards and best practices for structured data implementation.')
  .publisher('Standards Publisher', 'https://example.com/publisher/standards-publisher')
  .datePublished('2024-04-01')
  .inLanguage('en')
  .numberOfPages(280)
  .genre('Reference')
  .keywords(['standards', 'compliance', 'best practices', 'structured data'])
  .image('https://example.com/images/standards-book.jpg', 400, 600)
  .sameAs('https://en.wikipedia.org/wiki/Standards_Compliant_Book')
  .bookEdition('1st Edition')
  .copyrightYear(2024)
  .copyrightHolder('Standards Publisher')
  .awards('Standards Excellence Award 2024')
  .citation('Author, S. (2024). Standards Compliant Book. Standards Publisher.')
  .aggregateRating(4.7, 67)
  .review([
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Standards Reviewer'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: 'Perfect example of standards compliance. Essential reading for developers.'
    }
  ])
  .addWorkExample({
    id: 'https://example.com/book/standards-compliant/hardcover',
    bookFormat: 'https://schema.org/Hardcover',
    inLanguage: 'en',
    isbn: '978-0-1234-5685-7',
    potentialAction: {
      '@type': 'ReadAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://example.com/book/standards-compliant/hardcover'
      }
    },
    name: 'Standards Compliant Book - Hardcover Edition',
    datePublished: '2024-04-01',
    url: 'https://example.com/book/standards-compliant/hardcover'
  })
  .build();

console.log(JSON.stringify(standardsCompliantBook, null, 2));
console.log('');

console.log('=== Example Summary ===');
console.log('1. Basic Enhanced Schema: Minimal required properties for Google Rich Results');
console.log('2. Advanced Schema: All optional properties for comprehensive metadata');
console.log('3. SEO Optimized: Focused on search engine optimization and rich results');
console.log('4. LLM Optimized: Enhanced for AI processing and machine learning');
console.log('5. Standards Compliant: Follows all standards and best practices');
console.log('');
console.log('All examples include:');
console.log('- Required @id, name, author, url, workExample properties');
console.log('- Proper workExample structure with bookFormat, inLanguage, isbn, potentialAction');
console.log('- Enhanced author and publisher structures');
console.log('- Comprehensive metadata for better discoverability');
console.log('- Multiple book editions (hardcover, ebook, audiobook)');
console.log('- Reviews and ratings for social proof');
console.log('- Reference URLs (sameAs) for authority');
