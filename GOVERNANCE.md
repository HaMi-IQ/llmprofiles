# Project Governance

This document outlines the governance structure and decision-making processes for the llmprofiles project.

## Project Overview

llmprofiles is an open-source project that provides standardized, validated schemas for common web content types that LLMs can reliably parse and understand. The project is maintained by HAMI and welcomes contributions from the community.

## Maintainers

### Core Maintainers
- **HAMI** - Project lead and primary maintainer
- **HAMI/maintainers** - Core development team

### Area Maintainers
- **HAMI/infra** - Infrastructure and CI/CD
- **HAMI/profiles** - Profile development and validation

## Decision Making

### Lazy Consensus
The project uses "lazy consensus" for most decisions:

1. **Proposal**: A maintainer proposes a change via issue or discussion
2. **Review Period**: 7 days for feedback from the community
3. **Implementation**: If no objections, the change proceeds
4. **Veto**: Any maintainer can veto with a clear explanation

### Voting Process
For major decisions (breaking changes, new major versions, governance changes):

1. **Discussion**: Extended discussion period (14+ days)
2. **Proposal**: Formal proposal with clear alternatives
3. **Vote**: Maintainers vote with 2/3 majority required
4. **Implementation**: Approved changes are implemented

## Release Process

### Versioning
- **Semantic Versioning**: Follows semver.org guidelines
- **Major Releases**: Breaking changes to APIs or schemas
- **Minor Releases**: New features, backward compatible
- **Patch Releases**: Bug fixes and documentation updates

### Release Process
1. **Feature Freeze**: 1 week before release
2. **Testing**: Comprehensive validation of all profiles
3. **Tagging**: Immutable git tags for releases
4. **Documentation**: Update CHANGELOG.md and documentation
5. **Deployment**: Automatic deployment via GitHub Actions

### Immutable Releases
- All releases are tagged and immutable
- No changes to released versions
- Bug fixes go into new patch releases
- Security fixes may warrant immediate patch releases

## Community Structure

### Contributors
- **New Contributors**: Welcome with mentorship and guidance
- **Regular Contributors**: Recognized for sustained contributions
- **Maintainers**: Trusted contributors with merge rights

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussion and questions
- **Pull Requests**: Code and documentation contributions
- **Security**: Private disclosure via security@llmprofiles.org

## Code of Conduct

The project follows the Contributor Covenant Code of Conduct. All participants are expected to:

- Be respectful and inclusive
- Provide constructive feedback
- Accept responsibility for mistakes
- Focus on community benefit

## Conflict Resolution

### Escalation Process
1. **Direct Discussion**: Parties discuss directly
2. **Mediation**: Maintainer mediates if needed
3. **Governance Review**: Full maintainer team reviews
4. **External Mediation**: If internal resolution fails

### Appeals Process
- Decisions can be appealed to the full maintainer team
- Appeals must include clear reasoning and evidence
- Final decisions rest with the project lead

## Project Goals

### Primary Goals
1. **Quality**: Maintain high-quality, validated schemas
2. **Usability**: Ensure profiles are easy to implement
3. **Compatibility**: Maintain backward compatibility
4. **Community**: Foster an inclusive, welcoming community

### Success Metrics
- Profile adoption and usage
- Community engagement and contributions
- Code quality and test coverage
- Documentation completeness and clarity

## Funding and Sustainability

### Funding Sources
- **GitHub Sponsors**: Individual and organizational sponsors
- **Open Collective**: Community funding platform
- **Direct Sponsorship**: Corporate and institutional support

### Resource Allocation
- Infrastructure costs (hosting, CI/CD)
- Development tools and services
- Community events and outreach
- Documentation and educational materials

## Transparency

### Decision Log
- All major decisions are documented
- Rationale and alternatives are recorded
- Community feedback is preserved

### Financial Transparency
- Funding sources are publicly disclosed
- Resource allocation is transparent
- Annual financial reports are published

## Future Governance

This governance structure may evolve based on:

- Project growth and community needs
- Lessons learned from experience
- Feedback from contributors and users
- Changes in the broader ecosystem

Proposed changes to governance require:
- Extended discussion period (30+ days)
- Clear rationale and alternatives
- Community feedback and consensus
- Maintainer team approval

---

**Last Updated**: 2025-08-28  
**Maintained by**: HAMI  
**Contact**: governance@llmprofiles.org
