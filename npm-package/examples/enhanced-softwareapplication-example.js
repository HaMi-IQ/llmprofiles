const { SoftwareApplicationBuilder } = require('../lib/builders/softwareapplication-builder');
const { MODES } = require('../lib/builders/base-builder');

const app = new SoftwareApplicationBuilder(MODES.STRICT_SEO)
  .name('My App')
  .applicationCategory('BusinessApplication')
  .operatingSystem('macOS')
  .description('A great app')
  .softwareVersion('1.0.0')
  .softwareRequirements('macOS 12+')
  .memoryRequirements('4GB RAM')
  .storageRequirements('500MB')
  .processorRequirements('Intel i5+')
  .featureList('Feature A, Feature B')
  .screenshot('https://example.com/shot.png')
  .downloadUrl('https://example.com/download')
  .installUrl('https://example.com/install')
  .updateUrl('https://example.com/update')
  .fileSize('50MB')
  .releaseNotes('Initial release')
  .datePublished('2024-01-01')
  .dateModified('2024-02-01')
  .author('Jane Doe', 'https://example.com/jane')
  .offers(9.99, 'USD', 'InStock', 'https://example.com/buy')
  .image('https://example.com/app.png')
  .applicationSubCategory('Utilities')
  .applicationSuite('Suite X')
  .permissions('Camera, Files')
  .inLanguage('en-US')
  .keywords(['app','business'])
  .url('https://example.com/app')
  .build();

console.log(JSON.stringify(app, null, 2));
