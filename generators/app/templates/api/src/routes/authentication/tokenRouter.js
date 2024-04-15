import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config/jwt.js'
import { simpleJsonSchemaValidation } from '../../schemas/json/index.js'

/** @typedef {import('../../types/types.d.ts').Orm} Orm */

const { JWTSecret, JWTAlgorithm } = config

/**
 * Get user information from database
 *
 * @param {string} email User email
 * @param {string} password User password
 * @param {Orm} orm Orm object
 * @returns {Promise<any>} Returns a promise, when the promise is fulfilled, the
 *   promise returns the user information.
 */
const getUserInfo = async (email, password, orm) => {
  const user = await orm.models.User.findOne({
    attributes: ['email', 'names', 'surnames'],
    where: {
      email,
      password,
    },
  })
  const userInfo = user.dataValues
  return userInfo
}

/** @type {import('express').RequestHandler} */
const obtainToken = async (req, res) => {
  const { email, password } = req.body
  const userInfo = await getUserInfo(email, password, req.orm)
  const token = jwt.sign(userInfo, JWTSecret, { algorithm: JWTAlgorithm })
  res.status(200)
  res.json({
    token,
  })
}

const router = express.Router()

/**
 * POST /api/v1/tokens/
 *
 * @tag API endpoints
 * @summary Create a JSON Web Token
 * @bodyContent {CreateJSONWebToken} application/json
 * @bodyRequired
 * @response 200 - Ok
 * @responseContent {Token} 200.application/json
 * @responseExample {UsernameTokenExample} 200.application/json.UsernameTokenExample
 * @response 400 - Bad request
 * @responseExample {CreateTokenBadRequestDetectedByJsonSchema} 400.application/json.CreateTokenBadRequestDetectedByJsonSchema
 * @response 500 - Internal Server Error
 * @responseComponent {InternalServerError} 500
 */
router.post(
  '/',
  async (req, res, next) => {
    const { body } = req

    simpleJsonSchemaValidation('createToken', body)

    next()
  },
  obtainToken,
)

export { router as tokenRouter }
