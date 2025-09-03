// LLM Profiles Interactive Validator JavaScript
// Global state
let currentProfile = null;
let currentSchema = null;
let jsonEditor = null;
let ajv = null;

// Available profiles configuration
const profiles = [
    {
        id: 'faqpage',
        name: 'FAQPage',
        category: 'interaction',
        description: 'FAQ pages with Q&A pairs',
        icon: 'fas fa-question-circle',
        color: 'blue'
    },
    {
        id: 'article',
        name: 'Article',
        category: 'content',
        description: 'Blog posts and articles',
        icon: 'fas fa-newspaper',
        color: 'green'
    },
    {
        id: 'course',
        name: 'Course',
        category: 'content',
        description: 'Educational courses',
        icon: 'fas fa-graduation-cap',
        color: 'purple'
    },
    {
        id: 'event',
        name: 'Event',
        category: 'interaction',
        description: 'Event information',
        icon: 'fas fa-calendar',
        color: 'red'
    },
    {
        id: 'product-offer',
        name: 'ProductOffer',
        category: 'business',
        description: 'Product listings',
        icon: 'fas fa-shopping-cart',
        color: 'yellow'
    },
    {
        id: 'jobposting',
        name: 'JobPosting',
        category: 'business',
        description: 'Job advertisements',
        icon: 'fas fa-briefcase',
        color: 'indigo'
    },
    {
        id: 'localbusiness',
        name: 'LocalBusiness',
        category: 'business',
        description: 'Business listings',
        icon: 'fas fa-store',
        color: 'pink'
    },
    {
        id: 'review',
        name: 'Review',
        category: 'business',
        description: 'Product reviews',
        icon: 'fas fa-star',
        color: 'orange'
    },
    {
        id: 'recipe',
        name: 'Recipe',
        category: 'content',
        description: 'Cooking recipes',
        icon: 'fas fa-utensils',
        color: 'teal'
    },
    {
        id: 'softwareapplication',
        name: 'SoftwareApplication',
        category: 'technology',
        description: 'Software products',
        icon: 'fas fa-laptop-code',
        color: 'cyan'
    },
    {
        id: 'book',
        name: 'Book',
        category: 'content',
        description: 'Published books and literary works',
        icon: 'fas fa-book',
        color: 'brown'
    },
    {
        id: 'dataset',
        name: 'Dataset',
        category: 'content',
        description: 'Data collections and datasets',
        icon: 'fas fa-database',
        color: 'gray'
    },
    {
        id: 'howto',
        name: 'HowTo',
        category: 'content',
        description: 'Step-by-step instructional content',
        icon: 'fas fa-list-ol',
        color: 'blue'
    },
    {
        id: 'videoobject',
        name: 'VideoObject',
        category: 'content',
        description: 'Video content with metadata',
        icon: 'fas fa-video',
        color: 'red'
    },
    {
        id: 'qapage',
        name: 'QAPage',
        category: 'interaction',
        description: 'Single question-answer pages',
        icon: 'fas fa-question',
        color: 'purple'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        // Try localhost fallback if AJV isn't available
        if (!window.ajv && typeof loadAJVForLocalhost === 'function') {
            loadAJVForLocalhost();
        }
        
        initializeAJV();
        initializeJSONEditor();
        renderProfiles();
        setupEventListeners();
    }, 200);
});

function initializeAJV() {
    try {
        // Try different ways AJV might be exposed
        const AjvClass = window.ajv?.default || window.ajv || window.Ajv || null;
        
        if (!AjvClass) {
            console.warn('AJV library not loaded, validation will be limited');
            ajv = null;
            return;
        }
        
        ajv = new AjvClass({
            strict: false,
            allErrors: true,
            verbose: true
        });
        
        // Try to add formats if available
        if (window.addFormats) {
            window.addFormats(ajv);
        } else if (window.ajvFormats) {
            window.ajvFormats(ajv);
        }
        
        console.log('AJV initialized successfully');
    } catch (error) {
        console.error('Failed to initialize AJV:', error);
        ajv = null;
    }
}

function initializeJSONEditor() {
    const container = document.getElementById('jsonInput');
    
    try {
        if (!window.JSONEditor) {
            console.warn('JSONEditor library not loaded, using fallback textarea');
            createFallbackEditor(container);
            return;
        }
        
        const options = {
            mode: 'code',
            onChange: () => {
                // Auto-validate on change if profile is selected
                if (currentProfile && currentSchema) {
                    setTimeout(validateInput, 500); // Debounce
                }
            }
        };
        jsonEditor = new JSONEditor(container, options);
        console.log('JSONEditor initialized successfully');
    } catch (error) {
        console.error('Failed to initialize JSONEditor:', error);
        createFallbackEditor(container);
    }
}

function createFallbackEditor(container) {
    container.innerHTML = `
        <textarea id="jsonTextarea" 
                  style="width: 100%; height: 400px; font-family: monospace; padding: 10px; border: 1px solid #ccc; border-radius: 4px;"
                  placeholder="Enter your JSON-LD here..."></textarea>
    `;
    
    const textarea = document.getElementById('jsonTextarea');
    
    // Create a JSONEditor-like interface
    jsonEditor = {
        set: (data) => {
            textarea.value = JSON.stringify(data, null, 2);
        },
        get: () => {
            try {
                return JSON.parse(textarea.value);
            } catch (e) {
                throw new Error('Invalid JSON: ' + e.message);
            }
        }
    };
    
    // Add auto-validation
    textarea.addEventListener('input', () => {
        if (currentProfile && currentSchema) {
            setTimeout(validateInput, 500);
        }
    });
}

function renderProfiles() {
    const container = document.getElementById('profileSelection');
    if (!container) {
        console.error('Profile selection container not found!');
        return;
    }
    console.log('Rendering all', profiles.length, 'profiles dynamically...');
    
    // Color mapping for Tailwind CSS classes
    const colorClasses = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
        green: { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-800' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-800' },
        red: { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-100 text-red-800' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-800' },
        pink: { bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-800' },
        orange: { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-800' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-800' },
        cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-800' },
        brown: { bg: 'bg-yellow-50', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-900' },
        gray: { bg: 'bg-gray-50', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-800' }
    };
    
    const profilesHTML = profiles.map(profile => {
        const colors = colorClasses[profile.color] || colorClasses.blue;
        return `
            <div class="profile-card ${colors.bg} p-4 rounded-lg border-2 border-transparent hover:shadow-lg transition-all duration-300 cursor-pointer" 
                 data-profile="${profile.id}">
                <div class="text-center">
                    <i class="${profile.icon} text-3xl ${colors.text} mb-2"></i>
                    <h3 class="font-semibold text-lg">${profile.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">${profile.description}</p>
                    <span class="inline-block ${colors.badge} text-xs px-2 py-1 rounded-full">
                        ${profile.category}
                    </span>
                </div>
            </div>
        `;
    }).join('');
    
    // Replace loading indicator with all profiles
    container.innerHTML = profilesHTML;
    console.log('✅ All', profiles.length, 'profiles rendered successfully');
}

function setupEventListeners() {
    // Profile selection
    document.getElementById('profileSelection').addEventListener('click', function(e) {
        const profileCard = e.target.closest('.profile-card');
        if (profileCard) {
            selectProfile(profileCard.dataset.profile);
        }
    });

    // Action buttons
    document.getElementById('loadExampleBtn').addEventListener('click', loadExample);
    document.getElementById('clearInputBtn').addEventListener('click', clearInput);
    document.getElementById('validateBtn').addEventListener('click', validateInput);
    document.getElementById('exportTrainingBtn').addEventListener('click', exportTrainingData);
    document.getElementById('exportOutputBtn').addEventListener('click', exportOutputData);
    document.getElementById('copyCICommandBtn').addEventListener('click', copyCICommand);
}

async function selectProfile(profileId) {
    try {
        showLoading(true);
        
        // Update UI
        document.querySelectorAll('.profile-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-profile="${profileId}"]`).classList.add('selected');
        
        currentProfile = profiles.find(p => p.id === profileId);
        
        // Load schema
        await loadSchema(profileId);
        
        // Show schema info
        showSchemaInfo();
        
        showLoading(false);
    } catch (error) {
        console.error('Error selecting profile:', error);
        showError('Failed to load profile: ' + error.message);
        showLoading(false);
    }
}

async function loadSchema(profileId) {
    try {
        const profile = profiles.find(p => p.id === profileId);
        
        // Try to load schema from various possible locations
        const possibleUrls = [
            `../profiles/${profile.category}/${profileId}/v1/page.schema.json`,
            `profiles/${profile.category}/${profileId}/v1/page.schema.json`,
            `https://llmprofiles.org/profiles/${profile.category}/${profileId}/v1/page.schema.json`
        ];
        
        let schema = null;
        for (const url of possibleUrls) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    schema = await response.json();
                    console.log('Schema loaded from:', url);
                    break;
                }
            } catch (e) {
                console.warn('Failed to load from:', url);
            }
        }
        
        currentSchema = schema || createFallbackSchema(profileId);
        console.log('Final schema:', currentSchema);
        
    } catch (error) {
        console.warn('Could not load remote schema, using fallback:', error);
        currentSchema = createFallbackSchema(profileId);
    }
}

function createFallbackSchema(profileId) {
    // Create profile-specific schemas
    const schemas = {
        faqpage: {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
                "@type": { "const": "FAQPage" },
                "@id": { "type": "string" },
                "inLanguage": { "type": "string" },
                "mainEntity": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "properties": {
                            "@type": { "const": "Question" },
                            "@id": { "type": "string" },
                            "name": { "type": "string", "minLength": 3 },
                            "acceptedAnswer": {
                                "type": "object",
                                "properties": {
                                    "@type": { "const": "Answer" },
                                    "@id": { "type": "string" },
                                    "text": { "type": "string", "minLength": 1 }
                                },
                                "required": ["@type", "text"]
                            }
                        },
                        "required": ["@type", "name", "acceptedAnswer"]
                    }
                }
            },
            "required": ["@type", "mainEntity"]
        },
        article: {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "type": "object",
            "properties": {
                "@context": { "anyOf": [{ "type": "string" }, { "type": "array" }] },
                "@type": { "const": "Article" },
                "@id": { "type": "string" },
                "headline": { "type": "string", "minLength": 1 },
                "author": {
                    "type": "object",
                    "properties": {
                        "@type": { "const": "Person" },
                        "name": { "type": "string" }
                    }
                },
                "datePublished": { "type": "string" },
                "articleBody": { "type": "string" }
            },
            "required": ["@type", "headline"]
        }
    };
    
    return schemas[profileId] || {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
            "@context": { "type": ["string", "array"] },
            "@type": { "type": "string" },
            "@id": { "type": "string" }
        },
        "required": ["@type"]
    };
}

function showSchemaInfo() {
    const schemaInfo = document.getElementById('schemaInfo');
    const schemaDetails = document.getElementById('schemaDetails');
    
    schemaDetails.innerHTML = `
        <div>
            <h3 class="font-semibold text-lg mb-2">Profile Details</h3>
            <div class="space-y-2 text-sm">
                <div><strong>Name:</strong> ${currentProfile.name}</div>
                <div><strong>Category:</strong> ${currentProfile.category}</div>
                <div><strong>Version:</strong> v1</div>
                <div><strong>Description:</strong> ${currentProfile.description}</div>
            </div>
        </div>
        <div>
            <h3 class="font-semibold text-lg mb-2">Schema Information</h3>
            <div class="space-y-2 text-sm">
                <div><strong>Schema Type:</strong> ${currentSchema.type || 'object'}</div>
                <div><strong>Required Fields:</strong> ${currentSchema.required ? currentSchema.required.length : 0}</div>
                <div><strong>Properties:</strong> ${currentSchema.properties ? Object.keys(currentSchema.properties).length : 0}</div>
            </div>
        </div>
    `;
    
    schemaInfo.classList.remove('hidden');
    schemaInfo.classList.add('fade-in');
}

async function loadExample() {
    if (!currentProfile) {
        showError('Please select a profile first');
        return;
    }
    
    try {
        // Known examples that exist in the repository
        const knownExamples = {
            'faqpage': '../examples/faqpage/minimal.page.jsonld',
            'jobposting': '../profiles/business/jobposting/v1/examples/minimal.jsonld',
            'article': '../profiles/content/article/v1/examples/minimal.jsonld',
            'course': '../profiles/content/course/v1/examples/minimal.jsonld',
            'review': '../profiles/business/review/v1/examples/minimal.jsonld',
            'localbusiness': '../profiles/business/localbusiness/v1/examples/minimal.jsonld',
            'product-offer': '../profiles/business/product-offer/v1/examples/minimal.jsonld'
        };
        
        let example = null;
        
        // Try to load from known examples first
        if (knownExamples[currentProfile.id]) {
            try {
                const response = await fetch(knownExamples[currentProfile.id]);
                if (response.ok) {
                    const text = await response.text();
                    example = JSON.parse(text);
                    console.log('Example loaded from repository:', knownExamples[currentProfile.id]);
                    showSuccess('Repository example loaded!');
                }
            } catch (e) {
                console.warn('Failed to load repository example:', e.message);
            }
        }
        
        // Fallback to built-in example
        if (!example) {
            console.log('Using built-in example for', currentProfile.id);
            example = createBasicExample(currentProfile.id);
            showSuccess('Built-in example loaded!');
        }
        
        jsonEditor.set(example);
        
        // Auto-validate
        setTimeout(validateInput, 500);
        
    } catch (error) {
        console.warn('Could not load example, creating basic one:', error);
        const example = createBasicExample(currentProfile.id);
        jsonEditor.set(example);
        showSuccess('Built-in example loaded!');
    }
}

function createBasicExample(profileId) {
    const examples = {
        faqpage: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": "https://llmprofiles.org/faq/getting-started",
            "inLanguage": "en",
            "mainEntity": [
                {
                    "@type": "Question",
                    "@id": "https://llmprofiles.org/faq/getting-started#what-is-llmprofiles",
                    "identifier": "faq-what-is-llmprofiles",
                    "name": "What is LLM Profiles?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "@id": "https://llmprofiles.org/faq/getting-started#answer-what-is-llmprofiles",
                        "text": "LLM Profiles is a registry of JSON-LD profiles that make your content Answer-Engine-Optimized and consistently readable by AI systems."
                    }
                },
                {
                    "@type": "Question",
                    "@id": "https://llmprofiles.org/faq/getting-started#how-to-use",
                    "identifier": "faq-how-to-use",
                    "name": "How do I use LLM Profiles?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "@id": "https://llmprofiles.org/faq/getting-started#answer-how-to-use",
                        "text": "Choose a profile, validate your JSON-LD markup against the schema, and implement the structured data on your pages."
                    }
                }
            ],
            "sameAs": [
                "https://schema.org/FAQPage",
                "https://llmprofiles.org/profiles/interaction/faqpage/v1/"
            ]
        },
        article: {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": "https://llmprofiles.org/articles/implementing-aeo-structured-data",
            "headline": "How to Implement Answer Engine Optimization with LLM Profiles",
            "author": {
                "@type": "Person",
                "name": "HAMI Team"
            },
            "datePublished": "2025-01-01T10:00:00Z",
            "dateModified": "2025-01-01T10:00:00Z",
            "publisher": {
                "@type": "Organization",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "articleBody": "LLM Profiles provides standardized, validated schemas for common web content types that LLMs can reliably parse and understand. Each profile includes JSON-LD context definitions with SKOS and SHACL constraints, output schemas for structured data extraction, best practices and usage guidelines, and validation rules for quality assurance. This article demonstrates how to implement these profiles on your website to achieve Answer Engine Optimization (AEO) and improve AI content understanding.",
            "keywords": "llmprofiles,structured data,AI,JSON-LD,schema.org,AEO,answer engine optimization",
            "articleSection": "Technology",
            "wordCount": 95,
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/Article",
                "https://llmprofiles.org/profiles/content/article/v1/"
            ]
        },
        course: {
            "@context": "https://schema.org",
            "@type": "Course",
            "@id": "https://llmprofiles.org/courses/mastering-aeo-with-llm-profiles",
            "name": "Mastering Answer Engine Optimization with LLM Profiles",
            "description": "Comprehensive course on implementing LLM Profiles structured data to make your content AI-friendly and discoverable by answer engines. Learn to create JSON-LD markup that follows AEO best practices and passes validation.",
            "provider": {
                "@type": "Organization",
                "name": "HAMI Academy",
                "url": "https://llmprofiles.org"
            },
            "instructor": {
                "@type": "Person",
                "name": "HAMI Team"
            },
            "coursePrerequisites": "Basic HTML and JSON knowledge",
            "educationalLevel": "Intermediate",
            "timeRequired": "PT6H",
            "about": [
                "LLM Profiles methodology",
                "JSON-LD structured data",
                "Answer Engine Optimization (AEO)",
                "Schema validation techniques",
                "AI content understanding"
            ],
            "learningResourceType": "Course",
            "teaches": "How to implement LLM Profiles for better AI content processing and answer engine visibility",
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/Course",
                "https://llmprofiles.org/profiles/content/course/v1/"
            ]
        },
        event: {
            "@context": "https://schema.org",
            "@type": "Event",
            "@id": "https://llmprofiles.org/events/aeo-implementation-workshop-2025",
            "name": "Answer Engine Optimization Workshop: Implementing LLM Profiles",
            "description": "Hands-on workshop teaching web developers and content creators how to implement LLM Profiles structured data for better AI content understanding and answer engine visibility. Learn AEO best practices, validation techniques, and real-world implementation strategies.",
            "startDate": "2025-03-15T09:00:00Z",
            "endDate": "2025-03-15T17:00:00Z",
            "location": {
                "@type": "Place",
                "name": "HAMI Innovation Center",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "123 AI Boulevard",
                    "addressLocality": "San Francisco",
                    "addressRegion": "CA",
                    "addressCountry": "US"
                }
            },
            "organizer": {
                "@type": "Organization",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "audience": {
                "@type": "Audience",
                "audienceType": "Web developers, SEO professionals, content creators"
            },
            "about": [
                "LLM Profiles implementation",
                "Answer Engine Optimization",
                "JSON-LD structured data",
                "AI content understanding"
            ],
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/Event",
                "https://llmprofiles.org/profiles/interaction/event/v1/"
            ]
        },
        "product-offer": {
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": "https://llmprofiles.org/products/aeo-implementation-service",
            "name": "Answer Engine Optimization Implementation Service",
            "description": "Professional service to implement LLM Profiles structured data on your website. Our experts analyze your content, select appropriate profiles, implement AEO-optimized JSON-LD markup, and ensure your site becomes discoverable by AI systems and answer engines like ChatGPT, Claude, and Google Bard.",
            "brand": {
                "@type": "Brand",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "category": "Professional Services",
            "sku": "AEO-SERVICE-2025",
            "image": {
                "@type": "ImageObject",
                "url": "https://llmprofiles.org/images/aeo-service.jpg",
                "width": 1200,
                "height": 630
            },
            "offers": {
                "@type": "Offer",
                "price": "2999.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "priceValidUntil": "2025-12-31",
                "url": "https://llmprofiles.org/services/aeo-implementation",
                "seller": {
                    "@type": "Organization",
                    "name": "HAMI",
                    "url": "https://llmprofiles.org",
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+1-555-AEO-HELP",
                        "contactType": "sales"
                    }
                },
                "warranty": {
                    "@type": "WarrantyPromise",
                    "durationOfWarranty": "P6M",
                    "warrantyScope": "Full implementation support and 6 months of updates"
                }
            },
            "additionalProperty": [
                {
                    "@type": "PropertyValue",
                    "name": "AI Understanding Improvement",
                    "value": "95%",
                    "description": "Average improvement in AI content understanding after implementation"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Answer Engine Visibility Increase",
                    "value": "300%",
                    "description": "Typical increase in content appearing in AI-generated responses"
                },
                {
                    "@type": "PropertyValue",
                    "name": "Implementation Timeline",
                    "value": "2-4 weeks",
                    "description": "Professional implementation completed within 2-4 weeks"
                }
            ],
            "audience": {
                "@type": "Audience",
                "audienceType": "Business owners and marketing teams seeking AI content optimization"
            },
            "serviceType": "AEO Implementation",
            "provider": {
                "@type": "Organization",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "inLanguage": "en",
            "about": [
                {
                    "@type": "Thing",
                    "name": "LLM Profiles Methodology",
                    "url": "https://llmprofiles.org/profiles/business/product-offer/v1/",
                    "description": "This example follows LLM Profiles v1 specification for Product schema"
                },
                {
                    "@type": "Thing", 
                    "name": "Answer Engine Optimization",
                    "url": "https://llmprofiles.org/guides/aeo-implementation",
                    "description": "AEO best practices for AI content understanding"
                }
            ],
            "sameAs": [
                "https://llmprofiles.org/services/aeo-implementation",
                "https://llmprofiles.org/profiles/business/product-offer/v1/"
            ]
        },
        jobposting: {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "@id": "https://llmprofiles.org/jobs/aeo-specialist-2025",
            "title": "Answer Engine Optimization Specialist - LLM Profiles",
            "description": "Join our team as an AEO Specialist to help businesses implement LLM Profiles structured data for better AI content understanding. You'll work with clients to analyze their content, select appropriate profiles, validate implementations, and ensure their websites are optimized for answer engines and AI systems.",
            "hiringOrganization": {
                "@type": "Organization",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "jobLocation": {
                "@type": "Place",
                "name": "San Francisco, CA",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "San Francisco",
                    "addressRegion": "CA",
                    "addressCountry": "US"
                }
            },
            "employmentType": "Full-time",
            "datePosted": "2025-01-01",
            "salaryCurrency": "USD",
            "salaryMinValue": 95000,
            "salaryMaxValue": 140000,
            "salaryUnit": "YEAR",
            "skills": [
                "JSON-LD structured data",
                "Schema.org markup",
                "LLM Profiles methodology",
                "Answer Engine Optimization (AEO)",
                "AI content understanding",
                "Schema validation"
            ],
            "responsibilities": [
                "Implement LLM Profiles on client websites",
                "Validate structured data against schemas",
                "Optimize content for answer engines",
                "Train clients on AEO best practices"
            ],
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/JobPosting",
                "https://llmprofiles.org/profiles/business/jobposting/v1/"
            ]
        },
        localbusiness: {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://llmprofiles.org/business/hami-aeo-consulting",
            "name": "HAMI Answer Engine Optimization Consulting",
            "description": "Expert consulting services for implementing LLM Profiles structured data and Answer Engine Optimization. We help businesses make their content AI-friendly and discoverable by answer engines through proper JSON-LD implementation and validation.",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "456 AI Innovation Boulevard",
                "addressLocality": "San Francisco",
                "addressRegion": "CA",
                "postalCode": "94105",
                "addressCountry": "US"
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": "37.7849",
                "longitude": "-122.4094"
            },
            "telephone": "+1-555-AEO-HELP",
            "email": "contact@llmprofiles.org",
            "url": "https://llmprofiles.org",
            "openingHours": "Mo-Fr 09:00-17:00",
            "priceRange": "$$",
            "servedCuisine": "Digital Marketing Services",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "AEO Implementation Services",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "LLM Profiles Implementation"
                        }
                    }
                ]
            },
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/LocalBusiness",
                "https://llmprofiles.org/profiles/business/localbusiness/v1/"
            ]
        },
        review: {
            "@context": "https://schema.org",
            "@type": "Review",
            "@id": "https://llmprofiles.org/reviews/validator-review-2025",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": 5,
                "bestRating": 5,
                "worstRating": 1
            },
            "author": {
                "@type": "Person",
                "name": "Tech Reviewer"
            },
            "itemReviewed": {
                "@type": "Product",
                "name": "LLM Profiles Validator",
                "url": "https://llmprofiles.org/tools/validator"
            },
            "reviewBody": "Excellent tool for validating structured data. The interface is intuitive and the validation results are comprehensive.",
            "datePublished": "2025-01-01",
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/Review",
                "https://llmprofiles.org/profiles/business/review/v1/"
            ]
        },
        recipe: {
            "@context": "https://schema.org",
            "@type": "Recipe",
            "@id": "https://llmprofiles.org/recipes/structured-data-implementation",
            "name": "Implementing LLM Profiles for Better AI Content Understanding",
            "description": "A step-by-step recipe for implementing LLM Profiles structured data to make your content AI-friendly and Answer Engine Optimized.",
            "author": {
                "@type": "Person",
                "name": "HAMI Team"
            },
            "datePublished": "2025-01-01",
            "prepTime": "PT15M",
            "cookTime": "PT30M",
            "totalTime": "PT45M",
            "recipeYield": "1 AEO-optimized webpage",
            "recipeCategory": "Technical Implementation",
            "recipeCuisine": "Web Development",
            "ingredients": [
                "1 web page with content to structure",
                "1 appropriate LLM Profile schema from llmprofiles.org",
                "JSON-LD structured data markup",
                "Validation tools (like this validator)",
                "AEO optimization fields (@id, inLanguage, sameAs)"
            ],
            "recipeInstructions": [
                "Choose the right LLM Profile for your content type (Article, JobPosting, Recipe, etc.)",
                "Add @context and @type fields according to the profile",
                "Include stable @id for entity identification",
                "Specify inLanguage for better language targeting",
                "Add sameAs links for disambiguation",
                "Structure your content data according to the profile requirements",
                "Add conformsTo property pointing to the LLM Profile",
                "Validate your JSON-LD against the profile schema",
                "Embed the validated JSON-LD in your webpage head section"
            ],
            "inLanguage": "en",
            "about": [
                {
                    "@type": "Thing",
                    "name": "LLM Profiles Recipe Schema",
                    "url": "https://llmprofiles.org/profiles/content/recipe/v1/",
                    "description": "This recipe follows LLM Profiles v1 specification for Recipe implementation"
                },
                {
                    "@type": "Thing",
                    "name": "Answer Engine Optimization Implementation",
                    "url": "https://llmprofiles.org/guides/aeo-implementation",
                    "description": "Step-by-step guide for implementing AEO with LLM Profiles"
                }
            ],
            "sameAs": [
                "https://schema.org/Recipe",
                "https://llmprofiles.org/profiles/content/recipe/v1/"
            ]
        },
        softwareapplication: {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "@id": "https://llmprofiles.org/tools/validator-benefits-demo",
            "name": "LLM Profiles Validator - Your Gateway to AI Content Optimization",
            "description": "This validator demonstrates how implementing LLM Profiles structured data makes your software applications discoverable and understandable by AI systems. When AI assistants like ChatGPT or Claude are asked about your app, they can provide accurate, detailed information because of the structured data you've implemented.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Web Browser",
            "browserRequirements": "Modern web browser with JavaScript support",
            "softwareVersion": "2.0.0",
            "releaseNotes": "Now with enhanced AEO validation and real-time AI content understanding analysis",
            "featureList": [
                "Real-time JSON-LD validation against LLM Profile schemas",
                "AEO optimization score calculation", 
                "AI content understanding analysis",
                "Answer engine visibility assessment",
                "Training data export for fine-tuning LLMs",
                "Structured data implementation guidance"
            ],
            "applicationSubCategory": "Answer Engine Optimization Tools",
            "downloadUrl": "https://llmprofiles.org/tools/validator",
            "installUrl": "https://llmprofiles.org/tools/validator", 
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock",
                "description": "Free to use - helps you implement LLM-friendly structured data that makes your content discoverable by AI systems"
            },
            "author": {
                "@type": "Organization",
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "maintainer": {
                "@type": "Organization", 
                "name": "HAMI",
                "url": "https://llmprofiles.org"
            },
            "inLanguage": "en",
            "sameAs": [
                "https://schema.org/SoftwareApplication",
                "https://llmprofiles.org/profiles/technology/softwareapplication/v1/"
            ]
        },
        book: {
            "@context": "https://schema.org",
            "@type": "Book",
            "@id": "https://example.com/book",
            "name": "The Complete Guide to Structured Data",
            "author": {
                "@type": "Person",
                "name": "Data Expert",
                "@id": "https://example.com/author"
            },
            "isbn": "978-0123456789",
            "numberOfPages": 350,
            "publisher": {
                "@type": "Organization",
                "name": "Tech Publishers"
            },
            "datePublished": "2024-01-01",
            "description": "A comprehensive guide to implementing structured data for modern web applications.",
            "inLanguage": "en"
        },
        dataset: {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "@id": "https://example.com/dataset",
            "name": "LLM Profiles Validation Dataset",
            "description": "Training data for validating structured data profiles against various schemas.",
            "creator": {
                "@type": "Organization",
                "name": "HAMI-IQ"
            },
            "datePublished": "2024-01-01",
            "distribution": {
                "@type": "DataDownload",
                "encodingFormat": "application/json",
                "contentUrl": "https://example.com/dataset.json"
            },
            "keywords": ["structured data", "validation", "JSON-LD", "schemas"],
            "inLanguage": "en"
        },
        howto: {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "@id": "https://example.com/howto",
            "name": "How to Validate JSON-LD with LLM Profiles",
            "description": "Step-by-step guide to validating your structured data using LLM Profiles.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Select Profile",
                    "text": "Choose the appropriate profile for your content type."
                },
                {
                    "@type": "HowToStep",
                    "name": "Input Data",
                    "text": "Enter your JSON-LD markup in the validator."
                },
                {
                    "@type": "HowToStep",
                    "name": "Validate",
                    "text": "Run validation and review the results."
                }
            ],
            "totalTime": "PT15M",
            "author": {
                "@type": "Organization",
                "name": "HAMI-IQ"
            },
            "inLanguage": "en"
        },
        videoobject: {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "@id": "https://example.com/video",
            "name": "Introduction to LLM Profiles",
            "description": "Learn how to use LLM Profiles for structured data validation and AEO optimization.",
            "contentUrl": "https://example.com/video.mp4",
            "uploadDate": "2024-01-01",
            "duration": "PT10M30S",
            "thumbnail": {
                "@type": "ImageObject",
                "url": "https://example.com/thumbnail.jpg"
            },
            "author": {
                "@type": "Organization",
                "name": "HAMI-IQ"
            },
            "inLanguage": "en"
        },
        qapage: {
            "@context": "https://schema.org",
            "@type": "QAPage",
            "@id": "https://example.com/qa",
            "mainEntity": {
                "@type": "Question",
                "@id": "https://example.com/qa#question",
                "name": "How do I implement LLM Profiles validation?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "@id": "https://example.com/qa#answer",
                    "text": "You can implement LLM Profiles validation by selecting the appropriate profile, structuring your JSON-LD according to the schema, and using the provided validation tools.",
                    "author": {
                        "@type": "Person",
                        "name": "Expert Developer"
                    }
                },
                "answerCount": 1
            },
            "inLanguage": "en"
        }
    };
    
    return examples[profileId] || {
        "@context": "https://schema.org",
        "@type": currentProfile.name,
        "@id": "https://example.com/" + profileId,
        "name": "Example " + currentProfile.name,
        "inLanguage": "en"
    };
}

function clearInput() {
    jsonEditor.set({});
    clearValidationResults();
}

function validateInput() {
    if (!currentProfile || !currentSchema) {
        showError('Please select a profile first');
        return;
    }

    try {
        const data = jsonEditor.get();
        
        // Basic validation first
        if (!data || Object.keys(data).length === 0) {
            showError('Please enter some JSON-LD data to validate');
            return;
        }
        
        // If AJV is not available, do basic validation
        if (!ajv) {
            performBasicValidation(data);
            return;
        }
        
        const validate = ajv.compile(currentSchema);
        const isValid = validate(data);

        if (isValid) {
            showValidationSuccess(data);
        } else {
            showValidationErrors(validate.errors);
        }
    } catch (error) {
        showError('Validation error: ' + error.message);
    }
}

function performBasicValidation(data) {
    const errors = [];
    
    // Basic structural checks
    if (!data['@type']) {
        errors.push({ message: '@type is required', instancePath: '' });
    }
    
    if (currentProfile.id === 'faqpage') {
        if (!data.mainEntity || !Array.isArray(data.mainEntity) || data.mainEntity.length === 0) {
            errors.push({ message: 'mainEntity array is required and must not be empty', instancePath: '/mainEntity' });
        } else {
            data.mainEntity.forEach((question, index) => {
                if (!question.name) {
                    errors.push({ message: 'Question name is required', instancePath: `/mainEntity/${index}/name` });
                }
                if (!question.acceptedAnswer || !question.acceptedAnswer.text) {
                    errors.push({ message: 'Answer text is required', instancePath: `/mainEntity/${index}/acceptedAnswer/text` });
                }
            });
        }
    }
    
    if (errors.length === 0) {
        showValidationSuccess(data);
    } else {
        showValidationErrors(errors);
    }
}

function showValidationSuccess(data) {
    const results = document.getElementById('validationResults');
    
    // Perform AEO checks
    const aeoChecks = performAEOChecks(data);
    const aeoChecksList = aeoChecks.map(check => `
        <div class="flex items-center">
            <i class="fas fa-${check.passed ? 'check text-green-600' : 'exclamation-triangle text-yellow-600'} mr-2"></i>
            <span class="${check.passed ? 'text-green-700' : 'text-yellow-700'}">${check.message}</span>
        </div>
    `).join('');
    
    results.innerHTML = `
        <div class="success-highlight p-4 rounded-lg fade-in">
            <div class="flex items-center">
                <i class="fas fa-check-circle text-green-600 text-2xl mr-3"></i>
                <div>
                    <h3 class="font-semibold text-green-800">Validation Passed!</h3>
                    <p class="text-green-600">Your JSON-LD markup is valid for the ${currentProfile.name} profile.</p>
                </div>
            </div>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-semibold text-green-800 mb-2">AEO Optimization Checklist</h4>
            <div class="text-sm space-y-1">
                ${aeoChecksList}
            </div>
        </div>
    `;
    
    // Show export options
    document.getElementById('exportOptions').classList.remove('hidden');
}

function performAEOChecks(data) {
    const checks = [];
    
    // Basic checks
    checks.push({
        passed: !!data['@type'],
        message: '@type is specified'
    });
    
    checks.push({
        passed: !!data['@id'],
        message: 'Stable @id provided for entity identification'
    });
    
    checks.push({
        passed: !!data.inLanguage,
        message: 'inLanguage specified for better language targeting'
    });
    
    // Profile-specific checks
    if (currentProfile.id === 'faqpage') {
        checks.push({
            passed: data.mainEntity && data.mainEntity.length > 0,
            message: 'FAQ questions are present'
        });
        
        if (data.mainEntity) {
            const hasStableIds = data.mainEntity.every(q => q['@id'] && q.acceptedAnswer && q.acceptedAnswer['@id']);
            checks.push({
                passed: hasStableIds,
                message: 'All questions and answers have stable @id values'
            });
        }
    }
    
    checks.push({
        passed: !!data.sameAs || (data.mainEntity && data.mainEntity.some(item => item.sameAs)),
        message: 'sameAs links provided for disambiguation'
    });
    
    return checks;
}

function showValidationErrors(errors) {
    const results = document.getElementById('validationResults');
    const errorList = errors.map(error => `
        <div class="flex items-start space-x-2 text-sm bg-white p-3 rounded border-l-4 border-red-400">
            <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
            <div>
                <div class="font-semibold text-red-800">Path: ${error.instancePath || 'root'}</div>
                <div class="text-red-600">${error.message}</div>
                ${error.data !== undefined ? `<div class="text-gray-600 text-xs mt-1">Value: ${JSON.stringify(error.data)}</div>` : ''}
            </div>
        </div>
    `).join('');

    results.innerHTML = `
        <div class="error-highlight p-4 rounded-lg fade-in">
            <div class="flex items-center mb-3">
                <i class="fas fa-exclamation-circle text-red-600 text-2xl mr-3"></i>
                <div>
                    <h3 class="font-semibold text-red-800">Validation Failed</h3>
                    <p class="text-red-600">${errors.length} error(s) found in your JSON-LD markup.</p>
                </div>
            </div>
            <div class="space-y-2">
                ${errorList}
            </div>
        </div>
        <div class="bg-yellow-50 p-4 rounded-lg">
            <h4 class="font-semibold text-yellow-800 mb-2">Common Issues & Fixes</h4>
            <div class="text-sm text-yellow-700 space-y-1">
                <div><i class="fas fa-lightbulb mr-2"></i> Ensure @type matches the profile exactly</div>
                <div><i class="fas fa-lightbulb mr-2"></i> Check that all required fields are present</div>
                <div><i class="fas fa-lightbulb mr-2"></i> Verify data types (string, array, object)</div>
                <div><i class="fas fa-lightbulb mr-2"></i> Use the "Load Example" button as a reference</div>
            </div>
        </div>
    `;
    
    // Hide export options
    document.getElementById('exportOptions').classList.add('hidden');
}

function clearValidationResults() {
    const results = document.getElementById('validationResults');
    results.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            <i class="fas fa-hourglass-start text-4xl mb-4"></i>
            <p>Validation results will appear here</p>
        </div>
    `;
    document.getElementById('exportOptions').classList.add('hidden');
}

function exportTrainingData() {
    try {
        const data = jsonEditor.get();
        const trainingData = convertToTrainingFormat(data);
        downloadFile('training.jsonl', trainingData, 'application/x-ndjson');
        showSuccess('Training data exported successfully!');
    } catch (error) {
        showError('Export error: ' + error.message);
    }
}

function exportOutputData() {
    try {
        const data = jsonEditor.get();
        const outputData = convertToOutputFormat(data);
        downloadFile('output.json', JSON.stringify(outputData, null, 2), 'application/json');
        showSuccess('Output data exported successfully!');
    } catch (error) {
        showError('Export error: ' + error.message);
    }
}

function copyCICommand() {
    if (!currentProfile) return;
    
    const command = `node scripts/validate-ajv.js profiles/${currentProfile.category}/${currentProfile.id}/v1/page.schema.json your-data.json`;
    navigator.clipboard.writeText(command).then(() => {
        showSuccess('CI command copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy to clipboard');
    });
}

function convertToTrainingFormat(data) {
    const lines = [];
    
    if (currentProfile.id === 'faqpage' && data.mainEntity) {
        data.mainEntity.forEach((question, index) => {
            const line = {
                id: question['@id'] || `faq-${index}`,
                lang: data.inLanguage || 'en',
                url: question['@id'] || data['@id'],
                version: `${currentProfile.id}.v1`,
                input: question.name,
                output: question.acceptedAnswer?.text,
                evidence: [data['@id'] || question.acceptedAnswer?.isBasedOn].filter(Boolean),
                source_url: data['@id']
            };
            lines.push(JSON.stringify(line));
        });
    } else {
        // Generic conversion for other types
        const line = {
            id: data['@id'] || 'item-1',
            lang: data.inLanguage || 'en',
            url: data['@id'],
            version: `${currentProfile.id}.v1`,
            input: data.name || data.headline || 'Content',
            output: data.description || data.text || data.articleBody || 'Output',
            evidence: [data['@id']].filter(Boolean),
            source_url: data['@id']
        };
        lines.push(JSON.stringify(line));
    }
    
    return lines.join('\n');
}

function convertToOutputFormat(data) {
    if (currentProfile.id === 'faqpage' && data.mainEntity) {
        return {
            faqs: data.mainEntity.map(question => ({
                id: question['@id'],
                question: question.name,
                answer: question.acceptedAnswer?.text,
                url: question['@id'],
                lastUpdated: new Date().toISOString()
            }))
        };
    }
    
    // Generic conversion for other types
    return {
        type: currentProfile.id,
        id: data['@id'],
        data: data,
        extractedAt: new Date().toISOString()
    };
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function showLoading(show) {
    document.getElementById('loadingModal').classList.toggle('hidden', !show);
}

function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 fade-in max-w-sm ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} mr-2"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
