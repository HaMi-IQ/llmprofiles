/**
 * QAPageBuilder class for creating QAPage structured data objects
 */

const { BaseProfileBuilder, MODES } = require('./base-builder');

class QAPageBuilder extends BaseProfileBuilder {
  constructor(mode = MODES.STRICT_SEO, sanitizeInputs = true) {
    super('Qapage', 'interaction', mode, sanitizeInputs);
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

  /**
   * Set QAPage name
   * @param {string} name - QAPage title
   * @returns {QAPageBuilder} This builder for chaining
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
   * Set QAPage description
   * @param {string} description - QAPage description
   * @returns {QAPageBuilder} This builder for chaining
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
   * Set canonical URL
   * @param {string} url - Canonical URL
   * @returns {QAPageBuilder} This builder for chaining
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
   * @returns {QAPageBuilder} This builder for chaining
   */
  dateCreated(date) {
    if (this.sanitizeInputs) {
      this.data.dateCreated = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateCreated = date;
    }
    return this;
  }

  /**
   * Set modification date
   * @param {string|Date} date - Modification date
   * @returns {QAPageBuilder} This builder for chaining
   */
  dateModified(date) {
    if (this.sanitizeInputs) {
      this.data.dateModified = this.sanitizer.sanitizeDate(date);
    } else {
      this.data.dateModified = date;
    }
    return this;
  }

  /**
   * Set author information
   * @param {string|Object} author - Author name or object
   * @param {string} [url] - Author URL (if author is string)
   * @returns {QAPageBuilder} This builder for chaining
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
        this.data.author = this.sanitizer.sanitizeStructuredData(author, 'Person');
      } else {
        this.data.author = author;
      }
    }
    return this;
  }

  /**
   * Set publisher information
   * @param {string|Object} publisher - Publisher name or object
   * @param {string} [url] - Publisher URL (if publisher is string)
   * @param {string} [logoUrl] - Publisher logo URL (if publisher is string)
   * @returns {QAPageBuilder} This builder for chaining
   */
  publisher(publisher, url = null, logoUrl = null) {
    if (typeof publisher === 'string') {
      const sanitizedName = this.sanitizeInputs ? this.sanitizer.sanitizeString(publisher) : publisher;
      const sanitizedUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(url) : url;
      const sanitizedLogoUrl = this.sanitizeInputs ? this.sanitizer.sanitizeUrl(logoUrl) : logoUrl;
      
      this.data.publisher = {
        "@type": "Organization",
        "name": sanitizedName
      };
      
      if (url) this.data.publisher.url = sanitizedUrl;
      if (logoUrl) {
        this.data.publisher.logo = {
          "@type": "ImageObject",
          "url": sanitizedLogoUrl
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
   * Set SEO keywords
   * @param {string|Array} keywords - Keywords as string or array
   * @returns {QAPageBuilder} This builder for chaining
   */
  keywords(keywords) {
    if (Array.isArray(keywords)) {
      if (this.sanitizeInputs) {
        this.data.keywords = keywords.map(keyword => this.sanitizer.sanitizeString(keyword));
      } else {
        this.data.keywords = keywords;
      }
    } else if (typeof keywords === 'string') {
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
   * @param {Object} speakable - Speakable specification object
   * @returns {QAPageBuilder} This builder for chaining
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
   * @param {string|Array} cssSelectors - CSS selectors for speakable content
   * @returns {QAPageBuilder} This builder for chaining
   */
  addSpeakableContent(cssSelectors) {
    this.data.speakable = {
      "@type": "SpeakableSpecification",
      "cssSelector": Array.isArray(cssSelectors) ? cssSelectors : [cssSelectors]
    };
    return this;
  }

  /**
   * Set interaction statistics
   * @param {Array} statistics - Array of interaction statistics
   * @returns {QAPageBuilder} This builder for chaining
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
   * Add individual interaction statistic
   * @param {string} interactionType - Type of interaction
   * @param {number} count - Interaction count
   * @returns {QAPageBuilder} This builder for chaining
   */
  addInteractionStat(interactionType, count) {
    if (!this.data.interactionStatistic) {
      this.data.interactionStatistic = [];
    }

    const sanitizedType = this.sanitizeInputs ? this.sanitizer.sanitizeString(interactionType) : interactionType;
    const sanitizedCount = this.sanitizeInputs ? this.sanitizer.sanitizeNumber(count, { min: 0 }) : count;

    this.data.interactionStatistic.push({
      "@type": "InteractionCounter",
      "interactionType": {
        "@type": "Action",
        "name": sanitizedType
      },
      "userInteractionCount": sanitizedCount
    });

    return this;
  }

  /**
   * Set main content of page reference
   * @param {Object} mainContent - Main content reference
   * @returns {QAPageBuilder} This builder for chaining
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
   * @param {Object} breadcrumb - Breadcrumb navigation object
   * @returns {QAPageBuilder} This builder for chaining
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
   * @param {boolean} isAccessible - Whether content is accessible for free
   * @returns {QAPageBuilder} This builder for chaining
   */
  isAccessibleForFree(isAccessible) {
    this.data.isAccessibleForFree = Boolean(isAccessible);
    return this;
  }

  /**
   * Set license information
   * @param {string|Object} license - License URL or object
   * @returns {QAPageBuilder} This builder for chaining
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
   * @param {Object} rating - Content rating object
   * @returns {QAPageBuilder} This builder for chaining
   */
  contentRating(rating) {
    if (rating && typeof rating === 'object') {
      if (this.sanitizeInputs) {
        this.data.contentRating = this.sanitizer.sanitizeStructuredData(rating, 'Rating');
      } else {
        this.data.contentRating = rating;
      }
    }
    return this;
  }

  /**
   * Enhanced method to set question with proper structure validation
   * @param {string} questionText - Question text
   * @param {string} [questionName] - Question name (optional)
   * @param {string} [questionUrl] - Question URL (optional)
   * @param {string|Object} [author] - Question author (optional)
   * @param {string|Date} [dateCreated] - Date question was created (optional)
   * @param {number} [answerCount] - Number of answers (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  setQuestionWithMetadata(questionText, questionName = null, questionUrl = null, author = null, dateCreated = null, answerCount = null) {
    const questionObj = {
      "@type": "Question",
      "name": questionName || questionText,
      "text": questionText
    };

    if (questionUrl) questionObj.url = questionUrl;
    if (answerCount !== null) questionObj.answerCount = answerCount;
    if (dateCreated) questionObj.dateCreated = dateCreated;

    if (author) {
      if (typeof author === 'string') {
        questionObj.author = {
          "@type": "Person",
          "name": author
        };
      } else if (typeof author === 'object') {
        questionObj.author = author;
      }
    }

    if (this.sanitizeInputs) {
      questionObj.name = this.sanitizer.sanitizeString(questionObj.name);
      questionObj.text = this.sanitizer.sanitizeString(questionObj.text);
      if (questionObj.url) questionObj.url = this.sanitizer.sanitizeUrl(questionObj.url);
      if (questionObj.answerCount !== null) {
        questionObj.answerCount = this.sanitizer.sanitizeNumber(questionObj.answerCount, { min: 1 });
      }
      if (questionObj.dateCreated) {
        questionObj.dateCreated = this.sanitizer.sanitizeDate(questionObj.dateCreated);
      }
      if (questionObj.author) {
        questionObj.author = this.sanitizer.sanitizeStructuredData(
          questionObj.author, 
          questionObj.author['@type'] || 'Person'
        );
      }
    }

    this.data.mainEntity = questionObj;
    return this;
  }

  /**
   * Enhanced method to add answer with complete metadata
   * @param {string} answerText - Answer text
   * @param {string|Object} [author] - Answer author (optional)
   * @param {string|Date} [dateCreated] - Date answer was created (optional)
   * @param {number} [upvoteCount] - Number of upvotes (optional)
   * @param {string} [url] - Answer URL (optional)
   * @param {boolean} [isAccepted] - Whether this is the accepted answer (optional)
   * @returns {QAPageBuilder} This builder for chaining
   */
  addAnswerWithMetadata(answerText, author = null, dateCreated = null, upvoteCount = null, url = null, isAccepted = false) {
    if (!this.data.mainEntity) {
      this.data.mainEntity = {
        "@type": "Question",
        "name": "Question",
        "text": "Question",
        "answerCount": 1
      };
    }

    const answerObj = {
      "@type": "Answer",
      "text": answerText,
      "dateCreated": dateCreated || new Date().toISOString(),
      "upvoteCount": upvoteCount || 0,
      "url": url || `#answer-${Date.now()}`
    };

    if (author) {
      if (typeof author === 'string') {
        answerObj.author = {
          "@type": "Person",
          "name": author
        };
      } else if (typeof author === 'object') {
        answerObj.author = author;
      }
    }

    if (this.sanitizeInputs) {
      answerObj.text = this.sanitizer.sanitizeString(answerObj.text);
      answerObj.dateCreated = this.sanitizer.sanitizeDate(answerObj.dateCreated);
      answerObj.upvoteCount = this.sanitizer.sanitizeNumber(answerObj.upvoteCount, { min: 0 });
      answerObj.url = this.sanitizer.sanitizeUrl(answerObj.url);
      if (answerObj.author) {
        answerObj.author = this.sanitizer.sanitizeStructuredData(
          answerObj.author, 
          answerObj.author['@type'] || 'Person'
        );
      }
    }

    if (isAccepted) {
      this.data.mainEntity.acceptedAnswer = answerObj;
    } else {
      if (!this.data.mainEntity.suggestedAnswer) {
        this.data.mainEntity.suggestedAnswer = [];
      }
      this.data.mainEntity.suggestedAnswer.push(answerObj);
    }

    // Update answer count
    if (this.data.mainEntity.answerCount === undefined) {
      this.data.mainEntity.answerCount = 1;
    } else {
      this.data.mainEntity.answerCount++;
    }

    return this;
  }
}

module.exports = { QAPageBuilder };
