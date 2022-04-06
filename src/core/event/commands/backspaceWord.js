// @flow
'use strict';

const EditorState = require('EditorState')

function backspaceWord(editorState: EditorState): EditorState {
  console.log('backspace-word')
  
  const content = editorState.getContent()

  return EditorState.push(
    editorState,
    content,
    true,
    'backspace-word'
  )
}

module.exports = backspaceWordxs
