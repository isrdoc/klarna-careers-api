import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchingDirectives } from '@graphql-tools/stitching-directives'

export default function makeExecSchema({ schema, resolvers }) {
  const {
    stitchingDirectivesTypeDefs,
    stitchingDirectivesValidator,
  } = stitchingDirectives()

  const typeDefs = `
    ${stitchingDirectivesTypeDefs}
    ${schema}
  `

  const execSchema = makeExecutableSchema({
    schemaTransforms: [stitchingDirectivesValidator],
    typeDefs,
    resolvers,
  })

  return execSchema
}
