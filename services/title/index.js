import { startServer } from '../../utils/index.js'
import schema from './schema.js'
import services from '../../services/index.js'

const SERVICE_NAME = 'title'

const service = services.find((service) => service.name === SERVICE_NAME)
const { name, port } = service

startServer({ schema, name, port })
