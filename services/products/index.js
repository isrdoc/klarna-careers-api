import { startServer } from '../../utils/index.js'
import schema from './schema.js'

startServer({ schema, name: 'products', port: 4003 })
