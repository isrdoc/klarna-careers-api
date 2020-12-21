import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const inventories = [
  { upc: '1', unitsInStock: 3 },
  { upc: '2', unitsInStock: 0 },
  { upc: '3', unitsInStock: 5 },
]

const schema = `#graphql
  type Product @key(selectionSet: "{ upc }") {
    upc: ID!
    inStock: Boolean
    shippingEstimate: Int @computed(selectionSet: "{ price weight }")
  }

  scalar _Key

  type Query {
    mostStockedProduct: Product
    _products(keys: [_Key!]!): [Product]! @merge
    _sdl: String!
  }
`

const resolvers = {
  Product: {
    inStock: (product) => product.unitsInStock > 0,
    shippingEstimate(product) {
      // free for expensive items, otherwise estimate based on weight
      return product.price > 1000 ? 0 : Math.round(product.weight * 0.5)
    },
  },
  Query: {
    mostStockedProduct: () =>
      inventories.reduce(
        (acc, i) => (acc.unitsInStock >= i.unitsInStock ? acc : i),
        inventories[0],
      ),
    _products: (_root, { keys }) =>
      keys.map((key) => {
        const inventory = inventories.find((i) => i.upc === key.upc)
        return inventory ? { ...key, ...inventory } : new NotFoundError()
      }),
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
