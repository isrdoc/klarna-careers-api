import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const competencies = [
  {
    id: '1',
    name: 'Accounting',
    tagline:
      'Optimizing reporting with analytical skill and organizational know-how.',
  },
  {
    id: '2',
    name: 'Analytics',
    tagline:
      'Ensuring that we deliver value to consumers, our merchants, and our investors.',
  },
  {
    id: '3',
    name: 'Commercial',
    tagline:
      'Seeking out new opportunities and developing existing relationships with retailers.',
  },
  {
    id: '4',
    name: 'Data Science',
    tagline:
      'Keeping our products relevant, safe and the first choice for our customers.',
  },
  {
    id: '5',
    name: 'Solutions & Delivery',
    tagline: "Guiding a retailer's first interaction to first transaction.",
  },
  {
    id: '6',
    name: 'Design',
    tagline:
      'Strategizing, conceptualizing, and designing innovative ideas and products.',
  },
  {
    id: '7',
    name: 'Engineering',
    tagline:
      'An inspired, customer focused community, dedicated to crafting solutions that redefine our industry.',
  },
  {
    id: '8',
    name: 'Legal',
    tagline:
      'Remaining compliant and adhering to national and international law.',
  },
  {
    id: '9',
    name: 'Marketing',
    tagline:
      'Communicating the ease and simplicity of our shopping experience.',
  },
  {
    id: '10',
    name: 'Org Development',
    tagline:
      'Pursuing productivity and excellence across every part of our business.',
  },
  {
    id: '11',
    name: 'Product',
    tagline:
      'Meeting the needs of our customers and surpassing expectations of shopping.',
  },
  {
    id: '12',
    name: 'Service Delivery',
    tagline:
      'Providing expectation-defying support to meet the needs of our customers.',
  },
]

/* FRONTEND TYPES */
// export interface Competency {
//   id: string
//   name: string
//   tagline: string
// }

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
  type Competency @key(selectionSet: "{ id }") {
    id: ID!
    name: String!
    tagline: String!
  }

  type Query {
    competency(id: ID!): Competency @merge(keyField: "id")
    competencies(ids: [ID!]!): [Competency]! @merge(
      keyField: "id"
      keyArg: "ids"
    )
    allCompetencies: [Competency]!
    _sdl: String!
  }
`

const resolvers = {
  Query: {
    competency: (_root, { id }) =>
      competencies.find((competency) => competency.id === id) ||
      new NotFoundError(),
    competencies: (_root, { ids }) =>
      ids.map(
        (id) =>
          competencies.find((competency) => competency.id === id) ||
          new NotFoundError(),
      ),
    allCompetencies: () => competencies,
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
