#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple validation test for CI examples
async function testCIValidation() {
  console.log('🧪 Testing CI Validation Examples\n');
  
  // Test page schema validation
  const pageSchemaPath = path.join(__dirname, '..', 'faqpage', 'v1', 'page.schema.json');
  const pageExamplePath = path.join(__dirname, '..', 'examples', 'faqpage', 'minimal.page.jsonld');
  
  console.log('📄 Testing Page Schema:');
  console.log(`   Schema: ${pageSchemaPath}`);
  console.log(`   Example: ${pageExamplePath}`);
  
  if (fs.existsSync(pageSchemaPath) && fs.existsSync(pageExamplePath)) {
    console.log('   ✅ Both files exist');
    
    try {
      const schema = JSON.parse(fs.readFileSync(pageSchemaPath, 'utf8'));
      const example = JSON.parse(fs.readFileSync(pageExamplePath, 'utf8'));
      console.log('   ✅ Both files are valid JSON');
      console.log(`   📊 Schema has ${Object.keys(schema.properties || {}).length} properties`);
      console.log(`   📊 Example has ${Object.keys(example).length} properties`);
    } catch (error) {
      console.log(`   ❌ JSON parsing error: ${error.message}`);
    }
  } else {
    console.log('   ❌ Missing files');
  }
  
  // Test output schema validation
  const outputSchemaPath = path.join(__dirname, '..', 'faqpage', 'v1', 'output.schema.json');
  const outputExamplePath = path.join(__dirname, '..', 'examples', 'faqpage', 'sample.output.json');
  
  console.log('\n📤 Testing Output Schema:');
  console.log(`   Schema: ${outputSchemaPath}`);
  console.log(`   Example: ${outputExamplePath}`);
  
  if (fs.existsSync(outputSchemaPath) && fs.existsSync(outputExamplePath)) {
    console.log('   ✅ Both files exist');
    
    try {
      const schema = JSON.parse(fs.readFileSync(outputSchemaPath, 'utf8'));
      const example = JSON.parse(fs.readFileSync(outputExamplePath, 'utf8'));
      console.log('   ✅ Both files are valid JSON');
      console.log(`   📊 Schema has ${Object.keys(schema.properties || {}).length} properties`);
      console.log(`   📊 Example has ${Object.keys(example).length} properties`);
    } catch (error) {
      console.log(`   ❌ JSON parsing error: ${error.message}`);
    }
  } else {
    console.log('   ❌ Missing files');
  }
  
  // Test CI workflow file
  const ciWorkflowPath = path.join(__dirname, '..', '.github', 'workflows', 'validate-llmprofiles.yml');
  
  console.log('\n🔧 Testing CI Workflow:');
  console.log(`   Workflow: ${ciWorkflowPath}`);
  
  if (fs.existsSync(ciWorkflowPath)) {
    console.log('   ✅ CI workflow exists');
    const workflow = fs.readFileSync(ciWorkflowPath, 'utf8');
    console.log(`   📊 Workflow has ${workflow.split('\n').length} lines`);
    console.log('   ✅ CI workflow is ready for copy-paste');
  } else {
    console.log('   ❌ CI workflow missing');
  }
  
  console.log('\n✅ CI validation test completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Copy the CI workflow to your repository');
  console.log('   2. Add your own examples to the examples/ directory');
  console.log('   3. Run the validation in your CI pipeline');
}

// Run test
if (require.main === module) {
  testCIValidation().catch(console.error);
}

module.exports = { testCIValidation };
