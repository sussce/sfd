// @flow
'use strict';

const EditorState = require('EditorState')

function backspace(editorState: EditorState): EditorState {
  console.log('cmd:backspace')

  const newContent = editorState.getContent()
  
  return EditorState.push(
    editorState,
    newContent,
    true,
    'backspace'
  )
}

module.exports = backspace
