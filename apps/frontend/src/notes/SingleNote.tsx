import React, { useState } from 'react'
import { Editor } from '../editor'

import { Paper, TextField, Badge } from '@mui/material'

interface SingleNoteProps {
  id: string
}

const SingleNote: React.FC<SingleNoteProps> = ({ id }) => {
  const [onlineStatus, setOnlineStatus] = useState<Boolean>(false)

  // TODO: Load note title
  const [noteTitle, setNoteTitle] = useState<string>('title to be loaded')

  return <>
      <Badge color={onlineStatus ? 'success' : 'error'} variant="dot" sx={{ width: '100%' }}>
        { /* TODO: Allow editing the title */ }
        <TextField
          value={noteTitle}
          variant="standard"
          fullWidth={true}
          inputProps={{ style: { fontSize: 32, color: '#666' } }}
          sx={{ mb: 2 }}
        />
      </Badge>
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Editor id={id} onEditorConnected={() => setOnlineStatus(true)} onEditorDisconnected={() => setOnlineStatus(false)} />
      </Paper>
    </>
}

export default SingleNote
