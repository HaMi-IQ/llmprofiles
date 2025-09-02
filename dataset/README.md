# Dataset Profile v1.0.0

A structured data profile for datasets and data collections, optimized for both SEO rich snippets and AI/LLM processing.

## 🎯 Strategic Value

The Dataset profile solves critical problems in the current data content landscape:

- **Content Fragmentation**: Dataset information is scattered across platforms with inconsistent metadata structure
- **AI Processing Gaps**: Data content lacks structured information for AI systems to discover and understand
- **SEO Rich Snippet Potential**: Datasets have high potential for enhanced search results with format, size, and access information
- **RAG Pipeline Relevance**: Dataset content is fundamental to AI training and RAG systems but lacks proper indexing

## 🚀 Use Cases

- **Research institution data catalogs**
- **Government open data portals**
- **Academic research datasets**
- **Corporate data sharing platforms**
- **Scientific data repositories**
- **Public health and environmental data**

## 📋 Profile Features

### Required Fields
- `name`: Dataset title
- `description`: Dataset content description

### Recommended Fields
- `creator`: Dataset creator or organization
- `distribution`: Available formats and download links
- `license`: Usage rights and restrictions
- `datePublished`: Publication date
- `spatialCoverage`: Geographic coverage
- `temporalCoverage`: Time period covered

### AI-Optimized Features
- Multiple format availability for different use cases
- Data quality and provenance information
- Variable and measurement descriptions
- Access restrictions and licensing details
- Citation and reference information

## 🔧 Implementation

### Basic Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "COVID-19 Data",
  "description": "Global coronavirus dataset",
  "conformsTo": "https://llmprofiles.org/dataset/v1/index.jsonld"
}
```

### Advanced Implementation
See `examples/rich.jsonld` for a complete implementation with all features.

## 📊 Validation

### Page Schema
Use `page.schema.json` to validate your JSON-LD before deployment:
```bash
node scripts/validate-ajv.js dataset/v1/page.schema.json your-dataset-markup.json
```

### Output Schema
Use `output.schema.json` to validate extracted content for RAG/AI applications.

## 🎓 Training Data

The profile includes `training.jsonl` format for LLM fine-tuning and RAG systems. Publishers can create their own training data that mirrors their on-page semantics.

## 🔗 Related Profiles

- **Article Profile**: For research papers about datasets
- **SoftwareApplication Profile**: For data analysis tools
- **Course Profile**: For data science education

## 📈 SEO Benefits

- **Rich Snippets**: Dataset format, size, and access information in search results
- **Enhanced CTR**: Dataset metadata and download links in search results
- **Data Search**: Better indexing for Google Dataset search
- **Research Discovery**: Enhanced visibility for academic and research datasets

## 🤖 AI Benefits

- **Data Discovery**: Structured metadata for AI content understanding
- **Training Data**: Normalized format for LLM fine-tuning
- **RAG Systems**: Optimized for dataset-related queries and discovery
- **Content Classification**: Better dataset categorization and topic modeling

## 📝 Profile Version History

- **v1.0.0** (2025-01-15): Initial release with core dataset functionality

## 🔍 Discovery

This profile is discoverable via:
- `/.well-known/llmprofiles.json`
- `https://llmprofiles.org/api/discovery.json`
- Direct profile URL: `https://llmprofiles.org/dataset/v1/index.jsonld`
