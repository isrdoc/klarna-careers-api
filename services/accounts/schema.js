import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const users = [
  { id: '1', name: 'Ada Lovelace', username: '@ada' },
  { id: '2', name: 'Alan Turing', username: '@complete' },
]

const schema = `#graphql
  type User @key(selectionSet: "{ id }") {
    id: ID!
    name: String!
    username: String!
  }

  type Query {
    me: User
    user(id: ID!): User @merge(keyField: "id")
    _sdl: String!
  }
`

const resolvers = {
  Query: {
    me: () => users[0],
    user: (_root, { id }) =>
      users.find((user) => user.id === id) || new NotFoundError(),
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
