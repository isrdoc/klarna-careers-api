import { startServer } from '../../utils/index.js'
import schema from './schema.js'

startServer({ schema, name: 'accounts', port: 4001 })
