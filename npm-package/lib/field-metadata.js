/**
 * @fileoverview Field metadata system for enhanced builder functionality
 * 
 * This module provides a comprehensive field metadata system that enhances
 * builder functionality with field importance levels, guidance, autocomplete
 * support, and intelligent suggestions. It helps developers understand which
 * fields are required, recommended, or optional, and provides context-aware
 * suggestions for completing structured data.
 * 
 * @version 2.0.5-alpha.0
 * @author HAMI
 * @license MIT
 * 
 * @example
 * // Get field metadata
 * const { getFieldMetadata, FIELD_IMPORTANCE } = require('./field-metadata');
 * const metadata = getFieldMetadata('Article', 'headline');
 * console.log('Field importance:', metadata.importance);
 * 
 * @example
 * // Get field suggestions
 * const { getFieldSuggestions } = require('./field-metadata');
 * const suggestions = getFieldSuggestions('Article', { headline: 'My Article' });
 * console.log('Missing required fields:', suggestions.critical);
 * 
 * @example
 * // Get completion hints for IDE
 * const { getCompletionHints } = require('./field-metadata');
 * const hints = getCompletionHints('Article', 'auth');
 * console.log('Autocomplete suggestions:', hints);
 */

const profiles = require('../profiles/index.json');

/**
 * Field importance level constants
 * 
 * @constant {Object} FIELD_IMPORTANCE
 * @property {string} REQUIRED - Required fields that must be present for valid structured data
 * @property {string} RECOMMENDED - Recommended fields that improve SEO and rich results
 * @property {string} OPTIONAL - Optional fields that can enhance functionality
 * 
 * @example
 * const { FIELD_IMPORTANCE } = require('./field-metadata');
 * 
 * // Check field importance
 * if (metadata.importance === FIELD_IMPORTANCE.REQUIRED) {
 *   console.log('This field is required');
 * }
 */
const FIELD_IMPORTANCE = {
  /** @type {string} Required fields that must be present for valid structured data */
  REQUIRED: 'required',
  /** @type {string} Recommended fields that improve SEO and rich results */
  RECOMMENDED: 'recommended', 
  /** @type {string} Optional fields that can enhance functionality */
  OPTIONAL: 'optional'
};

/**
 * Field category constants for better organization
 * 
 * @constant {Object} FIELD_CATEGORY
 * @property {string} BASIC - Basic fields like name, description, URL
 * @property {string} CONTENT - Content-related fields like headline, articleBody
 * @property {string} METADATA - Metadata fields like author, publisher, dates
 * @property {string} SEO - SEO-related fields like mainEntityOfPage, breadcrumb
 * @property {string} LLM - LLM-optimized fields like about, mentions, topics
 * @property {string} GOOGLE - Google Rich Results specific fields
 * 
 * @example
 * const { FIELD_CATEGORY } = require('./field-metadata');
 * 
 * // Check field category
 * if (metadata.category === FIELD_CATEGORY.BASIC) {
 *   console.log('This is a basic field');
 * }
 */
const FIELD_CATEGORY = {
  /** @type {string} Basic fields like name, description, URL */
  BASIC: 'basic',
  /** @type {string} Content-related fields like headline, articleBody */
  CONTENT: 'content',
  /** @type {string} Metadata fields like author, publisher, dates */
  METADATA: 'metadata',
  /** @type {string} SEO-related fields like mainEntityOfPage, breadcrumb */
  SEO: 'seo',
  /** @type {string} LLM-optimized fields like about, mentions, topics */
  LLM: 'llm',
  /** @type {string} Google Rich Results specific fields */
  GOOGLE: 'google'
};

/**
 * Get field metadata for a specific profile type
 * @param {string} profileType - Profile type (e.g., 'Article', 'JobPosting')
 * @param {string} fieldName - Field name
 * @returns {Object|null} Field metadata or null if not found
 */
function getFieldMetadata(profileType, fieldName) {
  const profile = profiles[profileType];
  if (!profile) return null;

  // Check required fields
  if (profile.required && profile.required[fieldName]) {
    return {
      name: fieldName,
      type: profile.required[fieldName].type || 'string',
      importance: FIELD_IMPORTANCE.REQUIRED,
      category: getFieldCategory(fieldName),
      description: profile.required[fieldName].description || getDefaultDescription(fieldName),
      examples: getFieldExamples(fieldName, profile.required[fieldName]),
      googleRichResults: profile.googleRichResults?.includes(fieldName) || false,
      llmOptimized: profile.llmOptimized?.includes(fieldName) || false,
      validation: profile.required[fieldName],
      guidance: getFieldGuidance(fieldName, FIELD_IMPORTANCE.REQUIRED)
    };
  }

  // Check recommended fields
  if (profile.recommended && profile.recommended[fieldName]) {
    return {
      name: fieldName,
      type: profile.recommended[fieldName].type || 'string',
      importance: FIELD_IMPORTANCE.RECOMMENDED,
      category: getFieldCategory(fieldName),
      description: profile.recommended[fieldName].description || getDefaultDescription(fieldName),
      examples: getFieldExamples(fieldName, profile.recommended[fieldName]),
      googleRichResults: profile.googleRichResults?.includes(fieldName) || false,
      llmOptimized: profile.llmOptimized?.includes(fieldName) || false,
      validation: profile.recommended[fieldName],
      guidance: getFieldGuidance(fieldName, FIELD_IMPORTANCE.RECOMMENDED)
    };
  }

  // Check optional fields
  if (profile.optional && profile.optional[fieldName]) {
    return {
      name: fieldName,
      type: profile.optional[fieldName].type || 'string',
      importance: FIELD_IMPORTANCE.OPTIONAL,
      category: getFieldCategory(fieldName),
      description: profile.optional[fieldName].description || getDefaultDescription(fieldName),
      examples: getFieldExamples(fieldName, profile.optional[fieldName]),
      googleRichResults: profile.googleRichResults?.includes(fieldName) || false,
      llmOptimized: profile.llmOptimized?.includes(fieldName) || false,
      validation: profile.optional[fieldName],
      guidance: getFieldGuidance(fieldName, FIELD_IMPORTANCE.OPTIONAL)
    };
  }

  return null;
}

/**
 * Get all fields for a profile type with metadata
 * @param {string} profileType - Profile type
 * @returns {Object} Object with field metadata organized by importance
 */
function getAllFieldsMetadata(profileType) {
  const profile = profiles[profileType];
  if (!profile) return { required: [], recommended: [], optional: [] };

  const result = {
    required: [],
    recommended: [],
    optional: []
  };

  // Process required fields
  if (profile.required) {
    Object.keys(profile.required).forEach(fieldName => {
      if (fieldName !== '@type' && fieldName !== 'additionalType' && 
          fieldName !== 'schemaVersion' && fieldName !== 'identifier' && 
          fieldName !== 'additionalProperty') {
        const metadata = getFieldMetadata(profileType, fieldName);
        if (metadata) result.required.push(metadata);
      }
    });
  }

  // Process recommended fields
  if (profile.recommended) {
    Object.keys(profile.recommended).forEach(fieldName => {
      if (fieldName !== '@context') {
        const metadata = getFieldMetadata(profileType, fieldName);
        if (metadata) result.recommended.push(metadata);
      }
    });
  }

  // Process optional fields
  if (profile.optional) {
    Object.keys(profile.optional).forEach(fieldName => {
      const metadata = getFieldMetadata(profileType, fieldName);
      if (metadata) result.optional.push(metadata);
    });
  }

  return result;
}

/**
 * Get field suggestions based on current state
 * @param {string} profileType - Profile type
 * @param {Object} currentData - Current data object
 * @returns {Object} Suggestions organized by priority
 */
function getFieldSuggestions(profileType, currentData = {}) {
  const allFields = getAllFieldsMetadata(profileType);
  const suggestions = {
    critical: [], // Missing required fields
    important: [], // Missing recommended fields that are Google Rich Results
    helpful: [], // Missing recommended fields
    optional: [] // Available optional fields
  };

  // Check for missing required fields
  allFields.required.forEach(field => {
    if (!currentData[field.name] || currentData[field.name] === '') {
      suggestions.critical.push({
        ...field,
        reason: 'Required field missing',
        priority: 1
      });
    }
  });

  // Check for missing recommended fields
  allFields.recommended.forEach(field => {
    if (!currentData[field.name] || currentData[field.name] === '') {
      const suggestion = {
        ...field,
        reason: field.googleRichResults ? 'Recommended for Google Rich Results' : 'Recommended for better SEO',
        priority: field.googleRichResults ? 2 : 3
      };
      
      if (field.googleRichResults) {
        suggestions.important.push(suggestion);
      } else {
        suggestions.helpful.push(suggestion);
      }
    }
  });

  // Add available optional fields
  allFields.optional.forEach(field => {
    suggestions.optional.push({
      ...field,
      reason: 'Optional enhancement',
      priority: 4
    });
  });

  return suggestions;
}

/**
 * Get field category based on field name
 * @private
 */
function getFieldCategory(fieldName) {
  const categoryMap = {
    // Basic fields
    '@type': FIELD_CATEGORY.BASIC,
    '@context': FIELD_CATEGORY.BASIC,
    'name': FIELD_CATEGORY.BASIC,
    'description': FIELD_CATEGORY.BASIC,
    'url': FIELD_CATEGORY.BASIC,
    'image': FIELD_CATEGORY.BASIC,
    
    // Content fields
    'headline': FIELD_CATEGORY.CONTENT,
    'articleBody': FIELD_CATEGORY.CONTENT,
    'keywords': FIELD_CATEGORY.CONTENT,
    'content': FIELD_CATEGORY.CONTENT,
    'text': FIELD_CATEGORY.CONTENT,
    
    // Metadata fields
    'author': FIELD_CATEGORY.METADATA,
    'publisher': FIELD_CATEGORY.METADATA,
    'datePublished': FIELD_CATEGORY.METADATA,
    'dateModified': FIELD_CATEGORY.METADATA,
    'inLanguage': FIELD_CATEGORY.METADATA,
    
    // SEO fields
    'mainEntityOfPage': FIELD_CATEGORY.SEO,
    'breadcrumb': FIELD_CATEGORY.SEO,
    'canonical': FIELD_CATEGORY.SEO,
    
    // LLM optimization fields
    'about': FIELD_CATEGORY.LLM,
    'mentions': FIELD_CATEGORY.LLM,
    'topics': FIELD_CATEGORY.LLM,
    
    // Google Rich Results fields
    'aggregateRating': FIELD_CATEGORY.GOOGLE,
    'review': FIELD_CATEGORY.GOOGLE,
    'offers': FIELD_CATEGORY.GOOGLE
  };

  return categoryMap[fieldName] || FIELD_CATEGORY.BASIC;
}

/**
 * Get default description for a field
 * @private
 */
function getDefaultDescription(fieldName) {
  const descriptions = {
    'name': 'The name or title of the item',
    'description': 'A description of the item',
    'url': 'The URL of the item',
    'image': 'An image of the item',
    'author': 'The author of the item',
    'publisher': 'The publisher of the item',
    'datePublished': 'The date the item was published',
    'dateModified': 'The date the item was last modified',
    'headline': 'The headline of the article',
    'articleBody': 'The main content of the article',
    'keywords': 'Keywords describing the item',
    'inLanguage': 'The language of the content',
    'mainEntityOfPage': 'The main entity of the page'
  };

  return descriptions[fieldName] || `The ${fieldName} field`;
}

/**
 * Get field examples based on field definition
 * @private
 */
function getFieldExamples(fieldName, fieldDef) {
  const examples = {
    'name': ['"My Article Title"', '"Product Name"', '"Event Name"'],
    'description': ['"A brief description of the item"', '"Detailed description with key information"'],
    'url': ['"https://example.com/article"', '"https://example.com/product"'],
    'image': ['"https://example.com/image.jpg"', 'ImageObject with url, width, height'],
    'author': ['"John Doe"', 'Person object with name and url'],
    'datePublished': ['"2024-01-01T00:00:00Z"', '"2024-01-01"'],
    'keywords': ['"keyword1, keyword2, keyword3"', '["keyword1", "keyword2"]'],
    'inLanguage': ['"en"', '"en-US"', '"es"'],
    'headline': ['"Breaking News: Important Update"', '"How to Build a Website"']
  };

  if (examples[fieldName]) {
    return examples[fieldName];
  }

  // Generate examples based on field type
  if (fieldDef.type === 'string') {
    return [`"example ${fieldName}"`];
  } else if (fieldDef.type === 'number' || fieldDef.type === 'integer') {
    return ['123', '45.67'];
  } else if (fieldDef.type === 'boolean') {
    return ['true', 'false'];
  } else if (fieldDef.type === 'array') {
    return ['["item1", "item2"]', '[]'];
  } else if (fieldDef.type === 'object') {
    return ['{}', 'Object with properties'];
  }

  return ['Example value'];
}

/**
 * Get field guidance based on importance
 * @private
 */
function getFieldGuidance(fieldName, importance) {
  const guidance = {
    [FIELD_IMPORTANCE.REQUIRED]: {
      message: 'This field is required for valid structured data',
      action: 'You must provide a value for this field',
      severity: 'error'
    },
    [FIELD_IMPORTANCE.RECOMMENDED]: {
      message: 'This field is recommended for better SEO and rich results',
      action: 'Consider adding this field to improve visibility',
      severity: 'warning'
    },
    [FIELD_IMPORTANCE.OPTIONAL]: {
      message: 'This field is optional but can enhance your structured data',
      action: 'Add this field if relevant to your content',
      severity: 'info'
    }
  };

  const baseGuidance = guidance[importance] || guidance[FIELD_IMPORTANCE.OPTIONAL];

  // Add specific guidance for certain fields
  if (fieldName === 'image' && importance === FIELD_IMPORTANCE.RECOMMENDED) {
    baseGuidance.message += '. Images help with rich results and social sharing';
  } else if (fieldName === 'description' && importance === FIELD_IMPORTANCE.RECOMMENDED) {
    baseGuidance.message += '. Descriptions improve search result snippets';
  } else if (fieldName === 'keywords' && importance === FIELD_IMPORTANCE.RECOMMENDED) {
    baseGuidance.message += '. Keywords help with content categorization';
  }

  return baseGuidance;
}

/**
 * Get completion hints for IDE autocomplete
 * @param {string} profileType - Profile type
 * @param {string} partialField - Partial field name being typed
 * @returns {Array} Array of completion hints
 */
function getCompletionHints(profileType, partialField = '') {
  const allFields = getAllFieldsMetadata(profileType);
  const allFieldsList = [
    ...allFields.required,
    ...allFields.recommended,
    ...allFields.optional
  ];

  if (!partialField) {
    return allFieldsList.map(field => ({
      label: field.name,
      kind: 'property',
      detail: `${field.importance} - ${field.type}`,
      documentation: field.description,
      insertText: field.name,
      sortText: `${field.importance === FIELD_IMPORTANCE.REQUIRED ? '0' : field.importance === FIELD_IMPORTANCE.RECOMMENDED ? '1' : '2'}_${field.name}`,
      importance: field.importance,
      googleRichResults: field.googleRichResults,
      llmOptimized: field.llmOptimized
    }));
  }

  return allFieldsList
    .filter(field => field.name.toLowerCase().includes(partialField.toLowerCase()))
    .map(field => ({
      label: field.name,
      kind: 'property',
      detail: `${field.importance} - ${field.type}`,
      documentation: field.description,
      insertText: field.name,
      sortText: `${field.importance === FIELD_IMPORTANCE.REQUIRED ? '0' : field.importance === FIELD_IMPORTANCE.RECOMMENDED ? '1' : '2'}_${field.name}`,
      importance: field.importance,
      googleRichResults: field.googleRichResults,
      llmOptimized: field.llmOptimized
    }));
}

/**
 * Get field suggestions for a specific profile type with enhanced metadata
 * @param {string} profileType - Profile type
 * @param {Object} currentData - Current data object
 * @param {Object} options - Options for suggestions
 * @param {boolean} [options.includeOptional=true] - Whether to include optional fields
 * @param {boolean} [options.includeSummary=true] - Whether to include summary statistics
 * @param {boolean} [options.includeConvenienceProps=true] - Whether to include convenience boolean properties
 * @returns {Object} Enhanced suggestions with metadata
 */
function getEnhancedFieldSuggestions(profileType, currentData = {}, options = {}) {
  const { includeOptional = true, includeSummary = true, includeConvenienceProps = true } = options;
  const suggestions = getFieldSuggestions(profileType, currentData);
  
  // Add enhanced metadata to suggestions
  const enhanceSuggestions = (suggestionList) => {
    return suggestionList.map(suggestion => {
      const enhanced = { ...suggestion };
      
      if (includeConvenienceProps) {
        enhanced.isRequired = suggestion.importance === FIELD_IMPORTANCE.REQUIRED;
        enhanced.isRecommended = suggestion.importance === FIELD_IMPORTANCE.RECOMMENDED;
        enhanced.isOptional = suggestion.importance === FIELD_IMPORTANCE.OPTIONAL;
        enhanced.hasGoogleRichResults = suggestion.googleRichResults;
        enhanced.hasLLMOptimization = suggestion.llmOptimized;
      }
      
      return enhanced;
    });
  };

  const enhancedSuggestions = {
    critical: enhanceSuggestions(suggestions.critical || []),
    important: enhanceSuggestions(suggestions.important || []),
    helpful: enhanceSuggestions(suggestions.helpful || []),
    optional: includeOptional ? enhanceSuggestions(suggestions.optional || []) : []
  };

  // Add summary information if requested
  if (includeSummary) {
    enhancedSuggestions.summary = {
      totalFields: enhancedSuggestions.critical.length + enhancedSuggestions.important.length + enhancedSuggestions.helpful.length + enhancedSuggestions.optional.length,
      requiredFields: enhancedSuggestions.critical.length,
      recommendedFields: enhancedSuggestions.important.length + enhancedSuggestions.helpful.length,
      optionalFields: enhancedSuggestions.optional.length,
      googleRichResultsFields: [...enhancedSuggestions.critical, ...enhancedSuggestions.important, ...enhancedSuggestions.helpful, ...enhancedSuggestions.optional]
        .filter(f => f.googleRichResults).length,
      llmOptimizedFields: [...enhancedSuggestions.critical, ...enhancedSuggestions.important, ...enhancedSuggestions.helpful, ...enhancedSuggestions.optional]
        .filter(f => f.llmOptimized).length
    };
  }

  return enhancedSuggestions;
}

module.exports = {
  FIELD_IMPORTANCE,
  FIELD_CATEGORY,
  getFieldMetadata,
  getAllFieldsMetadata,
  getFieldSuggestions,
  getCompletionHints,
  getEnhancedFieldSuggestions
};
