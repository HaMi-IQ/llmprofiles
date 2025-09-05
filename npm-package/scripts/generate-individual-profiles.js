/**
 * Script to generate individual profile files from the main profiles index
 */

const fs = require('fs');
const path = require('path');

// Read the main profiles index
const profilesPath = path.join(__dirname, '../profiles/index.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

// Create profiles directory if it doesn't exist
const profilesDir = path.join(__dirname, '../profiles');
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

// Generate individual profile files
Object.keys(profiles).forEach(profileKey => {
  const profile = profiles[profileKey];
  const profileName = profileKey.toLowerCase();
  
  // Generate CommonJS version
  const commonJsContent = `/**
 * ${profile.type} profile definition
 * CommonJS version
 */

const ${profileName}Profile = ${JSON.stringify(profile, null, 2)};

module.exports = ${profileName}Profile;
`;

  // Generate ES Module version
  const esModuleContent = `/**
 * ${profile.type} profile definition
 * ES Module version
 */

export const ${profileName}Profile = ${JSON.stringify(profile, null, 2)};

export default ${profileName}Profile;
`;

  // Write CommonJS file
  const commonJsPath = path.join(profilesDir, `${profileName}.js`);
  fs.writeFileSync(commonJsPath, commonJsContent);

  // Write ES Module file
  const esModulePath = path.join(profilesDir, `${profileName}.mjs`);
  fs.writeFileSync(esModulePath, esModuleContent);

  console.log(`Generated ${profileName} profile files`);
});

console.log('All individual profile files generated successfully!');
