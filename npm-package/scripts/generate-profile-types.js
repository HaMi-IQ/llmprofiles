/**
 * Script to generate TypeScript definition files for individual profiles
 */

const fs = require('fs');
const path = require('path');

// Read the main profiles index
const profilesPath = path.join(__dirname, '../profiles/index.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

// Create types/profiles directory if it doesn't exist
const typesProfilesDir = path.join(__dirname, '../types/profiles');
if (!fs.existsSync(typesProfilesDir)) {
  fs.mkdirSync(typesProfilesDir, { recursive: true });
}

// Generate TypeScript definition files
Object.keys(profiles).forEach(profileKey => {
  const profile = profiles[profileKey];
  const profileName = profileKey.toLowerCase();
  
  const typeDefinition = `/**
 * TypeScript definitions for ${profile.type} profile
 */

import { ProfileDefinition } from '../index.js';

export const ${profileName}Profile: ProfileDefinition;
export default ${profileName}Profile;
`;

  const typePath = path.join(typesProfilesDir, `${profileName}.d.ts`);
  fs.writeFileSync(typePath, typeDefinition);

  console.log(`Generated ${profileName}.d.ts`);
});

console.log('All TypeScript definition files generated successfully!');
