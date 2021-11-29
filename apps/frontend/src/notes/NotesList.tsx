import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import TextField from '@mui/material/TextField';
import { Assignment as AssignmentIcon } from '@mui/icons-material'
import { useNotesList } from './hooks'

interface NotesListProps {
  activeNoteId?: string
}

const NotesList: React.FC<NotesListProps> = ({ activeNoteId }) => {
  const { notes, create, update } = useNotesList()
  const [newName, setNewName] = useState<string>('')
  const [creationError, setCreationError] = useState<string>('')
  const [creating, setCreating] = useState<Boolean>(false)
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newName.trim().length === 0) {
      setCreationError('A non-blank name is required')
      return;
    }

    setCreating(true)
    setCreationError('')
    try {
      create(newName)
    } catch (e) {
      setCreationError('Unexpected error')
    } finally {
      setCreating(false)
    }
  }

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setNewName(newValue)
    setCreationError('')
  }

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
      <form onSubmit={submit}>
        <TextField
            required
            label="New note"
            value={newName}
            error={creationError.length > 0}
            helperText={creationError}
            onChange={handleNewNameChange}
          />
      </form>
    </List>
  )
}

export default NotesList