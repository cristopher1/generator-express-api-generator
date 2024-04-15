import api from './api.js'
import { orm } from './db/models/index.js'

const port = process.env.PORT || 3000

try {
  await orm.db.sequelize.authenticate()
  console.log('Connection to the database has been established successfully.')

  api.listen(port, (err) => {
    if (err) {
      return console.error('Failed', err)
    }
    console.log(`Listening on port ${port}`)
    return api
  })
} catch (err) {
  console.error(err)
}
