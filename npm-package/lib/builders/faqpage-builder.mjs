/**
 * @fileoverview FAQPageBuilder class for creating FAQPage structured data objects
 * 
 * This module provides a specialized builder for creating FAQPage structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * FAQ-specific properties like questions, answers, language, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic FAQ page creation
 * import { FAQPageBuilder, MODES } from './faqpage-builder.mjs';
 * const faqPage = new FAQPageBuilder(MODES.STRICT_SEO)
 *   .name('Frequently Asked Questions')
 *   .description('Common questions and answers about our service')
 *   .inLanguage('en')
 *   .addQuestion('What is your return policy?', 'We offer a 30-day return policy for all products.')
 *   .addQuestion('How long does shipping take?', 'Standard shipping takes 3-5 business days.')
 *   .addQuestion('Do you offer international shipping?', 'Yes, we ship to over 50 countries worldwide.')
 *   .build();
 * 
 * @example
 * // FAQ page with detailed questions
 * const faqPage = new FAQPageBuilder()
 *   .name('Product Support FAQ')
 *   .description('Get answers to common product questions')
 *   .inLanguage('en')
 *   .addQuestion({
 *     name: 'How do I install the software?',
 *     text: 'How do I install the software on my computer?',
 *     answer: {
 *       text: 'Download the installer from our website and follow the setup wizard.',
 *       url: 'https://example.com/install-guide'
 *     }
 *   })
 *   .addQuestion({
 *     name: 'What are the system requirements?',
 *     text: 'What are the minimum system requirements?',
 *     answer: {
 *       text: 'Windows 10 or macOS 10.15, 4GB RAM, 1GB free disk space.'
 *     }
 *   })
 *   .build();
 * 
 * @example
 * // FAQ page with multiple languages
 * const faqPage = new FAQPageBuilder()
 *   .name('Customer Support FAQ')
 *   .description('Frequently asked questions from our customers')
 *   .inLanguage('en')
 *   .addQuestion('How can I contact support?', 'You can reach us via email, phone, or live chat.')
 *   .addQuestion('What are your business hours?', 'We are open Monday-Friday, 9 AM to 6 PM EST.')
 *   .url('https://example.com/faq')
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * FAQPageBuilder class for creating FAQPage structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * FAQPage structured data according to Schema.org specifications. Includes
 * support for questions, answers, language settings, and more.
 * 
 * @class FAQPageBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create an FAQ page builder
 * const faqBuilder = new FAQPageBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const faqBuilder = new FAQPageBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete FAQ page
 * const faqPage = new FAQPageBuilder()
 *   .name('FAQ')
 *   .addQuestion('Question?', 'Answer.')
 *   .build();
 */
export class FAQPageBuilder extends BaseProfileBuilder {
  /**
   * Create a new FAQPageBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const faqBuilder = new FAQPageBuilder();
   * 
   * @example
   * // Custom configuration
   * const faqBuilder = new FAQPageBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('FAQPage', 'interaction', mode, sanitizeInputs);
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {FAQPageBuilder} This builder for chaining
   */
  inLanguage(language) {
    if (this.sanitizeInputs) {
      this.data.inLanguage = this.sanitizer.sanitizeLanguageCode(language);
    } else {
      this.data.inLanguage = language;
    }
    return this;
  }

  /**
   * Set main entity (FAQ items)
   * @param {Array} questions - Array of Question objects
   * @returns {FAQPageBuilder} This builder for chaining
   */
  mainEntity(questions) {
    if (Array.isArray(questions)) {
      if (this.sanitizeInputs) {
        this.data.mainEntity = questions.map(q => this.sanitizer.sanitizeStructuredData(q, 'Question'));
      } else {
        this.data.mainEntity = questions;
      }
    }
    return this;
  }

  /**
   * Add a single FAQ question
   * @param {string} question - Question text
   * @param {string} answer - Answer text
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestion(question, answer, name = null, url = null) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = [];
    }

    const questionObj = {
      "@type": "Question",
      "name": name || question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    };

    if (url) questionObj.url = url;

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.acceptedAnswer.text = this.sanitizer.sanitizeString(questionObj.acceptedAnswer.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }

  /**
   * Add multiple FAQ questions
   * @param {Array} faqs - Array of FAQ objects with question and answer properties
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestions(faqs) {
    if (Array.isArray(faqs)) {
      faqs.forEach(faq => {
        if (faq.question && faq.answer) {
          this.addQuestion(faq.question, faq.answer, faq.name, faq.url);
        }
      });
    }
    return this;
  }

  /**
   * Set FAQ questions from a simple array format
   * @param {Array} questions - Array of {question, answer} objects
   * @returns {FAQPageBuilder} This builder for chaining
   */
  setQuestions(questions) {
    if (Array.isArray(questions)) {
      this.data.mainEntity = questions.map(q => {
        const questionObj = {
          "@type": "Question",
          "name": q.name || q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        };

        if (q.url) questionObj.url = q.url;

        if (this.sanitizeInputs) {
          questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
          questionObj.acceptedAnswer.text = this.sanitizer.sanitizeString(questionObj.acceptedAnswer.text);
          if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
        }

        return questionObj;
      });
    }
    return this;
  }

  /**
   * Add a question with multiple accepted answers
   * @param {string} question - Question text
   * @param {Array} answers - Array of answer texts
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestionWithMultipleAnswers(question, answers, name = null, url = null) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = [];
    }

    if (!Array.isArray(answers)) {
      answers = [answers];
    }

    const questionObj = {
      "@type": "Question",
      "name": name || question,
      "acceptedAnswer": answers.map(answer => ({
        "@type": "Answer",
        "text": answer
      }))
    };

    if (url) questionObj.url = url;

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.acceptedAnswer = questionObj.acceptedAnswer.map(answer => ({
        ...answer,
        text: this.sanitizer.sanitizeString(answer.text)
      }));
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }

  /**
   * Add a question with suggested answer
   * @param {string} question - Question text
   * @param {string} answer - Answer text
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestionWithSuggestedAnswer(question, answer, name = null, url = null) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = [];
    }

    const questionObj = {
      "@type": "Question",
      "name": name || question,
      "suggestedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    };

    if (url) questionObj.url = url;

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.suggestedAnswer.text = this.sanitizer.sanitizeString(questionObj.suggestedAnswer.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }
}

export default FAQPageBuilder; 
