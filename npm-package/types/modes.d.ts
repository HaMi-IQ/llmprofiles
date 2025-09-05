/**
 * Mode configuration for different output strategies
 */

export const MODES: {
  readonly STRICT_SEO: 'strict-seo';
  readonly SPLIT_CHANNELS: 'split-channels';
  readonly STANDARDS_HEADER: 'standards-header';
};

export type ModeType = typeof MODES[keyof typeof MODES];

export interface ModeConfiguration {
  useAdditionalType: boolean;
  useSchemaVersion: boolean;
  useAdditionalProperty: boolean;
  useIdentifier: boolean;
  useConformsTo: boolean;
  includeProfileMetadata: boolean;
  separateLLMBlock?: boolean;
  includeRelProfile?: boolean;
}

export class ModeConfig {
  constructor(mode?: ModeType);
  
  readonly mode: ModeType;
  
  validateMode(): void;
  getConfig(): ModeConfiguration;
  
  usesAdditionalType(): boolean;
  usesSchemaVersion(): boolean;
  usesAdditionalProperty(): boolean;
  usesIdentifier(): boolean;
  includesProfileMetadata(): boolean;
  separatesLLMBlock(): boolean;
  includesRelProfile(): boolean;
  
  getRelProfileValue(): string | null;
  getLinkHeaderValue(): string | null;
}

