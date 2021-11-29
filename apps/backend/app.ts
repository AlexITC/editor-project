import db from './firebase'

import NoteContentRepository from './repositories/NoteContentRepository'
import NoteMetadataRepository from './repositories/NoteMetadataRepository'
import { AppConfig, NoteContent, SlateCollaborativeParams } from './models'
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
const serverApp = new ServerApp(appConfig, slateCollaborativeParams)
serverApp.run()
