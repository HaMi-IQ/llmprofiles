#!/usr/bin/env node

/**
 * Simple HTTP server to serve the demo page
 * Usage: node serve-demo.js [port]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 3000;
const demoFile = path.join(__dirname, 'demo.html');

const server = http.createServer((req, res) => {
  // Serve the demo page
  if (req.url === '/' || req.url === '/demo.html') {
    fs.readFile(demoFile, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading demo page: ' + err.message);
        return;
      }
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`🚀 Demo server running at http://localhost:${port}`);
  console.log(`📱 Open your browser and navigate to the URL above`);
  console.log(`🛑 Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down demo server...');
  server.close(() => {
    console.log('✅ Demo server stopped');
    process.exit(0);
  });
});
