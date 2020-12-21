import { startServer } from '../../utils/index.js'
import schema from './schema.js'

startServer({ schema, name: 'reviews', port: 4004 })
