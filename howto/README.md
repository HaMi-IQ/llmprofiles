# HowTo Profile v1.0.0

A structured data profile for instructional content and step-by-step guides, optimized for both SEO rich snippets and AI/LLM processing.

## 🎯 Strategic Value

The HowTo profile solves critical problems in the current instructional content landscape:

- **Content Fragmentation**: How-to content is scattered across blogs, YouTube, and websites with inconsistent structure
- **AI Processing Gaps**: Step-by-step instructions are difficult for AI systems to parse and understand
- **SEO Rich Snippet Potential**: How-to content has high potential for enhanced search results with time estimates, difficulty levels, and step-by-step displays
- **RAG Pipeline Relevance**: Instructional content is frequently queried in conversational AI and assistance systems

## 🚀 Use Cases

- **DIY and home improvement guides**
- **Technical tutorials and how-to articles**
- **Educational step-by-step content**
- **Skill-building and training materials**
- **Maintenance and repair instructions**
- **Craft and hobby tutorials**

## 📋 Profile Features

### Required Fields
- `name`: Title of the how-to guide
- `description`: What the guide teaches
- `step`: Step-by-step instructions

### Recommended Fields
- `totalTime`: ISO 8601 duration format
- `difficulty`: Beginner, Intermediate, Advanced, or Expert
- `tool`: Required tools and equipment
- `supply`: Materials and supplies needed
- `estimatedCost`: Estimated cost to complete

### AI-Optimized Features
- Structured step-by-step instructions with numbering
- Tool and supply requirements for planning
- Difficulty levels for skill assessment
- Time estimates for scheduling
- Prerequisites for skill validation

## 🔧 Implementation

### Basic Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Change a Tire",
  "description": "Step-by-step guide to safely change a flat tire",
  "step": ["Park safely", "Loosen lug nuts", "Jack up car"],
  "conformsTo": "https://llmprofiles.org/howto/v1/index.jsonld"
}
```

### Advanced Implementation
See `examples/rich.jsonld` for a complete implementation with all features.

## 📊 Validation

### Page Schema
Use `page.schema.json` to validate your JSON-LD before deployment:
```bash
node scripts/validate-ajv.js howto/v1/page.schema.json your-howto-markup.json
```

### Output Schema
Use `output.schema.json` to validate extracted content for RAG/AI applications.

## 🎓 Training Data

The profile includes `training.jsonl` format for LLM fine-tuning and RAG systems. Publishers can create their own training data that mirrors their on-page semantics.

## 🔗 Related Profiles

- **Recipe Profile**: For cooking and food preparation instructions
- **Article Profile**: For how-to blog posts and articles
- **Course Profile**: For educational content with prerequisites

## 📈 SEO Benefits

- **Rich Snippets**: Step-by-step instructions, time estimates, and difficulty levels in search results
- **Enhanced CTR**: Visual how-to cards in search results
- **Voice Search**: Optimized for "How do I..." queries
- **Featured Snippets**: Better chance of appearing in Google's featured snippets

## 🤖 AI Benefits

- **Structured Data**: Consistent format for AI content understanding
- **Training Data**: Normalized format for LLM fine-tuning
- **RAG Systems**: Optimized for instructional queries
- **Conversational AI**: Better step-by-step assistance and guidance

## 📝 Profile Version History

- **v1.0.0** (2025-01-15): Initial release with core how-to functionality

## 🔍 Discovery

This profile is discoverable via:
- `/.well-known/llmprofiles.json`
- `https://llmprofiles.org/api/discovery.json`
- Direct profile URL: `https://llmprofiles.org/howto/v1/index.jsonld`
