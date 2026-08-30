import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";

/**
 * Creates a new Ajv instance with specific configurations.
 * - `allErrors: true`: Enables reporting of all validation errors, not just the first one.
 * - `$data: true`: Allows the use of `$data` references in schemas, enabling dynamic validation.
 */
const ajv = new Ajv({ allErrors: true, $data: true });

/**
 * Adds format validation keywords to the Ajv instance.
 * This includes common formats like 'date', 'time', 'email', etc.
 */
addFormats(ajv);

/**
 * Adds error message customization to the Ajv instance.
 * This allows for more descriptive and user-friendly error messages.
 */
addErrors(ajv);

/**
 * Validates form data against a provided JSON schema.
 *
 * @param schema - The JSON schema to validate against.
 * @param data - The data to validate.
 * @returns An object indicating whether the data is valid and any validation errors.
 */
export function validateFormData(schema: object, data: unknown) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    return {
      isValid: false as const,
      errors: validate.errors,
    };
  }

  return {
    isValid: true as const,
    errors: null,
  };
}
