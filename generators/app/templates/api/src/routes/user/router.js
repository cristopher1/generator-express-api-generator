import express from 'express'
import { simpleJsonSchemaValidation } from '../../schemas/json/index.js'

const router = express.Router()

/**
 * GET /api/v1/users/{userEmail}
 *
 * @tag API endpoints
 * @security BearerAuth
 * @summary Get an user by email
 * @pathParam {string} userEmail
 * @response 200 - Ok
 * @responseContent {User} 200.application/json
 * @response 401 - Unauthorized
 * @responseComponent {Unauthorized} 401
 * @response 404 - Not found
 * @responseComponent {NotFound} 404
 * @response 500 - Internal Server Error
 * @responseComponent {InternalServerError} 500
 */
router.get('/:userEmail', async (req, res) => {
  const { userEmail } = req.params

  const user = await req.orm.models.User.findOne({
    where: {
      email: userEmail,
    },
  })

  if (!user) {
    res.sendStatus(404)
    return
  }

  const { email, names, surnames } = user

  res.status(200)
  res.json({
    email,
    names,
    surnames,
  })
})

/**
 * PUT /api/v1/users/
 *
 * @tag API endpoints
 * @security BearerAuth
 * @summary Update user data
 * @bodyContent {UpdatedUser} application/json
 * @bodyRequired
 * @response 200 - Ok
 * @responseComponent {Ok} 200
 * @response 400 - Bad request
 * @responseExample {UpdatedUserBadRequestDetectedByJsonSchema} 400.application/json.UpdatedUserBadRequestDetectedByJsonSchema
 * @responseExample {UpdatedUserBadRequestDetectedBySequelizeValidation} 400.application/json.UpdatedUserBadRequestDetectedBySequelizeValidation
 * @response 401 - Unauthorized
 * @responseComponent {Unauthorized} 401
 * @response 500 - Internal Server Error
 * @responseComponent {InternalServerError} 500
 */
router.put(
  '/',
  async (req, res, next) => {
    const { body } = req

    simpleJsonSchemaValidation('updatedUser', body)

    req.updatedUser = { ...body }
    next()
  },
  async (req, res) => {
    const { email } = req.userInfo
    const { updatedUser } = req

    const user = await req.orm.models.User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      req.sendStatus(404)
      return
    }

    await user.update(updatedUser)

    req.sendStatus(201)
  },
)

export { router as userRouter }
