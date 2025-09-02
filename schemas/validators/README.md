# Validation Schemas

This directory contains validation schemas and rules for the LLM profiles system.

## Purpose

Validation schemas ensure data quality and consistency across all profile types by defining:

- **Data constraints** - Required fields, data types, and value ranges
- **Business rules** - Domain-specific validation logic
- **Cross-field validation** - Relationships between different fields
- **Quality checks** - Completeness and accuracy validations

## Contents

- **SHACL shapes** - RDF validation constraints
- **JSON Schema validators** - JSON validation rules
- **Custom validators** - Profile-specific validation logic
- **Test data** - Validation test cases and examples

## Status

🚧 **Under Development** - This directory is being populated with comprehensive validation schemas.

## Usage

Validation schemas are used by:

- Profile creation tools
- Data import/export processes
- Quality assurance workflows
- API validation endpoints

## Contributing

When adding new validation schemas:

1. Follow the established validation patterns
2. Include comprehensive test cases
3. Document validation rules clearly
4. Ensure backward compatibility

## Related

- See `schemas/core/` for base schema definitions
- See `schemas/extensions/` for profile-specific schemas
- See individual profile directories for profile-specific validators
