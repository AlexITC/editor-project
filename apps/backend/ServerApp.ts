import cors from 'cors'
import express from 'express'
import { Node } from 'slate';
import { Server } from 'http';
import { SocketIOConnection } from '@slate-collaborative/backend'

import apiRoutes from './routes'
import { AppConfig, NoteContent, SlateCollaborativeParams } from "./models";

export class ServerApp {
    constructor (
        private config: AppConfig,
        private slateCollaborativeParams: SlateCollaborativeParams) {}

    run(): void {
        console.log('Run app')

        const server = express()
            // .use(express.json())
            // .use(express.urlencoded({ extended: false }))
            .use(cors())
            .use('/api', apiRoutes)
            .listen(this.config.port, () => console.log(`Listening on ${this.config.port}`))

        console.log('Attach slate collaborative')
        this.attachSlateCollaborative(server)
    }

    private attachSlateCollaborative(server: Server): SocketIOConnection {
        // TODO: The websocket connection doesn't seem to be working but socket.io falls back to
        // polling which works for now.
        // try replacing server by another port to start a new service and see if that works
        const slateCollaborativeConfig = {
            entry: server, // or specify port to start io server
            defaultValue: this.slateCollaborativeParams.defaultValue,
            saveFrequency: this.slateCollaborativeParams.saveFrequencyMs,
            onAuthRequest: async (_query: any, _socket: any) => {
                console.log('Authorizing client', _query)
                return true
            },
            onDocumentLoad: async (_pathname: string) => {
                // TODO: Extract id
                console.log('onDocumentLoad', _pathname)
                const data = await this.slateCollaborativeParams.loadDocument(_pathname)
                return data?.content || this.slateCollaborativeParams.defaultValue
            },
            onDocumentSave: async (_pathname: string, _doc: Node[]) => {
                // save document
                console.log('onDocumentSave', _pathname)
                const data = new NoteContent(_pathname, _doc)
                return this.slateCollaborativeParams.saveDocument(data)
            }
        }
        
        return new SocketIOConnection(slateCollaborativeConfig)
    }
}
