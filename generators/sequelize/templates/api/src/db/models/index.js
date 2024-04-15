import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize'
import config from '../../config/database.js'

/** @typedef {import('sequelize').DataTypes} DataTypes */
/** @typedef {import('sequelize').Sequelize} Sequelize */
/** @typedef {import('../../types/types.d.ts').Orm} Orm */

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const basename = path.basename(filename)

let sequelize
if (config.urlConnection) {
  sequelize = new Sequelize(config.urlConnection)
} else {
  const { database, username, password, host, port, dialect } = config
  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect,
  })
}

/**
 * Get the name of all files ubicated in models directory.
 *
 * @param {string} dirname The dirname were index.js file is ubicated
 * @param {string} basename The name of the index.js file
 * @returns {string[]} The name of all files ubicated in models directory, these
 *   files contains Sequelize models.
 */
const getModelFileNames = (dirname, basename) => {
  const modelFileNames = fs.readdirSync(dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    )
  })
  return modelFileNames
}

/**
 * @param {string} dirname The dirname were index.js file is ubicated
 * @param {string} basename The name of the index.js file
 * @param {Sequelize} sequelize The sequelize object used to connect to the
 *   database
 * @param {DataTypes} sequelizeDataTypes The data types used by sequelize models
 * @returns {Promise<Orm>} Returns a promise, when the promise is fulfilled, the
 *   promise returns the orm object that contains database connection and orm
 *   models
 */
const loadOrm = async (dirname, basename, sequelize, sequelizeDataTypes) => {
  /** @type {Orm} */
  const orm = {}

  orm.db = {}
  orm.models = {}

  const modelFileNames = getModelFileNames(dirname, basename)

  for (const file of modelFileNames) {
    const filePath = path.join(dirname, file)
    const fileUrl = path.resolve(filePath)
    const { default: buildModel } = await import(fileUrl)
    const model = buildModel(sequelize, sequelizeDataTypes)
    orm.models[model.name] = model
  }

  Object.keys(orm.models).forEach((modelName) => {
    if (orm.models[modelName].associate) {
      orm.models[modelName].associate(orm.models)
    }
  })

  orm.db.sequelize = sequelize
  orm.db.Sequelize = Sequelize

  return orm
}

/** @type {Orm} */
export const orm = await loadOrm(
  dirname,
  basename,
  sequelize,
  Sequelize.DataTypes,
)
