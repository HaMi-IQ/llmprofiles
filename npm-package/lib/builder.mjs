/**
 * Builder classes for creating structured data objects
 * ES Module version
 */

import { BaseProfileBuilder } from './builders/base-builder.mjs';
import { ArticleBuilder } from './builders/article-builder.mjs';
import { JobPostingBuilder } from './builders/jobposting-builder.mjs';
import { LocalBusinessBuilder } from './builders/localbusiness-builder.mjs';
import { ProductBuilder } from './builders/product-builder.mjs';
import { EventBuilder } from './builders/event-builder.mjs';
import { MODES } from './modes.mjs';

export { 
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
};

// Default export for CommonJS compatibility
export default {
  BaseProfileBuilder,
  ArticleBuilder,
  JobPostingBuilder,
  LocalBusinessBuilder,
  ProductBuilder,
  EventBuilder
};