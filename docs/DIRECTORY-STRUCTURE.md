# Directory Structure Guide

This guide explains the new scalable directory structure for the LLM Profiles repository and how it addresses the challenges of a growing profile registry.

## 🚨 **Current Problem: Flat Structure**

Your current repository has a **flat structure** that will become unmanageable:

```
llmprofiles/
├── article/          # Profile 1
├── book/             # Profile 2
├── course/           # Profile 3
├── dataset/          # Profile 4
├── event/            # Profile 5
├── faqpage/          # Profile 6
├── howto/            # Profile 7
├── jobposting/       # Profile 8
├── localbusiness/    # Profile 9
├── product-offer/    # Profile 10
├── qapage/           # Profile 11
├── recipe/           # Profile 12
├── review/           # Profile 13
├── software/         # Profile 14
├── softwareapplication/ # Profile 15
├── videoobject/      # Profile 16
└── ...               # More profiles coming!
```

**Problems with this approach:**
- ❌ **Root directory bloat**: 50+ directories at root level
- ❌ **No logical grouping**: Hard to find related profiles
- ❌ **Difficult navigation**: Scrolling through long lists
- ❌ **Poor scalability**: Adding profiles makes it worse
- ❌ **Maintenance nightmare**: Hard to manage and organize

## 🏗️ **Solution: Organized, Scalable Structure**

The new structure organizes profiles by **category** and **purpose**:

```
llmprofiles/
├── 📁 profiles/                    # All profile definitions
│   ├── 📁 content/                 # Content-focused profiles
│   │   ├── 📁 article/            # Articles, blogs, posts
│   │   ├── 📁 book/               # Books, publications
│   │   ├── 📁 course/             # Educational content
│   │   ├── 📁 dataset/            # Data collections
│   │   ├── 📁 howto/              # How-to guides
│   │   ├── 📁 recipe/             # Recipes, instructions
│   │   └── 📁 videoobject/        # Video content
│   ├── 📁 business/                # Business-focused profiles
│   │   ├── 📁 localbusiness/      # Local businesses
│   │   ├── 📁 jobposting/         # Job listings
│   │   ├── 📁 product-offer/      # Product offers
│   │   └── 📁 review/             # Reviews, ratings
│   ├── 📁 interaction/             # User interaction profiles
│   │   ├── 📁 faqpage/            # FAQ pages
│   │   ├── 📁 qapage/             # Q&A pages
│   │   └── 📁 event/              # Events, activities
│   └── 📁 technology/              # Technology profiles
│       ├── 📁 softwareapplication/ # Software applications
│       └── 📁 software/            # Software products
├── 📁 schemas/                     # Centralized schema management
│   ├── 📁 core/                    # Core schemas
│   ├── 📁 extensions/              # Profile extensions
│   └── 📁 validators/              # Validation utilities
├── 📁 examples/                     # Centralized examples
│   ├── 📁 minimal/                 # Minimal implementations
│   ├── 📁 rich/                    # Rich implementations
│   └── 📁 edge-cases/              # Edge case examples
├── 📁 training/                     # Training data
│   ├── 📁 datasets/                # Individual datasets
│   └── 📁 combined/                # Combined training data
├── 📁 docs/                        # Documentation
├── 📁 api/                         # API endpoints
├── 📁 dist/                        # Build output
└── 📁 scripts/                     # Build and management scripts
```

## 🎯 **Benefits of the New Structure**

### **1. Scalability**
- ✅ **Easy to add new profiles**: Just place them in the right category
- ✅ **Logical growth**: Structure grows with your content
- ✅ **No root bloat**: Root directory stays clean and organized

### **2. Navigation**
- ✅ **Intuitive grouping**: Related profiles are together
- ✅ **Quick discovery**: Easy to find what you're looking for
- ✅ **Clear hierarchy**: Logical organization from the start

### **3. Maintenance**
- ✅ **Easier updates**: Related profiles can be updated together
- ✅ **Better testing**: Category-based validation and testing
- ✅ **Simpler CI/CD**: Path-based triggers for specific categories

### **4. Collaboration**
- ✅ **Team ownership**: Different teams can own different categories
- ✅ **Parallel development**: Multiple categories can be worked on simultaneously
- ✅ **Clear responsibilities**: Each category has clear boundaries

## 🔄 **Migration Process**

### **Step 1: Preview the Changes**
```bash
# See what the restructuring would do (no actual changes)
npm run structure:migrate -- --dry-run
```

### **Step 2: Create Backup**
```bash
# The script automatically creates a backup
npm run structure:migrate
```

### **Step 3: Validate the New Structure**
```bash
# Check that everything is properly organized
npm run structure:validate
```

### **Step 4: Update References**
```bash
# Update any hardcoded paths in your code
# The script updates index.json automatically
```

## 📊 **Profile Categories Explained**

### **Content Profiles** (`profiles/content/`)
Profiles for **content creation and consumption**:
- **article**: Blog posts, articles, written content
- **book**: Books, publications, long-form content
- **course**: Educational courses, training materials
- **dataset**: Data collections, research data
- **howto**: How-to guides, tutorials, instructions
- **recipe**: Recipes, step-by-step guides
- **videoobject**: Video content, multimedia

### **Business Profiles** (`profiles/business/`)
Profiles for **business operations and commerce**:
- **localbusiness**: Local businesses, services
- **jobposting**: Job listings, employment
- **product-offer**: Product offers, sales
- **review**: Reviews, ratings, feedback

### **Interaction Profiles** (`profiles/interaction/`)
Profiles for **user interaction and engagement**:
- **faqpage**: FAQ pages, help content
- **qapage**: Q&A pages, discussions
- **event**: Events, activities, gatherings

### **Technology Profiles** (`profiles/technology/`)
Profiles for **technology and software**:
- **softwareapplication**: Software applications, apps
- **software**: Software products, tools

## 🛠️ **Adding New Profiles**

### **1. Choose the Right Category**
```bash
# Content profiles
profiles/content/new-profile/

# Business profiles  
profiles/business/new-profile/

# Interaction profiles
profiles/interaction/new-profile/

# Technology profiles
profiles/technology/new-profile/
```

### **2. Follow the Standard Structure**
```
profiles/content/new-profile/
├── index.jsonld           # Profile definition
├── page.schema.json       # Page validation schema
├── output.schema.json     # Output validation schema
├── examples/              # Implementation examples
│   ├── minimal.jsonld     # Minimal example
│   └── rich.jsonld        # Rich example
└── training.jsonl         # Training data
```

### **3. Update Category Lists**
Add your new profile to the appropriate category in:

- `scripts/validate-structure.js`
- `docs/DIRECTORY-STRUCTURE.md`

## 🔍 **Structure Validation**

### **Automatic Validation**
The CI/CD system automatically validates:
- ✅ Profile structure compliance
- ✅ Required files presence
- ✅ JSON-LD validity
- ✅ Schema consistency

### **Manual Validation**
```bash
# Validate current structure
npm run structure:validate

# Generate detailed report
npm run structure:report

# Check specific aspects
npm run validate:json
npm run validate:schemas
```

## 📈 **Future Growth Scenarios**

### **Scenario 1: Adding 10 New Content Profiles**
```
profiles/content/
├── article/          # ✅ Existing
├── book/             # ✅ Existing
├── course/           # ✅ Existing
├── dataset/          # ✅ Existing
├── howto/            # ✅ Existing
├── recipe/           # ✅ Existing
├── videoobject/      # ✅ Existing
├── podcast/          # 🆕 New
├── webinar/          # 🆕 New
├── whitepaper/       # 🆕 New
├── case-study/       # 🆕 New
├── tutorial/         # 🆕 New
├── guide/            # 🆕 New
├── manual/           # 🆕 New
├── documentation/    # 🆕 New
├── blog/             # 🆕 New
└── newsletter/       # 🆕 New
```

**Result**: Still organized, easy to navigate, logical grouping maintained.

### **Scenario 2: Adding New Categories**
```
profiles/
├── content/          # ✅ Existing
├── business/         # ✅ Existing
├── interaction/      # ✅ Existing
├── technology/       # ✅ Existing
├── healthcare/       # 🆕 New category
│   ├── patient/
│   ├── doctor/
│   ├── hospital/
│   └── treatment/
├── education/        # 🆕 New category
│   ├── student/
│   ├── teacher/
│   ├── school/
│   └── curriculum/
└── finance/          # 🆕 New category
    ├── account/
    ├── transaction/
    ├── investment/
    └── loan/
```

**Result**: Structure scales naturally, new domains are clearly separated.

## 🚀 **CI/CD Integration**

### **Path-Based Triggers**
The new structure enables efficient CI/CD:

```yaml
# Only run when content profiles change
on:
  push:
    paths:
      - 'profiles/content/**'
      - 'schemas/extensions/**'

# Only run when business profiles change  
on:
  push:
    paths:
      - 'profiles/business/**'
      - 'schemas/extensions/**'
```

### **Category-Specific Workflows**
```yaml
# Content profile validation
- name: Validate Content Profiles
  run: |
    npm run validate --profiles=content

# Business profile validation
- name: Validate Business Profiles  
  run: |
    npm run validate --profiles=business
```

## 📚 **Documentation Updates**

### **Automatic README Generation**
Each category gets its own README:
- `profiles/README.md` - Main profiles guide
- `profiles/content/README.md` - Content profiles guide
- `profiles/business/README.md` - Business profiles guide
- `schemas/README.md` - Schema management guide
- `examples/README.md` - Examples guide
- `training/README.md` - Training data guide

### **API Documentation**
The new structure improves API organization:
- `/api/profiles/content/` - Content profile endpoints
- `/api/profiles/business/` - Business profile endpoints
- `/api/schemas/` - Schema endpoints
- `/api/examples/` - Example endpoints

## 🔧 **Maintenance Commands**

### **Structure Management**
```bash
# Validate structure
npm run structure:validate

# Generate structure report
npm run structure:report

# Migrate to new structure
npm run structure:migrate

# Check for structure issues
npm run validate:structure
```

### **Profile Management**
```bash
# Build all profiles
npm run build:profiles

# Validate specific categories
npm run validate --profiles=content
npm run validate --profiles=business

# Update documentation
npm run create-readmes
```

## 🎯 **Best Practices**

### **1. Category Naming**
- Use **singular, descriptive names**
- Keep names **short and clear**
- Follow **consistent naming conventions**

### **2. Profile Organization**
- Place profiles in the **most logical category**
- Consider **cross-category relationships**
- Use **subcategories** for complex domains

### **3. File Naming**
- Use **kebab-case** for directories
- Use **descriptive names** for examples
- Follow **consistent file extensions**

### **4. Documentation**
- Keep READMEs **up to date**
- Include **usage examples**
- Document **category relationships**

## 🚨 **Common Pitfalls**

### **1. Over-Categorization**
❌ **Don't create too many categories**
```
profiles/
├── content/
│   ├── written/
│   │   ├── articles/
│   │   └── books/
│   └── multimedia/
│       ├── videos/
│       └── images/
```

✅ **Do use logical, broad categories**
```
profiles/
├── content/          # All content types
├── business/         # All business types
└── technology/       # All technology types
```

### **2. Inconsistent Structure**
❌ **Don't mix structures within categories**
```
profiles/content/
├── article/          # Has examples/ subdirectory
├── book/             # Missing examples/
└── course/           # Has samples/ subdirectory
```

✅ **Do maintain consistent structure**
```
profiles/content/
├── article/
│   ├── examples/
│   └── training.jsonl
├── book/
│   ├── examples/
│   └── training.jsonl
└── course/
    ├── examples/
    └── training.jsonl
```

### **3. Ignoring Validation**
❌ **Don't skip structure validation**
```bash
# Skipping validation can lead to issues
npm run structure:migrate --no-validation
```

✅ **Do always validate after changes**
```bash
# Always validate structure
npm run structure:validate
npm run structure:report
```

## 🔮 **Future Enhancements**

### **1. Dynamic Category Management**
```javascript
// Auto-discover new categories
const categories = discoverCategories(profilesDir);

// Auto-generate category READMEs
generateCategoryREADMEs(categories);
```

### **2. Smart Profile Suggestions**
```javascript
// Suggest best category for new profiles
const suggestedCategory = suggestCategory(profileMetadata);

// Validate profile placement
const validation = validateProfilePlacement(profile, category);
```

### **3. Advanced Navigation**
```javascript
// Generate category navigation
const navigation = generateCategoryNavigation(profiles);

// Create category indexes
const indexes = createCategoryIndexes(profiles);
```

## 📞 **Getting Help**

### **When You Need Help**
1. **Check the validation report**: `npm run structure:report`
2. **Review the structure guide**: This document
3. **Run structure validation**: `npm run structure:validate`
4. **Check CI/CD logs**: Look for structure-related errors

### **Common Issues**
- **Profile in wrong category**: Move to correct category
- **Missing required files**: Check profile structure
- **Validation errors**: Review JSON-LD syntax
- **Path issues**: Update hardcoded references

---

*This guide is automatically generated and updated with the CI/CD system.*
