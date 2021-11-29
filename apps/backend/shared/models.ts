import { Node } from 'slate'

export interface NoteMetadata {
    id: string
    name: string
}

// TODO: Use Descendant instead
// import { Descendant } from 'slate'
export interface NoteContent {
    id: string
    content: Node[]
}

// TODO: There is likely a better way to do this, possibly union types
// Represents the events flowing from the server to the client
export interface NoteListWsServerEvent {
    gotNotes?: NoteMetadata[]
    noteCreated?: NoteMetadata
    noteUpdated?: NoteMetadata
}
// Represents the commands flowing from the client to the server
export interface NoteListWsClientCommand {
    createNote?: string
    updateNote?: NoteMetadata
}
