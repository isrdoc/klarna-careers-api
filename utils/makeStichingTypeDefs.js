import { stitchingDirectives } from '@graphql-tools/stitching-directives'

export default function makeStichingTypeDefs({ schema }) {
  const {
    stitchingDirectivesTypeDefs,
    stitchingDirectivesValidator,
  } = stitchingDirectives()

  const typeDefs = `
    ${stitchingDirectivesTypeDefs}
    ${schema}
  `

  return typeDefs
}
