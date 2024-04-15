import express from 'express'
import jwt from 'jsonwebtoken'
import config from '../../config/jwt.js'

const { JWTSecret, JWTAlgorithm } = config

/** @type {import('express').RequestHandler} */
const isAuthenticated = async (req, res, next) => {
  const { token } = req
  if (!token) {
    res.sendStatus(401)
    return
  }

  const userInfo = jwt.verify(token, JWTSecret, {
    algorithm: JWTAlgorithm,
  })

  if (userInfo) {
    req.userInfo = userInfo
    next()
  } else {
    res.sendStatus(401)
  }
}

const router = express.Router()

router.use(isAuthenticated)

export { router as authenticationRouter }
