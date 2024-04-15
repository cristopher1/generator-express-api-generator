import Ajv from 'ajv'
import { Sequelize, Model, ModelStatic } from 'sequelize'

class DatabaseConnection {
  // Connection to database. Instance of Sequelize class.
  sequelize: Sequelize
  // Sequelize class
  Sequelize: Sequelize
}

// When you add more models into db/models, add a new property into this class
class ModelStorage {
  // This property corresponds to User instance for Sequelize Model ubicated in the file db/models/user.js
  User: ModelStatic<Model>
}

export class Orm {
  db: DatabaseConnection
  models: ModelStorage
}

class SchemaStorage {
  createToken: Object
  newUser: Object
  updatedUser: Object
}

export class JsonSchema {
  validator: Ajv
  schemas: SchemaStorage
}
