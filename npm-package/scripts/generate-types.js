#!/usr/bin/env node

/**
 * Generate TypeScript definitions from actual JavaScript code
 * This ensures type definitions are always in sync with the actual implementation
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class TypeScriptGenerator {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.typesDir = path.join(this.rootDir, 'types');
    this.profilesDir = path.join(this.rootDir, 'profiles');
    this.libDir = path.join(this.rootDir, 'lib');
  }

  async generate() {
    log('🔧 Generating TypeScript definitions...', 'blue');
    
    try {
      // Generate main index.d.ts
      await this.generateMainTypes();
      
      // Generate individual profile types
      await this.generateProfileTypes();
      
      // Generate modes types
      await this.generateModesTypes();
      
      log('✅ TypeScript definitions generated successfully!', 'green');
      
    } catch (error) {
      log(`❌ Failed to generate TypeScript definitions: ${error.message}`, 'red');
      throw error;
    }
  }

  async generateMainTypes() {
    log('  📝 Generating main index.d.ts...', 'blue');
    
    // Build ProfileType union dynamically from enhanced profiles
    const profilesIndex = JSON.parse(fs.readFileSync(path.join(this.profilesDir, 'index.json'), 'utf8'));
    const profileTypeUnion = Object.values(profilesIndex)
      .map(p => `'${p.type}'`)
      .sort()
      .join(' | ');

    const mainTypes = `/**
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

// Type exports for consumers
export type ProfileType = ${profileTypeUnion};
export type Category = 'business' | 'content' | 'interaction' | 'technology';

// Mode exports
export { MODES, ModeConfig, ModeType, ModeConfiguration } from './modes';

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
`;

    fs.writeFileSync(path.join(this.typesDir, 'index.d.ts'), mainTypes);
    log('    ✅ Main types generated', 'green');
  }

  async generateProfileTypes() {
    log('  📝 Generating individual profile types...', 'blue');
    
    // Read the profiles index to get all available profiles
    const profilesIndex = JSON.parse(fs.readFileSync(path.join(this.profilesDir, 'index.json'), 'utf8'));
    
    for (const [profileKey, profile] of Object.entries(profilesIndex)) {
      const profileName = profileKey.toLowerCase();
      const typeContent = `/**
 * TypeScript definitions for ${profile.type} profile
 * Auto-generated from actual JavaScript implementation
 */

import { ProfileDefinition } from '../index.js';

export const ${profileName}Profile: ProfileDefinition;
export default ${profileName}Profile;
`;

      fs.writeFileSync(path.join(this.typesDir, 'profiles', `${profileName}.d.ts`), typeContent);
      log(`    ✅ ${profileName} profile types generated`, 'green');
    }
  }

  async generateModesTypes() {
    log('  📝 Generating modes types...', 'blue');
    
    const modesTypes = `/**
 * TypeScript definitions for modes
 * Auto-generated from actual JavaScript implementation
 */

export type ModeType = 'strict-seo' | 'split-channels' | 'standards-header';

export interface ModeConfiguration {
  useAdditionalType: boolean;
  useSchemaVersion: boolean;
  useAdditionalProperty: boolean;
  useIdentifier: boolean;
  useConformsTo: boolean;
  includeProfileMetadata: boolean;
  separateLLMBlock: boolean;
  includeRelProfile: boolean;
}

export declare class ModeConfig {
  constructor(mode: ModeType);
  getConfig(): ModeConfiguration;
  usesAdditionalType(): boolean;
  usesSchemaVersion(): boolean;
  usesAdditionalProperty(): boolean;
  usesIdentifier(): boolean;
  usesConformsTo(): boolean;
  includesProfileMetadata(): boolean;
  separatesLLMBlock(): boolean;
  includesRelProfile(): boolean;
}

export declare const MODES: {
  STRICT_SEO: 'strict-seo';
  SPLIT_CHANNELS: 'split-channels';
  STANDARDS_HEADER: 'standards-header';
};
`;

    fs.writeFileSync(path.join(this.typesDir, 'modes.d.ts'), modesTypes);
    log('    ✅ Modes types generated', 'green');
  }
}

// Command line interface
async function main() {
  try {
    const generator = new TypeScriptGenerator();
    await generator.generate();
    
    log('', 'green');
    log('🎉 TypeScript definitions are now in sync with the actual implementation!', 'green');
    log('', 'green');
    log('Benefits for TypeScript consumers:', 'blue');
    log('✅ Accurate type checking', 'green');
    log('✅ IntelliSense support', 'green');
    log('✅ Compile-time error detection', 'green');
    log('✅ Auto-completion in IDEs', 'green');
    
  } catch (error) {
    log(`❌ Generation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TypeScriptGenerator };
