/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useEffect, useState } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { NoteListWsServerEvent, NoteListWsClientCommand, NoteMetadata } from '../../../backend/shared/models'

export const useNotesList = () => {
  const { readyState, lastMessage, sendMessage } = useWebSocket(`ws://localhost:3001/api/notes/ws`)
  const [notes, setNotes] = useState<NoteMetadata[]>([])

  // Send a message when ready on first load
  useEffect(() => {
    if (readyState === ReadyState.OPEN && lastMessage === null) {
      sendMessage('')
    }
  }, [readyState, lastMessage])
  
  const wsEvent = JSON.parse((lastMessage || { data: '{}' }).data) as NoteListWsServerEvent
  useEffect(() => {
    if (wsEvent?.gotNotes) {
      console.log('got notes', wsEvent.gotNotes)
      setNotes(wsEvent.gotNotes)
    } else if (wsEvent?.noteCreated) {
      console.log('note created', wsEvent.noteCreated)
      const note = wsEvent.noteCreated as NoteMetadata
      
      setNotes(n => {
        if (n.map(x => x.id).indexOf(note.id) >= 0) return n
        else return [...n, note]
      })
    } else if (wsEvent?.noteUpdated) {
      console.log('got updated', wsEvent.noteUpdated)
      setNotes(n => {
        return n.map(current => current.id === wsEvent.noteUpdated?.id ? wsEvent.noteUpdated : current)
      })
    } else {
      console.log('got weird event', wsEvent)
    }
    // TODO: The event needs a way to compare its content without encoding it as string
    // Without this, the effect is run after every update because the wsEvent apparently changed
    // just because it is another instance but the content is the same
    //
    // which should allow using wsEvent as a dependency
  }, [lastMessage])

  return {
    notes,
    create: (name: string) => sendMessage(JSON.stringify({ createNote: name } as NoteListWsClientCommand)),
    update: (data: NoteMetadata) => sendMessage(JSON.stringify({ updateNote: data } as NoteListWsClientCommand))
  }
}
