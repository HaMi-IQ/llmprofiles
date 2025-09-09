/**
 * FAQPageBuilder class for creating FAQPage structured data objects
 */

import { BaseProfileBuilder, MODES } from('./base-builder');

class FAQPageBuilder extends BaseProfileBuilder {
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

export { FAQPageBuilder 
