# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of llmprofiles seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Private Disclosure

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to **security@llmprofiles.org**.

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- **Type of issue** (buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths of source file(s) related to the vulnerability**
- **The location of the affected source code** (tag/branch/commit or direct URL)
- **Any special configuration required to reproduce the issue**
- **Step-by-step instructions to reproduce the issue**
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the issue**, including how an attacker might exploit it

### What to Expect

1. **Acknowledgment**: You will receive an acknowledgment within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its severity
3. **Timeline**: We will provide a timeline for fixing the issue
4. **Updates**: You will receive regular updates on our progress
5. **Resolution**: Once fixed, we will notify you and credit you in our security advisory

## Security Process

### Vulnerability Assessment

We assess vulnerabilities using the following criteria:

- **CVSS Score**: We use the Common Vulnerability Scoring System (CVSS) v3.0
- **Impact**: Potential damage to users or systems
- **Exploitability**: How easy it is to exploit the vulnerability
- **Scope**: Whether the vulnerability affects all users or specific configurations

### Response Timeline

Our response timeline depends on the severity of the vulnerability:

| Severity | Response Time | Fix Timeline |
|----------|---------------|--------------|
| Critical (9.0-10.0) | 24 hours | 7 days |
| High (7.0-8.9) | 48 hours | 14 days |
| Medium (4.0-6.9) | 72 hours | 30 days |
| Low (0.1-3.9) | 1 week | 90 days |

### Disclosure Process

1. **Private Fix**: We develop and test the fix privately
2. **Coordinated Disclosure**: We coordinate with the reporter on disclosure timing
3. **Public Advisory**: We publish a security advisory with:
   - Description of the vulnerability
   - CVSS score and vector
   - Affected versions
   - Fix information
   - Credit to the reporter (if desired)
4. **Release**: We release the fixed version

## Security Best Practices

### For Contributors

- **Code Review**: All code changes are reviewed for security issues
- **Dependency Scanning**: We regularly scan for vulnerable dependencies
- **Input Validation**: All user inputs are properly validated
- **Output Encoding**: All outputs are properly encoded to prevent injection attacks

### For Users

- **Keep Updated**: Always use the latest stable version
- **Validate Inputs**: Validate all inputs before processing
- **Use HTTPS**: Always use HTTPS in production environments
- **Monitor Logs**: Monitor application logs for suspicious activity

## Security Contacts

- **Security Team**: security@llmprofiles.org
- **PGP Key**: Available upon request
- **Response Time**: 48 hours maximum

## Security Hall of Fame

We gratefully acknowledge security researchers who have responsibly disclosed vulnerabilities:

- [To be populated as vulnerabilities are reported and fixed]

## Bug Bounty

Currently, we do not offer a formal bug bounty program. However, we do:

- Credit security researchers in our advisories
- Provide recognition for significant contributions
- Consider special recognition for critical vulnerabilities

## Responsible Disclosure

We follow responsible disclosure practices:

1. **Private Reporting**: Vulnerabilities are reported privately first
2. **Coordinated Release**: We coordinate with reporters on disclosure timing
3. **Credit**: We credit researchers who responsibly disclose issues
4. **No Retaliation**: We do not take action against researchers who follow our policy

## Security Updates

- **Security Advisories**: Published on GitHub Security Advisories
- **Release Notes**: Security fixes are documented in release notes
- **CVE Numbers**: We request CVE numbers for significant vulnerabilities
- **Notifications**: Users are notified via GitHub releases and documentation

---

**Last Updated**: 2025-08-28  
**Maintained by**: HAMI Security Team  
**Contact**: security@llmprofiles.org
