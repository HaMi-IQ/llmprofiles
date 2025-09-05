/**
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
