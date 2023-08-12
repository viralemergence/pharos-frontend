import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from './serverHandlers'

const server = setupServer(...handlers)

server.events.on('request:start', req => {
  console.log('Starting request:', req.method, req.url.href)
})
server.events.on('request:match', req => {
  console.log('%s %s has a handler!', req.method, req.url.href)
})
server.events.on('request:unhandled', req => {
  console.log('%s %s has no handler', req.method, req.url.href)
})

export { server, rest }
