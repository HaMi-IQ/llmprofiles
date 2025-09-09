/**
 * Enhanced JobPosting Examples
 * Following the strict methodology from SCHEMA_ENHANCEMENT_IMPLEMENTATION_GUIDE.md
 * 
 * This file demonstrates all scenarios for JobPosting schema implementation:
 * 1. Basic Enhanced Schema - All new required properties
 * 2. Advanced Schema - All optional properties
 * 3. Google Rich Results Optimized - SEO-focused implementation
 * 4. LLM Optimized - AI-focused implementation
 * 5. Standards Header Mode - Standards-compliant implementation
 */

const { JobPostingBuilder } = require('../lib/builder');

console.log('=== Enhanced JobPosting Examples ===\n');

// Example 1: Basic Enhanced Schema - All new required properties
console.log('1. Basic Enhanced Schema - All new required properties');
const basicJobPosting = new JobPostingBuilder()
  .title("Software Engineer")
  .description("<p>We are seeking a Software Engineer to join our development team. You will work on building scalable web applications using modern technologies.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("Tech Innovations Inc.", "https://www.techinnovations.com")
  .jobLocation("123 Innovation Drive", "San Francisco", "CA", "US")
  .build();

console.log(JSON.stringify(basicJobPosting, null, 2));
console.log('\n---\n');

// Example 2: Advanced Schema - All optional properties
console.log('2. Advanced Schema - All optional properties');
const advancedJobPosting = new JobPostingBuilder()
  .title("Senior Full-Stack Developer")
  .description("<p>Join our engineering team as a Senior Full-Stack Developer. You will lead the development of our next-generation platform and mentor junior developers.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("Tech Innovations Inc.", "https://www.techinnovations.com", "https://www.techinnovations.com/logo.png")
  .jobLocation("123 Innovation Drive", "San Francisco", "CA", "US")
  .employmentType("FULL_TIME")
  .validThrough("2025-02-15")
  .baseSalary(140000, "USD", "YEAR", 130000, 150000)
  .skills(["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"])
  .qualifications("Bachelor's degree in Computer Science or equivalent experience")
  .responsibilities("Lead development projects, mentor team members, architect scalable solutions")
  .experienceRequirements("5+ years of full-stack development experience")
  .educationRequirements("Bachelor's degree in Computer Science or related field")
  .benefits("Comprehensive health insurance, 401k matching, flexible PTO, learning budget")
  .workHours("40 hours per week, flexible schedule")
  .applicationContact("careers@techinnovations.com", "recruiter", "+1-555-0123")
  .url("https://www.techinnovations.com/careers/senior-full-stack-developer")
  .industry("Technology")
  .occupationalCategory("Software Developer")
  .jobBenefits("Health, dental, vision insurance; 401k; stock options")
  .specialCommitments("Equal opportunity employer")
  .incentiveCompensation("Performance bonuses, stock options")
  .jobImmediateStart(false)
  .jobStartDate("2025-03-01")
  .securityClearanceRequirement("None required")
  .employmentUnit("Engineering")
  .jobTitle("Senior Full-Stack Developer")
  .alternativeHeadline("Lead Developer Position")
  .workPerformed("Full-stack web development, system architecture, team leadership")
  .build();

console.log(JSON.stringify(advancedJobPosting, null, 2));
console.log('\n---\n');

// Example 3: Google Rich Results Optimized - SEO-focused implementation
console.log('3. Google Rich Results Optimized - SEO-focused implementation');
const seoOptimizedJobPosting = new JobPostingBuilder()
  .title("Senior Software Engineer - Remote")
  .description("<p><strong>Join our remote-first engineering team!</strong> We're looking for a Senior Software Engineer to help build our next-generation platform. This is a fully remote position with competitive compensation and excellent benefits.</p><ul><li>Work with cutting-edge technologies</li><li>Collaborate with a distributed team</li><li>Make a real impact on our product</li></ul>")
  .datePosted("2025-01-15")
  .hiringOrganization("Remote Tech Co.", "https://www.remotetech.com", "https://www.remotetech.com/logo.png")
  .jobLocation("Remote", null, null, "US")
  .jobLocationType("TELECOMMUTE")
  .applicantLocationRequirements("United States")
  .employmentType("FULL_TIME")
  .validThrough("2025-02-15")
  .baseSalary(120000, "USD", "YEAR", 110000, 130000)
  .directApply(true)
  .skills(["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "Kubernetes"])
  .qualifications("5+ years of software development experience with modern web technologies")
  .responsibilities("Develop and maintain web applications, collaborate with cross-functional teams, participate in code reviews")
  .experienceRequirements("5+ years of professional software development experience")
  .educationRequirements("Bachelor's degree in Computer Science or equivalent experience")
  .benefits("Health insurance, dental, vision, 401k matching, unlimited PTO, home office stipend")
  .workHours("40 hours per week, flexible schedule")
  .applicationContact("jobs@remotetech.com", "recruiter")
  .url("https://www.remotetech.com/careers/senior-software-engineer-remote")
  .industry("Technology")
  .occupationalCategory("Software Developer")
  .build();

console.log(JSON.stringify(seoOptimizedJobPosting, null, 2));
console.log('\n---\n');

// Example 4: LLM Optimized - AI-focused implementation
console.log('4. LLM Optimized - AI-focused implementation');
const llmOptimizedJobPosting = new JobPostingBuilder()
  .title("Machine Learning Engineer")
  .description("<p>We are seeking a Machine Learning Engineer to join our AI team. You will be responsible for developing and deploying machine learning models that power our intelligent systems.</p><h3>Key Responsibilities:</h3><ul><li>Design and implement ML models</li><li>Optimize model performance</li><li>Collaborate with data scientists and engineers</li></ul><h3>Required Skills:</h3><ul><li>Python programming</li><li>Machine learning frameworks (TensorFlow, PyTorch)</li><li>Data analysis and visualization</li></ul>")
  .datePosted("2025-01-15")
  .hiringOrganization("AI Solutions Corp.", "https://www.aisolutions.com", "https://www.aisolutions.com/logo.png")
  .jobLocation("456 AI Boulevard", "Seattle", "WA", "US")
  .employmentType("FULL_TIME")
  .validThrough("2025-02-15")
  .baseSalary(150000, "USD", "YEAR", 140000, 160000)
  .skills([
    "Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", 
    "Scikit-learn", "Pandas", "NumPy", "SQL", "AWS", "Docker", "Kubernetes"
  ])
  .qualifications("Master's degree in Computer Science, Machine Learning, or related field with 3+ years of ML experience")
  .responsibilities("Develop ML models, optimize algorithms, deploy models to production, collaborate with cross-functional teams")
  .experienceRequirements("3+ years of machine learning engineering experience with production systems")
  .educationRequirements("Master's degree in Computer Science, Machine Learning, or related field")
  .benefits("Comprehensive health coverage, 401k matching, stock options, learning budget, conference attendance")
  .workHours("40 hours per week")
  .applicationContact("ml-jobs@aisolutions.com", "recruiter")
  .url("https://www.aisolutions.com/careers/machine-learning-engineer")
  .industry("Artificial Intelligence")
  .occupationalCategory("Machine Learning Engineer")
  .jobBenefits("Health, dental, vision, 401k, stock options, learning budget")
  .specialCommitments("Diversity and inclusion focused")
  .incentiveCompensation("Performance bonuses, stock options, patent bonuses")
  .jobImmediateStart(false)
  .jobStartDate("2025-03-01")
  .employmentUnit("AI Engineering")
  .jobTitle("Machine Learning Engineer")
  .alternativeHeadline("AI Engineer Position")
  .workPerformed("Machine learning model development, algorithm optimization, production deployment")
  .build();

console.log(JSON.stringify(llmOptimizedJobPosting, null, 2));
console.log('\n---\n');

// Example 5: Standards Header Mode - Standards-compliant implementation
console.log('5. Standards Header Mode - Standards-compliant implementation');
const standardsCompliantJobPosting = new JobPostingBuilder('standards-header')
  .title("DevOps Engineer")
  .description("<p>We are looking for a DevOps Engineer to join our infrastructure team. You will be responsible for maintaining and improving our cloud infrastructure and deployment pipelines.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("Cloud Infrastructure Inc.", "https://www.cloudinfra.com")
  .jobLocation("789 Cloud Street", "Austin", "TX", "US")
  .employmentType("FULL_TIME")
  .validThrough("2025-02-15")
  .baseSalary(130000, "USD", "YEAR")
  .skills(["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Python", "Bash"])
  .qualifications("Bachelor's degree in Computer Science or equivalent experience")
  .responsibilities("Maintain cloud infrastructure, automate deployments, monitor system performance")
  .experienceRequirements("3+ years of DevOps or infrastructure experience")
  .educationRequirements("Bachelor's degree in Computer Science or related field")
  .benefits("Health insurance, 401k, flexible PTO")
  .workHours("40 hours per week")
  .applicationContact("devops-jobs@cloudinfra.com", "recruiter")
  .url("https://www.cloudinfra.com/careers/devops-engineer")
  .build();

console.log(JSON.stringify(standardsCompliantJobPosting, null, 2));
console.log('\n---\n');

// Example 6: Part-time job posting
console.log('6. Part-time job posting');
const partTimeJobPosting = new JobPostingBuilder()
  .title("Part-time Frontend Developer")
  .description("<p>We are looking for a part-time Frontend Developer to help with our website redesign project. This is a contract position with flexible hours.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("Web Design Studio", "https://www.webdesignstudio.com")
  .jobLocation("Remote", null, null, "US")
  .jobLocationType("TELECOMMUTE")
  .employmentType("PART_TIME")
  .validThrough("2025-02-15")
  .baseSalary(50, "USD", "HOUR")
  .skills(["HTML", "CSS", "JavaScript", "React", "Figma"])
  .qualifications("2+ years of frontend development experience")
  .responsibilities("Develop responsive web pages, collaborate with design team, implement UI components")
  .experienceRequirements("2+ years of frontend development experience")
  .educationRequirements("Associate degree or equivalent experience")
  .benefits("Flexible schedule, remote work")
  .workHours("20 hours per week, flexible schedule")
  .applicationContact("frontend-jobs@webdesignstudio.com", "recruiter")
  .url("https://www.webdesignstudio.com/careers/part-time-frontend-developer")
  .industry("Web Design")
  .occupationalCategory("Web Developer")
  .build();

console.log(JSON.stringify(partTimeJobPosting, null, 2));
console.log('\n---\n');

// Example 7: Internship position
console.log('7. Internship position');
const internshipJobPosting = new JobPostingBuilder()
  .title("Software Engineering Intern")
  .description("<p>Join our engineering team as a Software Engineering Intern. This is a great opportunity to gain hands-on experience with real-world projects and learn from experienced developers.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("StartupTech Inc.", "https://www.startuptech.com")
  .jobLocation("321 Startup Avenue", "Boston", "MA", "US")
  .employmentType("INTERN")
  .validThrough("2025-02-15")
  .baseSalary(25, "USD", "HOUR")
  .skills(["Python", "JavaScript", "Git", "SQL"])
  .qualifications("Currently enrolled in Computer Science or related program")
  .responsibilities("Assist with software development, participate in code reviews, learn best practices")
  .experienceRequirements("Some programming experience preferred")
  .educationRequirements("Currently enrolled in Computer Science or related program")
  .benefits("Mentorship, learning opportunities, networking")
  .workHours("20-30 hours per week")
  .applicationContact("internships@startuptech.com", "recruiter")
  .url("https://www.startuptech.com/careers/software-engineering-intern")
  .industry("Technology")
  .occupationalCategory("Software Developer")
  .jobImmediateStart(false)
  .jobStartDate("2025-06-01")
  .employmentUnit("Engineering")
  .build();

console.log(JSON.stringify(internshipJobPosting, null, 2));
console.log('\n---\n');

// Example 8: Contract position
console.log('8. Contract position');
const contractJobPosting = new JobPostingBuilder()
  .title("Senior React Developer - Contract")
  .description("<p>We need a Senior React Developer for a 6-month contract to help us build our new customer portal. This is a high-impact project with a great team.</p>")
  .datePosted("2025-01-15")
  .hiringOrganization("FinTech Solutions", "https://www.fintechsolutions.com")
  .jobLocation("555 Finance Plaza", "New York", "NY", "US")
  .employmentType("CONTRACTOR")
  .validThrough("2025-02-15")
  .baseSalary(80, "USD", "HOUR")
  .skills(["React", "TypeScript", "Redux", "Jest", "Webpack", "Node.js"])
  .qualifications("5+ years of React development experience")
  .responsibilities("Develop React components, implement state management, write tests, collaborate with backend team")
  .experienceRequirements("5+ years of React development experience")
  .educationRequirements("Bachelor's degree in Computer Science or equivalent experience")
  .benefits("Competitive hourly rate, flexible schedule")
  .workHours("40 hours per week")
  .applicationContact("contract-jobs@fintechsolutions.com", "recruiter")
  .url("https://www.fintechsolutions.com/careers/senior-react-developer-contract")
  .industry("Financial Technology")
  .occupationalCategory("Software Developer")
  .jobImmediateStart(true)
  .employmentUnit("Engineering")
  .build();

console.log(JSON.stringify(contractJobPosting, null, 2));
console.log('\n---\n');

console.log('=== Example Summary ===');
console.log('1. Basic Enhanced Schema - Minimal required properties');
console.log('2. Advanced Schema - All optional properties included');
console.log('3. Google Rich Results Optimized - SEO-focused with rich content');
console.log('4. LLM Optimized - AI-focused with detailed skills and requirements');
console.log('5. Standards Header Mode - Standards-compliant implementation');
console.log('6. Part-time job posting - Flexible work arrangement');
console.log('7. Internship position - Entry-level opportunity');
console.log('8. Contract position - Temporary project-based role');
console.log('\nAll examples follow Google Rich Results requirements and LLM optimization best practices.');
