import express from 'express'
import { tokenRouter } from './authentication/tokenRouter.js'
import { authenticationRouter } from './authentication/authenticationRouter.js'
import { registerRouter } from './user/registerRouter.js'
import { userRouter } from './user/router.js'
import { swaggerRouter } from './swagger/router.js'

const environment = process.env.NODE_ENV

const router = express.Router()

if (environment !== 'production') {
  router.use('/docs', swaggerRouter)
}

router.use('/users/register', registerRouter)
router.use('/tokens', tokenRouter)
router.use(authenticationRouter)
router.use('/users', userRouter)

export { router as apiRouter }
