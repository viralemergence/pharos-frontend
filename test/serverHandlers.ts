import { rest } from 'msw' // msw supports graphql too!

const handlers = [
  rest.get(
    `${process.env.GATSBY_API_URL}/metadata-for-published-records`,
    async (_req, _res, _ctx) => {
      console.log('metadata')
    }
  ),
]

export { handlers }
