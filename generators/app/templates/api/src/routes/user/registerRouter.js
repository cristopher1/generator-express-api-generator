import express from 'express'
import { simpleJsonSchemaValidation } from '../../schemas/json/index.js'

const router = express.Router()

/**
 * POST /api/v1/users/register
 *
 * @tag API endpoints
 * @summary Register an user
 * @bodyContent {NewUser} application/json
 * @bodyRequired
 * @response 201 - Created
 * @responseComponent {Created} 201
 * @response 400 - Bad request
 * @responseExample {NewUserBadRequestDetectedByJsonSchema} 400.application/json.NewUserBadRequestDetectedByJsonSchema
 * @responseExample {NewUserBadRequestDetectedBySequelizeValidation} 400.application/json.NewUserBadRequestDetectedBySequelizeValidation
 * @response 500 - Internal Server Error
 * @responseComponent {InternalServerError} 500
 */
router.post(
  '/',
  // Validate the request using JSON Schema
  async (req, res, next) => {
    const { body } = req

    simpleJsonSchemaValidation('newUser', body)

    req.user = { ...body }
    next()
  },
  async (req, res) => {
    const { user } = req

    await req.orm.models.User.create(user)

    res.sendStatus(201)
  },
)

export { router as registerRouter }
