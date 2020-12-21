import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const products = [
  { upc: '1', name: 'Table', price: 899, weight: 100 },
  { upc: '2', name: 'Couch', price: 1299, weight: 1000 },
  { upc: '3', name: 'Chair', price: 54, weight: 50 },
]

const schema = `#graphql
  type Product @key(selectionSet: "{ upc }") {
    upc: ID!
    name: String!
    price: Int!
    weight: Int!
  }

  type Query {
    topProducts(first: Int = 2): [Product]!
    products(upcs: [ID!]!, order: String): [Product]! @merge(
      keyField: "upc"
      keyArg: "upcs"
      additionalArgs: """ order: "price" """
    )
    _sdl: String!
  }
`

const resolvers = {
  Query: {
    topProducts: (_root, args) => products.slice(0, args.first),
    products: (_root, { upcs }) =>
      upcs.map(
        (upc) =>
          products.find((product) => product.upc === upc) ||
          new NotFoundError(),
      ),
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
