import { startServer } from '../../utils/index.js'
import schema from './schema.js'

startServer({ schema, name: 'inventory', port: 4002 })
