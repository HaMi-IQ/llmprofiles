/**
 * Enhanced HowTo Schema Examples
 * Demonstrates the enhanced HowTo schema implementation with all new features
 */

const { HowToBuilder, MODES } = require('../lib/builders/howto-builder');

console.log('=== Enhanced HowTo Schema Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('Example 1: Basic Enhanced Schema - All new required properties');
const basicHowto = new HowToBuilder(MODES.STRICT_SEO)
  .name('How to Change a Car Tire')
  .description('Step-by-step instructions to safely change a car tire')
  .addStep('Loosen the lug nuts', 'Loosen the lug nuts', null, null, 1)
  .addStep('Raise the vehicle', 'Raise the vehicle', null, null, 2)
  .addStep('Remove the flat tire', 'Remove the flat tire', null, null, 3)
  .addStep('Mount the spare tire', 'Mount the spare tire', null, null, 4)
  .addStep('Lower the vehicle', 'Lower the vehicle', null, null, 5)
  .build();

console.log('Basic Enhanced HowTo:');
console.log(JSON.stringify(basicHowto, null, 2));
console.log('---\n');

// Example 2: Advanced Schema - All optional properties
console.log('Example 2: Advanced Schema - All optional properties');
const advancedHowto = new HowToBuilder(MODES.STRICT_SEO)
  .name('How to Bake a Chocolate Cake')
  .description('Learn how to bake a delicious chocolate cake from scratch')
  .author('Jane Baker', 'https://example.com/jane-baker')
  .datePublished('2024-01-15')
  .dateModified('2024-01-20')
  .totalTime('PT2H')
  .estimatedCost('15', 'USD')
  .difficulty('Intermediate')
  .prerequisites(['Basic baking knowledge', 'Oven access', 'Mixing skills'])
  .tool(['Mixing bowl', 'Whisk', 'Cake pan', 'Oven', 'Measuring cups'])
  .supply(['Flour', 'Sugar', 'Eggs', 'Butter', 'Cocoa powder', 'Baking powder'])
  .image('https://example.com/chocolate-cake.jpg')
  .video('https://example.com/cake-baking-video.mp4', 'Chocolate Cake Tutorial', 'Step-by-step video guide', 'https://example.com/cake-thumb.jpg')
  .setYield('One 9-inch chocolate cake')
  .setCategory('Cooking')
  .inLanguage('en')
  .keywords(['baking', 'cake', 'chocolate', 'dessert', 'recipe'])
  .addStep('Preheat your oven to 350°F (175°C)', 'Preheat oven', null, 'https://example.com/preheat.jpg', 1)
  .addStep('In a large bowl, whisk together flour, sugar, and cocoa powder', 'Mix dry ingredients', null, 'https://example.com/dry-mix.jpg', 2)
  .addStep('Add eggs, butter, and milk to the dry ingredients and mix until smooth', 'Add wet ingredients', null, 'https://example.com/wet-mix.jpg', 3)
  .addStep('Pour batter into greased cake pan and bake for 30-35 minutes', 'Bake the cake', null, 'https://example.com/baking.jpg', 4)
  .addStep('Let cool for 10 minutes before removing from pan', 'Cool and serve', null, 'https://example.com/cooling.jpg', 5)
  .build();

console.log('Advanced HowTo:');
console.log(JSON.stringify(advancedHowto, null, 2));
console.log('---\n');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('Example 3: Google Rich Results Optimized - SEO-focused implementation');
const seoHowto = new HowToBuilder(MODES.STRICT_SEO)
  .name('How to Install a Smart Doorbell')
  .description('Complete guide to installing a smart doorbell with video recording capabilities')
  .totalTime('PT45M')
  .estimatedCost('150', 'USD')
  .tool(['Drill', 'Screwdriver', 'Level', 'Wire strippers', 'Voltage tester'])
  .supply(['Smart doorbell', 'Mounting screws', 'Wire nuts', 'Electrical tape'])
  .image('https://example.com/smart-doorbell-installation.jpg')
  .video('https://example.com/doorbell-install-video.mp4')
  .setCategory('Home Improvement')
  .inLanguage('en')
  .addStep('Turn off power to the existing doorbell at the circuit breaker', 'Turn off power', null, 'https://example.com/power-off.jpg', 1)
  .addStep('Remove the old doorbell and disconnect the wires', 'Remove old doorbell', null, 'https://example.com/remove-old.jpg', 2)
  .addStep('Install the mounting bracket for the new smart doorbell', 'Install bracket', null, 'https://example.com/bracket.jpg', 3)
  .addStep('Connect the wires to the new doorbell following the manufacturer instructions', 'Connect wires', null, 'https://example.com/wire-connection.jpg', 4)
  .addStep('Mount the smart doorbell and test the installation', 'Mount and test', null, 'https://example.com/mount-test.jpg', 5)
  .build();

console.log('SEO Optimized HowTo:');
console.log(JSON.stringify(seoHowto, null, 2));
console.log('---\n');

// Example 4: LLM Optimized - AI-focused implementation
console.log('Example 4: LLM Optimized - AI-focused implementation');
const llmHowto = new HowToBuilder(MODES.LLM_OPTIMIZED)
  .name('How to Train a Machine Learning Model')
  .description('Comprehensive guide to training a machine learning model from data collection to deployment')
  .totalTime('PT8H')
  .difficulty('Advanced')
  .prerequisites(['Python programming', 'Basic statistics', 'Linear algebra', 'Data analysis experience'])
  .tool(['Python', 'Jupyter Notebook', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy'])
  .supply(['Training dataset', 'Validation dataset', 'Test dataset', 'Computing resources'])
  .setYield('Trained machine learning model ready for deployment')
  .setCategory('Technology')
  .inLanguage('en')
  .video('https://example.com/ml-training-tutorial.mp4', 'ML Training Tutorial', 'Complete machine learning training process', 'https://example.com/ml-thumb.jpg')
  .addStep('Collect and prepare your training data, ensuring it is clean and properly formatted', 'Data Preparation', null, 'https://example.com/data-prep.jpg', 1)
  .addStep('Choose appropriate features and perform feature engineering to improve model performance', 'Feature Engineering', null, 'https://example.com/feature-eng.jpg', 2)
  .addStep('Select a suitable algorithm and initialize your model with appropriate hyperparameters', 'Model Selection', null, 'https://example.com/model-select.jpg', 3)
  .addStep('Train the model on your training dataset and monitor performance metrics', 'Model Training', null, 'https://example.com/training.jpg', 4)
  .addStep('Validate the model on unseen data and fine-tune hyperparameters if necessary', 'Validation & Tuning', null, 'https://example.com/validation.jpg', 5)
  .addStep('Test the final model on your test dataset and evaluate its performance', 'Testing & Evaluation', null, 'https://example.com/testing.jpg', 6)
  .addStep('Deploy the trained model to production environment and monitor its performance', 'Deployment', null, 'https://example.com/deployment.jpg', 7)
  .build();

console.log('LLM Optimized HowTo:');
console.log(JSON.stringify(llmHowto, null, 2));
console.log('---\n');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('Example 5: Standards Header Mode - Standards-compliant implementation');
const standardsHowto = new HowToBuilder(MODES.STANDARDS_HEADER)
  .name('How to Perform CPR')
  .description('Emergency cardiopulmonary resuscitation procedure to save lives')
  .totalTime('PT5M')
  .difficulty('Beginner')
  .prerequisites(['Basic first aid knowledge', 'CPR certification recommended'])
  .tool(['CPR manikin for practice', 'AED if available'])
  .supply(['Gloves', 'Face shield or mask'])
  .setCategory('Emergency Response')
  .inLanguage('en')
  .addStep('Check for responsiveness and call emergency services immediately', 'Check & Call', null, 'https://example.com/check-call.jpg', 1)
  .addStep('Open the airway by tilting the head back and lifting the chin', 'Open Airway', null, 'https://example.com/airway.jpg', 2)
  .addStep('Check for breathing for no more than 10 seconds', 'Check Breathing', null, 'https://example.com/breathing.jpg', 3)
  .addStep('Begin chest compressions at a rate of 100-120 per minute', 'Chest Compressions', null, 'https://example.com/compressions.jpg', 4)
  .addStep('Give rescue breaths if trained, otherwise continue compressions only', 'Rescue Breaths', null, 'https://example.com/breaths.jpg', 5)
  .addStep('Continue CPR until help arrives or the person shows signs of life', 'Continue CPR', null, 'https://example.com/continue.jpg', 6)
  .build();

console.log('Standards Compliant HowTo:');
console.log(JSON.stringify(standardsHowto, null, 2));
console.log('---\n');

// Example 6: Complex Step Structure with All Properties
console.log('Example 6: Complex Step Structure with All Properties');
const complexStepsHowto = new HowToBuilder(MODES.STRICT_SEO)
  .name('How to Build a Website')
  .description('Complete guide to building a professional website from scratch')
  .totalTime('PT4H')
  .estimatedCost('50', 'USD')
  .difficulty('Intermediate')
  .tool(['Computer', 'Text editor', 'Web browser', 'FTP client'])
  .supply(['Domain name', 'Web hosting', 'HTML/CSS knowledge', 'Images and content'])
  .setCategory('Web Development')
  .inLanguage('en')
  .step([
    {
      "@type": "HowToStep",
      "name": "Plan Your Website",
      "text": "Define your website's purpose, target audience, and content structure",
      "url": "https://example.com/planning-guide",
      "image": "https://example.com/planning.jpg",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Choose a Domain and Hosting",
      "text": "Register a domain name and select a reliable web hosting provider",
      "url": "https://example.com/hosting-guide",
      "image": "https://example.com/hosting.jpg",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Design Your Website",
      "text": "Create wireframes and design mockups for your website layout",
      "url": "https://example.com/design-guide",
      "image": "https://example.com/design.jpg",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "Code Your Website",
      "text": "Write HTML, CSS, and JavaScript code to build your website",
      "url": "https://example.com/coding-guide",
      "image": "https://example.com/coding.jpg",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "Test and Launch",
      "text": "Test your website across different browsers and devices, then launch it",
      "url": "https://example.com/testing-guide",
      "image": "https://example.com/testing.jpg",
      "position": 5
    }
  ])
  .build();

console.log('Complex Steps HowTo:');
console.log(JSON.stringify(complexStepsHowto, null, 2));
console.log('---\n');

console.log('=== Example Summary ===');
console.log('All examples demonstrate:');
console.log('- Enhanced step structure validation with @type and text requirements');
console.log('- New properties: video, yield, category, inLanguage, mainEntity');
console.log('- Google Rich Results compliance with all recommended properties');
console.log('- LLM optimization with structured metadata');
console.log('- Proper validation behavior (strict required, warning recommended)');
console.log('- Multiple builder modes for different use cases');
