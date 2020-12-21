import express from 'express'
import { graphqlHTTP } from 'express-graphql'

export default function startServer({ schema, name, port = 4000 }) {
  const app = express()

  app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

  app.listen(port, () =>
    console.log(`${name} running at http://localhost:${port}/graphql`),
  )
}
