#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Minimal 1x1 transparent PNG
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';

// Minimal 1x1 white JPEG
const JPG_BASE64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEA8QFRAQDw8PEA8PDw8QEA8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGzAlHyYtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAQMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgQHAgEDAv/EADQQAAEDAgQDBgUEAwAAAAAAAAECAwQABREGEiExQVEiYXEUMnGBkTKhQpLR8CMzcoKissL/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgMBBP/EABwRAQEBAQEBAQEAAAAAAAAAAAABEQIhAzESQf/aAAwDAQACEQMRAD8A3b6b3I6i4m8zH8oS2o6mP3q3xwV2g5p5lX3bZJb1r7AGb0q7uC2p6s6F6Bz9M8k2x9I5jzK0wqA6v8ABF5Jq3T1Ck3v0p0rjY1i9c1vI0z0l6k0r7mVv4tZ6o8qzUO0U5Vq6mQ1Xq9tq7D3p9nJfVJtS6xj0R1b1x0XfQ8PpKkqSx1i4o3uQwAASCSB5p9Bzv8Aq3eYbZr7kqFhYpQbKxBqgB2Gk+fK3m4o0fVbJrjD2mryyS8pS2y1wK0kAlQdQeM+8n3kZ5O5b7m1k6B1VnVn6fT8y8hK2hG6hK1B0r0AhgWgYB9mS2h1yTiU8pYcZrJ4t9r//2Q==';

const rootDir = path.join(__dirname, '..');
const imagesDir = path.join(rootDir, 'images');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFileBinary(targetPath, base64) {
  ensureDir(path.dirname(targetPath));
  fs.writeFileSync(targetPath, Buffer.from(base64, 'base64'));
  console.log(`✅ Wrote placeholder: ${path.relative(rootDir, targetPath)}`);
}

// Targets from examples
const targets = [
  // Root logo
  { file: path.join(rootDir, 'logo.png'), type: 'png' },
  // Images folder
  { file: path.join(imagesDir, 'llmprofiles-overview.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'validator-pro.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'conference-2025.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'course-structured-data.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'consulting-office.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'validator-screenshot.jpg'), type: 'jpg' },
  { file: path.join(imagesDir, 'validator-icon.png'), type: 'png' }
];

// Create placeholders if missing or empty
for (const { file, type } of targets) {
  try {
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      writeFileBinary(file, type === 'png' ? PNG_BASE64 : JPG_BASE64);
    } else {
      console.log(`ℹ️  Exists: ${path.relative(rootDir, file)}`);
    }
  } catch (err) {
    console.error(`❌ Failed to write ${file}: ${err.message}`);
  }
}

console.log('\n🎉 Generic placeholder images are ready.');
