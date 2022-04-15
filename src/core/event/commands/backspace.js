// @flow
'use strict';

const EditorState = require('EditorState')

function backspace(editorState: EditorState): EditorState {
  console.log('cmd:backspace')

  const removal = editorState.getContent()
  
  return EditorState.push(
    editorState,
    removal,
    true,
    'backspace'
  )
}

module.exports = backspace
