import express from 'express'
import bearerToken from 'express-bearer-token'
import logger from 'morgan'
import createHttpError from 'http-errors'
import 'express-async-errors'
import { orm } from './db/models/index.js'
import { apiRouter } from './routes/index.js'
import { ValidationError } from 'sequelize'
import { RequestValidationError } from './schemas/json/index.js'

const environment = process.env.NODE_ENV

// Api constructor
const api = express()

api.use(logger('dev'))
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use(bearerToken())

// Adds orm in req object.
api.use(async (req, res, next) => {
  req.orm = orm
  next()
})

// Routing middleware
api.use('/api/v1', apiRouter)

api.use(async (req, res, next) => {
  next(createHttpError(404))
})

// Handler error
api.use(async (err, req, res, next) => {
  if (err instanceof ValidationError || err instanceof RequestValidationError) {
    res.status(400)
    res.json({
      errors: err.errors,
    })
  } else if (err && err.status) {
    res.sendStatus(err.status)
  } else if (err && !err.status) {
    res.sendStatus(500)
  }

  if (environment === 'development') {
    console.error(err)
  }
})

export default api
