import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const people = [
  { id: '1', firstName: 'Igor', lastName: 'Srdoc' },
  { id: '2', firstName: 'Alexandre', lastName: 'Borel' },
]

/* FRONTEND TYPES */
// export interface Person {
//   id: string
//   firstName: string
//   lastName: string

//   story?: Story
//   title?: Title
// }

const schema = `#graphql
  type Person @key(selectionSet: "{ id }") {
    id: ID!
    firstName: String!
    lastName: String!
  }

  type Query {
    person(id: ID!): Person @merge(keyField: "id")
    people(ids: [ID!]!): [Person]! @merge(
      keyField: "id"
      keyArg: "ids"
    )
    _sdl: String!
  }
`

const resolvers = {
  Query: {
    person: (_root, { id }) =>
      people.find((person) => person.id === id) || new NotFoundError(),
    people: (_root, { ids }) =>
      ids.map(
        (id) =>
          people.find((person) => person.id === id) || new NotFoundError(),
      ),
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
