import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const titles = [
  { id: '1', personId: '2', name: 'Engineering Manager', competencyId: '7' },
  { id: '2', personId: '1', name: 'Senior JS Engineer', competencyId: '7' },
]

/* FRONTEND TYPES */
// export interface Title {
//   id: string
//   name: string

//   competency?: Competency | null
//   level?: Level | null
//   impact?: Impact | null
// }

// export interface Person {
//   id: string
//   firstName: string
//   lastName: string

//   story?: Story
//   title?: Title
// }

const schema = `#graphql
  type Title @key(selectionSet: "{ id }") {
    id: ID!
    person: Person!
    name: String!
    competency: Competency!
  }

  type Person @key(selectionSet: "{ id }") {
    id: ID!
    title: Title!
  }

  input PersonKey {
    id: ID!
  }

  type Competency @key(selectionSet: "{ id }") {
    id: ID!
    titles: [Title]
  }

  input CompetencyKey {
    id: ID!
  }

  input CompetencyInput {
    keys: [CompetencyKey!]!
  }

  type Query {
    title(id: ID!): Title @merge(keyField: "id")
    titles(ids: [ID!]!): [Title]! @merge(
      keyField: "id"
      keyArg: "ids"
    )
    _people(keys: [PersonKey!]!): [Person]! @merge
    _competencies(input: CompetencyInput): [Competency]! @merge(keyArg: "input.keys")
    _sdl: String!
  }
`

const resolvers = {
  Title: {
    person: (title) => ({ id: title.personId }),
    competency: (title) => ({ id: title.competencyId }),
  },
  Person: {
    title: (person) =>
      titles.find((title) => title.personId === person.id) ||
      new NotFoundError()({ id: person.personId }),
  },
  Competency: {
    titles: (competency) =>
      titles.filter((title) => title.competencyId === competency.id),
  },
  Query: {
    title: (_root, { id }) =>
      people.find((person) => person.id === id) || new NotFoundError(),
    titles: (_root, { ids }) =>
      ids.map(
        (id) =>
          people.find((person) => person.id === id) || new NotFoundError(),
      ),
    _people: (_root, { keys }) => keys,
    _competencies: (_root, { input }) => input.keys,
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
