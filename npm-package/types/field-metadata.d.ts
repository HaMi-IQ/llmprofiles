/**
 * TypeScript definitions for field metadata utilities
 */

export declare const FIELD_IMPORTANCE: {
  readonly REQUIRED: 'required';
  readonly RECOMMENDED: 'recommended';
  readonly OPTIONAL: 'optional';
};

export declare const FIELD_CATEGORY: {
  readonly BASIC: 'basic';
  readonly CONTENT: 'content';
  readonly METADATA: 'metadata';
  readonly SEO: 'seo';
  readonly LLM: 'llm';
  readonly GOOGLE: 'google';
};

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

export declare function getFieldMetadata(profileType: string, fieldName: string): FieldMetadata | null;

export declare function getAllFieldsMetadata(profileType: string): {
  required: FieldMetadata[];
  recommended: FieldMetadata[];
  optional: FieldMetadata[];
};

export declare function getFieldSuggestions(profileType: string, currentData?: any): FieldSuggestions;

export declare function getCompletionHints(profileType: string, partialField?: string): CompletionHint[];
