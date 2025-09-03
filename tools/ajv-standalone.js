// Standalone AJV-like validator for localhost development
// This provides basic JSON Schema validation without external dependencies

window.AJVStandalone = (function() {
    'use strict';

    function AJV(options) {
        this.options = options || {};
        this.errors = [];
    }

    AJV.prototype.compile = function(schema) {
        const self = this;
        
        return function validate(data) {
            self.errors = [];
            
            try {
                const isValid = validateData(data, schema, '', self.errors);
                validate.errors = self.errors;
                return isValid;
            } catch (error) {
                self.errors.push({
                    message: 'Validation error: ' + error.message,
                    instancePath: '',
                    data: data
                });
                validate.errors = self.errors;
                return false;
            }
        };
    };

    function validateData(data, schema, path, errors) {
        let isValid = true;

        // Type validation
        if (schema.type) {
            const actualType = getType(data);
            if (actualType !== schema.type) {
                if (!(schema.type === 'array' && Array.isArray(data))) {
                    errors.push({
                        message: `should be ${schema.type}`,
                        instancePath: path,
                        data: data
                    });
                    isValid = false;
                }
            }
        }

        // Required fields validation
        if (schema.required && Array.isArray(schema.required)) {
            for (const field of schema.required) {
                if (!data || data[field] === undefined || data[field] === null) {
                    errors.push({
                        message: `must have required property '${field}'`,
                        instancePath: path,
                        data: data
                    });
                    isValid = false;
                }
            }
        }

        // Properties validation
        if (schema.properties && data && typeof data === 'object') {
            for (const prop in schema.properties) {
                if (data[prop] !== undefined) {
                    const propPath = path ? `${path}/${prop}` : `/${prop}`;
                    if (!validateData(data[prop], schema.properties[prop], propPath, errors)) {
                        isValid = false;
                    }
                }
            }
        }

        // Array validation
        if (schema.type === 'array' && Array.isArray(data)) {
            // minItems validation
            if (schema.minItems !== undefined && data.length < schema.minItems) {
                errors.push({
                    message: `should NOT have fewer than ${schema.minItems} items`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }

            // maxItems validation
            if (schema.maxItems !== undefined && data.length > schema.maxItems) {
                errors.push({
                    message: `should NOT have more than ${schema.maxItems} items`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }

            // Items validation
            if (schema.items) {
                for (let i = 0; i < data.length; i++) {
                    const itemPath = `${path}/${i}`;
                    if (!validateData(data[i], schema.items, itemPath, errors)) {
                        isValid = false;
                    }
                }
            }
        }

        // String validation
        if (schema.type === 'string' && typeof data === 'string') {
            // minLength validation
            if (schema.minLength !== undefined && data.length < schema.minLength) {
                errors.push({
                    message: `should NOT be shorter than ${schema.minLength} characters`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }

            // maxLength validation
            if (schema.maxLength !== undefined && data.length > schema.maxLength) {
                errors.push({
                    message: `should NOT be longer than ${schema.maxLength} characters`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }

            // Format validation (basic)
            if (schema.format) {
                if (!validateFormat(data, schema.format)) {
                    errors.push({
                        message: `should match format "${schema.format}"`,
                        instancePath: path,
                        data: data
                    });
                    isValid = false;
                }
            }
        }

        // Const validation
        if (schema.const !== undefined) {
            if (data !== schema.const) {
                errors.push({
                    message: `should be equal to constant`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }
        }

        // AnyOf validation
        if (schema.anyOf && Array.isArray(schema.anyOf)) {
            let anyValid = false;
            for (const subSchema of schema.anyOf) {
                const tempErrors = [];
                if (validateData(data, subSchema, path, tempErrors)) {
                    anyValid = true;
                    break;
                }
            }
            if (!anyValid) {
                errors.push({
                    message: `should match some schema in anyOf`,
                    instancePath: path,
                    data: data
                });
                isValid = false;
            }
        }

        return isValid;
    }

    function getType(value) {
        if (value === null) return 'null';
        if (Array.isArray(value)) return 'array';
        return typeof value;
    }

    function validateFormat(value, format) {
        switch (format) {
            case 'uri':
                try {
                    new URL(value);
                    return true;
                } catch {
                    return /^https?:\/\/.+/.test(value);
                }
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'date':
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            case 'date-time':
                return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value);
            default:
                return true; // Unknown formats pass
        }
    }

    // Export the constructor
    return AJV;
})();

// Set up window.ajv for compatibility
if (!window.ajv) {
    window.ajv = {
        default: window.AJVStandalone
    };
    console.log('✅ AJV Standalone validator loaded for localhost development');
}

// Also add formats support
window.addFormats = window.addFormats || function(ajv) {
    console.log('✅ Format validation enabled');
    return ajv;
};
