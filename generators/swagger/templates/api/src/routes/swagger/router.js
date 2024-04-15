import express from 'express'
import openapi from 'openapi-comment-parser'
import swaggerUi from 'swagger-ui-express'
import config from '../../config/openapi.js'

const router = express.Router()

const openApiSpecification = openapi(config)

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(openApiSpecification))

export { router as swaggerRouter }
