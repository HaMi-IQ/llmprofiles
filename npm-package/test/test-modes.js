/**
 * Test file demonstrating the three modes
 */

const { 
  ProductBuilder, 
  MODES, 
  ModeConfig,
  createMinimalExample,
  getModeConfiguration,
  getHTMLRelProfile,
  getHTTPLinkHeader
} = require('../index');

console.log('=== LLMProfiles Core - Three Modes Demo ===\n');

// Test 1: Strict SEO Mode (Default)
console.log('1. STRICT SEO MODE (Default)');
console.log('================================');

const productSEO = new ProductBuilder()
  .name('Wireless Bluetooth Headphones')
  .description('High-quality wireless headphones with noise cancellation')
  .brand('AudioTech')
  .sku('AT-WH-001')
  .offers(199.99, 'USD', 'InStock')
  .build();

console.log('Output:');
console.log(JSON.stringify(productSEO, null, 2));
console.log('\nMode Configuration:');
const configSEO = new ModeConfig(MODES.STRICT_SEO);
console.log('- Uses additionalType:', configSEO.usesAdditionalType());
console.log('- Uses schemaVersion:', configSEO.usesSchemaVersion());
console.log('- Uses identifier:', configSEO.usesIdentifier());
console.log('- Uses additionalProperty:', configSEO.usesAdditionalProperty());
console.log('- Includes profile metadata:', configSEO.includesProfileMetadata());
console.log('- Separates LLM block:', configSEO.separatesLLMBlock());
console.log('- Includes rel profile:', configSEO.includesRelProfile());

// Test 2: Split Channels Mode
console.log('\n\n2. SPLIT CHANNELS MODE');
console.log('========================');

const productSplit = new ProductBuilder(MODES.SPLIT_CHANNELS)
  .name('Wireless Bluetooth Headphones')
  .description('High-quality wireless headphones with noise cancellation')
  .brand('AudioTech')
  .sku('AT-WH-001')
  .offers(199.99, 'USD', 'InStock')
  .build();

console.log('Output:');
console.log(JSON.stringify(productSplit, null, 2));
console.log('\nMode Configuration:');
const configSplit = new ModeConfig(MODES.SPLIT_CHANNELS);
console.log('- Uses additionalType:', configSplit.usesAdditionalType());
console.log('- Uses schemaVersion:', configSplit.usesSchemaVersion());
console.log('- Uses identifier:', configSplit.usesIdentifier());
console.log('- Uses additionalProperty:', configSplit.usesAdditionalProperty());
console.log('- Includes profile metadata:', configSplit.includesProfileMetadata());
console.log('- Separates LLM block:', configSplit.separatesLLMBlock());
console.log('- Includes rel profile:', configSplit.includesRelProfile());

// Test 3: Standards Header Mode
console.log('\n\n3. STANDARDS HEADER MODE');
console.log('==========================');

const productStandardsBuilder = new ProductBuilder(MODES.STANDARDS_HEADER)
  .name('Wireless Bluetooth Headphones')
  .description('High-quality wireless headphones with noise cancellation')
  .brand('AudioTech')
  .sku('AT-WH-001')
  .offers(199.99, 'USD', 'InStock');

const productStandards = productStandardsBuilder.build();

console.log('Output:');
console.log(JSON.stringify(productStandards, null, 2));
console.log('\nHTML and HTTP Headers:');
console.log('- HTML rel profile:', productStandardsBuilder.getRelProfile());
console.log('- HTTP Link header:', productStandardsBuilder.getLinkHeader());

console.log('\nMode Configuration:');
const configStandards = new ModeConfig(MODES.STANDARDS_HEADER);
console.log('- Uses additionalType:', configStandards.usesAdditionalType());
console.log('- Uses schemaVersion:', configStandards.usesSchemaVersion());
console.log('- Uses identifier:', configStandards.usesIdentifier());
console.log('- Uses additionalProperty:', configStandards.usesAdditionalProperty());
console.log('- Includes profile metadata:', configStandards.includesProfileMetadata());
console.log('- Separates LLM block:', configStandards.separatesLLMBlock());
console.log('- Includes rel profile:', configStandards.includesRelProfile());

// Test 4: Utility Functions
console.log('\n\n4. UTILITY FUNCTIONS');
console.log('=====================');

console.log('Create minimal example (Strict SEO):');
const minimalSEO = createMinimalExample('ProductOffer', MODES.STRICT_SEO);
console.log(JSON.stringify(minimalSEO, null, 2));

console.log('\nCreate minimal example (Split Channels):');
const minimalSplit = createMinimalExample('ProductOffer', MODES.SPLIT_CHANNELS);
console.log(JSON.stringify(minimalSplit, null, 2));

console.log('\nGet mode configuration:');
const config = getModeConfiguration(MODES.SPLIT_CHANNELS);
console.log('Split Channels config:', config.getConfig());

console.log('\nGet HTML rel profile:');
console.log('Strict SEO:', getHTMLRelProfile(MODES.STRICT_SEO));
console.log('Split Channels:', getHTMLRelProfile(MODES.SPLIT_CHANNELS));
console.log('Standards Header:', getHTMLRelProfile(MODES.STANDARDS_HEADER));

console.log('\nGet HTTP Link header:');
console.log('Strict SEO:', getHTTPLinkHeader(MODES.STRICT_SEO));
console.log('Split Channels:', getHTTPLinkHeader(MODES.SPLIT_CHANNELS));
console.log('Standards Header:', getHTTPLinkHeader(MODES.STANDARDS_HEADER));

// Test 5: Mode Override
console.log('\n\n5. MODE OVERRIDE');
console.log('==================');

const productDefaultBuilder = new ProductBuilder()
  .name('Test Product');

const productDefault = productDefaultBuilder.build();

console.log('Default mode build:');
console.log(JSON.stringify(productDefault, null, 2));

console.log('\nOverride to Split Channels:');
const productOverride = productDefaultBuilder.build(MODES.SPLIT_CHANNELS);
console.log(JSON.stringify(productOverride, null, 2));

console.log('\n=== Demo Complete ===');
