#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test the well-known endpoint discovery
async function testWellKnownDiscovery() {
  console.log('🔍 Testing Well-Known LLM Profiles Discovery\n');
  
  // Read the well-known file
  const wellKnownPath = path.join(__dirname, '..', '.well-known', 'llmprofiles.json');
  const declaration = JSON.parse(fs.readFileSync(wellKnownPath, 'utf8'));
  
  console.log('📋 Publisher Information:');
  console.log(`   Name: ${declaration.publisher.name}`);
  console.log(`   URL: ${declaration.publisher.url}`);
  console.log(`   Version: ${declaration.version}`);
  console.log(`   Last Updated: ${declaration.lastUpdated}\n`);
  
  console.log('📊 Profile Declarations:');
  declaration.profiles.forEach((profile, index) => {
    console.log(`   ${index + 1}. ${profile.type} (${profile.version})`);
    console.log(`      Page: ${profile.page}`);
    if (profile.training) {
      console.log(`      Training: ${profile.training}`);
    }
    console.log(`      Description: ${profile.description}\n`);
  });
  
  console.log('🎯 Capabilities:');
  console.log(`   Total Profiles: ${declaration.capabilities.totalProfiles}`);
  console.log(`   Has Training Data: ${declaration.capabilities.hasTrainingData}`);
  console.log(`   Has Page Schemas: ${declaration.capabilities.hasPageSchemas}`);
  console.log(`   Has Output Schemas: ${declaration.capabilities.hasOutputSchemas}`);
  console.log(`   Has Examples: ${declaration.capabilities.hasExamples}\n`);
  
  console.log('🔗 Available Endpoints:');
  Object.entries(declaration.endpoints).forEach(([name, url]) => {
    console.log(`   ${name}: ${url}`);
  });
  
  console.log('\n✅ Well-known discovery test completed!');
}

// Simulate aggregator discovery
async function simulateAggregatorDiscovery() {
  console.log('\n🤖 Simulating Aggregator Discovery\n');
  
  // Example domains to check
  const domains = [
    'example.com',
    'techblog.com', 
    'newsite.com'
  ];
  
  console.log('Checking domains for LLM Profiles declarations:');
  
  for (const domain of domains) {
    const wellKnownUrl = `https://${domain}/.well-known/llmprofiles.json`;
    console.log(`\n   🔍 ${domain}:`);
    
    try {
      // In a real scenario, this would be a fetch request
      console.log(`      URL: ${wellKnownUrl}`);
      console.log(`      Status: Would attempt to fetch`);
      console.log(`      Result: Would parse declaration if found`);
    } catch (error) {
      console.log(`      Status: No declaration found`);
    }
  }
  
  console.log('\n📝 Aggregator Discovery Process:');
  console.log('   1. Fetch /.well-known/llmprofiles.json from domain');
  console.log('   2. Parse the declaration JSON');
  console.log('   3. Extract profile information');
  console.log('   4. Access training data URLs');
  console.log('   5. Validate against profile schemas');
  console.log('   6. Process content for aggregation');
}

// Run tests
async function main() {
  await testWellKnownDiscovery();
  await simulateAggregatorDiscovery();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testWellKnownDiscovery, simulateAggregatorDiscovery };
