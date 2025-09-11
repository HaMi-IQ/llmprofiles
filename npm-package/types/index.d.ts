/**
 * TypeScript definitions for @llmprofiles/core
 * Auto-generated from actual JavaScript implementation
 */

export interface ProfileDefinition {
  type: string;
  category: 'business' | 'content' | 'interaction' | 'technology';
  schemaType: string;
  profileUrl: string;
  description: string;
  required: Record<string, any>;
  recommended: Record<string, any>;
  optional: Record<string, any>;
  googleRichResults: string[];
  llmOptimized: string[];
}

// Field metadata types
export interface FieldMetadata {
  name: string;
  type: string;
  importance: 'required' | 'recommended' | 'optional';
  category: 'basic' | 'content' | 'metadata' | 'seo' | 'llm' | 'google';
  description: string;
  examples: string[];
  googleRichResults: boolean;
  llmOptimized: boolean;
  validation: any;
  guidance: FieldGuidance;
}

export interface FieldGuidance {
  message: string;
  action: string;
  severity: 'error' | 'warning' | 'info';
}

export interface FieldSuggestion {
  name: string;
  type: string;
  importance: 'required' | 'recommended' | 'optional';
  category: 'basic' | 'content' | 'metadata' | 'seo' | 'llm' | 'google';
  description: string;
  examples: string[];
  googleRichResults: boolean;
  llmOptimized: boolean;
  reason: string;
  priority: number;
}

export interface FieldSuggestions {
  critical: FieldSuggestion[];
  important: FieldSuggestion[];
  helpful: FieldSuggestion[];
  optional: FieldSuggestion[];
}

export interface CompletionHint {
  label: string;
  kind: 'property';
  detail: string;
  documentation: string;
  insertText: string;
  sortText: string;
}

export interface CompletionStatus {
  overall: {
    score: number;
    status: 'complete' | 'good' | 'fair' | 'incomplete';
  };
  required: {
    score: number;
    completed: number;
    total: number;
    missing: FieldSuggestion[];
  };
  recommended: {
    score: number;
    completed: number;
    total: number;
    missing: FieldSuggestion[];
  };
  optional: {
    available: number;
    suggested: FieldSuggestion[];
  };
}

export interface InlineValidationResult {
  valid: boolean;
  score: number;
  status: 'complete' | 'good' | 'fair' | 'incomplete';
  errors: EnhancedValidationError[];
  warnings: EnhancedValidationWarning[];
  suggestions: FieldSuggestion[];
  summary: CompletionStatus;
}

export interface EnhancedValidationError {
  field: string;
  message: string;
  value: any;
  path?: string;
  guidance?: FieldMetadata['guidance'];
  enhancedMessage?: string;
  suggestions?: FieldSuggestion[];
  severity: 'error';
}

export interface EnhancedValidationWarning {
  field: string;
  message: string;
  description: string;
  importance: 'recommended';
  guidance?: FieldMetadata['guidance'];
  enhancedMessage?: string;
  suggestions?: FieldSuggestion[];
  priority?: 'high' | 'medium' | 'low';
  reason?: string;
  googleRichResults?: boolean;
}

export interface NextStep {
  priority: number;
  type: 'required' | 'google-rich-results' | 'recommended' | 'optional';
  message: string;
  fields: string[];
  action: string;
}

export interface BuilderStateSummary {
  profileType: string;
  category: string;
  mode: string;
  completion: CompletionStatus;
  fieldCounts: {
    required: number;
    recommended: number;
    optional: number;
    total: number;
  };
  currentFields: string[];
  nextSteps: NextStep[];
}

export interface ValidationError {
  field: string;
  message: string;
  value: any;
  path?: string;
  guidance?: FieldMetadata['guidance'];
  enhancedMessage?: string;
  suggestions?: FieldSuggestion[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  description: string;
  importance: 'recommended';
  guidance?: FieldMetadata['guidance'];
  enhancedMessage?: string;
  suggestions?: FieldSuggestion[];
  priority?: 'high' | 'medium' | 'low';
  reason?: string;
  googleRichResults?: boolean;
}

export interface GoogleRichResultsCheck {
  compliant: boolean;
  coverage: number;
  missing: string[];
  present: string[];
  totalRequired: number;
}

export interface LLMOptimizationCheck {
  optimized: boolean;
  score: number;
  missing: string[];
  present: string[];
  totalOptimized: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  googleRichResults: GoogleRichResultsCheck;
  llmOptimization: LLMOptimizationCheck;
  sanitized?: any;
  securityWarnings?: Array<{ field: string; message: string; severity: 'low' | 'medium' | 'high' }>;
}

export interface BatchValidationSummary {
  total: number;
  valid: number;
  invalid: number;
  withWarnings: number;
  googleCompliant: number;
  llmOptimized: number;
}

export interface BatchValidationResult {
  summary: BatchValidationSummary;
  results: Array<ValidationResult & { index: number }>;
}

export interface ValidationStats extends BatchValidationSummary {
  averageGoogleCompliance: number;
  averageLLMOptimization: number;
  fieldCoverage: Record<string, { count: number; percentage: number }>;
  commonErrors: Array<{ error: string; count: number }>;
  commonWarnings: Array<{ field: string; count: number }>;
}

// Builder classes
export declare class BaseProfileBuilder {
  constructor(profileType: string, category: string, mode?: ModeType, sanitizeInputs?: boolean);
  build(mode?: ModeType, options?: { validate?: boolean; throwOnError?: boolean }): any;
  buildUnsafe(mode?: ModeType): any;
  buildWithWarnings(mode?: ModeType): any;
  addProperty(property: string, value: any): this;
  url(url: string): this;
  name(name: string): this;
  description(description: string): this;
  image(image: string | object): this;
  getRelProfile(): string | null;
  getLinkHeader(): string | null;

  // Enhanced field discovery and autocomplete methods
  getFieldMetadata(fieldName: string): FieldMetadata | null;
  getAllFieldsMetadata(): { required: FieldMetadata[]; recommended: FieldMetadata[]; optional: FieldMetadata[] };
  getSuggestions(): FieldSuggestions;
  getCompletionHints(partialField?: string): CompletionHint[];
  getMissingRequired(): FieldSuggestion[];
  getMissingRecommended(): FieldSuggestion[];
  getAvailableOptional(): FieldSuggestion[];
  getGoogleRichResultsFields(): FieldMetadata[];
  getLLMOptimizedFields(): FieldMetadata[];
  getCompletionStatus(): CompletionStatus;
  validateInline(): InlineValidationResult;
  getStateSummary(): BuilderStateSummary;
  getNextSteps(): NextStep[];
  
  // Validation and error state management
  isValid(): boolean;
  getMissingRequiredFields(): string[];
  getEnhancedSuggestions(options?: { includeOptional?: boolean; prioritizeGoogleRichResults?: boolean }): any;
}

export declare class ArticleBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  headline(headline: string): this;
  author(author: string | object, url?: string): this;
  datePublished(date: string | Date): this;
  dateModified(date: string | Date): this;
  publisher(publisher: string | object, url?: string, logoUrl?: string): this;
  articleBody(body: string): this;
  keywords(keywords: string | string[]): this;
  wordCount(count: number): this;
}

export declare class JobPostingBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  title(title: string): this;
  hiringOrganization(organization: string | object, url?: string): this;
  jobLocation(location: string | object): this;
  datePosted(date: string | Date): this;
  employmentType(type: string): this;
  baseSalary(salary: string | number | object, currency?: string): this;
}

export declare class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  address(address: string | object): this;
  telephone(telephone: string): this;
  openingHours(hours: string | string[]): this;
  geo(latitude: number, longitude: number): this;
  priceRange(priceRange: string): this;
}

export declare class ProductBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  brand(brand: string | object): this;
  offers(price: number | object, currency?: string, availability?: string): this;
  sku(sku: string): this;
  aggregateRating(ratingValue: number, reviewCount: number, bestRating?: number, worstRating?: number): this;
}

export declare class EventBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  startDate(date: string | Date): this;
  endDate(date: string | Date): this;
  location(location: string | object): this;
  organizer(organizer: string | object): this;
  offers(price: number | object, currency?: string, url?: string): this;
}

export declare class BookBuilder extends BaseProfileBuilder {
  constructor(mode?: ModeType, sanitizeInputs?: boolean);
  author(author: string | object, url?: string): this;
  bookFormat(format: string): this;
  isbn(isbn: string): this;
  numberOfPages(pages: number): this;
  inLanguage(language: string): this;
  datePublished(date: string | Date): this;
  dateModified(date: string | Date): this;
  publisher(publisher: string | object, url?: string): this;
  genre(genre: string): this;
  keywords(keywords: string | string[]): this;
  about(topics: string[]): this;
  audience(audience: object): this;
  aggregateRating(ratingValue: number, reviewCount: number, bestRating?: number, worstRating?: number): this;
  review(reviews: object[]): this;
  id(id: string): this;
  url(url: string): this;
  sameAs(url: string): this;
  bookEdition(edition: string): this;
  addWorkExample(edition: object): this;
  illustrator(illustrator: string | object, url?: string): this;
  translator(translator: string | object, url?: string): this;
  copyrightYear(year: number): this;
  copyrightHolder(holder: string | object, url?: string, type?: 'Person' | 'Organization'): this;
  awards(awards: string): this;
  citation(citation: string): this;
}

export declare class CourseBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class DatasetBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class HowToBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class RecipeBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class VideoObjectBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class FAQPageBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class QAPageBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class SoftwareApplicationBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }
export declare class ReviewBuilder extends BaseProfileBuilder { constructor(mode?: ModeType, sanitizeInputs?: boolean); }

export declare class ProfileValidator {
  constructor(sanitizeInputs?: boolean);
  validate(data: any, profileType: string): ValidationResult;
  validateBatch(dataArray: any[], profileType: string): BatchValidationResult;
  getValidationStats(dataArray: any[], profileType: string): ValidationStats;
  
  // Enhanced field metadata methods
  getFieldSuggestions(profileType: string, currentData?: any): FieldSuggestions;
  getAllFieldMetadata(profileType: string): { required: FieldMetadata[]; recommended: FieldMetadata[]; optional: FieldMetadata[] };
  getFieldMetadata(profileType: string, fieldName: string): FieldMetadata | null;
}

// Main exports
export declare const profiles: Record<string, ProfileDefinition>;

export declare const CATEGORIES: {
  BUSINESS: 'business';
  CONTENT: 'content';
  INTERACTION: 'interaction';
  TECHNOLOGY: 'technology';
};

// Helper functions
export declare function getProfile(type: string): ProfileDefinition | null;
export declare function listProfiles(): string[];
export declare function getProfilesByCategory(category: string): string[];
export declare function validateStructuredData(data: any, profileType: string): ValidationResult;
export declare function validate(data: any, profileType: string): ValidationResult;
export declare function createMinimalExample(profileType: string, mode?: ModeType): any;
export declare function createMinimalExampleWithMode(profileType: string, mode: ModeType): any;
export declare function getGoogleRichResultsFields(profileType: string): string[] | null;
export declare function getLLMOptimizedFields(profileType: string): string[] | null;
export declare function getSchemaOrgUrl(profileType: string): string | null;

// Enhanced field metadata and suggestions
export declare function getFieldMetadata(profileType: string, fieldName: string): any;
export declare function getAllFieldsMetadata(profileType: string): { required: any[]; recommended: any[]; optional: any[] };
export declare function getFieldSuggestions(profileType: string, currentData?: any): any;
export declare function getEnhancedFieldSuggestions(profileType: string, currentData?: any, options?: { includeOptional?: boolean; prioritizeGoogleRichResults?: boolean }): any;
export declare function getCompletionHints(profileType: string, partialField?: string): any[];

// Type exports for consumers
export type ProfileType = 'Article' | 'Book' | 'Course' | 'Dataset' | 'Event' | 'Faqpage' | 'Howto' | 'Jobposting' | 'Localbusiness' | 'ProductOffer' | 'Qapage' | 'Recipe' | 'Review' | 'Softwareapplication' | 'Videoobject';
export type Category = 'business' | 'content' | 'interaction' | 'technology';

// Mode exports
export { MODES, ModeConfig, ModeType, ModeConfiguration } from './modes';

// Field metadata exports
export { 
  FIELD_IMPORTANCE, 
  FIELD_CATEGORY, 
  getFieldMetadata, 
  getAllFieldsMetadata, 
  getFieldSuggestions, 
  getCompletionHints 
} from './field-metadata';

// Mode-specific functions
export declare function getModeConfiguration(mode: ModeType): ModeConfig;
export declare function getHTMLRelProfile(mode: ModeType): string | null;
export declare function getHTTPLinkHeader(mode: ModeType): string | null;

// Simplified factory
export declare function createBuilder(profileType: ProfileType | string, options?: { mode?: ModeType; sanitize?: boolean }): BaseProfileBuilder;

// Individual profile exports
export { articleProfile } from './profiles/article';
export { jobpostingProfile } from './profiles/jobposting';
export { localbusinessProfile } from './profiles/localbusiness';
export { productofferProfile } from './profiles/productoffer';
export { reviewProfile } from './profiles/review';
export { bookProfile } from './profiles/book';
export { courseProfile } from './profiles/course';
export { datasetProfile } from './profiles/dataset';
export { howtoProfile } from './profiles/howto';
export { recipeProfile } from './profiles/recipe';
export { videoobjectProfile } from './profiles/videoobject';
export { eventProfile } from './profiles/event';
export { faqpageProfile } from './profiles/faqpage';
export { qapageProfile } from './profiles/qapage';
export { softwareapplicationProfile } from './profiles/softwareapplication';

// Input sanitization
export declare class InputSanitizer {
  constructor();
  sanitizeString(input: string): string;
  sanitizeUrl(input: string): string | null;
  sanitizeEmail(input: string): string | null;
  sanitizePhone(input: string): string | null;
  sanitizeDate(input: string | Date): string | null;
  sanitizeNumber(input: any, options?: { min?: number; max?: number }): number | null;
  sanitizeStructuredData(data: any, profileType: string): any;
  sanitizeStringArray(input: string[]): string[];
  sanitizeLanguageCode(input: string): string | null;
  sanitizeSku(input: string): string | null;
}

export declare const defaultSanitizer: InputSanitizer;
