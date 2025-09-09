/**
 * Enhanced LocalBusiness Schema Examples
 * Demonstrates the enhanced LocalBusiness schema with all new features
 */

const { LocalBusinessBuilder, MODES } = require('../lib/builders/localbusiness-builder');

console.log('=== Enhanced LocalBusiness Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema');
const basicLocalBusiness = new LocalBusinessBuilder(MODES.STRICT_SEO, true)
  .name("Downtown Coffee Shop")
  .description("Artisanal coffee and pastries in the heart of downtown")
  .address("", "123 Main Street", "Springfield", "IL", "62701", "US")
  .telephone("+1-217-555-0123")
  .url("https://downtowncoffee.com")
  .email("hello@downtowncoffee.com")
  .build();

console.log(JSON.stringify(basicLocalBusiness, null, 2));
console.log('');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema with Optional Properties');
const advancedLocalBusiness = new LocalBusinessBuilder(MODES.STRICT_SEO, true)
  .name("Tech Solutions Inc")
  .description("Full-service technology consulting and software development")
  .address("", "456 Innovation Drive", "San Francisco", "CA", "94105", "US")
  .telephone("+1-415-555-0456")
  .url("https://techsolutions.com")
  .email("contact@techsolutions.com")
  .geo(37.7749, -122.4194)
  .addOpeningHours(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "09:00", "18:00")
  .addOpeningHours("Saturday", "10:00", "16:00")
  .priceRange("$$$$")
  .paymentAccepted(["Credit Card", "Bank Transfer", "Cryptocurrency"])
  .currenciesAccepted(["USD", "EUR", "BTC"])
  .areaServed("San Francisco Bay Area")
  .sameAs([
    "https://linkedin.com/company/techsolutions",
    "https://twitter.com/techsolutions",
    "https://github.com/techsolutions"
  ])
  .image("https://techsolutions.com/office.jpg")
  .logo("https://techsolutions.com/logo.png", 200, 200)
  .addAggregateRating(4.8, 156, 5, 1)
  .addReview("Sarah Johnson", 5, "Excellent technical expertise and great communication!", "2024-01-15")
  .addReview("Mike Chen", 4, "Very professional team, delivered on time and within budget.", "2024-01-10")
  .foundingDate("2015-03-20")
  .slogan("Innovation through Technology")
  .knowsAbout([
    "Web Development",
    "Mobile Apps",
    "Cloud Computing",
    "AI/ML",
    "DevOps",
    "Cybersecurity"
  ])
  .hasOfferCatalog({
    "@type": "OfferCatalog",
    "name": "Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": "Web Development",
        "price": "5000",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": "Mobile App Development",
        "price": "8000",
        "priceCurrency": "USD"
      }
    ]
  })
  .addOffer("Cloud Migration", "3000", "USD", "InStock")
  .addOffer("Security Audit", "2500", "USD", "InStock")
  .addContactPoint("+1-415-555-0456", "sales", "sales@techsolutions.com", ["English", "Spanish"])
  .addContactPoint("+1-415-555-0457", "support", "support@techsolutions.com", ["English"])
  .setIdentifiers({
    "naics": "541511",
    "isicV4": "6201",
    "duns": "123456789"
  })
  .build();

console.log(JSON.stringify(advancedLocalBusiness, null, 2));
console.log('');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized');
const seoOptimizedLocalBusiness = new LocalBusinessBuilder(MODES.STRICT_SEO, true)
  .name("Mario's Italian Restaurant")
  .description("Authentic Italian cuisine with fresh ingredients and traditional recipes")
  .address("", "789 Little Italy Blvd", "New York", "NY", "10013", "US")
  .telephone("+1-212-555-0789")
  .url("https://mariositalian.com")
  .email("reservations@mariositalian.com")
  .geo(40.7209, -74.0007)
  .addOpeningHours(["Monday", "Tuesday", "Wednesday", "Thursday"], "17:00", "22:00")
  .addOpeningHours(["Friday", "Saturday"], "17:00", "23:00")
  .addOpeningHours("Sunday", "16:00", "21:00")
  .priceRange("$$$")
  .paymentAccepted(["Cash", "Credit Card", "Debit Card"])
  .currenciesAccepted("USD")
  .areaServed("Lower Manhattan")
  .sameAs([
    "https://facebook.com/mariositalian",
    "https://instagram.com/mariositalian",
    "https://yelp.com/biz/marios-italian-restaurant"
  ])
  .image([
    "https://mariositalian.com/restaurant-exterior.jpg",
    "https://mariositalian.com/dining-room.jpg",
    "https://mariositalian.com/pasta-dish.jpg"
  ])
  .logo("https://mariositalian.com/logo.png", 150, 150)
  .addAggregateRating(4.6, 234, 5, 1)
  .addReview("Jennifer Martinez", 5, "Best Italian food in the city! The pasta is incredible.", "2024-01-20")
  .addReview("David Kim", 4, "Great atmosphere and authentic flavors. Will definitely return.", "2024-01-18")
  .addReview("Lisa Thompson", 5, "Perfect for date night. Excellent service and wine selection.", "2024-01-15")
  .build();

console.log(JSON.stringify(seoOptimizedLocalBusiness, null, 2));
console.log('');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized');
const llmOptimizedLocalBusiness = new LocalBusinessBuilder(MODES.LLM_OPTIMIZED, true)
  .name("Green Earth Consulting")
  .description("Environmental consulting firm specializing in sustainability, renewable energy, and carbon footprint reduction")
  .address("", "321 Eco Park Way", "Portland", "OR", "97201", "US")
  .telephone("+1-503-555-0321")
  .url("https://greenearthconsulting.com")
  .email("info@greenearthconsulting.com")
  .geo(45.5152, -122.6784)
  .addOpeningHours(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "08:00", "17:00")
  .priceRange("$$$$")
  .paymentAccepted(["Credit Card", "Bank Transfer", "Check"])
  .currenciesAccepted("USD")
  .areaServed("Pacific Northwest")
  .sameAs([
    "https://linkedin.com/company/greenearthconsulting",
    "https://twitter.com/greenearthconsult",
    "https://facebook.com/greenearthconsulting"
  ])
  .image("https://greenearthconsulting.com/team.jpg")
  .logo("https://greenearthconsulting.com/logo.png", 180, 180)
  .addAggregateRating(4.9, 89, 5, 1)
  .addReview("Robert Green", 5, "Helped our company reduce carbon emissions by 40%. Highly recommend!", "2024-01-22")
  .addReview("Amanda Foster", 5, "Expert knowledge in renewable energy solutions. Professional and thorough.", "2024-01-19")
  .foundingDate("2010-06-05")
  .slogan("Building a Sustainable Future Together")
  .knowsAbout([
    "Environmental Impact Assessment",
    "Renewable Energy Systems",
    "Carbon Footprint Analysis",
    "Sustainability Planning",
    "LEED Certification",
    "Green Building Design",
    "Climate Change Mitigation",
    "Waste Reduction Strategies"
  ])
  .hasOfferCatalog({
    "@type": "OfferCatalog",
    "name": "Environmental Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": "Environmental Impact Assessment",
        "price": "15000",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": "Carbon Footprint Analysis",
        "price": "8000",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": "Renewable Energy Consulting",
        "price": "12000",
        "priceCurrency": "USD"
      }
    ]
  })
  .addOffer("Sustainability Planning", "20000", "USD", "InStock")
  .addOffer("LEED Certification Support", "10000", "USD", "InStock")
  .addContactPoint("+1-503-555-0321", "consulting", "consulting@greenearthconsulting.com", ["English"])
  .addContactPoint("+1-503-555-0322", "sales", "sales@greenearthconsulting.com", ["English", "Spanish"])
  .setIdentifiers({
    "naics": "541620",
    "isicV4": "7490",
    "duns": "987654321"
  })
  .build();

console.log(JSON.stringify(llmOptimizedLocalBusiness, null, 2));
console.log('');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode');
const standardsCompliantLocalBusiness = new LocalBusinessBuilder(MODES.STANDARDS_HEADER, true)
  .name("Metro Dental Care")
  .description("Comprehensive dental services with state-of-the-art equipment and experienced professionals")
  .address("", "555 Health Plaza", "Chicago", "IL", "60601", "US")
  .telephone("+1-312-555-0555")
  .url("https://metrodentalcare.com")
  .email("appointments@metrodentalcare.com")
  .geo(41.8781, -87.6298)
  .addOpeningHours(["Monday", "Tuesday", "Wednesday", "Thursday"], "08:00", "17:00")
  .addOpeningHours("Friday", "08:00", "15:00")
  .priceRange("$$$")
  .paymentAccepted(["Cash", "Credit Card", "Insurance"])
  .currenciesAccepted("USD")
  .areaServed("Chicago Loop")
  .sameAs([
    "https://facebook.com/metrodentalcare",
    "https://instagram.com/metrodentalcare"
  ])
  .image("https://metrodentalcare.com/clinic.jpg")
  .logo("https://metrodentalcare.com/logo.png", 120, 120)
  .addAggregateRating(4.7, 167, 5, 1)
  .addReview("Maria Rodriguez", 5, "Dr. Smith is amazing! Very gentle and thorough.", "2024-01-21")
  .addReview("James Wilson", 4, "Clean facility and friendly staff. Good experience overall.", "2024-01-17")
  .foundingDate("2008-09-12")
  .slogan("Your Smile is Our Priority")
  .knowsAbout([
    "General Dentistry",
    "Cosmetic Dentistry",
    "Orthodontics",
    "Oral Surgery",
    "Periodontics",
    "Endodontics",
    "Pediatric Dentistry"
  ])
  .addOffer("Teeth Cleaning", "150", "USD", "InStock")
  .addOffer("Dental Implants", "3000", "USD", "InStock")
  .addContactPoint("+1-312-555-0555", "appointments", "appointments@metrodentalcare.com", ["English", "Spanish"])
  .setIdentifiers({
    "naics": "621210",
    "isicV4": "8620"
  })
  .build();

console.log(JSON.stringify(standardsCompliantLocalBusiness, null, 2));
console.log('');

console.log('=== Examples Summary ===');
console.log('All examples demonstrate the enhanced LocalBusiness schema with:');
console.log('✅ Enhanced required properties (address structure, url requirement)');
console.log('✅ Comprehensive recommended properties (geo, openingHoursSpecification, etc.)');
console.log('✅ Rich optional properties (reviews, offers, contact points, etc.)');
console.log('✅ Google Rich Results optimization');
console.log('✅ LLM optimization features');
console.log('✅ Builder pattern with method chaining');
console.log('✅ Input sanitization and validation');
