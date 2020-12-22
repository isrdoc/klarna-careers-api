import {
  makeExecSchema,
  makeStichingTypeDefs,
  NotFoundError,
} from '../../utils/index.js'

const stories = [
  {
    id: '1',
    personId: '1',
    atKlarnaIcan:
      'I can create and deliver solutions that users are simply excited about.',
    title: 'Senior JS Engineer',
    mission:
      'I use customer insight to create smooth interfaces that make even the most complicated journeys look simple and doable.',
    myIrregularPath:
      'Started via freelance web development with Content Management Systems like Joomla and Wordpress. Found that coding with JavaScript enables more creativity and control for me. Was also teaching in academia, live/online tutorials - which still do - and mentoring programmers. For the last 4 years my drive to solve problems pulled me towards team-leading and product-owning roles. My last role before (hopefully!) starting at Klarna was of a Product Manager where I juggled between business requirements, UX & UI, R&D, IT, marketing and project execution.',
    workingAtKlarna:
      "(I hope that) working at Klarna for me looks like this: My weeks are packed with fast and focused learning through specific project execution. With every day I have a new chance to actively participate in two fields: project planning and delivery. With our great team we try hard to understand how our users think and feel - and then which solutions fit best our business model to deliver them the value they require. The second part is as much as exciting: architecting and developing the solution from start to its earliest possible launch. It's so rewarding to put the pieces (and people) together and make it work!",
    unreasonablePassion: `I'm unreasonably passionate about telling a good story. In code "story" is its architecture. In business, it's products (not the thing on the shelf, but the solution it brings). Among people, it is teamwork.`,
  },
  {
    id: '2',
    personId: '2',
    atKlarnaIcan:
      'I have the autonomy to challenge and create a vision for my product.',
    title: 'Engineering Manager',
    mission:
      "I drive architecture choices and gather skilled people to offer Klarna's payment methods to consumers in physical stores.",
    myIrregularPath:
      'I took my first bend on the irregular path 2 weeks after joining. The recruiters had told me that ‘you will get opportunities here’ - they weren’t wrong. I joined a LEAP (our short-term single-issue focus team) working on creating a new Klarna In-store solution. I applied to become the Competence Lead of the team and was successful. During those first months, I quickly learned that at Klarna, you can share your opinion, and more importantly, you can convince people too. I was able to go on to build the In-store application for consumers and for retailers. 2 years later, I am now Accountable Lead for my team and I relish the role I play in creating great products and supporting great people.',
    workingAtKlarna:
      'With great thanks to our operating model, you really get the autonomy that lets you develop your sense of ownership, challenge, get into the details, and have a vision for your work. I regularly get the opportunity to defend our vision for In-store in front of management or try to convey to what is seen as the wider In-store strategy. This has given me a lot of opportunities to sharpen my communication skills. So there are lots of things to like at Klarna, but in the end, I’ve stayed because of the operating model.',
    unreasonablePassion:
      'Two things - the first is how to get systems to work together. From people to IT systems, I love how we can build things on top of other things and get a ‘wow it works’ feeling. Secondly, I love physical copies of video games. Nowadays everything is digital so it’s amazing to get that rare indie game that finally had a limited-run edition.',
  },
]

/* FRONTEND TYPES */
// export interface Story {
//   id: string
//   atKlarnaIcan: string
// TODO: "title" should be extracted
//   title: Title['name']
//   mission: string
//   myIrregularPath: string
//   workingAtKlarna: string
//   unreasonablePassion: string
// TODO: all below
//   aDayInMyLife: ADayInMyLife
//   takesOnKlarna: TakesOnKlarna
//   images: StoryImages
// }

// export interface ADayInMyLife {
//   am: string[]
//   pm: string[]
//   evening: string[]
// }

// export interface TakesOnKlarna {
//   leadershipPrinciple: string
//   bestTaskOfTheDay: string
//   myTeamDescription: string
// }

// export interface StoryImages {
//   main: string
//   more: string[]
// }

// export interface Person {
//   id: string
//   firstName: string
//   lastName: string

//   story?: Story
//   title?: Title
// }

const schema = `#graphql
  type Story @key(selectionSet: "{ id }") {
    id: ID!
    person: Person!
    atKlarnaIcan: String!
    title: String!
    mission: String!
    myIrregularPath: String!
    workingAtKlarna: String!
    unreasonablePassion: String!
  }

  type Person @key(selectionSet: "{ id }") {
    id: ID!
    story: Story!
  }

  input PersonKey {
    id: ID!
  }

  type Query {
    story(id: ID!): Story @merge(keyField: "id")
    stories(ids: [ID!]!): [Story]! @merge(
      keyField: "id"
      keyArg: "ids"
    )
    _people(keys: [PersonKey!]!): [Person]! @merge
    _sdl: String!
  }
`

const resolvers = {
  Story: {
    person: (story) => ({ id: story.personId }),
  },
  Person: {
    story: (person) =>
      stories.find((story) => story.personId === person.id) ||
      new NotFoundError()({ id: person.personId }),
  },
  Query: {
    story: (_root, { id }) =>
      stories.find((story) => story.id === id) || new NotFoundError(),
    stories: (_root, { ids }) =>
      ids.map(
        (id) => stories.find((story) => story.id === id) || new NotFoundError(),
      ),
    _people: (_root, { keys }) => keys,
    _sdl: () => typeDefs,
  },
}

const typeDefs = makeStichingTypeDefs({ schema })
const executableSchema = makeExecSchema({ schema, resolvers })

export default executableSchema
