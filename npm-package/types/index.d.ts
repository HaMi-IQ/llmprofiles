/**
 * TypeScript definitions for @llmprofiles/core
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

export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  description: string;
  importance: 'recommended';
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
  constructor(profileType: string, category: string, mode?: ModeType);
  build(mode?: ModeType): any;
  addProperty(property: string, value: any): this;
  url(url: string): this;
  name(name: string): this;
  description(description: string): this;
  image(image: string | object): this;
  getRelProfile(): string | null;
  getLinkHeader(): string | null;
}

export declare class ArticleBuilder extends BaseProfileBuilder {
  constructor();
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
  constructor();
  title(title: string): this;
  hiringOrganization(organization: string | object, url?: string): this;
  jobLocation(location: string | object): this;
  datePosted(date: string | Date): this;
  employmentType(type: string): this;
  baseSalary(salary: string | number | object, currency?: string): this;
}

export declare class LocalBusinessBuilder extends BaseProfileBuilder {
  constructor();
  address(address: string | object): this;
  telephone(telephone: string): this;
  openingHours(hours: string | string[]): this;
  geo(latitude: number, longitude: number): this;
  priceRange(priceRange: string): this;
}

export declare class ProductBuilder extends BaseProfileBuilder {
  constructor();
  brand(brand: string | object): this;
  offers(price: number | object, currency?: string, availability?: string): this;
  sku(sku: string): this;
  aggregateRating(ratingValue: number, reviewCount: number, bestRating?: number, worstRating?: number): this;
}

export declare class EventBuilder extends BaseProfileBuilder {
  constructor();
  startDate(date: string | Date): this;
  endDate(date: string | Date): this;
  location(location: string | object): this;
  organizer(organizer: string | object): this;
  offers(price: number | object, currency?: string, url?: string): this;
}

export declare class ProfileValidator {
  constructor();
  validate(data: any, profileType: string): ValidationResult;
  validateBatch(dataArray: any[], profileType: string): BatchValidationResult;
  getValidationStats(dataArray: any[], profileType: string): ValidationStats;
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
export declare function createMinimalExample(profileType: string, mode?: ModeType): any;
export declare function getGoogleRichResultsFields(profileType: string): string[] | null;
export declare function getLLMOptimizedFields(profileType: string): string[] | null;
export declare function getSchemaOrgUrl(profileType: string): string | null;

// Type exports for consumers
export type ProfileType = 'Article' | 'JobPosting' | 'LocalBusiness' | 'Product' | 'Event' | 'FAQPage' | 'SoftwareApplication';
export type Category = 'business' | 'content' | 'interaction' | 'technology';

// Mode exports
export { MODES, ModeConfig, ModeType, ModeConfiguration } from './modes';

// Mode-specific functions
export declare function getModeConfiguration(mode: ModeType): ModeConfig;
export declare function getHTMLRelProfile(mode: ModeType): string | null;
export declare function getHTTPLinkHeader(mode: ModeType): string | null;

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
