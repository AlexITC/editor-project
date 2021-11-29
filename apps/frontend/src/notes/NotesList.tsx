import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Assignment as AssignmentIcon } from '@mui/icons-material'
import { useNotesList } from './hooks'

interface NotesListProps {
  activeNoteId?: string
}

const NotesList: React.FC<NotesListProps> = ({ activeNoteId }) => {
  const { notes, create, update } = useNotesList()

  return (
    <List>
      {notes.map((note) => (
        <Link href={`/notes/${note.id}`} key={note.id}>
          <ListItemButton selected={note.id === activeNoteId}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary={note.name} />
          </ListItemButton>
        </Link>
      ))}
    </List>
  )
}

export default NotesList