/**
 * FAQPageBuilder class for creating FAQPage structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class FAQPageBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Faqpage', 'interaction', mode, sanitizeInputs);
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

  /**
   * Set FAQ page name/title
   * @param {string} name - FAQ page name
   * @returns {FAQPageBuilder} This builder for chaining
   */
  name(name) {
    if (this.sanitizeInputs) {
      this.data.name = this.sanitizer.sanitizeString(name);
    } else {
      this.data.name = name;
    }
    return this;
  }

  /**
   * Set FAQ page description
   * @param {string} description - FAQ page description
   * @returns {FAQPageBuilder} This builder for chaining
   */
  description(description) {
    if (this.sanitizeInputs) {
      this.data.description = this.sanitizer.sanitizeString(description);
    } else {
      this.data.description = description;
    }
    return this;
  }

  /**
   * Set FAQ page URL
   * @param {string} url - Canonical URL of the FAQ page
   * @returns {FAQPageBuilder} This builder for chaining
   */
  url(url) {
    if (this.sanitizeInputs) {
      this.data.url = this.sanitizer.sanitizeUrl(url);
    } else {
      this.data.url = url;
    }
    return this;
  }

  /**
   * Set creation date
   * @param {string|Date} date - Creation date
   * @returns {FAQPageBuilder} This builder for chaining
   */
  dateCreated(date) {
    if (this.sanitizeInputs) {
      this.data.dateCreated = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateCreated = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set modification date
   * @param {string|Date} date - Last modification date
   * @returns {FAQPageBuilder} This builder for chaining
   */
  dateModified(date) {
    if (this.sanitizeInputs) {
      this.data.dateModified = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateModified = date instanceof Date ? date.toISOString() : date;
    }
    return this;
  }

  /**
   * Set author
   * @param {string|Object} author - Author name or Person/Organization object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  author(author, url = null) {
    if (typeof author === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(author) : author;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      this.data.author = url ? {
        "@type": "Person",
        "name": sanitizedName,
        "url": sanitizedUrl
      } : sanitizedName;
    } else if (author && typeof author === 'object') {
      if (this.sanitizeInputs) {
        this.data.author = this.sanitizer.sanitizeStructuredData(author, author['@type'] || 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set publisher
   * @param {string|Object} publisher - Publisher name or Organization object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @param {string} [logoUrl] - Publisher logo URL
   * @returns {FAQPageBuilder} This builder for chaining
   */
  publisher(publisher, url = null, logoUrl = null) {
    if (typeof publisher === 'string') {
      this.data.publisher = {
        "@type": "Organization",
        "name": publisher
      };
      if (url) this.data.publisher.url = url;
      if (logoUrl) {
        this.data.publisher.logo = {
          "@type": "ImageObject",
          "url": logoUrl
        };
      }
    } else if (publisher && typeof publisher === 'object') {
      if (this.sanitizeInputs) {
        this.data.publisher = this.sanitizer.sanitizeStructuredData(publisher, 'Organization');
      } else {
        this.data.publisher = publisher;
      }
    }
    return this;
  }

  /**
   * Set keywords
   * @param {string|Array} keywords - Keywords string or array
   * @returns {FAQPageBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        this.data.keywords = keywords.map(k => this.sanitizer.sanitizeString(k));
      } else {
        this.data.keywords = keywords;
      }
    } else {
      if (this.sanitizeInputs) {
        this.data.keywords = this.sanitizer.sanitizeString(keywords);
      } else {
        this.data.keywords = keywords;
      }
    }
    return this;
  }

  /**
   * Set speakable content specification
   * @param {Object} speakable - SpeakableSpecification object
   * @returns {FAQPageBuilder} This builder for chaining
   */
  speakable(speakable) {
    if (speakable && typeof speakable === 'object') {
      if (this.sanitizeInputs) {
        this.data.speakable = this.sanitizer.sanitizeStructuredData(speakable, 'SpeakableSpecification');
      } else {
        this.data.speakable = speakable;
      }
    }
    return this;
  }

  /**
   * Add speakable content with CSS selectors
   * @param {Array} cssSelectors - Array of CSS selectors
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addSpeakableContent(cssSelectors) {
    if (Array.isArray(cssSelectors)) {
      this.data.speakable = {
        "@type": "SpeakableSpecification",
        "cssSelector": cssSelectors
      };
    }
    return this;
  }

  /**
   * Set interaction statistics
   * @param {Array} statistics - Array of InteractionCounter objects
   * @returns {FAQPageBuilder} This builder for chaining
   */
  interactionStatistic(statistics) {
    if (Array.isArray(statistics)) {
      if (this.sanitizeInputs) {
        this.data.interactionStatistic = statistics.map(stat => 
          this.sanitizer.sanitizeStructuredData(stat, 'InteractionCounter')
        );
      } else {
        this.data.interactionStatistic = statistics;
      }
    }
    return this;
  }

  /**
   * Add interaction statistic
   * @param {string} interactionType - Type of interaction
   * @param {number} count - Number of interactions
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addInteractionStat(interactionType, count) {
    if (!this.data.interactionStatistic) {
      this.data.interactionStatistic = [];
    }

    const stat = {
      "@type": "InteractionCounter",
      "interactionType": interactionType,
      "userInteractionCount": count
    };

    if (this.sanitizeInputs) {
      stat.interactionType = this.sanitizer.sanitizeString(stat.interactionType);
    }

    this.data.interactionStatistic.push(stat);
    return this;
  }

  /**
   * Set main content of page
   * @param {Object} mainContent - WebPageElement object
   * @returns {FAQPageBuilder} This builder for chaining
   */
  mainContentOfPage(mainContent) {
    if (mainContent && typeof mainContent === 'object') {
      if (this.sanitizeInputs) {
        this.data.mainContentOfPage = this.sanitizer.sanitizeStructuredData(mainContent, 'WebPageElement');
      } else {
        this.data.mainContentOfPage = mainContent;
      }
    }
    return this;
  }

  /**
   * Set breadcrumb navigation
   * @param {Object} breadcrumb - BreadcrumbList object
   * @returns {FAQPageBuilder} This builder for chaining
   */
  breadcrumb(breadcrumb) {
    if (breadcrumb && typeof breadcrumb === 'object') {
      if (this.sanitizeInputs) {
        this.data.breadcrumb = this.sanitizer.sanitizeStructuredData(breadcrumb, 'BreadcrumbList');
      } else {
        this.data.breadcrumb = breadcrumb;
      }
    }
    return this;
  }

  /**
   * Set accessibility information
   * @param {boolean} isAccessibleForFree - Whether content is freely accessible
   * @returns {FAQPageBuilder} This builder for chaining
   */
  isAccessibleForFree(isAccessibleForFree) {
    this.data.isAccessibleForFree = Boolean(isAccessibleForFree);
    return this;
  }

  /**
   * Set license information
   * @param {string|Object} license - License URL or CreativeWork object
   * @returns {FAQPageBuilder} This builder for chaining
   */
  license(license) {
    if (typeof license === 'string') {
      if (this.sanitizeInputs) {
        this.data.license = this.sanitizer.sanitizeUrl(license);
      } else {
        this.data.license = license;
      }
    } else if (license && typeof license === 'object') {
      if (this.sanitizeInputs) {
        this.data.license = this.sanitizer.sanitizeStructuredData(license, 'CreativeWork');
      } else {
        this.data.license = license;
      }
    }
    return this;
  }

  /**
   * Set content rating
   * @param {Object} contentRating - Rating object
   * @returns {FAQPageBuilder} This builder for chaining
   */
  contentRating(contentRating) {
    if (contentRating && typeof contentRating === 'object') {
      if (this.sanitizeInputs) {
        this.data.contentRating = this.sanitizer.sanitizeStructuredData(contentRating, 'Rating');
      } else {
        this.data.contentRating = contentRating;
      }
    }
    return this;
  }

  /**
   * Add a question with author information
   * @param {string} question - Question text
   * @param {string} answer - Answer text
   * @param {string|Object} author - Author name or Person object
   * @param {string|Date} [dateCreated] - When the question was created
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestionWithAuthor(question, answer, author, dateCreated = null, name = null, url = null) {
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
    if (dateCreated) {
      questionObj.dateCreated = dateCreated instanceof Date ? dateCreated.toISOString() : dateCreated;
    }

    // Add author to the answer
    if (typeof author === 'string') {
      questionObj.acceptedAnswer.author = {
        "@type": "Person",
        "name": author
      };
    } else if (author && typeof author === 'object') {
      questionObj.acceptedAnswer.author = author;
    }

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.acceptedAnswer.text = this.sanitizer.sanitizeString(questionObj.acceptedAnswer.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
      if (questionObj.acceptedAnswer.author) {
        questionObj.acceptedAnswer.author = this.sanitizer.sanitizeStructuredData(
          questionObj.acceptedAnswer.author, 
          questionObj.acceptedAnswer.author['@type'] || 'Person'
        );
      }
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }

  /**
   * Add a question with metadata
   * @param {string} question - Question text
   * @param {string} answer - Answer text
   * @param {Object} metadata - Additional metadata for the question
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestionWithMetadata(question, answer, metadata = {}) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = [];
    }

    const questionObj = {
      "@type": "Question",
      "name": metadata.name || question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    };

    // Add optional metadata
    if (metadata.url) questionObj.url = metadata.url;
    if (metadata.dateCreated) questionObj.dateCreated = metadata.dateCreated;
    if (metadata.author) questionObj.acceptedAnswer.author = metadata.author;
    if (metadata.upvoteCount) questionObj.upvoteCount = metadata.upvoteCount;
    if (metadata.downvoteCount) questionObj.downvoteCount = metadata.downvoteCount;

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.acceptedAnswer.text = this.sanitizer.sanitizeString(questionObj.acceptedAnswer.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
      if (questionObj.acceptedAnswer.author) {
        questionObj.acceptedAnswer.author = this.sanitizer.sanitizeStructuredData(
          questionObj.acceptedAnswer.author, 
          questionObj.acceptedAnswer.author['@type'] || 'Person'
        );
      }
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }

  /**
   * Add a question with keywords
   * @param {string} question - Question text
   * @param {string} answer - Answer text
   * @param {string|Array} keywords - Keywords for the question
   * @param {string} [name] - Question name (optional)
   * @param {string} [url] - Question URL (optional)
   * @returns {FAQPageBuilder} This builder for chaining
   */
  addQuestionWithKeywords(question, answer, keywords, name = null, url = null) {
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
    if (keywords) {
      questionObj.keywords = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    }

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.acceptedAnswer.text = this.sanitizer.sanitizeString(questionObj.acceptedAnswer.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
      if (questionObj.keywords) questionObj.keywords = this.sanitizer.sanitizeString(questionObj.keywords);
    }

    this.data.mainEntity.push(questionObj);
    return this;
  }
}

module.exports = { FAQPageBuilder };
