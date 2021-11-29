import db from './firebase'
import * as ws from 'ws';

import NoteContentRepository from './repositories/NoteContentRepository'
import NoteMetadataRepository from './repositories/NoteMetadataRepository'
import { AppConfig, NoteListWsParams, SlateCollaborativeParams, WsSubcribers } from './models'
import { NoteContent, NoteListWsClientCommand, NoteListWsServerEvent, NoteMetadata } from './shared/models'
import { ServerApp } from './ServerApp'

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

const port = parseInt(process.env.PORT || '3001')
const noteMetadataRepository = new NoteMetadataRepository(db)
const noteContentRepository = new NoteContentRepository(db)
const loadDocument = (id: string) => noteContentRepository.find(id)
const saveDocument = (data: NoteContent) => noteContentRepository.save(data)

const appConfig = new AppConfig(port)
const slateCollaborativeParams = new SlateCollaborativeParams(2000, defaultValue, loadDocument, saveDocument)

// when a websocket client gets connected, let's share the existing notes
const onNewSubscriber = async (ws: ws) => {
  const notes = await noteMetadataRepository.list()
  const msg =  { gotNotes: notes } as NoteListWsServerEvent
  ws.send(JSON.stringify(msg))
}

const wsSubcribers = new WsSubcribers(onNewSubscriber)
const commandHandler = async (cmd: NoteListWsClientCommand) => {
  let event: NoteListWsServerEvent
  if (cmd.createNote) {
    console.log('client: create note', cmd.createNote)
    const id = await noteMetadataRepository.create(cmd.createNote)
    const note = { id, name: cmd.createNote } as NoteMetadata
    event = { noteCreated: note } as NoteListWsServerEvent
  } else if (cmd.updateNote) {
    console.log('client: update note', cmd.updateNote)
    await noteMetadataRepository.update(cmd.updateNote.id, cmd.updateNote.name)
    event = { noteUpdated: cmd.updateNote } as NoteListWsServerEvent
  } else {
    console.log('unexpected command', cmd)
    throw Error('Unexpected command')
  }

  // notify subscribers
  const msg = JSON.stringify(event)
  console.log('notifying subscribers', wsSubcribers.getSubscribers.length)
  wsSubcribers.getSubscribers.forEach(ws => ws.send(msg))
}

const noteListWsParams = new NoteListWsParams(wsSubcribers, commandHandler)
const serverApp = new ServerApp(appConfig, slateCollaborativeParams, noteListWsParams)
serverApp.run()
