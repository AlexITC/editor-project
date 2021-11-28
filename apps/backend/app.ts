import cors from 'cors'
import { SocketIOConnection } from '@slate-collaborative/backend'
import express from 'express'

import apiRoutes from './routes'

const defaultValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Hello collaborator!'
      }
    ]
  }
]

const PORT = process.env.PORT || 3001

const server = express()
  // .use(express.json())
  // .use(express.urlencoded({ extended: false }))
  .use(cors())
  .use('/api', apiRoutes)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))

// TODO: The websocket connection doesn't seem to be working but socket.io falls back to
// polling which works for now.
const config = {
  entry: server, // or specify port to start io server
  defaultValue,
  saveFrequency: 2000,
  onAuthRequest: async (_query: any, _socket: any) => {
    // some query validation
    console.log('onAuthRequest', _query)
    return true
  },
  onDocumentLoad: async (_pathname: any) => {
    // request initial document ValueJSON by pathnme
    console.log('onDocumentLoad', _pathname)
    return defaultValue
  },
  onDocumentSave: async (_pathname: any, _doc: any) => {
    // save document
    console.log('onDocumentSave', _pathname)
  }
}

const connection = new SocketIOConnection(config)

export {}
