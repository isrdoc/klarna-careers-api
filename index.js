import { stitchSchemas } from '@graphql-tools/stitch'
import { buildSchema } from 'graphql'
import { startServer, makeRemoteExecutor } from './utils/index.js'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
const { stitchingDirectivesTransformer } = stitchingDirectives()

import services from './services.js'

const SERVICE_TIMEOUT = 300

const gatewayService = {
  name: 'gateway',
  port: 4000,
}

const makeGatewaySchema = async () => {
  const serviceExecutors = services.map(({ port }) =>
    makeRemoteExecutor({ url: `http://localhost:${port}/graphql` }),
  )

  const subschemas = await Promise.all(
    serviceExecutors.map((executor) => makeSubschema({ executor })),
  )

  const stitchConfig = {
    subschemaConfigTransforms: [stitchingDirectivesTransformer],
    subschemas,
  }

  return stitchSchemas(stitchConfig)
}

const makeSubschema = async ({ executor }) => ({
  executor,
  schema: await new Promise((resolve, reject) => {
    const fetchSchema = async (attempt = 1) => {
      try {
        const { data } = await executor({ document: '{ _sdl }' })
        resolve(buildSchema(data._sdl))
      } catch (err) {
        if (attempt >= 10) reject(err)
        setTimeout(() => fetchSchema(attempt + 1), SERVICE_TIMEOUT)
      }
    }

    fetchSchema()
  }),
})

const { name, port } = gatewayService

makeGatewaySchema().then((schema) => startServer({ schema, name, port }))
