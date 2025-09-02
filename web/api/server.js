#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const ProfileDiscoveryAPI = require('./discovery');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize API
const api = new ProfileDiscoveryAPI();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all profiles
app.get('/api/discovery', (req, res) => {
  try {
    const profiles = api.getAllProfiles();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to load profiles',
      message: error.message
    });
  }
});

// Search profiles
app.get('/api/discovery/search', (req, res) => {
  try {
    const { q, hasPageSchema, hasTrainingData, hasExamples, schemaType } = req.query;
    
    const filters = {};
    if (hasPageSchema !== undefined) filters.hasPageSchema = hasPageSchema === 'true';
    if (hasTrainingData !== undefined) filters.hasTrainingData = hasTrainingData === 'true';
    if (hasExamples !== undefined) filters.hasExamples = hasExamples === 'true';
    if (schemaType) filters.schemaType = schemaType;
    
    const results = api.searchProfiles(q, filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to search profiles',
      message: error.message
    });
  }
});

// Get capabilities summary
app.get('/api/discovery/capabilities', (req, res) => {
  try {
    const capabilities = api.getCapabilitiesSummary();
    res.json(capabilities);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get capabilities',
      message: error.message
    });
  }
});

// Get recommendations
app.get('/api/discovery/recommendations', (req, res) => {
  try {
    const { useCase, limit = 5 } = req.query;
    
    if (!useCase) {
      return res.status(400).json({
        error: 'Missing required parameter: useCase'
      });
    }
    
    const recommendations = api.getRecommendations(useCase, parseInt(limit));
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get recommendations',
      message: error.message
    });
  }
});

// Get specific profile
app.get('/api/discovery/profile/:name', (req, res) => {
  try {
    const { name } = req.params;
    const allProfiles = api.getAllProfiles();
    
    const profile = allProfiles.profiles.find(p => 
      p.name.toLowerCase() === name.toLowerCase()
    );
    
    if (!profile) {
      return res.status(404).json({
        error: 'Profile not found',
        message: `Profile '${name}' does not exist`
      });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
});

// Get API documentation
app.get('/api/discovery/docs', (req, res) => {
  try {
    const docs = api.getAPIDocumentation();
    res.json(docs);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get API documentation',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/discovery',
      'GET /api/discovery/search',
      'GET /api/discovery/capabilities',
      'GET /api/discovery/recommendations',
      'GET /api/discovery/profile/:name',
      'GET /api/discovery/docs'
    ]
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Profile Discovery API server running on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/discovery/docs`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
