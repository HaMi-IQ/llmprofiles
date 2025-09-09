/**
 * Enhanced Product Schema Examples
 * Demonstrates comprehensive Product schema implementation with Google Rich Results compliance
 */

const { ProductBuilder } = require('../lib/builders/product-builder');

console.log('=== Enhanced Product Schema Examples ===\n');

// Example 1: Basic Enhanced Product Schema
console.log('Example 1: Basic Enhanced Product Schema');
const basicProduct = new ProductBuilder('strict-seo', true)
  .name('Wireless Bluetooth Headphones')
  .description('Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.')
  .image('https://example.com/headphones.jpg', 500, 500, 'Wireless Bluetooth Headphones')
  .brand('AudioTech', 'https://example.com/audiotech-logo.jpg', 'https://audiotech.com')
  .offers(null, '199.99', 'USD', 'https://schema.org/InStock')
  .sku('ATH-WH-001')
  .gtin('1234567890123')
  .mpn('WH-2024-PRO')
  .url('https://example.com/products/wireless-headphones')
  .build();

console.log('Basic Product Schema:');
console.log(JSON.stringify(basicProduct, null, 2));
console.log('---\n');

// Example 2: Advanced Product with Ratings and Reviews
console.log('Example 2: Advanced Product with Ratings and Reviews');
const advancedProduct = new ProductBuilder('strict-seo', true)
  .name('Smart Fitness Watch')
  .description('Advanced fitness tracking smartwatch with heart rate monitoring, GPS, and 7-day battery life.')
  .image('https://example.com/smartwatch.jpg', 400, 400, 'Smart Fitness Watch')
  .brand('FitTech', 'https://example.com/fittech-logo.jpg', 'https://fittech.com')
  .offers(null, '299.99', 'USD', 'https://schema.org/InStock')
  .sku('FT-SW-001')
  .gtin('9876543210987')
  .mpn('SW-2024-FIT')
  .url('https://example.com/products/smart-fitness-watch')
  .aggregateRating(null, 4.5, 127, 5, 1)
  .addReview(null, 5, 'Sarah Johnson', 'Excellent watch! Great battery life and accurate heart rate monitoring.', '2024-01-15')
  .addReview(null, 4, 'Mike Chen', 'Good value for money. GPS tracking works well.', '2024-01-20')
  .addReview(null, 5, 'Emma Davis', 'Love the design and features. Highly recommended!', '2024-01-25')
  .build();

console.log('Advanced Product with Reviews:');
console.log(JSON.stringify(advancedProduct, null, 2));
console.log('---\n');

// Example 3: Product with Physical Dimensions and Properties
console.log('Example 3: Product with Physical Dimensions and Properties');
const physicalProduct = new ProductBuilder('strict-seo', true)
  .name('Ergonomic Office Chair')
  .description('Premium ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.')
  .image('https://example.com/office-chair.jpg', 600, 600, 'Ergonomic Office Chair')
  .brand('ComfortSeat', 'https://example.com/comfortseat-logo.jpg', 'https://comfortseat.com')
  .offers(null, '449.99', 'USD', 'https://schema.org/InStock')
  .sku('CS-OC-001')
  .gtin('5556667778889')
  .mpn('OC-2024-ERG')
  .url('https://example.com/products/ergonomic-office-chair')
  .weight(15.5, 'kg')
  .dimensions(65, 60, 45, 'cm') // height, width, depth
  .color('Black')
  .material('Mesh, Steel, Plastic')
  .size('One Size')
  .model('OC-2024-ERG')
  .version('2.1')
  .keywords(['office chair', 'ergonomic', 'lumbar support', 'adjustable', 'mesh'])
  .build();

console.log('Physical Product with Dimensions:');
console.log(JSON.stringify(physicalProduct, null, 2));
console.log('---\n');

// Example 4: Book Product with ISBN
console.log('Example 4: Book Product with ISBN');
const bookProduct = new ProductBuilder('strict-seo', true)
  .name('JavaScript: The Complete Guide')
  .description('Comprehensive guide to modern JavaScript development with ES6+, Node.js, and web frameworks.')
  .image('https://example.com/javascript-book.jpg', 300, 400, 'JavaScript: The Complete Guide Book Cover')
  .brand('TechBooks', 'https://example.com/techbooks-logo.jpg', 'https://techbooks.com')
  .offers(null, '49.99', 'USD', 'https://schema.org/InStock')
  .sku('TB-JS-001')
  .gtin('9781234567890')
  .isbn('978-1-234-56789-0')
  .url('https://example.com/products/javascript-complete-guide')
  .weight(0.8, 'kg')
  .dimensions(23, 15, 3, 'cm') // height, width, depth
  .color('Blue')
  .material('Paper, Cardboard')
  .keywords(['javascript', 'programming', 'web development', 'es6', 'node.js'])
  .build();

console.log('Book Product with ISBN:');
console.log(JSON.stringify(bookProduct, null, 2));
console.log('---\n');

// Example 5: Product with Multiple Offers and Seller Information
console.log('Example 5: Product with Multiple Offers and Seller Information');
const multiOfferProduct = {
  "@type": "Product",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4070 graphics, 16GB RAM, and 1TB SSD storage.",
  "image": {
    "@type": "ImageObject",
    "url": "https://example.com/gaming-laptop.jpg",
    "width": 600,
    "height": 400,
    "caption": "Gaming Laptop Product Image"
  },
  "brand": {
    "@type": "Brand",
    "name": "GameTech",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/gametech-logo.jpg"
    },
    "url": "https://gametech.com"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "1299.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "TechStore",
      "url": "https://techstore.com"
    },
    "validFrom": "2024-01-01T00:00:00Z",
    "validThrough": "2024-12-31T23:59:59Z",
    "priceValidUntil": "2024-12-31"
  },
  "sku": "GT-GL-001",
  "gtin": "1112223334445",
  "mpn": "GL-2024-RTX",
  "url": "https://example.com/products/gaming-laptop",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.7,
    "reviewCount": 89,
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5
      },
      "author": {
        "@type": "Person",
        "name": "Alex Rodriguez"
      },
      "reviewBody": "Amazing gaming performance! Runs all the latest games at high settings without any issues.",
      "datePublished": "2024-01-10"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 4
      },
      "author": {
        "@type": "Person",
        "name": "Lisa Wang"
      },
      "reviewBody": "Great laptop for gaming and work. Battery life could be better, but overall very satisfied.",
      "datePublished": "2024-01-18"
    }
  ],
  "weight": {
    "@type": "QuantitativeValue",
    "value": 2.3,
    "unitText": "kg"
  },
  "height": {
    "@type": "QuantitativeValue",
    "value": 2.5,
    "unitText": "cm"
  },
  "width": {
    "@type": "QuantitativeValue",
    "value": 35.5,
    "unitText": "cm"
  },
  "depth": {
    "@type": "QuantitativeValue",
    "value": 24.8,
    "unitText": "cm"
  },
  "color": "Black",
  "material": "Aluminum, Plastic",
  "size": "15.6 inch",
  "model": "GL-2024-RTX",
  "version": "1.0",
  "keywords": ["gaming laptop", "rtx 4070", "gaming", "laptop", "high performance"],
  "sameAs": [
    "https://facebook.com/gametech",
    "https://twitter.com/gametech",
    "https://instagram.com/gametech"
  ],
  "additionalType": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "schemaVersion": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "identifier": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld",
  "additionalProperty": {
    "@type": "PropertyValue",
    "name": "profile",
    "value": "https://llmprofiles.org/profiles/business/product/v1/index.jsonld"
  }
};

console.log('Multi-Offer Product:');
console.log(JSON.stringify(multiOfferProduct, null, 2));
console.log('---\n');

// Example 6: Standards Header Product Schema
console.log('Example 6: Standards Header Product Schema');
const standardsProduct = new ProductBuilder('standards-header', true)
  .name('AI-Powered Smart Home Hub')
  .description('Next-generation smart home hub with AI voice assistant, Zigbee/Z-Wave support, and advanced automation capabilities.')
  .image('https://example.com/smart-hub.jpg', 500, 500, 'AI-Powered Smart Home Hub')
  .brand('SmartHome Pro', 'https://example.com/smarthome-logo.jpg', 'https://smarthomepro.com')
  .offers(null, '199.99', 'USD', 'https://schema.org/InStock')
  .sku('SHP-HUB-001')
  .gtin('7778889990001')
  .mpn('HUB-2024-AI')
  .url('https://example.com/products/ai-smart-home-hub')
  .aggregateRating(null, 4.8, 156, 5, 1)
  .addReview(null, 5, 'David Kim', 'Incredible AI capabilities! Setup was easy and the voice recognition is spot on.', '2024-01-12')
  .addReview(null, 5, 'Maria Garcia', 'Perfect for smart home automation. Works with all my devices seamlessly.', '2024-01-19')
  .weight(0.5, 'kg')
  .dimensions(12, 12, 3, 'cm')
  .color('White')
  .material('Plastic, Metal')
  .model('HUB-2024-AI')
  .version('3.2')
  .keywords(['smart home', 'AI', 'voice assistant', 'automation', 'zigbee', 'z-wave', 'hub'])
  .sameAs(['https://facebook.com/smarthomepro', 'https://twitter.com/smarthomepro'])
  .build();

console.log('Standards Header Product:');
console.log(JSON.stringify(standardsProduct, null, 2));
console.log('---\n');

console.log('=== Product Schema Examples Complete ===');
console.log('These examples demonstrate:');
console.log('1. Basic product with essential properties');
console.log('2. Advanced product with ratings and reviews');
console.log('3. Physical product with dimensions and properties');
console.log('4. Book product with ISBN');
console.log('5. Product with detailed offer information');
console.log('6. Standards header product for compliance');
console.log('\nAll examples include Google Rich Results compliance and LLM optimization features.');
