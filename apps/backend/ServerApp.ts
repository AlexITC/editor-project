import cors from 'cors'
import express from 'express'
import expressWs from 'express-ws'
import { Node } from 'slate';
import { Server } from 'http';
import { SocketIOConnection } from '@slate-collaborative/backend'
import * as ws from 'ws';

import apiRoutes from './routes'
import { AppConfig, NoteListWsParams, SlateCollaborativeParams } from './models'
import { NoteContent, NoteListWsClientCommand } from './shared/models'

export class ServerApp {
    constructor (
        private config: AppConfig,
        private slateCollaborativeParams: SlateCollaborativeParams,
        private noteListWsParams: NoteListWsParams) {}

    run(): void {
        console.log('Run app')
        const app = express()
        expressWs(app)
            .app
            .ws('/api/notes/ws', (ws: ws, _req) => {
                console.log('/notes/ws got client')
                this.noteListWsParams.subcribers.join(ws)
                ws.send(JSON.stringify({ text: 'none'}))

                ws.on('close', () => {
                    console.log('disconnected');
                    this.noteListWsParams.subcribers.leave(ws)
                })
                ws.on('message', (msg) => {
                    try {
                        const cmd = JSON.parse(msg.toString()) as NoteListWsClientCommand
                        console.log('message', cmd);
                        this.noteListWsParams.commandHandler(cmd)
                    } catch (error) {
                        // do nothing on purpose
                    }
                });
          })

        const server = app
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
            allowEIO3: true,
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
                const data = { id: _pathname, content: _doc } as NoteContent
                return this.slateCollaborativeParams.saveDocument(data)
            }
        }
        
        return new SocketIOConnection(slateCollaborativeConfig)
    }
}
