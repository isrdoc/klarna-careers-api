import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'
import { makeStichingTypeDefs } from '../utils/index.js'

export default function makeExecSchema({ schema, resolvers }) {
  const { stitchingDirectivesValidator } = stitchingDirectives()

  const typeDefs = makeStichingTypeDefs({ schema })

  const execSchema = makeExecutableSchema({
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs,
    resolvers,
  })

  return execSchema
}
