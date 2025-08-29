# llmprofiles — Structured Data Profiles for AI & SEO

![AEO-Ready](https://img.shields.io/badge/AEO-Ready-brightgreen)
![Profile-Discovery](https://img.shields.io/badge/.well--known-passed-brightgreen)
![CI-Contracts](https://img.shields.io/github/actions/workflow/status/HaMi-IQ/llmprofiles/validate-llmprofiles.yml?label=contracts)

**Organization:** HAMI-IQ • **Domain:** https://llmprofiles.org • **Repository:** https://github.com/HaMi-IQ/llmprofiles.git

**Turn structured data into operational, testable, AEO-ready content.**

## 🔷 AEO Pattern in 60 Seconds

> **AEO Pattern (Answer-Engine-Ready in 5 steps)**
>
> 1. **Choose profile** (e.g., `FAQPage v1`)
> 2. **Mark up page** (server-rendered JSON-LD)
> 3. **Assert profile contract** in CI (**`page.schema.json`**)
> 4. **Normalize extractor output** in CI (**`output.schema.json`**)
> 5. **Publish discovery** (**`/.well-known/llmprofiles.json`**) + **training feed** (`training.jsonl`)

```mermaid
flowchart LR
A[Page Content] --> B[JSON-LD (Profile)]
B -->|CI: page.schema.json| C{Pass?}
C -- No --> D[Fail build]
C -- Yes --> E[Extractor]
E -->|CI: output.schema.json| F{Pass?}
F -- No --> D
F -- Yes --> G[training.jsonl]
G --> H[Answer Engines / RAG]
H --> I[Better Answers]
```

## 🎯 The Problem

Today's structured data landscape is fragmented and incomplete:

- **Schema.org** provides a giant vocabulary but no opinionated guidance
- **Google's docs** offer examples but no machine-enforceable validation
- **Teams struggle** with over/under-using fields and inconsistent implementations
- **No bridge** exists between SEO markup and LLM/RAG pipelines
- **No standard** for training data exports that match your on-page semantics
- **Client-only JSON-LD and unstable IDs** break answerability

## 🚀 What LLM Profiles Solves

We provide **opinionated, testable profiles** that bridge the gap between SEO and AI:

### ✅ **Opinionated Profiles, Not Just Examples**
Instead of Schema.org's giant vocabulary, we ship **constrained subsets per use case** (e.g., FAQPage v1) with machine-enforceable validation.

### ✅ **Dual-Contract Design**
- **`page.schema.json`** - Validate your JSON-LD in CI before deployment
- **`output.schema.json`** - Normalized data for extractors/RAG pipelines

### ✅ **LLM-Ready Export Format**
**`training.jsonl`** - Publisher-owned export that mirrors your on-page semantics for RAG/fine-tuning.

### ✅ **Governance & Versioning**
Canonical, versioned IRIs (`/faqpage/v1`), immutability, CHANGELOG, and community PR checks. **SemVer**: *PATCH = non-breaking schema clarifications; MINOR = additive fields; MAJOR = breaking.*

### ✅ **Discovery Convention**
**`/.well-known/llmprofiles.json`** - Let aggregators/partners auto-discover your profile + training feed.

### ✅ **Answer Engine Optimization (AEO)**
Built-in stable anchors, language hints, and anti-patterns for better AI retrieval.

## 📊 Before vs. After

| Problem Today | What LLM Profiles Adds |
|---------------|------------------------|
| Schema.org is huge; teams over/under-use fields | **Opinionated profile per use case** (FAQPage v1) |
| No way to test JSON-LD pre-deploy | **`page.schema.json`** (AJV-friendly) for CI gating |
| Markup ≠ what your LLM stack needs | **`output.schema.json`** normalizes data for RAG |
| No standard feed for LLMs | **`training.jsonl`** export shape (publisher-owned) |
| Docs are human; machines can't "govern" | **Versioned IRIs + CI checks + SHACL** in spec |
| Hard for partners to find your data | **`/.well-known/llmprofiles.json`** discovery |

## ✅ AEO-Ready Checklist (copy this into your PR template)

* [ ] **Stable IDs:** each page and each Q/A has a persistent `@id` (don't recycle).
* [ ] **Language hints:** `inLanguage` (BCP-47, e.g., `en`, `ur-PK`).
* [ ] **Server-rendered JSON-LD:** markup present in initial HTML (no client-only).
* [ ] **Disambiguation:** prefer `sameAs` links to Wikipedia/Wikidata/official pages.
* [ ] **Canonical Q/A:** questions are concise; answers are plain-text first; no sales fluff.
* [ ] **Evidence anchors:** use `isBasedOn`/`url` pointing to page anchors for each answer.
* [ ] **Freshness:** include `dateModified`; training lines include `version` and `source_url`.
* [ ] **Profile discovery:** `/.well-known/llmprofiles.json` published and valid.
* [ ] **CI gates green:** `page.schema.json` and `output.schema.json` both pass in CI.
* [ ] **Privacy pass:** no secrets/PII in `training.jsonl`.

## 📋 Available Profiles

| Profile | Status | Version | Description |
|---------|--------|---------|-------------|
| [FAQPage](faqpage/v1/) | ✅ Enhanced | v1.0.0 | FAQ pages with Q&A pairs, training data, and examples |
| [QAPage](qapage/v1/) | ✅ Enhanced | v1.0.0 | Single question threads with training data and examples |
| [Article](article/v1/) | ✅ Enhanced | v1.0.0 | Blog posts and articles with training data and examples |
| [ProductOffer](product-offer/v1/) | ✅ Enhanced | v1.0.0 | Product listings with training data and examples |
| [Event](event/v1/) | ✅ Enhanced | v1.0.0 | Event information with training data and examples |
| [Course](course/v1/) | ✅ Enhanced | v1.0.0 | Educational courses with training data and examples |
| [JobPosting](jobposting/v1/) | ✅ Enhanced | v1.0.0 | Job advertisements with training data and examples |
| [LocalBusiness](localbusiness/v1/) | ✅ Enhanced | v1.0.0 | Business listings with training data and examples |
| [SoftwareApplication](softwareapplication/v1/) | ✅ Enhanced | v1.0.0 | Software products with training data and examples |
| [Review](review/v1/) | ✅ Enhanced | v1.0.0 | Product reviews with training data and examples |

## 🧩 Profiles Compatibility Table (AEO-focused)

| Profile         | AEO Anchors                          | Discovery | Training Feed | CI Contract                               |
| --------------- | ------------------------------------ | --------- | ------------- | ----------------------------------------- |
| FAQPage v1      | Q/A `@id`, `inLanguage`, `sameAs`    | ✅         | ✅             | `page.schema.json` + `output.schema.json` |
| Article v1      | `@id`, `headline`, `about`, `sameAs` | ✅         | ✅             | ✅                                         |
| ProductOffer v1 | `@id`, `sku`, `gtin`, `brand`        | ✅         | ✅             | ✅                                         |
| Event v1        | `@id`, `startDate`, `location`       | ✅         | ✅             | ✅                                         |
| Course v1       | `@id`, `coursePrerequisites`         | ✅         | ✅             | ✅                                         |
| JobPosting v1   | `@id`, `title`, `hiringOrganization` | ✅         | ✅             | ✅                                         |
| LocalBusiness v1| `@id`, `address`, `geo`               | ✅         | ✅             | ✅                                         |
| SoftwareApp v1  | `@id`, `applicationCategory`         | ✅         | ✅             | ✅                                         |
| Review v1       | `@id`, `reviewRating`, `itemReviewed`| ✅         | ✅             | ✅                                         |
| QAPage v1       | `@id`, `question`, `acceptedAnswer`  | ✅         | ✅             | ✅                                         |

## 🛠️ Quick Start

### 1. Choose Your Profile

```bash
# Browse all available profiles
curl https://llmprofiles.org/api/discovery.json

# Get a specific profile (e.g., FAQPage)
curl https://llmprofiles.org/faqpage/v1
```

### 2. Implement & Validate

```javascript
// Fetch the profile and schemas
const profile = await fetch('https://llmprofiles.org/faqpage/v1');
const pageSchema = await fetch('https://llmprofiles.org/faqpage/v1/page.schema.json');
const outputSchema = await fetch('https://llmprofiles.org/faqpage/v1/output.schema.json');

// Use in your application (AEO-optimized)
const faqMarkup = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://example.com/help#faq",
  "inLanguage": "en",
  "conformsTo": "https://llmprofiles.org/faqpage/v1",
  "mainEntity": [
    {
      "@type": "Question",
      "@id": "https://example.com/help#q-what-is-llmprofiles",
      "name": "What is LLM Profiles?",
      "acceptedAnswer": {
        "@type": "Answer",
        "@id": "https://example.com/help#a-what-is-llmprofiles",
        "text": "Opinionated, testable structured data profiles for AI & SEO.",
        "isBasedOn": "https://example.com/help#faq"
      },
      "sameAs": ["https://llmprofiles.org/faqpage/v1"]
    }
  ],
  "dateModified": "2025-08-28"
};
```

### 3. Validate in CI/CD

```bash
# Validate your JSON-LD before deployment
npx ajv validate -s faqpage/v1/page.schema.json -d your-page-markup.json

# Validate extracted content for RAG
npx ajv validate -s faqpage/v1/output.schema.json -d your-extracted-data.json
```

### 4. Export Training Data

```bash
# Get training data for LLM fine-tuning
curl https://llmprofiles.org/faqpage/v1/training.jsonl
```

> **What is `/faqpage/v1/training.jsonl`?**
> It's a **shape/spec**, not our data. **Publishers** host their own `training.jsonl` with lines that **mirror their on-page semantics**—ready for RAG/fine-tuning.

**Minimal line (example):**
```json
{"id":"faq#what-is-llmprofiles",
 "lang":"en",
 "url":"https://example.com/help#q-what-is-llmprofiles",
 "version":"faqpage.v1",
 "input":"What is LLM Profiles?",
 "output":"Opinionated, testable structured data profiles for AI & SEO.",
 "evidence":["https://example.com/help#faq"]}
```

**🔧 Testing Tools:**
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/
- **JSON-LD Playground:** https://json-ld.org/playground/

## 🧪 CI Gate (copy-paste ready)

### `.github/workflows/validate-llmprofiles.yml`

```yaml
name: Validate LLM Profiles
on:
  pull_request:
  push:
    branches: [ main ]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm i -D ajv ajv-formats jsonlint
      - name: Lint JSON/JSON-LD
        run: npx jsonlint -q "**/*.json" "**/*.jsonld" || true
      - name: Validate Page Markup (schema contract)
        run: |
          npx ajv validate \
            -s faqpage/v1/page.schema.json \
            -d examples/faqpage/minimal.page.jsonld
      - name: Validate Extracted Output (RAG contract)
        run: |
          npx ajv validate \
            -s faqpage/v1/output.schema.json \
            -d examples/faqpage/sample.output.json
```

> Tip: add `examples/faqpage/minimal.page.jsonld` and `examples/faqpage/sample.output.json` to the repo so the CI is turnkey.

## 🌐 Discovery Snippet (copy-paste ready)

### `/.well-known/llmprofiles.json`

```json
{
  "profiles": [
    {
      "name": "FAQPage",
      "version": "v1",
      "iri": "https://llmprofiles.org/faqpage/v1",
      "pageSchema": "https://llmprofiles.org/faqpage/v1/page.schema.json",
      "outputSchema": "https://llmprofiles.org/faqpage/v1/output.schema.json",
      "training": "https://example.com/ai/training/faq.v1.jsonl",
      "examples": "https://example.com/ai/examples/faq"
    }
  ]
}
```

**Self-test:**
```bash
curl -fsSL https://example.com/.well-known/llmprofiles.json | jq .
```

## 🚫 AEO Anti-Patterns

| Anti-pattern                    | Why it hurts answers           | Fix                                                 |
| ------------------------------- | ------------------------------ | --------------------------------------------------- |
| No stable `@id` for Q/A         | LLMs can't anchor or dedupe    | Mint persistent `@id` per Q and A                   |
| Client-only JSON-LD             | Many bots never see it         | Server-render the markup                            |
| Fluffy answers                  | Model drifts to marketing copy | Keep `acceptedAnswer.text` concise, factual         |
| Missing `inLanguage`            | Wrong language retrieval       | Set `inLanguage` (BCP-47)                           |
| No disambiguation               | Entity collisions              | Add `sameAs` links                                  |
| Training lines don't match page | Drift between SEO & AI         | Generate `training.jsonl` **from** extracted output |

## 🎯 Use Cases

### **For SEO Teams**
- **Prevent deployment errors** with CI/CD validation
- **Standardize implementations** across teams
- **Improve rich results** with opinionated guidance
- **Track structured data** quality over time

### **For AI/ML Teams**
- **Export training data** that matches your markup
- **Normalize content** for RAG pipelines
- **Bridge SEO and AI** with dual schemas
- **Optimize for answer engines** (AEO)

### **For Developers**
- **Machine-enforceable contracts** instead of docs
- **Versioned, immutable profiles** for stability
- **Discovery API** for programmatic access
- **Community governance** with PR checks

### **For Publishers**
- **Own your training data** with publisher exports
- **Partner discovery** via well-known endpoint
- **Future-proof** with versioned IRIs
- **Operational structured data** not just guidance

## 🧭 Role-Based Adoption

* **SEO:** paste the JSON-LD, keep IDs stable, review Anti-Patterns.
* **DevOps:** add the CI workflow and fail builds on schema violations.
* **Data/ML:** consume `output.schema.json` → generate `training.jsonl`.
* **Partners:** read `/.well-known/llmprofiles.json` for discovery.

## 🔌 Discovery API

The Profile Discovery API provides programmatic access to discover and explore profiles:

```javascript
// Get all available profiles
const profiles = await fetch('https://llmprofiles.org/api/discovery.json');
const data = await profiles.json();
console.log('Available profiles:', data.profiles.map(p => p.name));

// Get specific profile
const faqProfile = await fetch('https://llmprofiles.org/api/profile-faqpage.json');
const profile = await faqProfile.json();
console.log('FAQPage capabilities:', profile.capabilities);

// Get capabilities summary
const capabilities = await fetch('https://llmprofiles.org/api/capabilities.json');
const summary = await capabilities.json();
console.log('Total profiles:', summary.summary.totalProfiles);
```

**Available endpoints:**
- `GET /api/discovery.json` - All profiles with metadata
- `GET /api/capabilities.json` - Profile capabilities summary
- `GET /api/profile-{name}.json` - Individual profile details
- `GET /api/docs.json` - API documentation

See [API Documentation](docs/api-discovery.md) for complete details and integration examples.

## 📖 API Reference

### Registry Endpoint

**GET** `https://llmprofiles.org/index.json`

Returns the complete profile registry with all available profiles and their versions.

### Profile Endpoint

**GET** `https://llmprofiles.org/{profile}/{version}`

Returns the JSON-LD profile definition with:
- Context definitions
- SKOS metadata
- SHACL constraints
- Usage guidelines

### Schema Endpoints

**GET** `https://llmprofiles.org/{profile}/{version}/output.schema.json`

Returns the JSON Schema for validating extracted content.

**GET** `https://llmprofiles.org/{profile}/{version}/page.schema.json` *(Enhanced profiles)*

Returns the JSON Schema for validating on-page JSON-LD markup.

**GET** `https://llmprofiles.org/{profile}/{version}/training.jsonl` *(Enhanced profiles)*

Returns training data in JSONL format for LLM fine-tuning.

**GET** `https://llmprofiles.org/{profile}/{version}/examples/{type}.jsonld` *(Enhanced profiles)*

Returns implementation examples (minimal, rich, etc.).

## 🔧 Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/HaMi-IQ/llmprofiles.git
cd llmprofiles

# Install dependencies (for validation)
npm install -D ajv ajv-formats jsonlint
```

### Validation

```bash
# Validate all JSON files
npx jsonlint -q **/*.json **/*.jsonld

# Validate specific schema
node -e "
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const fs = require('fs');

const ajv = new Ajv({strict: false, allErrors: true});
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync('faqpage/v1/output.schema.json', 'utf8'));
ajv.compile(schema);
console.log('Schema validation passed');
"
```

### Adding New Profiles

1. Create profile directory: `mkdir -p {profile-name}/v1`
2. Add `index.jsonld` with profile definition
3. Add `output.schema.json` for validation
4. Update `index.json` registry
5. Update `CHANGELOG.md`
6. Submit pull request

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-profile`
3. Make your changes
4. Run validation: `npm run validate`
5. Submit a pull request

### Profile Guidelines

- Keep profiles ≤5KB in size
- Use concise SKOS definitions
- Include minimal SHACL constraints
- Bump versions on semantic changes
- Follow established naming conventions

## 📄 License

- **Code:** [LICENSE-CODE](LICENSE-CODE)
- **Content:** [LICENSE-CONTENT](LICENSE-CONTENT)

## 🔗 Links

- **Website:** https://llmprofiles.org
- **Documentation:** https://llmprofiles.org/docs
- **Issues:** https://github.com/HaMi-IQ/llmprofiles/issues
- **Discussions:** https://github.com/HaMi-IQ/llmprofiles/discussions

## 🏗️ Architecture

### Profile Structure

```
{profile}/
├── v1/
│   ├── index.jsonld          # Profile definition
│   └── output.schema.json    # Validation schema
└── README.md                 # Profile documentation
```

### Standards Used

- **JSON-LD:** Linked data serialization
- **SKOS:** Knowledge organization systems
- **SHACL:** Shape constraints and validation
- **JSON Schema:** Output validation
- **Schema.org:** Core vocabulary

## 🚀 Roadmap

- [x] Complete all 10 planned profiles
- [x] Create interactive documentation
- [ ] Add profile compatibility testing
- [x] Implement profile discovery API
- [ ] Profile compliance test harness (good vs bad fixtures)
- [ ] Add community examples
- [ ] Profile marketplace features

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/HaMi-IQ/llmprofiles/issues)
- **Security:** [Security Policy](SECURITY.md)
- **Governance:** [Governance](GOVERNANCE.md)

---

**Maintained by HAMI** • **Version:** 1.0.0 • **Last Updated:** 2025-08-28