/**
 * Enhanced QAPage Schema Examples
 * Demonstrates the enhanced QAPage schema implementation with all new features
 */

const { QAPageBuilder } = require('../lib/builders/qapage-builder');
const { MODES } = require('../lib/builders/base-builder');

console.log('🚀 Enhanced QAPage Schema Examples\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema');
const basicQAPage = new QAPageBuilder(MODES.STRICT_SEO, true)
  .name("How to implement QAPage schema?")
  .description("A comprehensive guide to implementing QAPage structured data for Google Rich Results")
  .url("https://example.com/qa/how-to-implement-qapage-schema")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .setQuestionWithMetadata(
    "How to implement QAPage schema?",
    "QAPage Implementation Question",
    "https://example.com/qa/how-to-implement-qapage-schema#question",
    "Question Author",
    "2025-01-15T09:00:00Z",
    1
  )
  .addAnswerWithMetadata(
    "Use the enhanced QAPage builder with proper validation and follow Google's guidelines.",
    "Expert User",
    "2025-01-15T10:00:00Z",
    15,
    "https://example.com/qa/how-to-implement-qapage-schema#accepted-answer",
    true
  )
  .build();

console.log('Basic QAPage Schema:');
console.log(JSON.stringify(basicQAPage, null, 2));
console.log('\n');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema with Optional Properties');
const advancedQAPage = new QAPageBuilder(MODES.STRICT_SEO, true)
  .name("Advanced QAPage Schema Implementation")
  .description("Complete QAPage schema with all optional properties for maximum SEO and LLM optimization")
  .url("https://example.com/qa/advanced-qapage-schema")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .dateModified("2025-01-15T15:30:00Z")
  .author("John Doe", "https://example.com/author/john-doe")
  .publisher("Example Corp", "https://example.com", "https://example.com/logo.png")
  .keywords(["QAPage", "structured data", "schema.org", "Google Rich Results", "SEO"])
  .addSpeakableContent([".question", ".accepted-answer", ".suggested-answers"])
  .addInteractionStat("ViewAction", 1250)
  .addInteractionStat("LikeAction", 89)
  .addInteractionStat("ShareAction", 23)
  .mainContentOfPage({
    "@type": "WebPageElement",
    "cssSelector": ".main-content"
  })
  .breadcrumb({
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Q&A",
        "item": "https://example.com/qa"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Schema Implementation",
        "item": "https://example.com/qa/schema-implementation"
      }
    ]
  })
  .isAccessibleForFree(true)
  .license("https://creativecommons.org/licenses/by/4.0/")
  .contentRating({
    "@type": "Rating",
    "ratingValue": "5",
    "bestRating": "5",
    "worstRating": "1"
  })
  .setQuestionWithMetadata(
    "What are the best practices for QAPage schema implementation?",
    "QAPage Best Practices Question",
    "https://example.com/qa/advanced-qapage-schema#question",
    {
      "@type": "Person",
      "name": "Jane Smith",
      "url": "https://example.com/author/jane-smith"
    },
    "2025-01-15T09:00:00Z",
    3
  )
  .addAnswerWithMetadata(
    "Follow Google's guidelines, include all required properties, and use proper validation.",
    {
      "@type": "Person",
      "name": "SEO Expert",
      "url": "https://example.com/user/seo-expert"
    },
    "2025-01-15T10:00:00Z",
    25,
    "https://example.com/qa/advanced-qapage-schema#accepted-answer",
    true
  )
  .addAnswerWithMetadata(
    "Make sure to include author attribution and timestamps for all answers.",
    {
      "@type": "Person",
      "name": "Content Expert",
      "url": "https://example.com/user/content-expert"
    },
    "2025-01-15T11:00:00Z",
    18,
    "https://example.com/qa/advanced-qapage-schema#suggested-answer-1",
    false
  )
  .addAnswerWithMetadata(
    "Test your implementation with Google's Rich Results Test tool.",
    {
      "@type": "Person",
      "name": "Testing Expert",
      "url": "https://example.com/user/testing-expert"
    },
    "2025-01-15T12:00:00Z",
    12,
    "https://example.com/qa/advanced-qapage-schema#suggested-answer-2",
    false
  )
  .build();

console.log('Advanced QAPage Schema:');
console.log(JSON.stringify(advancedQAPage, null, 2));
console.log('\n');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized');
const googleOptimizedQAPage = new QAPageBuilder(MODES.STRICT_SEO, true)
  .name("Google Rich Results QAPage Optimization")
  .description("Optimized QAPage schema for maximum Google Rich Results visibility and performance")
  .url("https://example.com/qa/google-rich-results-optimization")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .dateModified("2025-01-15T15:30:00Z")
  .author({
    "@type": "Person",
    "name": "Google SEO Expert",
    "url": "https://example.com/author/google-seo-expert"
  })
  .publisher({
    "@type": "Organization",
    "name": "SEO Experts Inc",
    "url": "https://example.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  })
  .keywords(["Google Rich Results", "QAPage", "SEO", "structured data", "search optimization"])
  .setQuestionWithMetadata(
    "How to optimize QAPage schema for Google Rich Results?",
    "Google Rich Results QAPage Optimization",
    "https://example.com/qa/google-rich-results-optimization#question",
    {
      "@type": "Person",
      "name": "SEO Questioner",
      "url": "https://example.com/user/seo-questioner"
    },
    "2025-01-15T09:00:00Z",
    1
  )
  .addAnswerWithMetadata(
    "Include all required properties, use proper timestamps, add author attribution, and ensure content quality meets Google's guidelines.",
    {
      "@type": "Person",
      "name": "Google Expert",
      "url": "https://example.com/user/google-expert"
    },
    "2025-01-15T10:00:00Z",
    42,
    "https://example.com/qa/google-rich-results-optimization#accepted-answer",
    true
  )
  .build();

console.log('Google Optimized QAPage Schema:');
console.log(JSON.stringify(googleOptimizedQAPage, null, 2));
console.log('\n');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized');
const llmOptimizedQAPage = new QAPageBuilder(MODES.STRICT_SEO, true)
  .name("LLM Optimized QAPage Schema")
  .description("QAPage schema optimized for AI and LLM processing with enhanced metadata and structured information")
  .url("https://example.com/qa/llm-optimized-qapage-schema")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .dateModified("2025-01-15T15:30:00Z")
  .author({
    "@type": "Person",
    "name": "AI Expert",
    "url": "https://example.com/author/ai-expert"
  })
  .publisher({
    "@type": "Organization",
    "name": "AI Research Lab",
    "url": "https://example.com/ai-lab",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/ai-lab/logo.png"
    }
  })
  .keywords(["LLM", "AI", "machine learning", "natural language processing", "structured data", "QAPage"])
  .addSpeakableContent([".question-text", ".answer-text", ".author-info"])
  .addInteractionStat("ViewAction", 2500)
  .addInteractionStat("LikeAction", 150)
  .addInteractionStat("ShareAction", 45)
  .addInteractionStat("CommentAction", 23)
  .setQuestionWithMetadata(
    "How to optimize QAPage schema for LLM processing?",
    "LLM Optimization for QAPage Schema",
    "https://example.com/qa/llm-optimized-qapage-schema#question",
    {
      "@type": "Person",
      "name": "LLM Researcher",
      "url": "https://example.com/author/llm-researcher"
    },
    "2025-01-15T09:00:00Z",
    2
  )
  .addAnswerWithMetadata(
    "Include comprehensive metadata, use structured author information, add interaction statistics, and ensure content is well-formatted for AI processing.",
    {
      "@type": "Person",
      "name": "AI Specialist",
      "url": "https://example.com/user/ai-specialist"
    },
    "2025-01-15T10:00:00Z",
    35,
    "https://example.com/qa/llm-optimized-qapage-schema#accepted-answer",
    true
  )
  .addAnswerWithMetadata(
    "Consider adding speakable content specifications and interaction statistics for better AI understanding.",
    {
      "@type": "Person",
      "name": "ML Engineer",
      "url": "https://example.com/user/ml-engineer"
    },
    "2025-01-15T11:00:00Z",
    28,
    "https://example.com/qa/llm-optimized-qapage-schema#suggested-answer-1",
    false
  )
  .build();

console.log('LLM Optimized QAPage Schema:');
console.log(JSON.stringify(llmOptimizedQAPage, null, 2));
console.log('\n');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode');
const standardsQAPage = new QAPageBuilder(MODES.STANDARDS_HEADER, true)
  .name("Standards Compliant QAPage Schema")
  .description("QAPage schema implementation following strict standards compliance")
  .url("https://example.com/qa/standards-compliant-qapage-schema")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .author("Standards Expert", "https://example.com/author/standards-expert")
  .publisher("Standards Organization", "https://example.com/standards")
  .setQuestionWithMetadata(
    "How to ensure QAPage schema standards compliance?",
    "Standards Compliance for QAPage",
    "https://example.com/qa/standards-compliant-qapage-schema#question",
    "Standards Questioner",
    "2025-01-15T09:00:00Z",
    1
  )
  .addAnswerWithMetadata(
    "Follow schema.org specifications exactly, use proper validation, and ensure all required properties are present.",
    "Standards Expert",
    "2025-01-15T10:00:00Z",
    20,
    "https://example.com/qa/standards-compliant-qapage-schema#accepted-answer",
    true
  )
  .build();

console.log('Standards Compliant QAPage Schema:');
console.log(JSON.stringify(standardsQAPage, null, 2));
console.log('\n');

// Example 6: Complex Q&A with Multiple Answers
console.log('Example 6: Complex Q&A with Multiple Answers');
const complexQAPage = new QAPageBuilder(MODES.STRICT_SEO, true)
  .name("Complex Q&A: Best Practices for Web Development")
  .description("A comprehensive Q&A about web development best practices with multiple expert answers")
  .url("https://example.com/qa/web-development-best-practices")
  .inLanguage("en")
  .dateCreated("2025-01-15T10:00:00Z")
  .dateModified("2025-01-15T16:00:00Z")
  .author({
    "@type": "Person",
    "name": "Web Development Community",
    "url": "https://example.com/community/web-dev"
  })
  .publisher({
    "@type": "Organization",
    "name": "Web Dev Academy",
    "url": "https://example.com/web-dev-academy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/web-dev-academy/logo.png"
    }
  })
  .keywords(["web development", "best practices", "frontend", "backend", "full-stack", "programming"])
  .addSpeakableContent([".question", ".accepted-answer", ".suggested-answers"])
  .addInteractionStat("ViewAction", 5000)
  .addInteractionStat("LikeAction", 250)
  .addInteractionStat("ShareAction", 75)
  .addInteractionStat("CommentAction", 45)
  .setQuestionWithMetadata(
    "What are the most important best practices for modern web development?",
    "Web Development Best Practices Question",
    "https://example.com/qa/web-development-best-practices#question",
    {
      "@type": "Person",
      "name": "Junior Developer",
      "url": "https://example.com/user/junior-dev"
    },
    "2025-01-15T09:00:00Z",
    4
  )
  .addAnswerWithMetadata(
    "Focus on responsive design, performance optimization, accessibility, and security. Use modern frameworks and follow coding standards.",
    {
      "@type": "Person",
      "name": "Senior Frontend Developer",
      "url": "https://example.com/user/senior-frontend"
    },
    "2025-01-15T10:00:00Z",
    45,
    "https://example.com/qa/web-development-best-practices#accepted-answer",
    true
  )
  .addAnswerWithMetadata(
    "Implement proper error handling, use version control, write tests, and follow the DRY principle.",
    {
      "@type": "Person",
      "name": "Backend Developer",
      "url": "https://example.com/user/backend-dev"
    },
    "2025-01-15T11:00:00Z",
    38,
    "https://example.com/qa/web-development-best-practices#suggested-answer-1",
    false
  )
  .addAnswerWithMetadata(
    "Prioritize user experience, implement proper SEO, use HTTPS, and ensure cross-browser compatibility.",
    {
      "@type": "Person",
      "name": "Full-Stack Developer",
      "url": "https://example.com/user/fullstack-dev"
    },
    "2025-01-15T12:00:00Z",
    32,
    "https://example.com/qa/web-development-best-practices#suggested-answer-2",
    false
  )
  .addAnswerWithMetadata(
    "Use modern build tools, implement CI/CD, monitor performance, and keep dependencies updated.",
    {
      "@type": "Person",
      "name": "DevOps Engineer",
      "url": "https://example.com/user/devops-engineer"
    },
    "2025-01-15T13:00:00Z",
    28,
    "https://example.com/qa/web-development-best-practices#suggested-answer-3",
    false
  )
  .build();

console.log('Complex Q&A QAPage Schema:');
console.log(JSON.stringify(complexQAPage, null, 2));
console.log('\n');

console.log('🎯 Enhanced QAPage Schema Examples Complete!');
console.log('\n📋 Summary:');
console.log('✅ Example 1: Basic Enhanced Schema - All new required properties');
console.log('✅ Example 2: Advanced Schema - All optional properties');
console.log('✅ Example 3: Google Rich Results Optimized - SEO-focused');
console.log('✅ Example 4: LLM Optimized - AI-focused');
console.log('✅ Example 5: Standards Header Mode - Standards-compliant');
console.log('✅ Example 6: Complex Q&A - Multiple answers with full metadata');
console.log('\n🚀 All examples demonstrate the enhanced QAPage schema capabilities!');
