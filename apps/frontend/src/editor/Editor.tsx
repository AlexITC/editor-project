// @refresh reset // Fixes hot refresh errors in development https://github.com/ianstormtaylor/slate/issues/3477

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Descendant, BaseEditor } from 'slate'
import { withHistory, HistoryEditor } from 'slate-history'
import { handleHotkeys } from './helpers'

import { Editable, withReact, Slate, ReactEditor } from 'slate-react'
import { EditorToolbar } from './EditorToolbar'
import { CustomElement } from './CustomElement'
import { CustomLeaf, CustomText } from './CustomLeaf'

import { withIOCollaboration } from '@slate-collaborative/client'

// Slate suggests overwriting the module to include the ReactEditor, Custom Elements & Text
// https://docs.slatejs.org/concepts/12-typescript
declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface EditorProps {
  initialValue?: Descendant[]
  placeholder?: string
  id: string,
  onEditorConnected?: () => void,
  onEditorDisconnected?: () => void
}

// TODO: Clean up this mess
export const Editor: React.FC<EditorProps> = ({ id, onEditorConnected, onEditorDisconnected, initialValue = [], placeholder }) => {
  const [value, setValue] = useState<Array<Descendant>>(initialValue)
  const renderElement = useCallback(props => <CustomElement {...props} />, [])
  const renderLeaf = useCallback(props => <CustomLeaf {...props} />, [])
  const editor = useMemo(() => {
    const base = withHistory(withReact(createEditor()))
    const slug = 'slug_' + id
    const name = 'name_' + id
  
    const origin = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://localhost:3001'
    const options = {
      docId: '/' + slug,
      cursorData: {
        name
      },
      url: `${origin}/${slug}`,
      connectOpts: {
        query: {
          name,
          token: id,
          slug
        }
      },
      onConnect: () => onEditorConnected,
      onDisconnect: () => onEditorDisconnected
    }
    return withIOCollaboration(base, options)
  }, [])

  useEffect(() => {
    console.log('trying to connect to the editor')
    editor.connect()

    return editor.destroy
  }, [])


  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <EditorToolbar />
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        onKeyDown={handleHotkeys(editor)}

        // The dev server injects extra values to the editr and the console complains
        // so we override them here to remove the message
        autoCapitalize="false"
        autoCorrect="false"
        spellCheck="false"
      />
    </Slate>
  )
}