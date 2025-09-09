/**
 * Enhanced Course Schema Examples
 * Demonstrates the enhanced Course schema implementation with Google Rich Results compliance
 */

const { CourseBuilder } = require('../lib/builders/course-builder');
const { MODES } = require('../lib/modes');

console.log('=== Enhanced Course Schema Examples ===\n');

// Example 1: Basic Enhanced Course (All Required Properties)
console.log('Example 1: Basic Enhanced Course');
const basicCourse = new CourseBuilder(MODES.STRICT_SEO, true)
  .name("Introduction to Web Development")
  .description("Learn the fundamentals of web development including HTML, CSS, and JavaScript")
  .provider("WebDev Academy", "https://webdevacademy.com")
  .build();

console.log('Basic Course Schema:');
console.log(JSON.stringify(basicCourse, null, 2));
console.log('');

// Example 2: Advanced Course with All Recommended Properties
console.log('Example 2: Advanced Course with All Recommended Properties');
const advancedCourse = new CourseBuilder(MODES.STRICT_SEO, true)
  .name("Full-Stack JavaScript Development")
  .description("Master full-stack JavaScript development with React, Node.js, and modern tools")
  .provider("Tech Academy", "https://techacademy.com")
  .instructor("Dr. Sarah Johnson", "https://techacademy.com/instructors/sarah-johnson")
  .coursePrerequisites([
    "Basic HTML and CSS knowledge",
    "JavaScript fundamentals",
    {
      "@type": "Course",
      "name": "JavaScript Basics",
      "url": "https://techacademy.com/courses/javascript-basics"
    }
  ])
  .educationalLevel("Intermediate")
  .courseMode("Online")
  .timeRequired("P80H")
  .numberOfCredits(4)
  .educationalCredentialAwarded(
    "Full-Stack Developer Certificate",
    "Professional certificate in full-stack JavaScript development",
    "Certificate"
  )
  .courseCode("FS-JS-2024")
  .teaches([
    "React Development",
    "Node.js Backend",
    "Database Design",
    "API Development",
    "Deployment Strategies"
  ])
  .about([
    "Web Development",
    "JavaScript Programming",
    "Full-Stack Development",
    "Modern Web Technologies"
  ])
  .audience("Student", "Web Developer")
  .offers(599, "USD", "InStock")
  .url("https://techacademy.com/courses/fullstack-javascript")
  .inLanguage("en-US")
  .keywords(["JavaScript", "React", "Node.js", "Full-Stack", "Web Development"])
  .addCourseInstance("Online", "2024-03-01", "2024-05-31")
  .build();

console.log('Advanced Course Schema:');
console.log(JSON.stringify(advancedCourse, null, 2));
console.log('');

// Example 3: Google Rich Results Optimized Course
console.log('Example 3: Google Rich Results Optimized Course');
const googleOptimizedCourse = new CourseBuilder(MODES.STRICT_SEO, true)
  .name("Data Science with Python")
  .description("Comprehensive data science course covering Python, machine learning, and data visualization")
  .provider("Data Science Institute", "https://datascienceinstitute.com")
  .instructor("Prof. Michael Chen", "https://datascienceinstitute.com/instructors/michael-chen")
  .coursePrerequisites([
    "Basic programming knowledge",
    "High school mathematics",
    "Statistics fundamentals"
  ])
  .educationalLevel("Beginner")
  .courseMode("Blended")
  .timeRequired("P120H")
  .numberOfCredits(6)
  .educationalCredentialAwarded(
    "Data Science Professional Certificate",
    "Industry-recognized certificate in data science",
    "Professional Certificate"
  )
  .courseCode("DS-PYTHON-2024")
  .teaches([
    "Python Programming",
    "Data Analysis",
    "Machine Learning",
    "Data Visualization",
    "Statistical Modeling"
  ])
  .about([
    "Data Science",
    "Python Programming",
    "Machine Learning",
    "Statistics"
  ])
  .audience("Student", "Data Analyst")
  .offers(799, "USD", "InStock")
  .url("https://datascienceinstitute.com/courses/data-science-python")
  .image({
    "@type": "ImageObject",
    "url": "https://datascienceinstitute.com/images/data-science-course.jpg",
    "width": 1200,
    "height": 630,
    "caption": "Data Science with Python Course"
  })
  .inLanguage("en-US")
  .keywords(["Data Science", "Python", "Machine Learning", "Statistics", "Data Analysis"])
  .addCourseInstance("Blended", "2024-04-01", "2024-07-31", {
    "@type": "Place",
    "name": "Data Science Institute",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  })
  .build();

console.log('Google Rich Results Optimized Course:');
console.log(JSON.stringify(googleOptimizedCourse, null, 2));
console.log('');

// Example 4: LLM Optimized Course
console.log('Example 4: LLM Optimized Course');
const llmOptimizedCourse = new CourseBuilder(MODES.LLM_OPTIMIZED, true)
  .name("Artificial Intelligence and Machine Learning")
  .description("Comprehensive AI and ML course covering algorithms, neural networks, and real-world applications")
  .provider("AI Learning Center", "https://ailearningcenter.com")
  .instructor("Dr. Emily Rodriguez", "https://ailearningcenter.com/instructors/emily-rodriguez")
  .coursePrerequisites([
    "Linear algebra",
    "Calculus",
    "Python programming",
    "Statistics and probability"
  ])
  .educationalLevel("Advanced")
  .courseMode("Online")
  .timeRequired("P160H")
  .numberOfCredits(8)
  .educationalCredentialAwarded(
    "AI/ML Specialist Certificate",
    "Advanced certificate in artificial intelligence and machine learning",
    "Specialist Certificate"
  )
  .courseCode("AI-ML-2024")
  .teaches([
    "Machine Learning Algorithms",
    "Deep Learning",
    "Neural Networks",
    "Natural Language Processing",
    "Computer Vision",
    "Reinforcement Learning"
  ])
  .about([
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Neural Networks",
    "AI Applications"
  ])
  .audience("Student", "AI Engineer")
  .offers(1299, "USD", "InStock")
  .url("https://ailearningcenter.com/courses/ai-ml")
  .inLanguage("en-US")
  .keywords([
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Neural Networks",
    "AI",
    "ML"
  ])
  .addCourseInstance("Online", "2024-05-01", "2024-08-31")
  .build();

console.log('LLM Optimized Course:');
console.log(JSON.stringify(llmOptimizedCourse, null, 2));
console.log('');

// Example 5: Standards Header Mode Course
console.log('Example 5: Standards Header Mode Course');
const standardsCourse = new CourseBuilder(MODES.STANDARDS_HEADER, true)
  .name("Cybersecurity Fundamentals")
  .description("Learn essential cybersecurity concepts, threats, and defense strategies")
  .provider("Cyber Security Academy", "https://cybersecurityacademy.com")
  .instructor("James Wilson", "https://cybersecurityacademy.com/instructors/james-wilson")
  .coursePrerequisites([
    "Basic computer knowledge",
    "Understanding of networking concepts"
  ])
  .educationalLevel("Beginner")
  .courseMode("Online")
  .timeRequired("P60H")
  .numberOfCredits(3)
  .educationalCredentialAwarded(
    "Cybersecurity Fundamentals Certificate",
    "Certificate in cybersecurity fundamentals",
    "Certificate"
  )
  .courseCode("CS-FUND-2024")
  .teaches([
    "Network Security",
    "Threat Analysis",
    "Security Policies",
    "Incident Response",
    "Risk Management"
  ])
  .about([
    "Cybersecurity",
    "Information Security",
    "Network Security",
    "Threat Management"
  ])
  .audience("Student", "IT Professional")
  .offers(399, "USD", "InStock")
  .url("https://cybersecurityacademy.com/courses/cybersecurity-fundamentals")
  .inLanguage("en-US")
  .keywords(["Cybersecurity", "Information Security", "Network Security", "Threats"])
  .addCourseInstance("Online", "2024-06-01", "2024-08-31")
  .build();

console.log('Standards Header Mode Course:');
console.log(JSON.stringify(standardsCourse, null, 2));
console.log('');

// Example 6: Multiple Instructors Course
console.log('Example 6: Multiple Instructors Course');
const multiInstructorCourse = new CourseBuilder(MODES.STRICT_SEO, true)
  .name("Digital Marketing Masterclass")
  .description("Comprehensive digital marketing course with multiple expert instructors")
  .provider("Marketing Pro Academy", "https://marketingproacademy.com")
  .instructor([
    {
      "@type": "Person",
      "name": "Lisa Thompson",
      "url": "https://marketingproacademy.com/instructors/lisa-thompson",
      "jobTitle": "SEO Specialist"
    },
    {
      "@type": "Person",
      "name": "David Park",
      "url": "https://marketingproacademy.com/instructors/david-park",
      "jobTitle": "Social Media Expert"
    },
    {
      "@type": "Person",
      "name": "Maria Garcia",
      "url": "https://marketingproacademy.com/instructors/maria-garcia",
      "jobTitle": "Content Marketing Manager"
    }
  ])
  .coursePrerequisites([
    "Basic marketing knowledge",
    "Understanding of social media platforms"
  ])
  .educationalLevel("Intermediate")
  .courseMode("Online")
  .timeRequired("P100H")
  .numberOfCredits(5)
  .educationalCredentialAwarded(
    "Digital Marketing Professional Certificate",
    "Comprehensive certificate in digital marketing strategies",
    "Professional Certificate"
  )
  .courseCode("DM-MASTER-2024")
  .teaches([
    "SEO Optimization",
    "Social Media Marketing",
    "Content Marketing",
    "Email Marketing",
    "Analytics and Reporting"
  ])
  .about([
    "Digital Marketing",
    "SEO",
    "Social Media",
    "Content Marketing",
    "Marketing Analytics"
  ])
  .audience("Student", "Marketing Professional")
  .offers(899, "USD", "InStock")
  .url("https://marketingproacademy.com/courses/digital-marketing-masterclass")
  .inLanguage("en-US")
  .keywords([
    "Digital Marketing",
    "SEO",
    "Social Media Marketing",
    "Content Marketing",
    "Marketing Analytics"
  ])
  .addCourseInstance("Online", "2024-07-01", "2024-09-30")
  .build();

console.log('Multiple Instructors Course:');
console.log(JSON.stringify(multiInstructorCourse, null, 2));
console.log('');

console.log('=== All Examples Completed ===');
console.log('Enhanced Course schema examples demonstrate:');
console.log('- Basic required properties compliance');
console.log('- Advanced recommended properties usage');
console.log('- Google Rich Results optimization');
console.log('- LLM optimization features');
console.log('- Standards header mode compliance');
console.log('- Multiple instructors support');
console.log('- Comprehensive course metadata');
