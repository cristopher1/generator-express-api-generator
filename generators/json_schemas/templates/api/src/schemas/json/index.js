import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Ajv from 'ajv'
import ajvErrors from 'ajv-errors'
import ajvFormats from 'ajv-formats'
import globs from 'globs'

/** @typedef {import('../../types/types.d.ts').JsonSchema} JsonSchema */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Gets the JSON Schemas file paths
 *
 * @param {string} dirname The directory where the JSON Schemas file are
 *   searched
 * @param {string} format The extension of the file
 * @returns {string[]} The array with the JSON Schemas file paths
 */
const getSchemaFilePaths = (dirname, format) => {
  return globs.sync(`${dirname}/**/*${format}`)
}

/**
 * Transforms a string to capitalize
 *
 * @param {string} value The value to transform
 * @returns {string} String transformed
 */
const capitalize = (value) => value.charAt().toUpperCase() + value.slice(1)

/**
 * Formats the JSON Schema name
 *
 * @param {string} schemaName JSON Schema file name
 * @param {string} format The extension of the file
 * @returns {string} JSON Schema file name formatted
 */
const formatSchemaName = (schemaName, format) => {
  const schemaNameWithoutExtension = schemaName.replace(`${format}`, '')
  const schemaNameComponents = schemaNameWithoutExtension.split('_')
  const schemaNameformatComponents = schemaNameComponents.map(
    (value, index) => {
      const lowerValue = value.toLowerCase()
      if (index === 0) {
        return lowerValue
      }
      return capitalize(lowerValue)
    },
  )
  return schemaNameformatComponents.join('')
}

/**
 * Obtains the JSON Schema name. The JSON Schema name is formatted
 *
 * @param {string} filePath The JSON Schema filePath
 * @param {string} format The extension of the file
 * @returns {string} JSON Schema name
 */
const getSchemaName = (filePath, format) => {
  const basename = path.basename(filePath)
  return formatSchemaName(basename, format)
}

/**
 * Gets a JSON Schema validator configure with plugins
 *
 * @param {Avj} validator The JSON Schema validator without plugins
 * @returns {Avj} The JSON Schema validator with plugins
 */
const getValidatorSchema = (validator) => {
  let extendedValidator = ajvErrors(validator)
  extendedValidator = ajvFormats(validator)
  return extendedValidator
}

/**
 * Loads JSON Schemas and the validator object
 *
 * @param {string} dirname The directory where the JSON Schemas file are
 * @param {string} [format=.json] The extension of the file. Default is `.json`
 * @returns {Promise<JsonSchema>} Returns a promise, when the promise is
 *   fulfilled, the promise returns the orm object that contains database
 *   connection and orm models
 */
const loadSchemas = async (dirname, format = '.json') => {
  const jsonSchema = {}

  jsonSchema.validator = getValidatorSchema(new Ajv({ allErrors: true }))
  jsonSchema.schemas = {}

  const schemaFilePaths = getSchemaFilePaths(dirname, format)

  for (const filePath of schemaFilePaths) {
    const fileUrl = path.resolve(filePath)
    const schemaName = getSchemaName(fileUrl, format)
    const schema = JSON.parse(fs.readFileSync(fileUrl))
    jsonSchema.schemas[schemaName] = schema
  }

  return jsonSchema
}

/**
 * Used to throw an error when the request is invalid. Used by
 * simpleJsonSchemaValidation
 */
export class RequestValidationError extends Error {
  #errors

  constructor(errors) {
    super()
    this.#errors = errors
  }

  get errors() {
    return this.#errors
  }
}

/**
 * Creates simpleJsonSchemaValidation function
 *
 * @param {JsonSchema} jsonSchema
 * @returns {(schemaName: string, data: any) => void} A function that validate
 *   data using a schema name.
 */
const createSimpleJsonSchemaValidation = (jsonSchema) => {
  const simpleJsonSchemaValidation = (schemaName, data) => {
    const { validator } = jsonSchema
    const schema = jsonSchema.schemas[schemaName]

    const isValid = validator.validate(schema, data)

    if (!isValid) {
      throw new RequestValidationError(validator.errors)
    }
  }

  return simpleJsonSchemaValidation
}

export const jsonSchema = await loadSchemas(dirname)

/**
 * Validates data using a certain scheme. If the data is invalid, a
 * RequestValidationError is threw
 *
 * @example
 *   const { body } = ctx.request
 *   try {
 *     simpleJsonSchemaValidation('newUser', body)
 *   } catch (error) {
 *     console.log(error)
 *   }
 *
 * @param {string} schemaName Schema name associate a JSON schema
 * @param {any} data Data to validate
 */
export const simpleJsonSchemaValidation =
  createSimpleJsonSchemaValidation(jsonSchema)
