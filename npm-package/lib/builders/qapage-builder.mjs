/**
 * QAPageBuilder class for creating QAPage structured data objects
 */

import { BaseProfileBuilder, MODES } from './base-builder.mjs';

export class QAPageBuilder extends BaseProfileBuilder {
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
