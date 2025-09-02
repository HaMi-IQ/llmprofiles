# LLM Profiles

This directory contains all profile definitions organized by category.

## Structure

- **content/**: Content-focused profiles (articles, books, courses, etc.)
- **business/**: Business-focused profiles (local businesses, jobs, products, etc.)
- **interaction/**: User interaction profiles (FAQs, Q&A, events, etc.)
- **technology/**: Technology profiles (software, applications, etc.)

## Adding New Profiles

1. Create a new directory in the appropriate category
2. Follow the standard profile structure:
   - `index.jsonld` - Profile definition
   - `page.schema.json` - Page validation schema
   - `output.schema.json` - Output validation schema
   - `examples/` - Implementation examples
   - `training.jsonl` - Training data

## Profile Categories

### Content Profiles
- `article` - Article and blog post profiles
- `book` - Book and publication profiles
- `course` - Educational course profiles
- `dataset` - Dataset and data collection profiles
- `howto` - How-to guide profiles
- `recipe` - Recipe and instruction profiles
- `videoobject` - Video content profiles

### Business Profiles
- `localbusiness` - Local business profiles
- `jobposting` - Job posting profiles
- `product-offer` - Product offer profiles
- `review` - Review and rating profiles

### Interaction Profiles
- `faqpage` - FAQ page profiles
- `qapage` - Q&A page profiles
- `event` - Event profiles

### Technology Profiles
- `softwareapplication` - Software application profiles
- `software` - Software profiles
