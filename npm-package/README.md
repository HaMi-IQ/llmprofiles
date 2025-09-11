# @llmprofiles/core

[![npm version](https://img.shields.io/npm/v/@llmprofiles/core.svg)](https://www.npmjs.com/package/@llmprofiles/core)
[![Downloads](https://img.shields.io/npm/dm/@llmprofiles/core.svg)](https://www.npmjs.com/package/@llmprofiles/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Schema.org](https://img.shields.io/badge/Schema.org-Compatible-green.svg)](https://schema.org/)

<!-- Optional (works when package is published on bundlephobia) -->

<!-- [![minzip](https://img.shields.io/bundlephobia/minzip/@llmprofiles/core?label=bundle%20size)](https://bundlephobia.com/package/@llmprofiles/core) -->

> **Schema.org structured data that “just works” — secured, validated, and ready for SEO, AI, and LLM pipelines.**

* ✅ **Rich-Results friendly** (Google/Bing aware)
* 🔒 **Built-in XSS/URL sanitization**
* 🤖 **3 output modes** (Strict SEO, Split Channels, Standards Header)
* 🧩 **Typed builders** for 15+ common profiles
* 🧪 **Validation utilities** & examples
* ⚡ **Smart validation** with required field checking
* 🎯 **Field suggestions** with importance indicators
* 💡 **IDE autocomplete** support with metadata

---

## 🔗 Quick Links

* [Install](#-install) • [60-sec Demo](#-60-sec-demo) • [Smart Validation](#-smart-validation--autocomplete) • [Why @llmprofilescore](#-why-llmprofilescore) • [Output Modes](#-three-output-modes) • [Examples](#-usage-examples) • [Profiles](#-available-profile-types) • [Security](#-security-features) • [Nextjs/HTML](#-html--nextjs-integration) • [API & Validation](#-advanced-usage) • [FAQ](#-faq) • [Contributing](#-contributing)

---

## 📦 Install

```bash
# npm
npm install @llmprofiles/core

# yarn
yarn add @llmprofiles/core

# pnpm
pnpm add @llmprofiles/core
```

---

## ⏱ 60-sec Demo

```ts
import { ProductBuilder, MODES } from '@llmprofiles/core';

const product = new ProductBuilder(MODES.STRICT_SEO)
  .name('Wireless Bluetooth Headphones')
  .description('High-quality wireless headphones with noise cancellation')
  .image('https://example.com/headphones.jpg')
  .brand('AudioTech')
  .sku('AT-WH-001')
  .offers(199.99, 'USD', 'InStock')
  .aggregateRating(4.5, 127)
  .build();

console.log(JSON.stringify(product, null, 2));
```

---

## ⚡ Smart Validation & Autocomplete

**Required Field Validation**

The `build()` method now validates required fields and throws errors when critical fields are missing:

```ts
import { JobPostingBuilder } from '@llmprofiles/core';

try {
  const jobPosting = new JobPostingBuilder()
    .title("Software Engineer")
    // Missing required fields: hiringOrganization, jobLocation
    .build(); // This will throw an error
} catch (error) {
  console.log('Error:', error.message);
  // "Missing required fields: hiringOrganization, jobLocation"
}
```

**Field Suggestions with Importance Indicators**

Get intelligent suggestions for completing your schema:

```ts
const jobPosting = new JobPostingBuilder()
  .title("Software Engineer")
  .description("Join our team");

// Check validation status
console.log('Is valid?', jobPosting.isValid()); // false
console.log('Missing fields:', jobPosting.getMissingRequiredFields());
// ['hiringOrganization', 'jobLocation']

// Get field suggestions organized by priority
const suggestions = jobPosting.getSuggestions();
console.log('Critical fields:', suggestions.critical.map(f => f.name));
console.log('Important fields:', suggestions.important.map(f => f.name));

// Get enhanced suggestions with metadata
const enhanced = jobPosting.getEnhancedSuggestions();
console.log('Summary:', enhanced.summary);
// { totalFields: 15, requiredFields: 2, recommendedFields: 13, ... }
```

**IDE Autocomplete Support**

Get completion hints for better development experience:

```ts
// Get all available fields with metadata
const hints = jobPosting.getCompletionHints();
hints.forEach(hint => {
  console.log(`${hint.label} (${hint.importance}) - ${hint.documentation}`);
  // "title (required) - The title field"
  // "hiringOrganization (required) - The hiringOrganization field"
});

// Get next steps guidance
const nextSteps = jobPosting.getNextSteps();
nextSteps.forEach(step => {
  console.log(`Priority ${step.priority}: ${step.message}`);
  console.log(`  Fields: ${step.fields.join(', ')}`);
});
```

**Multiple Build Options**

```ts
// Build with validation (default)
const result1 = builder.build();

// Build with warnings instead of errors
const result2 = builder.buildWithWarnings();

// Build without validation (unsafe)
const result3 = builder.buildUnsafe();
```

📖 **[Full Validation Guide →](./VALIDATION_AND_AUTOCOMPLETE_GUIDE.md)**

---

## ✨ Why @llmprofiles/core?

**SEO-First**

* Emits Schema.org that is friendly to Google/Bing rich result guidelines.
* Sensible defaults — *zero config* to get valid JSON-LD for common use cases.

**Security Built-In**

* XSS-safe: sanitizes HTML, validates URLs, strips unsafe protocols.
* Configurable sanitization levels when you fully trust inputs.

**AI & LLM Ready**

* **Three output modes** for production SEO, LLM ingestion, or full semantic web compliance.
* Optional profile metadata and training export helpers.

**Dev-Friendly**

* Full **TypeScript** types, ESM & CJS builds, tree-shakeable.
* Clean, chainable builders for 15+ profiles.

---

## 🔧 Three Output Modes

| Mode                        | Best For                       | Output Shape                          | Notes                                                                                                        |
| --------------------------- | ------------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **STRICT\_SEO** *(default)* | Production SEO (Google/Bing)   | Single JSON-LD block                  | Adds `additionalType`, `schemaVersion`, and profile metadata in a way that plays nicely with search engines. |
| **SPLIT\_CHANNELS**         | SEO + AI pipelines             | `{ seo, llm }` object                 | Keep your SEO block pristine while shipping a parallel LLM-rich block.                                       |
| **STANDARDS\_HEADER**       | Semantic-web purists, gateways | JSON-LD + HTTP `Link`/`rel="profile"` | Access `getRelProfile()` / `getLinkHeader()` for headers integration.                                        |

**Example (Split Channels):**

```ts
import { ProductBuilder, MODES } from '@llmprofiles/core';

const out = new ProductBuilder(MODES.SPLIT_CHANNELS)
  .name('Product Name')
  .build();

// out.seo -> clean SEO JSON-LD
// out.llm -> LLM-enriched metadata block
```

---

## 🧪 Usage Examples

**Product**

```ts
import { ProductBuilder } from '@llmprofiles/core';

const product = new ProductBuilder()
  .name('Wireless Headphones')
  .description('Noise-cancelling, 30h battery')
  .brand('AudioTech')
  .offers(199.99, 'USD', 'InStock')
  .build();
```

**Article**

```ts
import { ArticleBuilder } from '@llmprofiles/core';

const article = new ArticleBuilder()
  .headline('Structured Data That Actually Helps')
  .author('Jane Developer')
  .datePublished('2024-01-15T10:00:00Z')
  .articleBody('…')
  .keywords(['SEO','Schema.org','AEO'])
  .build();
```

**JobPosting**

```ts
import { JobPostingBuilder } from '@llmprofiles/core';

const job = new JobPostingBuilder()
  .title('Senior JavaScript Developer')
  .hiringOrganization('Tech Corp')
  .jobLocation('San Francisco, CA')
  .datePosted('2024-01-15')
  .employmentType('FULL_TIME')
  .baseSalary(120000, 'USD', 'YEAR')
  .build();
```

**LocalBusiness**

```ts
import { LocalBusinessBuilder } from '@llmprofiles/core';

const biz = new LocalBusinessBuilder()
  .name("Joe's Pizza")
  .address('123 Main St, City, ST 12345')
  .telephone('+1-555-123-4567')
  .openingHours('Mo-Fr 11:00-22:00')
  .priceRange('$$')
  .build();
```

---

## 📋 Available Profile Types

<details>
<summary>Click to view profiles</summary>

| Profile                 | Typical Use  | Rich Results? |
| ----------------------- | ------------ | ------------- |
| **Article**             | Blog/news    | ✅             |
| **Product**             | E-commerce   | ✅             |
| **JobPosting**          | Jobs         | ✅             |
| **LocalBusiness**       | Local SEO    | ✅             |
| **Event**               | Events       | ✅             |
| **Recipe**              | Cooking      | ✅             |
| **Book**                | Publications | ✅             |
| **Course**              | Education    | ✅             |
| **Review**              | Reviews      | ✅             |
| **FAQPage**             | FAQs         | ✅             |
| **HowTo**               | Tutorials    | ✅             |
| **VideoObject**         | Video        | ✅             |
| **Dataset**             | Data pubs    | ✅             |
| **SoftwareApplication** | Apps         | ✅             |
| **QAPage**              | Q\&A         | ✅             |

</details>

---

## 🔒 Security Features

**Automatic input sanitization**

```ts
import { ArticleBuilder } from '@llmprofiles/core';

const article = new ArticleBuilder()
  .headline('<script>alert("xss")</script>Breaking News!') // sanitized
  .author('John <b>Doe</b>') // tags stripped
  .url('javascript:alert("xss")') // blocked
  .build();

// Safe outputs:
console.log(article.headline); // 'alert("xss")Breaking News!'
console.log(article.author);   // 'John Doe'
console.log(article.url);      // null
```

**Trusted content (opt-out)**

```ts
import { MODES, ArticleBuilder } from '@llmprofiles/core';

// Disable sanitization (only if you 100% trust your inputs)
const trusted = new ArticleBuilder(MODES.STRICT_SEO, false)
  .headline('<em>Trusted HTML</em>')
  .build();
```

---

## 🌐 HTML & Next.js Integration

**Basic HTML**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name"
}
</script>
```

**Split Channels (two blocks)**

```html
<!-- SEO block -->
<script type="application/ld+json">
{ /* SEO-optimized JSON-LD */ }
</script>

<!-- LLM block -->
<script type="application/ld+json">
{ /* AI-optimized JSON-LD */ }
</script>
```

**Standards Header**

```html
<head>
  <link rel="profile" href="https://llmprofiles.org/profiles" />
  <script type="application/ld+json">{ /* JSON-LD */ }</script>
</head>
```

**Next.js**

```tsx
import Head from 'next/head';
import { ProductBuilder } from '@llmprofiles/core';

export default function Page() {
  const product = new ProductBuilder().name('Widget 3000').build();
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
        />
      </Head>
      <main>…</main>
    </>
  );
}
```

---

## 🛠 Advanced Usage

**ESM & CJS**

```ts
// ESM
import { ProductBuilder, MODES } from '@llmprofiles/core';

// CJS
const { ProductBuilder, MODES } = require('@llmprofiles/core');
```

**Individual Profile Imports**

```ts
import { productofferProfile } from '@llmprofiles/core/profiles/productoffer';
import { articleProfile } from '@llmprofiles/core/profiles/article';

console.log(productofferProfile.type);
console.log(Object.keys(articleProfile.required));
```

**Custom Validation**

```ts
import { validateStructuredData } from '@llmprofiles/core';

const result = validateStructuredData(
  { name: 'Product Name', description: 'Description' },
  'Product'
);

if (!result.isValid) console.error(result.errors);
```

---

## ⚙️ Performance & Compatibility

* Small, tree-shakeable core
* TypeScript types included
* Node.js **16+**
* ESM and CommonJS builds
* No runtime telemetry

---

## ❓ FAQ

**Will this guarantee Google Rich Results?**
No library can *guarantee* rich results. This package emits Schema.org-compatible JSON-LD aligned with common guidelines; eligibility is determined by search engines and your page/content quality.

**Do I need to configure anything to start?**
No. Chain a few fields on a builder, call `.build()`, and you’ll get a valid JSON-LD object.

**What’s the difference between `STRICT_SEO` and `SPLIT_CHANNELS`?**
`STRICT_SEO` outputs a single, clean block for search engines. `SPLIT_CHANNELS` returns `{ seo, llm }` so you can keep SEO pristine while shipping an LLM-rich variant separately.

**Is sanitization always on?**
Yes (by default). You can disable it per-builder only when you fully trust the input source.

---

## 🤝 Contributing

We welcome PRs and issues!

* Read the [Contributing Guide](../CONTRIBUTING.md)
* Open an [Issue](https://github.com/HaMi-IQ/llmprofiles/issues)
* Star the repo if this helps you ⭐

**Development**

```bash
git clone https://github.com/HaMi-IQ/llmprofiles.git
cd llmprofiles/npm-package
npm install
npm test
```

---

## 📚 Resources

* **Docs:** [https://llmprofiles.org](https://llmprofiles.org)
* **Examples:** ./examples/
* **API Types:** ./types/
* **GitHub:** [https://github.com/HaMi-IQ/llmprofiles](https://github.com/HaMi-IQ/llmprofiles)
* **Issues:** [https://github.com/HaMi-IQ/llmprofiles/issues](https://github.com/HaMi-IQ/llmprofiles/issues)

---

## 📄 License

MIT — see [LICENSE-CODE](../LICENSE-CODE).

---

### 🏆 What Devs Say

> “No more guessing what Google wants. The builders produce valid JSON-LD out of the box.”
> — *Sarah M., SEO Developer*

> “Automatic sanitization saved us from nasty XSS edge cases.”
> — *Mike R., Full-Stack Engineer*

> “The split channels pattern fits our SEO + LLM pipeline perfectly.”
> — *Alex K., AI Engineer*

---

**Ready to ship safer, richer structured data?**
`npm i @llmprofiles/core` and go.
