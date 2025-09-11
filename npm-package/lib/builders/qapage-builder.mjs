/**
 * @fileoverview QAPageBuilder class for creating QAPage structured data objects
 * 
 * This module provides a specialized builder for creating QAPage structured data
 * objects according to Schema.org specifications. It includes methods for setting
 * Q&A-specific properties like questions, answers, authors, dates, and more.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Basic Q&A page creation
 * import { QAPageBuilder, MODES } from './qapage-builder.mjs';
 * const qaPage = new QAPageBuilder(MODES.STRICT_SEO)
 *   .name('How to Install Software')
 *   .description('Step-by-step guide for software installation')
 *   .inLanguage('en')
 *   .setQuestion('How do I install the software?', 'How do I install the software on my computer?')
 *   .addAnswer('Download the installer from our website and run it.', 'Tech Support', '2024-01-15')
 *   .addAnswer('Make sure you have administrator privileges before installing.', 'System Admin', '2024-01-16')
 *   .build();
 * 
 * @example
 * // Q&A page with detailed question and answers
 * const qaPage = new QAPageBuilder()
 *   .name('Product Troubleshooting')
 *   .description('Common issues and solutions for our product')
 *   .inLanguage('en')
 *   .setQuestion({
 *     name: 'Why is my app crashing?',
 *     text: 'My application keeps crashing when I try to open it. What should I do?',
 *     author: 'User123',
 *     dateCreated: '2024-01-10'
 *   })
 *   .addAnswer({
 *     text: 'Try restarting your device and clearing the app cache.',
 *     author: 'Tech Support',
 *     dateCreated: '2024-01-10'
 *   })
 *   .addAnswer({
 *     text: 'Check if you have the latest version of the app installed.',
 *     author: 'Product Team',
 *     dateCreated: '2024-01-11'
 *   })
 *   .build();
 * 
 * @example
 * // Q&A page with accepted answer
 * const qaPage = new QAPageBuilder()
 *   .name('Account Setup Help')
 *   .description('Help with setting up your account')
 *   .inLanguage('en')
 *   .setQuestion('How do I create an account?', 'What are the steps to create a new account?')
 *   .addAnswer('Go to our website and click the "Sign Up" button.', 'Support Team', '2024-01-01')
 *   .addAnswer('Fill out the registration form with your email and password.', 'Support Team', '2024-01-01')
 *   .setAcceptedAnswer('Go to our website and click the "Sign Up" button.', 'Support Team', '2024-01-01')
 *   .build();
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

/**
 * QAPageBuilder class for creating QAPage structured data objects
 * 
 * Extends BaseProfileBuilder to provide specialized methods for creating
 * QAPage structured data according to Schema.org specifications. Includes
 * support for questions, answers, authors, dates, accepted answers, and more.
 * 
 * @class QAPageBuilder
 * @extends BaseProfileBuilder
 * @example
 * // Create a Q&A page builder
 * const qaBuilder = new QAPageBuilder();
 * 
 * @example
 * // Create with custom mode and sanitization
 * const qaBuilder = new QAPageBuilder(MODES.SPLIT_CHANNELS, false);
 * 
 * @example
 * // Build a complete Q&A page
 * const qaPage = new QAPageBuilder()
 *   .name('FAQ')
 *   .setQuestion('Question?', 'What is the question?')
 *   .addAnswer('Answer.', 'Author')
 *   .build();
 */
export class QAPageBuilder extends BaseProfileBuilder {
  /**
   * Create a new QAPageBuilder instance
   * 
   * @param {string} [mode=MODES.STRICT_SEO] - The output mode
   * @param {boolean} [sanitizeInputs=true] - Whether to sanitize input data
   * 
   * @example
   * // Default configuration
   * const qaBuilder = new QAPageBuilder();
   * 
   * @example
   * // Custom configuration
   * const qaBuilder = new QAPageBuilder(MODES.SPLIT_CHANNELS, false);
   */
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('QAPage', 'interaction', mode, sanitizeInputs);
  }

  /**
   * Set language
   * @param {string} language - Language code (e.g., 'en', 'es')
   * @returns {QAPageBuilder} This builder for chaining
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
   * Set main entity (Question)
   * @param {Object} question - Question object
   * @returns {QAPageBuilder} This builder for chaining
   */
  mainEntity(question) {
    if (question && typeof question === 'object') {
      if (this.sanitizeInputs) {
        this.data.mainEntity = this.sanitizer.sanitizeStructuredData(question, 'Question');
      } else {
        this.data.mainEntity = question;
      }
    }
    return this;
  }

  /**
   * Set question
   * @param {string} question - Question text
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @param {string} [author] - Question author (optional)
   * @param {string} [dateCreated] - Date question was created (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  setQuestion(question, name = null, url = null, author = null, dateCreated = null) {
    const questionObj = {
      "@type": "Question",
      "name": name || question
    };

    if (url) questionObj.url = url;
    if (author) {
      questionObj.author = {
        "@type": "Person",
        "name": author
      };
    }
    if (dateCreated) questionObj.dateCreated = dateCreated;

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
      if (questionObj.author) {
        questionObj.author.name = this.sanitizer.sanitizeString(questionObj.author.name);
      }
      if (questionObj.dateCreated) {
        questionObj.dateCreated = this.sanitizer.sanitizeDate(questionObj.dateCreated);
      }
    }

    this.data.mainEntity = questionObj;
    return this;
  }

  /**
   * Add an answer to the question
   * @param {string} answer - Answer text
   * @param {string} [author] - Answer author (optional)
   * @param {string} [dateCreated] - Date answer was created (optional)
   * @param {number} [upvoteCount] - Number of upvotes (optional)
   * @param {boolean} [isAccepted] - Whether this is the accepted answer (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  addAnswer(answer, author = null, dateCreated = null, upvoteCount = null, isAccepted = false) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = {
        "@type": "Question",
        "name": "Question"
      };
    }

    if (!this.data.mainEntity.suggestedAnswer) {
      this.data.mainEntity.suggestedAnswer = [];
    }

    const answerObj = {
      "@type": "Answer",
      "text": answer
    };

    if (author) {
      answerObj.author = {
        "@type": "Person",
        "name": author
      };
    }
    if (dateCreated) answerObj.dateCreated = dateCreated;
    if (upvoteCount !== null) answerObj.upvoteCount = upvoteCount;

    if (this.sanitizeInputs) {
      answerObj.text = this.sanitizer.sanitizeString(answerObj.text);
      if (answerObj.author) {
        answerObj.author.name = this.sanitizer.sanitizeString(answerObj.author.name);
      }
      if (answerObj.dateCreated) {
        answerObj.dateCreated = this.sanitizer.sanitizeDate(answerObj.dateCreated);
      }
      if (answerObj.upvoteCount !== null) {
        answerObj.upvoteCount = this.sanitizer.sanitizeNumber(answerObj.upvoteCount, { min: 0 });
      }
    }

    if (isAccepted) {
      this.data.mainEntity.acceptedAnswer = answerObj;
    } else {
      if (!Array.isArray(this.data.mainEntity.suggestedAnswer)) {
        this.data.mainEntity.suggestedAnswer = [this.data.mainEntity.suggestedAnswer];
      }
      this.data.mainEntity.suggestedAnswer.push(answerObj);
    }

    return this;
  }

  /**
   * Set accepted answer
   * @param {string} answer - Accepted answer text
   * @param {string} [author] - Answer author (optional)
   * @param {string} [dateCreated] - Date answer was created (optional)
   * @param {number} [upvoteCount] - Number of upvotes (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  setAcceptedAnswer(answer, author = null, dateCreated = null, upvoteCount = null) {
    return this.addAnswer(answer, author, dateCreated, upvoteCount, true);
  }

  /**
   * Add multiple suggested answers
   * @param {Array} answers - Array of answer objects with text, author, dateCreated, upvoteCount properties
   * @returns {QAPageBuilder} This builder for chaining
   */
  addSuggestedAnswers(answers) {
    if (Array.isArray(answers)) {
      answers.forEach(answer => {
        this.addAnswer(
          answer.text,
          answer.author,
          answer.dateCreated,
          answer.upvoteCount,
          answer.isAccepted || false
        );
      });
    }
    return this;
  }

  /**
   * Set question with answers from a simple format
   * @param {string} question - Question text
   * @param {Array} answers - Array of answer objects
   * @param {string} [acceptedAnswer] - Accepted answer text (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  setQuestionWithAnswers(question, answers, acceptedAnswer = null) {
    this.setQuestion(question);

    if (acceptedAnswer) {
      this.setAcceptedAnswer(acceptedAnswer);
    }

    if (Array.isArray(answers)) {
      answers.forEach(answer => {
        if (typeof answer === 'string') {
          this.addAnswer(answer);
        } else if (answer && typeof answer === 'object') {
          this.addAnswer(
            answer.text,
            answer.author,
            answer.dateCreated,
            answer.upvoteCount,
            answer.isAccepted || false
          );
        }
      });
    }

    return this;
  }
}

export default QAPageBuilder; 
