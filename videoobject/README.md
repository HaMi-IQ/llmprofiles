# VideoObject Profile v1.0.0

A structured data profile for video content with metadata, transcripts, and content information, optimized for both SEO rich snippets and AI/LLM processing.

## 🎯 Strategic Value

The VideoObject profile solves critical problems in the current video content landscape:

- **Content Fragmentation**: Video content is scattered across platforms with inconsistent metadata structure
- **AI Processing Gaps**: Video content lacks structured data for AI systems to understand and index
- **SEO Rich Snippet Potential**: Videos have high potential for enhanced search results with duration, quality, and interaction data
- **RAG Pipeline Relevance**: Video content is frequently queried in AI systems but lacks proper indexing

## 🚀 Use Cases

- **YouTube videos and educational content**
- **Tutorial and how-to videos**
- **Product demonstration videos**
- **Training and educational content**
- **Entertainment and media content**
- **Corporate and marketing videos**

## 📋 Profile Features

### Required Fields
- `name`: Video title
- `description`: Content description
- `uploadDate`: When the video was uploaded

### Recommended Fields
- `duration`: ISO 8601 duration format
- `thumbnailUrl`: Video thumbnail image
- `contentUrl`: Direct video file URL
- `author` & `creator`: Video creator information
- `transcript`: Full video transcript for AI processing

### AI-Optimized Features
- Transcripts and captions for content understanding
- Duration and quality information for content planning
- Interaction statistics for engagement metrics
- Language and genre classification
- Technical specifications for content delivery

## 🔧 Implementation

### Basic Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Python Tutorial",
  "description": "Learn Python programming basics",
  "uploadDate": "2025-01-15",
  "conformsTo": "https://llmprofiles.org/videoobject/v1/index.jsonld"
}
```

### Advanced Implementation
See `examples/rich.jsonld` for a complete implementation with all features.

## 📊 Validation

### Page Schema
Use `page.schema.json` to validate your JSON-LD before deployment:
```bash
node scripts/validate-ajv.js videoobject/v1/page.schema.json your-video-markup.json
```

### Output Schema
Use `output.schema.json` to validate extracted content for RAG/AI applications.

## 🎓 Training Data

The profile includes `training.jsonl` format for LLM fine-tuning and RAG systems. Publishers can create their own training data that mirrors their on-page semantics.

## 🔗 Related Profiles

- **HowTo Profile**: For instructional video content
- **Recipe Profile**: For cooking and food videos
- **Course Profile**: For educational video series

## 📈 SEO Benefits

- **Rich Snippets**: Video duration, quality, and interaction data in search results
- **Enhanced CTR**: Video thumbnails and metadata in search results
- **Video Search**: Better indexing for Google Video search
- **Featured Snippets**: Transcript content can appear in featured snippets

## 🤖 AI Benefits

- **Content Understanding**: Transcripts and metadata for AI content analysis
- **Training Data**: Normalized format for LLM fine-tuning
- **RAG Systems**: Optimized for video content queries
- **Content Discovery**: Better video content indexing and retrieval

## 📝 Profile Version History

- **v1.0.0** (2025-01-15): Initial release with core video functionality

## 🔍 Discovery

This profile is discoverable via:
- `/.well-known/llmprofiles.json`
- `https://llmprofiles.org/api/discovery.json`
- Direct profile URL: `https://llmprofiles.org/videoobject/v1/index.jsonld`
